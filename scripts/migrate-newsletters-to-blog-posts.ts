import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { posts, blogPosts } from '../shared/schema';
import { eq, sql } from 'drizzle-orm';

const dbUrl = process.env.DATABASE_URL!;
const sqlClient = neon(dbUrl);
const db = drizzle(sqlClient);

async function migrateNewslettersToBlogPosts() {
  console.log('🚀 Starting newsletter migration from posts -> blog_posts...\n');

  try {
    // Fetch all published posts with 'newsletter' tag
    const newsletters = await db
      .select()
      .from(posts)
      .where(sql`${posts.tags} @> ARRAY['newsletter']::text[]`);

    console.log(`📊 Found ${newsletters.length} newsletters in posts table\n`);

    if (newsletters.length === 0) {
      console.log('✅ No newsletters to migrate. Done!');
      return;
    }

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const newsletter of newsletters) {
      try {
        console.log(`\n📰 Processing: ${newsletter.title}`);
        console.log(`   Slug: ${newsletter.slug}`);

        // Map Post schema to BlogPost schema
        const blogPostData = {
          slug: newsletter.slug,
          title: newsletter.title,
          content: newsletter.content,
          summary: newsletter.summary || undefined,
          mainImage: newsletter.heroImageUrl || undefined,
          thumbnailImage: newsletter.heroImageUrl || undefined,
          galleryImages: [],
          featured: false,
          category: 'Newsletter',
          author: undefined,
          authorId: undefined,
          tags: newsletter.tags || [],
          communityId: newsletter.communityId || undefined,
          published: newsletter.published || false,
          publishedAt: newsletter.publishedAt || undefined,
          createdAt: newsletter.createdAt || undefined,
          updatedAt: newsletter.updatedAt || undefined,
        };

        // Insert or update in blog_posts table
        await db
          .insert(blogPosts)
          .values(blogPostData)
          .onConflictDoUpdate({
            target: blogPosts.slug,
            set: {
              title: blogPostData.title,
              content: blogPostData.content,
              summary: blogPostData.summary,
              mainImage: blogPostData.mainImage,
              thumbnailImage: blogPostData.thumbnailImage,
              tags: blogPostData.tags,
              communityId: blogPostData.communityId,
              published: blogPostData.published,
              publishedAt: blogPostData.publishedAt,
              updatedAt: new Date(),
            },
          });

        console.log(`   ✅ Migrated successfully`);
        successCount++;
      } catch (error) {
        console.error(`   ❌ Error migrating "${newsletter.title}":`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${newsletters.length}`);
    console.log('='.repeat(60));

    // Verify migration
    console.log('\n🔍 Verifying migration...');
    const migratedCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(blogPosts)
      .where(eq(blogPosts.category, 'Newsletter'));

    console.log(`✅ Found ${migratedCount[0].count} newsletters in blog_posts table`);

    // Test the specific newsletter that was causing the 404
    const octoberNewsletter = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, 'october-25-newsletter'))
      .limit(1);

    if (octoberNewsletter.length > 0) {
      console.log('\n✨ SUCCESS! The "october-25-newsletter" is now accessible in blog_posts!');
      console.log(`   Title: ${octoberNewsletter[0].title}`);
      console.log(`   Published: ${octoberNewsletter[0].published}`);
      console.log(`   URL: https://stagesenior.replit.app/blog/october-25-newsletter`);
    } else {
      console.log('\n⚠️  Warning: "october-25-newsletter" was not found in blog_posts after migration');
    }

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateNewslettersToBlogPosts()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
