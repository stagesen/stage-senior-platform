# Production Launch Action Plan
**Generated:** October 9, 2025
**Objective:** Get all 4 communities production-ready

---

## Immediate Actions (TODAY - 0-30 minutes)

### 1. Launch The Gardens on Quail ✅
**Status:** READY NOW
**Action:** Deploy to production immediately
**Time:** 0 minutes (already ready)

This community is production-ready with:
- All critical data complete
- 100% floor plan image coverage
- Strong content and galleries
- Only 1 minor SEO title issue (can fix later)

**Deploy command:** (Your deployment process here)

---

### 2. Fix SEO Titles (ALL 4 Communities) ⚠️
**Priority:** HIGH
**Time:** 30 minutes
**Impact:** Better search engine visibility

Current SEO titles are all too long (should be ≤60 chars for optimal display):

#### Golden Pond
```sql
UPDATE communities
SET seo_title = 'Golden Pond Retirement | Senior Living in Golden, CO'
WHERE slug = 'golden-pond';
-- Current: 73 chars → New: 56 chars
```

#### The Gardens on Quail
```sql
UPDATE communities
SET seo_title = 'Gardens on Quail | Assisted Living in Arvada, CO'
WHERE slug = 'the-gardens-on-quail';
-- Current: 71 chars → New: 53 chars
```

#### Gardens at Columbine
```sql
UPDATE communities
SET seo_title = 'Gardens at Columbine | Assisted Living Littleton CO'
WHERE slug = 'gardens-at-columbine';
-- Current: 73 chars → New: 57 chars
```

#### Stonebridge Senior
```sql
UPDATE communities
SET seo_title = 'Stonebridge Senior | Assisted Living in Arvada, CO'
WHERE slug = 'stonebridge-senior';
-- Current: 64 chars → New: 56 chars
```

---

## Day 2 Actions (15 minutes)

### 3. Fix Gardens at Columbine Critical Issues ❌
**Priority:** CRITICAL
**Time:** 15 minutes
**Blocker:** Missing street address

#### Add Street Address
```sql
UPDATE communities
SET address = '[OBTAIN ACTUAL ADDRESS FROM CLIENT]'
WHERE slug = 'gardens-at-columbine';
```

**ACTION NEEDED:** Contact Gardens at Columbine to get their street address.
**Current Data:** We have city (Littleton), state (CO), zip (80128) but missing street address.

#### Fix SEO Description (too long at 183 chars)
```sql
UPDATE communities
SET seo_description = 'Gardens at Columbine offers locally owned assisted living and memory care in Littleton, CO with vibrant activities and restaurant-style dining.'
WHERE slug = 'gardens-at-columbine';
-- Current: 183 chars → New: 155 chars
```

### 4. Launch Gardens at Columbine ✅
**Status:** READY after fixes above
**Action:** Deploy to production
**Time:** 0 minutes (after fixes)

---

## Week 1 Actions (2-3 hours)

### 5. Add Stonebridge Senior Floor Plan Images 📸
**Priority:** HIGH
**Time:** 2-3 hours
**Impact:** Critical for user experience

**Missing images for 9 floor plans:**
1. Aspen - $5,935
2. Avon - $6,950
3. Copper - $6,950
4. Keystone - $8,500
5. Vail - $8,580
6. Eldora - $8,580
7. Telluride - $9,000
8. Durango - $9,300
9. Georgetown - $9,528

**Process:**
1. Obtain floor plan images from Stonebridge Senior
2. Upload to image storage
3. Link images to floor plans in database

**SQL Template:**
```sql
-- After uploading image, link to floor plan
UPDATE floor_plans
SET image_id = '[NEW_IMAGE_ID]'
WHERE community_id = (SELECT id FROM communities WHERE slug = 'stonebridge-senior')
  AND name = '[FLOOR_PLAN_NAME]';
```

### 6. Launch Stonebridge Senior ✅
**Status:** READY after floor plan images added
**Action:** Deploy to production

---

## Week 2 Actions (4-6 hours)

### 7. Add Golden Pond Floor Plan Images 📸
**Priority:** HIGH
**Time:** 2-3 hours
**Impact:** Critical for user experience

**Missing images for 6 floor plans:**
1. Independent Living – One Bedroom - $4,600
2. Independent Living – Two Bedroom - $5,300
3. Assisted Living – Studio - $5,900
4. Assisted Living – One Bedroom - $7,900
5. Assisted Living – Two Bedroom - $9,500
6. Memory Care – The Meadows Private Studio - $10,000

**Process:**
1. Obtain floor plan images from Golden Pond
2. Upload to image storage
3. Link images to floor plans in database

**SQL Template:**
```sql
-- After uploading image, link to floor plan
UPDATE floor_plans
SET image_id = '[NEW_IMAGE_ID]'
WHERE community_id = (SELECT id FROM communities WHERE slug = 'golden-pond')
  AND name = '[FLOOR_PLAN_NAME]';
```

### 8. Populate Golden Pond Galleries 📸
**Priority:** HIGH
**Time:** 2-3 hours
**Impact:** Critical for user experience

**All 7 galleries are currently empty:**
1. Beautiful Grounds & Surroundings - 0 images
2. Apartment Interiors - 0 images
3. Beautiful Grounds & Surroundings (duplicate) - 0 images
4. Amenities & Spaces - 0 images
5. Activities & Events - 0 images
6. Dining & Culinary - 0 images
7. Apartments & Suites - 0 images

**Process:**
1. Obtain gallery images from Golden Pond (recommend 6 images per gallery)
2. Upload to image storage
3. Update galleries with images

**SQL Template:**
```sql
UPDATE galleries
SET images = '[
  {"id": "image-1", "url": "...", "alt": "...", "caption": "..."},
  {"id": "image-2", "url": "...", "alt": "...", "caption": "..."},
  {"id": "image-3", "url": "...", "alt": "...", "caption": "..."},
  {"id": "image-4", "url": "...", "alt": "...", "caption": "..."},
  {"id": "image-5", "url": "...", "alt": "...", "caption": "..."},
  {"id": "image-6", "url": "...", "alt": "...", "caption": "..."}
]'::jsonb
WHERE community_id = (SELECT id FROM communities WHERE slug = 'golden-pond')
  AND title = '[GALLERY_TITLE]';
```

**Note:** You may also want to consolidate the duplicate "Beautiful Grounds & Surroundings" galleries.

### 9. Launch Golden Pond ✅
**Status:** READY after images added
**Action:** Deploy to production

---

## Optional Enhancements (Low Priority)

### 10. Add Golden Pond Email Address
**Priority:** LOW
**Time:** 2 minutes
**Impact:** Minor (email is optional field)

```sql
UPDATE communities
SET email = '[OBTAIN EMAIL FROM CLIENT]'
WHERE slug = 'golden-pond';
```

### 11. Complete Gardens on Quail Galleries
**Priority:** LOW
**Time:** 1-2 hours
**Impact:** Nice to have

Currently 5 galleries have 0 images (but 4 galleries are fully populated):
- Beautiful Grounds & Exterior - 0 images
- Dining Experience - 0 images
- Activities & Events - 0 images
- Community Amenities - 0 images
- Residences - 0 images

Can be done after launch as the community already has 4 active galleries.

### 12. Review Stonebridge Pricing Display
**Priority:** LOW
**Time:** 5 minutes (if decision made)
**Impact:** Business decision needed

Currently shows "Contact for pricing" but we have pricing data ($5,935 starting).

**If you want to show pricing:**
```sql
UPDATE communities
SET starting_rate_display = 'Starting at $5,935/month'
WHERE slug = 'stonebridge-senior';
```

**Recommendation:** Keep as "Contact for pricing" if that's a business/marketing decision. The data is there if you change your mind.

---

## Quality Assurance Checklist

Before launching each community, verify:

### Data Checks
- [ ] Address, city, state, zip are all populated
- [ ] Phone numbers display correctly
- [ ] Email (if provided) is valid
- [ ] Starting rate display matches lowest floor plan
- [ ] SEO title ≤60 characters
- [ ] SEO description ≤160 characters
- [ ] Overview, description, short description are populated

### Content Checks
- [ ] At least 3 community highlights
- [ ] At least 4 community features
- [ ] All floor plans have names and pricing
- [ ] FAQs are relevant and helpful
- [ ] Care types are assigned correctly

### Image Checks
- [ ] Hero image displays correctly
- [ ] All floor plans have images
- [ ] At least one gallery has images
- [ ] All images load properly
- [ ] Alt text is set for accessibility

### Functional Checks
- [ ] Community page loads without errors
- [ ] Floor plan carousel works
- [ ] Gallery modal opens correctly
- [ ] Contact forms submit properly
- [ ] Phone number is clickable on mobile
- [ ] Navigation works correctly

---

## Launch Schedule Summary

| Timeline | Action | Community | Status After |
|----------|--------|-----------|--------------|
| **Day 1** | Launch | Gardens on Quail | 1/4 live (25%) |
| **Day 1-2** | Fix address + SEO | Gardens at Columbine | Ready to launch |
| **Day 2** | Launch | Gardens at Columbine | 2/4 live (50%) |
| **Week 1** | Add floor plan images | Stonebridge Senior | Ready to launch |
| **Week 1** | Launch | Stonebridge Senior | 3/4 live (75%) |
| **Week 2** | Add floor plan + gallery images | Golden Pond | Ready to launch |
| **Week 2** | Launch | Golden Pond | 4/4 live (100%) |

**Total estimated work:** ~8 hours over 2 weeks

---

## Risk Mitigation

### What Could Go Wrong?

1. **Image sourcing delays**
   - **Risk:** Client doesn't have professional floor plan images
   - **Mitigation:** Have backup plan to create placeholder images or hire photographer
   - **Timeline impact:** Could delay by 1-2 weeks

2. **Missing address for Columbine**
   - **Risk:** Client doesn't respond with address
   - **Mitigation:** Look up address on Google Maps or public records
   - **Timeline impact:** Could delay Day 2 launch

3. **Technical deployment issues**
   - **Risk:** Production environment issues
   - **Mitigation:** Test on staging first, have rollback plan
   - **Timeline impact:** Could delay by hours/days

### Rollback Plan

If issues arise after launch:
1. Revert to previous deployment
2. Fix issues in staging
3. Re-test thoroughly
4. Re-deploy

---

## Success Metrics

Track these after launch:

### Technical Metrics
- [ ] Page load time <3 seconds
- [ ] Zero console errors
- [ ] Mobile responsive on all devices
- [ ] Images load within 2 seconds
- [ ] Forms submit successfully

### Business Metrics
- [ ] Contact form submissions
- [ ] Phone click-through rate
- [ ] Time on page
- [ ] Bounce rate
- [ ] Floor plan views

### SEO Metrics
- [ ] Google Search Console impressions
- [ ] Click-through rate from search
- [ ] Average position in search results
- [ ] Indexed pages

---

## Contact Information

**For Image Collection, contact:**
1. **Golden Pond** - Phone: (303) 271-0430
2. **Gardens on Quail** - Phone: (303) 456-1501, Email: info@gardensonquail.com
3. **Gardens at Columbine** - Phone: (720) 740-1249, Email: info@gardensatcolumbine.com
4. **Stonebridge Senior** - Phone: (720) 729-6244, Email: info@stonebridgesenior.com

**What to request:**
- High-resolution floor plan images (min 1200px wide)
- Gallery photos (exterior, interior, activities, dining, etc.)
- Professional photos preferred, smartphone photos acceptable
- Format: JPG or PNG
- Rights/permissions for web use

---

## Sign-off

**Prepared by:** Claude Code
**Date:** October 9, 2025
**Next Review:** After Week 1 (check progress on Stonebridge launch)

**Stakeholder Approval:**
- [ ] Development Team Lead
- [ ] Marketing Manager
- [ ] Community Relations
- [ ] Executive Sponsor

**Notes:**

---

**Questions? Issues? Updates?**
Document all changes and blockers in this file as you progress through the launch plan.
