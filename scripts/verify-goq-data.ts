import { db } from "../server/db";
import { communityFeatures, communityHighlights, communities } from "@shared/schema";
import { eq } from "drizzle-orm";

const COMMUNITY_ID = "b2c48ce7-11cb-4216-afdb-f2429ccae81f";

async function verify() {
  console.log("🔍 Verifying Gardens on Quail data...\n");

  // Get community info
  const [community] = await db
    .select()
    .from(communities)
    .where(eq(communities.id, COMMUNITY_ID))
    .limit(1);

  console.log("📍 Community:");
  console.log(`   Name: ${community.name}`);
  console.log(`   Slug: ${community.slug}`);
  console.log(`   ID: ${community.id}\n`);

  // Get features
  const features = await db
    .select()
    .from(communityFeatures)
    .where(eq(communityFeatures.communityId, COMMUNITY_ID))
    .orderBy(communityFeatures.sortOrder);

  console.log("✨ Community Features:");
  features.forEach((feature, index) => {
    console.log(`\n   ${index + 1}. ${feature.title}`);
    console.log(`      Eyebrow: ${feature.eyebrow}`);
    console.log(`      Body: ${feature.body.substring(0, 100)}...`);
    console.log(`      Image Left: ${feature.imageLeft}`);
    console.log(`      Sort Order: ${feature.sortOrder}`);
  });

  // Get highlights
  const highlights = await db
    .select()
    .from(communityHighlights)
    .where(eq(communityHighlights.communityId, COMMUNITY_ID))
    .orderBy(communityHighlights.sortOrder);

  console.log("\n\n⭐ Community Highlights:");
  highlights.forEach((highlight, index) => {
    console.log(`\n   ${index + 1}. ${highlight.title}`);
    console.log(`      Description: ${highlight.description}`);
    console.log(`      Sort Order: ${highlight.sortOrder}`);
  });

  console.log("\n\n✅ Verification complete!");
  console.log(`   Total Features: ${features.length}`);
  console.log(`   Total Highlights: ${highlights.length}`);
}

verify()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
