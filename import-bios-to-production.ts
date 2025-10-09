/**
 * Import Team Member Bios to Production Database
 *
 * This script updates the bio field for team members with
 * the scraped biographical content.
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { teamMembers } from './shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs/promises';

neonConfig.webSocketConstructor = ws;

interface BioData {
  bio: string;
  email: string | null;
  phone: string | null;
}

async function main() {
  const prodUrl = "postgresql://neondb_owner:npg_rkzNBcC21pWL@ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech/neondb?sslmode=require";

  const pool = new Pool({ connectionString: prodUrl });
  const db = drizzle(pool);

  console.log('\n📝 Importing Team Member Bios to Production\n');

  // Load bio data
  const bioDataJson = await fs.readFile('team-bios-complete.json', 'utf-8');
  const bioData: Record<string, BioData> = JSON.parse(bioDataJson);

  console.log(`Loaded bio data for ${Object.keys(bioData).length} team members\n`);

  let successCount = 0;
  let skipCount = 0;
  let updateCount = 0;

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

      // Check if bio already exists
      if (member.bio && member.bio.length > 50) {
        console.log(`⚠️  ${member.name} - Already has bio (${member.bio.length} chars), updating...`);
        updateCount++;
      }

      // Update bio and optionally email/phone if they don't exist
      const updates: any = {
        bio: data.bio,
      };

      // Only update email/phone if they're not already set
      if (data.email && !member.email) {
        updates.email = data.email;
      }
      if (data.phone && !member.phone) {
        updates.phone = data.phone;
      }

      await db
        .update(teamMembers)
        .set(updates)
        .where(eq(teamMembers.id, member.id));

      console.log(`✅ ${member.name} - Bio imported (${data.bio.length} characters)`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${slug} - Error:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully imported: ${successCount}`);
  console.log(`⚠️  Updated existing: ${updateCount}`);
  console.log(`⏭️  Skipped (not found): ${skipCount}`);
  console.log();

  // Final verification
  const allMembers = await db.select().from(teamMembers);
  const withBios = allMembers.filter(m => m.bio && m.bio.length > 50);

  console.log('='.repeat(60));
  console.log('FINAL STATE');
  console.log('='.repeat(60));
  console.log(`📊 Total team members: ${allMembers.length}`);
  console.log(`✅ Members with bios: ${withBios.length}`);
  console.log(`⚠️  Members without bios: ${allMembers.length - withBios.length}`);
  console.log();

  if (allMembers.length - withBios.length > 0) {
    console.log('Members without bios:');
    allMembers
      .filter(m => !m.bio || m.bio.length <= 50)
      .forEach(m => console.log(`  - ${m.name} (${m.slug})`));
    console.log();
  }

  console.log('='.repeat(60));
  console.log('✨ BIO IMPORT COMPLETE!');
  console.log('='.repeat(60));
  console.log('\nAll team member bios have been imported to production! 🎉\n');

  await pool.end();
  process.exit(0);
}

main();
