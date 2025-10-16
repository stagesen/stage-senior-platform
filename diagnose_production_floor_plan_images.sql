--
-- Comprehensive diagnostic for floor plan image issues in PRODUCTION
-- Run this on your PRODUCTION database
--

\echo '=== DIAGNOSTIC 1: Check Gardens at Columbine floor plans ==='
SELECT
  fp.id,
  fp.name,
  fp.bedrooms,
  fp.image_id,
  fp.image_url,
  fp.active,
  CASE
    WHEN fp.image_id IS NOT NULL THEN '✓ Has image_id'
    WHEN fp.image_url IS NOT NULL THEN '⚠ Has image_url only (legacy)'
    ELSE '✗ NO IMAGE'
  END as status
FROM floor_plans fp
WHERE fp.community_id = (SELECT id FROM communities WHERE slug = 'gardens-at-columbine')
ORDER BY fp.bedrooms, fp.name;

\echo ''
\echo '=== DIAGNOSTIC 2: Check if image_id values exist in images table ==='
SELECT
  fp.name as floor_plan_name,
  fp.image_id,
  CASE
    WHEN i.id IS NOT NULL THEN '✓ Image EXISTS in images table'
    WHEN fp.image_id IS NOT NULL AND i.id IS NULL THEN '✗ BROKEN REFERENCE - image_id does not exist!'
    ELSE 'No image_id set'
  END as image_status,
  i.url as image_url
FROM floor_plans fp
LEFT JOIN images i ON i.id = fp.image_id
WHERE fp.community_id = (SELECT id FROM communities WHERE slug = 'gardens-at-columbine')
ORDER BY fp.bedrooms, fp.name;

\echo ''
\echo '=== DIAGNOSTIC 3: Summary counts ==='
SELECT
  COUNT(*) as total_floor_plans,
  COUNT(fp.image_id) as has_image_id,
  COUNT(i.id) as image_id_exists_in_images_table,
  COUNT(fp.image_id) - COUNT(i.id) as broken_references
FROM floor_plans fp
LEFT JOIN images i ON i.id = fp.image_id
WHERE fp.community_id = (SELECT id FROM communities WHERE slug = 'gardens-at-columbine')
  AND fp.active = true;

\echo ''
\echo '=== DIAGNOSTIC 4: Check all floor plan images across all communities ==='
SELECT
  c.name as community_name,
  COUNT(fp.id) as total_floor_plans,
  COUNT(fp.image_id) as with_image_id,
  COUNT(fp.id) - COUNT(fp.image_id) as missing_images
FROM communities c
LEFT JOIN floor_plans fp ON fp.community_id = c.id AND fp.active = true
WHERE c.active = true
GROUP BY c.id, c.name
HAVING COUNT(fp.id) > 0
ORDER BY (COUNT(fp.id) - COUNT(fp.image_id)) DESC;
