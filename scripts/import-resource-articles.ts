import fs from 'fs';
import path from 'path';
import { db } from '../server/db';
import { contentAssets, images } from '../shared/schema';
import { eq, or } from 'drizzle-orm';

interface ResourceArticle {
  title: string;
  slug: string;
  category: string;
  description: string;
  sortOrder: number;
  content: string;
}

// Mapping of article slugs to featured image URLs
const ARTICLE_IMAGES: Record<string, string> = {
  'true-cost-senior-living-colorado': 'https://images.unsplash.com/photo-1554224311-beee4ece0a04?w=1200&q=80', // Calculator/financial planning
  '5-signs-time-for-senior-living': 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=1200&q=80', // Senior care/family support
  'fall-prevention-safer-environment': 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=80', // Safe home environment
  'social-connection-healthy-aging': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80', // Social connection/community
  'understanding-memory-care-guide': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80', // Memory care/support
  'making-the-move-senior-living-guide': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80', // Moving/new home
};

/**
 * Helper function to create or find an image record
 */
async function getOrCreateImage(url: string, alt: string): Promise<string | null> {
  if (!url) return null;

  try {
    // Check if image already exists
    const existing = await db.select().from(images).where(
      or(eq(images.url, url), eq(images.objectKey, url))
    ).limit(1);

    if (existing.length > 0) {
      return existing[0].id;
    }

    // Create new image record
    const [image] = await db.insert(images).values({
      url: url,
      objectKey: url,
      alt: alt,
      uploadedBy: 1, // System user
    }).returning();

    return image.id;
  } catch (error) {
    console.error(`  ⚠️  Failed to create image: ${error}`);
    return null;
  }
}

/**
 * Import resource articles from JSON file
 */
async function importResourceArticles() {
  console.log('📚 Importing resource articles with images...\n');

  try {
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'resource_articles.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const articles: ResourceArticle[] = JSON.parse(jsonContent);

    console.log(`Found ${articles.length} articles to import\n`);

    for (const article of articles) {
      console.log(`  Processing: ${article.title}`);

      // Get or create featured image
      const imageUrl = ARTICLE_IMAGES[article.slug];
      let featuredImageId: string | null = null;

      if (imageUrl) {
        featuredImageId = await getOrCreateImage(imageUrl, article.title);
        if (featuredImageId) {
          console.log(`    ✓ Featured image added`);
        }
      }

      // Insert or update the article
      await db.insert(contentAssets).values({
        slug: article.slug,
        title: article.title,
        description: article.description,
        category: article.category,
        articleContent: article.content,
        featuredImageId: featuredImageId,
        sortOrder: article.sortOrder,
        active: true,
        downloadCount: 0,
      }).onConflictDoUpdate({
        target: contentAssets.slug,
        set: {
          title: article.title,
          description: article.description,
          category: article.category,
          articleContent: article.content,
          featuredImageId: featuredImageId,
          sortOrder: article.sortOrder,
          updatedAt: new Date(),
        },
      });

      console.log(`  ✅ ${article.title} imported`);
    }

    console.log('\n✅ All resource articles imported successfully with featured images!');
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importResourceArticles();
