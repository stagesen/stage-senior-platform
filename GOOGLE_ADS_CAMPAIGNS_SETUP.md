# Google Ads Campaigns Setup Guide

## Current Status: ⚠️ Credentials Need Refresh

All campaign creation code has been completed and is ready to run. However, the Google Ads API credentials need to be refreshed before campaigns can be created.

### Error Details
```
Error: invalid_grant - Getting metadata from plugin failed with error: invalid_grant
```

This indicates that the `GOOGLE_ADS_REFRESH_TOKEN` environment variable contains an expired or revoked token.

---

## 🎯 What Has Been Completed

### 1. Campaign Creation Script
**Location:** `scripts/create-google-ads-campaigns.ts`

This script creates complete Google Ads campaigns with the following hierarchy for each of the 4 Stage Senior communities:

```
Campaign: [Community Name] - [City]
├── Budget: $50/day
├── Bidding: MAXIMIZE_CONVERSIONS
└── Ad Groups (one per care type)
    ├── Assisted Living - [Community Name]
    │   ├── 5 Keywords (PHRASE match)
    │   └── Responsive Search Ad
    │       ├── 15 Headlines
    │       └── 4 Descriptions
    ├── Memory Care - [Community Name]
    │   ├── 5 Keywords (PHRASE match)
    │   └── Responsive Search Ad
    └── Independent Living - [Community Name] (Golden Pond only)
        ├── 5 Keywords (PHRASE match)
        └── Responsive Search Ad
```

### 2. Communities Configured

1. **Golden Pond Retirement Community** - Golden, CO
   - Phone: (720) 605-1756
   - Care Types: Assisted Living, Independent Living, Memory Care
   - URL: `/communities/golden-pond`

2. **Stonebridge Senior** - Arvada, CO
   - Phone: (720) 729-6244
   - Care Types: Assisted Living, Memory Care
   - URL: `/communities/stonebridge-senior`

3. **The Gardens at Columbine** - Littleton, CO
   - Phone: (720) 740-1249
   - Care Types: Assisted Living, Memory Care
   - URL: `/communities/the-gardens-at-columbine`

4. **The Gardens on Quail** - Arvada, CO
   - Phone: (303) 456-1501
   - Care Types: Assisted Living, Memory Care
   - URL: `/communities/the-gardens-on-quail`

### 3. Campaign Details

#### Keywords by Care Type

**Assisted Living:**
- assisted living [city]
- assisted living near me
- senior living [city]
- assisted living communities [city]
- best assisted living [city]

**Memory Care:**
- memory care [city]
- memory care near me
- alzheimer's care [city]
- dementia care [city]
- memory care facilities [city]

**Independent Living:**
- independent living [city]
- independent living near me
- senior apartments [city]
- retirement community [city]
- active senior living [city]

#### Responsive Search Ad Templates

**Headlines (15 per ad):**
1. [Community Name]
2. Quality [Care Type] in [City]
3. Schedule Your Tour Today
4. Trusted Senior Care
5. Compassionate Expert Care
6. Award-Winning Community
7. Personalized Care Plans
8. 24/7 Licensed Staff
9. Beautiful [City] Location
10. Restaurant-Style Dining
11. Engaging Activities Daily
12. Pet-Friendly Community
13. Schedule a Free Tour
14. Call [phone] Today
15. Colorado's Trusted Choice

**Descriptions (4 per ad):**
1. Discover exceptional senior living with personalized care plans. Schedule a tour of our beautiful [City] community today.
2. Award-winning [care type] with 24/7 licensed staff, restaurant-style dining, and engaging activities. Call [phone] to learn more.
3. Join our warm, welcoming community in [City]. Pet-friendly with fitness center, salon, and therapeutic gardens. Tour today!
4. Trusted Colorado senior living with compassionate care. No-obligation tours available. Experience the Stage Senior difference.

---

## 🔧 How to Fix and Run

### Step 1: Refresh Google Ads OAuth Token

The Google Ads API uses OAuth2 for authentication. The refresh token expires and needs to be regenerated.

**Option A: Use Google Ads API OAuth Playground**
1. Go to https://developers.google.com/oauthplayground/
2. Click the gear icon (⚙️) and select "Use your own OAuth credentials"
3. Enter your `GOOGLE_ADS_CLIENT_ID` and `GOOGLE_ADS_CLIENT_SECRET`
4. In Step 1, find and select "Google Ads API v15" → "https://www.googleapis.com/auth/adwords"
5. Click "Authorize APIs"
6. Login with your Google Ads account
7. In Step 2, click "Exchange authorization code for tokens"
8. Copy the "Refresh token" value

**Option B: Use gcloud CLI**
```bash
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/adwords
```

### Step 2: Update Environment Variables

Update the `.env` file or Replit Secrets with the new refresh token:

```
GOOGLE_ADS_REFRESH_TOKEN=<new_refresh_token>
```

### Step 3: Restart the Application

After updating the refresh token, restart the Replit application to load the new credentials.

### Step 4: Run the Campaign Creation Script

```bash
npx tsx scripts/create-google-ads-campaigns.ts
```

### Expected Output

```
╔═══════════════════════════════════════════════════════════╗
║  Google Ads Campaign Creator for Stage Senior Communities  ║
╚═══════════════════════════════════════════════════════════╝

Creating campaigns for 4 communities...

========================================
Creating campaign for: Golden Pond Retirement Community
========================================

Creating budget: Budget for Golden Pond Retirement Community - Golden
✓ Budget created: customers/[ID]/campaignBudgets/[ID]
Creating campaign: Golden Pond Retirement Community - Golden
✓ Campaign created: customers/[ID]/campaigns/[ID]
✓ Campaign saved to database: [UUID]

  Creating ad group: Assisted Living - Golden Pond Retirement Community
  ✓ Ad group created: customers/[ID]/adGroups/[ID]
  ✓ Ad group saved to database: [UUID]
  Adding 5 keywords...
  ✓ Keywords added: 5
  ✓ Keywords saved to database
  Creating responsive search ad with 15 headlines and 4 descriptions...
  ✓ Ad created: customers/[ID]/ads/[ID]
  ✓ Ad saved to database

  [... more ad groups ...]

✅ Campaign "Golden Pond Retirement Community - Golden" created successfully with 3 ad groups!

[... more communities ...]

╔═══════════════════════════════════════════════════════════╗
║                     CAMPAIGN SUMMARY                        ║
╚═══════════════════════════════════════════════════════════╝

✅ Successfully created: 4 campaigns
   • Golden Pond Retirement Community
   • Stonebridge Senior
   • The Gardens at Columbine
   • The Gardens on Quail
```

---

## 📊 Campaign Summary (Once Created)

### Total Campaign Stats
- **Total Campaigns:** 4
- **Total Ad Groups:** 11 (3 for Golden Pond, 2 each for others)
- **Total Keywords:** 55 (5 per ad group)
- **Total Ads:** 11 (1 responsive search ad per ad group)
- **Total Daily Budget:** $200 ($50 per campaign)

### Campaign Breakdown

| Community | Ad Groups | Keywords | Ads | Daily Budget |
|-----------|-----------|----------|-----|--------------|
| Golden Pond Retirement Community | 3 | 15 | 3 | $50 |
| Stonebridge Senior | 2 | 10 | 2 | $50 |
| The Gardens at Columbine | 2 | 10 | 2 | $50 |
| The Gardens on Quail | 2 | 10 | 2 | $50 |
| **TOTAL** | **11** | **55** | **11** | **$200** |

---

## 🔍 Verification Steps (After Creation)

1. **Check Google Ads Interface:**
   - Login to https://ads.google.com
   - Navigate to "Campaigns"
   - Verify all 4 campaigns appear with PAUSED status
   - Check each campaign has the correct ad groups, keywords, and ads

2. **Check Database:**
   ```sql
   -- View campaigns
   SELECT name, status, campaign_id FROM google_ads_campaigns;
   
   -- View ad groups
   SELECT c.name as campaign, g.name as ad_group 
   FROM google_ads_ad_groups g 
   JOIN google_ads_campaigns c ON g.campaign_id = c.id;
   
   -- View keywords
   SELECT keyword_text, match_type FROM google_ads_keywords;
   ```

3. **Before Enabling Campaigns:**
   - Verify final URLs are correct
   - Review ad copy for accuracy
   - Confirm budget allocation
   - Set up conversion tracking (if not already done)
   - Add negative keywords as needed
   - Configure ad schedule (if needed)

---

## 🚨 Troubleshooting

### Error: "PERMISSION_DENIED"
- Verify the Google Ads account has access to the customer ID
- Check that the developer token is approved
- Ensure the OAuth client has the correct permissions

### Error: "QUOTA_EXCEEDED"
- Google Ads API has rate limits
- Wait a few minutes and retry
- Consider batching operations differently

### Error: "DUPLICATE_NAME"
- Campaign or ad group with that name already exists
- Check Google Ads interface and database
- Either delete existing campaigns or modify script to use different names

### Campaigns Created but Not Syncing
- Check database foreign key relationships
- Verify all IDs are being extracted correctly from resource names
- Look for transaction rollback errors in logs

---

## 📝 Next Steps After Creation

1. **Enable Campaigns** (Currently PAUSED)
   - Review all ad copy
   - Verify targeting settings
   - Change status to ENABLED in Google Ads interface

2. **Set Up Conversion Tracking**
   - Ensure conversion actions are configured
   - Test conversion pixel firing
   - Verify attribution models

3. **Monitor Performance**
   - Check impression share
   - Monitor click-through rates
   - Adjust bids as needed
   - Review search terms report
   - Add negative keywords

4. **Optimization**
   - Test different headline/description combinations
   - Adjust budgets based on performance
   - Refine keyword match types
   - Consider adding ad extensions

---

## 📞 Support

For questions about the script or campaign structure, refer to:
- Script: `scripts/create-google-ads-campaigns.ts`
- Google Ads Service: `server/google-ads-service.ts`
- API Routes: `server/routes.ts` (search for `/api/google-ads/campaigns`)

For Google Ads API issues:
- Documentation: https://developers.google.com/google-ads/api/docs/start
- OAuth Guide: https://developers.google.com/google-ads/api/docs/oauth/overview
- Support: https://support.google.com/google-ads/
