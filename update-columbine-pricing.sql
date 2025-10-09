-- Update Gardens at Columbine Floor Plan Pricing
-- Community ID: dea2cbbe-32da-4774-a85b-5dd9286892ed
-- Based on pricing data from site_launch_floor_plans_1758686955222.csv

-- Assisted Living Floor Plans
UPDATE floor_plans
SET starting_price = 5900,
    starting_rate_display = '$5,900/month'
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Assisted Living - Studio Bath';

UPDATE floor_plans
SET starting_price = 7100,
    starting_rate_display = '$7,100/month'
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Assisted Living - Standard One Bedroom';

UPDATE floor_plans
SET starting_price = 7600,
    starting_rate_display = '$7,600/month'
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Assisted Living - Deluxe One Bedroom';

UPDATE floor_plans
SET starting_price = 10300,
    starting_rate_display = '$10,300/month'
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Assisted Living - Two Bedroom, One Bath';

-- Memory Care Floor Plans
UPDATE floor_plans
SET starting_price = 9750,
    starting_rate_display = '$9,750/month'
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Memory Care - Aspen Suite';

UPDATE floor_plans
SET starting_price = 9850,
    starting_rate_display = '$9,850/month'
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Memory Care - Blue Spruce Suite';

UPDATE floor_plans
SET starting_price = 9850,
    starting_rate_display = '$9,850/month'
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Memory Care - Conifer Suite';

UPDATE floor_plans
SET starting_price = 10400,
    starting_rate_display = '$10,400/month'
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Memory Care - Evergreen Suite';

UPDATE floor_plans
SET starting_price = 10600,
    starting_rate_display = '$10,600/month'
WHERE community_id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed'
  AND name = 'Memory Care - Douglas Fir Suite';

-- Update community starting_rate_display to match lowest floor plan price ($5,900)
-- Also update starting_price to match
UPDATE communities
SET starting_price = 5900,
    starting_rate_display = 'Starting at $5,900/month'
WHERE id = 'dea2cbbe-32da-4774-a85b-5dd9286892ed';
