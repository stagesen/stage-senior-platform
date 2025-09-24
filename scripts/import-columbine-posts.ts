import { db } from "../server/db";
import { blogPosts, communities } from "../shared/schema";
import { eq } from "drizzle-orm";
import { columbinePosts } from "../data/columbine-posts-data";

// Helper function to find or create Columbine community
async function getColumbineCommunity() {
  // First check if Columbine community exists
  const [existingCommunity] = await db
    .select()
    .from(communities)
    .where(eq(communities.slug, "gardens-at-columbine"));

  if (existingCommunity) {
    return existingCommunity.id;
  }

  // If not, create it
  const [newCommunity] = await db
    .insert(communities)
    .values({
      slug: "gardens-at-columbine",
      name: "Gardens at Columbine",
      city: "Littleton",
      state: "CO",
      active: true,
    })
    .returning();

  return newCommunity.id;
}

async function importBlogPosts() {
  console.log("🚀 Starting Columbine blog posts import...");
  console.log(`📊 Total posts to import: ${columbinePosts.length}`);

  try {
    // Get or create Columbine community
    const communityId = await getColumbineCommunity();
    console.log(`✅ Using community ID: ${communityId}`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const post of columbinePosts) {
      try {
        // Check if post already exists
        const [existingPost] = await db
          .select()
          .from(blogPosts)
          .where(eq(blogPosts.slug, post.slug));

        if (existingPost) {
          console.log(`⏭️  Skipping existing post: ${post.slug}`);
          skipCount++;
          continue;
        }

        // Transform and insert the post
        await db.insert(blogPosts).values({
          slug: post.slug,
          title: post.name,
          content: post.postBody,
          summary: post.postSummary,
          mainImage: post.mainImage,
          thumbnailImage: post.thumbnailImage,
          galleryImages: post.galleryImages.filter(img => img && img.length > 0),
          featured: post.featured,
          category: post.category,
          author: post.author,
          tags: post.tags,
          communityId: communityId,
          published: true,
          publishedAt: new Date(post.publishedOn),
          createdAt: new Date(post.createdOn),
          updatedAt: new Date(post.createdOn), // Use createdOn for updatedAt as well
        });

        console.log(`✅ Imported: ${post.slug}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error importing ${post.slug}:`, error);
        errorCount++;
      }
    }

      console.log("\n📊 Import Summary:");
    console.log(`✅ Successfully imported: ${successCount} posts`);
    console.log(`⏭️  Skipped (already exist): ${skipCount} posts`);
    console.log(`❌ Errors: ${errorCount} posts`);
    console.log(`📝 Total processed: ${columbinePosts.length} posts`);

  } catch (error) {
    console.error("Fatal error during import:", error);
    process.exit(1);
  }

  process.exit(0);
}

importBlogPosts();