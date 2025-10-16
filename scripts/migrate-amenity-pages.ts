import { db } from "../server/db";
import { pageContentSections } from "../shared/schema";
import { sql } from "drizzle-orm";

async function migrateAmenityPages() {
  console.log("Starting amenity pages migration to database...\n");

  // Delete existing content for these pages first
  const pagePaths = ["/dining", "/beauty-salon", "/fitness-therapy", "/courtyards-patios"];
  
  for (const path of pagePaths) {
    const deleted = await db.delete(pageContentSections)
      .where(sql`page_path = ${path}`)
      .returning();
    console.log(`Deleted ${deleted.length} existing sections for ${path}`);
  }

  // /dining page content sections
  const diningContent = [
    {
      pagePath: "/dining",
      sectionType: "hero_section",
      sectionKey: "restaurant_dining",
      title: "Restaurant-Style Dining",
      sortOrder: 1,
      active: true,
      content: {
        heading: "Restaurant-Style Dining",
        description: "Experience the pleasure of dining in our elegant restaurant-style dining rooms, where every meal is a special occasion. Our professional waitstaff provides attentive service while you enjoy chef-prepared meals in a sophisticated setting. Choose from multiple menu options daily, with flexible dining times and professional table service.",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
      }
    },
    {
      pagePath: "/dining",
      sectionType: "hero_section",
      sectionKey: "private_family_dining",
      title: "Private Family Dining Room",
      sortOrder: 2,
      active: true,
      content: {
        heading: "Private Family Dining Room",
        description: "Celebrate life's special moments in our private dining rooms. Perfect for family birthdays, anniversaries, holidays, or intimate gatherings with loved ones in a comfortable, private setting. Reserve for special occasions, work with our chef to create customized menus, and enjoy an intimate setting that seats up to 12 guests.",
        imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"
      }
    },
    {
      pagePath: "/dining",
      sectionType: "section_header",
      sectionKey: "dietary_header",
      title: "Dietary Accommodations",
      sortOrder: 3,
      active: true,
      content: {
        heading: "Dietary Accommodations & Nutrition",
        subheading: "Our registered dietitians work closely with our culinary team to ensure every resident's dietary needs and preferences are met with delicious, nutritious options."
      }
    },
    {
      pagePath: "/dining",
      sectionType: "benefit_cards",
      sectionKey: "dietary_accommodations",
      title: "Dietary Options",
      sortOrder: 4,
      active: true,
      content: {
        cards: [
          {
            title: "Heart-Healthy Options",
            description: "Low-sodium, low-fat meals for cardiovascular health",
            icon: "Heart"
          },
          {
            title: "Vegetarian & Vegan",
            description: "Plant-based options prepared with care and creativity",
            icon: "CheckCircle"
          },
          {
            title: "Gluten-Free Choices",
            description: "Safe and delicious options for gluten sensitivities",
            icon: "CheckCircle"
          },
          {
            title: "Texture-Modified",
            description: "Pureed and soft foods that maintain flavor and nutrition",
            icon: "CheckCircle"
          }
        ]
      }
    },
    {
      pagePath: "/dining",
      sectionType: "hero_section",
      sectionKey: "social_dining",
      title: "Social Dining Experience",
      sortOrder: 5,
      active: true,
      content: {
        heading: "More Than a Meal — A Social Experience",
        description: "Dining is one of life's great pleasures, and at our communities, it's also an opportunity for meaningful social connections. Our dining rooms are vibrant gathering places where friendships flourish over shared meals. Join friends at community tables, enjoy themed dining events throughout the year, and relax in our café for coffee and light snacks.",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
      }
    },
    {
      pagePath: "/dining",
      sectionType: "cta",
      sectionKey: "dining_cta",
      title: "Experience Our Culinary Excellence",
      sortOrder: 6,
      active: true,
      content: {
        heading: "Experience Our Culinary Excellence",
        description: "Join us for a complimentary meal and discover why our residents look forward to every dining experience. Tour our dining facilities and meet our culinary team.",
        buttonText: "Schedule a Tour & Meal",
        buttonLink: "#schedule-tour"
      }
    }
  ];

  // /beauty-salon page content sections
  const beautySalonContent = [
    {
      pagePath: "/beauty-salon",
      sectionType: "text_block",
      sectionKey: "intro",
      title: "Professional Beauty Services On-Site",
      sortOrder: 1,
      active: true,
      content: {
        text: "<h2>Professional Beauty Services On-Site</h2><p>Maintain your personal style and enjoy the confidence that comes with looking your best. Our on-site salon and barber shop offers a full range of professional services in the comfort and convenience of your own community.</p>"
      }
    },
    {
      pagePath: "/beauty-salon",
      sectionType: "feature_grid",
      sectionKey: "salon_services",
      title: "Beauty Salon Services",
      sortOrder: 2,
      active: true,
      content: {
        features: [
          {
            title: "Haircuts & Styling",
            description: "Professional cuts and styles tailored to your preferences",
            icon: "CheckCircle"
          },
          {
            title: "Hair Color",
            description: "Full color, highlights, and touch-ups with quality products",
            icon: "CheckCircle"
          },
          {
            title: "Perms & Waves",
            description: "Beautiful curls and waves that last",
            icon: "CheckCircle"
          },
          {
            title: "Special Occasion Styling",
            description: "Updos and formal styles for events and celebrations",
            icon: "CheckCircle"
          },
          {
            title: "Blow Dry & Set",
            description: "Classic styling with rollers and professional finishing",
            icon: "CheckCircle"
          },
          {
            title: "Hair Treatments",
            description: "Deep conditioning and scalp treatments for healthy hair",
            icon: "CheckCircle"
          }
        ],
        columns: 3
      }
    },
    {
      pagePath: "/beauty-salon",
      sectionType: "feature_grid",
      sectionKey: "barber_services",
      title: "Barber Shop Services",
      sortOrder: 3,
      active: true,
      content: {
        features: [
          {
            title: "Classic Haircuts",
            description: "Traditional and modern men's haircut styles",
            icon: "CheckCircle"
          },
          {
            title: "Beard Trimming",
            description: "Professional beard shaping and maintenance",
            icon: "CheckCircle"
          },
          {
            title: "Hot Towel Shaves",
            description: "Luxurious straight razor shaves with hot towel service",
            icon: "CheckCircle"
          },
          {
            title: "Mustache Grooming",
            description: "Precise mustache trimming and styling",
            icon: "CheckCircle"
          },
          {
            title: "Gray Blending",
            description: "Natural-looking color treatments for men",
            icon: "CheckCircle"
          },
          {
            title: "Scalp Treatments",
            description: "Rejuvenating treatments for scalp health",
            icon: "CheckCircle"
          }
        ],
        columns: 3
      }
    },
    {
      pagePath: "/beauty-salon",
      sectionType: "section_header",
      sectionKey: "benefits_header",
      title: "Benefits of On-Site Beauty Services",
      sortOrder: 4,
      active: true,
      content: {
        heading: "Benefits of On-Site Beauty Services",
        subheading: "Having professional beauty and grooming services right in your community offers numerous advantages for your well-being and quality of life."
      }
    },
    {
      pagePath: "/beauty-salon",
      sectionType: "benefit_cards",
      sectionKey: "benefits",
      title: "Beauty Service Benefits",
      sortOrder: 5,
      active: true,
      content: {
        cards: [
          {
            title: "Convenient Location",
            description: "No need to travel - our salon is right here in your community, making regular appointments easy and stress-free.",
            icon: "CheckCircle"
          },
          {
            title: "Social Connection",
            description: "The salon is a wonderful place to socialize with friends and neighbors while being pampered.",
            icon: "Users"
          },
          {
            title: "Boost Self-Esteem",
            description: "Looking your best helps you feel confident and maintains your sense of identity and personal style.",
            icon: "Heart"
          },
          {
            title: "Flexible Scheduling",
            description: "Appointments available throughout the week with options for walk-ins when possible.",
            icon: "Clock"
          }
        ]
      }
    },
    {
      pagePath: "/beauty-salon",
      sectionType: "hero_section",
      sectionKey: "wellness_impact",
      title: "More Than Just a Haircut",
      sortOrder: 6,
      active: true,
      content: {
        heading: "More Than Just a Haircut",
        description: "Our salon and barber shop is a vibrant social hub where residents gather, share stories, and build friendships. It's a place where personal care meets community connection. Looking good helps residents feel their best, maintaining dignity and personal identity while encouraging social interaction and providing therapeutic benefits.",
        imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
      }
    },
    {
      pagePath: "/beauty-salon",
      sectionType: "cta",
      sectionKey: "beauty_cta",
      title: "Experience Our Beauty Services",
      sortOrder: 7,
      active: true,
      content: {
        heading: "Experience Our Beauty & Barber Services",
        description: "Schedule a tour today to see our beautiful salon and barber facilities, meet our professional stylists, and learn how we help residents look and feel their absolute best.",
        buttonText: "Schedule a Tour",
        buttonLink: "#schedule-tour"
      }
    }
  ];

  // /fitness-therapy page content sections
  const fitnessTherapyContent = [
    {
      pagePath: "/fitness-therapy",
      sectionType: "text_block",
      sectionKey: "intro",
      title: "Comprehensive Wellness for Body and Mind",
      sortOrder: 1,
      active: true,
      content: {
        text: "<h2>Comprehensive Wellness for Body and Mind</h2><p>Our state-of-the-art fitness and therapy center is designed specifically for senior wellness. With professional staff, specialized equipment, and evidence-based programs, we help you maintain your independence, improve your quality of life, and achieve your personal health goals.</p>"
      }
    },
    {
      pagePath: "/fitness-therapy",
      sectionType: "hero_section",
      sectionKey: "fitness_center",
      title: "State-of-the-Art Fitness Center",
      sortOrder: 2,
      active: true,
      content: {
        heading: "State-of-the-Art Fitness Center",
        description: "Our fitness center features senior-friendly equipment and programs designed to help you stay active, strong, and independent. Every piece of equipment is carefully selected for safety, accessibility, and effectiveness. Programs include strength training, cardiovascular health, balance programs, flexibility training, cognitive fitness, and functional fitness.",
        imageUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80"
      }
    },
    {
      pagePath: "/fitness-therapy",
      sectionType: "feature_grid",
      sectionKey: "fitness_programs",
      title: "Fitness Programs",
      sortOrder: 3,
      active: true,
      content: {
        features: [
          {
            title: "Strength Training",
            description: "Build and maintain muscle mass with guided resistance exercises",
            icon: "CheckCircle"
          },
          {
            title: "Cardiovascular Health",
            description: "Heart-healthy cardio equipment including recumbent bikes and treadmills",
            icon: "Heart"
          },
          {
            title: "Balance Programs",
            description: "Specialized equipment and exercises to prevent falls and improve stability",
            icon: "Shield"
          },
          {
            title: "Flexibility Training",
            description: "Stretching and range-of-motion exercises for improved mobility",
            icon: "CheckCircle"
          },
          {
            title: "Cognitive Fitness",
            description: "Exercise programs that combine physical and mental challenges",
            icon: "CheckCircle"
          },
          {
            title: "Functional Fitness",
            description: "Practical exercises for daily living activities and independence",
            icon: "CheckCircle"
          }
        ],
        columns: 3
      }
    },
    {
      pagePath: "/fitness-therapy",
      sectionType: "hero_section",
      sectionKey: "physical_therapy",
      title: "Physical Therapy Services",
      sortOrder: 4,
      active: true,
      content: {
        heading: "Physical Therapy Services",
        description: "Our licensed physical therapists provide personalized treatment plans to help you recover from injuries, manage chronic conditions, and maintain your highest level of physical function. Services include rehabilitation, fall prevention, pain management, mobility improvement, orthopedic therapy, and neurological rehabilitation.",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
      }
    },
    {
      pagePath: "/fitness-therapy",
      sectionType: "hero_section",
      sectionKey: "occupational_therapy",
      title: "Occupational Therapy Services",
      sortOrder: 5,
      active: true,
      content: {
        heading: "Occupational Therapy Services",
        description: "Our occupational therapists help you maintain independence in daily activities through adaptive techniques, cognitive training, and personalized strategies for living your best life. Services include daily living skills, adaptive techniques, cognitive rehabilitation, fine motor skills, home safety assessment, and energy conservation.",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80"
      }
    },
    {
      pagePath: "/fitness-therapy",
      sectionType: "section_header",
      sectionKey: "benefits_header",
      title: "Benefits of Our Fitness & Therapy Programs",
      sortOrder: 6,
      active: true,
      content: {
        heading: "Benefits of Our Fitness & Therapy Programs",
        subheading: "Our comprehensive wellness approach delivers real results that enhance every aspect of your life."
      }
    },
    {
      pagePath: "/fitness-therapy",
      sectionType: "benefit_cards",
      sectionKey: "benefits",
      title: "Program Benefits",
      sortOrder: 7,
      active: true,
      content: {
        cards: [
          {
            title: "Maintain Independence",
            description: "Build strength and skills needed for daily activities, helping you stay independent longer.",
            icon: "CheckCircle"
          },
          {
            title: "Social Engagement",
            description: "Group classes and therapy sessions provide opportunities to connect with neighbors and build friendships.",
            icon: "Users"
          },
          {
            title: "Improved Health",
            description: "Regular exercise reduces risk of chronic conditions and improves overall physical and mental health.",
            icon: "Heart"
          },
          {
            title: "Fall Prevention",
            description: "Targeted programs significantly reduce fall risk through strength, balance, and coordination training.",
            icon: "Shield"
          }
        ]
      }
    },
    {
      pagePath: "/fitness-therapy",
      sectionType: "hero_section",
      sectionKey: "professional_staff",
      title: "Expert Professional Team",
      sortOrder: 8,
      active: true,
      content: {
        heading: "Expert Professional Team",
        description: "Our fitness and therapy team includes licensed physical therapists, certified occupational therapists, fitness specialists with senior wellness certifications, and registered nurses for medical coordination. All staff members are specially trained in senior wellness and dedicated to helping you achieve your health goals safely and effectively.",
        imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
      }
    },
    {
      pagePath: "/fitness-therapy",
      sectionType: "cta",
      sectionKey: "fitness_cta",
      title: "Start Your Wellness Journey",
      sortOrder: 9,
      active: true,
      content: {
        heading: "Start Your Wellness Journey Today",
        description: "Experience our comprehensive fitness and therapy center firsthand. Schedule a tour to meet our professional staff, see our state-of-the-art equipment, and learn how we can help you achieve your wellness goals.",
        buttonText: "Schedule a Wellness Tour",
        buttonLink: "#schedule-tour"
      }
    }
  ];

  // /courtyards-patios page content sections
  const courtyardsPatiosContent = [
    {
      pagePath: "/courtyards-patios",
      sectionType: "text_block",
      sectionKey: "intro",
      title: "Nature's Beauty, Right Outside Your Door",
      sortOrder: 1,
      active: true,
      content: {
        text: "<h2>Nature's Beauty, Right Outside Your Door</h2><p>Our thoughtfully designed outdoor spaces bring the healing power of nature to your daily life. From tranquil gardens to vibrant activity areas, every outdoor space is created with your comfort, safety, and enjoyment in mind.</p>"
      }
    },
    {
      pagePath: "/courtyards-patios",
      sectionType: "section_header",
      sectionKey: "benefits_header",
      title: "The Benefits of Outdoor Living",
      sortOrder: 2,
      active: true,
      content: {
        heading: "The Benefits of Outdoor Living",
        subheading: "Spending time outdoors is essential for physical health, mental well-being, and social connection."
      }
    },
    {
      pagePath: "/courtyards-patios",
      sectionType: "benefit_cards",
      sectionKey: "benefits",
      title: "Outdoor Living Benefits",
      sortOrder: 3,
      active: true,
      content: {
        cards: [
          {
            title: "Vitamin D & Fresh Air",
            description: "Natural sunlight provides essential vitamin D while fresh air improves mood and respiratory health.",
            icon: "CheckCircle"
          },
          {
            title: "Mental Health Benefits",
            description: "Time in nature reduces stress, anxiety, and depression while promoting overall well-being.",
            icon: "Heart"
          },
          {
            title: "Social Connection",
            description: "Outdoor spaces provide natural gathering spots for socializing and building community.",
            icon: "Users"
          },
          {
            title: "Physical Activity",
            description: "Gardens and paths encourage gentle exercise and movement in a pleasant environment.",
            icon: "CheckCircle"
          }
        ]
      }
    },
    {
      pagePath: "/courtyards-patios",
      sectionType: "section_header",
      sectionKey: "spaces_header",
      title: "Diverse Outdoor Environments",
      sortOrder: 4,
      active: true,
      content: {
        heading: "Diverse Outdoor Environments",
        subheading: "Each outdoor space is designed with specific purposes and resident needs in mind."
      }
    },
    {
      pagePath: "/courtyards-patios",
      sectionType: "feature_grid",
      sectionKey: "outdoor_spaces",
      title: "Types of Outdoor Spaces",
      sortOrder: 5,
      active: true,
      content: {
        features: [
          {
            title: "Secure Memory Care Courtyards",
            description: "Safe, enclosed gardens designed specifically for memory care residents to enjoy nature independently\n\n• Secured perimeter\n• Sensory gardens\n• Quiet seating areas\n• Clear pathways",
            icon: "Shield"
          },
          {
            title: "Walking Paths & Trails",
            description: "Well-maintained paths winding through scenic grounds for daily walks and exercise\n\n• Level surfaces\n• Rest benches\n• Shade trees\n• Distance markers",
            icon: "CheckCircle"
          },
          {
            title: "Garden Areas",
            description: "Beautiful flower gardens and raised beds where residents can enjoy gardening activities\n\n• Raised garden beds\n• Seasonal flowers\n• Herb gardens\n• Butterfly gardens",
            icon: "CheckCircle"
          },
          {
            title: "Covered Patios",
            description: "All-weather outdoor living spaces perfect for relaxation in any season\n\n• Weather protection\n• Ceiling fans\n• Comfortable seating\n• Outdoor heaters",
            icon: "CheckCircle"
          },
          {
            title: "Outdoor Dining Areas",
            description: "Al fresco dining spaces for meals with friends and special occasions\n\n• Shaded tables\n• BBQ areas\n• Scenic views\n• Evening lighting",
            icon: "CheckCircle"
          },
          {
            title: "Activity Spaces",
            description: "Dedicated areas for outdoor games, exercise classes, and social events\n\n• Game courts\n• Exercise stations\n• Event pavilions\n• Performance areas",
            icon: "CheckCircle"
          }
        ],
        columns: 2
      }
    },
    {
      pagePath: "/courtyards-patios",
      sectionType: "hero_section",
      sectionKey: "safety_features",
      title: "Safety with Freedom",
      sortOrder: 6,
      active: true,
      content: {
        heading: "Safety with Freedom",
        description: "Our outdoor spaces are designed with your safety as the top priority, while maintaining the freedom to enjoy nature independently. Every detail is carefully considered to ensure you can explore and relax with confidence. Features include non-slip surfaces, adequate lighting, handrails and support, clear wayfinding, comfortable seating, and emergency call systems.",
        imageUrl: "https://images.unsplash.com/photo-1559304787-945aa4341065?w=800&q=80"
      }
    },
    {
      pagePath: "/courtyards-patios",
      sectionType: "cta",
      sectionKey: "courtyards_cta",
      title: "Experience Our Outdoor Spaces",
      sortOrder: 7,
      active: true,
      content: {
        heading: "Experience Our Outdoor Spaces in Person",
        description: "Schedule a tour today to explore our beautiful gardens, courtyards, and outdoor amenities. See how our residents enjoy the perfect blend of nature, safety, and community.",
        buttonText: "Schedule a Tour",
        buttonLink: "#schedule-tour"
      }
    }
  ];

  // Insert all content sections
  const allSections = [
    ...diningContent,
    ...beautySalonContent,
    ...fitnessTherapyContent,
    ...courtyardsPatiosContent
  ];

  for (const section of allSections) {
    await db.insert(pageContentSections).values(section);
    console.log(`✓ Inserted: ${section.pagePath} - ${section.sectionKey}`);
  }

  console.log(`\nMigration complete! Inserted ${allSections.length} content sections.`);
  console.log("\nSummary:");
  console.log(`- /dining: ${diningContent.length} sections`);
  console.log(`- /beauty-salon: ${beautySalonContent.length} sections`);
  console.log(`- /fitness-therapy: ${fitnessTherapyContent.length} sections`);
  console.log(`- /courtyards-patios: ${courtyardsPatiosContent.length} sections`);
}

migrateAmenityPages()
  .then(() => {
    console.log("\n✅ Migration successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
