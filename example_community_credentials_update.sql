-- Example: How to populate community credentials for specific communities
-- This file shows examples of how to update communities with verified credentials and stats

-- Example 1: Update a community with year established and verified stats
-- Replace 'the-gardens-on-quail' with actual community slug
UPDATE communities
SET
  year_established = 2016,
  licensed_since = '2016-03-15',
  resident_capacity = 85,
  special_certifications = '["Memory Care Certified", "Alzheimer''s Association Partner"]'::jsonb,
  verified_stats = '{
    "familiesServed": 500,
    "staffCount": 45,
    "yearsInBusiness": 8
  }'::jsonb
WHERE slug = 'the-gardens-on-quail';

-- Example 2: Update another community with different credentials
UPDATE communities
SET
  year_established = 2010,
  licensed_since = '2010-06-01',
  resident_capacity = 120,
  special_certifications = '["LEED Certified", "5-Star Rating"]'::jsonb,
  verified_stats = '{
    "familiesServed": 1200,
    "staffCount": 60,
    "residentsServed": 800
  }'::jsonb
WHERE slug = 'example-community-slug';

-- Example 3: Update a community with minimal data (only what's verified)
UPDATE communities
SET
  year_established = 2018,
  licensed_since = '2018-01-10',
  special_certifications = '["State Licensed Facility"]'::jsonb
WHERE slug = 'another-community-slug';

-- Example 4: Add only verified stats without year established
UPDATE communities
SET
  verified_stats = '{
    "staffCount": 30,
    "averageTenure": "5 years"
  }'::jsonb
WHERE slug = 'third-community-slug';

-- Query to verify the updates
SELECT
  slug,
  name,
  year_established,
  licensed_since,
  resident_capacity,
  special_certifications,
  verified_stats
FROM communities
WHERE year_established IS NOT NULL OR verified_stats != '{}'::jsonb
ORDER BY name;
