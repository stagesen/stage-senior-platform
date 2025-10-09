# Team Member Data Import Guide

This guide explains how to import team member data scraped from the production websites into the database.

## Files Created

1. **scraped-team-data.json** - Contains structured team member data scraped from:
   - stagesenior.com
   - gardensonquail.com
   - gardensatcolumbine.com
   - goldenpond.com

2. **import-team-data.ts** - TypeScript script that imports the data into the database

## What the Import Does

The import script:
- ✅ Downloads avatar images from external URLs
- ✅ Optimizes and stores images in object storage  
- ✅ Matches community slugs to database IDs
- ✅ Creates team member records with all associations
- ✅ Handles duplicate checking (skips existing members)
- ✅ Provides detailed progress logging

## Team Members Found

### Stage Senior Management (10 members)
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

### The Gardens at Columbine (9 members)
- Alyssa Trujillo - Executive Director
- Marnie McKissack - Health & Wellness Director
- Helen Rossi - Director of Marketing
- Marci Gerke - Regional Director of Memory Care Services
- Allie Mitchem - Memory Care Coordinator
- Bob Burden - Regional Executive Chef
- Matt Turk - Director of Staffing
- Rich Thomas - Director of Maintenance
- Sydney Hertz - Director of Life Enrichment

### The Gardens on Quail (1 member)
- Mariah Ruell - Executive Director

### Golden Pond (8 members)
- Leigh Boney - Executive Director
- Marci Gerke - Director Of Memory Care Services
- Maria Torres - Director of Life Enrichment
- Shellie Yushka - Director of Facilities
- Chaz Osen - Regional Marketing Director
- Holly Jo Eames - Staff Care Manager
- Bob Burden - Chef
- Sarah Stevenson - Director of Wellness

**Total: 24 unique team members**

## Prerequisites

Before running the import script:

1. ✅ Database connection must be configured
2. ✅ Object storage must be set up (DEFAULT_OBJECT_STORAGE_BUCKET_ID and PRIVATE_OBJECT_DIR env vars)
3. ✅ Communities must exist in the database with the correct slugs:
   - `the-gardens-at-columbine`
   - `the-gardens-on-quail`  
   - `golden-pond`
   - `stonebridge-senior` (if applicable)

## How to Run the Import

### Development Environment

```bash
# Run the import script
tsx import-team-data.ts
```

### Production Environment

1. **Upload the files to production:**
   ```bash
   # Copy these files to your production environment
   - scraped-team-data.json
   - import-team-data.ts
   ```

2. **Ensure environment variables are set:**
   ```bash
   # Required environment variables
   DATABASE_URL=<your-production-db-url>
   DEFAULT_OBJECT_STORAGE_BUCKET_ID=<bucket-id>
   PRIVATE_OBJECT_DIR=<private-dir-path>
   ```

3. **Run the import:**
   ```bash
   tsx import-team-data.ts
   ```

## Output Example

```
🚀 Starting team member import...

Found 24 team members to import

Processing: Jonathan Hachmeister (Managing Partner)
  Downloading avatar from: https://cdn.prod.website-files.com/...
  ✓ Stored avatar (ID: uuid-here)
  ✓ Created team member: Jonathan Hachmeister (ID: uuid-here)

Processing: Alyssa Trujillo (Executive Director)
  Downloading avatar from: https://cdn.prod.website-files.com/...
  ✓ Stored avatar (ID: uuid-here)
  ✓ Created team member: Alyssa Trujillo (ID: uuid-here)
    - Associated with 1 communities

...

==================================================

✅ Import complete!
   Success: 24
   Errors: 0
   Total: 24
```

## Data Structure

Each team member record includes:
- `name` - Full name
- `slug` - URL-friendly identifier
- `role` - Job title/position
- `email` - Email address (if available)
- `phone` - Phone number (if available)
- `bio` - Full biography text (if available)
- `blurb` - Short description (if available)
- `avatarImageId` - Reference to uploaded avatar image
- `tags` - Array of tags (e.g., "Stage Management", "Community Leadership")
- `communityIds` - Array of community IDs this person is associated with
- `socialLinkedin` - LinkedIn profile URL (if available)
- `department` - Department name (if available)

## Notes

- **Duplicate Handling**: The script checks for existing team members by slug and skips them
- **Image Optimization**: All avatars are resized to 800x800 max and converted to WebP format
- **Community Associations**: Some team members (like Marci Gerke and Bob Burden) appear at multiple communities
- **Error Handling**: If an avatar download fails, the team member is still created without an avatar

## Troubleshooting

### Object storage not configured
**Error**: "Object storage not configured"  
**Solution**: Ensure `DEFAULT_OBJECT_STORAGE_BUCKET_ID` and `PRIVATE_OBJECT_DIR` environment variables are set

### Community not found
**Warning**: "⚠️ Community not found: <slug>"  
**Solution**: Create the missing community in the database first, or remove the community slug from the team member data

### Image download failed
**Error**: "Failed to download image: <reason>"  
**Solution**: The team member will be created without an avatar. You can manually update the avatar later

## Manual Data Review

After import, you can review the imported data:

```sql
-- Check imported team members
SELECT id, name, role, email, phone 
FROM team_members 
ORDER BY name;

-- Check community associations
SELECT tm.name, tm.role, tm."communityIds"
FROM team_members tm
WHERE array_length(tm."communityIds", 1) > 0;

-- Check members with avatars
SELECT tm.name, i.url as avatar_url
FROM team_members tm
JOIN images i ON tm."avatarImageId" = i.id;
```

## Updating the Data

To add more team members or update existing ones:

1. Edit `scraped-team-data.json` to add/modify team member data
2. Run the import script again
3. The script will skip existing members (matched by slug)
4. Only new members will be imported
