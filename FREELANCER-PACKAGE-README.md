# Community Data Collection Package

## 📦 What's Included

This package contains everything needed to hire a freelancer to populate data for your 4 senior living communities and then easily import that data into your database.

### Files Created

#### 📋 Spreadsheet Templates (9 CSV files)
1. **community-data-template.csv** - Main community information (addresses, descriptions, images, colors, etc.)
2. **community-team-members-template.csv** - Staff profiles with photos and bios
3. **community-faqs-template.csv** - Frequently asked questions for each community
4. **community-galleries-template.csv** - Photo galleries with multiple images per gallery
5. **community-highlights-template.csv** - Key selling points and features
6. **community-features-template.csv** - "Experience the Difference" feature sections
7. **community-testimonials-template.csv** - Family testimonials and reviews
8. **community-floor-plans-template.csv** - Available floor plans with photos and pricing
9. **community-events-template.csv** - Upcoming events and open houses

#### 📖 Documentation
- **COMMUNITY-DATA-UPLOAD-INSTRUCTIONS.md** - Complete instructions for the freelancer
- **FREELANCER-PACKAGE-README.md** - This file (overview for you)

#### 💻 Import Script
- **scripts/import-community-data.ts** - Automated script to import completed CSVs into your database

## 🚀 How to Use

### Step 1: Prepare the Freelancer Package

Send the freelancer these files:
- All 9 CSV templates
- `COMMUNITY-DATA-UPLOAD-INSTRUCTIONS.md`

The Golden Pond row in each CSV is filled out as an example they can follow.

### Step 2: Freelancer Work

The freelancer will:
1. Research each community (Gardens at Columbine, Gardens on Quail, Stonebridge Senior)
2. Write compelling copy (descriptions, FAQs, testimonials)
3. Gather/upload images to a shared hosting service
4. Fill in all the spreadsheets with complete data
5. Return the completed CSV files to you

### Step 3: Review the Data

When you receive the completed files:
1. Open each CSV and verify completeness
2. Check that image URLs are valid
3. Ensure descriptions are unique and compelling
4. Verify contact information is accurate

### Step 4: Import to Database

Once you've reviewed and approved the data:

```bash
# Install the csv-parse dependency if not already installed
npm install

# Run the import script
npm run import:community-data
```

The script will:
- ✅ Import all community data
- ✅ Upload/process images
- ✅ Create relationships (care types, amenities)
- ✅ Handle duplicates gracefully
- ✅ Show progress as it imports

## 📊 Data Coverage

Each community will have:
- ✅ Complete profile (name, address, contact, descriptions)
- ✅ 5-10 team member profiles
- ✅ 10-15 FAQ entries
- ✅ 5-10 photo galleries (with 3-10 images each)
- ✅ 3-4 highlight cards
- ✅ 3-5 feature sections
- ✅ 5-10 testimonials
- ✅ 3-8 floor plans
- ✅ 2-5 upcoming events

**Total per community:** 30-50+ images, 50+ pieces of content

## 🎨 Image Requirements Reminder

Make sure the freelancer knows:
- Minimum 1200px wide for large images
- Professional quality (no phone snapshots)
- All images need descriptive alt text
- Photos should be of the actual communities, not stock photos
- Upload to a reliable hosting service (or provide access to your storage)

## 💰 Freelancer Budget Guidance

Estimated time for a freelancer:
- Research: 2-3 hours per community
- Writing: 3-4 hours per community (descriptions, FAQs, testimonials)
- Image sourcing/editing: 2-3 hours per community
- Data entry: 2-3 hours per community
- **Total per community: 10-12 hours**
- **Total for all 4 communities: 40-48 hours**

At $25-50/hour, budget: **$1,000 - $2,400** depending on freelancer rate and experience.

## ⚠️ Important Notes

### Before Importing

1. **Backup your database** - The import script will overwrite existing data
2. **Test on staging first** - Don't run directly on production
3. **Install dependencies** - Run `npm install` to get csv-parse
4. **Image hosting** - Decide where images will be hosted and communicate this to the freelancer

### Image Upload Function

The import script includes a placeholder for image uploading. You may need to customize the `uploadImageFromUrl()` function in `scripts/import-community-data.ts` based on your image storage solution (Cloudinary, AWS S3, etc.).

Currently it creates database records with the URLs provided, but you may want to:
- Download images and re-upload to your storage
- Process/optimize images (resize, compress)
- Generate multiple sizes for responsive images

### Care Types & Amenities

The script will automatically create care types and amenities that don't exist. Make sure the freelancer uses consistent naming:
- "Independent Living" (not "Independent" or "IL")
- "Assisted Living" (not "Assisted" or "AL")
- "Memory Care" (not "Memory" or "MC")

## 🐛 Troubleshooting

### Import fails with "Community not found"
- Make sure `community-data-template.csv` is imported first
- Check that community slugs match exactly across all files

### Images not displaying
- Verify image URLs are publicly accessible
- Check that the `uploadImageFromUrl()` function is working
- Ensure image file formats are supported (JPG, PNG, WebP)

### Duplicate entries
- The script uses `onConflictDoUpdate` to handle duplicates
- Re-running the import will update existing records
- Delete old data first if you want a clean import

### Missing dependencies
```bash
npm install csv-parse
```

## 📝 Customization

You can modify the CSV templates to:
- Add more image columns to galleries
- Add custom fields specific to your communities
- Remove fields you don't need
- Change field names (but update import script accordingly)

## ✅ Success Checklist

Before considering the project complete:

- [ ] All 4 communities have complete data in all 9 files
- [ ] No placeholder text or empty required fields
- [ ] All image URLs are valid and images load
- [ ] Contact information verified
- [ ] Descriptions are unique and compelling
- [ ] Team member bios are professional
- [ ] FAQs are helpful and accurate
- [ ] Testimonials sound authentic
- [ ] Floor plan details are accurate
- [ ] Import script runs without errors
- [ ] Data displays correctly on the website

## 🎯 Next Steps

After successful import:
1. Review each community page on your website
2. Test all image galleries
3. Verify contact forms work
4. Check SEO metadata
5. Test mobile responsiveness
6. Get stakeholder approval
7. Launch! 🚀

## 📞 Questions?

If you run into issues:
1. Check the import script console output for specific errors
2. Verify CSV files are properly formatted (no extra commas, quotes balanced)
3. Test with just one community first to debug
4. Check database logs for constraint violations

Good luck with your community data population project!
