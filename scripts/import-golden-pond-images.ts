import { pool } from '../server/db';
import * as cheerio from 'cheerio';

const GOLDEN_POND_GALLERY_URL = 'https://www.goldenpond.com/our-community/photo-gallery';

interface ScrapedImage {
  url: string;
  alt: string;
  category: string;
}

async function fetchGoldenPondImages(): Promise<ScrapedImage[]> {
  console.log('Fetching Golden Pond photo gallery...');

  const response = await fetch(GOLDEN_POND_GALLERY_URL);
  const html = await response.text();
  const $ = cheerio.load(html);

  const images: ScrapedImage[] = [];

  // Find all images on the page
  $('img').each((_, elem) => {
    const src = $(elem).attr('src');
    const alt = $(elem).attr('alt') || '';

    if (!src || src.includes('logo') || src.includes('icon')) return;

    // Make URL absolute
    const absoluteUrl = src.startsWith('http') ? src : `https://www.goldenpond.com${src}`;

    // Categorize based on alt text and context
    let category = 'general';
    const altLower = alt.toLowerCase();

    if (altLower.includes('floor plan') || altLower.includes('layout') || altLower.includes('studio') ||
        altLower.includes('bedroom') || altLower.includes('apartment plan')) {
      category = 'floor_plan';
    } else if (altLower.includes('dining') || altLower.includes('food') || altLower.includes('meal') ||
               altLower.includes('restaurant')) {
      category = 'dining';
    } else if (altLower.includes('activity') || altLower.includes('event') || altLower.includes('concert') ||
               altLower.includes('bowling') || altLower.includes('dance') || altLower.includes('game')) {
      category = 'activities';
    } else if (altLower.includes('outdoor') || altLower.includes('pond') || altLower.includes('garden') ||
               altLower.includes('patio') || altLower.includes('pergola') || altLower.includes('aerial') ||
               altLower.includes('mountain') || altLower.includes('entrance')) {
      category = 'grounds';
    } else if (altLower.includes('apartment') || altLower.includes('bedroom') || altLower.includes('kitchenette') ||
               altLower.includes('bathroom') || altLower.includes('living')) {
      category = 'apartments';
    } else if (altLower.includes('library') || altLower.includes('foyer') || altLower.includes('workout') ||
               altLower.includes('exercise') || altLower.includes('snack') || altLower.includes('amenity')) {
      category = 'amenities';
    }

    images.push({ url: absoluteUrl, alt, category });
  });

  console.log(`Found ${images.length} images`);
  return images;
}

async function importFloorPlanImages(images: ScrapedImage[]) {
  console.log('\n=== IMPORTING FLOOR PLAN IMAGES ===\n');

  const floorPlanImages = images.filter(img => img.category === 'floor_plan');
  console.log(`Found ${floorPlanImages.length} floor plan images`);

  // Get Golden Pond community ID
  const community = await pool.query(
    `SELECT id FROM communities WHERE slug = 'golden-pond'`
  );
  const communityId = community.rows[0].id;

  // Get all floor plans
  const floorPlans = await pool.query(
    `SELECT id, name FROM floor_plans
     WHERE community_id = $1 AND active = true
     ORDER BY starting_price`,
    [communityId]
  );

  console.log(`\nFloor plans to match (${floorPlans.rows.length}):`);
  floorPlans.rows.forEach(fp => console.log(`  - ${fp.name}`));

  console.log(`\nAvailable floor plan images (${floorPlanImages.length}):`);
  floorPlanImages.forEach(img => console.log(`  - ${img.alt}`));

  // Manual matching based on the floor plan names
  const matches = [
    { name: 'Independent Living – One Bedroom', keywords: ['one bedroom', '1 bedroom', '1br'] },
    { name: 'Independent Living – Two Bedroom', keywords: ['two bedroom', '2 bedroom', '2br'] },
    { name: 'Assisted Living – Studio', keywords: ['studio', 'assisted studio'] },
    { name: 'Assisted Living – One Bedroom', keywords: ['assisted', 'one bedroom', '1 bedroom'] },
    { name: 'Assisted Living – Two Bedroom', keywords: ['assisted', 'two bedroom', '2 bedroom'] },
    { name: 'Memory Care – The Meadows Private Studio', keywords: ['memory', 'meadows', 'studio'] },
  ];

  for (const floorPlan of floorPlans.rows) {
    const match = matches.find(m => m.name === floorPlan.name);
    if (!match) continue;

    // Find matching image
    const matchedImage = floorPlanImages.find(img => {
      const altLower = img.alt.toLowerCase();
      return match.keywords.some(kw => altLower.includes(kw));
    });

    if (matchedImage) {
      console.log(`\n✅ Matched: ${floorPlan.name}`);
      console.log(`   Image: ${matchedImage.alt}`);
      console.log(`   URL: ${matchedImage.url}`);

      // Insert image into images table
      // Extract object_key from URL (last part of path)
      const objectKey = matchedImage.url.split('/').pop() || `floor-plan-${floorPlan.id}`;
      const imageResult = await pool.query(
        `INSERT INTO images (url, alt, object_key)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [matchedImage.url, matchedImage.alt, objectKey]
      );

      const imageId = imageResult.rows[0].id;

      // Link to floor plan
      await pool.query(
        `UPDATE floor_plans SET image_id = $1 WHERE id = $2`,
        [imageId, floorPlan.id]
      );

      console.log(`   ✅ Linked image ${imageId} to floor plan`);
    } else {
      console.log(`\n⚠️  No match found for: ${floorPlan.name}`);
    }
  }
}

async function importGalleryImages(images: ScrapedImage[]) {
  console.log('\n\n=== IMPORTING GALLERY IMAGES ===\n');

  // Get Golden Pond community ID
  const community = await pool.query(
    `SELECT id FROM communities WHERE slug = 'golden-pond'`
  );
  const communityId = community.rows[0].id;

  // Get all galleries
  const galleries = await pool.query(
    `SELECT id, title, category FROM galleries
     WHERE community_id = $1 AND active = true
     ORDER BY id`,
    [communityId]
  );

  const galleryMapping = {
    'Activities & Events': 'activities',
    'Beautiful Grounds & Surroundings': 'grounds',
    'Apartment Interiors': 'apartments',
    'Dining & Culinary': 'dining',
    'Apartments & Suites': 'apartments',
    'Amenities & Spaces': 'amenities',
  };

  for (const gallery of galleries.rows) {
    const categoryKey = galleryMapping[gallery.title as keyof typeof galleryMapping];
    if (!categoryKey) {
      console.log(`⚠️  Skipping gallery: ${gallery.title} (no mapping)`);
      continue;
    }

    // Get images for this category
    const categoryImages = images.filter(img => img.category === categoryKey);

    console.log(`\n📸 Gallery: ${gallery.title}`);
    console.log(`   Category: ${categoryKey}`);
    console.log(`   Found ${categoryImages.length} images`);

    if (categoryImages.length === 0) {
      console.log(`   ⚠️  No images found for this category`);
      continue;
    }

    // Take up to 6 images per gallery
    const selectedImages = categoryImages.slice(0, 6);

    // Insert images into images table
    const galleryImagesData = [];
    for (const img of selectedImages) {
      // Extract object_key from URL (last part of path)
      const objectKey = img.url.split('/').pop() || `gallery-${Date.now()}-${Math.random()}`;
      const imageResult = await pool.query(
        `INSERT INTO images (url, alt, object_key)
         VALUES ($1, $2, $3)
         RETURNING id, url, alt`,
        [img.url, img.alt, objectKey]
      );

      const imageData = imageResult.rows[0];
      galleryImagesData.push({
        id: imageData.id,
        url: imageData.url,
        alt: imageData.alt,
        caption: img.alt
      });

      console.log(`   ✅ Added: ${img.alt.substring(0, 60)}...`);
    }

    // Update gallery with images
    await pool.query(
      `UPDATE galleries SET images = $1 WHERE id = $2`,
      [JSON.stringify(galleryImagesData), gallery.id]
    );

    console.log(`   ✅ Updated gallery with ${galleryImagesData.length} images`);
  }
}

async function main() {
  try {
    console.log('🚀 Starting Golden Pond image import...\n');

    // Fetch images from website
    const images = await fetchGoldenPondImages();

    // Import floor plan images
    await importFloorPlanImages(images);

    // Import gallery images
    await importGalleryImages(images);

    console.log('\n\n✅ Golden Pond image import complete!\n');

    // Verify results
    const community = await pool.query(
      `SELECT id FROM communities WHERE slug = 'golden-pond'`
    );
    const communityId = community.rows[0].id;

    const floorPlanStats = await pool.query(
      `SELECT
        COUNT(*) as total,
        COUNT(image_id) as with_images
       FROM floor_plans
       WHERE community_id = $1 AND active = true`,
      [communityId]
    );

    const galleryStats = await pool.query(
      `SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN jsonb_array_length(images) > 0 THEN 1 END) as with_images
       FROM galleries
       WHERE community_id = $1 AND active = true`,
      [communityId]
    );

    console.log('📊 RESULTS:');
    console.log(`   Floor Plans: ${floorPlanStats.rows[0].with_images}/${floorPlanStats.rows[0].total} with images`);
    console.log(`   Galleries: ${galleryStats.rows[0].with_images}/${galleryStats.rows[0].total} populated`);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

main();
