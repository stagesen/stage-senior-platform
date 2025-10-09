# Production Team Data Import Guide

## Overview
This guide will help you import all 24 team members with their avatars into your production database.

## Files Needed
Upload these files to your production environment:
1. ✅ `scraped-team-data.json` - Team member data
2. ✅ `import-team-data.ts` - Import script
3. ✅ `move-team-avatars-to-public.ts` - Script to move avatars to public directory

## Step-by-Step Production Import

### Step 1: Verify Environment Variables
Ensure these are set in production:
```bash
DATABASE_URL=<your-production-database-url>
DEFAULT_OBJECT_STORAGE_BUCKET_ID=<your-production-bucket-id>
PRIVATE_OBJECT_DIR=<your-production-private-dir>
PUBLIC_OBJECT_SEARCH_PATHS=<your-production-public-path>
```

### Step 2: Run the Import Script
```bash
# This will:
# - Import all 24 team members
# - Download avatars from production websites
# - Store them initially in private directory
# - Skip existing members automatically

tsx import-team-data.ts
```

Expected output:
```
🚀 Starting team member import...
Found 24 team members to import

Processing: Jonathan Hachmeister (Managing Partner)
  Downloading avatar from: https://cdn.prod.website-files.com/...
  ✓ Stored avatar (ID: ...)
  ✓ Created team member: Jonathan Hachmeister (ID: ...)

... (continues for all members)

✅ Import complete!
   Success: 16-24 (depends on existing members)
   Errors: 0
   Total: 24
```

### Step 3: Move Avatars to Public Directory
```bash
# This fixes the broken images by moving avatars from private to public

tsx move-team-avatars-to-public.ts
```

Expected output:
```
🔧 Moving team avatar images to public directory...
Found 16 team avatar images to move

Moving: team-jonathan-hachmeister-...webp
  ✓ Now public: /bucket-id/public/team-jonathan-hachmeister-...webp

... (continues for all 16 images)

✅ Successfully moved 16/16 images to public directory
```

### Step 4: Add Community Associations
Run these SQL commands in your production database:

```sql
-- Gardens at Columbine team members
UPDATE team_members 
SET tags = tags || '["The Gardens at Columbine"]'::jsonb
WHERE slug IN ('alyssa-trujillo', 'marnie-mckissack', 'helen-rossi', 'allie-mitchem', 'matt-turk', 'rich-thomas', 'sydney-hertz');

-- Gardens on Quail team members
UPDATE team_members 
SET tags = tags || '["The Gardens on Quail"]'::jsonb
WHERE slug = 'mariah-ruell';

-- Shared team members (both Gardens at Columbine and Golden Pond)
UPDATE team_members 
SET tags = tags || '["The Gardens at Columbine", "Golden Pond"]'::jsonb
WHERE slug IN ('marci-gerke', 'bob-burden');
```

### Step 5: Verify Import
Check that everything imported correctly:

```sql
-- Count imported team members
SELECT COUNT(*) as total_team_members FROM team_members;

-- Verify avatars are in public directory
SELECT COUNT(*) as public_avatars 
FROM images 
WHERE object_key LIKE 'public/team-%';

-- Check community associations
SELECT name, role, tags 
FROM team_members 
WHERE tags::text LIKE '%Gardens%' OR tags::text LIKE '%Golden Pond%'
ORDER BY name;
```

Expected results:
- Total team members: 24+ (including any existing)
- Public avatars: 16 (newly imported)
- Community associations: 10 team members with community tags

## Troubleshooting

### Images Still Not Showing
If images are broken after Step 3:
1. Verify object storage bucket ID matches environment variable
2. Check that PUBLIC_OBJECT_SEARCH_PATHS is configured
3. Ensure the public directory is served by your asset pipeline

### Import Errors
- **"Object storage not configured"**: Set environment variables
- **"Community not found"**: Verify community slugs match your database
- **"Team member already exists"**: This is normal, the script skips duplicates

### Community Associations Not Working
Make sure community names in tags match exactly:
- "The Gardens at Columbine" (not "gardens-at-columbine")
- "The Gardens on Quail" (not "gardens-on-quail")
- "Golden Pond" (not "golden-pond")

## What Gets Imported

### Stage Management Team (10 members)
- Jonathan Hachmeister - Managing Partner
- Troy McClymonds - Managing Partner
- Jeff Ippen - Partner
- Ben Chandler - Regional Director
- Colleen Emery - Director of Operations
- Marci Gerke - Director of Memory Care Services
- Natasha Barba - Benefits Administrator
- Josh Kavinsky - Regional Maintenance Director
- Bob Burden - Regional Executive Chef
- Trevor Harwood - Digital Marketing

### The Gardens at Columbine (7 members)
- Alyssa Trujillo - Executive Director
- Marnie McKissack - Health & Wellness Director
- Helen Rossi - Director of Marketing
- Allie Mitchem - Memory Care Coordinator
- Matt Turk - Director of Staffing
- Rich Thomas - Director of Maintenance
- Sydney Hertz - Director of Life Enrichment

### The Gardens on Quail (1 member)
- Mariah Ruell - Executive Director

### Golden Pond (6 existing members already in database)
- Leigh Boney - Executive Director
- Maria Torres - Director of Life Enrichment
- Shellie Yushka - Director of Facilities
- Chaz Osen - Regional Marketing Director
- Holly Jo Eames - Staff Care Manager
- Sarah Stevenson - Director of Wellness

## Post-Import Verification

Visit these URLs to verify:
- `/team` - All team members should display with avatars
- `/team?community=The%20Gardens%20at%20Columbine` - Filtered view
- `/team/jonathan-hachmeister` - Individual profile page

All avatars should load correctly from the public storage bucket!
