# Google Ads Bulk Upload Instructions

## Overview
This guide provides step-by-step instructions for uploading your Stage Senior Google Ads campaigns using the bulk upload CSV files. The four CSV files generated contain all campaign, ad group, keyword, and ad data ready for import into Google Ads.

## Files Included
1. **google-ads-campaigns.csv** - 6 campaigns with budgets and settings
2. **google-ads-ad-groups.csv** - 35 ad groups organized by location and care type
3. **google-ads-keywords.csv** - 450+ keywords with Exact, Phrase, and Broad match types
4. **google-ads-ads.csv** - 35 Responsive Search Ads with 15 headlines and 4 descriptions each

---

## IMPORTANT: Upload Order

**You MUST upload files in this exact order:**

1. **FIRST:** Campaigns CSV
2. **SECOND:** Ad Groups CSV
3. **THIRD:** Keywords CSV
4. **FOURTH:** Ads CSV

**Why this order matters:** Google Ads requires parent objects (campaigns) to exist before you can add child objects (ad groups). Ad groups must exist before you add keywords and ads to them.

---

## Before You Begin

### Prerequisites
- [ ] Access to Google Ads account with admin or editor permissions
- [ ] All 4 CSV files downloaded and accessible
- [ ] Google Ads conversion tracking set up (recommended)
- [ ] Phone call tracking configured for (303) 436-2300

### Important Notes
- All campaigns are set to "Paused" status for review before launch
- Daily budgets are in USD
- Campaigns use "Maximize Conversions" bid strategy
- All ad groups are set to "Enabled" status
- Keywords use proper match type syntax (quotes for Exact, brackets for Phrase)

---

## Step-by-Step Upload Process

### Step 1: Upload Campaigns

1. **Log into Google Ads**
   - Go to https://ads.google.com
   - Select your account

2. **Navigate to Bulk Actions**
   - Click **Tools & Settings** (wrench icon in top right)
   - Under "Bulk actions", select **Uploads**
   - Click the **+** (plus) button
   - Select **Upload from file**

3. **Upload Campaign File**
   - Click **Select file** or drag-and-drop
   - Choose `google-ads-campaigns.csv`
   - Review the preview screen
   - Click **Upload and preview**

4. **Review Campaign Import**
   - Google Ads will show you a preview of what will be imported
   - Review for any errors (shown in red)
   - Check that all 6 campaigns are listed:
     - Search — Assisted Living (Denver Metro) - $150/day
     - Search — Memory Care (Denver Metro) - $150/day
     - Search — Independent Living (Denver Metro) - $75/day
     - Search — Brand — Stage Senior - $30/day
     - Search — Brand — Communities - $30/day
     - Search — Calls Only (All Services) - $60/day
   - If everything looks correct, click **Apply**

5. **Confirm Upload**
   - Wait for confirmation message: "Upload complete"
   - Click **View campaigns** to verify they appear in your account

**✅ CHECKPOINT:** Verify all 6 campaigns appear in your campaigns list before proceeding.

---

### Step 2: Upload Ad Groups

1. **Return to Bulk Uploads**
   - Click **Tools & Settings** → **Uploads**
   - Click the **+** (plus) button
   - Select **Upload from file**

2. **Upload Ad Groups File**
   - Select `google-ads-ad-groups.csv`
   - Click **Upload and preview**

3. **Review Ad Groups Import**
   - Verify all 35 ad groups are shown
   - Check that they're assigned to the correct campaigns
   - Common ad group types:
     - 13 Assisted Living ad groups (various cities)
     - 13 Memory Care ad groups (various cities)
     - 4 Independent Living ad groups
     - 5 Brand ad groups
   - Click **Apply** if everything is correct

4. **Confirm Upload**
   - Wait for "Upload complete" message
   - Navigate to any campaign to verify ad groups appear

**✅ CHECKPOINT:** Open 2-3 campaigns and verify their ad groups are visible before proceeding.

---

### Step 3: Upload Keywords

1. **Return to Bulk Uploads**
   - Click **Tools & Settings** → **Uploads**
   - Click the **+** (plus) button
   - Select **Upload from file**

2. **Upload Keywords File**
   - Select `google-ads-keywords.csv`
   - Click **Upload and preview**
   - **IMPORTANT:** This file is large (450+ keywords) so the preview may take a moment

3. **Review Keywords Import**
   - Verify keywords are using correct match types:
     - **Exact Match**: Keywords in quotes → `"assisted living Littleton"`
     - **Phrase Match**: Keywords in brackets → `[assisted living Littleton]`
     - **Broad Match**: Keywords with no symbols → `assisted living Littleton`
   - Check sample keywords from different ad groups
   - Click **Apply**

4. **Confirm Upload**
   - Wait for "Upload complete" message
   - Navigate to an ad group and click the "Keywords" tab
   - Verify keywords appear with correct match types

**✅ CHECKPOINT:** Spot-check 3-5 ad groups to verify keywords are present and have correct match types.

---

### Step 4: Upload Responsive Search Ads

1. **Return to Bulk Uploads**
   - Click **Tools & Settings** → **Uploads**
   - Click the **+** (plus) button
   - Select **Upload from file**

2. **Upload Ads File**
   - Select `google-ads-ads.csv`
   - Click **Upload and preview**

3. **Review Ads Import**
   - Verify all 35 Responsive Search Ads are shown
   - Check that ads have:
     - 15 headlines per ad
     - 4 descriptions per ad
     - Correct Final URLs
     - Proper Path 1 and Path 2 values
   - Review a few ads to ensure copy is appropriate
   - Click **Apply**

4. **Confirm Upload**
   - Wait for "Upload complete" message
   - Navigate to an ad group and click the "Ads" tab
   - Verify ad appears with all headlines and descriptions

**✅ CHECKPOINT:** Review 3-5 ads across different ad groups to verify all headlines and descriptions uploaded correctly.

---

## Post-Upload Configuration

### Critical Next Steps

#### 1. Configure Location Targeting
The campaigns are set to target "United States" by default. You need to refine this:

1. Go to each campaign
2. Click **Settings** → **Locations**
3. Click the pencil icon to edit
4. **Remove** "United States"
5. **Add** the specific locations:
   - For Denver Metro campaigns: Add 15-mile radius around each city
   - For Brand campaigns: Add Colorado statewide
6. Set to "People in your targeted locations" (Presence targeting)

**Cities to target for Denver Metro campaigns:**
- Littleton, CO
- Ken Caryl, CO
- Columbine, CO
- Columbine Valley, CO
- Bow Mar, CO
- Highlands Ranch, CO
- Englewood, CO
- Arvada, CO
- Wheat Ridge, CO
- Westminster, CO
- Golden, CO
- Lakewood, CO
- Morrison, CO

#### 2. Set Up Ad Schedule
Apply the following ad schedule to all campaigns:

- **Monday - Saturday:** 8:00 AM to 7:00 PM
- **Sunday:** 9:00 AM to 5:00 PM

To set this up:
1. Go to campaign → **Settings** → **Ad schedule**
2. Click **+ AD SCHEDULE**
3. Set the hours above
4. Click **Save**

#### 3. Add Negative Keywords Lists
Create and apply negative keyword lists to filter out unwanted traffic:

**Create 4 negative keyword lists:**

1. **Careers & Education**
   - Keywords: jobs, job, hiring, career, salary, pay, internship, volunteer, training, course, certification, CNA, LPN, RN
   - Apply to: All non-brand campaigns

2. **Skilled Nursing / Rehab**
   - Keywords: skilled nursing, SNF, rehabilitation, rehab center, physical therapy, long term acute care
   - Apply to: All campaigns

3. **Research / Academic**
   - Keywords: definition, wiki, what is assisted living, statistics, scholarly, research paper
   - Apply to: All campaigns

4. **Low Intent**
   - Keywords: free, cheap, low income housing, section 8, HUD
   - Apply to: All non-brand campaigns

**To create negative keyword lists:**
1. Click **Tools & Settings** → **Negative keyword lists**
2. Click **+** (plus button)
3. Enter list name and keywords
4. Click **Save**
5. Go to each campaign → **Keywords** → **Negative keywords**
6. Click **+** → **Use negative keyword list**
7. Select the appropriate lists
8. Click **Save**

#### 4. Configure Conversion Tracking
Ensure conversion tracking is set up for:
- Form submissions
- Phone calls to (303) 436-2300
- Tour requests
- Chat interactions

**To verify conversion tracking:**
1. Click **Tools & Settings** → **Conversions**
2. Verify all conversion actions are present and tracking
3. Test each conversion to ensure it fires correctly

#### 5. Review and Approve Ads
All ads must be approved by Google before they can run:

1. Go to **Ads & assets** in any campaign
2. Check the "Status" column
3. Look for:
   - **Under review** (normal, wait 1-2 business days)
   - **Approved** (ready to run)
   - **Disapproved** (needs attention)

If ads are disapproved:
- Click on the status to see the reason
- Make necessary edits
- Resubmit for review

#### 6. Enable Campaigns
Once everything is configured and reviewed:

1. Go to **Campaigns** view
2. Select all campaigns (checkbox at top)
3. Click **Edit** → **Change status** → **Enable**
4. Confirm the change

**⚠️ WARNING:** Enabling campaigns will start spending your budget immediately. Ensure all settings are correct first.

---

## Troubleshooting Common Issues

### Issue: "Campaign name already exists"
**Solution:** You may have duplicate campaign names. Either delete the existing campaign or rename the new one in the CSV before uploading.

### Issue: Keywords showing as "Low search volume"
**Solution:** This is normal for very specific location + service keywords. These keywords will become active if search volume increases.

### Issue: Ads stuck in "Under review"
**Solution:** 
- Typically takes 1-2 business days
- If longer than 3 days, contact Google Ads support
- Check for policy violations

### Issue: "Unable to create ad group - campaign not found"
**Solution:** You likely uploaded ad groups before campaigns. Upload campaigns first, wait for confirmation, then upload ad groups.

### Issue: Upload preview shows errors in red
**Solution:** 
- Read the error message carefully
- Common fixes:
  - Remove special characters from names
  - Ensure budget is a number (no $ symbol)
  - Check that match types are formatted correctly
  - Verify URLs start with https://

### Issue: Keywords not matching correctly
**Solution:** Verify match type syntax:
- Exact: `"keyword"` (with quotes in the CSV)
- Phrase: `[keyword]` (with brackets in the CSV)
- Broad: `keyword` (no quotes or brackets)

### Issue: Responsive Search Ads missing headlines
**Solution:** 
- Google requires minimum 3 headlines
- Our ads have 15 headlines each
- If some are missing, re-upload the ads CSV
- Check that CSV wasn't corrupted during download

---

## Quality Score Optimization (Post-Launch)

After campaigns run for 1-2 weeks:

### Monitor Quality Score
1. Go to **Keywords** view
2. Click **Columns** → **Modify columns**
3. Add "Quality Score" and its components
4. Sort by Quality Score (ascending)
5. Focus on improving keywords with QS < 5

### Improve Quality Score
- **For low expected CTR:** Write more compelling ad copy
- **For low ad relevance:** Add more keyword-specific headlines
- **For poor landing page experience:** Ensure landing pages load fast and match ad intent

---

## Monitoring & Optimization Checklist

### Daily (First Week)
- [ ] Check campaign spending vs. budget
- [ ] Review search terms report for irrelevant queries
- [ ] Add negative keywords as needed
- [ ] Monitor ad approval status
- [ ] Check for any disapproved ads

### Weekly (Ongoing)
- [ ] Review performance by campaign
- [ ] Analyze which locations perform best
- [ ] Review Quality Scores
- [ ] Adjust bids if using manual bidding
- [ ] Test new ad variations
- [ ] Review search terms and add/exclude keywords

### Monthly
- [ ] Comprehensive performance review
- [ ] Budget reallocation based on performance
- [ ] Landing page optimization
- [ ] Competitive analysis
- [ ] Add new keywords based on search terms report

---

## Budget Allocation Summary

Your total daily budget across all campaigns:

| Campaign | Daily Budget | Monthly Budget (30 days) |
|----------|-------------|-------------------------|
| Assisted Living (Denver Metro) | $150 | $4,500 |
| Memory Care (Denver Metro) | $150 | $4,500 |
| Independent Living (Denver Metro) | $75 | $2,250 |
| Brand — Stage Senior | $30 | $900 |
| Brand — Communities | $30 | $900 |
| Calls Only (All Services) | $60 | $1,800 |
| **TOTAL** | **$495/day** | **$14,850/month** |

**Note:** Actual spend may vary day-to-day based on search demand, but Google will not exceed your daily budget limits.

---

## Performance Goals & Benchmarks

### Target Metrics (Senior Living Industry Averages)

| Metric | Target Goal | Industry Average |
|--------|-------------|------------------|
| Click-Through Rate (CTR) | 3-5% | 2-4% |
| Conversion Rate | 5-10% | 3-7% |
| Cost Per Click (CPC) | $8-$15 | $10-$20 |
| Cost Per Acquisition (CPA) | $150-$300 | $200-$400 |
| Quality Score | 7+ | 5-7 |

### Success Indicators
- ✅ CTR above 3% within first 2 weeks
- ✅ Quality Score of 7+ on primary keywords
- ✅ 10+ qualified leads per week
- ✅ Conversion rate trending upward month-over-month
- ✅ Spend staying within budget

---

## Support & Resources

### Google Ads Support
- **Phone:** 1-866-2GOOGLE (1-866-246-6453)
- **Chat:** Available in Google Ads interface (bottom right)
- **Help Center:** https://support.google.com/google-ads

### Best Practices Documentation
- Google Ads Responsive Search Ads: https://support.google.com/google-ads/answer/7684791
- Location Targeting: https://support.google.com/google-ads/answer/1722043
- Keyword Match Types: https://support.google.com/google-ads/answer/7478529

---

## Appendix: CSV File Formats

### Campaign CSV Format
```csv
Campaign,Budget,Status,Campaign type,Networks,Languages,Locations
```

### Ad Group CSV Format
```csv
Campaign,Ad group,Max CPC,Status
```

### Keywords CSV Format
```csv
Campaign,Ad group,Keyword,Criterion Type,Max CPC
```
- **Exact Match:** Keyword wrapped in quotes `"keyword"`
- **Phrase Match:** Keyword wrapped in brackets `[keyword]`
- **Broad Match:** Keyword with no symbols `keyword`

### Ads CSV Format (Responsive Search Ads)
```csv
Campaign,Ad group,Ad type,Headline 1,...,Headline 15,Description 1,...,Description 4,Final URL,Path 1,Path 2
```

---

## Quick Reference: Upload Checklist

- [ ] **STEP 1:** Upload campaigns CSV → Wait for confirmation
- [ ] **STEP 2:** Upload ad groups CSV → Wait for confirmation
- [ ] **STEP 3:** Upload keywords CSV → Wait for confirmation
- [ ] **STEP 4:** Upload ads CSV → Wait for confirmation
- [ ] **STEP 5:** Configure location targeting (15-mile radius)
- [ ] **STEP 6:** Set up ad schedule (Mon-Sat 8am-7pm, Sun 9am-5pm)
- [ ] **STEP 7:** Add negative keyword lists
- [ ] **STEP 8:** Verify conversion tracking
- [ ] **STEP 9:** Review and monitor ad approval
- [ ] **STEP 10:** Enable campaigns when ready to launch

---

## Final Notes

### Launch Checklist
Before enabling campaigns, ensure:
- ✅ All landing pages are live and loading correctly
- ✅ Phone number (303) 436-2300 is answered and tracked
- ✅ Tour request forms are working
- ✅ Location targeting is set correctly
- ✅ Ad schedule is configured
- ✅ Negative keywords are applied
- ✅ Conversion tracking is verified
- ✅ Budget is approved and available
- ✅ All ads are approved (not under review)

### Important Reminders
1. **Campaigns start PAUSED** - Review everything before enabling
2. **Test conversions** - Submit a test form and test call to verify tracking
3. **Monitor daily** for the first week to catch any issues early
4. **Be patient** - It takes 1-2 weeks for campaigns to optimize
5. **Add negative keywords** regularly based on search terms report
6. **Quality Score matters** - Higher QS = lower costs and better ad positions

---

**Questions?** Contact your Google Ads representative or Stage Senior marketing team for assistance.

**Document Version:** 1.0 | **Last Updated:** October 23, 2025
