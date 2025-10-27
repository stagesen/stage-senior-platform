import fs from 'fs';
import path from 'path';
import { db } from '../server/db';
import { contentAssets } from '../shared/schema';

interface ResourceArticle {
  title: string;
  slug: string;
  category: string;
  description: string;
  sortOrder: number;
  content: string;
}

/**
 * Import resource articles from JSON file
 */
async function importResourceArticles() {
  console.log('📚 Importing resource articles...\n');

  try {
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'resource_articles.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const articles: ResourceArticle[] = JSON.parse(jsonContent);

    console.log(`Found ${articles.length} articles to import\n`);

    for (const article of articles) {
      console.log(`  Processing: ${article.title}`);

      // Insert or update the article
      await db.insert(contentAssets).values({
        slug: article.slug,
        title: article.title,
        description: article.description,
        category: article.category,
        articleContent: article.content,
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
          sortOrder: article.sortOrder,
          updatedAt: new Date(),
        },
      });

      console.log(`  ✅ ${article.title} imported`);
    }

    console.log('\n✅ All resource articles imported successfully!');
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importResourceArticles();
