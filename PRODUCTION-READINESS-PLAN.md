# Production Readiness Plan
## Stage Senior Living Communities Platform

**Date:** October 9, 2025
**Status:** Planning Phase

---

## 🎯 Goal
Launch a complete, accurate, and polished production website with all 4 communities fully populated with content, images, accurate pricing, and proper functionality.

---

## 📊 Current State Assessment

### Communities Overview

| Community | Floor Plans | FAQs | Features | Highlights | Galleries | Hero Image |
|-----------|-------------|------|----------|------------|-----------|------------|
| Golden Pond | 10 | 22 | 6 | 9 | 7 | ❌ No |
| Gardens on Quail | 5 | 11 | 0 | 0 | 4 | ❌ No |
| Gardens at Columbine | 9 | 16 | 7 | 6 | 4 | ❌ No |
| Stonebridge Senior | 9 | 15 | 4 | 3 | 4 | ❌ No |

### Issues Identified
1. ❌ No hero images for any community
2. ⚠️ Golden Pond: Old phone number still showing in some queries
3. ⚠️ Golden Pond: Old starting rate ($5,000 vs $4,600)
4. ⚠️ Golden Pond: Incorrect floor plan count (10 vs 6 expected)
5. ❌ Gardens on Quail: Missing features and highlights
6. ⚠️ Inconsistent pricing formats across communities
7. ❌ Gardens on Quail gallery: 59 images need to be imported

---

## 🚀 Recommended Approach

### Phase 1: Data Cleanup & Verification (Priority: HIGH)
**Timeline:** 1-2 days

#### Step 1.1: Fix Golden Pond Data Issues
- [ ] Investigate why old data showing (possible cache?)
- [ ] Verify database has correct phone: (303) 271-0430
- [ ] Verify starting rate: $4,600/month
- [ ] Check floor plan count (should be 6, showing 10)
- [ ] Run update script again if needed

#### Step 1.2: Complete Gardens on Quail Content
- [ ] Add community features (4 sections)
- [ ] Add community highlights (3 items)
- [ ] Import gallery images (59 images organized into 5 categories)
- [ ] Verify floor plans and pricing
- [ ] Update phone number to (720) 832-9670

#### Step 1.3: Audit All Pricing
- [ ] Create pricing verification checklist
- [ ] Cross-reference with source documents
- [ ] Update any incorrect rates
- [ ] Ensure consistent format (e.g., "$4,600/month" not "Starting at $4,600/month")

### Phase 2: Image Strategy (Priority: HIGH)
**Timeline:** 2-3 days

#### Step 2.1: Hero Images
**Options:**
1. **Use existing gallery images** - Pick best image from each community's gallery
2. **Get from existing websites** - Scrape current hero images
3. **Professional photos** - Schedule photo shoots (slower)

**Recommendation:** Start with Option 1 or 2 for quick launch

#### Step 2.2: Floor Plan Images
- [ ] Gardens on Quail: Import existing floor plan images
- [ ] Golden Pond: Verify all 6 floor plans have images
- [ ] Gardens at Columbine: Check all 9 floor plans
- [ ] Stonebridge: Check all 9 floor plans

#### Step 2.3: Gallery Images
- [ ] **Gardens on Quail:** Run import script (59 images ready)
- [ ] Golden Pond: Verify 7 galleries have images
- [ ] Gardens at Columbine: Verify 4 galleries
- [ ] Stonebridge: Verify 4 galleries

### Phase 3: Content Completeness (Priority: MEDIUM)
**Timeline:** 2-3 days

#### Step 3.1: Standardize "Experience the Difference" Features
All communities should have 4 features:
- [ ] Golden Pond: ✅ Complete (4 features)
- [ ] Gardens on Quail: ❌ Add 4 features
- [ ] Gardens at Columbine: ⚠️ Verify (shows 7, should have 4 core)
- [ ] Stonebridge: ✅ Complete (4 features)

#### Step 3.2: Standardize Highlights
All communities should have 3 highlights:
- [ ] Golden Pond: ⚠️ Showing 9, should verify structure
- [ ] Gardens on Quail: ❌ Add 3 highlights
- [ ] Gardens at Columbine: ⚠️ Showing 6, should verify
- [ ] Stonebridge: ✅ Complete (3 highlights)

#### Step 3.3: FAQ Quality Check
- [ ] Ensure mobile-friendly formatting
- [ ] Check for duplicate questions
- [ ] Verify answers are complete and accurate
- [ ] Categorize properly

### Phase 4: Technical & SEO (Priority: MEDIUM)
**Timeline:** 1 day

- [ ] Verify all community slugs work
- [ ] Check SEO titles and descriptions
- [ ] Test mobile responsiveness
- [ ] Verify contact forms work
- [ ] Test phone number links (tel:)
- [ ] Check map integration
- [ ] Test floor plan modals
- [ ] Verify gallery lightbox functionality

### Phase 5: Final QA & Launch (Priority: HIGH)
**Timeline:** 1-2 days

- [ ] Create QA checklist for each community
- [ ] Test all user journeys (browse → view → contact)
- [ ] Verify pricing accuracy one final time
- [ ] Check all images load properly
- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Run accessibility checks
- [ ] Performance optimization
- [ ] Final stakeholder review
- [ ] Deploy to production

---

## 📋 Detailed Action Items

### Immediate Actions (Today)
1. ✅ **Verify Golden Pond database update**
2. 🔄 **Run Gardens on Quail gallery import**
3. 📝 **Create pricing master document**
4. 🎨 **Select/upload hero images for all 4 communities**

### Short-term (This Week)
1. Complete Gardens on Quail features/highlights
2. Import all gallery images
3. Verify all floor plan images
4. Audit and fix pricing discrepancies
5. Standardize content structure across communities

### Before Launch
1. Full QA testing
2. Stakeholder approval
3. Content freeze
4. Performance check
5. SEO verification

---

## 🛠️ Tools & Scripts Available

### Existing Scripts
- ✅ `scripts/update-golden-pond.ts` - Golden Pond data update
- ✅ `scripts/final-import-goq-gallery.ts` - Gardens on Quail gallery import
- ✅ `scripts/discover-goq-images.ts` - Image discovery tool

### Scripts Needed
- [ ] Pricing verification script
- [ ] Image audit script
- [ ] Content completeness checker
- [ ] Hero image uploader
- [ ] Batch data verification script

---

## 📊 Success Criteria

### Must-Have (Launch Blockers)
- ✅ All 4 communities have accurate pricing
- ✅ All communities have hero images
- ✅ All floor plans have images and correct pricing
- ✅ Contact information (phone, email) is correct
- ✅ All pages are mobile-responsive
- ✅ No broken images or links

### Should-Have
- ✅ All communities have 4 features
- ✅ All communities have 3 highlights
- ✅ All galleries have at least 12-20 images
- ✅ All FAQs are comprehensive and categorized
- ✅ SEO is optimized

### Nice-to-Have
- Team member profiles
- Blog posts
- Events calendar
- Virtual tours
- Video content

---

## 🎬 Recommended Execution Plan

### Option A: Sequential (Safer, Slower)
**Timeline: 7-10 days**
1. Fix Golden Pond completely (1-2 days)
2. Complete Gardens on Quail (2-3 days)
3. Audit Gardens at Columbine (1-2 days)
4. Audit Stonebridge (1-2 days)
5. Final QA and launch (1-2 days)

### Option B: Parallel (Faster, More Work)
**Timeline: 4-6 days**
1. **Day 1-2:**
   - Fix all pricing across all communities
   - Upload all hero images

2. **Day 2-3:**
   - Import Gardens on Quail gallery
   - Complete Gardens on Quail features/highlights
   - Verify all floor plan images

3. **Day 3-4:**
   - Content standardization across all communities
   - FAQ cleanup

4. **Day 4-5:**
   - Full QA testing
   - Bug fixes

5. **Day 5-6:**
   - Final review and launch

### Option C: MVP Launch (Fastest)
**Timeline: 2-3 days**
1. **Day 1:**
   - Fix critical pricing errors
   - Add temporary hero images
   - Ensure basic functionality works

2. **Day 2:**
   - Import Gardens on Quail gallery
   - Complete missing features/highlights
   - QA testing

3. **Day 3:**
   - Final review
   - Soft launch
   - Continue improving post-launch

---

## 💡 My Recommendation

**Go with Option B: Parallel Approach**

**Why:**
- Balances speed with quality
- 4-6 day timeline is reasonable
- Allows thorough testing
- All critical issues addressed
- Content will be polished

**Starting Point:**
1. Fix Golden Pond database issues (verify what happened)
2. Import Gardens on Quail gallery (script is ready)
3. Create a pricing master spreadsheet
4. Upload hero images from existing websites

**Next Steps - Let me:**
1. Investigate Golden Pond database issue
2. Run Gardens on Quail gallery import
3. Create a pricing verification script
4. Generate a hero image collection plan

Would you like me to start with any specific community or task?

---

## 📞 Questions to Resolve

1. **Pricing:** Do you have the most current pricing sheets for all communities?
2. **Images:** Should we use images from existing websites or do you have a photo library?
3. **Priority:** Which community is most important to launch first?
4. **Timeline:** What's your ideal launch date?
5. **Content:** Do you have any additional content (videos, brochures, etc.)?

---

**Let's get your communities production-ready! Which approach would you like to take?**
