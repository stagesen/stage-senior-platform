# Golden Pond Community Page Cleanup - Production

Date: 2025-10-10

## Summary
Cleaned up the Golden Pond community page (`/communities/golden-pond`) for production by reducing duplicate content, updating language to be mobile and senior-friendly, and ensuring all content is database-driven.

## Changes Made

### 1. Experience the Difference Features (community_features table)
**Reduced from 6 features (with 2 duplicates) to 4 unique features**

#### Removed:
- Duplicate "Personalized Care at Every Stage" (id: `d03c6459-3da4-4721-acc2-64f59ecf0c97`)
- "Designed for Connection" (id: `8e524d0f-7aaa-48bc-95f5-57701db7addf`)
- "Scenic Campus & Modern Amenities" (id: `991772b2-378d-4faf-ad90-2cd043f0670c`)

#### Updated (with mobile-friendly language):

**Feature 1:**
- **Eyebrow:** "Care That Fits"
- **Title:** "Support That Grows With You"
- **Body:** "From independent living to memory care, our experienced team provides the right level of support at every stage. Stay in the community you love as your needs change."
- **Sort Order:** 1

**Feature 2:**
- **Eyebrow:** "Locally Owned"
- **Title:** "Part of Golden Since 2004"
- **Body:** "We're locally owned and deeply connected to our community. That means responsive leadership, staff who care, and a place that truly feels like home. 98% of our residents agree — life here is golden."
- **Sort Order:** 2

**Feature 3:**
- **Eyebrow:** "Stay Active"
- **Title:** "Do What You Love"
- **Body:** "Whether it's Friday happy hour, art classes, or scenic mountain drives, there's always something to enjoy. Our activity calendar is packed with ways to stay social, active, and engaged."
- **Sort Order:** 3

**Feature 4 (New):**
- **Eyebrow:** "Fresh & Delicious"
- **Title:** "Chef-Prepared Meals Daily"
- **Body:** "Enjoy restaurant-style dining with fresh, seasonal ingredients — breakfast, lunch, and dinner, seven days a week. Join us for Friday happy hour with friends and neighbors."
- **Sort Order:** 4

### 2. Community Highlights (community_highlights table)
**Reduced from 9 highlights (with duplicates) to 4 highlights**

#### Removed:
- Duplicate "Stunning Mountain Views" (ids: `062bc7b2-a1fe-4da2-854e-b3f09aaa13a8`, `df1510f1-46be-476e-a6e9-988cf5a01c6f`)
- "Prime Golden Location" (id: `098e2892-7445-44dc-88e8-2ffff4c7abba`)
- "Compassionate Memory Care" (id: `91ec6157-0478-4546-b616-1e5eb4a9e134`)
- "All-Inclusive Services" (id: `d52b1a43-6815-4d9b-8703-8c8fd32869dd`)

#### Updated (with mobile-friendly language):

**Highlight 1:**
- **Title:** "Locally Owned Since 2004"
- **Description:** "A family feel with responsive leadership and staff who truly care."
- **Sort Order:** 1

**Highlight 2:**
- **Title:** "Chef-Prepared Dining"
- **Description:** "Fresh, seasonal meals daily. Join us for Friday happy hour!"
- **Sort Order:** 2

**Highlight 3:**
- **Title:** "Stay as Your Needs Change"
- **Description:** "Independent living, assisted living, and memory care — all in one community."
- **Sort Order:** 3

**Highlight 4:**
- **Title:** "Always Something to Do"
- **Description:** "Art, music, outings, and social events — plus mountain views from your home."
- **Sort Order:** 4

## SQL Script to Apply Changes

```sql
-- ============================================
-- GOLDEN POND CLEANUP - FEATURES
-- ============================================

-- Get Golden Pond community ID (should be: ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9)
-- SELECT id FROM communities WHERE slug = 'golden-pond';

-- Delete duplicate and extra features (reduce from 6 to 3, then add 1 new = 4 total)
DELETE FROM community_features
WHERE community_id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9'
  AND title IN ('Designed for Connection', 'Scenic Campus & Modern Amenities');

DELETE FROM community_features
WHERE community_id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9'
  AND title = 'Personalized Care at Every Stage'
  AND body LIKE '%individualized attention%';

-- Update Feature 1: Personalized Care → Support That Grows With You
UPDATE community_features
SET
  eyebrow = 'Care That Fits',
  title = 'Support That Grows With You',
  body = 'From independent living to memory care, our experienced team provides the right level of support at every stage. Stay in the community you love as your needs change.',
  sort_order = 1
WHERE community_id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9'
  AND title = 'Personalized Care at Every Stage';

-- Update Feature 2: Locally Owned
UPDATE community_features
SET
  eyebrow = 'Locally Owned',
  title = 'Part of Golden Since 2004',
  body = 'We''re locally owned and deeply connected to our community. That means responsive leadership, staff who care, and a place that truly feels like home. 98% of our residents agree — life here is golden.',
  sort_order = 2
WHERE community_id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9'
  AND title = 'Locally Owned & Comprehensive';

-- Update Feature 3: Activities
UPDATE community_features
SET
  eyebrow = 'Stay Active',
  title = 'Do What You Love',
  body = 'Whether it''s Friday happy hour, art classes, or scenic mountain drives, there''s always something to enjoy. Our activity calendar is packed with ways to stay social, active, and engaged.',
  sort_order = 3
WHERE community_id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9'
  AND title = 'Engaging Activities & Social Events';

-- Add Feature 4: Dining (NEW)
INSERT INTO community_features (
  community_id,
  eyebrow,
  title,
  body,
  sort_order,
  active,
  image_left
) VALUES (
  'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9',
  'Fresh & Delicious',
  'Chef-Prepared Meals Daily',
  'Enjoy restaurant-style dining with fresh, seasonal ingredients — breakfast, lunch, and dinner, seven days a week. Join us for Friday happy hour with friends and neighbors.',
  4,
  true,
  false
);

-- ============================================
-- GOLDEN POND CLEANUP - HIGHLIGHTS
-- ============================================

-- Delete duplicate Mountain Views highlights
DELETE FROM community_highlights
WHERE community_id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9'
  AND title = 'Stunning Mountain Views';

-- Delete less critical highlights (keeping 4 total)
DELETE FROM community_highlights
WHERE community_id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9'
  AND title IN ('Prime Golden Location', 'Compassionate Memory Care', 'All-Inclusive Services');

-- Update Highlight 1: Locally Owned
UPDATE community_highlights
SET
  title = 'Locally Owned Since 2004',
  description = 'A family feel with responsive leadership and staff who truly care.',
  sort_order = 1
WHERE community_id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9'
  AND title = 'Locally Owned & Operated';

-- Update Highlight 2: Dining
UPDATE community_highlights
SET
  title = 'Chef-Prepared Dining',
  description = 'Fresh, seasonal meals daily. Join us for Friday happy hour!',
  sort_order = 2
WHERE community_id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9'
  AND title = 'Restaurant-Style Dining';

-- Update Highlight 3: Continuum of Care
UPDATE community_highlights
SET
  title = 'Stay as Your Needs Change',
  description = 'Independent living, assisted living, and memory care — all in one community.',
  sort_order = 3
WHERE community_id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9'
  AND title = 'Continuum of Care';

-- Update Highlight 4: Active Lifestyle
UPDATE community_highlights
SET
  title = 'Always Something to Do',
  description = 'Art, music, outings, and social events — plus mountain views from your home.',
  sort_order = 4
WHERE community_id = 'ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9'
  AND title = 'Active Lifestyle';
```

### 3. Community Overview & Description (communities table)
**Reduced description from 2,143 to 983 characters**

**New Overview:**
```
Since 2004, Golden Pond has been a proud part of Golden, Colorado. We're locally owned and deeply connected to the community — offering independent living, assisted living, and memory care designed for comfort, independence, and care that grows with you.
```

**New Description:**
```
Welcome to Golden Pond, where life is golden. Our locally owned community sits at the base of North Table Mountain with stunning views and a warm, family feel.

**Your Home, Your Way**

Choose from spacious studios, one-bedroom, or two-bedroom apartments with mountain views. Enjoy chef-prepared meals, Friday happy hour, and all the conveniences of home — housekeeping, Wi-Fi, cable, and utilities included.

**Stay Active & Engaged**

From art classes and live music to scenic drives and trishaw bike rides, there's always something to enjoy. Join clubs, make friends, and live life to the fullest.

**Care That Grows With You**

Start in independent living and stay as your needs change. Our experienced team provides support at every stage — from assisted living to specialized memory care at The Meadows.

**98% Resident Satisfaction**

Families know what we know: this is home. With responsive leadership, caring staff, and a vibrant community, Golden Pond is where you belong.
```

### 4. Remove Hardcoded Generic Text (community-detail.tsx)
**Removed generic "fostering a fulfilling lifestyle" paragraph that appeared on all community pages**

File: `client/src/pages/community-detail.tsx` (line 1646-1648)

Removed this hardcoded text:
```
At {community.name}, we believe in fostering a fulfilling lifestyle for our residents. Living in our community makes it easy to nurture your mind, body, and spirit—whether it's over a meal or during a group activity. With daily opportunities for creativity, learning, fitness, and social connections, you'll discover ways to ignite your passions and uncover new possibilities.
```

## SQL Script to Apply Changes

Add this to the previous SQL script:

```sql
-- ============================================
-- GOLDEN POND CLEANUP - OVERVIEW & DESCRIPTION
-- ============================================

-- Update overview and description with mobile-friendly content
UPDATE communities
SET
  overview = 'Since 2004, Golden Pond has been a proud part of Golden, Colorado. We''re locally owned and deeply connected to the community — offering independent living, assisted living, and memory care designed for comfort, independence, and care that grows with you.',
  description = 'Welcome to Golden Pond, where life is golden. Our locally owned community sits at the base of North Table Mountain with stunning views and a warm, family feel.

**Your Home, Your Way**

Choose from spacious studios, one-bedroom, or two-bedroom apartments with mountain views. Enjoy chef-prepared meals, Friday happy hour, and all the conveniences of home — housekeeping, Wi-Fi, cable, and utilities included.

**Stay Active & Engaged**

From art classes and live music to scenic drives and trishaw bike rides, there''s always something to enjoy. Join clubs, make friends, and live life to the fullest.

**Care That Grows With You**

Start in independent living and stay as your needs change. Our experienced team provides support at every stage — from assisted living to specialized memory care at The Meadows.

**98% Resident Satisfaction**

Families know what we know: this is home. With responsive leadership, caring staff, and a vibrant community, Golden Pond is where you belong.'
WHERE slug = 'golden-pond';
```

## Final State

**Features:** 4 unique items (all database-driven)
**Highlights:** 4 unique items (all database-driven)
**Overview & Description:** Updated to mobile-friendly, concise content
**Language:** Mobile-friendly, conversational, senior demographic appropriate
**Hardcoded Content:** Removed generic paragraph from template

## Code Changes
- **File:** `client/src/pages/community-detail.tsx`
- **Change:** Removed hardcoded "fostering a fulfilling lifestyle" paragraph (lines 1646-1648)

## Notes
- Community ID: `ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9`
- Community Slug: `golden-pond`
- All content now pulls from database (no hardcoded fallbacks will display)
- Language optimized for mobile with shorter sentences and clearer messaging
- Description reduced from 2,143 to 983 characters (54% reduction)
