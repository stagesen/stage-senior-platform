import { db } from "../server/db";
import { 
  communities, 
  landingPageTemplates, 
  pageContentSections 
} from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Clean Slate Landing Page Migration
 * 
 * This script implements the complete restructure of the landing page system:
 * 1. Updates communities with cluster mappings
 * 2. Deletes all existing landing page templates
 * 3. Creates 3 new master templates for dynamic routing
 * 4. Seeds page_content_sections for standardized layouts
 */

async function migrateLandingPages() {
  console.log("🚀 Starting clean slate landing page migration...\n");

  try {
    // Step 1: Update communities with cluster mappings
    console.log("📍 Step 1: Updating community cluster mappings...");
    
    // Littleton cluster
    await db.update(communities)
      .set({ cluster: "littleton" })
      .where(eq(communities.slug, "the-gardens-at-columbine"));
    console.log("  ✓ The Gardens at Columbine → littleton cluster");

    // Arvada cluster
    await db.update(communities)
      .set({ cluster: "arvada" })
      .where(eq(communities.slug, "the-gardens-on-quail"));
    console.log("  ✓ The Gardens on Quail → arvada cluster");
    
    await db.update(communities)
      .set({ cluster: "arvada" })
      .where(eq(communities.slug, "stonebridge-senior"));
    console.log("  ✓ Stonebridge Senior → arvada cluster");

    // Golden cluster
    await db.update(communities)
      .set({ cluster: "golden" })
      .where(eq(communities.slug, "golden-pond"));
    console.log("  ✓ Golden Pond → golden cluster");

    // Step 2: Delete all existing landing page templates
    console.log("\n🗑️  Step 2: Clearing existing landing page templates...");
    const deletedTemplates = await db.delete(landingPageTemplates).returning();
    console.log(`  ✓ Deleted ${deletedTemplates.length} existing templates`);

    // Step 3: Create 3 master templates
    console.log("\n📝 Step 3: Creating new master templates...");

    const newTemplates = [
      // Template 1: Main landing pages /{care-level}/:city
      {
        slug: "main-landing-care-city",
        urlPattern: "/:careLevel/:city",
        templateType: "location-care-hybrid",
        title: "{careType} in {city} | Stage Senior",
        metaDescription: "Discover compassionate {careType} in {city}, Colorado. Locally owned with on-site services, continuum of care, and dedicated staff. Schedule a tour today.",
        h1Headline: "{careType} in {city}, Colorado",
        subheadline: "Locally owned senior living with personalized care and compassionate service",
        showGallery: true,
        showTestimonials: true,
        showTeamMembers: false,
        showPricing: true,
        showFloorPlans: true,
        showFaqs: true,
        active: true,
        sortOrder: 1,
      },
      
      // Template 2: Cost/pricing pages /cost/{care-level}/:city
      {
        slug: "cost-landing-care-city",
        urlPattern: "/cost/:careLevel/:city",
        templateType: "pricing-focused",
        title: "Cost of {careType} in {city} | Stage Senior Pricing",
        metaDescription: "Transparent pricing for {careType} in {city}. Learn what drives costs, payment options (Private Pay, LTC Insurance, VA Aid & Attendance), and get your personalized quote.",
        h1Headline: "How Much Does {careType} Cost in {city}?",
        subheadline: "Transparent pricing and flexible payment options to fit your family's needs",
        showGallery: false,
        showTestimonials: true,
        showTeamMembers: false,
        showPricing: true,
        showFloorPlans: false,
        showFaqs: true,
        heroCtaText: "Get My Personalized Pricing",
        active: true,
        sortOrder: 2,
      },
      
      // Template 3: Professional referral page
      {
        slug: "for-professionals",
        urlPattern: "/for-professionals",
        templateType: "professional-referral",
        title: "For Healthcare Professionals | Rapid Placement | Stage Senior",
        metaDescription: "Rapid placement for discharge planners, social workers, and healthcare professionals. Real-time availability, HIPAA-secure intake, 24/7 care team access.",
        h1Headline: "Rapid Placement for Healthcare Professionals",
        subheadline: "Real-time availability and HIPAA-secure placement workflow",
        showGallery: false,
        showTestimonials: true,
        showTeamMembers: false,
        showPricing: false,
        showFloorPlans: false,
        showFaqs: true,
        heroCtaText: "Confirm Today's Availability",
        active: true,
        sortOrder: 3,
      },
    ];

    for (const template of newTemplates) {
      await db.insert(landingPageTemplates).values(template);
      console.log(`  ✓ Created template: ${template.slug}`);
    }

    // Step 4: Seed page_content_sections for each template type
    console.log("\n🎨 Step 4: Creating page content sections...");

    const sections = [
      // Main landing page sections
      {
        pagePath: "/:careLevel/:city",
        sectionType: "cta_row",
        sectionKey: "main-cta-row",
        title: "Get Started Today",
        subtitle: "Schedule your tour, get pricing information, or speak with our team",
        content: {},
        sortOrder: 1,
        active: true,
      },
      {
        pagePath: "/:careLevel/:city",
        sectionType: "trust_strip",
        sectionKey: "main-trust-strip",
        title: "Why Choose Stage Senior",
        content: {
          badges: [
            { label: "Locally Owned", icon: "home" },
            { label: "Licensed & Insured", icon: "shield" },
            { label: "Same-Day Tours", icon: "calendar" },
            { label: "No Obligation", icon: "check" }
          ]
        },
        sortOrder: 2,
        active: true,
      },
      {
        pagePath: "/:careLevel/:city",
        sectionType: "care_comparison",
        sectionKey: "main-care-comparison",
        title: "Is This the Right Level of Care?",
        subtitle: "Compare care levels to find the perfect fit for your loved one",
        content: {},
        sortOrder: 3,
        active: true,
      },
      {
        pagePath: "/:careLevel/:city",
        sectionType: "features_grid",
        sectionKey: "main-features-grid",
        title: "What's Included",
        content: {
          features: [
            "24/7 Professional Care Staff",
            "Personalized Care Plans",
            "Nutritious Chef-Prepared Meals",
            "Engaging Activities & Programs",
            "Housekeeping & Laundry",
            "Transportation Services",
            "On-Site Amenities",
            "Medication Management"
          ]
        },
        sortOrder: 4,
        active: true,
      },
      {
        pagePath: "/:careLevel/:city",
        sectionType: "communities_carousel",
        sectionKey: "main-communities-carousel",
        title: "Nearby Communities",
        subtitle: "Explore our nearby communities serving your area",
        content: {},
        sortOrder: 5,
        active: true,
      },
      {
        pagePath: "/:careLevel/:city",
        sectionType: "pricing_estimator",
        sectionKey: "main-pricing-estimator",
        title: "Pricing Range & Estimator",
        subtitle: "Get a personalized pricing estimate based on your needs",
        content: {},
        sortOrder: 6,
        active: true,
      },
      {
        pagePath: "/:careLevel/:city",
        sectionType: "testimonials_section",
        sectionKey: "main-testimonials",
        title: "What Families Say",
        subtitle: "Hear from families who trust Stage Senior for their loved ones' care",
        content: {},
        sortOrder: 7,
        active: true,
      },
      {
        pagePath: "/:careLevel/:city",
        sectionType: "faq_section",
        sectionKey: "main-faq",
        title: "Frequently Asked Questions",
        subtitle: "Common questions about our communities and services",
        content: {},
        sortOrder: 8,
        active: true,
      },

      // Cost/pricing page sections
      {
        pagePath: "/cost/:careLevel/:city",
        sectionType: "cta_row",
        sectionKey: "cost-cta-row",
        title: "Get Your Personalized Quote",
        subtitle: "Speak with our team to get accurate pricing for your specific needs",
        content: {},
        sortOrder: 1,
        active: true,
      },
      {
        pagePath: "/cost/:careLevel/:city",
        sectionType: "pricing_breakdown",
        sectionKey: "cost-pricing-breakdown",
        title: "What Drives the Price",
        content: {
          factors: [
            { name: "Unit Type", description: "Studio, 1-bedroom, or 2-bedroom apartments" },
            { name: "Level of Care", description: "Amount of assistance needed with daily activities" },
            { name: "Services Included", description: "Meals, housekeeping, activities, and amenities" },
            { name: "Location", description: "Community location and local market rates" }
          ]
        },
        sortOrder: 2,
        active: true,
      },
      {
        pagePath: "/cost/:careLevel/:city",
        sectionType: "payment_options",
        sectionKey: "cost-payment-options",
        title: "Ways to Pay",
        content: {
          options: [
            { name: "Private Pay", description: "Direct payment for services rendered" },
            { name: "Long-Term Care Insurance", description: "We work with most LTC insurance providers" },
            { name: "VA Aid & Attendance", description: "Veterans benefits to help cover costs" }
          ]
        },
        sortOrder: 3,
        active: true,
      },
      {
        pagePath: "/cost/:careLevel/:city",
        sectionType: "pricing_estimator",
        sectionKey: "cost-pricing-estimator",
        title: "Get Your Personalized Pricing",
        subtitle: "Complete our quick form to receive a customized pricing quote",
        content: {},
        sortOrder: 4,
        active: true,
      },
      {
        pagePath: "/cost/:careLevel/:city",
        sectionType: "faq_section",
        sectionKey: "cost-faq",
        title: "Billing & Payment FAQs",
        subtitle: "Questions about deposits, billing cycles, and what's included",
        content: {},
        sortOrder: 5,
        active: true,
      },
    ];

    for (const section of sections) {
      await db.insert(pageContentSections).values(section);
      console.log(`  ✓ Created section: ${section.sectionType} for ${section.pagePath}`);
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`  • 4 communities updated with cluster mappings`);
    console.log(`  • ${deletedTemplates.length} old templates deleted`);
    console.log(`  • 3 new master templates created`);
    console.log(`  • ${sections.length} page sections seeded`);
    console.log("\n🎯 Next steps:");
    console.log(`  1. Build the new landing page section components`);
    console.log(`  2. Update DynamicLandingPage.tsx to use cluster filtering`);
    console.log(`  3. Create special pages (/for-professionals, etc.)`);
    console.log(`  4. Test all URL patterns\n`);

  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateLandingPages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
