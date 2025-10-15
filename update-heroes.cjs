const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

// Comprehensive hero content for senior living audience
// Focused on trust, dignity, community, independence, and family peace of mind
const heroUpdates = [
  {
    page_path: '/',
    title: 'Welcome Home to Colorado Senior Living',
    subtitle: 'Where independence meets compassionate care. Locally owned communities serving families since 2016.',
    active: true
  },
  {
    page_path: '/about-us',
    title: 'Our Story: 20+ Years of Trusted Senior Care',
    subtitle: 'Family-owned communities built on compassion, dignity, and resident-first values.',
    active: true
  },
  {
    page_path: '/communities',
    title: 'Find Your Perfect Colorado Community',
    subtitle: 'Four beautiful locations across Arvada, Golden, and Littleton. Schedule your personal tour today.',
    active: true
  },
  {
    page_path: '/services',
    title: 'Comprehensive Senior Care Services',
    subtitle: 'From independent living to memory care, personalized support that honors your unique journey.',
    active: true
  },
  {
    page_path: '/services/long-term-care',
    title: 'Long-Term Care You Can Trust',
    subtitle: 'Compassionate assisted living and memory care with 24/7 support, personalized care plans, and dignity in every interaction.',
    active: true
  },
  {
    page_path: '/services/management',
    title: 'Expert Community Management',
    subtitle: 'Dedicated leadership teams creating warm, welcoming environments where residents thrive.',
    active: true
  },
  {
    page_path: '/services/chaplaincy',
    title: 'Spiritual Care & Comfort',
    subtitle: 'Honoring all faiths and beliefs with compassionate chaplaincy services and spiritual support.',
    active: true
  },
  {
    page_path: '/care-points',
    title: 'Personalized Care Plans',
    subtitle: 'Every resident receives individualized attention tailored to their unique needs and preferences.',
    active: true
  },
  {
    page_path: '/dining',
    title: 'Restaurant-Style Dining Experience',
    subtitle: 'Chef-prepared meals, flexible dining times, and special dietary accommodations in warm, social settings.',
    active: true
  },
  {
    page_path: '/fitness-therapy',
    title: 'Stay Active, Stay Healthy',
    subtitle: 'On-site physical therapy, fitness programs, and wellness activities designed for active aging.',
    active: true
  },
  {
    page_path: '/beauty-salon',
    title: 'Full-Service Beauty & Barber Shop',
    subtitle: 'Professional salon services to help you look and feel your best, right here in your community.',
    active: true
  },
  {
    page_path: '/courtyards-patios',
    title: 'Beautiful Colorado Outdoor Spaces',
    subtitle: 'Secure courtyards, therapeutic gardens, and scenic patios to enjoy our stunning mountain state.',
    active: true
  },
  {
    page_path: '/safety-with-dignity',
    title: 'Safety with Dignity',
    subtitle: 'Secure environments that protect independence while providing peace of mind for families.',
    active: true
  },
  {
    page_path: '/in-home-care',
    title: 'Professional In-Home Care Services',
    subtitle: 'Compassionate care delivered in the comfort of your own home. Flexible scheduling, trained caregivers.',
    active: true
  },
  {
    page_path: '/team',
    title: 'Meet Our Caring Team',
    subtitle: 'Dedicated professionals who treat every resident like family. Experience the Stage Senior difference.',
    active: true
  },
  {
    page_path: '/careers',
    title: 'Join Our Award-Winning Team',
    subtitle: 'Build a rewarding career in senior care. Competitive benefits, supportive culture, and opportunities to make a difference.',
    active: true
  },
  {
    page_path: '/stage-cares',
    title: 'Stage Cares: Giving Back',
    subtitle: 'Our commitment to community extends beyond our walls. Supporting local causes that matter.',
    active: true
  },
  {
    page_path: '/events',
    title: 'Community Events & Activities',
    subtitle: 'Engaging activities, special celebrations, and meaningful connections. Life is meant to be celebrated.',
    active: true
  },
  {
    page_path: '/Reviews',
    title: 'What Families Are Saying',
    subtitle: '98%+ resident satisfaction. Real stories from families who trust us with their loved ones.',
    active: true
  },
  {
    page_path: '/blog',
    title: 'Senior Living Resources & Stories',
    subtitle: 'Expert insights, resident stories, and helpful guides for families navigating senior care decisions.',
    active: true
  },
  {
    page_path: '/faqs',
    title: 'Your Questions Answered',
    subtitle: 'Get answers about care levels, pricing, services, and what makes Stage Senior communities special.',
    active: true
  },
  {
    page_path: '/contact',
    title: 'Let\'s Start the Conversation',
    subtitle: 'Schedule a tour, ask questions, or simply learn more. We\'re here to help guide your journey.',
    active: true
  },
  {
    page_path: '/privacy',
    title: 'Privacy Policy',
    subtitle: 'Your privacy and trust matter. Learn how we protect your personal information.',
    active: true
  },
  {
    page_path: '/terms',
    title: 'Terms of Service',
    subtitle: 'Important information about using our website and services.',
    active: true
  },
  {
    page_path: '/accessibility',
    title: 'Our Commitment to Accessibility',
    subtitle: 'Building inclusive digital experiences for everyone. Learn about our accessibility features.',
    active: true
  }
];

async function updateHeroes() {
  console.log('🦸 Updating hero content for all pages...\n');

  try {
    let updated = 0;
    let created = 0;
    let errors = 0;

    for (const hero of heroUpdates) {
      try {
        // Check if hero exists
        const existing = await sql`
          SELECT id FROM page_heroes
          WHERE page_path = ${hero.page_path}
        `;

        if (existing.length > 0) {
          // Update existing hero
          await sql`
            UPDATE page_heroes
            SET
              title = ${hero.title},
              subtitle = ${hero.subtitle},
              active = ${hero.active},
              updated_at = NOW()
            WHERE page_path = ${hero.page_path}
          `;
          console.log(`✏️  Updated: ${hero.page_path}`);
          updated++;
        } else {
          // Create new hero
          await sql`
            INSERT INTO page_heroes (page_path, title, subtitle, active, created_at, updated_at)
            VALUES (${hero.page_path}, ${hero.title}, ${hero.subtitle}, ${hero.active}, NOW(), NOW())
          `;
          console.log(`✨ Created: ${hero.page_path}`);
          created++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${hero.page_path}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Hero content update complete!');
    console.log('='.repeat(70));
    console.log(`✏️  Updated: ${updated}`);
    console.log(`✨ Created: ${created}`);
    console.log(`❌ Errors:  ${errors}`);
    console.log('='.repeat(70));

    // Show final count
    const totalHeroes = await sql`SELECT COUNT(*) as count FROM page_heroes WHERE active = true`;
    console.log(`\n📊 Total active heroes in database: ${totalHeroes[0].count}`);

  } catch (error) {
    console.error('❌ Fatal error updating heroes:', error);
    process.exit(1);
  }
}

updateHeroes();
