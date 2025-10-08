#!/usr/bin/env node

/**
 * Community Import Script
 * Imports community data from JSON files into PostgreSQL database
 *
 * Usage: node import-community.js <json-file> <database-url>
 * Example: node import-community.js gardens-on-quail.json "postgresql://user:pass@host/db"
 */

const fs = require('fs');
const { Client } = require('pg');

async function importCommunity(jsonFilePath, databaseUrl) {
  const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    console.log('✓ Connected to database');

    await client.query('BEGIN');

    // 1. Insert or update community
    console.log(`\n📍 Importing community: ${data.community.name}`);

    const communityResult = await client.query(`
      INSERT INTO communities (
        slug, name, street, city, state, zip,
        latitude, longitude,
        phone_display, phone_dial,
        secondary_phone_display, secondary_phone_dial,
        email, overview, description, short_description,
        starting_rate_display, rating, review_count,
        license_status, same_day_tours, no_obligation,
        featured, active, seo_title, seo_desc, brochure_link
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24, $25, $26, $27
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        street = EXCLUDED.street,
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        zip = EXCLUDED.zip,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        phone_display = EXCLUDED.phone_display,
        phone_dial = EXCLUDED.phone_dial,
        secondary_phone_display = EXCLUDED.secondary_phone_display,
        secondary_phone_dial = EXCLUDED.secondary_phone_dial,
        email = EXCLUDED.email,
        overview = EXCLUDED.overview,
        description = EXCLUDED.description,
        short_description = EXCLUDED.short_description,
        starting_rate_display = EXCLUDED.starting_rate_display,
        rating = EXCLUDED.rating,
        review_count = EXCLUDED.review_count,
        license_status = EXCLUDED.license_status,
        same_day_tours = EXCLUDED.same_day_tours,
        no_obligation = EXCLUDED.no_obligation,
        featured = EXCLUDED.featured,
        active = EXCLUDED.active,
        seo_title = EXCLUDED.seo_title,
        seo_desc = EXCLUDED.seo_desc,
        brochure_link = EXCLUDED.brochure_link,
        updated_at = now()
      RETURNING id
    `, [
      data.community.slug,
      data.community.name,
      data.community.street || null,
      data.community.city,
      data.community.state,
      data.community.zip || null,
      data.community.latitude || null,
      data.community.longitude || null,
      data.community.phone_display || null,
      data.community.phone_dial || null,
      data.community.secondary_phone_display || null,
      data.community.secondary_phone_dial || null,
      data.community.email || null,
      data.community.overview || null,
      data.community.description || null,
      data.community.short_description || null,
      data.community.starting_rate_display || null,
      data.community.rating || null,
      data.community.review_count || null,
      data.community.license_status || null,
      data.community.same_day_tours || false,
      data.community.no_obligation || false,
      data.community.featured || false,
      data.community.active !== false,
      data.community.seo_title || null,
      data.community.seo_description || null,
      data.community.brochure_link || null
    ]);

    const communityId = communityResult.rows[0].id;
    console.log(`  ✓ Community saved (ID: ${communityId})`);

    // 2. Import care types
    if (data.care_types && data.care_types.length > 0) {
      console.log(`\n🏥 Importing ${data.care_types.length} care types...`);
      for (const careType of data.care_types) {
        // Insert care type if it doesn't exist
        await client.query(`
          INSERT INTO care_types (slug, name, description, active)
          VALUES ($1, $2, $3, true)
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description
        `, [careType.slug, careType.name, careType.description || null]);

        // Link to community
        const careTypeResult = await client.query(
          'SELECT id FROM care_types WHERE slug = $1',
          [careType.slug]
        );
        const careTypeId = careTypeResult.rows[0].id;

        await client.query(`
          INSERT INTO communities_care_types (community_id, care_type_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [communityId, careTypeId]);

        console.log(`  ✓ ${careType.name}`);
      }
    }

    // 3. Import amenities
    if (data.amenities && data.amenities.length > 0) {
      console.log(`\n🎯 Importing ${data.amenities.length} amenities...`);
      for (const amenity of data.amenities) {
        // Insert amenity if it doesn't exist
        await client.query(`
          INSERT INTO amenities (slug, name, category, description, icon, active)
          VALUES ($1, $2, $3, $4, $5, true)
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            category = EXCLUDED.category,
            description = EXCLUDED.description,
            icon = EXCLUDED.icon
        `, [
          amenity.slug,
          amenity.name,
          amenity.category || null,
          amenity.description || null,
          amenity.icon || null
        ]);

        // Link to community
        const amenityResult = await client.query(
          'SELECT id FROM amenities WHERE slug = $1',
          [amenity.slug]
        );
        const amenityId = amenityResult.rows[0].id;

        await client.query(`
          INSERT INTO communities_amenities (community_id, amenity_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [communityId, amenityId]);

        console.log(`  ✓ ${amenity.name}`);
      }
    }

    // 4. Import floor plans
    if (data.floor_plans && data.floor_plans.length > 0) {
      console.log(`\n🏠 Importing ${data.floor_plans.length} floor plans...`);
      for (const plan of data.floor_plans) {
        const planResult = await client.query(`
          INSERT INTO floor_plans (
            community_id, name, bedrooms, bathrooms, square_feet,
            description, starting_rate_display, availability,
            accessible, highlights, sort_order, active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
          ON CONFLICT DO NOTHING
          RETURNING id
        `, [
          communityId,
          plan.name,
          plan.bedrooms,
          plan.bathrooms,
          plan.square_feet || null,
          plan.description || null,
          plan.starting_rate_display || null,
          plan.availability || 'available',
          plan.accessible || false,
          JSON.stringify(plan.highlights || []),
          plan.sort_order || 0
        ]);

        console.log(`  ✓ ${plan.name} (${plan.bedrooms}BR/${plan.bathrooms}BA)`);

        // Import floor plan images
        if (planResult.rows.length > 0 && plan.images && plan.images.length > 0) {
          const planId = planResult.rows[0].id;
          for (const image of plan.images) {
            // Create image ID from URL
            const imageId = image.url.split('/').pop().split('.')[0] || `img-${Date.now()}`;

            // Insert image
            await client.query(`
              INSERT INTO images (id, object_key, url, alt, width, height)
              VALUES ($1, $2, $3, $4, 1200, 800)
              ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url, alt = EXCLUDED.alt
            `, [
              imageId,
              imageId,
              image.url,
              image.caption || ''
            ]);

            // Link to floor plan
            await client.query(`
              INSERT INTO floor_plan_images (floor_plan_id, image_id, caption, sort_order)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT DO NOTHING
            `, [planId, imageId, image.caption || '', 0]);
          }
        }
      }
    }

    // 5. Import features
    if (data.features && data.features.length > 0) {
      console.log(`\n⭐ Importing ${data.features.length} community features...`);
      for (const feature of data.features) {
        await client.query(`
          INSERT INTO community_features (
            community_id, eyebrow, title, body, cta_label, cta_href,
            image_left, sort_order, active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
          ON CONFLICT DO NOTHING
        `, [
          communityId,
          feature.eyebrow || null,
          feature.title,
          feature.body || null,
          feature.cta_label || null,
          feature.cta_href || null,
          feature.image_left || false,
          feature.sort_order || 0
        ]);
        console.log(`  ✓ ${feature.title}`);
      }
    }

    // 6. Import highlights
    if (data.highlights && data.highlights.length > 0) {
      console.log(`\n💡 Importing ${data.highlights.length} highlights...`);
      for (const highlight of data.highlights) {
        await client.query(`
          INSERT INTO community_highlights (
            community_id, title, description, cta_label, cta_href, sort_order, active
          ) VALUES ($1, $2, $3, $4, $5, $6, true)
          ON CONFLICT DO NOTHING
        `, [
          communityId,
          highlight.title,
          highlight.description || null,
          highlight.cta_label || null,
          highlight.cta_href || null,
          highlight.sort_order || 0
        ]);
        console.log(`  ✓ ${highlight.title}`);
      }
    }

    // 7. Import FAQs
    if (data.faqs && data.faqs.length > 0) {
      console.log(`\n❓ Importing ${data.faqs.length} FAQs...`);
      for (const faq of data.faqs) {
        await client.query(`
          INSERT INTO faqs (
            community_id, question, answer, category, sort_order, active
          ) VALUES ($1, $2, $3, $4, $5, true)
          ON CONFLICT DO NOTHING
        `, [
          communityId,
          faq.question,
          faq.answer || null,
          faq.category || null,
          faq.sort_order || 0
        ]);
        console.log(`  ✓ ${faq.question.substring(0, 50)}...`);
      }
    }

    // 8. Import galleries
    if (data.galleries && data.galleries.length > 0) {
      console.log(`\n📸 Importing ${data.galleries.length} galleries...`);
      for (const gallery of data.galleries) {
        const galleryResult = await client.query(`
          INSERT INTO galleries (
            title, description, community_id, category, hero, active, published
          ) VALUES ($1, $2, $3, $4, $5, true, true)
          ON CONFLICT DO NOTHING
          RETURNING id
        `, [
          gallery.title,
          gallery.description || null,
          communityId,
          gallery.category || null,
          gallery.hero || false
        ]);

        console.log(`  ✓ ${gallery.title} (${gallery.images?.length || 0} images)`);

        // Import gallery images
        if (galleryResult.rows.length > 0 && gallery.images && gallery.images.length > 0) {
          const galleryId = galleryResult.rows[0].id;
          for (const image of gallery.images) {
            const imageId = image.url.split('/').pop().split('.')[0] || `img-${Date.now()}`;

            await client.query(`
              INSERT INTO images (id, object_key, url, alt, width, height)
              VALUES ($1, $2, $3, $4, 1200, 800)
              ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url, alt = EXCLUDED.alt
            `, [
              imageId,
              imageId,
              image.url,
              image.alt || image.caption || ''
            ]);

            await client.query(`
              INSERT INTO gallery_images (gallery_id, image_id, caption, sort_order)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT DO NOTHING
            `, [galleryId, imageId, image.caption || '', image.sort_order || 0]);
          }
        }
      }
    }

    // 9. Import events
    if (data.events && data.events.length > 0) {
      console.log(`\n🎉 Importing ${data.events.length} events...`);
      for (const event of data.events) {
        await client.query(`
          INSERT INTO events (
            slug, title, summary, description, starts_at, ends_at,
            location_text, rsvp_url, community_id, max_attendees,
            is_public, published
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
          ON CONFLICT DO NOTHING
        `, [
          event.title.toLowerCase().replace(/\s+/g, '-'),
          event.title,
          event.summary || null,
          event.description || null,
          event.starts_at,
          event.ends_at || null,
          event.location_text || null,
          event.rsvp_url || null,
          communityId,
          event.max_attendees || null,
          event.is_public !== false
        ]);
        console.log(`  ✓ ${event.title}`);
      }
    }

    await client.query('COMMIT');
    console.log(`\n✅ Import completed successfully for ${data.community.name}!`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Import failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the import
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node import-community.js <json-file> <database-url>');
  console.error('Example: node import-community.js gardens-on-quail.json "postgresql://user:pass@host/db"');
  process.exit(1);
}

importCommunity(args[0], args[1])
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
