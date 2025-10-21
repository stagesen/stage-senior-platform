import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { blogPosts } from '../shared/schema';
import { sql } from 'drizzle-orm';

const dbUrl = process.env.DATABASE_URL!;
const sqlClient = neon(dbUrl);
const db = drizzle(sqlClient);

// Define common tag categories and keywords
const TAG_KEYWORDS = {
  // Activities and events
  activities: ['activity', 'activities', 'event', 'program', 'exercise', 'class', 'workshop'],
  wellness: ['health', 'wellness', 'fitness', 'therapy', 'medical', 'care', 'nursing'],
  dining: ['dining', 'food', 'meal', 'restaurant', 'menu', 'nutrition', 'chef'],
  social: ['social', 'community', 'gathering', 'party', 'celebration', 'friends', 'family'],
  entertainment: ['music', 'entertainment', 'performance', 'show', 'concert', 'movie', 'game'],
  arts: ['art', 'craft', 'painting', 'creative', 'gallery', 'exhibit'],
  education: ['education', 'learning', 'seminar', 'presentation', 'lecture', 'training'],
  outdoors: ['outdoor', 'garden', 'patio', 'nature', 'park', 'walk'],
  holidays: ['holiday', 'christmas', 'thanksgiving', 'easter', 'halloween', 'valentine'],

  // Care types
  'memory-care': ['memory', 'alzheimer', 'dementia', 'cognitive'],
  'assisted-living': ['assisted living', 'assistance', 'support', 'independence'],
  'independent-living': ['independent', 'active', 'retirement'],

  // Topics
  tips: ['tip', 'advice', 'guide', 'how to', 'help', 'suggestion'],
  news: ['news', 'announcement', 'update', 'new'],
  safety: ['safety', 'security', 'emergency', 'protection'],
  technology: ['technology', 'tech', 'digital', 'computer', 'internet', 'online'],
  volunteer: ['volunteer', 'volunteering', 'service', 'giving back'],
};

// Seasonal tags
const SEASONAL_TAGS = {
  spring: ['spring', 'march', 'april', 'may', 'easter'],
  summer: ['summer', 'june', 'july', 'august'],
  fall: ['fall', 'autumn', 'september', 'october', 'november', 'thanksgiving', 'halloween'],
  winter: ['winter', 'december', 'january', 'february', 'christmas', 'holiday'],
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function generateTags(post: any): string[] {
  const tags = new Set<string>();

  // Combine all text for analysis
  const text = [
    post.title || '',
    post.summary || '',
    stripHtml(post.content || '').substring(0, 2000), // First 2000 chars
  ].join(' ').toLowerCase();

  // Always add category as a tag if it exists
  if (post.category) {
    const categoryTag = post.category.toLowerCase().replace(/\s+/g, '-');
    tags.add(categoryTag);
  }

  // Add newsletter tag for newsletters
  if (post.category === 'Newsletter') {
    tags.add('newsletter');
    tags.add('community-update');
  }

  // Analyze content for keyword matches
  Object.entries(TAG_KEYWORDS).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
      tags.add(tag);
    }
  });

  // Check for seasonal tags
  Object.entries(SEASONAL_TAGS).forEach(([season, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
      tags.add(season);
    }
  });

  // Preserve existing meaningful tags
  if (post.tags && Array.isArray(post.tags)) {
    post.tags.forEach((tag: string) => {
      // Keep existing tags that aren't too generic
      if (tag && tag.length > 2) {
        tags.add(tag.toLowerCase());
      }
    });
  }

  // Convert to sorted array and limit to 8 tags max
  return Array.from(tags)
    .sort()
    .slice(0, 8);
}

async function updateBlogTags() {
  console.log('🏷️  Starting blog post tag update based on content...\n');
  console.log('='.repeat(70));

  try {
    // Fetch all blog posts
    const posts = await db.execute(sql`
      SELECT id, slug, title, summary, content, category, tags
      FROM blog_posts
      ORDER BY created_at DESC
    `);

    console.log(`\n📊 Found ${posts.rows.length} blog posts to analyze\n`);

    let updatedCount = 0;
    let unchangedCount = 0;
    let errorCount = 0;

    for (const post of posts.rows) {
      try {
        const oldTags = post.tags || [];
        const newTags = generateTags(post);

        // Check if tags changed
        const oldTagsStr = JSON.stringify([...oldTags].sort());
        const newTagsStr = JSON.stringify([...newTags].sort());

        if (oldTagsStr !== newTagsStr) {
          console.log(`\n📝 Updating: ${post.title}`);
          console.log(`   Old tags: ${oldTags.length > 0 ? oldTags.join(', ') : '(none)'}`);
          console.log(`   New tags: ${newTags.join(', ')}`);

          // Update tags in database
          await db.execute(sql`
            UPDATE blog_posts
            SET tags = ${JSON.stringify(newTags)}::jsonb,
                updated_at = NOW()
            WHERE id = ${post.id}
          `);

          updatedCount++;
        } else {
          unchangedCount++;
        }
      } catch (error) {
        console.error(`   ❌ Error updating "${post.title}":`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('📈 Tag Update Summary:');
    console.log('='.repeat(70));
    console.log(`✅ Updated: ${updatedCount} posts`);
    console.log(`⏭️  Unchanged: ${unchangedCount} posts`);
    console.log(`❌ Errors: ${errorCount} posts`);
    console.log(`📊 Total processed: ${posts.rows.length} posts`);
    console.log('='.repeat(70));

    // Show tag distribution
    console.log('\n🏷️  Tag Distribution After Update:');
    const tagDistribution = await db.execute(sql`
      SELECT
        jsonb_array_elements_text(tags) as tag,
        COUNT(*) as count
      FROM blog_posts
      WHERE tags IS NOT NULL
      GROUP BY tag
      ORDER BY count DESC, tag
      LIMIT 20
    `);

    console.table(tagDistribution.rows);

  } catch (error) {
    console.error('❌ Tag update failed:', error);
    throw error;
  }
}

// Run the update
updateBlogTags()
  .then(() => {
    console.log('\n✅ Tag update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Tag update failed:', error);
    process.exit(1);
  });
