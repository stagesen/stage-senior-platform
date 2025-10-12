import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Map of page paths to their hero image details
const heroImageMap = [
  // Main Pages
  { pagePath: '/', imageFile: 'Home_entrance_candid_photo_45ad8565.png', title: 'Welcome Home', subtitle: 'Locally Owned, Resident-Focused Senior Living' },
  { pagePath: '/about-us', imageFile: 'About_us_staff_candid_55c3287c.png', title: 'Our Story', subtitle: 'Creating Vibrant Communities in Colorado' },
  { pagePath: '/communities', imageFile: 'Communities_building_casual_shot_fe0edc9e.png', title: 'Our Communities', subtitle: 'Find Your Perfect Home' },
  { pagePath: '/team', imageFile: 'Team_casual_group_photo_0e6e89f0.png', title: 'Meet Our Team', subtitle: 'Caring Professionals You Can Trust' },
  { pagePath: '/blog', imageFile: 'Blog_reading_casual_moment_307d0bc0.png', title: 'News & Stories', subtitle: 'Life at Stage Senior' },
  
  // Engagement Pages
  { pagePath: '/events', imageFile: 'Events_bingo_casual_shot_8fc98b8c.png', title: 'Community Events', subtitle: 'Connect and Celebrate Together' },
  { pagePath: '/faqs', imageFile: 'FAQ_help_desk_candid_3d813991.png', title: 'Frequently Asked Questions', subtitle: 'We\'re Here to Help' },
  { pagePath: '/reviews', imageFile: 'Reviews_thumbs_up_candid_8b0aa974.png', title: 'What Families Are Saying', subtitle: 'Real Stories, Real Satisfaction' },
  { pagePath: '/careers', imageFile: 'Careers_orientation_casual_photo_9a6099b0.png', title: 'Join Our Team', subtitle: 'Build a Rewarding Career' },
  { pagePath: '/contact', imageFile: 'Contact_lobby_casual_view_e9f1dce9.png', title: 'Get In Touch', subtitle: 'We\'re Ready to Help' },
  { pagePath: '/stage-cares', imageFile: 'Stage_Cares_volunteer_candid_23ef5a96.png', title: 'Stage Cares', subtitle: 'Giving Back to Our Community' },
  
  // Service Pages
  { pagePath: '/services', imageFile: 'Services_info_board_casual_71b5f155.png', title: 'Our Services', subtitle: 'Comprehensive Care Options' },
  { pagePath: '/services/management', imageFile: 'Management_casual_interaction_photo_3d1e3586.png', title: 'Management Services', subtitle: 'Expert Leadership, Personal Touch' },
  { pagePath: '/services/long-term-care', imageFile: 'Long_term_care_casual_moment_6153771a.png', title: 'Assisted Living Care', subtitle: 'Support When You Need It' },
  { pagePath: '/services/chaplaincy', imageFile: 'Chaplaincy_group_casual_photo_666d0bee.png', title: 'Spiritual Care', subtitle: 'Faith and Comfort for All' },
  
  // Specialized Pages
  { pagePath: '/in-home-care', imageFile: 'In_home_care_casual_visit_4faa38e4.png', title: 'In-Home Care', subtitle: 'Professional Care at Home' },
  { pagePath: '/safety-with-dignity', imageFile: 'Safety_walking_casual_moment_d97ba69a.png', title: 'Safety with Dignity', subtitle: 'Independence and Security' },
  { pagePath: '/care-points', imageFile: 'Care_points_wellness_casual_photo_abb24202.png', title: 'Personalized Care', subtitle: 'Individual Attention Matters' },
  { pagePath: '/dining', imageFile: 'Dining_room_casual_mealtime_64c8f329.png', title: 'Dining Services', subtitle: 'Delicious Meals, Good Company' },
  { pagePath: '/beauty-salon', imageFile: 'Beauty_salon_casual_haircut_6e70952a.png', title: 'Beauty & Barber Services', subtitle: 'Look and Feel Your Best' },
  { pagePath: '/fitness-therapy', imageFile: 'Fitness_exercise_casual_moment_7bb3bcb6.png', title: 'Fitness & Wellness', subtitle: 'Stay Active and Healthy' },
  { pagePath: '/courtyards-patios', imageFile: 'Courtyards_patio_casual_gathering_7c4b7eb6.png', title: 'Outdoor Spaces', subtitle: 'Enjoy Colorado\'s Beauty' },
];

async function uploadImageAndCreateHero() {
  const baseUrl = 'http://localhost:5000';
  const imagesDir = path.join(process.cwd(), 'attached_assets', 'generated_images');
  
  console.log('Starting hero image upload process...\n');
  
  for (const hero of heroImageMap) {
    const imagePath = path.join(imagesDir, hero.imageFile);
    
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      console.log(`❌ Image not found: ${hero.imageFile}`);
      continue;
    }
    
    try {
      // Upload image
      console.log(`📤 Uploading ${hero.imageFile}...`);
      const formData = new FormData();
      formData.append('file', fs.createReadStream(imagePath));
      formData.append('alt', `${hero.title} - Hero Image`);
      
      const uploadResponse = await fetch(`${baseUrl}/api/images/upload`, {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      });
      
      if (!uploadResponse.ok) {
        console.log(`❌ Upload failed for ${hero.imageFile}: ${uploadResponse.statusText}`);
        continue;
      }
      
      const uploadedImage = await uploadResponse.json();
      console.log(`✅ Uploaded: ${uploadedImage.id}`);
      
      // Check if page hero already exists
      const checkResponse = await fetch(`${baseUrl}/api/page-heroes/${encodeURIComponent(hero.pagePath)}`);
      
      if (checkResponse.ok) {
        // Update existing hero
        const existingHero = await checkResponse.json();
        console.log(`🔄 Updating existing hero for ${hero.pagePath}...`);
        
        const updateResponse = await fetch(`${baseUrl}/api/page-heroes/${existingHero.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: hero.title,
            subtitle: hero.subtitle,
            backgroundImageUrl: uploadedImage.id,
            overlayOpacity: '0.40',
            textAlignment: 'center',
            active: true,
          }),
        });
        
        if (updateResponse.ok) {
          console.log(`✅ Updated hero for ${hero.pagePath}\n`);
        } else {
          console.log(`❌ Failed to update hero for ${hero.pagePath}\n`);
        }
      } else {
        // Create new hero
        console.log(`➕ Creating new hero for ${hero.pagePath}...`);
        
        const createResponse = await fetch(`${baseUrl}/api/page-heroes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pagePath: hero.pagePath,
            title: hero.title,
            subtitle: hero.subtitle,
            backgroundImageUrl: uploadedImage.id,
            overlayOpacity: '0.40',
            textAlignment: 'center',
            active: true,
            sortOrder: 0,
          }),
        });
        
        if (createResponse.ok) {
          console.log(`✅ Created hero for ${hero.pagePath}\n`);
        } else {
          const errorText = await createResponse.text();
          console.log(`❌ Failed to create hero for ${hero.pagePath}: ${errorText}\n`);
        }
      }
    } catch (error) {
      console.log(`❌ Error processing ${hero.pagePath}:`, error.message, '\n');
    }
  }
  
  console.log('✨ Hero image upload process complete!');
}

uploadImageAndCreateHero().catch(console.error);
