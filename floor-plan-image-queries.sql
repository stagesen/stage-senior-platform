-- Floor Plan Image Verification Queries
-- These queries can be used to verify floor plan image coverage

-- Query 1: Get all floor plans with their image status
SELECT
  c.name as community,
  fp.name as floor_plan,
  fp.image_id,
  CASE WHEN fp.image_id IS NOT NULL THEN 'Has Image' ELSE 'MISSING' END as status
FROM floor_plans fp
JOIN communities c ON fp.community_id = c.id
WHERE c.active = true AND fp.active = true
ORDER BY c.name, fp.sort_order;

-- Query 2: Count floor plans by image status per community
SELECT
  c.name as community,
  COUNT(*) as total_floor_plans,
  COUNT(fp.image_id) as has_image,
  COUNT(*) - COUNT(fp.image_id) as missing_image
FROM floor_plans fp
JOIN communities c ON fp.community_id = c.id
WHERE c.active = true AND fp.active = true
GROUP BY c.name
ORDER BY c.name;

-- Query 3: List floor plans missing images
SELECT
  c.name as community,
  fp.name as floor_plan,
  ct.name as care_type
FROM floor_plans fp
JOIN communities c ON fp.community_id = c.id
LEFT JOIN care_types ct ON fp.care_type_id = ct.id
WHERE c.active = true
  AND fp.active = true
  AND fp.image_id IS NULL
ORDER BY c.name, fp.name;

-- Query 4: Verify image references (check for broken references)
SELECT
  c.name as community,
  fp.name as floor_plan,
  fp.image_id,
  CASE
    WHEN fp.image_id IS NOT NULL AND i.id IS NULL THEN 'BROKEN REFERENCE'
    WHEN fp.image_id IS NOT NULL AND i.id IS NOT NULL THEN 'Valid Image'
    ELSE 'No Image'
  END as image_status
FROM floor_plans fp
JOIN communities c ON fp.community_id = c.id
LEFT JOIN images i ON fp.image_id = i.id
WHERE c.active = true AND fp.active = true
ORDER BY c.name, fp.sort_order;

-- Query 5: Check for legacy imageUrl usage
SELECT
  c.name as community,
  fp.name as floor_plan,
  fp.image_url as legacy_url
FROM floor_plans fp
JOIN communities c ON fp.community_id = c.id
WHERE c.active = true
  AND fp.active = true
  AND fp.image_url IS NOT NULL
  AND fp.image_id IS NULL
ORDER BY c.name;

-- Query 6: Count additional images in floor_plan_images junction table
SELECT
  c.name as community,
  fp.name as floor_plan,
  COUNT(fpi.id) as additional_images
FROM floor_plans fp
JOIN communities c ON fp.community_id = c.id
LEFT JOIN floor_plan_images fpi ON fp.id = fpi.floor_plan_id
WHERE c.active = true AND fp.active = true
GROUP BY c.id, c.name, fp.id, fp.name
HAVING COUNT(fpi.id) > 0
ORDER BY c.name, fp.name;

-- Query 7: Overall statistics
SELECT
  COUNT(*) as total_floor_plans,
  COUNT(fp.image_id) as has_image,
  COUNT(*) - COUNT(fp.image_id) as missing_image,
  ROUND(COUNT(fp.image_id)::numeric / COUNT(*)::numeric * 100, 1) as percentage_with_images
FROM floor_plans fp
JOIN communities c ON fp.community_id = c.id
WHERE c.active = true AND fp.active = true;

-- Query 8: Get floor plans with image details
SELECT
  c.name as community,
  fp.name as floor_plan,
  ct.name as care_type,
  fp.image_id,
  i.url as image_url,
  i.alt as image_alt,
  i.width,
  i.height
FROM floor_plans fp
JOIN communities c ON fp.community_id = c.id
LEFT JOIN care_types ct ON fp.care_type_id = ct.id
LEFT JOIN images i ON fp.image_id = i.id
WHERE c.active = true AND fp.active = true
ORDER BY c.name, fp.sort_order;
