# Database Setup Guide

This guide explains how to set up and manage your Stage Senior database environments.

## Prerequisites

- PostgreSQL client tools (`psql`, `pg_dump`)
- Access to Neon database credentials
- Node.js environment

## Initial Setup

### 1. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual database credentials:

```env
# Development Database
DATABASE_URL=postgresql://neondb_owner:YOUR_DEV_PASSWORD@ep-your-dev-endpoint.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require

# Production Database
PROD_DATABASE_URL=postgresql://neondb_owner:YOUR_PROD_PASSWORD@ep-your-prod-endpoint.us-west-2.aws.neon.tech/neondb?sslmode=require
```

**⚠️ IMPORTANT**: Never commit the `.env` file to git! It's already in `.gitignore`.

### 2. Database Credentials

#### Development Database
- **Host**: `ep-royal-mouse-afvhqvpe.c-2.us-west-2.aws.neon.tech`
- **Username**: `neondb_owner`
- **Password**: `npg_ICLdzPKQi19h`
- **Database**: `neondb`

#### Production Database
- **Host**: `ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech`
- **Username**: `neondb_owner`
- **Password**: `npg_rkzNBcC21pWL`
- **Database**: `neondb`

## Common Operations

### Test Database Connection

```bash
# Test development database
psql $DATABASE_URL -c "SELECT COUNT(*) FROM communities;"

# Test production database
psql $PROD_DATABASE_URL -c "SELECT COUNT(*) FROM communities;"
```

### Export Production Data

Export all data from production (excluding users and sessions for security):

```bash
pg_dump $PROD_DATABASE_URL \
  --data-only \
  --inserts \
  --column-inserts \
  --no-owner \
  --no-privileges \
  --exclude-table=session \
  --exclude-table=users \
  > production_export_$(date +%Y%m%d).sql
```

### Import Production to Development

**⚠️ WARNING**: This will DELETE all data in development and replace it with production data!

```bash
# 1. Clear development database (keeps schema)
psql $DATABASE_URL << 'EOF'
TRUNCATE TABLE
  floor_plan_images,
  floor_plans,
  gallery_images,
  galleries,
  community_features,
  community_highlights,
  communities_amenities,
  communities_care_types,
  testimonials,
  faqs,
  events,
  post_attachments,
  posts,
  blog_posts,
  tour_requests,
  communities,
  amenities,
  care_types,
  team_members,
  images,
  page_heroes,
  homepage_sections,
  homepage_config,
  email_recipients
RESTART IDENTITY CASCADE;
EOF

# 2. Import production data
psql $DATABASE_URL < production_export_YYYYMMDD.sql
```

### Add Stonebridge Floor Plans & Care Types

After importing production data, re-add the enhanced data:

```bash
psql $DATABASE_URL << 'EOF'
-- Add communities care type associations
INSERT INTO communities_care_types (community_id, care_type_id) VALUES
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '35e9d6a3-5444-4a66-a2a3-a9c8b728f4ea'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '1c08656d-0383-4eed-8bf5-4c3c4673ea33'),
('dea2cbbe-32da-4774-a85b-5dd9286892ed', 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd'),
('dea2cbbe-32da-4774-a85b-5dd9286892ed', '1c08656d-0383-4eed-8bf5-4c3c4673ea33'),
('b2c48ce7-11cb-4216-afdb-f2429ccae81f', '35e9d6a3-5444-4a66-a2a3-a9c8b728f4ea'),
('b2c48ce7-11cb-4216-afdb-f2429ccae81f', 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd'),
('b2c48ce7-11cb-4216-afdb-f2429ccae81f', '1c08656d-0383-4eed-8bf5-4c3c4673ea33'),
('d20c45d3-8201-476a-aeb3-9b941f717ccf', 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd'),
('d20c45d3-8201-476a-aeb3-9b941f717ccf', '1c08656d-0383-4eed-8bf5-4c3c4673ea33')
ON CONFLICT DO NOTHING;

-- Add Stonebridge Assisted Living floor plans
INSERT INTO floor_plans (community_id, care_type_id, name, bedrooms, bathrooms, square_feet, description, starting_price, starting_rate_display, sort_order, active, plan_slug) VALUES
('d20c45d3-8201-476a-aeb3-9b941f717ccf', 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd', 'Aspen', 0, 1, 382, 'Studio apartment with efficient layout and modern amenities', 5935, '$5,935/month', 1, true, 'aspen'),
('d20c45d3-8201-476a-aeb3-9b941f717ccf', 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd', 'Copper', 1, 1, 527, 'One bedroom apartment with spacious living area', 6950, '$6,950/month', 2, true, 'copper'),
('d20c45d3-8201-476a-aeb3-9b941f717ccf', 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd', 'Avon', 1, 1, 583, 'One bedroom apartment with generous living space', 6950, '$6,950/month', 3, true, 'avon'),
('d20c45d3-8201-476a-aeb3-9b941f717ccf', 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd', 'Eldora', 1, 1, 749, 'One bedroom plus apartment with enhanced living area', 8580, '$8,580/month', 4, true, 'eldora'),
('d20c45d3-8201-476a-aeb3-9b941f717ccf', 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd', 'Vail', 1, 2, 750, 'One bedroom plus apartment with two full bathrooms', 8580, '$8,580/month', 5, true, 'vail'),
('d20c45d3-8201-476a-aeb3-9b941f717ccf', 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd', 'Georgetown', 2, 2, 1039, 'Two bedroom apartment with den and two full bathrooms', 9528, '$9,528/month', 6, true, 'georgetown');

-- Add Stonebridge Memory Care floor plans
INSERT INTO floor_plans (community_id, care_type_id, name, bedrooms, bathrooms, square_feet, description, starting_price, starting_rate_display, sort_order, active, plan_slug) VALUES
('d20c45d3-8201-476a-aeb3-9b941f717ccf', '1c08656d-0383-4eed-8bf5-4c3c4673ea33', 'Keystone', 0, 1, 337, 'Memory Care studio apartment designed for comfort and safety', 8500, '$8,500/month', 7, true, 'keystone'),
('d20c45d3-8201-476a-aeb3-9b941f717ccf', '1c08656d-0383-4eed-8bf5-4c3c4673ea33', 'Telluride', 1, 1, 462, 'Memory Care one bedroom apartment with thoughtful design', 9000, '$9,000/month', 8, true, 'telluride'),
('d20c45d3-8201-476a-aeb3-9b941f717ccf', '1c08656d-0383-4eed-8bf5-4c3c4673ea33', 'Durango', 1, 1, 501, 'Memory Care one bedroom apartment with enhanced living space', 9300, '$9,300/month', 9, true, 'durango');

-- Update existing floor plans with care type IDs
UPDATE floor_plans SET care_type_id = 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd' WHERE name LIKE 'Assisted Living%';
UPDATE floor_plans SET care_type_id = '1c08656d-0383-4eed-8bf5-4c3c4673ea33' WHERE name LIKE 'Memory Care%';
UPDATE floor_plans SET care_type_id = '35e9d6a3-5444-4a66-a2a3-a9c8b728f4ea' WHERE name LIKE 'Independent Living%' OR name LIKE 'Independent Plus%';
EOF
```

## Verification Commands

### Check Communities with Care Types

```bash
psql $DATABASE_URL << 'EOF'
SELECT c.name, STRING_AGG(ct.name, ', ') as care_types
FROM communities c
JOIN communities_care_types cct ON c.id = cct.community_id
JOIN care_types ct ON cct.care_type_id = ct.id
GROUP BY c.name
ORDER BY c.name;
EOF
```

### Check Stonebridge Floor Plans

```bash
psql $DATABASE_URL << 'EOF'
SELECT
    fp.name,
    ct.name as care_type,
    fp.starting_rate_display
FROM floor_plans fp
JOIN care_types ct ON fp.care_type_id = ct.id
WHERE fp.community_id = 'd20c45d3-8201-476a-aeb3-9b941f717ccf'
ORDER BY fp.sort_order;
EOF
```

### Database Summary

```bash
psql $DATABASE_URL << 'EOF'
SELECT 'Communities' as table_name, COUNT(*) as count FROM communities
UNION ALL
SELECT 'Floor Plans', COUNT(*) FROM floor_plans
UNION ALL
SELECT 'Blog Posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'Images', COUNT(*) FROM images
UNION ALL
SELECT 'Galleries', COUNT(*) FROM galleries
ORDER BY count DESC;
EOF
```

## Community IDs Reference

- **Golden Pond**: `ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9`
- **Gardens at Columbine**: `dea2cbbe-32da-4774-a85b-5dd9286892ed`
- **Gardens on Quail**: `b2c48ce7-11cb-4216-afdb-f2429ccae81f`
- **Stonebridge**: `d20c45d3-8201-476a-aeb3-9b941f717ccf`

## Care Type IDs Reference

- **Independent Living**: `35e9d6a3-5444-4a66-a2a3-a9c8b728f4ea`
- **Assisted Living**: `f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd`
- **Memory Care**: `1c08656d-0383-4eed-8bf5-4c3c4673ea33`

## Troubleshooting

### Connection Errors

If you get connection errors, verify:
1. Your IP is whitelisted in Neon dashboard
2. SSL mode is set to `require`
3. Credentials are correct

### Permission Errors

Some operations may show permission warnings (like `session_replication_role`). These can usually be ignored if the main operation succeeds.

## Security Notes

- ✅ `.env` is in `.gitignore` - never commit credentials
- ✅ User passwords are excluded from exports
- ✅ Session data is excluded from exports
- ⚠️ Keep database passwords secure and rotate regularly
- ⚠️ Only share credentials through secure channels

## Support

For issues or questions, contact the development team or refer to the Neon documentation at https://neon.tech/docs
