/**
 * Simplified Production Team Import Script
 * 
 * This script imports team members WITHOUT needing object storage.
 * We'll use the existing avatar URLs from the scraped data.
 * 
 * Usage: tsx production-simple-import.ts
 */

import { db } from "./server/db";
import { teamMembers } from "./shared/schema";
import { eq, sql } from "drizzle-orm";
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

async function importTeamMembersSimple() {
  console.log("\n🚀 Starting Simple Team Member Import\n");
  console.log("This will import team members using their web URLs for avatars.\n");
  
  const jsonPath = path.join(process.cwd(), "scraped-team-data.json");
  const jsonData = await fs.readFile(jsonPath, "utf-8");
  const data: ImportData = JSON.parse(jsonData);

  console.log(`Found ${data.teamMembers.length} team members to import\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const member of data.teamMembers) {
    try {
      // Check if exists
      const existing = await db.select().from(teamMembers).where(eq(teamMembers.slug, member.slug)).limit(1);
      if (existing.length > 0) {
        console.log(`⏭️  ${member.name} - Already exists, skipping`);
        skipCount++;
        continue;
      }

      // Insert team member (without avatar for now - we'll handle images separately)
      await db.insert(teamMembers).values({
        name: member.name,
        slug: member.slug,
        role: member.role,
        email: member.email || null,
        phone: member.phone || null,
        bio: member.bio || null,
        tags: member.tags || [],
        department: member.department || null,
        linkedinUrl: member.socialLinkedin || null,
      });

      console.log(`✅ ${member.name} - Imported`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${member.name} - Error:`, error);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 Import Summary:");
  console.log(`   Success: ${successCount}`);
  console.log(`   Skipped: ${skipCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${data.teamMembers.length}`);
  console.log("=".repeat(60) + "\n");

  return { successCount, skipCount, errorCount };
}

async function addCommunityAssociations() {
  console.log("Adding Community Associations...\n");

  try {
    // Gardens at Columbine
    await db.execute(sql`
      UPDATE team_members 
      SET tags = tags || '["The Gardens at Columbine"]'::jsonb
      WHERE slug IN ('alyssa-trujillo', 'marnie-mckissack', 'helen-rossi', 'allie-mitchem', 'matt-turk', 'rich-thomas', 'sydney-hertz')
      AND NOT (tags @> '["The Gardens at Columbine"]'::jsonb)
    `);
    console.log("✅ Added The Gardens at Columbine associations (7 members)");

    // Gardens on Quail
    await db.execute(sql`
      UPDATE team_members 
      SET tags = tags || '["The Gardens on Quail"]'::jsonb
      WHERE slug = 'mariah-ruell'
      AND NOT (tags @> '["The Gardens on Quail"]'::jsonb)
    `);
    console.log("✅ Added The Gardens on Quail associations (1 member)");

    // Shared members (both communities)
    await db.execute(sql`
      UPDATE team_members 
      SET tags = tags || '["The Gardens at Columbine", "Golden Pond"]'::jsonb
      WHERE slug IN ('marci-gerke', 'bob-burden')
      AND NOT (tags @> '["The Gardens at Columbine"]'::jsonb OR tags @> '["Golden Pond"]'::jsonb)
    `);
    console.log("✅ Added shared community associations (2 members)\n");
  } catch (error) {
    console.error("❌ Error adding community associations:", error);
  }
}

async function verifyImport() {
  console.log("Verifying Import...\n");

  const totalMembers = await db.select({ count: sql<number>`count(*)` }).from(teamMembers);
  const withCommunities = await db.select({ count: sql<number>`count(*)` }).from(teamMembers).where(sql`tags::text LIKE '%Gardens%' OR tags::text LIKE '%Golden Pond%'`);

  console.log("=".repeat(60));
  console.log("✅ Verification Results:");
  console.log(`   Total team members: ${totalMembers[0].count}`);
  console.log(`   Members with community tags: ${withCommunities[0].count}`);
  console.log("=".repeat(60) + "\n");
}

async function main() {
  try {
    const result = await importTeamMembersSimple();
    
    if (result.successCount > 0) {
      await addCommunityAssociations();
    }
    
    await verifyImport();
    
    console.log("✨ IMPORT COMPLETE!\n");
    console.log("Note: Team members imported without avatars.");
    console.log("You'll need to upload avatars through the admin panel or run a separate migration.\n");
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  }
}

main();
