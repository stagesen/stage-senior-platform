/**
 * Import Floor Plans to Production Database
 *
 * This script:
 * 1. Downloads floor plan images from CDN
 * 2. Uploads them to object storage
 * 3. Creates floor plan records with image references
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { floorPlans, communities, images, floorPlanImages } from './shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs/promises';
import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import crypto from "crypto";

neonConfig.webSocketConstructor = ws;

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

interface FloorPlanData {
  name: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number | null;
  description: string;
  startingRateDisplay: string;
  highlights: string[];
  imageUrls: string[];
  pdfUrl: string | null;
  accessible: boolean | null;
  availability: string;
  careType?: string;
}

interface ScrapedData {
  "golden-pond": FloorPlanData[];
  "gardens-at-columbine": FloorPlanData[];
  "gardens-on-quail": FloorPlanData[];
}

// Map community slugs to database community IDs
const communitySlugMap: Record<string, string> = {
  "golden-pond": "golden-pond",
  "gardens-at-columbine": "gardens-at-columbine",
  "gardens-on-quail": "the-gardens-on-quail",
};

async function uploadImage(imageUrl: string, planSlug: string): Promise<string | null> {
  try {
    console.log(`    Downloading image: ${imageUrl}`);

    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.log(`    ⚠️  Failed to download (HTTP ${response.status})`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Process image
    const processedBuffer = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside' })
      .webp({ quality: 85 })
      .toBuffer();

    const imageInfo = await sharp(buffer).metadata();

    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID!;
    const filename = `floor-plan-${planSlug}-${Date.now()}-${crypto.randomBytes(8).toString("hex")}.webp`;

    // Upload to public directory
    const bucket = objectStorageClient.bucket(bucketId);
    await bucket.file(`public/${filename}`).save(processedBuffer, {
      metadata: { contentType: "image/webp" }
    });

    console.log(`    ✅ Uploaded: ${filename}`);

    return `/${bucketId}/public/${filename}`;
  } catch (error) {
    console.error(`    ❌ Error processing image:`, error);
    return null;
  }
}

async function main() {
  const prodUrl = "postgresql://neondb_owner:npg_rkzNBcC21pWL@ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech/neondb?sslmode=require";

  const pool = new Pool({ connectionString: prodUrl });
  const db = drizzle(pool);

  console.log('\n🏢 Importing Floor Plans to Production\n');

  // Load scraped data
  const scrapedDataJson = await fs.readFile('floor-plans-scraped.json', 'utf-8');
  const scrapedData: ScrapedData = JSON.parse(scrapedDataJson);

  let totalPlans = 0;
  let successCount = 0;
  let skipCount = 0;

  for (const [communitySlug, plans] of Object.entries(scrapedData)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${communitySlug.toUpperCase()}`);
    console.log('='.repeat(60));

    // Get community ID
    const dbSlug = communitySlugMap[communitySlug] || communitySlug;
    const [community] = await db
      .select()
      .from(communities)
      .where(eq(communities.slug, dbSlug))
      .limit(1);

    if (!community) {
      console.log(`❌ Community not found: ${dbSlug}`);
      continue;
    }

    console.log(`Found community: ${community.name} (${community.id})\n`);

    for (const plan of plans) {
      totalPlans++;
      console.log(`Processing: ${plan.name}`);

      try {
        // Create plan slug
        const planSlug = plan.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Check if plan already exists
        const [existing] = await db
          .select()
          .from(floorPlans)
          .where(eq(floorPlans.planSlug, planSlug))
          .limit(1);

        if (existing) {
          console.log(`  ⏭️  Already exists, skipping`);
          skipCount++;
          continue;
        }

        // Upload first image as main image
        let mainImageId: string | null = null;
        if (plan.imageUrls.length > 0) {
          const imageUrl = await uploadImage(plan.imageUrls[0], planSlug);

          if (imageUrl) {
            const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID!;
            const imageInfo = await sharp(
              Buffer.from(await (await fetch(plan.imageUrls[0])).arrayBuffer())
            ).metadata();

            const [imageRecord] = await db.insert(images).values({
              objectKey: imageUrl.replace(`/${bucketId}/`, ''),
              url: imageUrl,
              alt: plan.name,
              width: imageInfo.width || 800,
              height: imageInfo.height || 600,
              mimeType: "image/webp",
            }).returning();

            mainImageId = imageRecord.id;
          }
        }

        // Create floor plan record
        const [floorPlan] = await db.insert(floorPlans).values({
          communityId: community.id,
          planSlug: planSlug,
          name: plan.name,
          bedrooms: plan.bedrooms,
          bathrooms: plan.bathrooms.toString(),
          squareFeet: plan.squareFeet,
          description: plan.description,
          startingRateDisplay: plan.startingRateDisplay,
          highlights: plan.highlights,
          imageId: mainImageId,
          accessible: plan.accessible || false,
          availability: plan.availability || "available",
          active: true,
        }).returning();

        // Upload and link additional images
        if (plan.imageUrls.length > 1) {
          for (let i = 1; i < plan.imageUrls.length; i++) {
            const imageUrl = await uploadImage(plan.imageUrls[i], `${planSlug}-${i}`);

            if (imageUrl) {
              const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID!;
              const imageInfo = await sharp(
                Buffer.from(await (await fetch(plan.imageUrls[i])).arrayBuffer())
              ).metadata();

              const [imageRecord] = await db.insert(images).values({
                objectKey: imageUrl.replace(`/${bucketId}/`, ''),
                url: imageUrl,
                alt: `${plan.name} - Image ${i + 1}`,
                width: imageInfo.width || 800,
                height: imageInfo.height || 600,
                mimeType: "image/webp",
              }).returning();

              // Link to floor plan
              await db.insert(floorPlanImages).values({
                floorPlanId: floorPlan.id,
                imageId: imageRecord.id,
                sortOrder: i,
              });
            }
          }
        }

        console.log(`  ✅ Imported with ${plan.imageUrls.length} image(s)`);
        successCount++;
      } catch (error) {
        console.error(`  ❌ Error:`, error);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`📊 Total floor plans processed: ${totalPlans}`);
  console.log(`✅ Successfully imported: ${successCount}`);
  console.log(`⏭️  Skipped (already exist): ${skipCount}`);
  console.log();

  console.log('='.repeat(60));
  console.log('✨ FLOOR PLAN IMPORT COMPLETE!');
  console.log('='.repeat(60));
  console.log('\nAll floor plans and images imported to production! 🎉\n');

  await pool.end();
  process.exit(0);
}

main();
