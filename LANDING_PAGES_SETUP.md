# Landing Page Templates - Production Setup Guide

## Problem
Landing page templates exist in the development database but are missing from production. This causes the admin interface's "Landing Pages" tab to appear empty even though the UI and API are properly configured.

## Solution
Use the seed script to import all 37 landing page templates into your production database.

## Files Created
1. **`seed-landing-pages.cjs`** - Node.js script to seed landing page templates
2. **`landing-templates.json`** - JSON export of all 37 landing page templates
3. **`LANDING_PAGES_SETUP.md`** - This documentation file

## Templates Included (37 total)

### General Templates (6)
- `/assisted-living` - Colorado Assisted Living
- `/memory-care` - Colorado Memory Care
- `/independent-living` - Colorado Independent Living
- Location-specific general pages

### City-Specific Templates (10)
- `/assisted-living/:city` - Assisted Living by city
- `/memory-care/:city` - Memory Care by city
- `/independent-living/:city` - Independent Living by city
- `/senior-living/:city` - General Senior Living by city
- `/best-assisted-living/:city` - Best rated by city
- `/best-memory-care/:city` - Best memory care by city
- `/dementia-care/:city` - Dementia care by city
- `/alzheimers-care/:city` - Alzheimer's care by city
- And more...

### Community-Specific Templates (4)
- `/gardens-at-columbine-littleton` - Gardens at Columbine
- `/gardens-on-quail-arvada` - Gardens on Quail
- `/golden-pond-retirement` - Golden Pond
- `/stonebridge-senior-arvada` - Stonebridge Senior

### Stonebridge-Specific Templates (17)
- Specific landing pages for Stonebridge community with various care types and cities

## How to Run in Production

### Option 1: Using Replit (Recommended)
1. **Upload the files to production Replit:**
   - Upload `seed-landing-pages.cjs`
   - Upload `landing-templates.json`

2. **Set the production DATABASE_URL:**
   ```bash
   export DATABASE_URL="your-production-database-url"
   ```

3. **Run the seed script:**
   ```bash
   node seed-landing-pages.cjs
   ```

4. **Verify the import:**
   ```bash
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM landing_page_templates;"
   ```

### Option 2: Using psql Direct Import
If you prefer to use SQL directly:

```bash
# Copy the files to your production server
scp landing-templates.json your-server:/tmp/
scp seed-landing-pages.cjs your-server:/tmp/

# SSH into production
ssh your-server

# Run the seed script
cd /tmp
DATABASE_URL="your-production-db-url" node seed-landing-pages.cjs
```

### Option 3: Using the Replit Shell
1. Click on "Shell" in Replit
2. Upload the files using the file upload feature
3. Run: `node seed-landing-pages.cjs`

## Expected Output

```
🚀 Seeding landing page templates...
Found 37 templates to import
Current templates in database: 0
✅ Inserted "assisted-living-city"
✅ Inserted "memory-care-city"
✅ Inserted "independent-living-city"
... (all 37 templates)

============================================================
✨ Landing page template seeding complete!
============================================================
✅ Inserted: 37
⏭️  Skipped:  0
❌ Errors:   0
============================================================

Total templates in database: 37
```

## Verification Steps

After running the seed script:

1. **Check the database:**
   ```bash
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM landing_page_templates;"
   ```
   Should show: 37

2. **Check in Admin UI:**
   - Go to `/admin` in your production site
   - Click on the "Landing Pages" tab
   - You should see all 37 templates listed

3. **Test a landing page:**
   - Visit `/assisted-living/arvada` or any other URL pattern
   - The page should load with proper content and images

## Important Notes

- ✅ The script is **idempotent** - it won't create duplicates if run multiple times
- ✅ It checks for existing slugs and skips them
- ✅ All foreign key references (community_id, care_type_id) are preserved
- ⚠️  Make sure your production database has the `care_types` and `communities` tables populated first
- ⚠️  The script preserves original IDs, so relationships with other tables remain intact

## Troubleshooting

### "Database already has landing page templates"
This is just a warning. The script will skip existing templates and only insert new ones.

### Foreign key constraint errors
If you see errors about care_type_id or community_id not existing:
1. Check that care types are seeded: `SELECT * FROM care_types;`
2. Check that communities are seeded: `SELECT * FROM communities;`
3. These must exist before landing pages can reference them

### Permission errors
Make sure your DATABASE_URL has write permissions:
```bash
psql "$DATABASE_URL" -c "INSERT INTO landing_page_templates (slug, url_pattern, template_type, title, active) VALUES ('test', '/test', 'general', 'Test', true);"
```

## What This Fixes

After running this script:
- ✅ Admin interface "Landing Pages" tab will show all 37 templates
- ✅ You can edit/manage landing pages in the admin UI
- ✅ All dynamic landing page URLs will work correctly
- ✅ SEO-optimized pages for Assisted Living, Memory Care, etc. will be accessible
- ✅ Community-specific landing pages will display properly

## Next Steps

After seeding:
1. Review templates in `/admin` under "Landing Pages" tab
2. Update any content specific to your communities
3. Add hero images if desired (hero_image_id field)
4. Test various landing page URLs to ensure they load correctly
5. Check SEO tags and structured data

## Support

If you encounter issues:
1. Check the error messages in the console
2. Verify DATABASE_URL is set correctly
3. Ensure dependencies are installed: `npm install @neondatabase/serverless`
4. Review database permissions and connection settings
