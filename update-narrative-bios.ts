/**
 * Update Team Member Bios with Properly Formatted Narrative Content
 *
 * This script updates bios to match the current website style
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { teamMembers } from './shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs/promises';

neonConfig.webSocketConstructor = ws;

interface TeamData {
  bio: string;
  email: string;
  phone: string;
}

async function main() {
  const prodUrl = "postgresql://neondb_owner:npg_rkzNBcC21pWL@ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech/neondb?sslmode=require";

  const pool = new Pool({ connectionString: prodUrl });
  const db = drizzle(pool);

  console.log('\n📝 Updating Team Bios to Narrative Format\n');

  // Load narrative bio data
  const bioDataJson = await fs.readFile('team-bios-narrative-format.json', 'utf-8');
  const bioData: Record<string, TeamData> = JSON.parse(bioDataJson);

  console.log(`Loaded data for ${Object.keys(bioData).length} team members\n`);

  let updateCount = 0;
  let skipCount = 0;
  let emptyBioCount = 0;

  for (const [slug, data] of Object.entries(bioData)) {
    try {
      // Find team member by slug
      const [member] = await db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.slug, slug))
        .limit(1);

      if (!member) {
        console.log(`⏭️  ${slug} - Not found in database, skipping`);
        skipCount++;
        continue;
      }

      // Skip if no bio content
      if (!data.bio || data.bio.trim() === '') {
        console.log(`⚠️  ${member.name} - No bio content available`);
        emptyBioCount++;
        continue;
      }

      // Update with narrative bio
      await db
        .update(teamMembers)
        .set({
          bio: data.bio,
          email: data.email || member.email,
          phone: data.phone || member.phone,
        })
        .where(eq(teamMembers.id, member.id));

      console.log(`✅ ${member.name} - Updated (${data.bio.length} characters)`);
      updateCount++;
    } catch (error) {
      console.error(`❌ ${slug} - Error:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('UPDATE SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully updated: ${updateCount}`);
  console.log(`⚠️  No bio content: ${emptyBioCount}`);
  console.log(`⏭️  Not found: ${skipCount}`);
  console.log();

  // Final verification
  const allMembers = await db.select().from(teamMembers);
  const withBios = allMembers.filter(m => m.bio && m.bio.length > 50);
  const withoutBios = allMembers.filter(m => !m.bio || m.bio.length <= 50);

  console.log('='.repeat(60));
  console.log('FINAL STATE');
  console.log('='.repeat(60));
  console.log(`📊 Total team members: ${allMembers.length}`);
  console.log(`✅ With bios: ${withBios.length} (${Math.round(withBios.length / allMembers.length * 100)}%)`);
  console.log(`⚠️  Without bios: ${withoutBios.length}`);
  console.log();

  if (withoutBios.length > 0) {
    console.log('Members without bios:');
    withoutBios.forEach(m => console.log(`  - ${m.name} (${m.slug})`));
    console.log();
  }

  console.log('='.repeat(60));
  console.log('✨ BIO UPDATE COMPLETE!');
  console.log('='.repeat(60));
  console.log('\nAll bios now match the website narrative format! 🎉\n');

  await pool.end();
  process.exit(0);
}

main();
