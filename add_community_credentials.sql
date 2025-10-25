-- Add community credentials and verified stats fields
-- Migration: add_community_credentials
-- Date: 2025-10-25

ALTER TABLE communities
ADD COLUMN IF NOT EXISTS year_established INTEGER,
ADD COLUMN IF NOT EXISTS licensed_since DATE,
ADD COLUMN IF NOT EXISTS resident_capacity INTEGER,
ADD COLUMN IF NOT EXISTS special_certifications JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS verified_stats JSONB DEFAULT '{}'::jsonb;

-- Add helpful comments
COMMENT ON COLUMN communities.year_established IS 'The year the community was established';
COMMENT ON COLUMN communities.licensed_since IS 'Date when the community first received its license';
COMMENT ON COLUMN communities.resident_capacity IS 'Maximum number of residents the community can accommodate';
COMMENT ON COLUMN communities.special_certifications IS 'Array of special certifications (e.g., ["Alzheimer''s Care Certified", "LEED Certified"])';
COMMENT ON COLUMN communities.verified_stats IS 'JSONB object for flexible verified statistics (e.g., {"familiesServed": 500, "staffCount": 45, "yearsInBusiness": 20})';
