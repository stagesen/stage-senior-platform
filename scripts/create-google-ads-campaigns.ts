import { db } from '../server/db';
import { googleAdsService } from '../server/google-ads-service';
import {
  googleAdsCampaigns,
  googleAdsAdGroups,
  googleAdsKeywords,
  googleAdsAds,
} from '../shared/schema';

/**
 * Script to create complete Google Ads campaigns for all Stage Senior communities
 * 
 * Creates campaigns with full hierarchy:
 * - Campaign
 *   - Ad Groups (one per care type)
 *     - Keywords (care type specific)
 *     - Responsive Search Ads (with dynamic headlines and descriptions)
 */

interface CommunityData {
  id: string;
  name: string;
  slug: string;
  city: string;
  phone: string;
  careTypes: string[];
}

// Community data from database
const communities: CommunityData[] = [
  {
    id: 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9',
    name: 'Golden Pond Retirement Community',
    slug: 'golden-pond',
    city: 'Golden',
    phone: '(720) 605-1756',
    careTypes: ['assisted-living', 'independent-living', 'memory-care'],
  },
  {
    id: 'd20c45d3-8201-476a-aeb3-9b941f717ccf',
    name: 'Stonebridge Senior',
    slug: 'stonebridge-senior',
    city: 'Arvada',
    phone: '(720) 729-6244',
    careTypes: ['assisted-living', 'memory-care'],
  },
  {
    id: 'dea2cbbe-32da-4774-a85b-5dd9286892ed',
    name: 'The Gardens at Columbine',
    slug: 'the-gardens-at-columbine',
    city: 'Littleton',
    phone: '(720) 740-1249',
    careTypes: ['assisted-living', 'memory-care'],
  },
  {
    id: 'b2c48ce7-11cb-4216-afdb-f2429ccae81f',
    name: 'The Gardens on Quail',
    slug: 'the-gardens-on-quail',
    city: 'Arvada',
    phone: '(303) 456-1501',
    careTypes: ['assisted-living', 'memory-care'],
  },
];

// Care type display names
const careTypeNames: Record<string, string> = {
  'assisted-living': 'Assisted Living',
  'memory-care': 'Memory Care',
  'independent-living': 'Independent Living',
};

// Keywords by care type
const keywordTemplates: Record<string, string[]> = {
  'assisted-living': [
    'assisted living {city}',
    'assisted living near me',
    'senior living {city}',
    'assisted living communities {city}',
    'best assisted living {city}',
  ],
  'memory-care': [
    'memory care {city}',
    'memory care near me',
    'alzheimer\'s care {city}',
    'dementia care {city}',
    'memory care facilities {city}',
  ],
  'independent-living': [
    'independent living {city}',
    'independent living near me',
    'senior apartments {city}',
    'retirement community {city}',
    'active senior living {city}',
  ],
};

/**
 * Generate headlines for responsive search ads
 */
function generateHeadlines(
  communityName: string,
  careType: string,
  city: string,
  phone: string
): string[] {
  const careTypeName = careTypeNames[careType] || careType;
  
  // Truncate if needed to fit 30 char limit
  const truncate = (str: string, max: number = 30) => {
    if (str.length <= max) return str;
    return str.substring(0, max - 3) + '...';
  };
  
  return [
    truncate(communityName),
    truncate(`Quality ${careTypeName} in ${city}`),
    'Schedule Your Tour Today',
    'Trusted Senior Care',
    'Compassionate Expert Care',
    'Award-Winning Community',
    'Personalized Care Plans',
    '24/7 Licensed Staff',
    truncate(`Beautiful ${city} Location`),
    'Restaurant-Style Dining',
    'Engaging Activities Daily',
    'Pet-Friendly Community',
    'Schedule a Free Tour',
    truncate(`Call ${phone} Today`),
    'Colorado\'s Trusted Choice',
  ];
}

/**
 * Generate descriptions for responsive search ads
 */
function generateDescriptions(
  city: string,
  careType: string,
  phone: string
): string[] {
  const careTypeName = careTypeNames[careType] || careType;
  
  // Truncate if needed to fit 90 char limit
  const truncate = (str: string, max: number = 90) => {
    if (str.length <= max) return str;
    return str.substring(0, max - 3) + '...';
  };
  
  return [
    truncate(`Discover exceptional senior living with personalized care plans. Schedule a tour of our beautiful ${city} community today.`),
    truncate(`Award-winning ${careTypeName.toLowerCase()} with 24/7 licensed staff, restaurant-style dining, and engaging activities. Call ${phone} to learn more.`),
    truncate(`Join our warm, welcoming community in ${city}. Pet-friendly with fitness center, salon, and therapeutic gardens. Tour today!`),
    'Trusted Colorado senior living with compassionate care. No-obligation tours available. Experience the Stage Senior difference.',
  ];
}

/**
 * Generate keywords for an ad group
 */
function generateKeywords(careType: string, city: string): Array<{ text: string; matchType: 'BROAD' | 'PHRASE' | 'EXACT' }> {
  const templates = keywordTemplates[careType] || [];
  return templates.map(template => ({
    text: template.replace('{city}', city),
    matchType: 'PHRASE' as const,
  }));
}

/**
 * Create a complete campaign for a community
 */
async function createCampaignForCommunity(community: CommunityData): Promise<void> {
  console.log(`\n========================================`);
  console.log(`Creating campaign for: ${community.name}`);
  console.log(`========================================\n`);
  
  const campaignName = `${community.name} - ${community.city}`;
  const dailyBudget = 50; // $50 daily budget
  const budgetAmountMicros = dailyBudget * 1000000;
  
  // Determine domain for final URLs
  // Use the published domain (stagesenior.com) if in production
  // In development, use the dev domain for testing
  let domain = 'https://stagesenior.com';
  
  const replitDomains = process.env.REPLIT_DOMAINS || '';
  const isProduction = replitDomains.includes('stagesenior.com');
  
  if (!isProduction && process.env.REPLIT_DEV_DOMAIN) {
    domain = `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  
  const finalUrl = `${domain}/communities/${community.slug}`;
  
  try {
    // Step 1: Create campaign budget
    console.log(`Creating budget: Budget for ${campaignName}`);
    const budgetResourceName = await googleAdsService.createCampaignBudget(
      `Budget for ${campaignName}`,
      budgetAmountMicros
    );
    console.log(`✓ Budget created: ${budgetResourceName}`);
    
    // Step 2: Create campaign with MAXIMIZE_CONVERSIONS bidding
    console.log(`Creating campaign: ${campaignName}`);
    const campaignResult = await googleAdsService.createCampaign({
      name: campaignName,
      budgetResourceName,
      status: 'PAUSED', // Start paused for review
      biddingStrategy: 'MAXIMIZE_CONVERSIONS',
    });
    console.log(`✓ Campaign created: ${campaignResult.resourceName} (ID: ${campaignResult.id})`);
    
    // Step 3: Save campaign to database
    const [dbCampaign] = await db.insert(googleAdsCampaigns).values({
      name: campaignName,
      resourceName: campaignResult.resourceName,
      campaignId: campaignResult.id,
      communityId: community.id,
      status: 'PAUSED',
      budgetAmountMicros,
      biddingStrategy: 'MAXIMIZE_CONVERSIONS',
      targetCpaMicros: null,
    }).returning();
    console.log(`✓ Campaign saved to database: ${dbCampaign.id}`);
    
    // Step 4: Create ad groups for each care type
    for (const careType of community.careTypes) {
      const careTypeName = careTypeNames[careType] || careType;
      const adGroupName = `${careTypeName} - ${community.name}`;
      
      console.log(`\n  Creating ad group: ${adGroupName}`);
      
      // Create ad group
      const adGroupResult = await googleAdsService.createAdGroup({
        name: adGroupName,
        campaignResourceName: campaignResult.resourceName,
        cpcBidMicros: 2000000, // $2 default bid
        status: 'ENABLED',
      });
      console.log(`  ✓ Ad group created: ${adGroupResult.resourceName} (ID: ${adGroupResult.id})`);
      
      // Save ad group to database
      const [dbAdGroup] = await db.insert(googleAdsAdGroups).values({
        name: adGroupName,
        resourceName: adGroupResult.resourceName,
        adGroupId: adGroupResult.id,
        campaignId: dbCampaign.id,
        cpcBidMicros: 2000000,
      }).returning();
      console.log(`  ✓ Ad group saved to database: ${dbAdGroup.id}`);
      
      // Step 5: Add keywords to ad group
      const keywords = generateKeywords(careType, community.city);
      console.log(`  Adding ${keywords.length} keywords...`);
      
      const keywordResults = await googleAdsService.addKeywords({
        adGroupResourceName: adGroupResult.resourceName,
        keywords,
      });
      console.log(`  ✓ Keywords added: ${keywordResults.length}`);
      
      // Save keywords to database
      for (const kw of keywordResults) {
        await db.insert(googleAdsKeywords).values({
          keywordText: kw.text,
          matchType: 'PHRASE',
          resourceName: kw.resourceName,
          criterionId: kw.id,
          adGroupId: dbAdGroup.id,
        });
      }
      console.log(`  ✓ Keywords saved to database`);
      
      // Step 6: Create responsive search ad
      const headlines = generateHeadlines(community.name, careType, community.city, community.phone);
      const descriptions = generateDescriptions(community.city, careType, community.phone);
      
      console.log(`  Creating responsive search ad with ${headlines.length} headlines and ${descriptions.length} descriptions...`);
      
      const adResult = await googleAdsService.createResponsiveSearchAd({
        adGroupResourceName: adGroupResult.resourceName,
        headlines,
        descriptions,
        finalUrl,
      });
      console.log(`  ✓ Ad created: ${adResult.resourceName} (ID: ${adResult.id})`);
      
      // Save ad to database
      await db.insert(googleAdsAds).values({
        resourceName: adResult.resourceName,
        adId: adResult.id,
        adGroupId: dbAdGroup.id,
        headlines,
        descriptions,
        finalUrl,
      });
      console.log(`  ✓ Ad saved to database`);
    }
    
    console.log(`\n✅ Campaign "${campaignName}" created successfully with ${community.careTypes.length} ad groups!\n`);
    
  } catch (error: any) {
    console.error(`\n❌ Error creating campaign for ${community.name}:`, error.message);
    throw error;
  }
}

/**
 * Main function to create all campaigns
 */
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  Google Ads Campaign Creator for Stage Senior Communities  ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  console.log(`Creating campaigns for ${communities.length} communities...\n`);
  
  const results = {
    succeeded: [] as string[],
    failed: [] as Array<{ name: string; error: string }>,
  };
  
  for (const community of communities) {
    try {
      await createCampaignForCommunity(community);
      results.succeeded.push(community.name);
    } catch (error: any) {
      console.error(`Failed to create campaign for ${community.name}:`, error.message);
      results.failed.push({
        name: community.name,
        error: error.message || 'Unknown error',
      });
    }
  }
  
  // Print summary
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║                     CAMPAIGN SUMMARY                        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  console.log(`✅ Successfully created: ${results.succeeded.length} campaigns`);
  results.succeeded.forEach(name => {
    console.log(`   • ${name}`);
  });
  
  if (results.failed.length > 0) {
    console.log(`\n❌ Failed to create: ${results.failed.length} campaigns`);
    results.failed.forEach(({ name, error }) => {
      console.log(`   • ${name}: ${error}`);
    });
  }
  
  console.log('\n');
}

// Run the script
main()
  .then(() => {
    console.log('✓ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('✗ Script failed:', error);
    process.exit(1);
  });
