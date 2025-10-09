-- ============================================================================
-- PRICING AUDIT - RECOMMENDED FIXES
-- Generated: 2025-10-09
--
-- IMPORTANT: Review each fix carefully before executing
-- Some fixes require business decisions on pricing strategy
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. GOLDEN POND RETIREMENT COMMUNITY
-- Status: Ready to execute
-- Issue: Community starting_price doesn't match lowest floor plan price
-- ----------------------------------------------------------------------------

-- Fix: Update community starting price to match lowest floor plan ($4,600)
UPDATE communities
SET starting_price = 4600,
    starting_rate_display = 'Starting at $4,600/month',
    updated_at = NOW()
WHERE id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9';

-- Verify the fix:
SELECT
    name,
    starting_price,
    starting_rate_display,
    (SELECT MIN(starting_price) FROM floor_plans WHERE community_id = communities.id) as lowest_floor_plan_price
FROM communities
WHERE id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9';


-- ----------------------------------------------------------------------------
-- 2. THE GARDENS ON QUAIL
-- Status: REQUIRES BUSINESS DECISION
-- Issue: All floor plans have NULL pricing, but community advertises $4,695
-- ----------------------------------------------------------------------------

-- OPTION A: Keep "Contact for pricing" strategy
-- Remove specific pricing from community level to match floor plans
-- Uncomment if this is the chosen strategy:

/*
UPDATE communities
SET starting_price = NULL,
    starting_rate_display = 'Contact for pricing',
    updated_at = NOW()
WHERE id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f';
*/


-- OPTION B: Add pricing to floor plans
-- This requires actual pricing data from the business
-- Replace [PRICE] with actual prices for each floor plan
-- Uncomment and update with real prices if this is the chosen strategy:

/*
-- Memory Care - Private Suite
UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
  AND name = 'Memory Care - Private Suite';

-- Memory Care - One Bedroom
UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
  AND name = 'Memory Care - One Bedroom';

-- Memory Care - Two Bedroom Jack & Jill
UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
  AND name = 'Memory Care - Two Bedroom Jack & Jill';

-- Assisted Living - Private Suite
UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
  AND name = 'Assisted Living - Private Suite';

-- Assisted Living - Two Bedroom Jack & Jill
UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
  AND name = 'Assisted Living - Two Bedroom Jack & Jill';

-- After adding floor plan prices, update community to match lowest price
UPDATE communities
SET starting_price = (
    SELECT MIN(starting_price)
    FROM floor_plans
    WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
),
    starting_rate_display = (
        SELECT 'Starting at $' || MIN(starting_price)::text || '/month'
        FROM floor_plans
        WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
    ),
    updated_at = NOW()
WHERE id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f';
*/

-- Verify Gardens on Quail:
SELECT
    name,
    starting_price,
    starting_rate_display
FROM communities
WHERE id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f';

SELECT
    name,
    starting_price,
    starting_rate_display
FROM floor_plans
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
ORDER BY sort_order;


-- ----------------------------------------------------------------------------
-- 3. THE GARDENS AT COLUMBINE
-- Status: REQUIRES BUSINESS DECISION
-- Issue: All floor plans have NULL pricing, community has $5,245 but displays "Contact for pricing"
-- ----------------------------------------------------------------------------

-- OPTION A: Keep "Contact for pricing" strategy
-- Remove specific pricing from community level to match floor plans
-- Uncomment if this is the chosen strategy:

/*
UPDATE communities
SET starting_price = NULL,
    starting_rate_display = 'Contact for pricing',
    updated_at = NOW()
WHERE id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed';
*/


-- OPTION B: Add pricing to floor plans
-- This requires actual pricing data from the business
-- Replace [PRICE] with actual prices for each floor plan
-- Uncomment and update with real prices if this is the chosen strategy:

/*
-- Memory Care floor plans
UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Memory Care - Aspen Suite';

UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Memory Care - Blue Spruce Suite';

UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Memory Care - Conifer Suite';

UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Memory Care - Evergreen Suite';

UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Memory Care - Douglas Fir Suite';

-- Assisted Living floor plans
UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Assisted Living - Studio Bath';

UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Assisted Living - Standard One Bedroom';

UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Assisted Living - Deluxe One Bedroom';

UPDATE floor_plans
SET starting_price = [PRICE],
    starting_rate_display = '$[PRICE]/month',
    updated_at = NOW()
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Assisted Living - Two Bedroom, One Bath';

-- After adding floor plan prices, update community to match lowest price
UPDATE communities
SET starting_price = (
    SELECT MIN(starting_price)
    FROM floor_plans
    WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
),
    starting_rate_display = (
        SELECT 'Starting at $' || MIN(starting_price)::text || '/month'
        FROM floor_plans
        WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
    ),
    updated_at = NOW()
WHERE id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed';
*/

-- Verify Gardens at Columbine:
SELECT
    name,
    starting_price,
    starting_rate_display
FROM communities
WHERE id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed';

SELECT
    name,
    starting_price,
    starting_rate_display
FROM floor_plans
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
ORDER BY sort_order;


-- ----------------------------------------------------------------------------
-- 4. STONEBRIDGE SENIOR
-- Status: OPTIONAL ENHANCEMENT
-- Issue: None - pricing is accurate. Could update display text for clarity
-- ----------------------------------------------------------------------------

-- Optional: Update starting_rate_display to show actual price instead of "Contact for pricing"
-- This is cosmetic only, not required for accuracy
-- Uncomment if desired:

/*
UPDATE communities
SET starting_rate_display = 'Starting at $5,935/month',
    updated_at = NOW()
WHERE id = 'd20c45d3-8201-476a-aeb3-9b941f717ccf';
*/


-- ============================================================================
-- FINAL VERIFICATION QUERY
-- Run this after all fixes to verify all communities have accurate pricing
-- ============================================================================

SELECT
    c.name as community_name,
    c.slug,
    c.starting_price as community_price,
    c.starting_rate_display,
    MIN(fp.starting_price) as lowest_floor_plan_price,
    CASE
        WHEN c.starting_price = MIN(fp.starting_price) THEN '✓ MATCH'
        WHEN MIN(fp.starting_price) IS NULL THEN '⚠ NO FLOOR PLAN PRICING'
        ELSE '✗ MISMATCH'
    END as status,
    COUNT(fp.id) as total_floor_plans,
    COUNT(fp.starting_price) as floor_plans_with_pricing
FROM communities c
LEFT JOIN floor_plans fp ON c.id = fp.community_id
WHERE c.id IN (
    'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9',
    'b2c48ce7-11cb-4216-afdb-f2429ccae81f',
    'dea2cbbe-32da-4774-a85b-5dd9286892ed',
    'd20c45d3-8201-476a-aeb3-9b941f717ccf'
)
GROUP BY c.id, c.name, c.slug, c.starting_price, c.starting_rate_display
ORDER BY c.name;
