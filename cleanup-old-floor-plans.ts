/**
 * Clean Up Old Floor Plans
 *
 * Removes floor plans that weren't part of the recent systematic import
 * Keeps only the 25 floor plans with proper images from our scraping
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { floorPlans, floorPlanImages } from './shared/schema';
import { eq, isNull, or } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

async function main() {
  const prodUrl = 'postgresql://neondb_owner:npg_rkzNBcC21pWL@ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech/neondb?sslmode=require';
  const pool = new Pool({ connectionString: prodUrl });
  const db = drizzle(pool);

  console.log('\n🧹 Cleaning Up Old Floor Plans\n');

  // Get all floor plans
  const allPlans = await db.select().from(floorPlans);
  console.log(`Found ${allPlans.length} total floor plans\n`);

  // Plans from our recent import have these characteristics:
  // - Have a planSlug set
  // - planSlug starts with specific prefixes from our import
  const validPlanSlugs = [
    'independent-living-one-bedroom',
    'independent-living-two-bedroom',
    'assisted-living-standard-suite',
    'assisted-living-inside-corner-suite',
    'assisted-living-outside-corner-suite',
    'assisted-living-one-bedroom',
    'assisted-living-two-bedroom',
    'memory-care-standard-suite',
    'memory-care-inside-corner-suite',
    'memory-care-outside-corner-suite',
    'assisted-living-private-suite',
    'assisted-living-two-bedroom-jack-jill',
    'memory-care-private-suite',
    'memory-care-one-bedroom',
    'memory-care-two-bedroom-jack-jill',
    'assisted-living-studio-bath',
    'assisted-living-standard-one-bedroom',
    'assisted-living-deluxe-one-bedroom',
    'assisted-living-two-bedroom-one-bath',
    'memory-care-aspen-suite',
    'memory-care-blue-spruce-suite',
    'memory-care-conifer-suite',
    'memory-care-evergreen-suite',
    'memory-care-douglas-fir-suite',
  ];

  const toKeep = allPlans.filter(p =>
    p.planSlug && validPlanSlugs.includes(p.planSlug)
  );

  const toDelete = allPlans.filter(p =>
    !p.planSlug || !validPlanSlugs.includes(p.planSlug)
  );

  console.log(`Plans to keep: ${toKeep.length}`);
  console.log(`Plans to delete: ${toDelete.length}\n`);

  if (toDelete.length > 0) {
    console.log('Deleting old floor plans:');

    for (const plan of toDelete) {
      console.log(`  ❌ ${plan.name} (${plan.planSlug || 'no slug'})`);

      // Delete associated floor plan images first
      await db.delete(floorPlanImages).where(eq(floorPlanImages.floorPlanId, plan.id));

      // Delete the floor plan
      await db.delete(floorPlans).where(eq(floorPlans.id, plan.id));
    }

    console.log(`\n✅ Deleted ${toDelete.length} old floor plans\n`);
  }

  // Verify final state
  const finalPlans = await db.select().from(floorPlans);

  console.log('='.repeat(60));
  console.log('FINAL STATE');
  console.log('='.repeat(60));
  console.log(`📊 Total floor plans: ${finalPlans.length}`);
  console.log();

  console.log('Remaining floor plans:');
  finalPlans.forEach(p => {
    console.log(`  ✅ ${p.name} (${p.planSlug})`);
  });

  console.log();
  console.log('='.repeat(60));
  console.log('✨ CLEANUP COMPLETE!');
  console.log('='.repeat(60));
  console.log('\nOnly properly imported floor plans with images remain! 🎉\n');

  await pool.end();
  process.exit(0);
}

main();
