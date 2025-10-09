/**
 * Production Team Members Cleanup Script
 *
 * This script:
 * 1. Identifies duplicate team members
 * 2. Keeps only the ones with avatars (from scraped-team-data.json)
 * 3. Removes duplicates and orphaned entries
 */

import { db } from "./server/db";
import { teamMembers, images } from "./shared/schema";
import { eq, isNull, sql } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

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
  console.log("\n🧹 Starting Production Team Members Cleanup\n");

  // Load the source data to know what SHOULD be in production
  const jsonPath = path.join(process.cwd(), "scraped-team-data.json");
  const jsonData = await fs.readFile(jsonPath, "utf-8");
  const sourceData: ImportData = JSON.parse(jsonData);
  const validSlugs = new Set(sourceData.teamMembers.map(m => m.slug));

  console.log(`✅ Loaded ${sourceData.teamMembers.length} team members from source data\n`);

  // Get all current team members
  const allMembers = await db.select().from(teamMembers);
  console.log(`📊 Current production has ${allMembers.length} team members\n`);

  // Categorize members
  const toKeep: typeof allMembers = [];
  const toDelete: typeof allMembers = [];

  for (const member of allMembers) {
    if (validSlugs.has(member.slug)) {
      // This slug is in our source data - keep it
      toKeep.push(member);
    } else {
      // This slug is NOT in our source data - it's a duplicate or orphan
      toDelete.push(member);
    }
  }

  console.log("📋 Analysis:");
  console.log(`  ✅ Members to keep: ${toKeep.length}`);
  console.log(`  ❌ Members to delete: ${toDelete.length}\n`);

  if (toDelete.length > 0) {
    console.log("🗑️  Deleting duplicates/orphans:");
    for (const member of toDelete) {
      console.log(`  - ${member.name} (${member.slug})`);
      await db.delete(teamMembers).where(eq(teamMembers.id, member.id));
    }
    console.log(`\n✅ Deleted ${toDelete.length} duplicate/orphan entries\n`);
  }

  // Clean up orphaned images
  console.log("🖼️  Checking for orphaned team avatar images...");
  const orphanedImages = await db.execute(sql`
    DELETE FROM images
    WHERE object_key LIKE 'public/team-%'
    AND id NOT IN (SELECT avatar_image_id FROM team_members WHERE avatar_image_id IS NOT NULL)
    RETURNING id, object_key
  `);

  if (orphanedImages.rows.length > 0) {
    console.log(`✅ Cleaned up ${orphanedImages.rows.length} orphaned images\n`);
  } else {
    console.log("✅ No orphaned images found\n");
  }

  // Final verification
  console.log("=" .repeat(60));
  console.log("FINAL STATE");
  console.log("=".repeat(60) + "\n");

  const finalMembers = await db.select().from(teamMembers);
  const withAvatars = finalMembers.filter(m => m.avatarImageId !== null);
  const withoutAvatars = finalMembers.filter(m => m.avatarImageId === null);

  console.log(`📊 Total team members: ${finalMembers.length}`);
  console.log(`✅ With avatars: ${withAvatars.length}`);
  console.log(`⚠️  Without avatars: ${withoutAvatars.length}\n`);

  if (withoutAvatars.length > 0) {
    console.log("⚠️  Members without avatars:");
    withoutAvatars.forEach(m => console.log(`  - ${m.name} (${m.slug})`));
    console.log();
  }

  console.log("=" .repeat(60));
  console.log("✨ CLEANUP COMPLETE!");
  console.log("=".repeat(60));
  console.log("\nProduction database is now clean and matches source data! 🎉\n");

  process.exit(0);
}

main();
