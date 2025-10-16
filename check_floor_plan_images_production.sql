--
-- Diagnostic query to check floor plan images in PRODUCTION
-- Run this on your PRODUCTION database
--

-- Check Gardens at Columbine floor plans and their images
SELECT
  fp.id,
  fp.name,
  fp.bedrooms,
  fp.bathrooms,
  fp.image_id,
  fp.image_url,
  fp.active,
  CASE
    WHEN fp.image_id IS NOT NULL THEN 'Has image_id'
    WHEN fp.image_url IS NOT NULL THEN 'Has image_url only'
    ELSE 'NO IMAGE'
  END as image_status,
  i.url as resolved_image_url
FROM floor_plans fp
LEFT JOIN images i ON i.id = fp.image_id
LEFT JOIN communities c ON c.id = fp.community_id
WHERE c.slug = 'gardens-at-columbine'
  AND fp.active = true
ORDER BY fp.bedrooms, fp.name;

-- Summary count
SELECT
  COUNT(*) as total_floor_plans,
  COUNT(fp.image_id) as has_image_id,
  COUNT(fp.image_url) as has_image_url,
  COUNT(*) - COUNT(fp.image_id) - COUNT(fp.image_url) as missing_images
FROM floor_plans fp
LEFT JOIN communities c ON c.id = fp.community_id
WHERE c.slug = 'gardens-at-columbine'
  AND fp.active = true;
