/**
 * Team Data Import Script
 * 
 * This script imports team member data from scraped-team-data.json into the database.
 * It handles:
 * - Downloading and storing avatar images from external URLs
 * - Matching community slugs to database IDs
 * - Creating team member records with all associations
 * 
 * Usage:
 *   tsx import-team-data.ts
 * 
 * Prerequisites:
 * - Database connection configured
 * - Object storage setup for images
 * - scraped-team-data.json file present
 */

import { db } from "./server/db";
import { teamMembers, communities, images } from "./shared/schema";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import crypto from "crypto";

// Initialize the object storage client using Replit's sidecar configuration
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

async function downloadAndStoreImage(url: string, slugName: string): Promise<string | null> {
  try {
    console.log(`  Downloading avatar from: ${url.substring(0, 60)}...`);
    
    // Download image from URL
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  Failed to download image: ${response.statusText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process with sharp to get dimensions and optimize
    const imageInfo = await sharp(buffer).metadata();
    const processedBuffer = await sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString("hex");
    const filename = `team-${slugName}-${timestamp}-${randomString}.webp`;

    // Get environment variables
    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    const privateDir = process.env.PRIVATE_OBJECT_DIR;
    
    if (!bucketId || !privateDir) {
      console.error("  Object storage not configured");
      return null;
    }

    // Upload to private directory
    const pathParts = privateDir.split("/");
    const objectKey = pathParts.slice(2).join("/") + "/" + filename; // Remove leading / and bucket name
    
    const bucket = objectStorageClient.bucket(bucketId);
    const file = bucket.file(objectKey);
    
    await file.save(processedBuffer, {
      metadata: {
        contentType: "image/webp",
      },
    });

    // Generate URL path
    const privateDirName = pathParts.pop() || ".private";
    const imageUrl = `/${bucketId}/${privateDirName}/${filename}`;

    // Create image record in database
    const [imageRecord] = await db.insert(images).values({
      objectKey: `${privateDirName}/${filename}`,
      url: imageUrl,
      alt: slugName.replace(/-/g, " "),
      width: imageInfo.width || 800,
      height: imageInfo.height || 800,
      sizeBytes: processedBuffer.length,
      mimeType: "image/webp",
    }).returning();

    console.log(`  ✓ Stored avatar (ID: ${imageRecord.id})`);
    return imageRecord.id;
  } catch (error) {
    console.error(`  ✗ Error processing image:`, error);
    return null;
  }
}

async function getCommunityIdBySlug(slug: string): Promise<string | null> {
  const [community] = await db
    .select()
    .from(communities)
    .where(eq(communities.slug, slug))
    .limit(1);
  
  return community?.id || null;
}

async function importTeamMembers() {
  try {
    console.log("🚀 Starting team member import...\n");

    // Read the scraped data
    const jsonPath = path.join(process.cwd(), "scraped-team-data.json");
    const jsonData = await fs.readFile(jsonPath, "utf-8");
    const data: ImportData = JSON.parse(jsonData);

    console.log(`Found ${data.teamMembers.length} team members to import\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const member of data.teamMembers) {
      try {
        console.log(`\nProcessing: ${member.name} (${member.role})`);

        // Check if team member already exists
        const existing = await db
          .select()
          .from(teamMembers)
          .where(eq(teamMembers.slug, member.slug))
          .limit(1);

        if (existing.length > 0) {
          console.log(`  ⚠️  Team member already exists, skipping`);
          continue;
        }

        // Download and store avatar image if URL provided
        let avatarImageId: string | null = null;
        if (member.avatarUrl) {
          avatarImageId = await downloadAndStoreImage(member.avatarUrl, member.slug);
        }

        // Get community IDs from slugs
        const communityIds: string[] = [];
        if (member.communities && member.communities.length > 0) {
          for (const communitySlug of member.communities) {
            const communityId = await getCommunityIdBySlug(communitySlug);
            if (communityId) {
              communityIds.push(communityId);
            } else {
              console.log(`  ⚠️  Community not found: ${communitySlug}`);
            }
          }
        }

        // Insert team member
        const [newMember] = await db.insert(teamMembers).values({
          name: member.name,
          slug: member.slug,
          role: member.role,
          email: member.email || null,
          phone: member.phone || null,
          bio: member.bio || null,
          blurb: member.blurb || null,
          avatarImageId: avatarImageId,
          tags: member.tags || [],
          communityIds: communityIds,
          socialLinkedin: member.socialLinkedin || null,
          department: member.department || null,
        }).returning();

        console.log(`  ✓ Created team member: ${newMember.name} (ID: ${newMember.id})`);
        if (communityIds.length > 0) {
          console.log(`    - Associated with ${communityIds.length} communities`);
        }
        successCount++;

      } catch (error) {
        console.error(`  ✗ Error importing ${member.name}:`, error);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`\n✅ Import complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total: ${data.teamMembers.length}\n`);

  } catch (error) {
    console.error("Fatal error during import:", error);
    process.exit(1);
  }
}

// Run the import
importTeamMembers()
  .then(() => {
    console.log("Import script finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Import script failed:", error);
    process.exit(1);
  });
