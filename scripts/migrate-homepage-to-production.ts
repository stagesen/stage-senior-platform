import pg from 'pg';
const { Client } = pg;

async function migrateHomepageSections() {
  // Source: ep-royal-mouse (has real data)
  const sourceDb = new Client({
    connectionString: "postgresql://neondb_owner:npg_ICLdzPKQi19h@ep-royal-mouse-afvhqvpe.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require"
  });

  // Target: ep-bitter-firefly (production)
  const targetDb = new Client({
    connectionString: "postgresql://neondb_owner:npg_rkzNBcC21pWL@ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech/neondb?sslmode=require"
  });

  try {
    await sourceDb.connect();
    await targetDb.connect();

    console.log("✓ Connected to both databases\n");

    // Fetch homepage sections from source
    const { rows: sourceSections } = await sourceDb.query(
      "SELECT * FROM homepage_sections ORDER BY sort_order"
    );

    console.log(`Found ${sourceSections.length} homepage sections in source database:\n`);
    sourceSections.forEach(section => {
      console.log(`  - ${section.title} (${section.slug})`);
    });

    // Delete the "test" entry in production
    await targetDb.query("DELETE FROM homepage_sections WHERE slug = 'test'");
    console.log("\n✓ Cleaned up test data from production\n");

    // Insert each section into target
    console.log("Migrating sections to production...\n");

    for (const section of sourceSections) {
      // Check if image exists in target database, otherwise set to NULL
      let imageId = section.image_id;
      if (imageId) {
        const { rows: imageExists } = await targetDb.query(
          "SELECT id FROM images WHERE id = $1",
          [imageId]
        );
        if (imageExists.length === 0) {
          console.log(`  ⚠ Image ${imageId} not found in production, setting to NULL`);
          imageId = null;
        }
      }

      // Check if section already exists
      const { rows: existing } = await targetDb.query(
        "SELECT id FROM homepage_sections WHERE slug = $1",
        [section.slug]
      );

      if (existing.length > 0) {
        // Update existing
        await targetDb.query(
          `UPDATE homepage_sections
           SET title = $1, subtitle = $2, body = $3, section_type = $4,
               cta_label = $5, cta_url = $6, image_id = $7, sort_order = $8,
               visible = $9, metadata = $10, updated_at = NOW()
           WHERE slug = $11`,
          [
            section.title,
            section.subtitle,
            section.body,
            section.section_type,
            section.cta_label,
            section.cta_url,
            imageId,
            section.sort_order,
            section.visible,
            section.metadata,
            section.slug
          ]
        );
        console.log(`  ✓ Updated: ${section.title}`);
      } else {
        // Insert new
        await targetDb.query(
          `INSERT INTO homepage_sections
           (id, slug, section_type, title, subtitle, body, cta_label, cta_url,
            image_id, sort_order, visible, metadata, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())`,
          [
            section.id,
            section.slug,
            section.section_type,
            section.title,
            section.subtitle,
            section.body,
            section.cta_label,
            section.cta_url,
            imageId,
            section.sort_order,
            section.visible,
            section.metadata
          ]
        );
        console.log(`  ✓ Inserted: ${section.title}`);
      }
    }

    // Verify migration
    const { rows: targetSections } = await targetDb.query(
      "SELECT slug, title, visible FROM homepage_sections ORDER BY sort_order"
    );

    console.log("\n✓ Migration complete! Production now has:\n");
    targetSections.forEach(section => {
      console.log(`  - ${section.title} (${section.slug}) ${section.visible ? '✓ Visible' : '✗ Hidden'}`);
    });

  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  } finally {
    await sourceDb.end();
    await targetDb.end();
  }
}

// Run migration
migrateHomepageSections()
  .then(() => {
    console.log("\n✅ Homepage sections successfully migrated to production!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
