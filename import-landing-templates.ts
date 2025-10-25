import { db } from './server/db';
import { landingPageTemplates } from './shared/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';

// Read the JSON files
const templatesData = JSON.parse(fs.readFileSync('landing-templates.json', 'utf-8'));
const researchData = JSON.parse(fs.readFileSync('landing-page-research.json', 'utf-8'));
const contentReferenceData = JSON.parse(fs.readFileSync('landing-page-custom-content.json', 'utf-8'));

// Community-specific identifiers to exclude
const communityIdentifiers = [
  'stonebridge',
  'columbine',
  'quail',
  'pond',
  'gardens-at',
  'gardens-on',
  'golden-pond'
];

// Filter for dynamic templates only (containing parameters like :city, :careLevel)
// Exclude community-specific templates
function isDynamicTemplate(urlPattern: string): boolean {
  // Must contain at least one parameter
  const hasParameter = urlPattern.includes(':');
  
  // Must NOT contain community-specific identifiers
  const lowerPattern = urlPattern.toLowerCase();
  const hasCommunityIdentifier = communityIdentifiers.some(identifier => 
    lowerPattern.includes(identifier)
  );
  
  return hasParameter && !hasCommunityIdentifier;
}

// Generate custom content based on template type and URL pattern
function generateCustomContent(urlPattern: string, careTypeId: string | null) {
  const baseTemplate = contentReferenceData["main-landing-care-city"];
  
  // Determine the care type from the URL pattern
  let careType = 'Assisted Living';
  let careTypeKey = 'assistedLiving';
  
  if (urlPattern.includes('/memory-care')) {
    careType = 'Memory Care';
    careTypeKey = 'memoryCare';
  } else if (urlPattern.includes('/independent-living')) {
    careType = 'Independent Living';
    careTypeKey = 'independentLiving';
  } else if (urlPattern.includes('/dementia-care')) {
    careType = 'Dementia Care';
    careTypeKey = 'memoryCare'; // Use memory care research for dementia
  } else if (urlPattern.includes('/alzheimers-care')) {
    careType = "Alzheimer's Care";
    careTypeKey = 'memoryCare'; // Use memory care research for alzheimers
  } else if (urlPattern.includes('/senior-living')) {
    careType = 'Senior Living';
    careTypeKey = 'assistedLiving'; // Generic senior living uses assisted living base
  } else if (urlPattern.includes('/55-plus')) {
    careType = '55+ Active Adult Living';
    careTypeKey = 'independentLiving';
  } else if (urlPattern.includes('/luxury-senior-living')) {
    careType = 'Luxury Senior Living';
    careTypeKey = 'assistedLiving';
  }
  
  // Get care type specific messaging from research
  const careTypeResearch = researchData.careTypes[careTypeKey] || researchData.careTypes.assistedLiving;
  
  // Customize content based on page focus
  let customContent = JSON.parse(JSON.stringify(baseTemplate)); // Deep copy
  
  // Adjust for "near me" variants
  if (urlPattern.includes('-near-me')) {
    customContent.introSection.heading = `Find {careType} Near You in {city}`;
    customContent.introSection.content = `When searching for "${careType.toLowerCase()} near me" in {city}, proximity matters. Our locally owned communities keep your loved one connected to their {city} neighborhood while providing the personalized care they need. Family visits are easy, doctors are nearby, and the familiar {city} community remains part of daily life.`;
    customContent.whyChooseSection.heading = `Why Choose {careType} Close to Home`;
    customContent.whyChooseSection.reasons[0].title = "Stay in Your {city} Neighborhood";
    customContent.whyChooseSection.reasons[0].description = "Keep connections to your {city} community, local doctors, faith community, and family. Being close to home means more visits, familiar faces, and maintaining the social connections that matter most.";
  }
  
  // Adjust for "best" comparison variants
  if (urlPattern.includes('/best-')) {
    customContent.introSection.heading = `Compare the Best {careType} in {city}`;
    customContent.introSection.content = `Finding the best {careType} in {city} means comparing care quality, resident reviews, amenities, and value. Our locally owned communities consistently rank among {city}'s top senior living options, with families who trust us with their loved ones.`;
    customContent.whyChooseSection.heading = `What Makes Us {city}'s Best {careType}`;
    customContent.whyChooseSection.reasons[0].title = "Locally Owned Excellence";
    customContent.whyChooseSection.reasons[0].description = "Our residents and families appreciate the personal touch of local ownership. This isn't a corporate chain—it's personalized care from people who know and care about each resident.";
    customContent.whyChooseSection.reasons[1].title = "Award-Winning Care Standards";
    customContent.whyChooseSection.reasons[1].description = "We maintain staffing ratios above industry standards, invest in ongoing staff training, and prioritize quality over profit margins. Our executive directors have decision-making authority to put residents first.";
  }
  
  // Adjust for luxury variants
  if (urlPattern.includes('/luxury-')) {
    customContent.introSection.heading = `Experience Luxury {careType} in {city}`;
    customContent.introSection.content = `Luxury {careType} in {city} combines upscale amenities with personalized care. From gourmet chef-prepared meals to concierge services, our communities offer the refined lifestyle you've earned with the care support you need.`;
    customContent.whyChooseSection.reasons[2].title = "Upscale Amenities & Services";
    customContent.whyChooseSection.reasons[2].description = "Resort-style amenities including gourmet dining, concierge services, spa-inspired bathrooms, elegant common areas, and personalized housekeeping. Every detail designed for comfort and sophistication.";
  }
  
  // Adjust for 55+ active adult variants
  if (urlPattern.includes('/55-plus')) {
    customContent.introSection.heading = `Active 55+ Community Living in {city}`;
    customContent.introSection.content = `{city}'s 55+ communities offer maintenance-free living designed for active adults who want freedom, social connection, and resort-style amenities. No more yard work or home repairs—just time to enjoy the lifestyle you've earned.`;
    customContent.whyChooseSection.heading = `Why Choose 55+ Active Adult Living`;
    customContent.whyChooseSection.reasons[0].title = "Maintenance-Free Lifestyle";
    customContent.whyChooseSection.reasons[0].description = "No more shoveling snow, mowing lawns, or fixing broken appliances. We handle all maintenance, repairs, and property care so you can focus on enjoying life.";
    customContent.careDetailsSection.heading = `What 55+ Community Living Includes`;
    customContent.careDetailsSection.keyPoints = [
      "Private apartments with full kitchens and modern finishes",
      "Restaurant-style dining with chef-prepared meals",
      "Fitness center and wellness programs",
      "Social activities, clubs, and cultural outings",
      "Maintenance-free living (landscaping, repairs, snow removal)",
      "Community transportation for shopping and appointments",
      "Emergency call systems and on-site staff",
      "Opportunities for travel, hobbies, and lifelong learning"
    ];
  }
  
  // Update careDetailsSection with care-type specific information
  const careTypeServices = careTypeResearch.keyServices || careTypeResearch.specializedApproach || [];
  if (Array.isArray(careTypeServices) && careTypeServices.length > 0) {
    customContent.careDetailsSection.keyPoints = careTypeServices.slice(0, 8);
  }
  
  return customContent;
}

async function importTemplates() {
  console.log('🔍 Filtering templates...');
  
  // Filter for dynamic templates only
  const dynamicTemplates = templatesData.filter((template: any) => {
    return isDynamicTemplate(template.url_pattern);
  });
  
  console.log(`✅ Found ${dynamicTemplates.length} dynamic templates (excluding community-specific ones)`);
  console.log(`❌ Excluded ${templatesData.length - dynamicTemplates.length} community-specific templates\n`);
  
  // Check existing templates in database
  console.log('📊 Checking existing templates in database...');
  const existingTemplates = await db.select({
    slug: landingPageTemplates.slug,
    id: landingPageTemplates.id
  }).from(landingPageTemplates);
  
  const existingSlugs = new Set(existingTemplates.map(t => t.slug));
  console.log(`Found ${existingSlugs.size} existing templates in database\n`);
  
  // Separate new vs existing
  const newTemplates = dynamicTemplates.filter((t: any) => !existingSlugs.has(t.slug));
  const existingToUpdate = dynamicTemplates.filter((t: any) => existingSlugs.has(t.slug));
  
  console.log(`📥 ${newTemplates.length} new templates to import`);
  console.log(`♻️  ${existingToUpdate.length} existing templates to update\n`);
  
  let importCount = 0;
  let updateCount = 0;
  
  // Import new templates
  for (const template of newTemplates) {
    const customContent = generateCustomContent(template.url_pattern, template.care_type_id);
    
    try {
      await db.insert(landingPageTemplates).values({
        slug: template.slug,
        urlPattern: template.url_pattern,
        templateType: template.template_type,
        title: template.title,
        metaDescription: template.meta_description,
        h1Headline: template.h1_headline,
        subheadline: template.subheadline,
        communityId: template.community_id || null,
        careTypeId: template.care_type_id || null,
        cities: template.cities || [],
        showGallery: template.show_gallery,
        showTestimonials: template.show_testimonials,
        showTeamMembers: template.show_team_members,
        showPricing: template.show_pricing,
        showFloorPlans: template.show_floor_plans,
        showFaqs: template.show_faqs,
        heroImageId: template.hero_image_id || null,
        heroTitle: template.hero_title,
        heroSubtitle: template.hero_subtitle,
        heroCtaText: template.hero_cta_text,
        customContent: customContent,
        active: template.active,
        sortOrder: template.sort_order
      });
      
      importCount++;
      console.log(`✅ Imported: ${template.slug} (${template.url_pattern})`);
    } catch (error) {
      console.error(`❌ Error importing ${template.slug}:`, error);
    }
  }
  
  // Update existing templates with custom content
  for (const template of existingToUpdate) {
    const customContent = generateCustomContent(template.url_pattern, template.care_type_id);
    
    try {
      await db.update(landingPageTemplates)
        .set({ customContent: customContent })
        .where(eq(landingPageTemplates.slug, template.slug));
      
      updateCount++;
      console.log(`♻️  Updated content: ${template.slug}`);
    } catch (error) {
      console.error(`❌ Error updating ${template.slug}:`, error);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ New templates imported: ${importCount}`);
  console.log(`♻️  Existing templates updated: ${updateCount}`);
  console.log(`📝 Total templates processed: ${importCount + updateCount}`);
  console.log(`❌ Community-specific templates excluded: ${templatesData.length - dynamicTemplates.length}`);
  console.log('='.repeat(60));
}

// Run the import
importTemplates()
  .then(() => {
    console.log('\n✅ Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
