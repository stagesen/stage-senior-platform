import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { blogPosts } from '../shared/schema';
import { eq, sql } from 'drizzle-orm';

const dbUrl = process.env.DATABASE_URL!;
const sqlClient = neon(dbUrl);
const db = drizzle(sqlClient);

async function checkNewsletterData() {
  console.log('🔍 Checking newsletter data in blog_posts table...\n');

  // Get all distinct categories
  const categories = await db.execute(sql`
    SELECT DISTINCT category, COUNT(*) as count
    FROM blog_posts
    GROUP BY category
    ORDER BY count DESC
  `);

  console.log('Categories in blog_posts:');
  console.log(categories.rows);
  console.log();

  // Get count of published newsletters
  const publishedNewsletters = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM blog_posts
    WHERE category = 'Newsletter' AND published = true
  `);

  console.log(`Published newsletters with category='Newsletter': ${publishedNewsletters.rows[0].count}`);
  console.log();

  // Get sample of newsletter records
  const sampleNewsletters = await db.execute(sql`
    SELECT slug, title, category, published, tags
    FROM blog_posts
    WHERE category = 'Newsletter'
    LIMIT 5
  `);

  console.log('Sample newsletter records:');
  console.table(sampleNewsletters.rows);
  console.log();

  // Check for case variations
  const caseCheck = await db.execute(sql`
    SELECT category, COUNT(*) as count
    FROM blog_posts
    WHERE LOWER(category) = 'newsletter'
    GROUP BY category
  `);

  console.log('Case variations of newsletter category:');
  console.table(caseCheck.rows);
}

checkNewsletterData()
  .then(() => {
    console.log('\n✅ Check complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Check failed:', error);
    process.exit(1);
  });
