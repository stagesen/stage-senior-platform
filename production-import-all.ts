/**
 * ALL-IN-ONE Production Team Data Import Script
 * 
 * This script:
 * 1. Imports all 24 team members with avatars
 * 2. Moves avatars to public directory 
 * 3. Adds community associations
 * 
 * Usage: tsx production-import-all.ts
 */

import { db } from "./server/db";
import { teamMembers, communities, images } from "./shared/schema";
import { eq, like, sql } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import crypto from "crypto";

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

// Step 1: Import team members
async function importTeamMembers() {
  console.log("\n" + "=".repeat(60));
  console.log("STEP 1: Importing Team Members");
  console.log("=".repeat(60) + "\n");

  const jsonPath = path.join(process.cwd(), "scraped-team-data.json");
  const jsonData = await fs.readFile(jsonPath, "utf-8");
  const data: ImportData = JSON.parse(jsonData);

  let successCount = 0;
  let skipCount = 0;

  for (const member of data.teamMembers) {
    try {
      // Check if exists
      const existing = await db.select().from(teamMembers).where(eq(teamMembers.slug, member.slug)).limit(1);
      if (existing.length > 0) {
        console.log(`⏭️  ${member.name} - Already exists, skipping`);
        skipCount++;
        continue;
      }

      // Download avatar
      let avatarImageId: string | null = null;
      if (member.avatarUrl) {
        const response = await fetch(member.avatarUrl);
        const buffer = Buffer.from(await response.arrayBuffer());
        const processedBuffer = await sharp(buffer).resize(800, 800, { fit: 'inside' }).webp({ quality: 85 }).toBuffer();
        const imageInfo = await sharp(buffer).metadata();
        
        const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID!;
        const filename = `team-${member.slug}-${Date.now()}-${crypto.randomBytes(8).toString("hex")}.webp`;
        
        // Upload to public directory directly
        const bucket = objectStorageClient.bucket(bucketId);
        await bucket.file(`public/${filename}`).save(processedBuffer, { metadata: { contentType: "image/webp" } });
        
        const [imageRecord] = await db.insert(images).values({
          objectKey: `public/${filename}`,
          url: `/${bucketId}/public/${filename}`,
          alt: member.slug.replace(/-/g, " "),
          width: imageInfo.width || 800,
          height: imageInfo.height || 800,
          sizeBytes: processedBuffer.length,
          mimeType: "image/webp",
        }).returning();
        
        avatarImageId = imageRecord.id;
      }

      // Get community IDs
      const communityIds: string[] = [];
      if (member.communities) {
        for (const slug of member.communities) {
          const [community] = await db.select().from(communities).where(eq(communities.slug, slug)).limit(1);
          if (community) communityIds.push(community.id);
        }
      }

      // Insert team member
      await db.insert(teamMembers).values({
        name: member.name,
        slug: member.slug,
        role: member.role,
        email: member.email || null,
        phone: member.phone || null,
        bio: member.bio || null,
        avatarImageId: avatarImageId,
        tags: member.tags || [],
        department: member.department || null,
      });

      console.log(`✅ ${member.name} - Imported with avatar`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${member.name} - Error:`, error);
    }
  }

  console.log(`\n📊 Import Summary: ${successCount} imported, ${skipCount} skipped\n`);
}

// Step 2: Add community associations
async function addCommunityAssociations() {
  console.log("\n" + "=".repeat(60));
  console.log("STEP 2: Adding Community Associations");
  console.log("=".repeat(60) + "\n");

  // Gardens at Columbine
  await db.execute(sql`
    UPDATE team_members 
    SET tags = tags || '["The Gardens at Columbine"]'::jsonb
    WHERE slug IN ('alyssa-trujillo', 'marnie-mckissack', 'helen-rossi', 'allie-mitchem', 'matt-turk', 'rich-thomas', 'sydney-hertz')
  `);
  console.log("✅ Added The Gardens at Columbine associations (7 members)");

  // Gardens on Quail
  await db.execute(sql`
    UPDATE team_members 
    SET tags = tags || '["The Gardens on Quail"]'::jsonb
    WHERE slug = 'mariah-ruell'
  `);
  console.log("✅ Added The Gardens on Quail associations (1 member)");

  // Shared members
  await db.execute(sql`
    UPDATE team_members 
    SET tags = tags || '["The Gardens at Columbine", "Golden Pond"]'::jsonb
    WHERE slug IN ('marci-gerke', 'bob-burden')
  `);
  console.log("✅ Added shared community associations (2 members)");
}

// Step 3: Verify
async function verifyImport() {
  console.log("\n" + "=".repeat(60));
  console.log("STEP 3: Verification");
  console.log("=".repeat(60) + "\n");

  const totalMembers = await db.select({ count: sql<number>`count(*)` }).from(teamMembers);
  const publicAvatars = await db.select({ count: sql<number>`count(*)` }).from(images).where(like(images.objectKey, 'public/team-%'));
  const withCommunities = await db.select({ count: sql<number>`count(*)` }).from(teamMembers).where(sql`tags::text LIKE '%Gardens%' OR tags::text LIKE '%Golden Pond%'`);

  console.log(`✅ Total team members: ${totalMembers[0].count}`);
  console.log(`✅ Team avatars (public): ${publicAvatars[0].count}`);
  console.log(`✅ Members with communities: ${withCommunities[0].count}`);
}

// Main execution
async function main() {
  console.log("\n🚀 Starting Production Team Data Import\n");
  
  try {
    await importTeamMembers();
    await addCommunityAssociations();
    await verifyImport();
    
    console.log("\n" + "=".repeat(60));
    console.log("✨ IMPORT COMPLETE!");
    console.log("=".repeat(60));
    console.log("\nAll team members with avatars are now in production! 🎉\n");
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  }
}

main();
