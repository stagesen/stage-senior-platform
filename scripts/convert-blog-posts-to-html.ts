#!/usr/bin/env tsx
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

/**
 * Convert plain text blog posts to HTML with proper formatting
 *
 * This script:
 * 1. Reads all blog posts from the database
 * 2. Converts plain text content to HTML with paragraphs and line breaks
 * 3. Updates the database with the formatted content
 */

function convertPlainTextToHtml(text: string): string {
  if (!text) return '';

  // First, split by common section delimiters and headers
  let html = text;

  // Convert emoji headers (🌟, 🎃, 🎶, etc.) to h2 tags
  html = html.replace(/([🌟🎃🎶💙🎂🎁🍂✨🎉🎊🎈🎯🌸🌺🌻🌷🌹🌼🏵️💐🌴🌵🌲🌳🌱🍀☘️🌿🎋🎍🍃🌾🌱🍂🍁🌊🏔️⛰️🗻🏕️🏖️🏜️🏝️🏞️🏟️🏛️🏗️🏘️🏙️🏚️🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏯🏰💒🗼🗽⛪🕌🕍⛩️🕋⛲⛺🌁🌃🌄🌅🌆🌇🌉♨️🎠🎡🎢💈🎪])\s*([^:\n]+:)/g, '<h2>$1 $2</h2>');

  // Convert numbered lists (1., 2., etc.)
  html = html.replace(/(\d+)\.\s+([^\n]+)/g, '<li>$2</li>');
  html = html.replace(/(<li>.*?<\/li>\s*)+/g, '<ul>$&</ul>');

  // Convert bullet points (✔️, -, •, etc.)
  html = html.replace(/([✔️✓✅•–—-])\s+([^\n]+)/g, '<li>$2</li>');

  // Convert lines that end with colons to h3 tags (subheadings)
  html = html.replace(/^([^<\n][^\n]{0,80}:)\s*$/gm, '<h3>$1</h3>');

  // Split into paragraphs by double line breaks
  const paragraphs = html.split(/\n\n+/);

  // Wrap each paragraph in <p> tags if not already wrapped in HTML
  const formattedParagraphs = paragraphs.map(para => {
    para = para.trim();
    if (!para) return '';

    // Don't wrap if already has HTML tags
    if (para.startsWith('<')) {
      return para;
    }

    // Convert single line breaks to <br> tags within paragraphs
    para = para.replace(/\n/g, '<br>');

    return `<p>${para}</p>`;
  });

  return formattedParagraphs.join('\n\n');
}

async function convertBlogPosts() {
  const dbUrl = process.argv[2];

  if (!dbUrl) {
    console.error('❌ Usage: tsx scripts/convert-blog-posts-to-html.ts <database-url>');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });

  try {
    console.log('🔄 Converting blog posts to HTML...\n');

    // Get all blog posts
    const result = await pool.query('SELECT id, title, content FROM blog_posts ORDER BY created_at');
    const posts = result.rows;

    console.log(`Found ${posts.length} blog posts\n`);

    let converted = 0;
    let skipped = 0;
    let errors = 0;

    for (const post of posts) {
      try {
        // Check if content already has HTML tags
        if (post.content.includes('<p>') || post.content.includes('<h2>') || post.content.includes('<br>')) {
          console.log(`  ⏭️  Skipping (already has HTML): ${post.title}`);
          skipped++;
          continue;
        }

        // Convert plain text to HTML
        const htmlContent = convertPlainTextToHtml(post.content);

        // Update the blog post
        await pool.query(
          'UPDATE blog_posts SET content = $1, updated_at = NOW() WHERE id = $2',
          [htmlContent, post.id]
        );

        console.log(`  ✅ Converted: ${post.title}`);
        converted++;
      } catch (error) {
        console.error(`  ❌ Error converting "${post.title}":`, error instanceof Error ? error.message : 'Unknown error');
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ ${converted} posts converted to HTML`);
    console.log(`   ⏭️  ${skipped} posts skipped (already had HTML)`);
    if (errors > 0) {
      console.log(`   ❌ ${errors} errors occurred`);
    }

    console.log('\n✅ Conversion completed!\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

convertBlogPosts().catch(console.error);
