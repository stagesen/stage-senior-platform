import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';

const dbUrl = process.env.DATABASE_URL!;
const sqlClient = neon(dbUrl);
const db = drizzle(sqlClient);

interface AuditIssue {
  category: string;
  severity: 'high' | 'medium' | 'low';
  issue: string;
  details: any;
  recommendation?: string;
}

const issues: AuditIssue[] = [];

async function runDatabaseAudit() {
  console.log('🔍 Starting comprehensive database audit...\n');
  console.log('=' .repeat(70));

  // 1. Check for overlapping/duplicate content across tables
  await checkDuplicateSlugs();

  // 2. Check for orphaned foreign key references
  await checkOrphanedReferences();

  // 3. Check for published content that might not be accessible
  await checkInaccessiblePublishedContent();

  // 4. Check for inconsistent data patterns
  await checkInconsistentData();

  // 5. Check for unused/empty tables
  await checkTableUsage();

  // 6. Check for missing critical data
  await checkMissingCriticalData();

  // 7. Check for route coverage
  await checkRouteTableMismatches();

  // Print summary
  printAuditReport();
}

async function checkDuplicateSlugs() {
  console.log('\n📋 1. Checking for duplicate slugs across tables...');

  try {
    // Check for slug conflicts between posts and blog_posts
    const duplicateSlugs = await db.execute(sql`
      SELECT p.slug, 'posts & blog_posts' as conflict
      FROM posts p
      INNER JOIN blog_posts bp ON p.slug = bp.slug
    `);

    if (duplicateSlugs.rows.length > 0) {
      issues.push({
        category: 'Duplicate Slugs',
        severity: 'high',
        issue: `Found ${duplicateSlugs.rows.length} duplicate slugs between posts and blog_posts`,
        details: duplicateSlugs.rows,
        recommendation: 'Remove duplicates from posts table or ensure they are intentional'
      });
      console.log(`   ⚠️  Found ${duplicateSlugs.rows.length} duplicate slugs`);
    } else {
      console.log(`   ✅ No duplicate slugs found`);
    }

    // Check for duplicate slugs within blog_posts
    const blogPostDupes = await db.execute(sql`
      SELECT slug, COUNT(*) as count
      FROM blog_posts
      GROUP BY slug
      HAVING COUNT(*) > 1
    `);

    if (blogPostDupes.rows.length > 0) {
      issues.push({
        category: 'Duplicate Slugs',
        severity: 'high',
        issue: `Found duplicate slugs within blog_posts table`,
        details: blogPostDupes.rows,
        recommendation: 'Investigate and deduplicate blog posts'
      });
      console.log(`   ⚠️  Found ${blogPostDupes.rows.length} duplicate slugs in blog_posts`);
    }
  } catch (error) {
    console.error('   ❌ Error checking duplicate slugs:', error);
  }
}

async function checkOrphanedReferences() {
  console.log('\n🔗 2. Checking for orphaned foreign key references...');

  try {
    // Blog posts with invalid community_id
    const orphanedBlogCommunities = await db.execute(sql`
      SELECT bp.id, bp.title, bp.community_id
      FROM blog_posts bp
      LEFT JOIN communities c ON bp.community_id = c.id
      WHERE bp.community_id IS NOT NULL AND c.id IS NULL
    `);

    if (orphanedBlogCommunities.rows.length > 0) {
      issues.push({
        category: 'Orphaned References',
        severity: 'medium',
        issue: `${orphanedBlogCommunities.rows.length} blog posts reference non-existent communities`,
        details: orphanedBlogCommunities.rows,
        recommendation: 'Set community_id to NULL or link to valid community'
      });
      console.log(`   ⚠️  ${orphanedBlogCommunities.rows.length} blog posts with invalid community_id`);
    } else {
      console.log(`   ✅ No orphaned blog post communities`);
    }

    // Posts with invalid community_id
    const orphanedPostCommunities = await db.execute(sql`
      SELECT p.id, p.title, p.community_id
      FROM posts p
      LEFT JOIN communities c ON p.community_id = c.id
      WHERE p.community_id IS NOT NULL AND c.id IS NULL
    `);

    if (orphanedPostCommunities.rows.length > 0) {
      issues.push({
        category: 'Orphaned References',
        severity: 'medium',
        issue: `${orphanedPostCommunities.rows.length} posts reference non-existent communities`,
        details: orphanedPostCommunities.rows,
        recommendation: 'Set community_id to NULL or link to valid community'
      });
      console.log(`   ⚠️  ${orphanedPostCommunities.rows.length} posts with invalid community_id`);
    } else {
      console.log(`   ✅ No orphaned post communities`);
    }

    // Blog posts with invalid author_id
    const orphanedAuthors = await db.execute(sql`
      SELECT bp.id, bp.title, bp.author_id
      FROM blog_posts bp
      LEFT JOIN team_members tm ON bp.author_id = tm.id
      WHERE bp.author_id IS NOT NULL AND tm.id IS NULL
    `);

    if (orphanedAuthors.rows.length > 0) {
      issues.push({
        category: 'Orphaned References',
        severity: 'low',
        issue: `${orphanedAuthors.rows.length} blog posts reference non-existent authors`,
        details: orphanedAuthors.rows,
        recommendation: 'Set author_id to NULL or link to valid team member'
      });
      console.log(`   ⚠️  ${orphanedAuthors.rows.length} blog posts with invalid author_id`);
    } else {
      console.log(`   ✅ No orphaned blog post authors`);
    }

    // Events with invalid community_id
    const orphanedEventCommunities = await db.execute(sql`
      SELECT e.id, e.title, e.community_id
      FROM events e
      LEFT JOIN communities c ON e.community_id = c.id
      WHERE e.community_id IS NOT NULL AND c.id IS NULL
    `);

    if (orphanedEventCommunities.rows.length > 0) {
      issues.push({
        category: 'Orphaned References',
        severity: 'medium',
        issue: `${orphanedEventCommunities.rows.length} events reference non-existent communities`,
        details: orphanedEventCommunities.rows,
        recommendation: 'Set community_id to NULL or link to valid community'
      });
      console.log(`   ⚠️  ${orphanedEventCommunities.rows.length} events with invalid community_id`);
    } else {
      console.log(`   ✅ No orphaned event communities`);
    }
  } catch (error) {
    console.error('   ❌ Error checking orphaned references:', error);
  }
}

async function checkInaccessiblePublishedContent() {
  console.log('\n🚫 3. Checking for published but potentially inaccessible content...');

  try {
    // Published blog posts without slugs
    const noSlugPosts = await db.execute(sql`
      SELECT id, title, slug, published
      FROM blog_posts
      WHERE published = true AND (slug IS NULL OR slug = '')
    `);

    if (noSlugPosts.rows.length > 0) {
      issues.push({
        category: 'Inaccessible Content',
        severity: 'high',
        issue: `${noSlugPosts.rows.length} published blog posts have no slug (inaccessible via URL)`,
        details: noSlugPosts.rows,
        recommendation: 'Generate slugs from titles or unpublish'
      });
      console.log(`   ⚠️  ${noSlugPosts.rows.length} published blog posts without slugs`);
    } else {
      console.log(`   ✅ All published blog posts have slugs`);
    }

    // Published events without slugs
    const noSlugEvents = await db.execute(sql`
      SELECT id, title, slug
      FROM events
      WHERE slug IS NULL OR slug = ''
    `);

    if (noSlugEvents.rows.length > 0) {
      issues.push({
        category: 'Inaccessible Content',
        severity: 'medium',
        issue: `${noSlugEvents.rows.length} events have no slug`,
        details: noSlugEvents.rows,
        recommendation: 'Generate slugs from titles'
      });
      console.log(`   ⚠️  ${noSlugEvents.rows.length} events without slugs`);
    } else {
      console.log(`   ✅ All events have slugs`);
    }
  } catch (error) {
    console.error('   ❌ Error checking inaccessible content:', error);
  }
}

async function checkInconsistentData() {
  console.log('\n⚖️  4. Checking for data inconsistencies...');

  try {
    // Communities without names
    const noNameCommunities = await db.execute(sql`
      SELECT id, name, slug
      FROM communities
      WHERE name IS NULL OR name = ''
    `);

    if (noNameCommunities.rows.length > 0) {
      issues.push({
        category: 'Data Inconsistency',
        severity: 'high',
        issue: `${noNameCommunities.rows.length} communities without names`,
        details: noNameCommunities.rows,
        recommendation: 'Add names to all communities'
      });
      console.log(`   ⚠️  ${noNameCommunities.rows.length} communities without names`);
    } else {
      console.log(`   ✅ All communities have names`);
    }

    // Blog posts with empty content
    const emptyContent = await db.execute(sql`
      SELECT id, title, slug, published
      FROM blog_posts
      WHERE published = true AND (content IS NULL OR content = '')
    `);

    if (emptyContent.rows.length > 0) {
      issues.push({
        category: 'Data Inconsistency',
        severity: 'medium',
        issue: `${emptyContent.rows.length} published blog posts have no content`,
        details: emptyContent.rows,
        recommendation: 'Add content or unpublish'
      });
      console.log(`   ⚠️  ${emptyContent.rows.length} published blog posts with empty content`);
    } else {
      console.log(`   ✅ All published blog posts have content`);
    }
  } catch (error) {
    console.error('   ❌ Error checking data inconsistencies:', error);
  }
}

async function checkTableUsage() {
  console.log('\n📊 5. Checking table usage and empty tables...');

  try {
    const tables = [
      'communities', 'posts', 'blog_posts', 'events', 'faqs',
      'galleries', 'tour_requests', 'floor_plans', 'testimonials',
      'team_members', 'users', 'images', 'post_attachments'
    ];

    for (const table of tables) {
      const result = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM ${table}`));
      const count = result.rows[0].count;

      if (count === 0) {
        issues.push({
          category: 'Table Usage',
          severity: 'low',
          issue: `Table "${table}" is empty`,
          details: { table, count: 0 },
          recommendation: 'Consider if this table is still needed'
        });
        console.log(`   ⚠️  ${table}: EMPTY`);
      } else {
        console.log(`   ✅ ${table}: ${count} records`);
      }
    }
  } catch (error) {
    console.error('   ❌ Error checking table usage:', error);
  }
}

async function checkMissingCriticalData() {
  console.log('\n🔴 6. Checking for missing critical data...');

  try {
    // Active communities without addresses
    const noAddressCommunities = await db.execute(sql`
      SELECT id, name, address, city, state
      FROM communities
      WHERE active = true AND (address IS NULL OR address = '')
    `);

    if (noAddressCommunities.rows.length > 0) {
      issues.push({
        category: 'Missing Critical Data',
        severity: 'high',
        issue: `${noAddressCommunities.rows.length} active communities missing addresses`,
        details: noAddressCommunities.rows,
        recommendation: 'Add addresses to all active communities'
      });
      console.log(`   ⚠️  ${noAddressCommunities.rows.length} active communities without addresses`);
    } else {
      console.log(`   ✅ All active communities have addresses`);
    }

    // Active communities without phone numbers
    const noPhoneCommunities = await db.execute(sql`
      SELECT id, name, phone
      FROM communities
      WHERE active = true AND (phone IS NULL OR phone = '')
    `);

    if (noPhoneCommunities.rows.length > 0) {
      issues.push({
        category: 'Missing Critical Data',
        severity: 'medium',
        issue: `${noPhoneCommunities.rows.length} active communities missing phone numbers`,
        details: noPhoneCommunities.rows,
        recommendation: 'Add phone numbers to all active communities'
      });
      console.log(`   ⚠️  ${noPhoneCommunities.rows.length} active communities without phone numbers`);
    } else {
      console.log(`   ✅ All active communities have phone numbers`);
    }
  } catch (error) {
    console.error('   ❌ Error checking missing critical data:', error);
  }
}

async function checkRouteTableMismatches() {
  console.log('\n🛣️  7. Checking for potential route/table mismatches...');

  try {
    // Check if posts table still has non-newsletter content
    const nonNewsletterPosts = await db.execute(sql`
      SELECT id, slug, title, tags
      FROM posts
      WHERE NOT (tags @> ARRAY['newsletter']::text[]) OR tags IS NULL
    `);

    if (nonNewsletterPosts.rows.length > 0) {
      issues.push({
        category: 'Route/Table Mismatch',
        severity: 'medium',
        issue: `${nonNewsletterPosts.rows.length} posts in 'posts' table that are not newsletters`,
        details: nonNewsletterPosts.rows,
        recommendation: 'Determine if these should be migrated to blog_posts or have a dedicated route'
      });
      console.log(`   ⚠️  ${nonNewsletterPosts.rows.length} non-newsletter posts still in posts table`);
    } else {
      console.log(`   ✅ Posts table only contains newsletters`);
    }

    // Check for newsletter tag inconsistencies in blog_posts
    const newslettersWithoutTag = await db.execute(sql`
      SELECT id, slug, title, category, tags
      FROM blog_posts
      WHERE category = 'Newsletter' AND NOT (tags::jsonb @> '["newsletter"]'::jsonb)
    `);

    if (newslettersWithoutTag.rows.length > 0) {
      issues.push({
        category: 'Route/Table Mismatch',
        severity: 'low',
        issue: `${newslettersWithoutTag.rows.length} blog posts with category 'Newsletter' missing 'newsletter' tag`,
        details: newslettersWithoutTag.rows,
        recommendation: 'Add newsletter tag for consistency'
      });
      console.log(`   ⚠️  ${newslettersWithoutTag.rows.length} newsletters missing 'newsletter' tag`);
    } else {
      console.log(`   ✅ All newsletter blog posts properly tagged`);
    }
  } catch (error) {
    console.error('   ❌ Error checking route/table mismatches:', error);
  }
}

function printAuditReport() {
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 AUDIT REPORT SUMMARY');
  console.log('='.repeat(70));

  if (issues.length === 0) {
    console.log('\n✅ NO ISSUES FOUND! Your database is in great shape! 🎉\n');
    return;
  }

  const highSeverity = issues.filter(i => i.severity === 'high');
  const mediumSeverity = issues.filter(i => i.severity === 'medium');
  const lowSeverity = issues.filter(i => i.severity === 'low');

  console.log(`\n🔴 High Severity Issues: ${highSeverity.length}`);
  console.log(`🟡 Medium Severity Issues: ${mediumSeverity.length}`);
  console.log(`🟢 Low Severity Issues: ${lowSeverity.length}`);
  console.log(`📊 Total Issues: ${issues.length}\n`);

  console.log('='.repeat(70));

  // Print high severity issues first
  if (highSeverity.length > 0) {
    console.log('\n🔴 HIGH SEVERITY ISSUES:');
    console.log('-'.repeat(70));
    highSeverity.forEach((issue, idx) => {
      console.log(`\n${idx + 1}. [${issue.category}] ${issue.issue}`);
      if (issue.recommendation) {
        console.log(`   💡 Recommendation: ${issue.recommendation}`);
      }
      if (Array.isArray(issue.details) && issue.details.length <= 3) {
        console.log(`   Details:`, JSON.stringify(issue.details, null, 2));
      } else if (Array.isArray(issue.details)) {
        console.log(`   Details: (${issue.details.length} items - first 3 shown)`);
        console.log(JSON.stringify(issue.details.slice(0, 3), null, 2));
      }
    });
  }

  // Print medium severity issues
  if (mediumSeverity.length > 0) {
    console.log('\n\n🟡 MEDIUM SEVERITY ISSUES:');
    console.log('-'.repeat(70));
    mediumSeverity.forEach((issue, idx) => {
      console.log(`\n${idx + 1}. [${issue.category}] ${issue.issue}`);
      if (issue.recommendation) {
        console.log(`   💡 Recommendation: ${issue.recommendation}`);
      }
    });
  }

  // Print low severity issues
  if (lowSeverity.length > 0) {
    console.log('\n\n🟢 LOW SEVERITY ISSUES:');
    console.log('-'.repeat(70));
    lowSeverity.forEach((issue, idx) => {
      console.log(`\n${idx + 1}. [${issue.category}] ${issue.issue}`);
      if (issue.recommendation) {
        console.log(`   💡 Recommendation: ${issue.recommendation}`);
      }
    });
  }

  console.log('\n' + '='.repeat(70));
  console.log('💾 Full audit results saved to issues array for further processing');
  console.log('='.repeat(70) + '\n');
}

// Run the audit
runDatabaseAudit()
  .then(() => {
    console.log('✅ Database audit completed!\n');
    process.exit(issues.filter(i => i.severity === 'high').length > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  });
