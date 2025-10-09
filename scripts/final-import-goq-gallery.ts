import { db } from "../server/db";
import { communities, galleries, images, galleryImages } from "@shared/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { galleryData } from "../goq-gallery-import-data";

const COMMUNITY_SLUG = "the-gardens-on-quail";

/**
 * Creates an image record in the database
 */
async function createImageRecord(
  imageUrl: string,
  alt: string,
  uploadedBy: number = 1
): Promise<string> {
  const imageId = uuidv4();

  await db.insert(images).values({
    id: imageId,
    objectKey: `remote/${imageId}`, // Mark as remote URL
    url: imageUrl,
    alt: alt || null,
    width: null, // You can add actual dimensions if needed
    height: null,
    sizeBytes: null,
    mimeType: imageUrl.includes('.webp') ? 'image/webp' :
              imageUrl.includes('.png') ? 'image/png' :
              imageUrl.includes('.svg') ? 'image/svg+xml' : 'image/jpeg',
    uploadedBy: uploadedBy,
  });

  return imageId;
}

/**
 * Creates a gallery with its images
 */
async function createGallery(
  galleryInfo: typeof galleryData[0],
  communityId: string
): Promise<void> {
  console.log(`\n📁 Creating gallery: ${galleryInfo.title}`);
  console.log(`   Category: ${galleryInfo.category}`);
  console.log(`   Hero: ${galleryInfo.hero ? 'Yes' : 'No'}`);
  console.log(`   Images: ${galleryInfo.images.length}`);

  // Create the gallery
  const [gallery] = await db
    .insert(galleries)
    .values({
      title: galleryInfo.title,
      description: galleryInfo.description || null,
      category: galleryInfo.category,
      communityId: communityId,
      active: true,
      published: true,
      hero: galleryInfo.hero,
    })
    .returning();

  console.log(`   ✓ Gallery ID: ${gallery.id}`);

  // Create and link images
  let successCount = 0;
  let sortOrder = 1;

  for (const imageData of galleryInfo.images) {
    try {
      const imageId = await createImageRecord(
        imageData.url,
        imageData.alt
      );

      // Link image to gallery
      await db.insert(galleryImages).values({
        galleryId: gallery.id,
        imageId: imageId,
        caption: imageData.caption || imageData.alt || null,
        sortOrder: sortOrder++,
      });

      successCount++;
    } catch (error) {
      console.error(`   ✗ Failed to add image ${sortOrder}:`, error);
    }
  }

  console.log(`   ✓ Successfully added ${successCount}/${galleryInfo.images.length} images`);
}

/**
 * Main import function
 */
async function main() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  Gardens on Quail - Gallery Import                       ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  // Get the community
  const [community] = await db
    .select()
    .from(communities)
    .where(eq(communities.slug, COMMUNITY_SLUG))
    .limit(1);

  if (!community) {
    throw new Error(`❌ Community not found: ${COMMUNITY_SLUG}`);
  }

  console.log(`🏘️  Community: ${community.name}`);
  console.log(`🆔 ID: ${community.id}`);

  // Count total images
  const totalImages = galleryData.reduce((sum, g) => sum + g.images.length, 0);
  console.log(`\n📊 Galleries to import: ${galleryData.length}`);
  console.log(`📸 Total images: ${totalImages}`);

  // Ask for confirmation
  console.log("\n⚠️  This will create new galleries and image records.");
  console.log("   Make sure you haven't already imported this data!");

  // Create galleries
  let successCount = 0;
  let totalImagesImported = 0;

  for (const galleryInfo of galleryData) {
    // Skip the "General Gallery" category with miscellaneous images
    if (galleryInfo.category === "general") {
      console.log(`\n⏭️  Skipping "${galleryInfo.title}" (general category)`);
      continue;
    }

    try {
      await createGallery(galleryInfo, community.id);
      successCount++;
      totalImagesImported += galleryInfo.images.length;
    } catch (error) {
      console.error(`\n❌ Failed to create gallery "${galleryInfo.title}":`, error);
    }
  }

  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log(`║  Import Complete!                                         ║`);
  console.log(`║  Galleries created: ${successCount}/${galleryData.length - 1} (excluding general)     ║`);
  console.log(`║  Images imported: ${totalImagesImported}                                    ║`);
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("\n✅ You can now view the galleries in your admin panel!");
  console.log("📍 URL: https://your-domain.com/admin/galleries");
}

// Run the script
main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
