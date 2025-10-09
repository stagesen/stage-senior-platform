/**
 * Verify Floor Plan Images Are Accessible
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { floorPlans, images, floorPlanImages, communities, careTypes } from './shared/schema';
import { eq, and } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log('='.repeat(80));
  console.log('FLOOR PLAN IMAGE VERIFICATION REPORT');
  console.log(`Generated: ${new Date().toISOString()}`);
  console.log('='.repeat(80));
  console.log();

  // Get all active communities
  const activeCommunities = await db
    .select()
    .from(communities)
    .where(eq(communities.active, true));

  console.log(`Found ${activeCommunities.length} active communities`);
  console.log();

  // Get all floor plans for active communities
  const allPlans = await db
    .select()
    .from(floorPlans)
    .where(eq(floorPlans.active, true));

  // Filter to only floor plans for active communities
  const activeFloorPlans = allPlans.filter(plan =>
    activeCommunities.some(comm => comm.id === plan.communityId)
  );

  console.log(`Found ${activeFloorPlans.length} active floor plans across all communities`);
  console.log();

  // Group by community and analyze
  const plansByCommunity: Record<string, any[]> = {};
  const stats: Record<string, any> = {};

  for (const plan of activeFloorPlans) {
    if (!plan.communityId) continue;

    const community = activeCommunities.find(c => c.id === plan.communityId);
    const communityName = community?.name || 'Unknown';

    if (!plansByCommunity[communityName]) {
      plansByCommunity[communityName] = [];
      stats[communityName] = {
        total: 0,
        hasImage: 0,
        hasLegacyUrl: 0,
        hasBrokenRef: 0,
        missing: 0,
      };
    }

    stats[communityName].total++;

    // Get care type if exists
    let careTypeName = null;
    if (plan.careTypeId) {
      const [careType] = await db.select().from(careTypes).where(eq(careTypes.id, plan.careTypeId));
      careTypeName = careType?.name || null;
    }

    // Check main image via imageId
    let mainImageUrl = null;
    let imageIdExists = false;
    if (plan.imageId) {
      const [img] = await db.select().from(images).where(eq(images.id, plan.imageId));
      if (img) {
        mainImageUrl = img.url;
        imageIdExists = true;
        stats[communityName].hasImage++;
      } else {
        stats[communityName].hasBrokenRef++;
      }
    } else if (plan.imageUrl) {
      // Check if using legacy imageUrl field
      stats[communityName].hasLegacyUrl++;
    } else {
      // Completely missing
      stats[communityName].missing++;
    }

    // Get additional images from junction table
    const additionalImages = await db
      .select()
      .from(floorPlanImages)
      .where(eq(floorPlanImages.floorPlanId, plan.id));

    const additionalImageUrls = [];
    for (const fpImg of additionalImages) {
      const [img] = await db.select().from(images).where(eq(images.id, fpImg.imageId));
      if (img) {
        additionalImageUrls.push(img.url);
      }
    }

    // Determine status
    let status = '';
    if (plan.imageId && imageIdExists) {
      status = 'Has Image';
    } else if (plan.imageId && !imageIdExists) {
      status = 'BROKEN REFERENCE';
    } else if (plan.imageUrl && !plan.imageId) {
      status = 'Using Legacy imageUrl';
    } else {
      status = 'MISSING';
    }

    plansByCommunity[communityName].push({
      name: plan.name,
      slug: plan.planSlug,
      careType: careTypeName,
      imageId: plan.imageId,
      imageUrl: plan.imageUrl,
      mainImage: mainImageUrl,
      additionalImages: additionalImageUrls,
      totalImages: (mainImageUrl ? 1 : 0) + additionalImageUrls.length,
      status,
    });
  }

  // STEP 1: Display statistics by community
  console.log('='.repeat(80));
  console.log('STATISTICS BY COMMUNITY');
  console.log('='.repeat(80));
  console.log();

  for (const [communityName, commStats] of Object.entries(stats)) {
    console.log(`${communityName}:`);
    console.log(`  Total Floor Plans: ${commStats.total}`);
    console.log(`  Has Image (imageId): ${commStats.hasImage} (${((commStats.hasImage/commStats.total)*100).toFixed(1)}%)`);
    console.log(`  Using Legacy imageUrl: ${commStats.hasLegacyUrl} (${((commStats.hasLegacyUrl/commStats.total)*100).toFixed(1)}%)`);
    console.log(`  Broken References: ${commStats.hasBrokenRef} (${((commStats.hasBrokenRef/commStats.total)*100).toFixed(1)}%)`);
    console.log(`  Missing Images: ${commStats.missing} (${((commStats.missing/commStats.total)*100).toFixed(1)}%)`);
    console.log();
  }

  // STEP 2: Overall statistics
  const totalFloorPlans = activeFloorPlans.length;
  const totalWithImage = Object.values(stats).reduce((sum: number, s: any) => sum + s.hasImage, 0);
  const totalLegacyUrl = Object.values(stats).reduce((sum: number, s: any) => sum + s.hasLegacyUrl, 0);
  const totalBrokenRef = Object.values(stats).reduce((sum: number, s: any) => sum + s.hasBrokenRef, 0);
  const totalMissing = Object.values(stats).reduce((sum: number, s: any) => sum + s.missing, 0);

  console.log('='.repeat(80));
  console.log('OVERALL STATISTICS');
  console.log('='.repeat(80));
  console.log();
  console.log(`Total Active Floor Plans: ${totalFloorPlans}`);
  console.log(`Has Image (imageId): ${totalWithImage} (${((totalWithImage/totalFloorPlans)*100).toFixed(1)}%)`);
  console.log(`Using Legacy imageUrl: ${totalLegacyUrl} (${((totalLegacyUrl/totalFloorPlans)*100).toFixed(1)}%)`);
  console.log(`Broken References: ${totalBrokenRef} (${((totalBrokenRef/totalFloorPlans)*100).toFixed(1)}%)`);
  console.log(`Missing Images: ${totalMissing} (${((totalMissing/totalFloorPlans)*100).toFixed(1)}%)`);
  console.log();

  // STEP 3: Floor plans requiring attention
  console.log('='.repeat(80));
  console.log('FLOOR PLANS REQUIRING ATTENTION');
  console.log('='.repeat(80));
  console.log();

  const problematicPlans = activeFloorPlans.filter(plan => {
    const allPlansData = Object.values(plansByCommunity).flat();
    const planData = allPlansData.find((p: any) => p.imageId === plan.imageId && p.name === plan.name);
    return planData && planData.status !== 'Has Image';
  });

  if (problematicPlans.length === 0) {
    console.log('All floor plans have proper images! No issues found.');
  } else {
    console.log(`Found ${problematicPlans.length} floor plan(s) that need attention:\n`);

    for (const [communityName, plans] of Object.entries(plansByCommunity)) {
      const commProblems = plans.filter((p: any) => p.status !== 'Has Image');

      if (commProblems.length > 0) {
        console.log(`${communityName.toUpperCase()}`);
        console.log('-'.repeat(80));

        for (const plan of commProblems) {
          console.log(`  Floor Plan: ${plan.name}`);
          if (plan.careType) {
            console.log(`    Care Type: ${plan.careType}`);
          }
          console.log(`    Status: ${plan.status}`);
          console.log(`    imageId: ${plan.imageId || 'NULL'}`);
          console.log(`    imageUrl: ${plan.imageUrl || 'NULL'}`);
          console.log();
        }
      }
    }
  }

  // STEP 4: Legacy imageUrl usage
  console.log('='.repeat(80));
  console.log('FLOOR PLANS USING LEGACY imageUrl FIELD');
  console.log('='.repeat(80));
  console.log();

  const legacyPlans = Object.entries(plansByCommunity)
    .flatMap(([communityName, plans]) =>
      plans
        .filter((p: any) => p.status === 'Using Legacy imageUrl')
        .map((p: any) => ({ ...p, communityName }))
    );

  if (legacyPlans.length === 0) {
    console.log('No floor plans using legacy imageUrl field.');
  } else {
    console.log(`Found ${legacyPlans.length} floor plan(s) using legacy imageUrl:\n`);

    for (const plan of legacyPlans) {
      console.log(`  ${plan.communityName} - ${plan.name}`);
      console.log(`    imageUrl: ${plan.imageUrl}`);
      console.log();
    }
  }

  // STEP 5: Detailed floor plan list (all floor plans)
  console.log('='.repeat(80));
  console.log('DETAILED FLOOR PLAN LIST (ALL FLOOR PLANS)');
  console.log('='.repeat(80));
  console.log();

  for (const [communityName, plans] of Object.entries(plansByCommunity)) {
    console.log(`${communityName.toUpperCase()}`);
    console.log('-'.repeat(80));

    for (const plan of plans) {
      const statusIcon = plan.status === 'Has Image' ? '✅' : '❌';
      console.log(`  ${statusIcon} ${plan.name}`);
      if (plan.careType) {
        console.log(`     Care Type: ${plan.careType}`);
      }
      console.log(`     Status: ${plan.status}`);
      console.log(`     Total Images: ${plan.totalImages} (Main: ${plan.mainImage ? '1' : '0'}, Additional: ${plan.additionalImages.length})`);

      if (plan.mainImage) {
        console.log(`     Main Image URL: ${plan.mainImage.substring(0, 60)}...`);
      }

      if (plan.additionalImages.length > 0) {
        console.log(`     Additional Images: ${plan.additionalImages.length}`);
      }
      console.log();
    }
  }

  console.log('='.repeat(80));
  console.log('END OF REPORT');
  console.log('='.repeat(80));

  await pool.end();
  process.exit(0);
}

main().catch((error) => {
  console.error('Error running verification:', error);
  process.exit(1);
});
