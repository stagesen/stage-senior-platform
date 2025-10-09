-- Update floor plan pricing for Gardens on Quail
-- Community ID: b2c48ce7-11cb-4216-afdb-f2429ccae81f

-- First, let's see the current state of floor plans
SELECT id, name, starting_price, starting_rate_display, sort_order
FROM floor_plans
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
ORDER BY sort_order;

-- Update Memory Care - Private Suite (350 sq ft)
UPDATE floor_plans
SET starting_price = 8300,
    starting_rate_display = '$8,300/month'
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
  AND name = 'Memory Care - Private Suite';

-- Update Memory Care - One Bedroom (485 sq ft)
UPDATE floor_plans
SET starting_price = 8950,
    starting_rate_display = '$8,950/month'
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
  AND name = 'Memory Care - One Bedroom';

-- Update Memory Care - Two Bedroom Jack & Jill (705 sq ft)
UPDATE floor_plans
SET starting_price = 9400,
    starting_rate_display = '$9,400/month'
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
  AND name = 'Memory Care - Two Bedroom Jack & Jill';

-- Update Assisted Living - Private Suite (450 sq ft)
UPDATE floor_plans
SET starting_price = 5500,
    starting_rate_display = '$5,500/month'
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
  AND name = 'Assisted Living - Private Suite';

-- Update Assisted Living - Two Bedroom Jack & Jill (600 sq ft)
UPDATE floor_plans
SET starting_price = 6200,
    starting_rate_display = '$6,200/month'
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
  AND name = 'Assisted Living - Two Bedroom Jack & Jill';

-- Verify the updates
SELECT id, name, starting_price, starting_rate_display, sort_order
FROM floor_plans
WHERE community_id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f'
ORDER BY sort_order;

-- Check the community starting price (should be updated to reflect the lowest floor plan price)
SELECT starting_price, starting_rate_display
FROM communities
WHERE id = 'b2c48ce7-11cb-4216-afdb-f2429ccae81f';
