import { db } from "../server/db";
import { blogPosts, posts, communities } from "../shared/schema";
import { eq, sql, desc, isNotNull } from "drizzle-orm";

async function analyzeBlogPosts() {
  console.log("📊 Blog Posts Database Analysis");
  console.log("================================\n");

  // Fetch all blog posts
  const allBlogPosts = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      summary: blogPosts.summary,
      category: blogPosts.category,
      author: blogPosts.author,
      tags: blogPosts.tags,
      published: blogPosts.published,
      publishedAt: blogPosts.publishedAt,
      featured: blogPosts.featured,
      communityId: blogPosts.communityId,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      contentLength: sql<number>`LENGTH(${blogPosts.content})`,
      hasMainImage: sql<boolean>`${blogPosts.mainImage} IS NOT NULL`,
      hasThumbnail: sql<boolean>`${blogPosts.thumbnailImage} IS NOT NULL`,
      galleryCount: sql<number>`COALESCE(json_array_length(${blogPosts.galleryImages}::json), 0)`,
    })
    .from(blogPosts)
    .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));

  // Also check the posts table
  const allPosts = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      summary: posts.summary,
      tags: posts.tags,
      published: posts.published,
      publishedAt: posts.publishedAt,
      communityId: posts.communityId,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      contentLength: sql<number>`LENGTH(${posts.content})`,
      hasHeroImage: sql<boolean>`${posts.heroImageUrl} IS NOT NULL`,
    })
    .from(posts)
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt));

  // Get communities for reference
  const communitiesData = await db.select().from(communities);
  const communityMap = new Map(communitiesData.map(c => [c.id, c.name]));

  // Analyze blog_posts table
  console.log("📝 BLOG_POSTS TABLE ANALYSIS");
  console.log("-----------------------------");
  console.log(`Total blog posts: ${allBlogPosts.length}`);

  const publishedBlogPosts = allBlogPosts.filter(p => p.published);
  const draftBlogPosts = allBlogPosts.filter(p => !p.published);
  const featuredBlogPosts = allBlogPosts.filter(p => p.featured);

  console.log(`Published: ${publishedBlogPosts.length}`);
  console.log(`Drafts: ${draftBlogPosts.length}`);
  console.log(`Featured: ${featuredBlogPosts.length}`);

  // Category analysis
  const categories = new Map<string, number>();
  allBlogPosts.forEach(post => {
    if (post.category) {
      categories.set(post.category, (categories.get(post.category) || 0) + 1);
    }
  });

  console.log("\n📁 Categories:");
  if (categories.size > 0) {
    Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`  - ${category}: ${count} posts`);
      });
  } else {
    console.log("  No categories found");
  }

  // Author analysis
  const authors = new Map<string, number>();
  allBlogPosts.forEach(post => {
    if (post.author) {
      authors.set(post.author, (authors.get(post.author) || 0) + 1);
    }
  });

  console.log("\n✍️  Authors:");
  if (authors.size > 0) {
    Array.from(authors.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([author, count]) => {
        console.log(`  - ${author}: ${count} posts`);
      });
  } else {
    console.log("  No authors found");
  }

  // Tags analysis
  const tagsCount = new Map<string, number>();
  allBlogPosts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        tagsCount.set(tag, (tagsCount.get(tag) || 0) + 1);
      });
    }
  });

  console.log("\n🏷️  Top Tags:");
  if (tagsCount.size > 0) {
    Array.from(tagsCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([tag, count]) => {
        console.log(`  - ${tag}: ${count} posts`);
      });
  } else {
    console.log("  No tags found");
  }

  // Content analysis
  const contentStats = allBlogPosts.reduce((acc, post) => {
    return {
      totalLength: acc.totalLength + (post.contentLength || 0),
      withImages: acc.withImages + (post.hasMainImage ? 1 : 0),
      withThumbnails: acc.withThumbnails + (post.hasThumbnail ? 1 : 0),
      withGalleries: acc.withGalleries + (post.galleryCount > 0 ? 1 : 0),
      totalGalleryImages: acc.totalGalleryImages + post.galleryCount,
    };
  }, { totalLength: 0, withImages: 0, withThumbnails: 0, withGalleries: 0, totalGalleryImages: 0 });

  console.log("\n📊 Content Statistics:");
  console.log(`  Average content length: ${allBlogPosts.length > 0 ? Math.round(contentStats.totalLength / allBlogPosts.length) : 0} characters`);
  console.log(`  Posts with main image: ${contentStats.withImages}`);
  console.log(`  Posts with thumbnail: ${contentStats.withThumbnails}`);
  console.log(`  Posts with galleries: ${contentStats.withGalleries}`);
  console.log(`  Total gallery images: ${contentStats.totalGalleryImages}`);

  // Community association
  const communityPosts = allBlogPosts.filter(p => p.communityId);
  console.log(`\n🏢 Community associations: ${communityPosts.length} posts`);
  if (communityPosts.length > 0) {
    const communityCounts = new Map<string, number>();
    communityPosts.forEach(post => {
      const communityName = communityMap.get(post.communityId!) || 'Unknown';
      communityCounts.set(communityName, (communityCounts.get(communityName) || 0) + 1);
    });

    Array.from(communityCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([community, count]) => {
        console.log(`  - ${community}: ${count} posts`);
      });
  }

  // Recent posts
  console.log("\n📅 Recent Blog Posts:");
  allBlogPosts.slice(0, 5).forEach(post => {
    const date = post.publishedAt || post.createdAt;
    console.log(`  - "${post.title}" (${post.slug})`);
    console.log(`    Status: ${post.published ? 'Published' : 'Draft'}${post.featured ? ', Featured' : ''}`);
    console.log(`    Date: ${date?.toLocaleDateString()}`);
    if (post.category) console.log(`    Category: ${post.category}`);
    if (post.author) console.log(`    Author: ${post.author}`);
  });

  console.log("\n================================================");
  console.log("📖 POSTS TABLE ANALYSIS");
  console.log("-----------------------------");
  console.log(`Total posts: ${allPosts.length}`);

  const publishedPosts = allPosts.filter(p => p.published);
  const draftPosts = allPosts.filter(p => !p.published);

  console.log(`Published: ${publishedPosts.length}`);
  console.log(`Drafts: ${draftPosts.length}`);

  // Tags analysis for posts table
  const postsTagsCount = new Map<string, number>();
  allPosts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        postsTagsCount.set(tag, (postsTagsCount.get(tag) || 0) + 1);
      });
    }
  });

  console.log("\n🏷️  Top Tags in Posts:");
  if (postsTagsCount.size > 0) {
    Array.from(postsTagsCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([tag, count]) => {
        console.log(`  - ${tag}: ${count} posts`);
      });
  } else {
    console.log("  No tags found");
  }

  // Content analysis for posts
  const postsContentStats = allPosts.reduce((acc, post) => {
    return {
      totalLength: acc.totalLength + (post.contentLength || 0),
      withImages: acc.withImages + (post.hasHeroImage ? 1 : 0),
    };
  }, { totalLength: 0, withImages: 0 });

  console.log("\n📊 Content Statistics:");
  console.log(`  Average content length: ${allPosts.length > 0 ? Math.round(postsContentStats.totalLength / allPosts.length) : 0} characters`);
  console.log(`  Posts with hero image: ${postsContentStats.withImages}`);

  // Community association for posts
  const postsCommunityPosts = allPosts.filter(p => p.communityId);
  console.log(`\n🏢 Community associations: ${postsCommunityPosts.length} posts`);

  // Recent posts from posts table
  console.log("\n📅 Recent Posts:");
  allPosts.slice(0, 5).forEach(post => {
    const date = post.publishedAt || post.createdAt;
    console.log(`  - "${post.title}" (${post.slug})`);
    console.log(`    Status: ${post.published ? 'Published' : 'Draft'}`);
    console.log(`    Date: ${date?.toLocaleDateString()}`);
  });

  console.log("\n================================================");
  console.log("📊 SUMMARY");
  console.log("-----------------------------");
  console.log(`Total content items: ${allBlogPosts.length + allPosts.length}`);
  console.log(`  - blog_posts table: ${allBlogPosts.length}`);
  console.log(`  - posts table: ${allPosts.length}`);
  console.log("\nNote: You have two separate tables for blog content.");
  console.log("Consider consolidating or clarifying the purpose of each.");

  // Check for duplicate slugs between tables
  const blogPostSlugs = new Set(allBlogPosts.map(p => p.slug));
  const postSlugs = new Set(allPosts.map(p => p.slug));
  const duplicateSlugs = [...blogPostSlugs].filter(slug => postSlugs.has(slug));

  if (duplicateSlugs.length > 0) {
    console.log("\n⚠️  Warning: Duplicate slugs found between tables:");
    duplicateSlugs.forEach(slug => {
      console.log(`  - ${slug}`);
    });
  }

  process.exit(0);
}

analyzeBlogPosts().catch(err => {
  console.error("Error analyzing blog posts:", err);
  process.exit(1);
});