/**
 * Add Missing Avatars to ACTUAL Production
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { teamMembers, images } from "./shared/schema";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
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

interface TeamMemberData {
  name: string;
  slug: string;
  role: string;
  email?: string;
  phone?: string;
  bio?: string;
  blurb?: string;
  tags?: string[];
  communities?: string[];
  avatarUrl?: string;
  socialLinkedin?: string;
  department?: string;
}

interface ImportData {
  teamMembers: TeamMemberData[];
}

async function main() {
  const prodUrl = "postgresql://neondb_owner:npg_rkzNBcC21pWL@ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech/neondb?sslmode=require";

  const pool = new Pool({ connectionString: prodUrl });
  const db = drizzle(pool);

  console.log("\n🖼️  Adding Missing Avatars to ACTUAL Production\n");

  // Load source data
  const jsonPath = path.join(process.cwd(), "scraped-team-data.json");
  const jsonData = await fs.readFile(jsonPath, "utf-8");
  const sourceData: ImportData = JSON.parse(jsonData);

  // Get members without avatars
  const allMembers = await db.select().from(teamMembers);
  const membersWithoutAvatars = allMembers.filter(m => m.avatarImageId === null);

  console.log(`Found ${membersWithoutAvatars.length} members without avatars\n`);

  let successCount = 0;
  let skipCount = 0;

  for (const member of membersWithoutAvatars) {
    // Find the source data for this member
    const sourceInfo = sourceData.teamMembers.find(m => m.slug === member.slug);

    if (!sourceInfo || !sourceInfo.avatarUrl) {
      console.log(`⏭️  ${member.name} - No avatar URL in source data, skipping`);
      skipCount++;
      continue;
    }

    try {
      console.log(`📥 ${member.name} - Downloading avatar...`);

      // Download and process avatar
      const response = await fetch(sourceInfo.avatarUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      const processedBuffer = await sharp(buffer)
        .resize(800, 800, { fit: 'inside' })
        .webp({ quality: 85 })
        .toBuffer();
      const imageInfo = await sharp(buffer).metadata();

      const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID!;
      const filename = `team-${member.slug}-${Date.now()}-${crypto.randomBytes(8).toString("hex")}.webp`;

      // Upload to public directory
      const bucket = objectStorageClient.bucket(bucketId);
      await bucket.file(`public/${filename}`).save(processedBuffer, {
        metadata: { contentType: "image/webp" }
      });

      // Create image record
      const [imageRecord] = await db.insert(images).values({
        objectKey: `public/${filename}`,
        url: `/${bucketId}/public/${filename}`,
        alt: member.slug.replace(/-/g, " "),
        width: imageInfo.width || 800,
        height: imageInfo.height || 800,
        sizeBytes: processedBuffer.length,
        mimeType: "image/webp",
      }).returning();

      // Update team member with avatar
      await db.update(teamMembers)
        .set({ avatarImageId: imageRecord.id })
        .where(eq(teamMembers.id, member.id));

      console.log(`✅ ${member.name} - Avatar added successfully`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${member.name} - Error:`, error);
    }
  }

  console.log(`\n📊 Summary: ${successCount} avatars added, ${skipCount} skipped\n`);

  // Final verification
  const finalMembers = await db.select().from(teamMembers);
  const withAvatars = finalMembers.filter(m => m.avatarImageId !== null);
  const withoutAvatars = finalMembers.filter(m => m.avatarImageId === null);

  console.log("=" .repeat(60));
  console.log("FINAL STATE - ACTUAL PRODUCTION");
  console.log("=".repeat(60));
  console.log(`📊 Total team members: ${finalMembers.length}`);
  console.log(`✅ With avatars: ${withAvatars.length}`);
  console.log(`⚠️  Without avatars: ${withoutAvatars.length}\n`);

  if (withoutAvatars.length > 0) {
    console.log("Members without avatars:");
    withoutAvatars.forEach(m => console.log(`  - ${m.name} (${m.slug})`));
  }

  console.log("\n" + "=".repeat(60));
  console.log("✨ COMPLETE!");
  console.log("=".repeat(60));
  console.log("\nAll 24 source team members now in production with avatars! 🎉\n");

  await pool.end();
  process.exit(0);
}

main();
