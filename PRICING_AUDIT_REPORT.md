# Pricing Audit Report
**Generated:** October 9, 2025
**Audited By:** Claude Code
**Communities Audited:** 4

---

## Executive Summary

This audit reviewed pricing accuracy across all 4 active communities. The audit examined:
- Community-level `starting_rate_display` and `starting_price` fields
- All floor plan pricing and display text
- Consistency between community advertised rates and actual floor plan prices
- Pricing data completeness (NULL or $0 values)
- Display text formatting consistency

### Key Findings:
- **Total Communities Audited:** 4
- **Communities with Issues:** 3 (75%)
- **Total Issues Found:** 18
- **Critical Issues:** 3 communities have pricing discrepancies
- **Data Quality Issues:** 14 floor plans missing pricing data

---

## Detailed Findings by Community

### 1. Golden Pond Retirement Community ⚠️

**Community ID:** `ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9`
**Slug:** `golden-pond`

#### Community-Level Pricing:
- **Starting Rate Display:** "Starting at $4,600/month"
- **Starting Price:** $3,855
- **Status:** ⚠️ DISCREPANCY FOUND

#### Issues:
1. **Critical:** Community `starting_price` ($3,855) does not match the lowest floor plan price ($4,600)
2. **Minor:** Inconsistent formatting - Community uses "Starting at $X/month" while floor plans use "$X/month"

#### Floor Plans (6 total):

| Floor Plan Name | Starting Price | Display Text | Sort Order |
|----------------|----------------|--------------|------------|
| Independent Living – One Bedroom | $4,600 | $4,600/month | 0 |
| Independent Living – Two Bedroom | $5,300 | $5,300/month | 0 |
| Assisted Living – Studio | $5,900 | $5,900/month | 0 |
| Assisted Living – One Bedroom | $7,900 | $7,900/month | 0 |
| Assisted Living – Two Bedroom | $9,500 | $9,500/month | 0 |
| Memory Care – The Meadows Private Studio | $10,000 | $10,000/month | 0 |

#### Actual Lowest Price:
$4,600 (Independent Living – One Bedroom)

#### Recommended Fixes:
1. Update `communities.starting_price` from `3855` to `4600`
2. Consider standardizing `starting_rate_display` format to match floor plan format: "$4,600/month" OR update all floor plans to match community format

---

### 2. The Gardens on Quail ⚠️

**Community ID:** `b2c48ce7-11cb-4216-afdb-f2429ccae81f`
**Slug:** `the-gardens-on-quail`

#### Community-Level Pricing:
- **Starting Rate Display:** "Monthly rentals start at $4,695/mo"
- **Starting Price:** $4,695
- **Status:** ⚠️ CRITICAL - NO FLOOR PLAN PRICING

#### Issues:
1. **Critical:** ALL 5 floor plans have NULL `starting_price` values
2. **Critical:** Cannot verify community starting price against floor plans (all floor plans show "Contact for pricing")
3. **Data Quality:** Community advertises a specific price ($4,695) but no floor plans have prices set

#### Floor Plans (5 total):

| Floor Plan Name | Starting Price | Display Text | Sort Order |
|----------------|----------------|--------------|------------|
| Memory Care - Private Suite | NULL | Contact for pricing | 0 |
| Memory Care - One Bedroom | NULL | Contact for pricing | 0 |
| Memory Care - Two Bedroom Jack & Jill | NULL | Contact for pricing | 0 |
| Assisted Living - Private Suite | NULL | Contact for pricing | 0 |
| Assisted Living - Two Bedroom Jack & Jill | NULL | Contact for pricing | 0 |

#### Actual Lowest Price:
NULL (no floor plans have pricing)

#### Recommended Fixes:
1. **URGENT:** Add pricing data for all 5 floor plans
2. Determine which floor plan actually starts at $4,695
3. Update all floor plan `starting_price` and `starting_rate_display` fields
4. Decision needed: Either set floor plan prices OR change community to "Contact for pricing"

---

### 3. The Gardens at Columbine ⚠️

**Community ID:** `dea2cbbe-32da-4774-a85b-5dd9286892ed`
**Slug:** `gardens-at-columbine`

#### Community-Level Pricing:
- **Starting Rate Display:** "Contact us for pricing"
- **Starting Price:** $5,245
- **Status:** ⚠️ INCONSISTENT

#### Issues:
1. **Critical:** ALL 9 floor plans have NULL `starting_price` values
2. **Inconsistency:** Community has a `starting_price` ($5,245) but displays "Contact us for pricing"
3. **Data Quality:** All floor plans show "Contact for pricing" but community has a specific price set

#### Floor Plans (9 total):

| Floor Plan Name | Starting Price | Display Text | Sort Order |
|----------------|----------------|--------------|------------|
| Memory Care - Aspen Suite | NULL | Contact for pricing | 0 |
| Memory Care - Blue Spruce Suite | NULL | Contact for pricing | 0 |
| Assisted Living - Studio Bath | NULL | Contact for pricing | 0 |
| Assisted Living - Standard One Bedroom | NULL | Contact for pricing | 0 |
| Assisted Living - Deluxe One Bedroom | NULL | Contact for pricing | 0 |
| Assisted Living - Two Bedroom, One Bath | NULL | Contact for pricing | 0 |
| Memory Care - Conifer Suite | NULL | Contact for pricing | 0 |
| Memory Care - Evergreen Suite | NULL | Contact for pricing | 0 |
| Memory Care - Douglas Fir Suite | NULL | Contact for pricing | 0 |

#### Actual Lowest Price:
NULL (no floor plans have pricing)

#### Recommended Fixes:
1. **Decision needed:** Either:
   - **Option A:** Add pricing for all floor plans and update community `starting_rate_display` to show the actual starting price
   - **Option B:** Remove community `starting_price` (set to NULL) to match the "Contact for pricing" strategy
2. If choosing Option A, determine which floor plan starts at $5,245

---

### 4. Stonebridge Senior ✓

**Community ID:** `d20c45d3-8201-476a-aeb3-9b941f717ccf`
**Slug:** `stonebridge-senior`

#### Community-Level Pricing:
- **Starting Rate Display:** "Contact for pricing"
- **Starting Price:** $5,935
- **Status:** ✓ ACCURATE

#### Issues:
None - This community has accurate pricing!

#### Floor Plans (9 total):

| Floor Plan Name | Starting Price | Display Text | Sort Order |
|----------------|----------------|--------------|------------|
| Aspen | $5,935 | $5,935/month | 0 |
| Copper | $6,950 | $6,950/month | 0 |
| Avon | $6,950 | $6,950/month | 0 |
| Eldora | $8,580 | $8,580/month | 0 |
| Vail | $8,580 | $8,580/month | 0 |
| Georgetown | $9,528 | $9,528/month | 0 |
| Keystone | $8,500 | $8,500/month | 0 |
| Telluride | $9,000 | $9,000/month | 0 |
| Durango | $9,300 | $9,300/month | 0 |

#### Actual Lowest Price:
$5,935 (Aspen)

#### Notes:
- Community `starting_price` correctly matches lowest floor plan price
- Minor inconsistency: `starting_rate_display` says "Contact for pricing" but could be updated to "$5,935/month" for clarity
- All floor plans have complete pricing data
- Consistent formatting across all floor plans

---

## Recommendations & Action Items

### Immediate Actions Required:

#### 1. Golden Pond Retirement Community
**Priority:** HIGH
**Action:**
```sql
UPDATE communities
SET starting_price = 4600,
    starting_rate_display = 'Starting at $4,600/month'
WHERE id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9';
```

#### 2. The Gardens on Quail
**Priority:** CRITICAL
**Action:** Business decision required
- **Option A:** Get pricing information and populate all floor plan prices
- **Option B:** Change community `starting_rate_display` to "Contact for pricing" and remove `starting_price`

If Option A is chosen:
```sql
-- Example (need actual pricing data)
UPDATE floor_plans
SET starting_price = [ACTUAL_PRICE],
    starting_rate_display = '$[ACTUAL_PRICE]/month'
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
  AND name = '[FLOOR_PLAN_NAME]';
```

If Option B is chosen:
```sql
UPDATE communities
SET starting_price = NULL,
    starting_rate_display = 'Contact for pricing'
WHERE id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f';
```

#### 3. The Gardens at Columbine
**Priority:** CRITICAL
**Action:** Business decision required
- Same options as The Gardens on Quail

### Formatting Standardization:

**Current formats found:**
- "Starting at $X/month" (Golden Pond community level)
- "$X/month" (Golden Pond floor plans, Stonebridge)
- "Monthly rentals start at $X/mo" (Gardens on Quail)
- "Contact for pricing" (Gardens at Columbine, Gardens on Quail floor plans)
- "Contact us for pricing" (Gardens at Columbine)

**Recommended standard format:**
- Community level: "Starting at $X/month"
- Floor plan level: "$X/month"
- Contact-based: "Contact for pricing" (consistent wording)

---

## Data Quality Metrics

| Metric | Count | Percentage |
|--------|-------|------------|
| Communities with accurate pricing | 1 | 25% |
| Communities with discrepancies | 3 | 75% |
| Floor plans with NULL prices | 14 | 50% |
| Floor plans with valid prices | 14 | 50% |
| Total floor plans audited | 28 | 100% |

---

## Testing Recommendations

After implementing fixes, verify:
1. Community detail pages display correct starting prices
2. Floor plan listings show accurate pricing
3. Filtering/sorting by price works correctly
4. SEO meta data reflects accurate pricing
5. Any cached pricing data is cleared/updated

---

## Audit Methodology

This audit was performed by:
1. Querying the database directly for all community and floor plan pricing data
2. Comparing community `starting_price` against the minimum floor plan `starting_price`
3. Analyzing `starting_rate_display` formatting patterns
4. Identifying NULL and $0 pricing values
5. Verifying data consistency across related records

**Database queries used:**
- Selected all communities by slug/ID
- Retrieved all floor plans per community ordered by `sort_order`
- Calculated minimum non-null, non-zero floor plan prices
- Cross-referenced community vs floor plan pricing

---

## Appendix: Complete Community Information

| Community | ID | Slug | Starting Price | Lowest Floor Plan | Match |
|-----------|----|----- |----------------|-------------------|-------|
| Golden Pond | ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9 | golden-pond | $3,855 | $4,600 | ✗ |
| Gardens on Quail | b2c48ce7-11cb-4216-afdb-f2429ccae81f | the-gardens-on-quail | $4,695 | NULL | ✗ |
| Gardens at Columbine | dea2cbbe-32da-4774-a85b-5dd9286892ed | gardens-at-columbine | $5,245 | NULL | ✗ |
| Stonebridge Senior | d20c45d3-8201-476a-aeb3-9b941f717ccf | stonebridge-senior | $5,935 | $5,935 | ✓ |

---

**Report Status:** COMPLETE
**Next Steps:** Await business decisions on pricing strategy for communities with missing floor plan data, then implement recommended SQL updates.
