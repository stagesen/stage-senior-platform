import { db } from "../server/db";
import { pageContentSections } from "../shared/schema";
import { eq, and } from "drizzle-orm";

const servicesHeroContent = [
  {
    pagePath: "/services/management",
    sectionKey: "management_hero_section",
    title: "Management Services Hero",
    content: {
      heading: "Professional Management Services",
      description: "We believe that senior living should be a chapter of life marked by dignity, purpose, and joy. Our management approach focuses on creating environments where residents thrive, families find peace of mind, and staff members grow professionally.",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
    }
  },
  {
    pagePath: "/services/chaplaincy",
    sectionKey: "chaplaincy_hero_section",
    title: "Chaplaincy Services Hero",
    content: {
      heading: "Chaplaincy Services",
      description: "At Stage Management, we believe that genuine care extends beyond physical comfort to embrace emotional and spiritual well-being. Through our partnership with Senior Living Chaplains, a division of Marketplace Chaplains, we provide dedicated spiritual support that welcomes and nurtures residents of all faiths and backgrounds.",
      imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
    }
  },
  {
    pagePath: "/services/long-term-care",
    sectionKey: "ltc_hero_section",
    title: "Long-Term Care Services Hero",
    content: {
      heading: "Long-Term Care Insurance Services",
      description: "Our experienced team provides comprehensive support to help you maximize your long-term care insurance benefits. From initial policy review through ongoing claims management, we handle all aspects of the insurance process so you can focus on what matters most.",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
    }
  }
];

async function populateServicesHeroContent() {
  console.log("Starting to populate services hero content...");

  for (const heroData of servicesHeroContent) {
    try {
      // Check if hero section already exists
      const existing = await db
        .select()
        .from(pageContentSections)
        .where(
          and(
            eq(pageContentSections.pagePath, heroData.pagePath),
            eq(pageContentSections.sectionType, "hero_section")
          )
        )
        .limit(1);

      if (existing.length > 0) {
        console.log(`✓ Hero section for ${heroData.pagePath} already exists, skipping...`);
        continue;
      }

      // Insert hero section
      await db.insert(pageContentSections).values({
        pagePath: heroData.pagePath,
        sectionType: "hero_section",
        sectionKey: heroData.sectionKey,
        title: heroData.title,
        content: heroData.content,
        sortOrder: 0,
        active: true,
      });

      console.log(`✓ Created hero section for ${heroData.pagePath}`);
    } catch (error) {
      console.error(`✗ Error creating hero section for ${heroData.pagePath}:`, error);
    }
  }

  console.log("\nDone! All services hero content has been populated.");
  process.exit(0);
}

populateServicesHeroContent().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
