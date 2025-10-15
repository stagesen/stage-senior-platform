const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Read the DATABASE_URL from environment
const sql = neon(process.env.DATABASE_URL);

async function seedLandingPageTemplates() {
  console.log('🚀 Seeding landing page templates...');

  try {
    // Read the exported JSON file
    const templatesData = fs.readFileSync(path.join(__dirname, 'landing-templates.json'), 'utf8');
    const templates = JSON.parse(templatesData);

    console.log(`Found ${templates.length} templates to import`);

    // Check if any templates already exist
    const existingCount = await sql`SELECT COUNT(*) as count FROM landing_page_templates`;
    console.log(`Current templates in database: ${existingCount[0].count}`);

    if (existingCount[0].count > 0) {
      console.log('⚠️  Warning: Database already has landing page templates.');
      console.log('   This script will skip existing slugs and insert new ones.');
    }

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const template of templates) {
      try {
        // Check if this slug already exists
        const existing = await sql`
          SELECT id FROM landing_page_templates
          WHERE slug = ${template.slug}
        `;

        if (existing.length > 0) {
          console.log(`⏭️  Skipping "${template.slug}" - already exists`);
          skipped++;
          continue;
        }

        // Insert the template
        await sql`
          INSERT INTO landing_page_templates (
            id, slug, url_pattern, template_type, title, meta_description,
            h1_headline, subheadline, community_id, care_type_id, cities,
            show_gallery, show_testimonials, show_team_members, show_pricing,
            show_floor_plans, show_faqs, hero_image_id, hero_title, hero_subtitle,
            hero_cta_text, custom_content, active, sort_order, created_at, updated_at,
            schema_org_json, testimonial_video_url, hero_video_url, custom_scripts,
            conversion_rate, impressions, conversions, last_optimized_at
          ) VALUES (
            ${template.id}, ${template.slug}, ${template.url_pattern}, ${template.template_type},
            ${template.title}, ${template.meta_description}, ${template.h1_headline}, ${template.subheadline},
            ${template.community_id}, ${template.care_type_id}, ${template.cities || []},
            ${template.show_gallery}, ${template.show_testimonials}, ${template.show_team_members},
            ${template.show_pricing}, ${template.show_floor_plans}, ${template.show_faqs},
            ${template.hero_image_id}, ${template.hero_title}, ${template.hero_subtitle},
            ${template.hero_cta_text}, ${template.custom_content}, ${template.active},
            ${template.sort_order}, ${template.created_at}, ${template.updated_at},
            ${template.schema_org_json}, ${template.testimonial_video_url}, ${template.hero_video_url},
            ${template.custom_scripts}, ${template.conversion_rate}, ${template.impressions},
            ${template.conversions}, ${template.last_optimized_at}
          )
        `;

        console.log(`✅ Inserted "${template.slug}"`);
        inserted++;
      } catch (error) {
        console.error(`❌ Error inserting "${template.slug}":`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Landing page template seeding complete!');
    console.log('='.repeat(60));
    console.log(`✅ Inserted: ${inserted}`);
    console.log(`⏭️  Skipped:  ${skipped}`);
    console.log(`❌ Errors:   ${errors}`);
    console.log('='.repeat(60));

    // Verify final count
    const finalCount = await sql`SELECT COUNT(*) as count FROM landing_page_templates`;
    console.log(`\nTotal templates in database: ${finalCount[0].count}`);

  } catch (error) {
    console.error('❌ Fatal error seeding landing page templates:', error);
    process.exit(1);
  }
}

seedLandingPageTemplates();
