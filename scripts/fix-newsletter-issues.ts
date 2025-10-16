import { db } from "../server/db";
import { posts, postAttachments } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { DatabaseStorage } from "../server/storage";

async function fixNewsletterIssues() {
  const storage = new DatabaseStorage();

  console.log("Starting newsletter fixes...\n");

  // ============================================
  // 1. Fix Gardens on Quail newsletter dates
  // ============================================
  console.log("1. Fixing Gardens on Quail newsletter dates...");

  const gardensOnQuailId = "b2c48ce7-11cb-4216-afdb-f2429ccae81f";

  // Map of slug to proper published date (based on title month/year)
  const dateMapping: Record<string, string> = {
    // 2023 newsletters
    "december-2023-newsletter": "2023-12-01 12:00:00",

    // 2024 newsletters
    "january-2024-newsletter": "2024-01-01 12:00:00",
    "february-2024": "2024-02-01 12:00:00",
    "march-2024-newsletter": "2024-03-01 12:00:00",
    "april-2024-newsletter": "2024-04-01 12:00:00",
    "may-2024-newsletter": "2024-05-01 12:00:00",
    "june-2024-newsletter": "2024-06-01 12:00:00",
    "july-2024-newsletter": "2024-07-01 12:00:00",
    "september-2024-newsletter": "2024-09-01 12:00:00",
    "october-24-newsletter": "2024-10-01 12:00:00",
    "november-24-newsletter": "2024-11-01 12:00:00",
    "december-24-newsletter": "2024-12-01 12:00:00",

    // 2025 newsletters
    "january-25-newsletter": "2025-01-01 12:00:00",
    "february-25-newsletter": "2025-02-01 12:00:00",
    "april-25-newsletter": "2025-04-01 12:00:00",
    "may-25-newsletter": "2025-05-01 12:00:00",
    "june-25-newsletter": "2025-06-01 12:00:00",
    "july-25-n": "2025-07-01 12:00:00",
  };

  let updatedDates = 0;
  for (const [slug, date] of Object.entries(dateMapping)) {
    try {
      await db
        .update(posts)
        .set({ publishedAt: new Date(date) })
        .where(
          and(
            eq(posts.slug, slug),
            eq(posts.communityId, gardensOnQuailId)
          )
        );
      console.log(`  ✓ Updated ${slug} to ${date}`);
      updatedDates++;
    } catch (error) {
      console.error(`  ✗ Failed to update ${slug}:`, error);
    }
  }
  console.log(`  Updated ${updatedDates} newsletter dates\n`);

  // ============================================
  // 2. Find missing attachments from Webflow
  // ============================================
  console.log("2. Checking for missing newsletter attachments...");

  // Get all newsletters without attachments using storage methods
  const allPosts = await storage.getPosts({
    published: true,
    tags: ["newsletter"],
  });

  const newslettersWithoutAttachments = [];
  for (const post of allPosts) {
    const attachments = await storage.getPostAttachments(post.id);
    if (attachments.length === 0) {
      const community = await storage.getCommunityById(post.communityId!);
      newslettersWithoutAttachments.push({
        id: post.id,
        slug: post.slug,
        title: post.title,
        community_name: community?.name || "Unknown",
      });
    }
  }

  console.log(`  Found ${newslettersWithoutAttachments.length} newsletters without attachments:`);
  newslettersWithoutAttachments.forEach((row) => {
    console.log(`    - ${row.community_name}: ${row.title} (${row.slug})`);
  });
  console.log("  Note: These newsletters should be manually reviewed to see if PDFs exist.\n");

  // ============================================
  // 3. Update file sizes for existing attachments
  // ============================================
  console.log("3. Fetching file sizes for existing attachments...");

  // Get all attachments for newsletter posts that are missing size_bytes
  const allNewsletters = await storage.getPosts({ tags: ["newsletter"] });
  const attachmentsToUpdate: Array<{ id: string; filename: string; url: string }> = [];

  for (const post of allNewsletters) {
    const attachments = await storage.getPostAttachments(post.id);
    for (const attachment of attachments) {
      if (!attachment.sizeBytes && attachment.url) {
        attachmentsToUpdate.push({
          id: attachment.id,
          filename: attachment.filename,
          url: attachment.url,
        });
      }
    }
  }

  console.log(`  Found ${attachmentsToUpdate.length} attachments missing file sizes`);

  let updatedSizes = 0;
  let failedSizes = 0;

  for (const attachment of attachmentsToUpdate) {
    try {
      // Fetch the file headers to get content-length
      const response = await fetch(attachment.url, { method: "HEAD" });

      if (response.ok) {
        const contentLength = response.headers.get("content-length");
        if (contentLength) {
          const sizeBytes = parseInt(contentLength, 10);

          await db
            .update(postAttachments)
            .set({ sizeBytes })
            .where(eq(postAttachments.id, attachment.id));

          const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);
          console.log(`  ✓ Updated ${attachment.filename}: ${sizeMB} MB`);
          updatedSizes++;
        } else {
          console.log(`  ⚠ No content-length for ${attachment.filename}`);
          failedSizes++;
        }
      } else {
        console.log(`  ✗ Failed to fetch ${attachment.filename}: ${response.status}`);
        failedSizes++;
      }
    } catch (error) {
      console.error(`  ✗ Error fetching ${attachment.filename}:`, error);
      failedSizes++;
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`\n  Updated ${updatedSizes} file sizes`);
  if (failedSizes > 0) {
    console.log(`  Failed to update ${failedSizes} file sizes`);
  }

  // ============================================
  // 4. Verify latest newsletter for each community
  // ============================================
  console.log("\n4. Verifying latest newsletters for each community...");

  const communities = await storage.getCommunities();

  for (const community of communities) {
    const communityPosts = await storage.getPosts({
      published: true,
      communityId: community.id,
      tags: ["newsletter"],
    });

    const latestPost = communityPosts
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      })[0];

    if (latestPost) {
      const attachments = await storage.getPostAttachments(latestPost.id);
      const hasAttachment = attachments.length > 0;
      const publishedDate = latestPost.publishedAt
        ? new Date(latestPost.publishedAt).toLocaleDateString()
        : "Not set";

      console.log(
        `  ${community.name}:\n    Latest: "${latestPost.title}"\n    Published: ${publishedDate}\n    Attachment: ${hasAttachment ? "✓" : "✗"}\n`
      );
    } else {
      console.log(`  ${community.name}: No newsletters found\n`);
    }
  }

  console.log("✅ Newsletter fixes completed!");
}

// Run the script
fixNewsletterIssues()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
