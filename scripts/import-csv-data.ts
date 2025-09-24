import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";
import { eq } from "drizzle-orm";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Helper function to parse CSV
function parseCSV(content: string): any[] {
  const lines = content.trim().split('\n');
  const headers = parseLine(lines[0]);
  
  return lines.slice(1).map(line => {
    const values = parseLine(line);
    const obj: any = {};
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      obj[header.trim()] = value === '' || value === undefined ? null : value;
    });
    return obj;
  });
}

// Parse a CSV line handling quoted values
function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// Helper for parsing pipe-separated values
function parsePipeSeparated(value: string | null): string[] {
  if (!value) return [];
  return value.split('|').map(v => v.trim()).filter(v => v);
}

async function importData() {
  console.log("Starting data import...");

  // 1. Import Communities
  console.log("\n1. Importing Communities...");
  const communitiesData = fs.readFileSync(path.join(__dirname, '../attached_assets/site_launch_communities_1758686955222.csv'), 'utf-8');
  const communities = parseCSV(communitiesData);
  
  for (const community of communities) {
    try {
      // Check if community exists
      const existing = await db.select().from(schema.communities).where(eq(schema.communities.slug, community.slug));
      
      const communityData: any = {
        slug: community.slug,
        name: community.name,
        street: community.street,
        city: community.city,
        state: community.state,
        zip: community.zip,
        lat: community.lat ? community.lat.toString() : null,
        lng: community.lng ? community.lng.toString() : null,
        latitude: community.lat ? community.lat.toString() : null,
        longitude: community.lng ? community.lng.toString() : null,
        phoneDisplay: community.phone_display,
        phoneDial: community.phone_dial,
        phone: community.phone_dial?.replace(/\D/g, '').replace(/^1/, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'),
        secondaryPhoneDisplay: community.secondary_phone_display,
        secondaryPhoneDial: community.secondary_phone_dial,
        email: community.email,
        startingRateDisplay: community.starting_rate_display,
        startingPrice: community.starting_rate_display ? parseInt(community.starting_rate_display.replace(/\D/g, '')) : null,
        seoTitle: community.seo_title,
        seoDescription: community.seo_desc,
        seoDesc: community.seo_desc,
        overview: community.overview,
        address: community.street,
        active: true,
        featured: ['golden-pond', 'the-gardens-on-columbine', 'the-gardens-on-quail'].includes(community.slug)
      };
      
      if (existing.length > 0) {
        await db.update(schema.communities)
          .set(communityData)
          .where(eq(schema.communities.slug, community.slug));
        console.log(`  Updated: ${community.name}`);
      } else {
        await db.insert(schema.communities).values(communityData);
        console.log(`  Inserted: ${community.name}`);
      }
    } catch (error) {
      console.error(`  Error with ${community.name}:`, error);
    }
  }

  // 2. Import Care Types (master table)
  console.log("\n2. Importing Care Types...");
  const careTypesData = fs.readFileSync(path.join(__dirname, '../attached_assets/site_launch_care_types_1758686955220.csv'), 'utf-8');
  const careTypes = parseCSV(careTypesData);
  
  for (const careType of careTypes) {
    try {
      const existing = await db.select().from(schema.careTypes).where(eq(schema.careTypes.slug, careType.slug));
      
      if (existing.length === 0) {
        await db.insert(schema.careTypes).values({
          slug: careType.slug,
          name: careType.name,
          active: true
        });
        console.log(`  Inserted: ${careType.name}`);
      } else {
        console.log(`  Exists: ${careType.name}`);
      }
    } catch (error) {
      console.error(`  Error with ${careType.name}:`, error);
    }
  }

  // 3. Map Communities to Care Types
  console.log("\n3. Mapping Communities to Care Types...");
  const commCareTypesData = fs.readFileSync(path.join(__dirname, '../attached_assets/site_launch_comm_care_types_1758686955217.csv'), 'utf-8');
  const commCareTypes = parseCSV(commCareTypesData);
  
  for (const mapping of commCareTypes) {
    const communitySlug = mapping.communitySlug;
    const careTypeSlugs = parsePipeSeparated(mapping.careTypeSlugs);
    
    // Get community ID
    const community = await db.select().from(schema.communities).where(eq(schema.communities.slug, communitySlug));
    if (community.length === 0) {
      console.log(`  Community not found: ${communitySlug}`);
      continue;
    }
    
    // Delete existing mappings
    await db.delete(schema.communitiesCareTypes).where(eq(schema.communitiesCareTypes.communityId, community[0].id));
    
    // Add new mappings
    for (const careTypeSlug of careTypeSlugs) {
      const careType = await db.select().from(schema.careTypes).where(eq(schema.careTypes.slug, careTypeSlug));
      if (careType.length > 0) {
        await db.insert(schema.communitiesCareTypes).values({
          communityId: community[0].id,
          careTypeId: careType[0].id
        });
      }
    }
    console.log(`  Mapped ${communitySlug} to ${careTypeSlugs.join(', ')}`);
  }

  // 4. Import Amenities (master table)
  console.log("\n4. Importing Amenities...");
  const amenitiesData = fs.readFileSync(path.join(__dirname, '../attached_assets/site_launch_amenities_1758686955221.csv'), 'utf-8');
  const amenities = parseCSV(amenitiesData);
  
  for (const amenity of amenities) {
    try {
      const existing = await db.select().from(schema.amenities).where(eq(schema.amenities.slug, amenity.slug));
      
      if (existing.length === 0) {
        await db.insert(schema.amenities).values({
          slug: amenity.slug,
          name: amenity.name,
          category: amenity.category,
          active: true
        });
        console.log(`  Inserted: ${amenity.name}`);
      } else {
        console.log(`  Exists: ${amenity.name}`);
      }
    } catch (error) {
      console.error(`  Error with ${amenity.name}:`, error);
    }
  }

  // 5. Map Communities to Amenities
  console.log("\n5. Mapping Communities to Amenities...");
  const commAmenitiesData = fs.readFileSync(path.join(__dirname, '../attached_assets/site_launch_comm_amenities_1758686955220.csv'), 'utf-8');
  const commAmenities = parseCSV(commAmenitiesData);
  
  for (const mapping of commAmenities) {
    const communitySlug = mapping.communitySlug;
    const amenitySlugs = parsePipeSeparated(mapping.amenitySlugs);
    
    // Get community ID
    const community = await db.select().from(schema.communities).where(eq(schema.communities.slug, communitySlug));
    if (community.length === 0) {
      console.log(`  Community not found: ${communitySlug}`);
      continue;
    }
    
    // Delete existing mappings
    await db.delete(schema.communitiesAmenities).where(eq(schema.communitiesAmenities.communityId, community[0].id));
    
    // Add new mappings
    for (const amenitySlug of amenitySlugs) {
      const amenity = await db.select().from(schema.amenities).where(eq(schema.amenities.slug, amenitySlug));
      if (amenity.length > 0) {
        await db.insert(schema.communitiesAmenities).values({
          communityId: community[0].id,
          amenityId: amenity[0].id
        });
      }
    }
    console.log(`  Mapped ${communitySlug} to ${amenitySlugs.join(', ')}`);
  }

  // 6. Import Floor Plans
  console.log("\n6. Importing Floor Plans...");
  const floorPlansData = fs.readFileSync(path.join(__dirname, '../attached_assets/site_launch_floor_plans_1758686955222.csv'), 'utf-8');
  const floorPlans = parseCSV(floorPlansData);
  
  for (const plan of floorPlans) {
    const community = await db.select().from(schema.communities).where(eq(schema.communities.slug, plan.communitySlug));
    if (community.length === 0) {
      console.log(`  Community not found: ${plan.communitySlug}`);
      continue;
    }
    
    // Delete existing floor plans for this community
    await db.delete(schema.floorPlans).where(eq(schema.floorPlans.communityId, community[0].id));
  }
  
  // Now insert new floor plans
  for (const plan of floorPlans) {
    const community = await db.select().from(schema.communities).where(eq(schema.communities.slug, plan.communitySlug));
    if (community.length === 0) continue;
    
    try {
      const imageUrls = plan.images ? plan.images.split('|').filter((url: string) => url.trim()) : [];
      
      await db.insert(schema.floorPlans).values({
        communityId: community[0].id,
        planSlug: plan.planSlug,
        name: plan.name,
        bedrooms: parseInt(plan.bedrooms),
        bathrooms: plan.bathrooms.toString(),
        squareFeet: plan.squareFeet ? parseInt(plan.squareFeet) : null,
        description: plan.highlights,
        highlights: plan.highlights ? [plan.highlights] : [],
        images: imageUrls,
        imageUrl: imageUrls[0] || null,
        specPdfUrl: plan.specPdfUrl,
        accessible: plan.accessible === 'TRUE',
        startingRateDisplay: plan.startingRateDisplay,
        startingPrice: plan.startingRateDisplay ? parseInt(plan.startingRateDisplay.replace(/\D/g, '')) : null,
        sortPriority: parseInt(plan.sortPriority),
        sortOrder: parseInt(plan.sortPriority),
        active: true
      });
      console.log(`  Inserted: ${plan.name} for ${plan.communitySlug}`);
    } catch (error) {
      console.error(`  Error with floor plan ${plan.name}:`, error);
    }
  }

  // 7. Import Galleries
  console.log("\n7. Importing Galleries...");
  const galleriesData = fs.readFileSync(path.join(__dirname, '../attached_assets/site_launch_galleries_1758686955222.csv'), 'utf-8');
  const galleries = parseCSV(galleriesData);
  
  for (const gallery of galleries) {
    const community = await db.select().from(schema.communities).where(eq(schema.communities.slug, gallery.communitySlug));
    if (community.length === 0) {
      console.log(`  Community not found: ${gallery.communitySlug}`);
      continue;
    }
    
    try {
      const imageUrls = gallery.images ? gallery.images.split('|').filter((url: string) => url.trim()) : [];
      const tags = gallery.tags ? gallery.tags.split('|').filter((tag: string) => tag.trim()) : [];
      
      // Check if gallery exists for this community
      const existing = await db.select().from(schema.galleries)
        .where(eq(schema.galleries.communityId, community[0].id));
      
      const galleryData = {
        gallerySlug: gallery.gallerySlug,
        title: gallery.title,
        description: gallery.description,
        hero: gallery.hero === 'True' || gallery.hero === 'TRUE',
        published: gallery.published === 'True' || gallery.published === 'TRUE',
        images: imageUrls.map(url => ({
          url,
          alt: gallery.title,
        })),
        tags: tags,
        communityId: community[0].id,
        active: true
      };
      
      if (existing.length > 0) {
        await db.update(schema.galleries)
          .set(galleryData)
          .where(eq(schema.galleries.id, existing[0].id));
        console.log(`  Updated: ${gallery.title} for ${gallery.communitySlug}`);
      } else {
        await db.insert(schema.galleries).values(galleryData);
        console.log(`  Inserted: ${gallery.title} for ${gallery.communitySlug}`);
      }
    } catch (error) {
      console.error(`  Error with gallery ${gallery.title}:`, error);
    }
  }

  // 8. Import FAQs
  console.log("\n8. Importing FAQs...");
  const faqsData = fs.readFileSync(path.join(__dirname, '../attached_assets/site_launch_faqs_1758686955222.csv'), 'utf-8');
  const faqs = parseCSV(faqsData);
  
  // Delete all existing FAQs first
  await db.delete(schema.faqs);
  
  for (const faq of faqs) {
    let communityId: string | null = null;
    if (faq.communitySlug) {
      const community = await db.select().from(schema.communities).where(eq(schema.communities.slug, faq.communitySlug));
      if (community.length > 0) {
        communityId = community[0].id;
      }
    }
    
    try {
      await db.insert(schema.faqs).values({
        question: faq.question,
        answer: faq.answerHtml || faq.answer,
        answerHtml: faq.answerHtml,
        category: faq.category,
        communityId: communityId,
        sort: faq.sort ? parseInt(faq.sort) : 0,
        sortOrder: faq.sort ? parseInt(faq.sort) : 0,
        active: true
      });
      console.log(`  Inserted FAQ: ${faq.question.substring(0, 50)}...`);
    } catch (error) {
      console.error(`  Error with FAQ:`, error);
    }
  }

  // 9. Import Events
  console.log("\n9. Importing Events...");
  const eventsData = fs.readFileSync(path.join(__dirname, '../attached_assets/site_launch_events_1758686955221.csv'), 'utf-8');
  const events = parseCSV(eventsData);
  
  // Delete all existing events first
  await db.delete(schema.events);
  
  for (const event of events) {
    const community = await db.select().from(schema.communities).where(eq(schema.communities.slug, event.communitySlug));
    if (community.length === 0) {
      console.log(`  Community not found: ${event.communitySlug}`);
      continue;
    }
    
    try {
      await db.insert(schema.events).values({
        slug: `${event.communitySlug}-${event.eventSlug}`,
        eventSlug: event.eventSlug,
        title: event.title,
        summary: event.summary,
        startsAt: new Date(event.startsAt),
        endsAt: event.endsAt ? new Date(event.endsAt) : null,
        locationText: event.locationText,
        rsvpUrl: event.rsvpUrl,
        communityId: community[0].id,
        published: event.published === 'TRUE',
        isPublic: event.published === 'TRUE'
      });
      console.log(`  Inserted: ${event.title}`);
    } catch (error) {
      console.error(`  Error with event ${event.title}:`, error);
    }
  }

  // 10. Import Posts
  console.log("\n10. Importing Posts...");
  const postsData = fs.readFileSync(path.join(__dirname, '../attached_assets/site_launch_posts_1758686955221.csv'), 'utf-8');
  const posts = parseCSV(postsData);
  
  // Delete all existing posts first
  await db.delete(schema.posts);
  
  for (const post of posts) {
    let communityId: string | null = null;
    if (post.communitySlug) {
      const community = await db.select().from(schema.communities).where(eq(schema.communities.slug, post.communitySlug));
      if (community.length > 0) {
        communityId = community[0].id;
      }
    }
    
    try {
      const tags = post.tags ? post.tags.split('|').filter((tag: string) => tag.trim()) : [];
      
      await db.insert(schema.posts).values({
        slug: post.slug,
        title: post.title,
        summary: post.summary,
        bodyHtml: post.bodyHtml,
        content: post.bodyHtml || '',
        heroImageUrl: post.heroImageUrl,
        tags: tags,
        communityId: communityId,
        published: true,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date()
      });
      console.log(`  Inserted: ${post.title}`);
    } catch (error) {
      console.error(`  Error with post ${post.title}:`, error);
    }
  }

  console.log("\n✅ Data import complete!");
}

importData().catch(console.error);