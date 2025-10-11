import { promises as fs } from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

interface PageHeroData {
  pagePath: string;
  title: string;
  subtitle: string;
  description: string;
  imagePath: string;
  ctaText?: string;
  ctaLink?: string;
}

const heroData: PageHeroData[] = [
  {
    pagePath: '/in-home-care',
    title: 'Healthy at Home',
    subtitle: 'Denver Metro In-Home Caregiving',
    description: 'Trusted non-medical homecare support from bathing assistance to grocery shopping. Locally owned, background checked caregivers.',
    imagePath: 'attached_assets/generated_images/In-home_care_hero_image_5df7db95.png',
    ctaText: 'Get My 24-Hr Care Plan',
    ctaLink: 'mailto:info@healthyathomeco.com'
  },
  {
    pagePath: '/faqs',
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions',
    description: 'Get answers about our senior living communities and services',
    imagePath: 'attached_assets/generated_images/FAQ_page_hero_image_75034886.png',
    ctaText: 'Schedule a Tour',
    ctaLink: '/contact'
  },
  {
    pagePath: '/Reviews',
    title: 'Resident & Family Reviews',
    subtitle: 'Hear from our community',
    description: 'Read testimonials from residents and their families about life at Stage Senior communities',
    imagePath: 'attached_assets/generated_images/Reviews_page_hero_image_1d8ff8bb.png',
    ctaText: 'Schedule a Tour',
    ctaLink: '/contact'
  },
  {
    pagePath: '/services/management',
    title: 'Professional Management Services',
    subtitle: 'Local Leadership, Proven Excellence',
    description: 'Expert operational excellence, personalized care, and proven results across Colorado',
    imagePath: 'attached_assets/generated_images/Management_services_hero_image_000c7ac1.png',
    ctaText: 'Learn More',
    ctaLink: '/contact'
  },
  {
    pagePath: '/accessibility',
    title: 'Accessibility Statement',
    subtitle: 'Committed to inclusive design',
    description: 'Our commitment to making our communities and website accessible to everyone',
    imagePath: 'attached_assets/generated_images/Accessibility_page_hero_image_13b8999f.png'
  },
  {
    pagePath: '/care-points',
    title: 'Care Points',
    subtitle: 'Personalized care for every need',
    description: 'Comprehensive care services tailored to each resident\'s unique requirements',
    imagePath: 'attached_assets/generated_images/Care_points_hero_image_4215f210.png',
    ctaText: 'Learn About Our Care',
    ctaLink: '/contact'
  },
  {
    pagePath: '/services/long-term-care',
    title: 'Long-Term Care Services',
    subtitle: 'Skilled nursing and extended care',
    description: 'Professional long-term care services with compassion and expertise',
    imagePath: 'attached_assets/generated_images/Long-term_care_hero_image_7059e08d.png',
    ctaText: 'Contact Us',
    ctaLink: '/contact'
  },
  {
    pagePath: '/privacy',
    title: 'Privacy Policy',
    subtitle: 'Your privacy matters to us',
    description: 'Learn how we protect and manage your personal information',
    imagePath: 'attached_assets/generated_images/Privacy_policy_hero_image_4fc50602.png'
  },
  {
    pagePath: '/terms',
    title: 'Terms of Service',
    subtitle: 'Terms and conditions',
    description: 'Review our terms of service and user agreement',
    imagePath: 'attached_assets/generated_images/Terms_page_hero_image_d44959b4.png'
  },
  {
    pagePath: '/services/chaplaincy',
    title: 'Chaplaincy Services',
    subtitle: 'Spiritual care and support',
    description: 'Interfaith spiritual support and pastoral care for all residents',
    imagePath: 'attached_assets/generated_images/Chaplaincy_services_hero_image_8718959a.png',
    ctaText: 'Learn More',
    ctaLink: '/contact'
  }
];

async function uploadImage(imagePath: string): Promise<string> {
  const fullPath = path.join(process.cwd(), imagePath);
  const fileBuffer = await fs.readFile(fullPath);
  
  const formData = new FormData();
  formData.append('file', fileBuffer, {
    filename: path.basename(imagePath),
    contentType: 'image/png'
  });

  const response = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData as any,
    headers: {
      'Cookie': 'connect.sid=your-session-cookie' // Will need to be set manually or use login
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.statusText}`);
  }

  const result = await response.json();
  return result.id;
}

async function createPageHero(data: PageHeroData, imageId: string) {
  const heroPayload = {
    pagePath: data.pagePath,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    backgroundImageUrl: '', // Will be populated from imageId
    imageId: imageId,
    ctaText: data.ctaText || null,
    ctaLink: data.ctaLink || null,
    overlayOpacity: '0.50',
    textAlignment: 'center',
    active: true,
    sortOrder: 0
  };

  const response = await fetch(`${BASE_URL}/api/page-heroes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'connect.sid=your-session-cookie' // Will need to be set manually or use login
    },
    body: JSON.stringify(heroPayload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create page hero: ${error}`);
  }

  return await response.json();
}

async function main() {
  console.log('Starting hero image upload and creation...\n');

  for (const data of heroData) {
    try {
      console.log(`Processing ${data.pagePath}...`);
      
      // Upload image
      console.log(`  Uploading image: ${data.imagePath}`);
      const imageId = await uploadImage(data.imagePath);
      console.log(`  Image uploaded with ID: ${imageId}`);
      
      // Create page hero
      console.log(`  Creating page hero...`);
      const hero = await createPageHero(data, imageId);
      console.log(`  Page hero created: ${hero.id}\n`);
    } catch (error) {
      console.error(`Error processing ${data.pagePath}:`, error);
    }
  }

  console.log('Done!');
}

main().catch(console.error);
