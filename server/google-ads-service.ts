import { GoogleAdsApi, Customer } from 'google-ads-api';

/**
 * Google Ads API Service Layer
 * Handles OAuth token management and conversion action operations
 * 
 * @example
 * // List all conversion actions
 * const actions = await googleAdsService.listConversionActions();
 * 
 * @example
 * // Create a new conversion action
 * const result = await googleAdsService.createConversionAction({
 *   name: 'Schedule Tour',
 *   category: 'LEAD',
 *   value: 250,
 *   countingType: 'ONE_PER_CLICK',
 *   viewThroughConversionWindowDays: 30,
 *   clickThroughConversionWindowDays: 90,
 *   attributionModel: 'DATA_DRIVEN',
 *   status: 'ENABLED'
 * });
 * // result.conversionActionLabel is what you need for GTM
 * 
 * @example
 * // Check if service is configured
 * if (googleAdsService.isConfigured()) {
 *   // Service is ready to use
 * }
 */

// Configuration from environment variables
const CONFIG = {
  client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
};

const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID || '';
const REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN || '';
const LOGIN_CUSTOMER_ID = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || '';

/**
 * Extract conversion label from a tag snippet (raw HTML/JS string)
 * Parses gtag event snippets to find the conversion label
 * 
 * @param snippet - Raw HTML/JS string containing gtag event code
 * @returns The conversion label (e.g., "Abc123XyZ") or null if not found
 * 
 * @example
 * const snippet = "gtag('event', 'conversion', { 'send_to': 'AW-17667766916/Abc123XyZ' });";
 * const label = extractConversionLabelFromSnippet(snippet);
 * // Returns: "Abc123XyZ"
 */
function extractConversionLabelFromSnippet(snippet: string): string | null {
  if (!snippet || typeof snippet !== 'string') {
    console.warn('[Google Ads Service] extractConversionLabelFromSnippet: Invalid snippet type:', typeof snippet);
    return null;
  }

  // Pattern to match 'send_to': 'AW-XXXXXXX/LABEL' or "send_to":"AW-XXXXXXX/LABEL"
  // Captures the LABEL part after the /
  const patterns = [
    /['"]send_to['"]\s*:\s*['"]AW-\d+\/([^'"]+)['"]/i,
    // Also try without quotes around send_to (in case format varies)
    /send_to\s*:\s*['"]AW-\d+\/([^'"]+)['"]/i,
  ];

  for (const pattern of patterns) {
    const match = snippet.match(pattern);
    if (match && match[1]) {
      console.log('[Google Ads Service] Successfully extracted conversion label:', match[1]);
      return match[1];
    }
  }

  console.warn('[Google Ads Service] Could not extract conversion label from snippet (first 200 chars):', snippet.substring(0, 200));
  return null;
}

/**
 * Configuration for creating a conversion action
 */
export interface ConversionActionConfig {
  name: string;
  category?: 'LEAD' | 'PURCHASE' | 'SIGNUP' | 'PAGE_VIEW' | 'DOWNLOAD';
  value?: number;
  countingType?: 'ONE_PER_CLICK' | 'MANY_PER_CLICK';
  viewThroughConversionWindowDays?: number;
  clickThroughConversionWindowDays?: number;
  attributionModel?: 'DATA_DRIVEN' | 'LAST_CLICK' | 'FIRST_CLICK' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED';
  status?: 'ENABLED' | 'REMOVED';
}

/**
 * Conversion action response with resource name and label
 */
export interface ConversionActionResult {
  resourceName: string;
  id: string;
  name: string;
  category: string;
  status: string;
  conversionActionLabel?: string;
  value?: number;
  attributionModel?: string;
  countingType?: string;
  clickThroughWindowDays?: number;
  viewThroughWindowDays?: number;
}

class GoogleAdsService {
  private client: GoogleAdsApi | null = null;
  private customer: Customer | null = null;

  /**
   * Initialize the Google Ads API client
   */
  private initializeClient(): void {
    if (this.client) return;

    // Validate configuration
    if (!CONFIG.client_id || !CONFIG.client_secret || !CONFIG.developer_token) {
      throw new Error('Google Ads credentials not configured. Please set GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, and GOOGLE_ADS_DEVELOPER_TOKEN');
    }

    if (!CUSTOMER_ID || !REFRESH_TOKEN) {
      throw new Error('Google Ads customer configuration missing. Please set GOOGLE_ADS_CUSTOMER_ID and GOOGLE_ADS_REFRESH_TOKEN');
    }

    this.client = new GoogleAdsApi(CONFIG);
    
    console.log('[Google Ads Service] Initializing with:', {
      customer_id: CUSTOMER_ID,
      login_customer_id: LOGIN_CUSTOMER_ID,
      has_refresh_token: !!REFRESH_TOKEN
    });
    
    this.customer = this.client.Customer({
      customer_id: CUSTOMER_ID,
      refresh_token: REFRESH_TOKEN,
      login_customer_id: LOGIN_CUSTOMER_ID,
    });

    console.log('[Google Ads Service] Client initialized successfully');
  }

  /**
   * Get the initialized customer instance
   * Note: The google-ads-api library automatically handles token refresh internally
   */
  private async getCustomer(): Promise<Customer> {
    if (!this.customer) {
      this.initializeClient();
    }
    
    if (!this.customer) {
      throw new Error('Failed to initialize Google Ads customer');
    }

    return this.customer;
  }

  /**
   * List all conversion actions for the account
   */
  async listConversionActions(): Promise<ConversionActionResult[]> {
    try {
      const customer = await this.getCustomer();

      const query = `
        SELECT
          conversion_action.id,
          conversion_action.name,
          conversion_action.resource_name,
          conversion_action.category,
          conversion_action.status,
          conversion_action.type,
          conversion_action.tag_snippets,
          conversion_action.value_settings,
          conversion_action.attribution_model_settings,
          conversion_action.counting_type,
          conversion_action.click_through_lookback_window_days,
          conversion_action.view_through_lookback_window_days
        FROM conversion_action
        WHERE conversion_action.status != 'REMOVED'
        ORDER BY conversion_action.name
      `;

      console.log('[Google Ads Service] Fetching conversion actions...');
      
      const response = await customer.query(query);
      
      const conversionActions: ConversionActionResult[] = response.map((row: any) => {
        const action = row.conversion_action;
        // Extract ID from resource name (e.g., "customers/123/conversionActions/456" -> "456")
        const idMatch = action.resource_name?.match(/conversionActions\/(\d+)/);
        const id = idMatch ? idMatch[1] : action.id?.toString() || '';
        
        // Extract the actual conversion label from tag_snippets
        // tag_snippets contains raw HTML/JS strings that we need to parse
        let conversionLabel = '';
        if (action.tag_snippets && Array.isArray(action.tag_snippets)) {
          console.log(`[Google Ads Service] Processing tag_snippets for action "${action.name}" (ID: ${id})`);
          
          for (const snippet of action.tag_snippets) {
            // Cast to any since the API types may not include all fields
            const snippetAny = snippet as any;
            
            // Try event_snippet first, then global_site_tag, then stringify the whole object
            const snippetText = snippetAny?.event_snippet || 
                                snippetAny?.global_site_tag || 
                                (typeof snippet === 'string' ? snippet : JSON.stringify(snippet));
            
            console.log(`[Google Ads Service] Attempting to extract label from snippet`);
            
            const extractedLabel = extractConversionLabelFromSnippet(snippetText);
            if (extractedLabel) {
              conversionLabel = extractedLabel;
              break;
            }
          }
          
          if (!conversionLabel) {
            console.warn(`[Google Ads Service] No conversion label found for action "${action.name}" (ID: ${id})`);
          }
        } else {
          console.warn(`[Google Ads Service] No tag_snippets found for action "${action.name}" (ID: ${id})`);
        }
        
        // Extract value from value_settings
        const value = action.value_settings?.default_value 
          ? parseFloat(action.value_settings.default_value) 
          : undefined;
        
        // Extract attribution model from attribution_model_settings
        const attributionModel = action.attribution_model_settings?.attribution_model || undefined;
        
        return {
          resourceName: action.resource_name || '',
          id,
          name: action.name || '',
          category: action.category || '',
          status: action.status || '',
          conversionActionLabel: conversionLabel,
          value,
          attributionModel,
          countingType: action.counting_type || undefined,
          clickThroughWindowDays: action.click_through_lookback_window_days || undefined,
          viewThroughWindowDays: action.view_through_lookback_window_days || undefined,
        };
      });

      console.log(`[Google Ads Service] Found ${conversionActions.length} conversion actions`);
      return conversionActions;
    } catch (error: any) {
      console.error('[Google Ads Service] Error listing conversion actions:', error);
      
      if (error.message?.includes('PERMISSION_DENIED')) {
        throw new Error('Google Ads API permission denied. Please check your developer token and OAuth credentials.');
      }
      
      if (error.message?.includes('INVALID_CUSTOMER_ID')) {
        throw new Error('Invalid Google Ads customer ID. Please verify GOOGLE_ADS_CUSTOMER_ID is correct.');
      }
      
      throw new Error(`Failed to list conversion actions: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Create a new conversion action
   */
  async createConversionAction(config: ConversionActionConfig): Promise<ConversionActionResult> {
    try {
      const customer = await this.getCustomer();

      // Set default values
      const conversionAction: any = {
        name: config.name,
        category: config.category || 'LEAD',
        type: 'WEBPAGE',
        status: config.status || 'ENABLED',
        view_through_lookback_window_days: config.viewThroughConversionWindowDays || 30,
        click_through_lookback_window_days: config.clickThroughConversionWindowDays || 90,
        counting_type: config.countingType || 'ONE_PER_CLICK',
        attribution_model_settings: {
          attribution_model: config.attributionModel || 'DATA_DRIVEN',
        },
        value_settings: {
          default_value: config.value || 0,
          always_use_default_value: true,
        },
      };

      console.log('[Google Ads Service] Creating conversion action:', {
        name: config.name,
        category: conversionAction.category,
        value: config.value,
      });

      const response: any = await customer.conversionActions.create([conversionAction]);

      if (!response?.results || response.results.length === 0) {
        throw new Error('No response received from Google Ads API');
      }

      const result = response.results[0];
      const resourceName = result.resource_name || '';
      
      // Extract ID from resource name
      const idMatch = resourceName.match(/conversionActions\/(\d+)/);
      const id = idMatch ? idMatch[1] : '';

      // Fetch the conversion action again to get tag_snippets with the actual conversion label
      console.log('[Google Ads Service] Fetching conversion label from tag_snippets...');
      
      const fetchQuery = `
        SELECT
          conversion_action.id,
          conversion_action.name,
          conversion_action.resource_name,
          conversion_action.category,
          conversion_action.status,
          conversion_action.tag_snippets
        FROM conversion_action
        WHERE conversion_action.id = ${id}
      `;
      
      const fetchResponse = await customer.query(fetchQuery);
      
      if (fetchResponse.length === 0) {
        throw new Error('Failed to fetch created conversion action with tag_snippets');
      }
      
      const fetchedAction = fetchResponse[0].conversion_action;
      
      if (!fetchedAction) {
        throw new Error('Failed to retrieve conversion action data from response');
      }
      
      // Extract the actual conversion label from tag_snippets
      // tag_snippets contains raw HTML/JS strings that we need to parse
      let conversionLabel = '';
      if (fetchedAction.tag_snippets && Array.isArray(fetchedAction.tag_snippets)) {
        console.log(`[Google Ads Service] Processing tag_snippets for newly created action "${config.name}" (ID: ${id})`);
        
        for (const snippet of fetchedAction.tag_snippets) {
          // Cast to any since the API types may not include all fields
          const snippetAny = snippet as any;
          
          // Try event_snippet first, then global_site_tag, then stringify the whole object
          const snippetText = snippetAny?.event_snippet || 
                              snippetAny?.global_site_tag || 
                              (typeof snippet === 'string' ? snippet : JSON.stringify(snippet));
          
          console.log(`[Google Ads Service] Attempting to extract label from snippet`);
          
          const extractedLabel = extractConversionLabelFromSnippet(snippetText);
          if (extractedLabel) {
            conversionLabel = extractedLabel;
            break;
          }
        }
        
        if (!conversionLabel) {
          console.warn(`[Google Ads Service] No conversion label found for newly created action "${config.name}" (ID: ${id})`);
        }
      } else {
        console.warn(`[Google Ads Service] No tag_snippets found for newly created action "${config.name}" (ID: ${id})`);
      }

      const createdAction: ConversionActionResult = {
        resourceName,
        id,
        name: config.name,
        category: String(conversionAction.category),
        status: String(conversionAction.status),
        conversionActionLabel: conversionLabel,
      };

      console.log('[Google Ads Service] Conversion action created successfully:', {
        id,
        resourceName,
        label: conversionLabel,
      });

      return createdAction;
    } catch (error: any) {
      console.error('[Google Ads Service] Error creating conversion action:', error);
      
      if (error.message?.includes('DUPLICATE_NAME')) {
        throw new Error(`A conversion action with the name "${config.name}" already exists. Please use a different name.`);
      }
      
      if (error.message?.includes('PERMISSION_DENIED')) {
        throw new Error('Google Ads API permission denied. Please verify your account has permission to create conversion actions.');
      }
      
      if (error.message?.includes('INVALID_ARGUMENT')) {
        throw new Error(`Invalid conversion action configuration: ${error.message}`);
      }
      
      throw new Error(`Failed to create conversion action: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Get a specific conversion action by ID
   */
  async getConversionAction(conversionActionId: string): Promise<ConversionActionResult | null> {
    try {
      const customer = await this.getCustomer();

      const query = `
        SELECT
          conversion_action.id,
          conversion_action.name,
          conversion_action.resource_name,
          conversion_action.category,
          conversion_action.status,
          conversion_action.tag_snippets
        FROM conversion_action
        WHERE conversion_action.id = ${conversionActionId}
      `;

      console.log('[Google Ads Service] Fetching conversion action:', conversionActionId);
      
      const response = await customer.query(query);
      
      if (response.length === 0) {
        return null;
      }

      const action = response[0].conversion_action;
      
      if (!action) {
        return null;
      }

      const idMatch = action.resource_name?.match(/conversionActions\/(\d+)/);
      const id = idMatch ? idMatch[1] : action.id?.toString() || '';
      
      // Extract the actual conversion label from tag_snippets
      // tag_snippets contains raw HTML/JS strings that we need to parse
      let conversionLabel = '';
      if (action.tag_snippets && Array.isArray(action.tag_snippets)) {
        console.log(`[Google Ads Service] Processing tag_snippets for action ID: ${conversionActionId}`);
        
        for (const snippet of action.tag_snippets) {
          // Cast to any since the API types may not include all fields
          const snippetAny = snippet as any;
          
          // Try event_snippet first, then global_site_tag, then stringify the whole object
          const snippetText = snippetAny?.event_snippet || 
                              snippetAny?.global_site_tag || 
                              (typeof snippet === 'string' ? snippet : JSON.stringify(snippet));
          
          console.log(`[Google Ads Service] Attempting to extract label from snippet`);
          
          const extractedLabel = extractConversionLabelFromSnippet(snippetText);
          if (extractedLabel) {
            conversionLabel = extractedLabel;
            break;
          }
        }
        
        if (!conversionLabel) {
          console.warn(`[Google Ads Service] No conversion label found for action ID: ${conversionActionId}`);
        }
      } else {
        console.warn(`[Google Ads Service] No tag_snippets found for action ID: ${conversionActionId}`);
      }

      return {
        resourceName: action.resource_name || '',
        id,
        name: action.name || '',
        category: String(action.category || ''),
        status: String(action.status || ''),
        conversionActionLabel: conversionLabel,
      };
    } catch (error: any) {
      console.error('[Google Ads Service] Error fetching conversion action:', error);
      throw new Error(`Failed to get conversion action: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Create a campaign budget
   */
  async createCampaignBudget(budgetName: string, budgetAmountMicros: number): Promise<string> {
    try {
      const customer = await this.getCustomer();
      
      const budgetOperation: any = {
        create: {
          name: budgetName,
          amount_micros: budgetAmountMicros,
          delivery_method: 'STANDARD',
          explicitly_shared: false,
        },
      };

      console.log('[Google Ads Service] Creating campaign budget:', {
        name: budgetName,
        amount: budgetAmountMicros / 1000000,
      });

      const response: any = await customer.campaignBudgets.create([budgetOperation]);
      const budgetResourceName = response.results[0].resource_name;

      console.log('[Google Ads Service] Budget created:', budgetResourceName);
      return budgetResourceName;
    } catch (error: any) {
      console.error('[Google Ads Service] Error creating budget:', error);
      throw new Error(`Failed to create campaign budget: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Create a search campaign
   */
  async createCampaign(config: {
    name: string;
    budgetResourceName: string;
    status?: 'ENABLED' | 'PAUSED';
    biddingStrategy?: 'MANUAL_CPC' | 'MAXIMIZE_CONVERSIONS' | 'TARGET_CPA';
    targetCpaMicros?: number;
  }): Promise<{ resourceName: string; id: string }> {
    try {
      const customer = await this.getCustomer();

      const campaign: any = {
        name: config.name,
        status: config.status || 'PAUSED',
        advertising_channel_type: 'SEARCH',
        campaign_budget: config.budgetResourceName,
        network_settings: {
          target_google_search: true,
          target_search_network: true,
          target_content_network: false,
        },
      };

      // Set bidding strategy
      if (config.biddingStrategy === 'MAXIMIZE_CONVERSIONS') {
        campaign.maximize_conversions = {};
      } else if (config.biddingStrategy === 'TARGET_CPA' && config.targetCpaMicros) {
        campaign.target_cpa = {
          target_cpa_micros: config.targetCpaMicros,
        };
      } else {
        campaign.manual_cpc = {
          enhanced_cpc_enabled: true,
        };
      }

      console.log('[Google Ads Service] Creating campaign:', {
        name: config.name,
        status: campaign.status,
        bidding: config.biddingStrategy || 'MANUAL_CPC',
      });

      const campaignOperation: any = {
        create: campaign,
      };

      const response: any = await customer.campaigns.create([campaignOperation]);
      const resourceName = response.results[0].resource_name;
      
      // Extract ID from resource name
      const idMatch = resourceName.match(/campaigns\/(\d+)/);
      const id = idMatch ? idMatch[1] : '';

      console.log('[Google Ads Service] Campaign created:', {
        resourceName,
        id,
      });

      return { resourceName, id };
    } catch (error: any) {
      console.error('[Google Ads Service] Error creating campaign:', error);
      throw new Error(`Failed to create campaign: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Create an ad group
   */
  async createAdGroup(config: {
    name: string;
    campaignResourceName: string;
    cpcBidMicros?: number;
    status?: 'ENABLED' | 'PAUSED';
  }): Promise<{ resourceName: string; id: string }> {
    try {
      const customer = await this.getCustomer();

      const adGroup: any = {
        name: config.name,
        campaign: config.campaignResourceName,
        status: config.status || 'ENABLED',
        type: 'SEARCH_STANDARD',
      };

      if (config.cpcBidMicros) {
        adGroup.cpc_bid_micros = config.cpcBidMicros;
      }

      console.log('[Google Ads Service] Creating ad group:', {
        name: config.name,
        campaign: config.campaignResourceName,
      });

      const adGroupOperation: any = {
        create: adGroup,
      };

      const response: any = await customer.adGroups.create([adGroupOperation]);
      const resourceName = response.results[0].resource_name;
      
      // Extract ID from resource name
      const idMatch = resourceName.match(/adGroups\/(\d+)/);
      const id = idMatch ? idMatch[1] : '';

      console.log('[Google Ads Service] Ad group created:', {
        resourceName,
        id,
      });

      return { resourceName, id };
    } catch (error: any) {
      console.error('[Google Ads Service] Error creating ad group:', error);
      throw new Error(`Failed to create ad group: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Add keywords to an ad group
   */
  async addKeywords(config: {
    adGroupResourceName: string;
    keywords: Array<{
      text: string;
      matchType: 'EXACT' | 'PHRASE' | 'BROAD';
    }>;
  }): Promise<Array<{ resourceName: string; id: string; text: string }>> {
    try {
      const customer = await this.getCustomer();

      const operations = config.keywords.map((keyword) => ({
        create: {
          ad_group: config.adGroupResourceName,
          status: 'ENABLED',
          keyword: {
            text: keyword.text,
            match_type: keyword.matchType,
          },
        },
      }));

      console.log('[Google Ads Service] Adding keywords:', {
        adGroup: config.adGroupResourceName,
        count: config.keywords.length,
      });

      const response: any = await customer.adGroupCriteria.create(operations);
      
      const results = response.results.map((result: any, index: number) => {
        const idMatch = result.resource_name.match(/criteria\/(\d+)/);
        return {
          resourceName: result.resource_name,
          id: idMatch ? idMatch[1] : '',
          text: config.keywords[index].text,
        };
      });

      console.log('[Google Ads Service] Keywords added:', results.length);
      return results;
    } catch (error: any) {
      console.error('[Google Ads Service] Error adding keywords:', error);
      throw new Error(`Failed to add keywords: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Create a responsive search ad
   */
  async createResponsiveSearchAd(config: {
    adGroupResourceName: string;
    headlines: string[]; // 3-15 headlines, max 30 chars each
    descriptions: string[]; // 2-4 descriptions, max 90 chars each
    finalUrl: string;
    path1?: string; // max 15 chars
    path2?: string; // max 15 chars
  }): Promise<{ resourceName: string; id: string }> {
    try {
      const customer = await this.getCustomer();

      // Validate inputs
      if (config.headlines.length < 3 || config.headlines.length > 15) {
        throw new Error('Responsive search ads require 3-15 headlines');
      }
      if (config.descriptions.length < 2 || config.descriptions.length > 4) {
        throw new Error('Responsive search ads require 2-4 descriptions');
      }

      const ad: any = {
        ad_group: config.adGroupResourceName,
        status: 'ENABLED',
        ad: {
          final_urls: [config.finalUrl],
          responsive_search_ad: {
            headlines: config.headlines.map((text) => ({ text })),
            descriptions: config.descriptions.map((text) => ({ text })),
          },
        },
      };

      if (config.path1) {
        ad.ad.responsive_search_ad.path1 = config.path1;
      }
      if (config.path2) {
        ad.ad.responsive_search_ad.path2 = config.path2;
      }

      console.log('[Google Ads Service] Creating responsive search ad:', {
        adGroup: config.adGroupResourceName,
        headlines: config.headlines.length,
        descriptions: config.descriptions.length,
      });

      const adOperation: any = {
        create: ad,
      };

      const response: any = await customer.adGroupAds.create([adOperation]);
      const resourceName = response.results[0].resource_name;
      
      // Extract ID from resource name
      const idMatch = resourceName.match(/ads\/(\d+)/);
      const id = idMatch ? idMatch[1] : '';

      console.log('[Google Ads Service] Ad created:', {
        resourceName,
        id,
      });

      return { resourceName, id };
    } catch (error: any) {
      console.error('[Google Ads Service] Error creating ad:', error);
      throw new Error(`Failed to create responsive search ad: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!(
      CONFIG.client_id &&
      CONFIG.client_secret &&
      CONFIG.developer_token &&
      CUSTOMER_ID &&
      REFRESH_TOKEN
    );
  }
}

// Export singleton instance
export const googleAdsService = new GoogleAdsService();
