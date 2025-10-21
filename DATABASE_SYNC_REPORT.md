# Database Sync Report

Date: October 21, 2025

## Summary

This report documents the database synchronization between development and production environments, including blog post migration and HTML formatting fixes.

---

## 1. Blog Posts Synchronized

### Issue
The "October 25 Newsletter" and 30 other newsletter posts existed in the development database but were missing from production.

### Solution
Created `scripts/sync-blog-posts-to-prod.ts` to sync all blog posts from development to production.

### Results
- ✅ **31 new blog posts** inserted into production
- ✅ **96 existing blog posts** updated in production
- ✅ **127 total blog posts** now in production (matching development)
- ✅ **32 newsletter posts** synchronized

### Fixed Issues
- Fixed JSONB data type handling for `tags` and `gallery_images` fields
- Implemented UPSERT logic to prevent duplicates

---

## 2. HTML Formatting Fixed

### Issue
Blog post content was stored as plain text without HTML tags, causing all text to bunch together when displayed on the website.

### Root Cause
The newsletter import script (`scripts/import-newsletters-and-calendars.ts`) was stripping HTML tags using `cheerio.text()` during import.

### Solution
Created `scripts/convert-blog-posts-to-html.ts` to convert plain text content to properly formatted HTML with:
- Paragraph tags (`<p>`)
- Header tags (`<h2>`, `<h3>`)
- Line breaks (`<br>`)
- Lists (`<ul>`, `<li>`)

### Results
- ✅ **57 blog posts** converted to HTML in development
- ✅ **57 blog posts** converted to HTML in production
- ✅ **70 posts** already had HTML (skipped)

---

## 3. Database Comparison

### Tables with Differences

#### Production has MORE records:
- **images**: 382 more records in production (Dev: 183, Prod: 565)
- **gallery_images**: 78 more in production (Dev: 15, Prod: 93)
- **communities_amenities**: 32 more in production (Dev: 44, Prod: 76)
- **floor_plan_images**: 63 more in production (Dev: 19, Prod: 82)
- **post_attachments**: 23 more in production (Dev: 10, Prod: 33)
- **posts**: 32 more in production (Dev: 13, Prod: 45)
- **testimonials**: 10 more in production (Dev: 8, Prod: 18)
- **communities_care_types**: 7 more in production (Dev: 2, Prod: 9)
- **floor_plans**: 2 more in production (Dev: 24, Prod: 26)

#### Development has MORE records:
- **session**: 12 more in dev (expected - different login sessions)
- **page_content_sections**: 7 more in dev (Dev: 72, Prod: 65)
- **community_features**: 4 more in dev (Dev: 15, Prod: 11)
- **community_highlights**: 3 more in dev (Dev: 13, Prod: 10)
- **galleries**: 3 more in dev (Dev: 19, Prod: 16)

### Recommendation
The differences suggest that both databases have been updated independently:
- Production has more images, gallery images, and floor plans (possibly from production uploads)
- Development has more community features and highlights (possibly from recent updates)

Consider syncing specific tables based on which environment has the "source of truth" for each type of data.

---

## 4. Scripts Created

### Sync Scripts
- **`scripts/sync-blog-posts-to-prod.ts`** - Syncs blog posts from dev to prod with UPSERT
- **`scripts/compare-databases.ts`** - Compares record counts across all tables

### Formatting Scripts
- **`scripts/convert-blog-posts-to-html.ts`** - Converts plain text blog content to HTML

### Debug Scripts
- **`scripts/debug-sync.ts`** (deleted) - Used for debugging JSONB issues

---

## 5. Verification

### Blog Posts in Production
```sql
-- Newsletters
SELECT COUNT(*) FROM blog_posts WHERE category = 'Newsletter';
-- Result: 32

-- Specific post
SELECT slug, title, published FROM blog_posts WHERE slug = 'october-25-newsletter';
-- Result: october-25-newsletter | October 25 Newsletter | t

-- Total posts
SELECT COUNT(*) FROM blog_posts;
-- Result: 127
```

### HTML Formatting Verification
```sql
-- Check October 25 Newsletter has HTML
SELECT substring(content, 1, 100) FROM blog_posts WHERE slug = 'october-25-newsletter';
-- Result: <p>At Stonebridge Senior Living, fall is more than just a season—it's a celebration...
```

---

## 6. Next Steps

### Recommended Actions
1. **Monitor Production**: Verify that /blog/october-25-newsletter displays correctly
2. **Review Other Differences**: Decide which environment is the source of truth for:
   - Community features and highlights
   - Page content sections
   - Gallery images and floor plan images
3. **Future Imports**: Update import scripts to preserve HTML formatting instead of stripping it

### Optional Syncs
If you want to sync other data:
- Use `scripts/compare-databases.ts` to identify specific differences
- Create targeted sync scripts for specific tables
- Always backup before syncing to production

---

## Technical Details

### Database URLs Used
- **Development**: `ep-royal-mouse-afvhqvpe.c-2.us-west-2.aws.neon.tech`
- **Production**: `ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech`

### JSONB Handling
JSONB fields (`tags`, `gallery_images`) required explicit JSON.stringify() when inserting via the PostgreSQL driver to avoid "invalid input syntax for type json" errors.

### HTML Conversion Logic
The conversion script identifies plain text by checking for absence of HTML tags and applies:
- Emoji headers → `<h2>` tags
- Lines ending with colons → `<h3>` tags
- Double line breaks → paragraph breaks
- Bullet points and numbered lists → `<ul>`/`<li>` tags
