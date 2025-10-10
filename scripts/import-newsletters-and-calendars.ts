import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { posts, postAttachments, communities } from '../shared/schema';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Community mapping based on CSV filenames
const COMMUNITY_MAPPING = {
  'Golden Pond - Newsletters': 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9',
  'Gardens on Quail - Newsletters': 'b2c48ce7-11cb-4216-afdb-f2429ccae81f',
  'Gardens at Columbine - Newsletters': 'dea2cbbe-32da-4774-a85b-5dd9286892ed',
  'Stonebridge Senior - Newsletters': 'd20c45d3-8201-476a-aeb3-9b941f717ccf',
};

// Activity calendar URLs
const CALENDAR_URLS = {
  'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9': 'https://www.goldenpond.com/our-community/life-enrichment',
  'dea2cbbe-32da-4774-a85b-5dd9286892ed': 'https://www.gardensatcolumbine.com/our-community/life-enrichment',
  'b2c48ce7-11cb-4216-afdb-f2429ccae81f': 'https://www.gardensonquail.com/our-community/activities',
  'd20c45d3-8201-476a-aeb3-9b941f717ccf': 'https://www.stonebridgesenior.com/life/activities-calendar',
};

interface NewsletterRow {
  Name: string;
  Slug: string;
  'Published On': string;
  PDF?: string;
  Thumbnail?: string;
  Content?: string;
  Post?: string;
  Date?: string;
}

// Helper to create a slug from a string
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper to extract date from newsletter name
function extractDate(name: string): Date | null {
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                     'july', 'august', 'september', 'october', 'november', 'december'];
  const nameLower = name.toLowerCase();
  
  for (let i = 0; i < monthNames.length; i++) {
    if (nameLower.includes(monthNames[i])) {
      const yearMatch = name.match(/20\d{2}/);
      if (yearMatch) {
        const year = parseInt(yearMatch[0]);
        return new Date(year, i, 1);
      }
    }
  }
  
  return null;
}

// Fetch PDF URLs from activity calendar pages
async function fetchActivityCalendarPDFs(url: string): Promise<string[]> {
  console.log(`  Fetching calendar PDFs from: ${url}`);
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const pdfLinks: string[] = [];
    $('a[href$=".pdf"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        // Make absolute URL if needed
        const absoluteUrl = href.startsWith('http') ? href : new URL(href, url).toString();
        pdfLinks.push(absoluteUrl);
      }
    });
    
    console.log(`  Found ${pdfLinks.length} PDF links`);
    return pdfLinks;
  } catch (error) {
    console.error(`  Error fetching PDFs from ${url}:`, error);
    return [];
  }
}

// Import newsletters from a CSV file
async function importNewslettersFromCSV(filePath: string, communityName: string) {
  console.log(`\n📰 Importing newsletters from: ${filePath}`);
  const communityId = COMMUNITY_MAPPING[communityName as keyof typeof COMMUNITY_MAPPING];
  
  if (!communityId) {
    console.error(`❌ Unknown community: ${communityName}`);
    return;
  }

  const csvContent = readFileSync(filePath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as NewsletterRow[];

  console.log(`  Found ${records.length} newsletters for ${communityName}`);

  for (const record of records) {
    try {
      const slug = createSlug(record.Slug || record.Name);
      const pdfUrl = record.PDF;
      const publishedDate = record['Published On'] ? new Date(record['Published On']) : 
                           record.Date ? new Date(record.Date) :
                           extractDate(record.Name);
      
      // Extract content from HTML if available
      let content = '';
      if (record.Content) {
        const $ = cheerio.load(record.Content);
        content = $.text().trim();
      } else if (record.Post) {
        const $ = cheerio.load(record.Post);
        content = $.text().trim();
      }
      
      if (!content) {
        content = `Read the ${record.Name} newsletter to see what's happening in our community.`;
      }

      // Check if post already exists
      const existingPost = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
      
      if (existingPost.length > 0) {
        console.log(`  ⏭️  Skipping existing: ${record.Name}`);
        continue;
      }

      // Create the post
      const [newPost] = await db.insert(posts).values({
        slug,
        title: record.Name,
        summary: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        content,
        communityId,
        tags: ['newsletter', 'community-update'],
        published: true,
        publishedAt: publishedDate || new Date(),
      }).returning();

      console.log(`  ✅ Created: ${record.Name} (${slug})`);

      // If there's a PDF URL, create an attachment reference
      if (pdfUrl) {
        await db.insert(postAttachments).values({
          postId: newPost.id,
          filename: `${slug}.pdf`,
          originalName: `${record.Name}.pdf`,
          url: pdfUrl,
          mimeType: 'application/pdf',
        });
        console.log(`     📎 Added PDF attachment: ${pdfUrl.substring(0, 60)}...`);
      }
    } catch (error) {
      console.error(`  ❌ Error importing ${record.Name}:`, error);
    }
  }
}

// Import activity calendars from URLs
async function importActivityCalendars() {
  console.log(`\n📅 Importing activity calendars from websites...`);

  for (const [communityId, url] of Object.entries(CALENDAR_URLS)) {
    const [community] = await db.select().from(communities).where(eq(communities.id, communityId)).limit(1);
    
    if (!community) {
      console.log(`  ⚠️  Community not found: ${communityId}`);
      continue;
    }

    console.log(`\n  Processing: ${community.name}`);
    const pdfLinks = await fetchActivityCalendarPDFs(url);

    for (const pdfUrl of pdfLinks) {
      try {
        // Extract filename from URL
        const urlParts = pdfUrl.split('/');
        const filename = urlParts[urlParts.length - 1].replace(/%20/g, ' ');
        const nameWithoutExt = filename.replace('.pdf', '');
        
        // Create a slug
        const slug = createSlug(`${community.slug}-activity-calendar-${nameWithoutExt}`);

        // Check if already exists
        const existingPost = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
        
        if (existingPost.length > 0) {
          console.log(`    ⏭️  Skipping existing calendar: ${filename}`);
          continue;
        }

        // Create post for activity calendar
        const [newPost] = await db.insert(posts).values({
          slug,
          title: `Activity Calendar - ${nameWithoutExt}`,
          summary: `View the activity calendar for ${community.name}.`,
          content: `Download the activity calendar to see all the exciting events and activities planned for our community.`,
          communityId,
          tags: ['activity-calendar', 'events'],
          published: true,
          publishedAt: new Date(),
        }).returning();

        // Add PDF attachment
        await db.insert(postAttachments).values({
          postId: newPost.id,
          filename: filename,
          originalName: filename,
          url: pdfUrl,
          mimeType: 'application/pdf',
        });

        console.log(`    ✅ Created calendar: ${filename}`);
      } catch (error) {
        console.error(`    ❌ Error importing calendar from ${pdfUrl}:`, error);
      }
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting newsletter and calendar import...\n');

  try {
    // Import newsletters from each CSV
    await importNewslettersFromCSV(
      'attached_assets/Golden Pond - Newsletters_1760066642268.csv',
      'Golden Pond - Newsletters'
    );

    await importNewslettersFromCSV(
      'attached_assets/Gardens on Quail - Newsletters_1760066649770.csv',
      'Gardens on Quail - Newsletters'
    );

    await importNewslettersFromCSV(
      'attached_assets/Gardens at Columbine - Newsletters_1760066657005.csv',
      'Gardens at Columbine - Newsletters'
    );

    await importNewslettersFromCSV(
      'attached_assets/Stonebridge Senior - Newsletters_1760066664228.csv',
      'Stonebridge Senior - Newsletters'
    );

    // Import activity calendars from URLs
    await importActivityCalendars();

    console.log('\n✨ Import complete!');
    console.log('\n📊 Summary:');
    
    const totalPosts = await db.select().from(posts);
    const newsletters = totalPosts.filter(p => p.tags?.includes('newsletter'));
    const calendars = totalPosts.filter(p => p.tags?.includes('activity-calendar'));
    
    console.log(`  Total posts: ${totalPosts.length}`);
    console.log(`  Newsletters: ${newsletters.length}`);
    console.log(`  Activity calendars: ${calendars.length}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();
