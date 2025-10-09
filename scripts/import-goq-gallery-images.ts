import { db } from "../server/db";
import { communities, galleries, images, galleryImages } from "@shared/schema";
import { eq } from "drizzle-orm";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const GALLERY_URL = "https://www.gardensonquail.com/our-community/photo-gallery";
const COMMUNITY_SLUG = "the-gardens-on-quail";

interface ScrapedImage {
  url: string;
  alt: string;
  category?: string;
}

interface GalleryCategory {
  title: string;
  description?: string;
  category: string;
  images: ScrapedImage[];
}

/**
 * Scrapes the Gardens on Quail photo gallery page and extracts images
 */
async function scrapeGalleryImages(): Promise<ScrapedImage[]> {
  console.log(`Fetching gallery page: ${GALLERY_URL}`);

  const response = await fetch(GALLERY_URL);
  const html = await response.text();
  const $ = cheerio.load(html);

  const images: ScrapedImage[] = [];

  // Extract all images from the gallery
  // Look for common gallery image selectors
  $('img').each((_, element) => {
    const $img = $(element);
    const src = $img.attr('src') || $img.attr('data-src');
    const alt = $img.attr('alt') || '';

    // Filter out very small images (likely icons or logos)
    const width = parseInt($img.attr('width') || '0');
    const height = parseInt($img.attr('height') || '0');

    if (src && !src.includes('logo') && !src.includes('icon') && (width > 200 || height > 200 || (!width && !height))) {
      // Clean up the URL
      let cleanUrl = src;
      if (src.startsWith('//')) {
        cleanUrl = 'https:' + src;
      } else if (src.startsWith('/')) {
        cleanUrl = 'https://www.gardensonquail.com' + src;
      }

      images.push({
        url: cleanUrl,
        alt: alt || 'Gardens on Quail photo',
      });
    }
  });

  console.log(`Found ${images.length} images`);
  return images;
}

/**
 * Categorizes images based on their alt text and URL patterns
 */
function categorizeImages(images: ScrapedImage[]): GalleryCategory[] {
  const categories: { [key: string]: GalleryCategory } = {
    exterior: {
      title: "Beautiful Grounds & Exterior",
      description: "See our secure courtyard, heated walkways and scenic gardens.",
      category: "environment",
      images: [],
    },
    interior: {
      title: "Community Amenities",
      description: "Explore our inviting common areas and amenities.",
      category: "amenities",
      images: [],
    },
    dining: {
      title: "Dining Experience",
      description: "Restaurant-style dining with fresh, seasonal cuisine.",
      category: "dining",
      images: [],
    },
    apartments: {
      title: "Residences",
      description: "Comfortable, well-appointed apartments and suites.",
      category: "apartments",
      images: [],
    },
    activities: {
      title: "Activities & Events",
      description: "Engaging programs and social events for residents.",
      category: "activities",
      images: [],
    },
    general: {
      title: "Photo Gallery",
      description: "Explore life at Gardens on Quail.",
      category: "general",
      images: [],
    },
  };

  for (const image of images) {
    const lowerAlt = image.alt.toLowerCase();
    const lowerUrl = image.url.toLowerCase();

    // Categorize based on keywords
    if (lowerAlt.includes('aerial') || lowerAlt.includes('exterior') || lowerAlt.includes('courtyard') ||
        lowerAlt.includes('garden') || lowerAlt.includes('outdoor') || lowerUrl.includes('aerial') ||
        lowerUrl.includes('courtyard')) {
      categories.exterior.images.push({ ...image, category: 'environment' });
    } else if (lowerAlt.includes('dining') || lowerAlt.includes('meal') || lowerAlt.includes('restaurant') ||
               lowerAlt.includes('chef') || lowerUrl.includes('dining')) {
      categories.dining.images.push({ ...image, category: 'dining' });
    } else if (lowerAlt.includes('apartment') || lowerAlt.includes('suite') || lowerAlt.includes('bedroom') ||
               lowerAlt.includes('residence') || lowerUrl.includes('apartment') || lowerUrl.includes('suite')) {
      categories.apartments.images.push({ ...image, category: 'apartments' });
    } else if (lowerAlt.includes('activit') || lowerAlt.includes('event') || lowerAlt.includes('resident') ||
               lowerAlt.includes('enjoy') || lowerUrl.includes('activity')) {
      categories.activities.images.push({ ...image, category: 'activities' });
    } else if (lowerAlt.includes('lobby') || lowerAlt.includes('lounge') || lowerAlt.includes('library') ||
               lowerAlt.includes('salon') || lowerAlt.includes('fitness') || lowerAlt.includes('chapel') ||
               lowerAlt.includes('interior') || lowerUrl.includes('interior') || lowerUrl.includes('amenity')) {
      categories.interior.images.push({ ...image, category: 'amenities' });
    } else {
      categories.general.images.push({ ...image, category: 'general' });
    }
  }

  // Filter out empty categories
  return Object.values(categories).filter(cat => cat.images.length > 0);
}

/**
 * Downloads an image and returns a buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

/**
 * Gets image dimensions from buffer
 */
async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
  // This is a simple implementation - you might want to use a library like 'sharp' for better performance
  // For now, we'll return default dimensions
  return { width: 1920, height: 1080 };
}

/**
 * Uploads an image to the database
 */
async function uploadImageToDb(
  imageUrl: string,
  alt: string,
  communityId: string,
  uploadedBy: number = 1
): Promise<string> {
  try {
    console.log(`  Downloading: ${imageUrl}`);
    const buffer = await downloadImage(imageUrl);
    const dimensions = await getImageDimensions(buffer);

    // Generate a unique filename
    const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
    const filename = `goq-gallery-${uuidv4()}${ext}`;
    const objectKey = `uploads/${filename}`;

    // For this script, we'll store the URL as-is since we're working with remote images
    // In production, you'd upload to your storage service (S3, etc.)

    const imageId = uuidv4();

    await db.insert(images).values({
      id: imageId,
      objectKey: objectKey,
      url: imageUrl, // Using the original URL for now
      alt: alt || null,
      width: dimensions.width,
      height: dimensions.height,
      sizeBytes: buffer.length,
      mimeType: `image/${ext.replace('.', '')}`,
      uploadedBy: uploadedBy,
    });

    console.log(`  ✓ Uploaded: ${imageId}`);
    return imageId;
  } catch (error) {
    console.error(`  ✗ Failed to upload ${imageUrl}:`, error);
    throw error;
  }
}

/**
 * Creates a gallery with images
 */
async function createGallery(
  category: GalleryCategory,
  communityId: string
): Promise<void> {
  console.log(`\nCreating gallery: ${category.title}`);

  // Create the gallery
  const [gallery] = await db
    .insert(galleries)
    .values({
      title: category.title,
      description: category.description || null,
      category: category.category,
      communityId: communityId,
      active: true,
      published: true,
      hero: category.category === 'environment', // Make exterior the hero gallery
    })
    .returning();

  console.log(`Gallery created: ${gallery.id}`);

  // Upload and link images
  let sortOrder = 1;
  for (const image of category.images) {
    try {
      const imageId = await uploadImageToDb(
        image.url,
        image.alt,
        communityId
      );

      // Link image to gallery
      await db.insert(galleryImages).values({
        galleryId: gallery.id,
        imageId: imageId,
        caption: image.alt || null,
        sortOrder: sortOrder++,
      });
    } catch (error) {
      console.error(`Skipping image due to error:`, error);
      // Continue with other images
    }
  }

  console.log(`✓ Gallery "${category.title}" created with ${category.images.length} images`);
}

/**
 * Main import function
 */
async function main() {
  console.log("=== Gardens on Quail Gallery Import ===\n");

  // Get the community
  const [community] = await db
    .select()
    .from(communities)
    .where(eq(communities.slug, COMMUNITY_SLUG))
    .limit(1);

  if (!community) {
    throw new Error(`Community not found: ${COMMUNITY_SLUG}`);
  }

  console.log(`Found community: ${community.name} (${community.id})\n`);

  // Scrape images from the website
  const scrapedImages = await scrapeGalleryImages();

  if (scrapedImages.length === 0) {
    console.log("No images found on the gallery page.");
    return;
  }

  // Categorize images
  const categories = categorizeImages(scrapedImages);

  console.log("\nImage categories:");
  for (const category of categories) {
    console.log(`  - ${category.title}: ${category.images.length} images`);
  }

  // Create galleries for each category
  for (const category of categories) {
    await createGallery(category, community.id);
  }

  console.log("\n✓ Import complete!");
}

// Run the script
main()
  .then(() => {
    console.log("\nDone!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
