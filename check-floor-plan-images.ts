import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { floorPlans, images, floorPlanImages } from './shared/schema';
import { eq } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

async function main() {
  const prodUrl = 'postgresql://neondb_owner:npg_rkzNBcC21pWL@ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech/neondb?sslmode=require';
  const pool = new Pool({ connectionString: prodUrl });
  const db = drizzle(pool);

  console.log('\n🔍 Checking Floor Plan Images in Production\n');

  const allPlans = await db.select().from(floorPlans);

  console.log(`Found ${allPlans.length} floor plans\n`);

  for (const plan of allPlans) {
    console.log(`${plan.name}:`);
    console.log(`  Plan Slug: ${plan.planSlug}`);
    console.log(`  Main Image ID: ${plan.imageId}`);

    if (plan.imageId) {
      const [mainImage] = await db.select().from(images).where(eq(images.id, plan.imageId));
      if (mainImage) {
        console.log(`  Main Image URL: ${mainImage.url}`);
      } else {
        console.log(`  ⚠️  Main image record not found!`);
      }
    } else {
      console.log(`  ⚠️  No main image ID set`);
    }

    // Check additional images
    const additionalImages = await db
      .select()
      .from(floorPlanImages)
      .where(eq(floorPlanImages.floorPlanId, plan.id));

    if (additionalImages.length > 0) {
      console.log(`  Additional Images: ${additionalImages.length}`);
      for (const fpImage of additionalImages) {
        const [img] = await db.select().from(images).where(eq(images.id, fpImage.imageId));
        if (img) {
          console.log(`    - ${img.url}`);
        }
      }
    } else {
      console.log(`  Additional Images: 0`);
    }

    console.log();
  }

  await pool.end();
  process.exit(0);
}

main();
