# Gardens on Quail Gallery Import Guide

This guide explains how to import gallery images from the existing Gardens on Quail website into your image database.

## Overview

We've created a set of scripts to help you organize and import the 59 images from the existing photo gallery at https://www.gardensonquail.com/our-community/photo-gallery into your database.

## What Was Done

### 1. Image Discovery ✅

We scanned the existing gallery and found **59 images** organized into the following categories:

- **Beautiful Grounds & Exterior** (21 images) - Aerial views, courtyard, gardens
- **Dining Experience** (6 images) - Dining rooms, meals, chef
- **Activities & Events** (7 images) - Residents enjoying activities, events
- **Community Amenities** (3 images) - Library, salon, chapel
- **Residences** (7 images) - Apartment photos and floor plans
- **General Gallery** (15 images) - Miscellaneous images (will be skipped)

### 2. Generated Import Data ✅

The discovered images have been organized into `goq-gallery-import-data.ts` with:
- Proper categorization
- Alt text/captions from the website
- Organized by gallery sections
- Hero gallery marked (Beautiful Grounds & Exterior)

### 3. Import Scripts Created ✅

Three scripts are available:

#### `scripts/discover-goq-images.ts`
Scans the gallery page and extracts all images with categorization.
```bash
npx tsx scripts/discover-goq-images.ts
```
This generates:
- `goq-gallery-import-data.ts` - TypeScript import data
- `goq-gallery-images.json` - JSON version for reference

#### `scripts/final-import-goq-gallery.ts` ⭐ **MAIN IMPORT SCRIPT**
Imports all organized galleries and images into your database.
```bash
npx tsx scripts/final-import-goq-gallery.ts
```

#### `scripts/import-goq-gallery-manual.ts`
Template for manual imports if you want to customize the data.

## How to Import

### Step 1: Review the Discovered Images

Check the generated files:
- `goq-gallery-import-data.ts` - See all images organized by category
- `goq-gallery-images.json` - JSON format for easy review

### Step 2: (Optional) Customize the Data

If you want to:
- Change gallery names
- Recategorize images
- Update alt text/captions
- Remove unwanted images

Edit `goq-gallery-import-data.ts` before importing.

### Step 3: Run the Import

```bash
npx tsx scripts/final-import-goq-gallery.ts
```

This will:
1. Find the "The Gardens on Quail" community in your database
2. Create 6 gallery categories (skips "General Gallery")
3. Create image records for each photo
4. Link images to their respective galleries
5. Set proper sort orders and captions

### Step 4: Verify in Admin Panel

After import, check your admin panel:
```
https://your-domain.com/admin/galleries
```

You should see:
- ✅ Beautiful Grounds & Exterior (21 images) - marked as hero
- ✅ Dining Experience (6 images)
- ✅ Activities & Events (7 images)
- ✅ Community Amenities (3 images)
- ✅ Residences (7 images)

## What Gets Imported

### Gallery Structure
Each gallery includes:
- **Title** - e.g., "Beautiful Grounds & Exterior"
- **Description** - Brief description of the gallery
- **Category** - environment, dining, activities, amenities, apartments
- **Hero flag** - The exterior gallery is marked as hero
- **Published** - All galleries are set to active and published
- **Community link** - Linked to "The Gardens on Quail"

### Image Records
Each image includes:
- **URL** - Direct link to the Webflow CDN
- **Alt text** - From the original website
- **Caption** - Same as alt text (can be customized)
- **Object key** - Marked as `remote/{uuid}` since these are external URLs
- **MIME type** - Auto-detected from URL (.webp, .jpg, .png, .svg)
- **Sort order** - Maintains original order from website

## Important Notes

⚠️ **Remote URLs**: The images are NOT downloaded to your server. They remain on the Webflow CDN (cdn.prod.website-files.com). This is fine for now, but consider:
- These URLs could break if the Webflow site is taken down
- You may want to download and re-upload to your own storage later

⚠️ **Duplicate Prevention**: The script does NOT check for existing galleries. If you run it multiple times, you'll get duplicate galleries. To re-import:
1. Delete the imported galleries from your admin panel first
2. Or modify the script to check for existing galleries

⚠️ **General Gallery Skipped**: The "General Gallery" category (15 images) contains miscellaneous images and is automatically skipped. Review these if needed.

## Next Steps

### Optional: Download and Re-upload Images

If you want to host the images yourself instead of relying on Webflow CDN:

1. Create a download script:
```typescript
// Download each image from the URL
// Upload to your S3/storage service
// Update the image record with new URL
```

2. Or use the admin panel to:
- View each image
- Download it manually
- Upload through the Image Uploader
- Replace the remote URL

### Optional: Enhance Image Metadata

You can enhance the imported images by:
- Adding actual width/height dimensions
- Adding file size information
- Creating image variants (thumbnails, etc.)
- Improving alt text for SEO and accessibility

## Files Reference

- `scripts/discover-goq-images.ts` - Discovery tool
- `scripts/final-import-goq-gallery.ts` - **Main import script**
- `scripts/import-goq-gallery-manual.ts` - Manual import template
- `scripts/import-goq-gallery-images.ts` - Auto-scraper (advanced)
- `goq-gallery-import-data.ts` - Generated import data
- `goq-gallery-images.json` - JSON reference

## Troubleshooting

### "Community not found"
Make sure the community slug is exactly `the-gardens-on-quail` in your database.

### Import fails halfway through
The script will continue processing other galleries even if one fails. Check the error message and verify your database connection.

### Duplicate galleries
Delete the imported galleries from the admin panel before re-running the import.

### Want to customize before import?
Edit `goq-gallery-import-data.ts` and adjust the gallery data as needed.

## Summary

You now have:
✅ 59 images discovered and categorized
✅ Import data file ready to use
✅ Import script ready to run
✅ Documentation for the process

Simply run:
```bash
npx tsx scripts/final-import-goq-gallery.ts
```

And all your galleries will be populated! 🎉
