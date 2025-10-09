/**
 * Safely clean up old team members from ACTUAL Production
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { teamMembers, images } from "./shared/schema";
import { eq, sql } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

neonConfig.webSocketConstructor = ws;

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

  console.log("\n🧹 Safely Cleaning up ACTUAL Production Database\n");

  // Load the source data to know what SHOULD be in production
  const jsonPath = path.join(process.cwd(), "scraped-team-data.json");
  const jsonData = await fs.readFile(jsonPath, "utf-8");
  const sourceData: ImportData = JSON.parse(jsonData);
  const validSlugs = new Set(sourceData.teamMembers.map(m => m.slug));

  console.log(`✅ Loaded ${sourceData.teamMembers.length} team members from source data\n`);

  // Get all current team members
  const allMembers = await db.select().from(teamMembers);
  console.log(`📊 Current production has ${allMembers.length} team members\n`);

  // Find members to delete
  const toDelete = allMembers.filter(m => !validSlugs.has(m.slug));

  console.log(`🗑️  Found ${toDelete.length} old members to remove:\n`);
  toDelete.forEach(m => console.log(`  - ${m.name} (${m.slug})`));

  if (toDelete.length > 0) {
    console.log();

    // First, remove author references from blog posts
    for (const member of toDelete) {
      await db.execute(sql`
        UPDATE blog_posts
        SET author_id = NULL
        WHERE author_id = ${member.id}
      `);
      console.log(`  📝 Cleared blog post references for ${member.name}`);
    }

    console.log();

    // Now delete the team members
    for (const member of toDelete) {
      await db.delete(teamMembers).where(eq(teamMembers.id, member.id));
      console.log(`  ✅ Deleted ${member.name}`);
    }
  }

  // Clean up orphaned images
  console.log("\n🖼️  Cleaning up orphaned images...");
  const orphanedImages = await db.execute(sql`
    DELETE FROM images
    WHERE object_key LIKE 'public/team-%'
    AND id NOT IN (SELECT avatar_image_id FROM team_members WHERE avatar_image_id IS NOT NULL)
    RETURNING id
  `);

  if (orphanedImages.rows.length > 0) {
    console.log(`✅ Cleaned up ${orphanedImages.rows.length} orphaned images\n`);
  } else {
    console.log("✅ No orphaned images found\n");
  }

  // Final verification
  console.log("=" .repeat(60));
  console.log("FINAL STATE - ACTUAL PRODUCTION");
  console.log("=".repeat(60) + "\n");

  const finalMembers = await db.select().from(teamMembers);
  const withAvatars = finalMembers.filter(m => m.avatarImageId !== null);

  console.log(`📊 Total team members: ${finalMembers.length}`);
  console.log(`✅ All have avatars: ${withAvatars.length === finalMembers.length ? 'YES' : 'NO'}`);
  console.log(`✅ Matches source data: ${finalMembers.length === sourceData.teamMembers.length ? 'YES' : 'NO'}\n`);

  console.log("Team members in production:");
  const sortedMembers = finalMembers.sort((a, b) => a.name.localeCompare(b.name));
  sortedMembers.forEach(m => {
    console.log(`  ✅ ${m.name} (${m.slug})`);
  });

  console.log("\n" + "=".repeat(60));
  console.log("✨ CLEANUP COMPLETE!");
  console.log("=".repeat(60));
  console.log("\nProduction is now clean and ready! 🎉\n");

  await pool.end();
  process.exit(0);
}

main();
