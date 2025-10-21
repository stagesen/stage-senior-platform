#!/usr/bin/env tsx
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

/**
 * Improved HTML conversion for blog posts
 * This script properly formats blog content with headers and paragraphs
 */

function convertToProperHtml(text: string): string {
  if (!text) return '';

  // Remove existing broken HTML tags
  let content = text.replace(/<\/?p>/g, '').replace(/<\/?li>/g, '').trim();

  // Split content into sentences/sections
  // Look for patterns like "Title:" or "Title!" that indicate headers
  const headerPatterns = [
    // Section headers ending with ! or :
    /([A-Z][^.!?]*[!:])/g,
    // Dates and event names
    /((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+)/g,
  ];

  // First, identify and mark section headers
  content = content.replace(/([🌟🎃🎶💙🎂🎁🍂✨🎉🎊🎈🎯🌸🌺🌻🌷🌹🌼🏵️💐🌴🌵🌲🌳🌱🍀☘️🌿🎋🎍🍃🌾🌱🍂🍁])\s*([^!:\n]{3,80}[!:])/g,
    (match, emoji, text) => `\n\n<h2>${emoji} ${text}</h2>\n\n`
  );

  // Mark section headers that are capitalized and end with ! or :
  content = content.replace(/([A-Z][A-Za-z\s,'&-]{10,80}[!:])/g, (match) => {
    // Don't convert if it's part of a sentence (has lowercase before it)
    return `\n\n<h3>${match}</h3>\n\n`;
  });

  // Convert bullet points and list items
  const lines = content.split('\n');
  const formattedLines: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if line starts with a bullet point or list marker
    if (/^[•\-–—✓✔️✅]\s+/.test(line)) {
      if (!inList) {
        formattedLines.push('<ul>');
        inList = true;
      }
      const cleanLine = line.replace(/^[•\-–—✓✔️✅]\s+/, '');
      formattedLines.push(`<li>${cleanLine}</li>`);
    } else if (/^\d+\.\s+/.test(line)) {
      if (!inList) {
        formattedLines.push('<ol>');
        inList = true;
      }
      const cleanLine = line.replace(/^\d+\.\s+/, '');
      formattedLines.push(`<li>${cleanLine}</li>`);
    } else {
      if (inList) {
        formattedLines.push(inList ? '</ul>' : '</ol>');
        inList = false;
      }
      formattedLines.push(line);
    }
  }

  if (inList) {
    formattedLines.push('</ul>');
  }

  content = formattedLines.join('\n');

  // Split into paragraphs by double line breaks or header tags
  const sections = content.split(/\n\n+/);

  const htmlSections = sections.map(section => {
    section = section.trim();
    if (!section) return '';

    // Don't wrap if already has HTML tags
    if (section.startsWith('<h') || section.startsWith('<ul') || section.startsWith('<ol')) {
      return section;
    }

    // Look for event patterns like "Event Name: Description" and split them
    if (section.includes(':') && section.length > 100) {
      // Split on patterns that look like "Event: Description"
      const events = section.split(/([A-Z][^:]{3,60}:)/);
      const eventHtml: string[] = [];

      for (let i = 0; i < events.length; i++) {
        const part = events[i].trim();
        if (!part) continue;

        if (part.endsWith(':')) {
          eventHtml.push(`<strong>${part}</strong>`);
        } else {
          eventHtml.push(part);
        }
      }

      if (eventHtml.length > 1) {
        return `<p>${eventHtml.join(' ')}</p>`;
      }
    }

    return `<p>${section}</p>`;
  });

  return htmlSections.filter(s => s).join('\n\n');
}

async function fixBlogFormatting() {
  const dbUrl = process.argv[2];

  if (!dbUrl) {
    console.error('❌ Usage: tsx scripts/fix-blog-html-formatting.ts <database-url>');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });

  try {
    console.log('🔄 Fixing blog post HTML formatting...\n');

    // Get all blog posts
    const result = await pool.query('SELECT id, slug, title, content FROM blog_posts ORDER BY created_at');
    const posts = result.rows;

    console.log(`Found ${posts.length} blog posts\n`);

    let fixed = 0;
    let skipped = 0;
    let errors = 0;

    for (const post of posts) {
      try {
        // Check if content already has proper formatting (multiple <p> tags or <h2> tags)
        const pTagCount = (post.content.match(/<p>/g) || []).length;
        const hasHeaders = post.content.includes('<h2>') || post.content.includes('<h3>');

        if (pTagCount > 2 || hasHeaders) {
          console.log(`  ⏭️  Skipping (already formatted): ${post.title}`);
          skipped++;
          continue;
        }

        // Convert to proper HTML
        const htmlContent = convertToProperHtml(post.content);

        // Update the blog post
        await pool.query(
          'UPDATE blog_posts SET content = $1, updated_at = NOW() WHERE id = $2',
          [htmlContent, post.id]
        );

        console.log(`  ✅ Fixed: ${post.title}`);
        fixed++;
      } catch (error) {
        console.error(`  ❌ Error fixing "${post.title}":`, error instanceof Error ? error.message : 'Unknown error');
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ ${fixed} posts fixed`);
    console.log(`   ⏭️  ${skipped} posts skipped (already formatted)`);
    if (errors > 0) {
      console.log(`   ❌ ${errors} errors occurred`);
    }

    console.log('\n✅ Formatting fix completed!\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixBlogFormatting().catch(console.error);
