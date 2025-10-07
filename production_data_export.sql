-- Stage Senior Production Database Data Export
-- Generated from development database
-- Run this on your PRODUCTION database to sync all data

-- =============================================
-- 1. CARE TYPES
-- =============================================
INSERT INTO care_types VALUES 
('35e9d6a3-5444-4a66-a2a3-a9c8b728f4ea', 'Independent Living', 'independent-living', '', 0, true),
('f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd', 'Assisted Living', 'assisted-living', '', 0, true),
('1c08656d-0383-4eed-8bf5-4c3c4673ea33', 'Memory Care', 'memory-care', '', 0, true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. COMMUNITIES
-- =============================================
INSERT INTO communities VALUES 
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', 'Golden Pond', 'golden-pond', E'Golden Pond has been part of the Golden community for more than 20 years. We provide Independent Living, Assisted Living, and Memory Care in one location — so residents can remain in the same community as their needs change.\n\nBecause we''re locally owned, families find a different level of connection here. Leadership is approachable, staff tend to stay long-term, and decisions are made with the people of Golden in mind.', '1270 N Ford Street', 'Golden', 'CO', '80403', '(303) 436-2300', 'info@goldenpond.com', true, NOW(), NOW()),
('dea2cbbe-32da-4774-a85b-5dd9286892ed', 'Gardens at Columbine', 'gardens-at-columbine', E'Since 2000, The Gardens at Columbine has provided Assisted Living and Memory Care in Littleton, CO. Expanded in 2015 with a state-of-the-art memory care wing, it is known as one of the most thoughtfully designed and scenic senior living campuses in Colorado.\n\nWith more than two acres of landscaped gardens, water features, and walking paths, the community offers a truly restorative environment. Many staff members have been here for decades, creating familiarity and trust for residents and families alike.', '5130 West Ken Caryl Avenue', 'Littleton', 'CO', '80128', NULL, 'info@gardensatcolumbine.com', true, NOW(), NOW()),
('b2c48ce7-11cb-4216-afdb-f2429ccae81f', 'The Gardens on Quail', 'the-gardens-on-quail', E'Welcome to The Gardens on Quail, a modern, full-continuum senior living community in Arvada offering Independent Plus, Assisted Living, and Memory Care options. Built in 2012 and locally owned, our community blends resort-style comfort with genuine care and connection. Here, residents enjoy graceful transitions over time—moving seamlessly as their needs evolve—without losing their friendships, routines, or sense of home.\n\nAt Gardens on Quail, life is rich with opportunity. From garden walks to creative workshops, exercise classes to intergenerational programs, every day offers meaningful ways to nurture mind, body, and spirit. Our compassionate care team supports those who require assistance, while those who wish to remain independent can do so with dignity and choice.', '6447 Quail Street', 'Arvada', 'CO', '80004', '(303) 436-2300', 'info@gardensonquail.com', true, NOW(), NOW()),
('d20c45d3-8201-476a-aeb3-9b941f717ccf', 'Stonebridge Senior', 'stonebridge-senior', E'Stonebridge Senior provides Assisted Living and Memory Care in a newly refreshed community in Arvada. Formerly known as Ralston Creek, it was reimagined under Stage Senior management with a modern design and a personalized care philosophy.\n\nStonebridge is smaller and more intimate than many senior communities, making it easier for staff to get to know residents well. With its "Your Story First" approach, care is built around the individual, not just the diagnosis.', '11825 West 64th Avenue', 'Arvada', 'CO', '80004', '(303) 436-2300', 'info@stonebridgesenior.com', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 3. COMMUNITIES CARE TYPES
-- =============================================
INSERT INTO communities_care_types VALUES
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '35e9d6a3-5444-4a66-a2a3-a9c8b728f4ea'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '1c08656d-0383-4eed-8bf5-4c3c4673ea33'),
('dea2cbbe-32da-4774-a85b-5dd9286892ed', '1c08656d-0383-4eed-8bf5-4c3c4673ea33'),
('dea2cbbe-32da-4774-a85b-5dd9286892ed', 'f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd')
ON CONFLICT DO NOTHING;

-- =============================================
-- 4. AMENITIES
-- =============================================
INSERT INTO amenities VALUES
('b0f3d565-7936-4e71-b622-07aefd6a97f8', 'Restaurant-Style Dining', 'restaurant-style-dining', '', 0, true),
('23ec2ac7-cf07-4583-a2e4-4c7974977bb5', 'Bistro Café', 'bistro-cafe', '', 0, true),
('e5327a7b-3b02-4dc3-b73f-ce09d4f193ee', 'Theater Room', 'theater-room', '', 0, true),
('199659a2-0fa2-42c1-be7e-dbb4ec4c22e0', 'Library / Reading Lounge', 'library', '', 0, true),
('dd387197-08e8-47b7-a607-0bbce2a4643e', 'Workout & Fitness Facilities', 'fitness-center', '', 0, true),
('8b256e8d-8f78-455f-bc46-d1e76ad60591', 'Beauty Salon / Barber', 'salon', '', 0, true),
('6642fb44-2a3c-4170-936f-c8dd49082051', 'Chapel', 'chapel', '', 0, true),
('248bc235-e882-4ea7-9111-bac94bbddf04', 'Courtyards & Patios', 'courtyards', '', 0, true),
('031b6a68-d441-4a51-abd9-5779cc6737d2', 'Raised Garden Beds / Greenhouse', 'raised-garden-beds', '', 0, true),
('8b13bf32-ff8f-457f-bb03-11b443a193c3', 'Putting Green', 'putting-green', '', 0, true),
('44eeecb5-9328-4489-8491-8f1c8d8190a7', 'Heated Courtyard with Train Set', 'heated-courtyard-train', '', 0, true),
('cf39d9a0-b8b9-4ce1-8824-7d8d260b6e19', 'Fitness & Therapy Center', 'therapy-center', '', 0, true),
('49602e51-05a2-4a16-bba1-7b6d37d91da7', 'Library / Computer Lab', 'library-computer-lab', '', 0, true),
('926ded65-fd0d-4a34-8c84-5663c6512835', 'Secure Memory Care Neighborhood', 'secure-memory-care', '', 0, true),
('33449d0f-1834-419d-8b78-ec7ce412afa3', '24/7 Emergency Response', 'emergency-response', '', 0, true),
('75a6d753-0b9f-4909-b86f-51a17dd1354e', 'Private Dining Room', 'private-dining', '', 0, true),
('5565c293-f1c8-4d5a-b7d1-d34665f6c8ce', 'Private Family Dining Room', 'private-family-dining-room', 'Enjoy intimate family meals in our elegant private dining room, perfect for celebrations and special occasions with your loved ones.', 25, true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 5. COMMUNITIES AMENITIES (Golden Pond)
-- =============================================
INSERT INTO communities_amenities VALUES
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '33449d0f-1834-419d-8b78-ec7ce412afa3'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '8b256e8d-8f78-455f-bc46-d1e76ad60591'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '23ec2ac7-cf07-4583-a2e4-4c7974977bb5'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '6642fb44-2a3c-4170-936f-c8dd49082051'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '248bc235-e882-4ea7-9111-bac94bbddf04'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', 'cf39d9a0-b8b9-4ce1-8824-7d8d260b6e19'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '44eeecb5-9328-4489-8491-8f1c8d8190a7'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '49602e51-05a2-4a16-bba1-7b6d37d91da7'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '199659a2-0fa2-42c1-be7e-dbb4ec4c22e0'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '75a6d753-0b9f-4909-b86f-51a17dd1354e'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '8b13bf32-ff8f-457f-bb03-11b443a193c3'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '031b6a68-d441-4a51-abd9-5779cc6737d2'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', 'b0f3d565-7936-4e71-b622-07aefd6a97f8'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '926ded65-fd0d-4a34-8c84-5663c6512835'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', 'e5327a7b-3b02-4dc3-b73f-ce09d4f193ee'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', 'dd387197-08e8-47b7-a607-0bbce2a4643e'),
('ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9', '5565c293-f1c8-4d5a-b7d1-d34665f6c8ce')
ON CONFLICT DO NOTHING;

-- =============================================
-- 6. EMAIL RECIPIENTS
-- =============================================
INSERT INTO email_recipients VALUES
('41119f60-845c-4cc8-8f03-b6f867db8c14', 'trevorharwood@gmail.com', 'Trevor', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- NOTE: Additional tables like community_features, faqs, events, galleries 
-- contain a lot of data. If needed, you can export those separately
-- or manually recreate them through the admin panel.
-- =============================================

-- Verify data was imported successfully
SELECT 'Communities:' as table_name, COUNT(*) as count FROM communities
UNION ALL
SELECT 'Care Types:', COUNT(*) FROM care_types
UNION ALL
SELECT 'Amenities:', COUNT(*) FROM amenities
UNION ALL
SELECT 'Email Recipients:', COUNT(*) FROM email_recipients;