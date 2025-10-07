// Script to prepopulate community features for all communities
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Define standard features that apply to all communities
const standardFeatures = [
  {
    eyebrow: 'Fine Dining',
    title: 'Restaurant-Style Dining Experience',
    body: 'Our culinary team creates delicious, nutritious meals daily, served in our elegant dining room. We accommodate special dietary needs and preferences, ensuring every resident enjoys their dining experience.',
    ctaLabel: 'View Dining Options',
    ctaHref: '/dining',
    sortOrder: 0,
    imageLeft: true,
    active: true
  },
  {
    eyebrow: 'Wellness Programs',
    title: 'Comprehensive Health & Wellness',
    body: 'From fitness classes to physical therapy, we offer a full spectrum of wellness programs designed to keep residents active, engaged, and healthy. Our on-site fitness center and therapy services support optimal well-being.',
    ctaLabel: 'Explore Wellness',
    ctaHref: '/fitness-therapy',
    sortOrder: 1,
    imageLeft: false,
    active: true
  },
  {
    eyebrow: 'Compassionate Care',
    title: 'Personalized Memory Care',
    body: 'Our specialized memory care program provides a secure, nurturing environment for residents with Alzheimer\'s and dementia. Our trained staff delivers person-centered care that honors each individual\'s life story.',
    ctaLabel: 'Learn About Memory Care',
    ctaHref: '/contact',
    sortOrder: 2,
    imageLeft: true,
    active: true
  },
  {
    eyebrow: 'Social Life',
    title: 'Vibrant Community Activities',
    body: 'Life here is filled with opportunities to connect, learn, and have fun. From educational programs to entertainment, our activity calendar offers something for everyone, fostering friendships and engagement.',
    ctaLabel: 'See Our Events',
    ctaHref: '/events',
    sortOrder: 3,
    imageLeft: false,
    active: true
  },
  {
    eyebrow: 'Personal Care',
    title: 'Beauty Salon & Barber Services',
    body: 'Look and feel your best with our on-site beauty salon and barber shop. Professional stylists provide haircuts, styling, manicures, and more, helping residents maintain their personal style with convenience.',
    ctaLabel: 'Beauty Services',
    ctaHref: '/beauty-salon',
    sortOrder: 4,
    imageLeft: true,
    active: true
  },
  {
    eyebrow: 'Outdoor Living',
    title: 'Beautiful Courtyards & Gardens',
    body: 'Enjoy Colorado\'s beautiful weather in our secure outdoor spaces. Our landscaped courtyards, walking paths, and garden areas provide peaceful settings for relaxation, socializing, and outdoor activities.',
    ctaLabel: 'Tour Our Grounds',
    ctaHref: '/courtyards-patios',
    sortOrder: 5,
    imageLeft: false,
    active: true
  }
];

// Community-specific features
const communitySpecificFeatures: Record<string, any[]> = {
  'the-gardens-on-quail': [
    {
      eyebrow: 'Upscale Living',
      title: 'Luxury Amenities & Custom Design',
      body: 'Experience upscale senior living with our custom-designed spaces including bistro dining, private theater, library, and elegant common areas. Every detail reflects our commitment to exceptional living.',
      ctaLabel: 'Schedule a Tour',
      ctaHref: '/contact',
      sortOrder: 6,
      imageLeft: true,
      active: true
    }
  ],
  'gardens-at-columbine': [
    {
      eyebrow: 'Nature & Gardens',
      title: 'Expansive 2+ Acre Gardens',
      body: 'Our community is renowned for its stunning gardens spanning over 2 acres. These serene outdoor spaces offer peaceful walking paths, sitting areas, and seasonal beauty that residents and families cherish.',
      ctaLabel: 'Explore Our Gardens',
      ctaHref: '/courtyards-patios',
      sortOrder: 6,
      imageLeft: true,
      active: true
    }
  ],
  'golden-pond': [
    {
      eyebrow: 'Locally Owned',
      title: '20+ Years of Excellence',
      body: 'With over 20 years as a locally owned community, we\'ve earned a 98%+ resident satisfaction rate. Our deep roots in Golden mean personalized care from people who truly know and care about our residents.',
      ctaLabel: 'Our Story',
      ctaHref: '/contact',
      sortOrder: 6,
      imageLeft: true,
      active: true
    }
  ],
  'stonebridge-senior': [
    {
      eyebrow: 'Your Story First',
      title: 'Person-Centered Care Philosophy',
      body: 'We believe every resident has a unique story worth celebrating. Through family story sessions and personalized care plans, we honor each individual\'s preferences, history, and personality.',
      ctaLabel: 'Learn Our Approach',
      ctaHref: '/contact',
      sortOrder: 6,
      imageLeft: true,
      active: true
    }
  ]
};

async function seedCommunityFeatures() {
  try {
    console.log('Starting to seed community features...');

    // Get all communities
    const communities = await db.select().from(schema.communities);
    console.log(`Found ${communities.length} communities`);

    for (const community of communities) {
      console.log(`\nProcessing community: ${community.name} (${community.slug})`);
      
      // Check if features already exist for this community
      const existingFeatures = await db
        .select()
        .from(schema.communityFeatures)
        .where(eq(schema.communityFeatures.communityId, community.id));
      
      if (existingFeatures.length > 0) {
        console.log(`  - Community already has ${existingFeatures.length} features, skipping...`);
        continue;
      }

      // Get features for this community
      let featuresToInsert = [...standardFeatures];
      
      // Add community-specific features if they exist
      if (communitySpecificFeatures[community.slug]) {
        featuresToInsert = [...featuresToInsert, ...communitySpecificFeatures[community.slug]];
      }

      // Insert features
      for (const feature of featuresToInsert) {
        const inserted = await db.insert(schema.communityFeatures).values({
          communityId: community.id,
          ...feature
        }).returning();
        console.log(`  - Added feature: ${feature.title}`);
      }
      
      console.log(`  - Successfully added ${featuresToInsert.length} features for ${community.name}`);
    }

    console.log('\nCommunity features seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding community features:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the seed function
seedCommunityFeatures();