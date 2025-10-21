import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { blogPosts, teamMembers } from '../shared/schema';
import { eq, and, sql } from 'drizzle-orm';

const dbUrl = process.env.DATABASE_URL!;
const sqlClient = neon(dbUrl);
const db = drizzle(sqlClient);

async function debugBlogPostsQuery() {
  console.log('🔍 Testing the exact query from getBlogPosts()...\n');

  // Replicate the exact query from storage.getBlogPosts
  let query = db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      content: blogPosts.content,
      summary: blogPosts.summary,
      mainImage: blogPosts.mainImage,
      thumbnailImage: blogPosts.thumbnailImage,
      galleryImages: blogPosts.galleryImages,
      featured: blogPosts.featured,
      category: blogPosts.category,
      author: blogPosts.author,
      authorId: blogPosts.authorId,
      tags: blogPosts.tags,
      communityId: blogPosts.communityId,
      published: blogPosts.published,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      authorName: teamMembers.name,
      authorRole: teamMembers.role,
      authorDepartment: teamMembers.department,
      authorAvatarImageId: teamMembers.avatarImageId,
      authorSlug: teamMembers.slug,
      authorEmail: teamMembers.email,
    })
    .from(blogPosts)
    .leftJoin(teamMembers, eq(blogPosts.authorId, teamMembers.id));

  // Apply published filter like the API does
  const conditions = [];
  conditions.push(eq(blogPosts.published, true));

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  console.log('Executing query...');
  const results = await query;

  console.log(`Total results: ${results.length}`);
  console.log();

  // Count by category
  const categoryCounts: Record<string, number> = {};
  results.forEach(post => {
    const cat = post.category || '(null)';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  console.log('Results by category:');
  console.table(categoryCounts);
  console.log();

  // Check for newsletters
  const newsletters = results.filter(p => p.category === 'Newsletter');
  console.log(`Newsletters found: ${newsletters.length}`);

  if (newsletters.length > 0) {
    console.log('\nSample newsletter from query result:');
    console.log({
      slug: newsletters[0].slug,
      title: newsletters[0].title,
      category: newsletters[0].category,
      published: newsletters[0].published,
      tags: newsletters[0].tags,
    });
  } else {
    console.log('\n❌ NO NEWSLETTERS IN QUERY RESULTS!');
    console.log('This means the issue is in the SQL query or Drizzle ORM mapping.');
  }
}

debugBlogPostsQuery()
  .then(() => {
    console.log('\n✅ Debug complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Debug failed:', error);
    process.exit(1);
  });
