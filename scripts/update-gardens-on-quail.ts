import { db } from "../server/db";
import {
  communities,
  communityFeatures,
  communityHighlights,
} from "@shared/schema";
import { eq } from "drizzle-orm";

const COMMUNITY_ID = "b2c48ce7-11cb-4216-afdb-f2429ccae81f";
const COMMUNITY_SLUG = "the-gardens-on-quail";

async function main() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  Gardens on Quail - Features & Highlights Update         ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  // 1. Delete existing features and add new ones
  console.log("✨ Updating community features...");
  await db.delete(communityFeatures).where(eq(communityFeatures.communityId, COMMUNITY_ID));

  const features = [
    {
      eyebrow: "Safe & Secure",
      title: "A Community Built on Trust and Safety",
      body: "Located in Arvada, Colorado, Gardens on Quail provides a safe and secure environment with 24/7 assistance, discreet fall detection technology, and peace-of-mind monitoring. Our campus features a secure courtyard with heated walkways, ensuring year-round outdoor enjoyment in a protected setting.",
      imageLeft: true,
      sortOrder: 1
    },
    {
      eyebrow: "Person-Centered Care",
      title: "Empowering Residents Through Abilities",
      body: "Our care philosophy centers on focusing on abilities rather than limitations. With 56 assisted living apartments and 27 private memory care suites, we provide compassionate, individualized care that integrates Montessori methods, validation therapy, and the Eden Alternative for meaningful, dignified support.",
      imageLeft: false,
      sortOrder: 2
    },
    {
      eyebrow: "Vibrant Living",
      title: "Engaging Activities and Social Connection",
      body: "A full calendar of events keeps residents active and engaged. From Happy Hour Fridays and family brunches to themed parties, weekly clubs, art therapy, outdoor gardening, live music, and intergenerational programs with local schools—life at Gardens on Quail is always vibrant and fulfilling.",
      imageLeft: true,
      sortOrder: 3
    },
    {
      eyebrow: "Chef-Driven Dining",
      title: "Fresh, Seasonal Restaurant-Style Meals",
      body: "Our culinary team creates delicious meals using fresh seasonal ingredients—including vegetables and herbs from our on-site gardens. Enjoy scratch-made soups, weekly chef specials, vegetarian and diabetic options, wine nights, and happy hours in our welcoming dining rooms.",
      imageLeft: false,
      sortOrder: 4
    }
  ];

  for (const feature of features) {
    await db.insert(communityFeatures).values({
      communityId: COMMUNITY_ID,
      ...feature,
    });
  }
  console.log(`✅ Added ${features.length} community features\n`);

  // 2. Delete existing highlights and add new ones
  console.log("⭐ Updating community highlights...");
  await db.delete(communityHighlights).where(eq(communityHighlights.communityId, COMMUNITY_ID));

  const highlights = [
    {
      title: "Secure Outdoor Spaces",
      description: "Beautifully landscaped courtyard with heated walkways, train set, water feature, raised garden beds, and greenhouse for safe year-round enjoyment.",
      sortOrder: 1
    },
    {
      title: "Person-Centered Memory Care",
      description: "Dementia-capable care integrating Montessori, validation therapy, and Eden Alternative to support cognitive health with dignity.",
      sortOrder: 2
    },
    {
      title: "Farm-to-Table Dining",
      description: "Chef-prepared meals featuring fresh ingredients from our on-site gardens, with weekly specials and accommodations for dietary needs.",
      sortOrder: 3
    }
  ];

  for (const highlight of highlights) {
    await db.insert(communityHighlights).values({
      communityId: COMMUNITY_ID,
      ...highlight,
    });
  }
  console.log(`✅ Added ${highlights.length} community highlights\n`);

  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  Update Complete!                                         ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("\n✅ Summary:");
  console.log(`   • Features updated (${features.length})`);
  console.log(`   • Highlights updated (${highlights.length})`);
  console.log("\n🎉 Gardens on Quail features and highlights are now updated!\n");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
