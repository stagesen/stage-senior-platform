import { db } from '../server/db';
import { googleAdsService } from '../server/google-ads-service';
import * as fs from 'fs';

/**
 * Comprehensive Google Ads Campaign Creation Script
 * 
 * Creates all 6 campaigns with ad groups, keywords, and responsive search ads
 * based on the framework document at attached_assets/stage_google_ads_build_1761249325756.md
 */

interface CampaignData {
  name: string;
  type: string;
  budget: number; // Daily budget in USD
  bidStrategy: string;
  networks: string;
  languages: string;
  locations: string;
}

interface AdGroupData {
  campaign: string;
  name: string;
  finalUrl: string;
}

interface KeywordData {
  campaign: string;
  adGroup: string;
  keyword: string;
  matchType: string;
  finalUrl: string;
}

interface FrameworkData {
  campaigns: CampaignData[];
  adGroups: AdGroupData[];
  keywords: KeywordData[];
}

// Match type conversion
function convertMatchType(matchType: string): 'EXACT' | 'PHRASE' | 'BROAD' {
  const normalized = matchType.trim().toLowerCase();
  if (normalized === 'exact') return 'EXACT';
  if (normalized === 'phrase') return 'PHRASE';
  if (normalized === 'broad') return 'BROAD';
  return 'EXACT'; // default
}

// Parse the markdown framework file
function parseFrameworkFile(filePath: string): FrameworkData {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let section = '';
  const campaigns: CampaignData[] = [];
  const adGroups: AdGroupData[] = [];
  const keywords: KeywordData[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('## Campaigns')) {
      section = 'campaigns';
      continue;
    } else if (line.startsWith('## Ad Groups')) {
      section = 'adGroups';
      continue;
    } else if (line.startsWith('## Keywords')) {
      section = 'keywords';
      continue;
    } else if (line.startsWith('## RSAs') || line.startsWith('## Sitelinks')) {
      // Stop parsing when we hit RSAs or other sections
      break;
    }
    
    if (!line.startsWith('|')) continue;
    
    const parts = line.split('|').map(p => p.trim()).filter(p => p);
    
    // Skip separator rows and header rows
    if (parts.length === 0 || parts[0].match(/^-+$/) || 
        parts[0].toLowerCase() === 'campaign' || 
        parts[0].toLowerCase() === 'keyword' || 
        parts[0].toLowerCase() === 'ad group') {
      continue;
    }
    
    if (section === 'campaigns' && parts.length >= 6) {
      campaigns.push({
        name: parts[0],
        type: parts[1],
        budget: parseFloat(parts[2]) || 0,
        bidStrategy: parts[3],
        networks: parts[4],
        languages: parts[5],
        locations: parts[6] || ''
      });
    } else if (section === 'adGroups' && parts.length >= 3) {
      adGroups.push({
        campaign: parts[0],
        name: parts[1],
        finalUrl: parts[2]
      });
    } else if (section === 'keywords' && parts.length >= 4) {
      keywords.push({
        campaign: parts[0],
        adGroup: parts[1],
        keyword: parts[2],
        matchType: parts[3],
        finalUrl: parts[4] || ''
      });
    }
  }
  
  return { campaigns, adGroups, keywords };
}

// Generate ad headlines based on ad group details
function generateHeadlines(adGroupName: string, finalUrl: string): string[] {
  const headlines: string[] = [];
  
  // Extract city and care type from ad group name
  const parts = adGroupName.split(' — ');
  const city = parts[0] || '';
  const careType = parts[1] || '';
  
  // Care type focused headlines
  headlines.push(`${careType} in ${city}`);
  headlines.push(`Quality ${careType}`);
  headlines.push(`${careType} Near You`);
  
  // Location focused
  headlines.push(`${city} Senior Living`);
  headlines.push(`Serving ${city} Families`);
  
  // Call to action headlines
  headlines.push(`Schedule Your Tour Today`);
  headlines.push(`Call (303) 436-2300`);
  headlines.push(`Visit Us in ${city}`);
  
  // Value propositions
  headlines.push(`Compassionate Care 24/7`);
  headlines.push(`Beautiful ${city} Community`);
  headlines.push(`Personalized Care Plans`);
  headlines.push(`Trusted Local Care`);
  
  // Pricing/value
  headlines.push(`Affordable Care Options`);
  headlines.push(`Tour Our Community`);
  headlines.push(`Family-Centered Care`);
  
  return headlines.slice(0, 15); // Max 15 headlines for RSAs
}

// Generate ad descriptions
function generateDescriptions(adGroupName: string, finalUrl: string): string[] {
  const descriptions: string[] = [];
  
  const parts = adGroupName.split(' — ');
  const city = parts[0] || '';
  const careType = parts[1] || '';
  
  descriptions.push(
    `Discover personalized ${careType.toLowerCase()} in ${city} with 24/7 professional staff, beautiful facilities, and engaging activities for your loved one.`
  );
  
  descriptions.push(
    `Our ${city} community offers compassionate care, delicious dining, wellness programs, and a warm, welcoming environment. Schedule your tour today!`
  );
  
  descriptions.push(
    `Experience exceptional ${careType.toLowerCase()} with personalized attention, skilled staff, and resort-style amenities. Call (303) 436-2300 to learn more.`
  );
  
  descriptions.push(
    `Beautiful ${city} senior living community featuring quality care, engaging activities, nutritious meals, and a supportive environment for independence.`
  );
  
  return descriptions.slice(0, 4); // Max 4 descriptions for RSAs
}

// Generate brand campaign headlines
function generateBrandHeadlines(campaignName: string): string[] {
  if (campaignName.includes('Stage Senior')) {
    return [
      'Stage Senior Management',
      'Colorado Senior Living',
      'Trusted Senior Care',
      'Local Senior Living Experts',
      'Stage Senior Communities',
      'Quality Senior Care CO',
      'Family-Owned Senior Care',
      'Compassionate Senior Living',
      'Stage Senior - Local Care',
      'Award-Winning Senior Care',
      'Call (303) 436-2300',
      'Schedule Community Tour',
      'Find Your Community',
      'Colorado\'s Trusted Care',
      'Stage Senior Services'
    ];
  } else {
    // Communities brand campaign
    return [
      'Gardens at Columbine',
      'Gardens on Quail',
      'Golden Pond Community',
      'Stonebridge Senior',
      'Colorado Senior Communities',
      'Denver Metro Senior Living',
      'Visit Our Communities',
      'Tour Available Today',
      'Quality Care Communities',
      'Trusted Local Communities',
      'Call (303) 436-2300',
      'Schedule Your Visit',
      'Find Your Home',
      'Colorado Senior Homes',
      'Beautiful Communities'
    ];
  }
}

// Generate brand campaign descriptions
function generateBrandDescriptions(campaignName: string): string[] {
  if (campaignName.includes('Stage Senior')) {
    return [
      'Colorado-based senior living management company offering assisted living, memory care, and independent living across the Denver metro area.',
      'Locally-owned senior care with personalized service, 24/7 professional staff, beautiful communities, and family-centered approach to senior living.',
      'Stage Senior Management provides compassionate care in Colorado communities. Schedule a tour to experience our quality senior living services.',
      'Discover exceptional senior care with Stage Senior. We offer assisted living, memory care, and independent living in beautiful Colorado communities.'
    ];
  } else {
    return [
      'Explore our premier senior living communities across Colorado including Gardens at Columbine, Gardens on Quail, Golden Pond, and Stonebridge Senior.',
      'Visit our beautiful communities offering assisted living, memory care, and independent living with personalized care and engaging activities.',
      'Tour our Colorado senior communities today. Experience quality care, resort-style amenities, and compassionate staff. Call (303) 436-2300.',
      'Find the perfect senior living community in Colorado. Beautiful facilities, excellent care, and vibrant lifestyle await your loved one.'
    ];
  }
}

// Create a single campaign with all ad groups, keywords, and ads
async function createCampaign(
  campaignData: CampaignData,
  adGroupsForCampaign: AdGroupData[],
  keywordsData: KeywordData[]
): Promise<{ success: boolean; campaignName: string; error?: string }> {
  try {
    console.log(`\n=== Creating Campaign: ${campaignData.name} ===`);
    console.log(`Budget: $${campaignData.budget}/day (${campaignData.budget * 1000000} micros)`);
    console.log(`Ad Groups: ${adGroupsForCampaign.length}`);
    
    // Convert daily budget from USD to micros
    const budgetMicros = Math.round(campaignData.budget * 1000000);
    
    // Determine campaign type
    const isCallsOnly = campaignData.name.includes('Calls Only');
    
    // Step 1: Create campaign budget
    console.log('  Creating campaign budget...');
    const budgetResourceName = await googleAdsService.createCampaignBudget(
      `${campaignData.name} Budget`,
      budgetMicros
    );
    console.log(`  ✓ Budget created: ${budgetResourceName}`);
    
    // Step 2: Create the campaign
    console.log('  Creating campaign...');
    const campaignResult = await googleAdsService.createCampaign({
      name: campaignData.name,
      budgetResourceName,
      status: 'PAUSED', // Start paused for safety
      biddingStrategy: 'MAXIMIZE_CONVERSIONS'
    });
    
    console.log(`✓ Campaign created: ${campaignResult.resourceName}`);
    
    // Create ad groups
    let adGroupsCreated = 0;
    let keywordsCreated = 0;
    let adsCreated = 0;
    
    for (const adGroupData of adGroupsForCampaign) {
      try {
        console.log(`  Creating ad group: ${adGroupData.name}`);
        
        const adGroupResult = await googleAdsService.createAdGroup({
          campaignResourceName: campaignResult.resourceName,
          name: adGroupData.name,
          status: 'ENABLED'
        });
        
        adGroupsCreated++;
        console.log(`  ✓ Ad group created: ${adGroupData.name}`);
        
        // Get keywords for this ad group
        const adGroupKeywords = keywordsData.filter(
          k => k.campaign === campaignData.name && k.adGroup === adGroupData.name
        );
        
        // Create keywords (batch operation)
        if (adGroupKeywords.length > 0) {
          try {
            const keywordBatch = adGroupKeywords.map(k => ({
              text: k.keyword,
              matchType: convertMatchType(k.matchType)
            }));
            
            await googleAdsService.addKeywords({
              adGroupResourceName: adGroupResult.resourceName,
              keywords: keywordBatch
            });
            
            keywordsCreated += adGroupKeywords.length;
            console.log(`  ✓ Added ${adGroupKeywords.length} keywords`);
          } catch (error: any) {
            console.log(`    ⚠ Warning: Could not create keywords: ${error.message}`);
          }
        }
        
        // Create responsive search ad (skip for calls-only campaign)
        if (!isCallsOnly) {
          try {
            const headlines = generateHeadlines(adGroupData.name, adGroupData.finalUrl);
            const descriptions = generateDescriptions(adGroupData.name, adGroupData.finalUrl);
            
            // Truncate path1 and path2 to 15 chars max
            const parts = adGroupData.name.split(' — ');
            const path1 = parts[1] ? parts[1].substring(0, 15).replace(/[^a-zA-Z0-9]/g, '') : '';
            const path2 = parts[0] ? parts[0].substring(0, 15).replace(/[^a-zA-Z0-9]/g, '') : '';
            
            await googleAdsService.createResponsiveSearchAd({
              adGroupResourceName: adGroupResult.resourceName,
              headlines,
              descriptions,
              finalUrl: adGroupData.finalUrl,
              path1: path1 || undefined,
              path2: path2 || undefined
            });
            
            adsCreated++;
            console.log(`  ✓ Responsive search ad created`);
          } catch (error: any) {
            console.log(`  ⚠ Warning: Could not create ad: ${error.message}`);
          }
        }
        
      } catch (error: any) {
        console.log(`  ✗ Error creating ad group "${adGroupData.name}": ${error.message}`);
      }
    }
    
    console.log(`✓ Campaign Summary:`);
    console.log(`  - Ad Groups: ${adGroupsCreated}/${adGroupsForCampaign.length}`);
    console.log(`  - Keywords: ${keywordsCreated}`);
    console.log(`  - Ads: ${adsCreated}`);
    
    return {
      success: true,
      campaignName: campaignData.name
    };
    
  } catch (error: any) {
    console.error(`✗ Error creating campaign "${campaignData.name}": ${error.message}`);
    return {
      success: false,
      campaignName: campaignData.name,
      error: error.message
    };
  }
}

// Main execution function
async function main() {
  console.log('🚀 Stage Senior Google Ads Campaign Creation Script');
  console.log('====================================================\n');
  
  // Check if Google Ads service is configured
  if (!googleAdsService.isConfigured()) {
    console.error('❌ Google Ads service is not configured.');
    console.error('Please set the following environment variables:');
    console.error('  - GOOGLE_ADS_CLIENT_ID');
    console.error('  - GOOGLE_ADS_CLIENT_SECRET');
    console.error('  - GOOGLE_ADS_DEVELOPER_TOKEN');
    console.error('  - GOOGLE_ADS_CUSTOMER_ID');
    console.error('  - GOOGLE_ADS_REFRESH_TOKEN');
    process.exit(1);
  }
  
  console.log('✓ Google Ads service configured\n');
  
  // Parse the framework file
  const frameworkPath = 'attached_assets/stage_google_ads_build_1761249325756.md';
  console.log(`📖 Parsing framework file: ${frameworkPath}`);
  
  const data = parseFrameworkFile(frameworkPath);
  
  console.log(`\n📊 Parsed Data:`);
  console.log(`  - Campaigns: ${data.campaigns.length}`);
  console.log(`  - Ad Groups: ${data.adGroups.length}`);
  console.log(`  - Keywords: ${data.keywords.length}\n`);
  
  // Create campaigns summary
  const results: Array<{ success: boolean; campaignName: string; error?: string }> = [];
  
  // Process each campaign
  for (const campaign of data.campaigns) {
    const adGroupsForCampaign = data.adGroups.filter(ag => ag.campaign === campaign.name);
    const result = await createCampaign(campaign, adGroupsForCampaign, data.keywords);
    results.push(result);
  }
  
  // Print final summary
  console.log('\n\n🎯 FINAL SUMMARY');
  console.log('================\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✓ Successful: ${successful.length}/${results.length}`);
  successful.forEach(r => {
    console.log(`  - ${r.campaignName}`);
  });
  
  if (failed.length > 0) {
    console.log(`\n✗ Failed: ${failed.length}/${results.length}`);
    failed.forEach(r => {
      console.log(`  - ${r.campaignName}`);
      console.log(`    Error: ${r.error}`);
    });
  }
  
  console.log('\n✅ Script completed');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
