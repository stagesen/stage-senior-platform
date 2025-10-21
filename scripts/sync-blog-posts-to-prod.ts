#!/usr/bin/env tsx
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

/**
 * Script to sync blog posts from development to production
 *
 * This script:
 * 1. Connects to both development and production databases
 * 2. Exports blog posts from development
 * 3. Imports them into production using UPSERT to avoid duplicates
 *
 * Usage: tsx scripts/sync-blog-posts-to-prod.ts
 */

async function syncBlogPostsToProd() {
  console.log('🔄 Starting blog posts sync from development to production...\n');

  const devUrl = process.argv[2];
  const prodUrl = process.argv[3];

  if (!devUrl || !prodUrl) {
    console.error('❌ Usage: tsx scripts/sync-blog-posts-to-prod.ts <dev-database-url> <prod-database-url>');
    process.exit(1);
  }

  console.log('✓ Database URLs provided');
  console.log(`📊 Development DB: ${devUrl.split('@')[1]?.split('?')[0] || 'hidden'}`);
  console.log(`📊 Production DB: ${prodUrl.split('@')[1]?.split('?')[0] || 'hidden'}\n`);

  const devPool = new Pool({ connectionString: devUrl });
  const prodPool = new Pool({ connectionString: prodUrl });

  try {
    console.log('1️⃣  Fetching blog posts from development...');

    // Get all blog posts from development
    const blogPostsResult = await devPool.query(`
      SELECT * FROM blog_posts ORDER BY created_at
    `);

    const blogPosts = blogPostsResult.rows;
    console.log(`   Found ${blogPosts.length} blog posts in development\n`);

    if (blogPosts.length === 0) {
      console.log('⚠️  No blog posts found in development. Nothing to sync.');
      return;
    }

    console.log('2️⃣  Syncing blog posts to production...');

    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (const post of blogPosts) {
      try {
        // Check if post exists in production
        const existingResult = await prodPool.query(
          'SELECT id FROM blog_posts WHERE id = $1',
          [post.id]
        );

        const exists = existingResult.rows.length > 0;

        // Prepare the data
        const columns = Object.keys(post);
        const columnList = columns.map(c => `"${c}"`).join(', ');
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const updateSet = columns
          .filter(c => c !== 'id') // Don't update the ID
          .map(c => `"${c}" = EXCLUDED."${c}"`)
          .join(', ');

        const values = columns.map(col => {
          const value = post[col];
          // JSONB fields need to be explicitly stringified for PostgreSQL
          if ((col === 'tags' || col === 'gallery_images') && value !== null) {
            return JSON.stringify(value);
          }
          return value;
        });

        // UPSERT the blog post
        await prodPool.query(
          `INSERT INTO blog_posts (${columnList})
           VALUES (${placeholders})
           ON CONFLICT (id) DO UPDATE SET ${updateSet}`,
          values
        );

        if (exists) {
          updated++;
          console.log(`   ↻ Updated: ${post.title}`);
        } else {
          inserted++;
          console.log(`   + Inserted: ${post.title}`);
        }
      } catch (error) {
        errors++;
        console.error(`   ✗ Error syncing "${post.title}":`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    console.log('');
    console.log('3️⃣  Summary:');
    console.log(`   ✓ ${inserted} new blog posts inserted`);
    console.log(`   ↻ ${updated} existing blog posts updated`);
    if (errors > 0) {
      console.log(`   ✗ ${errors} errors occurred`);
    }

    console.log('');
    console.log('✅ Blog posts sync completed successfully!');
    console.log('🎉 Your production database now has all blog posts from development.\n');

  } catch (error) {
    console.error('');
    console.error('❌ Error during blog posts sync:');
    console.error(error);
    process.exit(1);
  } finally {
    await devPool.end();
    await prodPool.end();
  }
}

// Run the sync
syncBlogPostsToProd().catch(console.error);
