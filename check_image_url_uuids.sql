--
-- Check if the image_url UUID values exist in the images table
-- Run on PRODUCTION
--

SELECT
  fp.name as floor_plan_name,
  fp.image_id as image_id_column,
  fp.image_url as image_url_column,
  i1.url as image_id_resolved_url,
  i2.url as image_url_resolved_url,
  CASE
    WHEN i1.id IS NULL THEN '✗ image_id NOT FOUND in images table'
    WHEN i2.id IS NULL AND fp.image_url IS NOT NULL THEN '✗ image_url UUID NOT FOUND in images table'
    WHEN i1.id IS NOT NULL AND i2.id IS NOT NULL THEN '✓ Both exist'
    ELSE '✓ image_id exists'
  END as status
FROM floor_plans fp
LEFT JOIN images i1 ON i1.id = fp.image_id
LEFT JOIN images i2 ON i2.id = fp.image_url
WHERE fp.community_id = (SELECT id FROM communities WHERE slug = 'gardens-at-columbine')
ORDER BY fp.bedrooms, fp.name;
