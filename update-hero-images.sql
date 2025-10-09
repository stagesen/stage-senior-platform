-- Update hero images for all 4 communities
-- This script sets the image_id field for each community to link to appropriate hero images

-- 1. The Gardens at Columbine - use existing hero image already in database
UPDATE communities
SET image_id = '0a035795-1b9b-4403-a58e-82c9f8879fb7'
WHERE id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed';

-- 2. The Gardens on Quail - use existing hero image already in database
UPDATE communities
SET image_id = 'ca5be540-6db7-4fe8-a3dc-31f155621fc4'
WHERE id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f';

-- 3. Golden Pond Retirement Community - use the landscape image from existing images
UPDATE communities
SET image_id = 'gp-landscape'
WHERE id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9';

-- 4. Stonebridge Senior - need to create image record from existing hero_image_url
-- First, insert the image record
INSERT INTO images (id, object_key, url, alt, width, height, mime_type, created_at)
VALUES (
  'stonebridge-hero-image',
  'stonebridge-senior/hero',
  'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=1600&auto=format&fit=crop',
  'Stonebridge Senior hero image - senior living community exterior',
  1600,
  1067,
  'image/jpeg',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Then update community to use this image
UPDATE communities
SET image_id = 'stonebridge-hero-image'
WHERE id = 'd20c45d3-8201-476a-aeb3-9b941f717ccf';

-- Verify all communities now have hero images
SELECT
  c.id,
  c.name,
  c.image_id,
  i.url as hero_image_url,
  i.alt as hero_image_alt
FROM communities c
LEFT JOIN images i ON c.image_id = i.id
ORDER BY c.name;
