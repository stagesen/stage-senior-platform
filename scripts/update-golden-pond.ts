import { db } from "../server/db";
import {
  communities,
  communitiesCareTypes,
  communitiesAmenities,
  careTypes,
  amenities,
  floorPlans,
  communityFeatures,
  communityHighlights,
  faqs,
  teamMembers
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

const COMMUNITY_ID = "ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9";
const COMMUNITY_SLUG = "golden-pond";

async function main() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  Golden Pond Retirement Community - Database Update      ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  // 1. Update Community Basic Information
  console.log("📝 Updating community basic information...");
  await db
    .update(communities)
    .set({
      phoneDisplay: "(303) 271-0430",
      phoneDial: "3032710430",
      secondaryPhoneDisplay: "(303) 502-5554",
      secondaryPhoneDial: "3035025554",
      overview: "Since 2004, Golden Pond has been a proud part of Golden, Colorado. We're deeply connected to the community — partnering with local schools, churches, and organizations — while offering independent living, assisted living, and memory care designed for comfort, independence, and care that grows with you.",
      description: `**Locally Owned Excellence**

Golden Pond is locally owned and managed, providing an upscale yet down-to-earth experience that feels like home. Most residents make Golden Pond their forever home — supported by compassionate staff, engaging activities, and chef-prepared dining.

**Independent Living**

Newly remodeled apartments feature granite countertops, stainless appliances, tile backsplash, and in-unit washer and dryer. Enjoy spacious one- and two-bedroom floor plans with community-wide Wi-Fi, Comcast Xfinity HD cable TV, and free transportation to doctor appointments.

On-site dining serves three chef-prepared meals daily, seven days a week. Transportation to stores, banks, churches, and restaurants is included, along with on-site medical services like physicians, podiatry, audiology, and radiology.

24-hour emergency pull cord monitoring, all utilities (except telephone), bi-weekly housekeeping and linen service, and daily trash pickup round out our services. Residents stay active with fitness classes, card games, movie nights, lectures, and scenic drives.

**Assisted Living**

Newly remodeled apartments offer beautiful western views of the foothills or eastern views of North Table Mountain. Care includes 24/7 staff and RN oversight, individualized care plans, three meals daily, and weekly housekeeping and linen service.

All utilities are included — electricity, water, trash, cable, and phone. Daily trash service, free laundry rooms or staff laundry option, Wi-Fi, Comcast HD cable, and a 24-hour emergency system with optional pendant provide peace of mind.

Third-party therapy services, on-site medical providers (physicians, podiatry, audiology, concierge physicians, radiology), scheduled transportation to appointments, and bus transportation to local stores, banks, and churches keep residents connected and cared for.

Activities include fitness classes, card games, lectures, and scenic drives.

**Memory Care – The Meadows**

The Meadows is a specialized, secure neighborhood offering individualized dementia care in a calm, supportive setting. With 15 private studio apartments, warm community spaces, and mountain views, The Meadows provides safety, connection, and dignity.

Newly remodeled private studios include a secured courtyard with views of North Table Mountain, registered nurse oversight, mini refrigerators in every apartment, three daily meals, Comcast HD cable, Wi-Fi, and all utilities.

A full activities calendar, inclusive care up to 150 points, weekly housekeeping and laundry, 24-hour emergency monitoring with optional pendant, on-site medical and therapy services, and newly remodeled dining and activity areas complete the experience.

**Engaging Programs**

Our art program encourages creativity and memory stimulation. Music therapy brings joy through familiar songs and rhythm activities. Memory-specific activities — from hallway bowling to goat yoga — keep life lively.

A sensory room offers a calming, multisensory environment. The courtyard features heated paths and manicured gardens for safe outdoor time and events.

**Dining Excellence**

Restaurant-style dining seven days a week features chef-prepared meals using fresh, seasonal ingredients. Friday happy hour runs 4–5 p.m. with wine, beer, and cocktails available with meals.

Monthly food committee meetings with residents, weekly chef specials, a la carte menu options, and holiday menus and themed dining events make every meal special.`,
      shortDescription: "Locally owned senior living in Golden, CO since 2004. Independent, assisted, and memory care.",
      startingRateDisplay: "Starting at $4,600/month",
      seoTitle: "Golden Pond Retirement Community | Senior Living in Golden, CO Since 2004",
      seoDescription: "Golden Pond offers locally owned independent living, assisted living, and memory care in Golden, CO. Call (303) 271-0430.",
    })
    .where(eq(communities.id, COMMUNITY_ID));
  console.log("✅ Community information updated\n");

  // 2. Update Care Types descriptions
  console.log("🏥 Updating care types...");

  const [independentLivingType] = await db
    .select()
    .from(careTypes)
    .where(eq(careTypes.slug, "independent-living"))
    .limit(1);

  if (independentLivingType) {
    await db
      .update(careTypes)
      .set({
        description: "Newly remodeled one- and two-bedroom apartments with granite kitchens, stainless appliances, in-unit washer/dryer, and mountain views. Starting at $4,600/month."
      })
      .where(eq(careTypes.id, independentLivingType.id));
  }

  const [assistedLivingType] = await db
    .select()
    .from(careTypes)
    .where(eq(careTypes.slug, "assisted-living"))
    .limit(1);

  if (assistedLivingType) {
    await db
      .update(careTypes)
      .set({
        description: "24/7 care staff and RN oversight with individualized care plans. Studio, one-bedroom, and two-bedroom apartments available. Starting at $5,900/month."
      })
      .where(eq(careTypes.id, assistedLivingType.id));
  }

  const [memoryCareType] = await db
    .select()
    .from(careTypes)
    .where(eq(careTypes.slug, "memory-care"))
    .limit(1);

  if (memoryCareType) {
    await db
      .update(careTypes)
      .set({
        name: "Memory Care – The Meadows",
        description: "15 private studios in a secure neighborhood with specialized dementia care, mountain views, and person-centered support. $10,000/month."
      })
      .where(eq(careTypes.id, memoryCareType.id));
  }

  console.log("✅ Care types updated\n");

  // 3. Delete existing features and add new ones
  console.log("✨ Updating community features...");
  await db.delete(communityFeatures).where(eq(communityFeatures.communityId, COMMUNITY_ID));

  const features = [
    {
      eyebrow: "Since 2004",
      title: "Proud Part of Golden, Colorado",
      body: "Deeply connected to the community through partnerships with local schools, churches, and organizations. We honor Golden's heritage with local artwork, historic photos, and Friday happy hours featuring Coors refreshments from our hometown brewery.",
      imageLeft: true,
      sortOrder: 1
    },
    {
      eyebrow: "Forever Home",
      title: "Care That Grows With You",
      body: "Most residents make Golden Pond their forever home. With care that grows with you — from independent living to assisted living and memory care — you can age in place with dignity and compassion.",
      imageLeft: false,
      sortOrder: 2
    },
    {
      eyebrow: "Locally Owned",
      title: "Upscale Yet Down-to-Earth",
      body: "Experience the personal touch of local ownership. Responsive leadership, compassionate staff, and a family feel make all the difference. Life here is golden.",
      imageLeft: true,
      sortOrder: 3
    },
    {
      eyebrow: "Chef-Prepared",
      title: "Restaurant-Style Dining",
      body: "Seven days a week, enjoy fresh seasonal ingredients, weekly chef specials, and a la carte menus. Friday happy hours feature wine, beer, cocktails, and live entertainment.",
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

  // 4. Delete existing highlights and add new ones
  console.log("⭐ Updating community highlights...");
  await db.delete(communityHighlights).where(eq(communityHighlights.communityId, COMMUNITY_ID));

  const highlights = [
    {
      title: "Locally Owned Since 2004",
      description: "Personal touch, responsive leadership, family feel.",
      sortOrder: 1
    },
    {
      title: "Care That Grows With You",
      description: "Independent, assisted, and memory care options.",
      sortOrder: 2
    },
    {
      title: "Beautiful Golden, CO Location",
      description: "Scenic mountain views and community connections.",
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

  // 5. Update Floor Plans
  console.log("🏠 Updating floor plans...");

  // Delete existing floor plans for clean slate
  await db.delete(floorPlans).where(eq(floorPlans.communityId, COMMUNITY_ID));

  // Get care type IDs
  const [ilType] = await db.select().from(careTypes).where(eq(careTypes.slug, "independent-living")).limit(1);
  const [alType] = await db.select().from(careTypes).where(eq(careTypes.slug, "assisted-living")).limit(1);
  const [mcType] = await db.select().from(careTypes).where(eq(careTypes.slug, "memory-care")).limit(1);

  const newFloorPlans = [
    {
      name: "Independent Living – One Bedroom",
      careTypeId: ilType?.id,
      bedrooms: 1,
      bathrooms: 1,
      description: "Granite kitchen, stackable washer/dryer, stainless appliances, natural two-tone wall colors.",
      startingRateDisplay: "$4,600/month",
      startingPrice: 4600,
      availability: "available",
      accessible: true,
      highlights: ["Granite countertops", "In-unit washer/dryer", "Stainless appliances", "Tile backsplash"],
      sortOrder: 1
    },
    {
      name: "Independent Living – Two Bedroom",
      careTypeId: ilType?.id,
      bedrooms: 2,
      bathrooms: 1,
      description: "Spacious two-bedroom with granite kitchen, stackable washer/dryer, stainless appliances, and mountain views.",
      startingRateDisplay: "$5,300/month",
      startingPrice: 5300,
      availability: "limited",
      accessible: true,
      highlights: ["Granite countertops", "In-unit washer/dryer", "Stainless appliances", "Mountain views"],
      sortOrder: 2
    },
    {
      name: "Assisted Living – Studio",
      careTypeId: alType?.id,
      bedrooms: 0,
      bathrooms: 1,
      description: "Newly remodeled studio with mountain views, mini fridge, and emergency monitoring.",
      startingRateDisplay: "$5,900/month",
      startingPrice: 5900,
      availability: "available",
      accessible: true,
      highlights: ["Mountain views", "All utilities included", "24/7 care staff"],
      sortOrder: 3
    },
    {
      name: "Assisted Living – One Bedroom",
      careTypeId: alType?.id,
      bedrooms: 1,
      bathrooms: 1,
      description: "Spacious one-bedroom assisted living apartment with beautiful views and personalized care.",
      startingRateDisplay: "$7,900/month",
      startingPrice: 7900,
      availability: "limited",
      accessible: true,
      highlights: ["Separate bedroom", "Mountain or foothill views", "Individualized care plan"],
      sortOrder: 4
    },
    {
      name: "Assisted Living – Two Bedroom",
      careTypeId: alType?.id,
      bedrooms: 2,
      bathrooms: 1,
      description: "Large two-bedroom for couples or roommates with full assisted living services.",
      startingRateDisplay: "$9,500/month",
      startingPrice: 9500,
      availability: "waitlist",
      accessible: true,
      highlights: ["Two bedrooms", "Spacious layout", "Perfect for couples"],
      sortOrder: 5
    },
    {
      name: "Memory Care – The Meadows Private Studio",
      careTypeId: mcType?.id,
      bedrooms: 0,
      bathrooms: 1,
      description: "Private studio in secure memory care neighborhood with specialized dementia care and mountain views.",
      startingRateDisplay: "$10,000/month",
      startingPrice: 10000,
      availability: "limited",
      accessible: true,
      highlights: ["Secured courtyard access", "RN oversight", "Mini refrigerator", "Inclusive care up to 150 points"],
      sortOrder: 6
    }
  ];

  for (const plan of newFloorPlans) {
    await db.insert(floorPlans).values({
      communityId: COMMUNITY_ID,
      ...plan,
    });
  }
  console.log(`✅ Added ${newFloorPlans.length} floor plans\n`);

  // 6. Update FAQs
  console.log("❓ Updating FAQs...");
  await db.delete(faqs).where(eq(faqs.communityId, COMMUNITY_ID));

  const newFaqs = [
    {
      question: "What is included in Independent Living?",
      answer: "Newly remodeled apartments with granite countertops, stainless appliances, tile backsplash, in-unit washer/dryer, community-wide Wi-Fi, Comcast HD cable, free transportation to doctor appointments, on-site dining with three chef-prepared meals daily, bi-weekly housekeeping and linen service, all utilities except telephone, daily trash service, and 24-hour emergency monitoring.",
      category: "Independent Living",
      sortOrder: 1
    },
    {
      question: "What is included in Assisted Living?",
      answer: "24/7 care staff and RN oversight, individualized care plans, three meals daily, weekly housekeeping and linen service, all utilities (electricity, water, trash, cable, phone), daily trash service, free laundry rooms or staff laundry option, Wi-Fi and Comcast HD cable, 24-hour emergency system with optional pendant, on-site medical services, and scheduled transportation.",
      category: "Assisted Living",
      sortOrder: 2
    },
    {
      question: "What is The Meadows?",
      answer: "The Meadows is our specialized, secure memory care neighborhood with 15 private studios, registered nurse oversight, secured courtyard with mountain views, full activities calendar, inclusive care up to 150 points, weekly housekeeping and laundry, and newly remodeled dining and activity areas.",
      category: "Memory Care",
      sortOrder: 3
    },
    {
      question: "How much does it cost?",
      answer: "Independent Living starts at $4,600/month for one-bedroom apartments. Assisted Living starts at $5,900/month for studios. Memory Care at The Meadows is $10,000/month for private studios. All options include a one-time community fee of $5,000.",
      category: "Pricing",
      sortOrder: 4
    },
    {
      question: "What are Care Points?",
      answer: "In Assisted Living, care needs are evaluated before move-in. Each Care Point equals $20 per month, added to base rent according to assessed needs. Memory Care includes up to 150 Care Points; beyond that, each additional point is $20/month.",
      category: "Pricing",
      sortOrder: 5
    },
    {
      question: "What dining options are available?",
      answer: "Restaurant-style dining seven days a week with breakfast (7–9 a.m.), lunch (11 a.m.–1 p.m.), and dinner (4–6 p.m.). Assisted Living and Memory Care include all meals. Independent Living residents can purchase meal plans: breakfast $10, lunch $17, dinner $17. Friday happy hour runs 4–5 p.m. with wine, beer, and cocktails.",
      category: "Dining",
      sortOrder: 6
    },
    {
      question: "What activities are offered?",
      answer: "Scenic drives, discussion groups, guest speakers, music and painting classes, bingo, games, holiday and family events, religious programs, walking and exercise groups, knitting and hobby circles, creative workshops, intergenerational activities, resident council, and memory-specific activities like art program, music therapy, hallway bowling, and goat yoga.",
      category: "Activities",
      sortOrder: 7
    },
    {
      question: "Tell me about Golden, Colorado.",
      answer: "Golden was founded during the 1859 gold rush along Clear Creek and served as capital of the Colorado Territory from 1862–1867. It's home to the world's largest single brewery (Coors) and is surrounded by foothills, trails, and open space. Today it has 45,000 residents and a thriving small-town culture.",
      category: "Community",
      sortOrder: 8
    }
  ];

  for (const faq of newFaqs) {
    await db.insert(faqs).values({
      communityId: COMMUNITY_ID,
      ...faq,
    });
  }
  console.log(`✅ Added ${newFaqs.length} FAQs\n`);

  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  Update Complete!                                         ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("\n✅ Summary:");
  console.log(`   • Community info updated`);
  console.log(`   • Care types updated (3)`);
  console.log(`   • Features updated (${features.length})`);
  console.log(`   • Highlights updated (${highlights.length})`);
  console.log(`   • Floor plans updated (${newFloorPlans.length})`);
  console.log(`   • FAQs updated (${newFaqs.length})`);
  console.log("\n🎉 Golden Pond data is now fully updated!\n");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
