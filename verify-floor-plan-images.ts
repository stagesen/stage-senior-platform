/**
 * Verify Floor Plan Images Are Accessible
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { floorPlans, images, floorPlanImages, communities } from './shared/schema';
import { eq } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

async function main() {
  const prodUrl = 'postgresql://neondb_owner:npg_rkzNBcC21pWL@ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech/neondb?sslmode=require';
  const pool = new Pool({ connectionString: prodUrl });
  const db = drizzle(pool);

  console.log('\n🔍 Detailed Floor Plan Image Verification\n');

  const allPlans = await db.select().from(floorPlans);

  // Group by community
  const plansByCommunity: Record<string, any[]> = {};

  for (const plan of allPlans) {
    if (!plan.communityId) continue;

    const [community] = await db.select().from(communities).where(eq(communities.id, plan.communityId));
    const communityName = community?.name || 'Unknown';

    if (!plansByCommunity[communityName]) {
      plansByCommunity[communityName] = [];
    }

    // Get main image
    let mainImageUrl = null;
    if (plan.imageId) {
      const [img] = await db.select().from(images).where(eq(images.id, plan.imageId));
      mainImageUrl = img?.url || null;
    }

    // Get additional images
    const additionalImages = await db.select().from(floorPlanImages).where(eq(floorPlanImages.floorPlanId, plan.id));
    const additionalImageUrls = [];

    for (const fpImg of additionalImages) {
      const [img] = await db.select().from(images).where(eq(images.id, fpImg.imageId));
      if (img) {
        additionalImageUrls.push(img.url);
      }
    }

    plansByCommunity[communityName].push({
      name: plan.name,
      slug: plan.planSlug,
      mainImage: mainImageUrl,
      additionalImages: additionalImageUrls,
      totalImages: (mainImageUrl ? 1 : 0) + additionalImageUrls.length,
    });
  }

  // Display results
  for (const [communityName, plans] of Object.entries(plansByCommunity)) {
    console.log('='.repeat(70));
    console.log(`${communityName.toUpperCase()}`);
    console.log('='.repeat(70));

    for (const plan of plans) {
      console.log(`\n📋 ${plan.name}`);
      console.log(`   Slug: ${plan.slug || 'NO SLUG'}`);
      console.log(`   Total Images: ${plan.totalImages}`);

      if (plan.mainImage) {
        console.log(`   ✅ Main Image: ${plan.mainImage}`);
      } else {
        console.log(`   ❌ NO MAIN IMAGE`);
      }

      if (plan.additionalImages.length > 0) {
        console.log(`   ✅ Additional Images (${plan.additionalImages.length}):`);
        plan.additionalImages.forEach((url: string, i: number) => {
          console.log(`      ${i + 1}. ${url}`);
        });
      }
    }
    console.log();
  }

  // Summary
  const totalPlans = allPlans.length;
  const plansWithImages = allPlans.filter(p => p.imageId !== null);
  const plansWithoutImages = allPlans.filter(p => p.imageId === null);

  console.log('='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Floor Plans: ${totalPlans}`);
  console.log(`✅ Plans with main image: ${plansWithImages.length}`);
  console.log(`❌ Plans without main image: ${plansWithoutImages.length}`);
  console.log();

  if (plansWithoutImages.length > 0) {
    console.log('⚠️  Floor plans missing main image:');
    for (const plan of plansWithoutImages) {
      const [community] = await db.select().from(communities).where(eq(communities.id, plan.communityId!));
      console.log(`   - ${plan.name} at ${community?.name}`);
    }
  }

  await pool.end();
  process.exit(0);
}

main();
