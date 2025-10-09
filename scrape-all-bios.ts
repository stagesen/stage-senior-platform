/**
 * Scrape All Team Member Bios Using WebFetch Approach
 *
 * This script uses direct HTTP fetching to get bio content
 */

import fs from 'fs/promises';

interface BioData {
  slug: string;
  bio: string;
  source: string;
}

// Team member profile URLs to scrape
const profileUrls = [
  // Golden Pond
  { slug: 'leigh-boney', url: 'https://goldenpond.com/team/leigh-boney' },
  { slug: 'maria-torres', url: 'https://goldenpond.com/team/maria-torres' },
  { slug: 'shellie-yushka', url: 'https://goldenpond.com/team/shellie-yushka' },
  { slug: 'chaz-osen', url: 'https://goldenpond.com/team/chaz-osen' },
  { slug: 'holly-jo-eames', url: 'https://goldenpond.com/team/holly-jo-eames' },
  { slug: 'sarah-stevenson', url: 'https://goldenpond.com/team/sarah-stevenson' },
  { slug: 'bob-burden', url: 'https://goldenpond.com/team/bob-burden' },
  { slug: 'marci-gerke', url: 'https://goldenpond.com/team/marci-gerke' },

  // Gardens at Columbine
  { slug: 'alyssa-trujillo', url: 'https://gardensatcolumbine.com/team/alyssa-trujillo' },
  { slug: 'marnie-mckissack', url: 'https://gardensatcolumbine.com/team/marnie-mckissack' },
  { slug: 'helen-rossi', url: 'https://gardensatcolumbine.com/team/helen-rossi' },
  { slug: 'allie-mitchem', url: 'https://gardensatcolumbine.com/team/allie-mitchem' },
  { slug: 'matt-turk', url: 'https://gardensatcolumbine.com/team/matt-turk' },
  { slug: 'rich-thomas', url: 'https://gardensatcolumbine.com/team/rich-thomas' },
  { slug: 'sydney-hertz', url: 'https://gardensatcolumbine.com/team/sydney-hertz' },

  // Gardens on Quail
  { slug: 'mariah-ruell', url: 'https://gardensonquail.com/team/mariah-ruell' },
];

async function fetchAndParseBio(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const html = await response.text();

    // Extract bio content using simple pattern matching
    // Look for common bio sections
    const bioPatterns = [
      /<div class="bio-content[^"]*"[^>]*>(.*?)<\/div>/is,
      /<div class="team-bio[^"]*"[^>]*>(.*?)<\/div>/is,
      /<section class="bio[^"]*"[^>]*>(.*?)<\/section>/is,
    ];

    for (const pattern of bioPatterns) {
      const match = html.match(pattern);
      if (match) {
        // Clean HTML tags and return text
        let text = match[1]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (text.length > 50) {
          return text;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function main() {
  console.log('\n📚 Scraping Team Member Bios\n');

  const bios: BioData[] = [];
  let successCount = 0;

  for (const { slug, url } of profileUrls) {
    console.log(`Scraping ${slug}...`);

    const bio = await fetchAndParseBio(url);

    if (bio) {
      bios.push({ slug, bio, source: url });
      console.log(`  ✅ Found bio (${bio.length} characters)`);
      successCount++;
    } else {
      console.log(`  ⏭️  No bio content found`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n📊 Summary: Found ${successCount} bios out of ${profileUrls.length} profiles\n`);

  // Save to JSON
  await fs.writeFile('team-bios-scraped.json', JSON.stringify(bios, null, 2));
  console.log('✅ Saved to team-bios-scraped.json\n');
}

main();
