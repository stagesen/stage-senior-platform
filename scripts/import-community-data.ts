import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { db } from '../server/db';
import {
  communities,
  teamMembers,
  faqs,
  galleries,
  galleryImages,
  communityHighlights,
  communityFeatures,
  testimonials,
  floorPlans,
  floorPlanImages,
  events,
  images,
  communitiesCareTypes,
  communitiesAmenities,
  careTypes,
  amenities,
} from '../shared/schema';
import { eq, and } from 'drizzle-orm';

interface ImageUploadResult {
  id: string;
  url: string;
  objectKey: string;
}

/**
 * Helper function to upload an image from URL to your image storage
 * This is a placeholder - implement based on your storage solution
 */
async function uploadImageFromUrl(url: string, alt?: string): Promise<ImageUploadResult | null> {
  if (!url || url === '') return null;

  // TODO: Implement actual image upload logic here
  // For now, we'll create a record with the provided URL
  const [image] = await db.insert(images).values({
    url: url,
    objectKey: url, // Use URL as object key for now
    alt: alt || '',
    uploadedBy: 1, // Replace with actual user ID
  }).returning();

  return {
    id: image.id,
    url: image.url,
    objectKey: image.objectKey,
  };
}

/**
 * Helper to find or create care type by name
 */
async function findOrCreateCareType(name: string): Promise<string> {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const existing = await db.select().from(careTypes).where(eq(careTypes.slug, slug)).limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  const [careType] = await db.insert(careTypes).values({
    name,
    slug,
  }).returning();

  return careType.id;
}

/**
 * Helper to find or create amenity by name
 */
async function findOrCreateAmenity(name: string): Promise<string> {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const existing = await db.select().from(amenities).where(eq(amenities.slug, slug)).limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  const [amenity] = await db.insert(amenities).values({
    name,
    slug,
  }).returning();

  return amenity.id;
}

/**
 * Import main community data
 */
async function importCommunities(csvPath: string) {
  console.log('📍 Importing communities...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  for (const record of records) {
    if (!record.community_slug) continue;

    console.log(`  Processing: ${record.community_name}`);

    // Upload images
    const imageId = await uploadImageFromUrl(record.hero_image_url, `${record.community_name} hero`);
    const logoImageId = await uploadImageFromUrl(record.logo_image_url, `${record.community_name} logo`);
    const contactImageId = await uploadImageFromUrl(record.contact_card_image_url, 'Contact us');
    const brochureImageId = await uploadImageFromUrl(record.brochure_card_image_url, 'Download brochure');
    const experienceImageId = await uploadImageFromUrl(record.experience_community_image_url, 'Experience our community');
    const fitnessImageId = await uploadImageFromUrl(record.fitness_center_image_url, 'Fitness center');
    const privateDiningImageId = await uploadImageFromUrl(record.private_dining_image_url, 'Private dining');
    const exp1 = await uploadImageFromUrl(record.experience_diff_image_1_url);
    const exp2 = await uploadImageFromUrl(record.experience_diff_image_2_url);
    const exp3 = await uploadImageFromUrl(record.experience_diff_image_3_url);
    const exp4 = await uploadImageFromUrl(record.experience_diff_image_4_url);
    const cal1 = await uploadImageFromUrl(record.calendar_file_1_url);
    const cal2 = await uploadImageFromUrl(record.calendar_file_2_url);

    // Insert or update community
    const [community] = await db.insert(communities).values({
      slug: record.community_slug,
      name: record.community_name,
      street: record.street,
      city: record.city,
      state: record.state || 'CO',
      zip: record.zip,
      phoneDisplay: record.phone_display,
      phoneDial: record.phone_dial,
      secondaryPhoneDisplay: record.secondary_phone_display,
      secondaryPhoneDial: record.secondary_phone_dial,
      email: record.email,
      overview: record.overview,
      description: record.description,
      shortDescription: record.short_description,
      seoTitle: record.seo_title,
      seoDescription: record.seo_description,
      startingRateDisplay: record.starting_rate_display,
      startingPrice: record.starting_price ? parseInt(record.starting_price) : null,
      mainColorHex: record.main_color_hex,
      ctaColorHex: record.cta_color_hex,
      latitude: record.latitude,
      longitude: record.longitude,
      brochureLink: record.brochure_link,
      imageId: imageId?.id,
      logoImageId: logoImageId?.id,
      contactImageId: contactImageId?.id,
      brochureImageId: brochureImageId?.id,
      experienceImageId: experienceImageId?.id,
      fitnessImageId: fitnessImageId?.id,
      privateDiningImageId: privateDiningImageId?.id,
      experienceImage1Id: exp1?.id,
      experienceImage2Id: exp2?.id,
      experienceImage3Id: exp3?.id,
      experienceImage4Id: exp4?.id,
      calendarFile1Id: cal1?.id,
      calendarFile1ButtonText: record.calendar_file_1_button_text,
      calendarFile2Id: cal2?.id,
      calendarFile2ButtonText: record.calendar_file_2_button_text,
    }).onConflictDoUpdate({
      target: communities.slug,
      set: {
        name: record.community_name,
        street: record.street,
        city: record.city,
        state: record.state || 'CO',
        zip: record.zip,
        phoneDisplay: record.phone_display,
        phoneDial: record.phone_dial,
        email: record.email,
        overview: record.overview,
        description: record.description,
        shortDescription: record.short_description,
        seoTitle: record.seo_title,
        seoDescription: record.seo_description,
        updatedAt: new Date(),
      },
    }).returning();

    // Handle care types
    if (record.care_types) {
      const careTypeNames = record.care_types.split(',').map((s: string) => s.trim()).filter(Boolean);
      for (const careTypeName of careTypeNames) {
        const careTypeId = await findOrCreateCareType(careTypeName);
        await db.insert(communitiesCareTypes).values({
          communityId: community.id,
          careTypeId,
        }).onConflictDoNothing();
      }
    }

    // Handle amenities
    if (record.amenities) {
      const amenityNames = record.amenities.split(',').map((s: string) => s.trim()).filter(Boolean);
      for (const amenityName of amenityNames) {
        const amenityId = await findOrCreateAmenity(amenityName);
        await db.insert(communitiesAmenities).values({
          communityId: community.id,
          amenityId,
        }).onConflictDoNothing();
      }
    }

    console.log(`  ✅ ${record.community_name} imported`);
  }
}

/**
 * Import team members
 */
async function importTeamMembers(csvPath: string) {
  console.log('👥 Importing team members...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  for (const record of records) {
    if (!record.slug || !record.name) continue;

    const community = await db.select().from(communities)
      .where(eq(communities.slug, record.community_slug))
      .limit(1);

    if (community.length === 0) {
      console.log(`  ⚠️  Community not found: ${record.community_slug}`);
      continue;
    }

    const avatarImage = await uploadImageFromUrl(record.avatar_image_url, record.name);

    await db.insert(teamMembers).values({
      slug: record.slug,
      name: record.name,
      role: record.role,
      department: record.department,
      bio: record.bio,
      avatarImageId: avatarImage?.id,
      email: record.email,
      phone: record.phone,
      linkedinUrl: record.linkedin_url,
      tags: [record.community_slug],
      sortOrder: record.sort_order ? parseInt(record.sort_order) : 0,
      featured: record.featured === 'true',
    }).onConflictDoUpdate({
      target: teamMembers.slug,
      set: {
        name: record.name,
        role: record.role,
        bio: record.bio,
        updatedAt: new Date(),
      },
    });

    console.log(`  ✅ ${record.name}`);
  }
}

/**
 * Import FAQs
 */
async function importFaqs(csvPath: string) {
  console.log('❓ Importing FAQs...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  for (const record of records) {
    if (!record.question || !record.answer) continue;

    const community = await db.select().from(communities)
      .where(eq(communities.slug, record.community_slug))
      .limit(1);

    if (community.length === 0) continue;

    await db.insert(faqs).values({
      communityId: community[0].id,
      question: record.question,
      answer: record.answer,
      category: record.category,
      sortOrder: record.sort_order ? parseInt(record.sort_order) : 0,
    });
  }

  console.log(`  ✅ FAQs imported`);
}

/**
 * Import galleries
 */
async function importGalleries(csvPath: string) {
  console.log('🖼️  Importing galleries...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  for (const record of records) {
    if (!record.gallery_slug || !record.title) continue;

    const community = await db.select().from(communities)
      .where(eq(communities.slug, record.community_slug))
      .limit(1);

    if (community.length === 0) continue;

    const [gallery] = await db.insert(galleries).values({
      gallerySlug: record.gallery_slug,
      title: record.title,
      description: record.description,
      category: record.category,
      hero: record.hero === 'true',
      published: record.published === 'true',
      communityId: community[0].id,
      thumbnailIndex: record.thumbnail_index ? parseInt(record.thumbnail_index) : 0,
    }).returning();

    // Add images to gallery
    for (let i = 1; i <= 10; i++) {
      const imageUrl = record[`image_${i}_url`];
      if (!imageUrl) continue;

      const alt = record[`image_${i}_alt`] || '';
      const caption = record[`image_${i}_caption`] || '';

      const image = await uploadImageFromUrl(imageUrl, alt);
      if (image) {
        await db.insert(galleryImages).values({
          galleryId: gallery.id,
          imageId: image.id,
          caption,
          sortOrder: i - 1,
        });
      }
    }

    console.log(`  ✅ ${record.title}`);
  }
}

/**
 * Import highlights
 */
async function importHighlights(csvPath: string) {
  console.log('⭐ Importing highlights...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  for (const record of records) {
    if (!record.title || !record.description) continue;

    const community = await db.select().from(communities)
      .where(eq(communities.slug, record.community_slug))
      .limit(1);

    if (community.length === 0) continue;

    const image = await uploadImageFromUrl(record.image_url, record.title);

    await db.insert(communityHighlights).values({
      communityId: community[0].id,
      title: record.title,
      description: record.description,
      imageId: image?.id,
      ctaLabel: record.cta_label,
      ctaHref: record.cta_href,
      sortOrder: record.sort_order ? parseInt(record.sort_order) : 0,
    });
  }

  console.log(`  ✅ Highlights imported`);
}

/**
 * Import features
 */
async function importFeatures(csvPath: string) {
  console.log('✨ Importing features...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  for (const record of records) {
    if (!record.title || !record.body) continue;

    const community = await db.select().from(communities)
      .where(eq(communities.slug, record.community_slug))
      .limit(1);

    if (community.length === 0) continue;

    const image = await uploadImageFromUrl(record.image_url, record.image_alt);

    await db.insert(communityFeatures).values({
      communityId: community[0].id,
      eyebrow: record.eyebrow,
      title: record.title,
      body: record.body,
      imageId: image?.id,
      imageAlt: record.image_alt,
      ctaLabel: record.cta_label,
      ctaHref: record.cta_href,
      imageLeft: record.image_left === 'true',
      sortOrder: record.sort_order ? parseInt(record.sort_order) : 0,
    });
  }

  console.log(`  ✅ Features imported`);
}

/**
 * Import testimonials
 */
async function importTestimonials(csvPath: string) {
  console.log('💬 Importing testimonials...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  for (const record of records) {
    if (!record.author_name || !record.content) continue;

    const community = await db.select().from(communities)
      .where(eq(communities.slug, record.community_slug))
      .limit(1);

    if (community.length === 0) continue;

    const image = await uploadImageFromUrl(record.author_image_url, record.author_name);

    await db.insert(testimonials).values({
      communityId: community[0].id,
      authorName: record.author_name,
      authorRelation: record.author_relation,
      content: record.content,
      highlight: record.highlight,
      rating: record.rating ? parseInt(record.rating) : null,
      imageId: image?.id,
      featured: record.featured === 'true',
      approved: record.approved === 'true',
      sortOrder: record.sort_order ? parseInt(record.sort_order) : 0,
    });
  }

  console.log(`  ✅ Testimonials imported`);
}

/**
 * Import floor plans
 */
async function importFloorPlans(csvPath: string) {
  console.log('🏠 Importing floor plans...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  for (const record of records) {
    if (!record.plan_slug || !record.name) continue;

    const community = await db.select().from(communities)
      .where(eq(communities.slug, record.community_slug))
      .limit(1);

    if (community.length === 0) continue;

    const mainImage = await uploadImageFromUrl(record.image_1_url, record.image_1_caption);
    const planPdf = await uploadImageFromUrl(record.floor_plan_pdf_url, 'Floor plan');
    const specPdf = await uploadImageFromUrl(record.spec_pdf_url, 'Specifications');

    // Parse highlights from comma-separated string
    let highlightsList: string[] = [];
    if (record.highlights) {
      highlightsList = record.highlights.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const [floorPlan] = await db.insert(floorPlans).values({
      communityId: community[0].id,
      planSlug: record.plan_slug,
      name: record.name,
      bedrooms: parseInt(record.bedrooms),
      bathrooms: record.bathrooms,
      squareFeet: record.square_feet ? parseInt(record.square_feet) : null,
      description: record.description,
      highlights: highlightsList,
      imageId: mainImage?.id,
      pdfUrl: planPdf?.url,
      specPdfUrl: specPdf?.url,
      startingRateDisplay: record.starting_rate_display,
      startingPrice: record.starting_price ? parseInt(record.starting_price) : null,
      availability: record.availability || 'available',
      accessible: record.accessible === 'true',
      sortOrder: record.sort_order ? parseInt(record.sort_order) : 0,
    }).returning();

    // Add additional images
    for (let i = 2; i <= 5; i++) {
      const imageUrl = record[`image_${i}_url`];
      if (!imageUrl) continue;

      const caption = record[`image_${i}_caption`] || '';
      const image = await uploadImageFromUrl(imageUrl, caption);

      if (image) {
        await db.insert(floorPlanImages).values({
          floorPlanId: floorPlan.id,
          imageId: image.id,
          caption,
          sortOrder: i - 1,
        });
      }
    }

    console.log(`  ✅ ${record.name}`);
  }
}

/**
 * Import events
 */
async function importEvents(csvPath: string) {
  console.log('📅 Importing events...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  for (const record of records) {
    if (!record.event_slug || !record.title) continue;

    const community = await db.select().from(communities)
      .where(eq(communities.slug, record.community_slug))
      .limit(1);

    if (community.length === 0) continue;

    const image = await uploadImageFromUrl(record.image_url, record.title);

    await db.insert(events).values({
      slug: record.event_slug,
      title: record.title,
      summary: record.summary,
      description: record.description,
      imageId: image?.id,
      startsAt: new Date(record.starts_at),
      endsAt: record.ends_at ? new Date(record.ends_at) : null,
      locationText: record.location_text,
      rsvpUrl: record.rsvp_url,
      communityId: community[0].id,
      published: record.published === 'true',
      isPublic: record.is_public === 'true',
      maxAttendees: record.max_attendees ? parseInt(record.max_attendees) : null,
    }).onConflictDoUpdate({
      target: events.slug,
      set: {
        title: record.title,
        description: record.description,
        updatedAt: new Date(),
      },
    });
  }

  console.log(`  ✅ Events imported`);
}

/**
 * Main import function
 */
async function main() {
  const baseDir = process.cwd();

  try {
    console.log('🚀 Starting community data import...\n');

    await importCommunities(path.join(baseDir, 'community-data-template.csv'));
    await importTeamMembers(path.join(baseDir, 'community-team-members-template.csv'));
    await importFaqs(path.join(baseDir, 'community-faqs-template.csv'));
    await importGalleries(path.join(baseDir, 'community-galleries-template.csv'));
    await importHighlights(path.join(baseDir, 'community-highlights-template.csv'));
    await importFeatures(path.join(baseDir, 'community-features-template.csv'));
    await importTestimonials(path.join(baseDir, 'community-testimonials-template.csv'));
    await importFloorPlans(path.join(baseDir, 'community-floor-plans-template.csv'));
    await importEvents(path.join(baseDir, 'community-events-template.csv'));

    console.log('\n✅ All data imported successfully!');
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();
