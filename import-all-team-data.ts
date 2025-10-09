/**
 * Comprehensive Import of Team Member Bios and Contact Info
 *
 * This script merges all scraped data and updates production database
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
  email?: string;
  phone?: string;
}

interface ContactData {
  name: string;
  email: string;
  phone: string;
}

async function main() {
  const prodUrl = "postgresql://neondb_owner:npg_rkzNBcC21pWL@ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech/neondb?sslmode=require";

  const pool = new Pool({ connectionString: prodUrl });
  const db = drizzle(pool);

  console.log('\n📝 Comprehensive Team Data Import to Production\n');

  // Load all data files
  const communityBios = JSON.parse(await fs.readFile('team-bios-complete.json', 'utf-8')) as Record<string, BioData>;
  const stageBios = JSON.parse(await fs.readFile('stagesenior-agents-bios.json', 'utf-8')) as Record<string, BioData>;
  const contacts = JSON.parse(await fs.readFile('team-contacts-complete.json', 'utf-8')) as Record<string, ContactData>;

  // Merge all data
  const mergedData: Record<string, { bio?: string; email?: string; phone?: string }> = {};

  // Add community bios
  for (const [slug, data] of Object.entries(communityBios)) {
    mergedData[slug] = { bio: data.bio, email: data.email || undefined, phone: data.phone || undefined };
  }

  // Add/override with Stage Senior bios
  for (const [slug, data] of Object.entries(stageBios)) {
    if (!mergedData[slug]) {
      mergedData[slug] = {};
    }
    mergedData[slug].bio = data.bio;
    if (data.email) mergedData[slug].email = data.email;
    if (data.phone) mergedData[slug].phone = data.phone;
  }

  // Add/override with contact data
  for (const [slug, data] of Object.entries(contacts)) {
    if (!mergedData[slug]) {
      mergedData[slug] = {};
    }
    if (data.email) mergedData[slug].email = data.email;
    if (data.phone) mergedData[slug].phone = data.phone;
  }

  console.log(`Loaded data for ${Object.keys(mergedData).length} team members\n`);

  let bioUpdates = 0;
  let emailUpdates = 0;
  let phoneUpdates = 0;
  let notFound = 0;

  for (const [slug, data] of Object.entries(mergedData)) {
    try {
      // Find team member by slug
      const [member] = await db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.slug, slug))
        .limit(1);

      if (!member) {
        console.log(`⏭️  ${slug} - Not found in database, skipping`);
        notFound++;
        continue;
      }

      // Prepare updates
      const updates: any = {};
      let updatesList: string[] = [];

      // Update bio
      if (data.bio) {
        updates.bio = data.bio;
        bioUpdates++;
        updatesList.push(`bio (${data.bio.length} chars)`);
      }

      // Update email (always update if we have one)
      if (data.email && data.email !== '') {
        // Skip generic emails if member already has a specific email
        const isGenericEmail = data.email.includes('info@');
        const hasSpecificEmail = member.email && !member.email.includes('info@');

        if (!hasSpecificEmail || !isGenericEmail) {
          updates.email = data.email;
          emailUpdates++;
          updatesList.push('email');
        }
      }

      // Update phone (always update if we have one and it's not empty)
      if (data.phone && data.phone !== '') {
        updates.phone = data.phone;
        phoneUpdates++;
        updatesList.push('phone');
      }

      // Perform update if we have changes
      if (Object.keys(updates).length > 0) {
        await db
          .update(teamMembers)
          .set(updates)
          .where(eq(teamMembers.id, member.id));

        console.log(`✅ ${member.name} - Updated: ${updatesList.join(', ')}`);
      } else {
        console.log(`⏭️  ${member.name} - No updates needed`);
      }
    } catch (error) {
      console.error(`❌ ${slug} - Error:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`📝 Bios updated: ${bioUpdates}`);
  console.log(`📧 Emails updated: ${emailUpdates}`);
  console.log(`📞 Phones updated: ${phoneUpdates}`);
  console.log(`⏭️  Not found: ${notFound}`);
  console.log();

  // Final verification
  const allMembers = await db.select().from(teamMembers);
  const withBios = allMembers.filter(m => m.bio && m.bio.length > 50);
  const withEmails = allMembers.filter(m => m.email && m.email !== '');
  const withPhones = allMembers.filter(m => m.phone && m.phone !== '');

  console.log('='.repeat(60));
  console.log('FINAL STATE');
  console.log('='.repeat(60));
  console.log(`📊 Total team members: ${allMembers.length}`);
  console.log(`✅ With bios: ${withBios.length} (${Math.round(withBios.length / allMembers.length * 100)}%)`);
  console.log(`✅ With emails: ${withEmails.length} (${Math.round(withEmails.length / allMembers.length * 100)}%)`);
  console.log(`✅ With phones: ${withPhones.length} (${Math.round(withPhones.length / allMembers.length * 100)}%)`);
  console.log();

  // Show any members still missing data
  const missingBios = allMembers.filter(m => !m.bio || m.bio.length <= 50);
  const missingEmails = allMembers.filter(m => !m.email || m.email === '');
  const missingPhones = allMembers.filter(m => !m.phone || m.phone === '');

  if (missingBios.length > 0) {
    console.log('⚠️  Members without bios:');
    missingBios.forEach(m => console.log(`  - ${m.name} (${m.slug})`));
    console.log();
  }

  if (missingEmails.length > 0) {
    console.log('⚠️  Members without emails:');
    missingEmails.forEach(m => console.log(`  - ${m.name} (${m.slug})`));
    console.log();
  }

  if (missingPhones.length > 0) {
    console.log('⚠️  Members without phones:');
    missingPhones.forEach(m => console.log(`  - ${m.name} (${m.slug})`));
    console.log();
  }

  console.log('='.repeat(60));
  console.log('✨ COMPREHENSIVE IMPORT COMPLETE!');
  console.log('='.repeat(60));
  console.log('\nAll team member data has been updated in production! 🎉\n');

  await pool.end();
  process.exit(0);
}

main();
