// Helper functions for SQL export/import
import { db } from "./db";
import * as schema from "@shared/schema";

export async function generateSQLExport(): Promise<string> {
  const sqlStatements: string[] = [];
  
  // Helper function to escape SQL strings
  const escapeString = (v: any): string => {
    if (v === null || v === undefined) return 'NULL';
    if (v instanceof Date) return `'${v.toISOString()}'::timestamp`;
    if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
    if (typeof v === 'boolean') return v.toString();
    if (Array.isArray(v)) return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
    if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
    return v.toString();
  };
  
  // Start transaction
  sqlStatements.push('-- Database Export Generated: ' + new Date().toISOString());
  sqlStatements.push('BEGIN;');
  sqlStatements.push('');
  
  // Disable foreign key checks
  sqlStatements.push('-- Disable foreign key checks');
  sqlStatements.push('SET session_replication_role = replica;');
  sqlStatements.push('');
  
  // Clear existing data (except users)
  sqlStatements.push('-- Clear existing data (preserving users)');
  const deleteTables = [
    'post_attachments',
    'blog_posts', 
    'posts',
    'tour_requests',
    'gallery_images',
    'galleries',
    'events',
    'faqs',
    'testimonials',
    'team_members',
    'email_recipients',
    'page_heroes',
    'floor_plan_images',
    'floor_plans',
    'homepage_sections',
    'homepage_config',
    'community_features',
    'community_highlights',
    'communities_care_types',
    'communities_amenities',
    'communities',
    'care_types',
    'amenities'
  ];
  
  for (const table of deleteTables) {
    sqlStatements.push(`DELETE FROM ${table};`);
  }
  sqlStatements.push('');
  
  // Export care types
  const careTypes = await db.select().from(schema.careTypes);
  if (careTypes.length > 0) {
    sqlStatements.push('-- Care Types');
    for (const row of careTypes) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO care_types (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export amenities
  const amenities = await db.select().from(schema.amenities);
  if (amenities.length > 0) {
    sqlStatements.push('-- Amenities');
    for (const row of amenities) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO amenities (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export communities
  const communities = await db.select().from(schema.communities);
  if (communities.length > 0) {
    sqlStatements.push('-- Communities');
    for (const row of communities) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO communities (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export relationship tables
  const commCareTypes = await db.select().from(schema.communitiesCareTypes);
  if (commCareTypes.length > 0) {
    sqlStatements.push('-- Community Care Types');
    for (const row of commCareTypes) {
      sqlStatements.push(`INSERT INTO communities_care_types (community_id, care_type_id) VALUES ('${row.communityId}', '${row.careTypeId}');`);
    }
    sqlStatements.push('');
  }
  
  const commAmenities = await db.select().from(schema.communitiesAmenities);
  if (commAmenities.length > 0) {
    sqlStatements.push('-- Community Amenities');
    for (const row of commAmenities) {
      sqlStatements.push(`INSERT INTO communities_amenities (community_id, amenity_id) VALUES ('${row.communityId}', '${row.amenityId}');`);
    }
    sqlStatements.push('');
  }
  
  // Export community features
  const communityFeatures = await db.select().from(schema.communityFeatures);
  if (communityFeatures.length > 0) {
    sqlStatements.push('-- Community Features');
    for (const row of communityFeatures) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO community_features (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export community highlights
  const communityHighlights = await db.select().from(schema.communityHighlights);
  if (communityHighlights.length > 0) {
    sqlStatements.push('-- Community Highlights');
    for (const row of communityHighlights) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO community_highlights (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export floor plans
  const floorPlans = await db.select().from(schema.floorPlans);
  if (floorPlans.length > 0) {
    sqlStatements.push('-- Floor Plans');
    for (const row of floorPlans) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO floor_plans (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export posts
  const posts = await db.select().from(schema.posts);
  if (posts.length > 0) {
    sqlStatements.push('-- Posts');
    for (const row of posts) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO posts (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export blog posts
  const blogPosts = await db.select().from(schema.blogPosts);
  if (blogPosts.length > 0) {
    sqlStatements.push('-- Blog Posts');
    for (const row of blogPosts) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO blog_posts (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export events
  const events = await db.select().from(schema.events);
  if (events.length > 0) {
    sqlStatements.push('-- Events');
    for (const row of events) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO events (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export FAQs
  const faqs = await db.select().from(schema.faqs);
  if (faqs.length > 0) {
    sqlStatements.push('-- FAQs');
    for (const row of faqs) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO faqs (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export galleries
  const galleries = await db.select().from(schema.galleries);
  if (galleries.length > 0) {
    sqlStatements.push('-- Galleries');
    for (const row of galleries) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO galleries (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export gallery images
  const galleryImages = await db.select().from(schema.galleryImages);
  if (galleryImages.length > 0) {
    sqlStatements.push('-- Gallery Images');
    for (const row of galleryImages) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO gallery_images (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export testimonials
  const testimonials = await db.select().from(schema.testimonials);
  if (testimonials.length > 0) {
    sqlStatements.push('-- Testimonials');
    for (const row of testimonials) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO testimonials (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export team members
  const teamMembers = await db.select().from(schema.teamMembers);
  if (teamMembers.length > 0) {
    sqlStatements.push('-- Team Members');
    for (const row of teamMembers) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO team_members (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export page heroes
  const pageHeroes = await db.select().from(schema.pageHeroes);
  if (pageHeroes.length > 0) {
    sqlStatements.push('-- Page Heroes');
    for (const row of pageHeroes) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO page_heroes (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export homepage sections
  const homepageSections = await db.select().from(schema.homepageSections);
  if (homepageSections.length > 0) {
    sqlStatements.push('-- Homepage Sections');
    for (const row of homepageSections) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO homepage_sections (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export homepage config
  const homepageConfig = await db.select().from(schema.homepageConfig);
  if (homepageConfig.length > 0) {
    sqlStatements.push('-- Homepage Config');
    for (const row of homepageConfig) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO homepage_config (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Export email recipients
  const emailRecipients = await db.select().from(schema.emailRecipients);
  if (emailRecipients.length > 0) {
    sqlStatements.push('-- Email Recipients');
    for (const row of emailRecipients) {
      const cols = Object.keys(row).join(', ');
      const vals = Object.values(row).map(escapeString).join(', ');
      sqlStatements.push(`INSERT INTO email_recipients (${cols}) VALUES (${vals});`);
    }
    sqlStatements.push('');
  }
  
  // Re-enable foreign key checks
  sqlStatements.push('-- Re-enable foreign key checks');
  sqlStatements.push('SET session_replication_role = DEFAULT;');
  sqlStatements.push('');
  sqlStatements.push('COMMIT;');
  
  return sqlStatements.join('\n');
}

export async function executeSQLImport(sqlContent: string): Promise<void> {
  // Split by statements but handle multi-line statements properly
  const statements = sqlContent
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));
  
  // Execute in a transaction
  await db.transaction(async (tx) => {
    for (const statement of statements) {
      if (statement && 
          !statement.toUpperCase().startsWith('BEGIN') && 
          !statement.toUpperCase().startsWith('COMMIT')) {
        try {
          await tx.execute(statement + ';');
        } catch (error) {
          console.error('Failed statement:', statement);
          throw error;
        }
      }
    }
  });
}