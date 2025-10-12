-- Add Missing Page Heroes with Temporary Placeholders
-- After running this SQL, go to /admin > Page Heroes to upload the actual candid images

-- Team Page
INSERT INTO page_heroes (id, page_path, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, active, sort_order, created_at, updated_at)
VALUES (gen_random_uuid(), '/team', 'Meet Our Team', 'Caring Professionals You Can Trust', 'Get to know the dedicated team members who make Stage Senior communities feel like home.', '', '0.40', 'center', true, 0, NOW(), NOW())
ON CONFLICT (page_path) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description;

-- Blog Page
INSERT INTO page_heroes (id, page_path, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, active, sort_order, created_at, updated_at)
VALUES (gen_random_uuid(), '/blog', 'News & Stories', 'Life at Stage Senior', 'Stay updated with the latest news, stories, and insights from our communities.', '', '0.40', 'center', true, 0, NOW(), NOW())
ON CONFLICT (page_path) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description;

-- Events Page
INSERT INTO page_heroes (id, page_path, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, active, sort_order, created_at, updated_at)
VALUES (gen_random_uuid(), '/events', 'Community Events', 'Connect and Celebrate Together', 'Join us for engaging activities, celebrations, and social gatherings in our communities.', '', '0.40', 'center', true, 0, NOW(), NOW())
ON CONFLICT (page_path) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description;

-- Careers Page
INSERT INTO page_heroes (id, page_path, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, active, sort_order, created_at, updated_at)
VALUES (gen_random_uuid(), '/careers', 'Join Our Team', 'Build a Rewarding Career', 'Discover meaningful career opportunities in senior care and community management.', '', '0.40', 'center', true, 0, NOW(), NOW())
ON CONFLICT (page_path) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description;

-- Contact Page
INSERT INTO page_heroes (id, page_path, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, active, sort_order, created_at, updated_at)
VALUES (gen_random_uuid(), '/contact', 'Get In Touch', 'We''re Ready to Help', 'Have questions? We''re here to answer them and help you find the perfect community.', '', '0.40', 'center', true, 0, NOW(), NOW())
ON CONFLICT (page_path) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description;

-- Services Page
INSERT INTO page_heroes (id, page_path, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, active, sort_order, created_at, updated_at)
VALUES (gen_random_uuid(), '/services', 'Our Services', 'Comprehensive Care Options', 'Explore our full range of services designed to support independent and assisted living.', '', '0.40', 'center', true, 0, NOW(), NOW())
ON CONFLICT (page_path) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description;

-- Safety with Dignity Page
INSERT INTO page_heroes (id, page_path, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, active, sort_order, created_at, updated_at)
VALUES (gen_random_uuid(), '/safety-with-dignity', 'Safety with Dignity', 'Independence and Security', 'Experience the perfect balance of safety, independence, and personal dignity in our communities.', '', '0.40', 'center', true, 0, NOW(), NOW())
ON CONFLICT (page_path) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description;

-- Dining Page
INSERT INTO page_heroes (id, page_path, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, active, sort_order, created_at, updated_at)
VALUES (gen_random_uuid(), '/dining', 'Dining Services', 'Delicious Meals, Good Company', 'Enjoy restaurant-style dining with chef-prepared meals in a warm, social atmosphere.', '', '0.40', 'center', true, 0, NOW(), NOW())
ON CONFLICT (page_path) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description;

-- Beauty Salon Page
INSERT INTO page_heroes (id, page_path, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, active, sort_order, created_at, updated_at)
VALUES (gen_random_uuid(), '/beauty-salon', 'Beauty & Barber Services', 'Look and Feel Your Best', 'On-site salon and barber services to help you look and feel your best every day.', '', '0.40', 'center', true, 0, NOW(), NOW())
ON CONFLICT (page_path) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description;

-- Fitness & Therapy Page
INSERT INTO page_heroes (id, page_path, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, active, sort_order, created_at, updated_at)
VALUES (gen_random_uuid(), '/fitness-therapy', 'Fitness & Wellness', 'Stay Active and Healthy', 'State-of-the-art fitness center and therapy services to support your health and mobility.', '', '0.40', 'center', true, 0, NOW(), NOW())
ON CONFLICT (page_path) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description;

-- Courtyards & Patios Page
INSERT INTO page_heroes (id, page_path, title, subtitle, description, background_image_url, overlay_opacity, text_alignment, active, sort_order, created_at, updated_at)
VALUES (gen_random_uuid(), '/courtyards-patios', 'Outdoor Spaces', 'Enjoy Colorado''s Beauty', 'Beautiful outdoor courtyards and patios perfect for relaxation and social gatherings.', '', '0.40', 'center', true, 0, NOW(), NOW())
ON CONFLICT (page_path) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description;
