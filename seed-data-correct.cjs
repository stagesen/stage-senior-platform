const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function seedData() {
  console.log('Seeding sample data...');
  
  try {
    // Create sample communities using correct column names
    const communities = await sql`
      INSERT INTO communities (name, slug, city, state, short_description, description, address, phone, care_types, amenities, starting_price, active, featured)
      VALUES 
        ('Sunset Manor', 'sunset-manor', 'Paradise Valley', 'AZ', 'Luxury senior living with breathtaking sunset views', 'Experience the finest in senior living at Sunset Manor, where every day ends with spectacular views and caring service.', '123 Sunset Blvd, Paradise Valley, AZ 85253', '(480) 555-0123', '["independent-living"]'::jsonb, '["fitness-center", "dining-room", "pool", "library"]'::jsonb, 3500, true, true),
        ('Garden Oaks Community', 'garden-oaks', 'Scottsdale', 'AZ', 'Peaceful assisted living surrounded by beautiful gardens', 'Garden Oaks offers compassionate assisted living care in a serene, garden-filled environment.', '456 Oak Garden Way, Scottsdale, AZ 85260', '(480) 555-0456', '["assisted-living"]'::jsonb, '["gardens", "dining-room", "activities-room", "wellness-center"]'::jsonb, 4200, true, false),
        ('Heritage Hills', 'heritage-hills', 'Tempe', 'AZ', 'Memory care with dignity and compassion', 'Specialized memory care services in a warm, homelike environment designed for those with Alzheimer''s and dementia.', '789 Heritage Dr, Tempe, AZ 85284', '(480) 555-0789', '["memory-care"]'::jsonb, '["secure-environment", "therapeutic-gardens", "specialized-care"]'::jsonb, 5800, true, true)
      RETURNING id, name
    `;
    console.log('Created communities:', communities.length);

    // Get community IDs for posts
    const [sunsetManor, gardenOaks, heritageHills] = communities;

    // Create sample blog posts
    const posts = await sql`
      INSERT INTO posts (title, slug, content, summary, tags, community_id, published, published_at)
      VALUES 
        ('Welcome to Sunset Manor', 'welcome-to-sunset-manor', 'Discover what makes Sunset Manor the premier choice for luxury senior living in Paradise Valley. Our community offers world-class amenities including a state-of-the-art fitness center, gourmet dining, and beautiful common areas perfect for socializing.', 'Learn about our luxury amenities and caring staff.', '["community", "amenities"]'::jsonb, ${sunsetManor.id}, true, NOW()),
        ('5 Benefits of Active Senior Living', 'benefits-active-senior-living', 'Active senior living communities offer numerous benefits for health, social connection, and overall well-being. From fitness programs to social activities, discover how staying active can enhance your golden years.', 'Explore how active communities enhance senior life.', '["health", "lifestyle", "wellness"]'::jsonb, NULL, true, NOW()),
        ('Garden Oaks: A Peaceful Haven', 'garden-oaks-peaceful-haven', 'At Garden Oaks Community, residents enjoy the tranquility of beautifully landscaped gardens while receiving the assisted living care they need. Our compassionate staff ensures every resident feels at home.', 'Discover the serene environment at Garden Oaks.', '["community", "gardens", "assisted-living"]'::jsonb, ${gardenOaks.id}, true, NOW()),
        ('Understanding Memory Care', 'understanding-memory-care', 'Memory care communities like Heritage Hills provide specialized services for individuals with Alzheimer''s disease and other forms of dementia. Learn about our approach to dignified, person-centered care.', 'Learn about specialized memory care services.', '["memory-care", "alzheimers", "specialized-care"]'::jsonb, ${heritageHills.id}, true, NOW())
      RETURNING id, title
    `;
    console.log('Created posts:', posts.length);

    // Create sample events
    const events = await sql`
      INSERT INTO events (title, slug, description, summary, starts_at, ends_at, location_text, community_id, max_attendees, is_public)
      VALUES 
        ('Holiday Concert Series', 'holiday-concert-series', 'Join us for a festive evening of holiday music performed by local musicians. Light refreshments will be served.', 'Festive holiday music evening', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '2 hours', 'Main Auditorium', ${sunsetManor.id}, 50, true),
        ('Gardening Workshop', 'gardening-workshop', 'Learn about container gardening and seasonal plants with our horticulture expert. Perfect for all skill levels.', 'Learn container gardening', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '1.5 hours', 'Garden Pavilion', ${gardenOaks.id}, 20, true),
        ('Family Support Group', 'family-support-group', 'Monthly support group for families of residents with memory care needs. Facilitated by licensed social workers.', 'Family support meeting', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '1 hour', 'Conference Room', ${heritageHills.id}, 15, true)
      RETURNING id, title
    `;
    console.log('Created events:', events.length);

    // Create sample FAQs
    const faqs = await sql`
      INSERT INTO faqs (question, answer, category, community_id, sort_order, active)
      VALUES 
        ('What is included in the monthly fee?', 'Our monthly fee includes utilities, housekeeping, maintenance, dining services, and access to all community amenities.', 'pricing', ${sunsetManor.id}, 1, true),
        ('Do you allow pets?', 'Yes, we welcome small pets under 25 pounds with a one-time pet fee and monthly pet rent.', 'lifestyle', ${sunsetManor.id}, 2, true),
        ('What levels of care do you provide?', 'We offer assisted living services including medication management, personal care assistance, and 24-hour on-site staff.', 'care', ${gardenOaks.id}, 1, true),
        ('How do you handle emergencies?', 'All residents have emergency call systems, and our trained staff are available 24/7 to respond to any situation.', 'care', ${gardenOaks.id}, 2, true),
        ('What makes your memory care program special?', 'Our memory care program uses evidence-based approaches including cognitive stimulation, structured routines, and personalized care plans.', 'care', ${heritageHills.id}, 1, true),
        ('Can family members visit anytime?', 'Family visits are encouraged and welcome during our open visiting hours from 8 AM to 8 PM daily.', 'lifestyle', ${heritageHills.id}, 2, true)
      RETURNING id, question
    `;
    console.log('Created FAQs:', faqs.length);

    // Create sample galleries with proper JSON format
    const galleries = await sql`
      INSERT INTO galleries (title, description, community_id, images, active)
      VALUES 
        ('Sunset Manor Gallery', 'Beautiful spaces and amenities at Sunset Manor', ${sunsetManor.id}, '[
          {"url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800", "alt": "Elegant dining room", "caption": "Our elegant dining room with mountain views"},
          {"url": "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800", "alt": "Fitness center", "caption": "State-of-the-art fitness center"},
          {"url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800", "alt": "Pool area", "caption": "Resort-style pool and spa"}
        ]'::jsonb, true),
        ('Garden Oaks Spaces', 'Peaceful gardens and caring environments', ${gardenOaks.id}, '[
          {"url": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800", "alt": "Beautiful gardens", "caption": "Therapeutic gardens for relaxation"},
          {"url": "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800", "alt": "Reading nook", "caption": "Quiet reading areas throughout the community"},
          {"url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", "alt": "Activities room", "caption": "Spacious activities room for social gatherings"}
        ]'::jsonb, true),
        ('Heritage Hills Life', 'Dignified living and specialized care', ${heritageHills.id}, '[
          {"url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800", "alt": "Cozy living area", "caption": "Comfortable common areas designed for memory care"},
          {"url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800", "alt": "Therapy garden", "caption": "Secure therapeutic garden spaces"},
          {"url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800", "alt": "Dining area", "caption": "Homelike dining environments"}
        ]'::jsonb, true)
      RETURNING id, title
    `;
    console.log('Created galleries:', galleries.length);

    console.log('✅ Sample data seeded successfully!');
    console.log(`Created:
    - ${communities.length} communities
    - ${posts.length} blog posts  
    - ${events.length} events
    - ${faqs.length} FAQs
    - ${galleries.length} galleries`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();