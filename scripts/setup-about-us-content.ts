import { DatabaseStorage } from "../server/storage";
import { readFileSync } from "fs";
import path from "path";

async function setupAboutUsContent() {
  const storage = new DatabaseStorage();

  console.log("Setting up About Us page content...\n");

  // ============================================
  // 1. Upload images to the database
  // ============================================
  console.log("1. Uploading images...");

  const imagePath1 = path.join(
    process.cwd(),
    "attached_assets/generated_images/About_us_team_hero_225db6b0.png"
  );
  const imagePath2 = path.join(
    process.cwd(),
    "attached_assets/generated_images/About_us_staff_candid_55c3287c.png"
  );

  // Create placeholder image records (URLs will be uploaded to storage service)
  const teamHeroImage = await storage.createImage({
    id: "about-us-team-hero-img",
    objectKey: "about-us/team-hero.png",
    url: `/attached_assets/generated_images/About_us_team_hero_225db6b0.png`,
    alt: "Stage Senior leadership team providing compassionate care to residents",
    width: 1024,
    height: 1024,
    sizeBytes: 1509793,
    mimeType: "image/png",
  });

  const staffCandidImage = await storage.createImage({
    id: "about-us-staff-candid-img",
    objectKey: "about-us/staff-candid.png",
    url: `/attached_assets/generated_images/About_us_staff_candid_55c3287c.png`,
    alt: "Stage Senior staff members collaborating and caring for residents",
    width: 1024,
    height: 1024,
    sizeBytes: 1511707,
    mimeType: "image/png",
  });

  console.log(`  ✓ Uploaded team hero image: ${teamHeroImage.id}`);
  console.log(`  ✓ Uploaded staff candid image: ${staffCandidImage.id}\n`);

  // ============================================
  // 2. Create hero section content
  // ============================================
  console.log("2. Creating hero section...");

  const heroSection = await storage.createPageContentSection({
    pagePath: "/about-us",
    sectionType: "hero_section",
    sectionKey: "about-hero",
    title: "About Hero Section",
    subtitle: "Main hero section for About Us page",
    content: {
      heading: "Elevating Senior Living Across Colorado",
      description:
        "Since 2016, Stage Senior Management has been transforming assisted living and memory care communities into vibrant homes where dignity, comfort, and joy come first. As a locally owned Colorado company, we bring authentic hometown values to sophisticated senior care.",
      imageUrl: teamHeroImage.url,
      buttonText: "Tour Our Communities",
      buttonLink: "/communities",
    },
    sortOrder: 1,
    active: true,
  });

  console.log(`  ✓ Created hero section: ${heroSection.id}\n`);

  // ============================================
  // 3. Create feature sections
  // ============================================
  console.log("3. Creating feature sections...");

  // Our Approach Section
  const approachSection = await storage.createPageContentSection({
    pagePath: "/about-us",
    sectionType: "benefit_cards",
    sectionKey: "our-approach",
    title: "Our Approach to Senior Living",
    subtitle: "What sets Stage Senior Management apart",
    content: {
      cards: [
        {
          icon: "heart",
          title: "Personalized Care",
          description:
            "Every resident receives a customized care plan that honors their individual needs, preferences, and highest potential. We create homelike environments where seniors thrive with dignity and independence.",
        },
        {
          icon: "users",
          title: "Family Partnership",
          description:
            "We treat families as true partners in care, with transparent communication, proactive updates, and open-door policies. Your peace of mind is our priority.",
        },
        {
          icon: "award",
          title: "Staff Excellence",
          description:
            "Exceptional resident care starts with exceptional staff care. We invest in development, recognition, and creating a values-aligned culture that attracts and retains the best caregivers.",
        },
        {
          icon: "shield",
          title: "Proven Systems",
          description:
            "We combine local, personal touch with sophisticated operating systems to ensure consistent, high-quality care across all our properties. Best practices meet hometown warmth.",
        },
      ],
    },
    sortOrder: 2,
    active: true,
  });

  console.log(`  ✓ Created approach section: ${approachSection.id}`);

  // Leadership Excellence Section
  const leadershipSection = await storage.createPageContentSection({
    pagePath: "/about-us",
    sectionType: "text_block",
    sectionKey: "leadership-excellence",
    title: "Leadership Excellence",
    subtitle: "100+ Years of Combined Experience",
    content: {
      text:
        "Our executive team brings deep expertise in senior living, healthcare administration, and community management. With decades of combined experience serving Colorado's Front Range, we understand the unique needs of local families and the evolving landscape of senior care.\n\nEvery decision we make is guided by one simple question: What's best for our residents?",
      imageUrl: staffCandidImage.url,
      imagePosition: "right",
    },
    sortOrder: 3,
    active: true,
  });

  console.log(`  ✓ Created leadership section: ${leadershipSection.id}`);

  // Colorado Commitment Section
  const commitmentSection = await storage.createPageContentSection({
    pagePath: "/about-us",
    sectionType: "feature_list",
    sectionKey: "colorado-commitment",
    title: "Our Colorado Commitment",
    subtitle: "Deeply rooted in our local communities",
    content: {
      features: [
        {
          title: "Local Ownership & Leadership",
          description:
            "Founded and headquartered in Colorado, we're accessible to residents, families, and team members. Our leadership visits communities regularly and knows residents by name.",
        },
        {
          title: "Community Integration",
          description:
            "We actively participate in local chambers of commerce, sponsor community events, and create intergenerational programs that keep residents connected to Colorado life.",
        },
        {
          title: "Quality Over Quantity",
          description:
            "We deliberately stay small to maintain quality. With four premier communities along the Front Range, we can give each property the attention it deserves.",
        },
        {
          title: "Long-Tenured Team",
          description:
            "Our staff retention rates significantly exceed industry averages. Stable, long-term caregivers build meaningful relationships and truly know each resident's story.",
        },
      ],
    },
    sortOrder: 4,
    active: true,
  });

  console.log(`  ✓ Created commitment section: ${commitmentSection.id}`);

  // Mission Statement Section
  const missionSection = await storage.createPageContentSection({
    pagePath: "/about-us",
    sectionType: "section_header",
    sectionKey: "mission-statement",
    title: "Our Mission",
    subtitle:
      "To create warm, supportive communities where seniors thrive with dignity, families find peace of mind, and exceptional staff deliver personalized care that honors each resident's unique story.",
    content: {
      heading: "Our Mission",
      subheading:
        "To create warm, supportive communities where seniors thrive with dignity, families find peace of mind, and exceptional staff deliver personalized care that honors each resident's unique story.",
      alignment: "center",
      theme: "primary",
    },
    sortOrder: 5,
    active: true,
  });

  console.log(`  ✓ Created mission section: ${missionSection.id}`);

  // Call-to-Action Section
  const ctaSection = await storage.createPageContentSection({
    pagePath: "/about-us",
    sectionType: "cta",
    sectionKey: "tour-cta",
    title: "Schedule Your Personal Tour",
    subtitle: "Experience the Stage Senior difference firsthand",
    content: {
      heading: "Ready to Experience the Stage Senior Difference?",
      description:
        "Schedule a personal tour of our communities and discover why families across Colorado choose Stage Senior for their loved ones' care. See our homelike environments, meet our caring staff, and learn how we can support your family.",
      primaryButtonText: "Schedule a Tour",
      primaryButtonLink: "/tour-request",
      secondaryButtonText: "Call (970) 444-4689",
      secondaryButtonLink: "tel:+1-970-444-4689",
      theme: "primary",
    },
    sortOrder: 6,
    active: true,
  });

  console.log(`  ✓ Created CTA section: ${ctaSection.id}\n`);

  // ============================================
  // 4. Verify all content was created
  // ============================================
  console.log("4. Verifying content...");

  const allSections = await storage.getPageContentSections("/about-us", false);
  console.log(`  ✓ Total sections created: ${allSections.length}`);
  console.log(`  ✓ Active sections: ${allSections.filter((s) => s.active).length}\n`);

  allSections.forEach((section) => {
    console.log(
      `    - ${section.sectionType} (${section.sectionKey}): ${section.active ? "Active" : "Inactive"}`
    );
  });

  console.log("\n✅ About Us page content setup completed!");
}

// Run the script
setupAboutUsContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
