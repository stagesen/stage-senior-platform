/**
 * Clean Up Empty/Minimal Bios
 *
 * Sets bios to blank for team members without substantial biographical content
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { teamMembers } from './shared/schema';
import { eq } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

async function main() {
  const prodUrl = "postgresql://neondb_owner:npg_rkzNBcC21pWL@ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech/neondb?sslmode=require";

  const pool = new Pool({ connectionString: prodUrl });
  const db = drizzle(pool);

  console.log('\n🧹 Cleaning Up Empty/Minimal Bios\n');

  // Team members that should have blank bios (no substantial content on website)
  const membersToBlank = [
    'shellie-yushka',
    'chaz-osen',
    'holly-jo-eames',
    'sarah-stevenson',
    'alyssa-trujillo',
    'marnie-mckissack',
    'helen-rossi',
    'matt-turk',
    'rich-thomas',
    'sydney-hertz',
    'mariah-ruell'
  ];

  let cleanedCount = 0;

  for (const slug of membersToBlank) {
    try {
      const [member] = await db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.slug, slug))
        .limit(1);

      if (!member) {
        console.log(`⏭️  ${slug} - Not found, skipping`);
        continue;
      }

      // Set bio to null
      await db
        .update(teamMembers)
        .set({ bio: null })
        .where(eq(teamMembers.id, member.id));

      console.log(`✅ ${member.name} - Bio cleared`);
      cleanedCount++;
    } catch (error) {
      console.error(`❌ ${slug} - Error:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('CLEANUP SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Bios cleared: ${cleanedCount}`);
  console.log();

  // Final verification
  const allMembers = await db.select().from(teamMembers);
  const withBios = allMembers.filter(m => m.bio && m.bio.length > 0);
  const withoutBios = allMembers.filter(m => !m.bio || m.bio.length === 0);

  console.log('='.repeat(60));
  console.log('FINAL STATE');
  console.log('='.repeat(60));
  console.log(`📊 Total team members: ${allMembers.length}`);
  console.log(`✅ With bios: ${withBios.length}`);
  console.log(`⚪ Without bios (blank): ${withoutBios.length}`);
  console.log();

  console.log('Team members WITH bios:');
  withBios.forEach(m => console.log(`  ✅ ${m.name} (${m.bio?.length || 0} chars)`));
  console.log();

  console.log('Team members WITHOUT bios (blank):');
  withoutBios.forEach(m => console.log(`  ⚪ ${m.name}`));
  console.log();

  console.log('='.repeat(60));
  console.log('✨ CLEANUP COMPLETE!');
  console.log('='.repeat(60));
  console.log('\nBios are now clean - only substantial content kept! 🎉\n');

  await pool.end();
  process.exit(0);
}

main();
