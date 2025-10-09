# Floor Plan Image Verification Report

**Generated:** October 9, 2025
**Purpose:** Verification and reporting of floor plan image coverage across all communities

---

## Executive Summary

This report analyzes the image coverage for all active floor plans across the 4 active communities in the database. **No fixes were made** - this is a verification and reporting task only.

### Key Findings

- **Total Active Floor Plans:** 29
- **Floor Plans with Images:** 14 (48.3%)
- **Floor Plans Missing Images:** 15 (51.7%)
- **Broken Image References:** 0 (0.0%)
- **Using Legacy imageUrl Field:** 0 (0.0%)

**CRITICAL:** Over half (51.7%) of all floor plans are missing images.

---

## Statistics by Community

### 1. The Gardens on Quail ✅
- **Total Floor Plans:** 5
- **Has Image:** 5 (100.0%)
- **Missing Images:** 0 (0.0%)
- **Status:** COMPLETE - All floor plans have images

### 2. The Gardens at Columbine ✅
- **Total Floor Plans:** 9
- **Has Image:** 9 (100.0%)
- **Missing Images:** 0 (0.0%)
- **Status:** COMPLETE - All floor plans have images

### 3. Stonebridge Senior ⚠️
- **Total Floor Plans:** 9
- **Has Image:** 0 (0.0%)
- **Missing Images:** 9 (100.0%)
- **Status:** CRITICAL - NO floor plans have images

### 4. Golden Pond Retirement Community ⚠️
- **Total Floor Plans:** 6
- **Has Image:** 0 (0.0%)
- **Missing Images:** 6 (100.0%)
- **Status:** CRITICAL - NO floor plans have images

---

## Floor Plans Requiring Attention (15 Total)

### Stonebridge Senior (9 floor plans missing images)

**Assisted Living (6 plans):**
1. Aspen
2. Copper
3. Avon
4. Eldora
5. Vail
6. Georgetown

**Memory Care – The Meadows (3 plans):**
7. Keystone
8. Telluride
9. Durango

### Golden Pond Retirement Community (6 floor plans missing images)

**Independent Living (2 plans):**
1. Independent Living – One Bedroom
2. Independent Living – Two Bedroom

**Assisted Living (3 plans):**
3. Assisted Living – Studio
4. Assisted Living – One Bedroom
5. Assisted Living – Two Bedroom

**Memory Care – The Meadows (1 plan):**
6. Memory Care – The Meadows Private Studio

---

## Technical Details

### Database Schema Analysis

The `floor_plans` table has two image-related fields:
- `imageId` (varchar) - References the `images` table (current/preferred method)
- `imageUrl` (text) - Legacy field for direct URL storage (deprecated)

### Image Storage Methods

**Current Method (Preferred):**
- Images stored in the `images` table with proper metadata
- Floor plans reference images via `imageId` foreign key
- Additional images can be stored in the `floor_plan_images` junction table

**Legacy Method:**
- Direct URL storage in the `imageUrl` field
- **Finding:** NO floor plans are currently using this legacy method

### Verification Process

The verification script checked:
1. All active floor plans in active communities
2. Whether `imageId` field is populated
3. Whether the referenced image exists in the `images` table
4. Whether any floor plans use the legacy `imageUrl` field
5. Additional images in the `floor_plan_images` junction table

### Image Reference Integrity

**Good News:** No broken references were found. All floor plans that have an `imageId` point to valid images in the `images` table.

---

## Detailed Floor Plan List

### The Gardens on Quail (5/5 with images)

1. **Memory Care - Private Suite** ✅
   - Care Type: Memory Care – The Meadows
   - Total Images: 2 (Main: 1, Additional: 1)

2. **Memory Care - One Bedroom** ✅
   - Care Type: Memory Care – The Meadows
   - Total Images: 4 (Main: 1, Additional: 3)

3. **Memory Care - Two Bedroom Jack & Jill** ✅
   - Care Type: Memory Care – The Meadows
   - Total Images: 1 (Main: 1, Additional: 0)

4. **Assisted Living - Private Suite** ✅
   - Care Type: Assisted Living
   - Total Images: 3 (Main: 1, Additional: 2)

5. **Assisted Living - Two Bedroom Jack & Jill** ✅
   - Care Type: Assisted Living
   - Total Images: 1 (Main: 1, Additional: 0)

### The Gardens at Columbine (9/9 with images)

1. **Memory Care - Aspen Suite** ✅
   - Care Type: Memory Care – The Meadows
   - Total Images: 1

2. **Memory Care - Blue Spruce Suite** ✅
   - Care Type: Memory Care – The Meadows
   - Total Images: 1

3. **Assisted Living - Studio Bath** ✅
   - Care Type: Assisted Living
   - Total Images: 3 (Main: 1, Additional: 2)

4. **Assisted Living - Standard One Bedroom** ✅
   - Care Type: Assisted Living
   - Total Images: 3 (Main: 1, Additional: 2)

5. **Assisted Living - Deluxe One Bedroom** ✅
   - Care Type: Assisted Living
   - Total Images: 3 (Main: 1, Additional: 2)

6. **Assisted Living - Two Bedroom, One Bath** ✅
   - Care Type: Assisted Living
   - Total Images: 1

7. **Memory Care - Conifer Suite** ✅
   - Care Type: Memory Care – The Meadows
   - Total Images: 1

8. **Memory Care - Evergreen Suite** ✅
   - Care Type: Memory Care – The Meadows
   - Total Images: 1

9. **Memory Care - Douglas Fir Suite** ✅
   - Care Type: Memory Care – The Meadows
   - Total Images: 1

### Stonebridge Senior (0/9 with images)

All 9 floor plans are missing images:
1. **Aspen** ❌ (Assisted Living)
2. **Copper** ❌ (Assisted Living)
3. **Avon** ❌ (Assisted Living)
4. **Eldora** ❌ (Assisted Living)
5. **Vail** ❌ (Assisted Living)
6. **Georgetown** ❌ (Assisted Living)
7. **Keystone** ❌ (Memory Care – The Meadows)
8. **Telluride** ❌ (Memory Care – The Meadows)
9. **Durango** ❌ (Memory Care – The Meadows)

### Golden Pond Retirement Community (0/6 with images)

All 6 floor plans are missing images:
1. **Independent Living – One Bedroom** ❌ (Independent Living)
2. **Independent Living – Two Bedroom** ❌ (Independent Living)
3. **Assisted Living – Studio** ❌ (Assisted Living)
4. **Assisted Living – One Bedroom** ❌ (Assisted Living)
5. **Assisted Living – Two Bedroom** ❌ (Assisted Living)
6. **Memory Care – The Meadows Private Studio** ❌ (Memory Care – The Meadows)

---

## Recommendations

### Immediate Action Required

1. **Stonebridge Senior:** Upload images for all 9 floor plans
   - Priority: HIGH (0% coverage)
   - Affects: Assisted Living (6) and Memory Care (3)

2. **Golden Pond Retirement Community:** Upload images for all 6 floor plans
   - Priority: HIGH (0% coverage)
   - Affects: Independent Living (2), Assisted Living (3), and Memory Care (1)

### Next Steps

1. **Source Images:** Locate or create floor plan images for the 15 missing plans
2. **Upload Process:** Use the admin interface to upload images to the `images` table
3. **Link Images:** Update the `floor_plans` table to set the `imageId` field for each plan
4. **Verification:** Re-run the verification script to confirm 100% coverage

### Maintenance

- **Regular Audits:** Run this verification script quarterly to ensure all floor plans have images
- **New Floor Plans:** Ensure images are uploaded when creating new floor plans
- **Image Quality:** Consider reviewing image quality and consistency across all floor plans

---

## Files

- **Verification Script:** `/home/runner/workspace/verify-floor-plan-images.ts`
- **Full Report Output:** `/home/runner/workspace/floor-plan-verification-report.txt`
- **This Summary:** `/home/runner/workspace/FLOOR_PLAN_IMAGE_REPORT.md`

---

## How to Run Verification Again

```bash
npx tsx verify-floor-plan-images.ts
```

Or save to a file:
```bash
npx tsx verify-floor-plan-images.ts > floor-plan-verification-report.txt 2>&1
```

---

**Report End**
