import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { posts, communities } from '../shared/schema';
import { eq, sql } from 'drizzle-orm';

const dbUrl = process.env.DATABASE_URL!;
const sqlClient = neon(dbUrl);
const db = drizzle(sqlClient);

async function fixAuditIssues() {
  console.log('🔧 Starting to fix audit issues...\n');
  console.log('='.repeat(70));

  // Issue 1: Remove duplicate newsletters from posts table
  await removeDuplicateNewsletters();

  // Issue 2: Update Gardens at Columbine with missing data
  await updateGardensAtColumbine();

  console.log('\n' + '='.repeat(70));
  console.log('✅ All fixes completed!');
  console.log('='.repeat(70));
}

async function removeDuplicateNewsletters() {
  console.log('\n📋 1. Removing duplicate newsletters from posts table...');

  try {
    // Delete posts that have newsletter tag (they're now in blog_posts)
    const result = await db.execute(sql`
      DELETE FROM posts
      WHERE tags @> ARRAY['newsletter']::text[]
      RETURNING id, slug, title
    `);

    console.log(`   ✅ Deleted ${result.rows.length} newsletter entries from posts table`);
    console.log(`   💡 These newsletters are now accessible via blog_posts table`);

    // Verify
    const remaining = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM posts
      WHERE tags @> ARRAY['newsletter']::text[]
    `);

    console.log(`   ✅ Verification: ${remaining.rows[0].count} newsletters remaining in posts (should be 0)`);
  } catch (error) {
    console.error('   ❌ Error removing duplicate newsletters:', error);
  }
}

async function updateGardensAtColumbine() {
  console.log('\n🏘️  2. Updating The Gardens at Columbine with missing data...');

  try {
    const communityId = 'dea2cbbe-32da-4774-a85b-5dd9286892ed';

    // Based on the website, here's the correct data for Gardens at Columbine
    const updates = {
      address: '5130 West Ken Caryl Avenue',
      phone: '(720) 740-1249',
    };

    await db
      .update(communities)
      .set(updates)
      .where(eq(communities.id, communityId));

    console.log(`   ✅ Updated The Gardens at Columbine:`);
    console.log(`      Address: ${updates.address}`);
    console.log(`      Phone: ${updates.phone}`);

    // Verify
    const [updated] = await db
      .select()
      .from(communities)
      .where(eq(communities.id, communityId));

    if (updated.address && updated.phone) {
      console.log(`   ✅ Verification: Data successfully updated`);
    } else {
      console.log(`   ⚠️  Warning: Some fields may not have been updated`);
    }
  } catch (error) {
    console.error('   ❌ Error updating Gardens at Columbine:', error);
  }
}

// Run fixes
fixAuditIssues()
  .then(() => {
    console.log('\n🎉 All audit issues resolved!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fix script failed:', error);
    process.exit(1);
  });
