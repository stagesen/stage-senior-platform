import { db } from "../server/db";
import { communities, galleries, images, galleryImages } from "@shared/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const COMMUNITY_SLUG = "the-gardens-on-quail";

/**
 * Manually defined image data from the existing gallery
 * You can customize this data structure based on what you find on the website
 */
const galleryData = [
  {
    title: "Beautiful Grounds & Exterior",
    description: "Our secure courtyard, heated walkways and scenic gardens",
    category: "environment",
    hero: true,
    images: [
      {
        url: "https://cdn.prod.website-files.com/63641f0f9c16993a52f2c40d/637e54c5592ebd694776e5ac_aerial-square.webp",
        alt: "Aerial view of Gardens on Quail",
        caption: "Aerial photograph of our community in Arvada",
      },
      {
        url: "https://cdn.prod.website-files.com/63641f0f9c16993a52f2c40d/637bd5887d0ced60507e9f3e_courtyard.webp",
        alt: "Courtyard at Gardens on Quail",
        caption: "Beautiful courtyard with walking paths",
      },
      {
        url: "https://cdn.prod.website-files.com/63641f0f9c16993a52f2c40d/638673f92bbfdd5598a65c8b_about-us-quail.webp",
        alt: "Front entrance of Gardens on Quail",
        caption: "Welcoming front entrance",
      },
    ],
  },
  {
    title: "Community Amenities",
    description: "Explore our inviting common areas and amenities",
    category: "amenities",
    hero: false,
    images: [
      // Add images for amenities like library, salon, fitness center, etc.
    ],
  },
  {
    title: "Dining Experience",
    description: "Restaurant-style dining with fresh, seasonal cuisine",
    category: "dining",
    hero: false,
    images: [
      // Add dining images
    ],
  },
  {
    title: "Residences",
    description: "Comfortable, well-appointed apartments and suites",
    category: "apartments",
    hero: false,
    images: [
      // Add apartment/suite images
    ],
  },
  {
    title: "Activities & Events",
    description: "Engaging programs and social events for residents",
    category: "activities",
    hero: false,
    images: [
      // Add activity images
    ],
  },
];

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
              imageUrl.includes('.png') ? 'image/png' : 'image/jpeg',
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

  console.log(`   Gallery ID: ${gallery.id}`);

  // Create and link images
  let sortOrder = 1;
  for (const imageData of galleryInfo.images) {
    try {
      console.log(`   📷 Adding image: ${imageData.alt || imageData.url}`);

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

      console.log(`   ✓ Image added (${sortOrder - 1}/${galleryInfo.images.length})`);
    } catch (error) {
      console.error(`   ✗ Failed to add image:`, error);
    }
  }

  console.log(`✅ Gallery "${galleryInfo.title}" created with ${galleryInfo.images.length} images`);
}

/**
 * Main import function
 */
async function main() {
  console.log("╔═══════════════════════════════════════════════╗");
  console.log("║  Gardens on Quail - Gallery Import Tool      ║");
  console.log("╚═══════════════════════════════════════════════╝\n");

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
  console.log(`\n📊 Galleries to import: ${galleryData.length}`);

  // Count total images
  const totalImages = galleryData.reduce((sum, g) => sum + g.images.length, 0);
  console.log(`📸 Total images: ${totalImages}\n`);

  // Create galleries
  let successCount = 0;
  for (const galleryInfo of galleryData) {
    if (galleryInfo.images.length === 0) {
      console.log(`\n⏭️  Skipping "${galleryInfo.title}" (no images)`);
      continue;
    }

    try {
      await createGallery(galleryInfo, community.id);
      successCount++;
    } catch (error) {
      console.error(`\n❌ Failed to create gallery "${galleryInfo.title}":`, error);
    }
  }

  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log(`║  Import Complete!                             ║`);
  console.log(`║  Galleries created: ${successCount}/${galleryData.length}                      ║`);
  console.log("╚═══════════════════════════════════════════════╝\n");
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
