import { db } from "../server/db";
import { communities, teamMembers, landingPageTemplates } from "@shared/schema";
import { eq } from "drizzle-orm";
import { writeFileSync } from "fs";

interface SiteUrl {
  url: string;
  type: string;
  description: string;
}

async function exportAllUrls() {
  console.log("🔍 Extracting all site URLs...\n");

  const urls: SiteUrl[] = [];

  // Static pages
  const staticPages = [
    { url: "/", type: "Static", description: "Homepage" },
    { url: "/communities", type: "Static", description: "Communities Listing" },
    { url: "/events", type: "Static", description: "Events Listing" },
    { url: "/team", type: "Static", description: "Team Directory" },
    { url: "/faqs", type: "Static", description: "FAQs" },
    { url: "/about-us", type: "Static", description: "About Us" },
    { url: "/careers", type: "Static", description: "Careers" },
    { url: "/contact", type: "Static", description: "Contact" },
    { url: "/dining", type: "Static", description: "Dining" },
    { url: "/beauty-salon", type: "Static", description: "Beauty Salon & Barber" },
    { url: "/fitness-therapy", type: "Static", description: "Fitness & Therapy Center" },
    { url: "/courtyards-patios", type: "Static", description: "Courtyards & Patios" },
    { url: "/services", type: "Static", description: "Services" },
    { url: "/stage-cares", type: "Static", description: "Stage Cares" },
    { url: "/care-points", type: "Static", description: "Care Points" },
    { url: "/safety-with-dignity", type: "Static", description: "Safety with Dignity" },
    { url: "/in-home-care", type: "Static", description: "In-Home Care" },
    { url: "/services/management", type: "Static", description: "Professional Management" },
    { url: "/services/long-term-care", type: "Static", description: "Long-Term Care" },
    { url: "/services/chaplaincy", type: "Static", description: "Chaplaincy" },
    { url: "/privacy", type: "Static", description: "Privacy Policy" },
    { url: "/terms", type: "Static", description: "Terms of Service" },
    { url: "/accessibility", type: "Static", description: "Accessibility" },
    { url: "/reviews", type: "Static", description: "Reviews" },
    { url: "/for-professionals", type: "Static", description: "For Professionals" },
    { url: "/why-stage-senior", type: "Static", description: "Why Stage Senior" },
    { url: "/compare-care-levels", type: "Static", description: "Compare Care Levels" },
    { url: "/family-stories-and-reviews", type: "Static", description: "Family Stories & Reviews" },
    { url: "/virtual-tour-and-floorplans", type: "Static", description: "Virtual Tours & Floor Plans" },
    { url: "/pricing-and-availability", type: "Static", description: "Pricing & Availability" },
    { url: "/tour-scheduled", type: "Static", description: "Tour Scheduled Success" },
  ];
  urls.push(...staticPages);

  // Dynamic community pages
  console.log("📍 Fetching community URLs...");
  const communityRecords = await db
    .select({ slug: communities.slug, name: communities.name })
    .from(communities)
    .where(eq(communities.active, true));

  communityRecords.forEach((community) => {
    urls.push({
      url: `/communities/${community.slug}`,
      type: "Community",
      description: community.name,
    });
  });
  console.log(`   ✓ Found ${communityRecords.length} community URLs`);

  // Dynamic team member pages
  console.log("👥 Fetching team member URLs...");
  const teamRecords = await db
    .select({ slug: teamMembers.slug, name: teamMembers.name })
    .from(teamMembers);

  teamRecords.forEach((member) => {
    urls.push({
      url: `/team/${member.slug}`,
      type: "Team Member",
      description: member.name,
    });
  });
  console.log(`   ✓ Found ${teamRecords.length} team member URLs`);

  // Dynamic landing pages
  console.log("🎯 Fetching landing page URLs...");
  const templates = await db
    .select({ 
      urlPattern: landingPageTemplates.urlPattern, 
      title: landingPageTemplates.title,
      cities: landingPageTemplates.cities
    })
    .from(landingPageTemplates)
    .where(eq(landingPageTemplates.active, true));

  templates.forEach((template) => {
    const urlPattern = template.urlPattern;
    
    // If the pattern has :city parameter, expand it for each city
    if (urlPattern.includes(':city') && template.cities && template.cities.length > 0) {
      template.cities.forEach((city) => {
        const url = urlPattern.replace(':city', city.toLowerCase().replace(/\s+/g, '-'));
        urls.push({
          url,
          type: "Landing Page",
          description: `${template.title} - ${city}`,
        });
      });
    } else if (urlPattern.includes(':careType')) {
      // If it has :careType, we can't expand without knowing all possible values
      // Just note it as a pattern
      urls.push({
        url: urlPattern,
        type: "Landing Page Pattern",
        description: template.title,
      });
    } else {
      // Static landing page URL
      urls.push({
        url: urlPattern,
        type: "Landing Page",
        description: template.title,
      });
    }
  });
  console.log(`   ✓ Found ${templates.length} landing page templates`);

  // Sort URLs alphabetically
  urls.sort((a, b) => a.url.localeCompare(b.url));

  // Generate CSV
  console.log("\n📝 Generating CSV...");
  const csvHeader = "URL,Type,Description\n";
  const csvRows = urls.map((item) => {
    const url = item.url.replace(/,/g, ""); // Remove commas from URLs
    const type = item.type.replace(/,/g, "");
    const description = item.description.replace(/,/g, "");
    return `https://www.stagesenior.com${url},${type},${description}`;
  });

  const csv = csvHeader + csvRows.join("\n");
  
  const outputPath = "attached_assets/stage-senior-all-urls.csv";
  writeFileSync(outputPath, csv);

  console.log(`\n✅ CSV exported successfully!`);
  console.log(`   📁 File: ${outputPath}`);
  console.log(`   📊 Total URLs: ${urls.length}`);
  console.log(`      - Static pages: ${staticPages.length}`);
  console.log(`      - Community pages: ${communityRecords.length}`);
  console.log(`      - Team member pages: ${teamRecords.length}`);
  console.log(`      - Landing pages: ${templates.length}`);
}

exportAllUrls()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
