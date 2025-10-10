// Server-side script to reset FAQs
import { storage } from "./storage";

const stageSeniorFAQs = [
  {
    question: "What services does Stage Senior offer?",
    answer: "Stage Senior provides senior living communities and in-home care services across Colorado.",
    answerHtml: '<p>Stage Senior provides <a href="/communities" class="text-blue-600 hover:underline font-medium">senior living communities</a> offering Independent Living, Assisted Living, and Memory Care, as well as <a href="/in-home-care" class="text-blue-600 hover:underline font-medium">Healthy at Home in-home care services</a>. <a href="/about-us" class="text-blue-600 hover:underline font-medium">Learn more about us</a>.</p>',
    category: "About Us",
    communityId: null,
    sortOrder: 1,
    active: true
  },
  {
    question: "How do I schedule a tour?",
    answer: "Contact us online or call (303) 436-2300 to schedule a tour.",
    answerHtml: '<p>You can <a href="/contact" class="text-blue-600 hover:underline font-medium">schedule a tour online</a> or call us at <a href="tel:3034362300" class="text-blue-600 hover:underline font-medium">(303) 436-2300</a>. Tours are available at all of our <a href="/communities" class="text-blue-600 hover:underline font-medium">Colorado communities</a>.</p>',
    category: "Getting Started",
    communityId: null,
    sortOrder: 2,
    active: true
  },
  {
    question: "What levels of care do you offer?",
    answer: "We offer Independent Living, Assisted Living, and Memory Care depending on the community.",
    answerHtml: '<p>Stage Senior communities offer Independent Living, Assisted Living, and Memory Care. Specific care levels vary by location. <a href="/communities" class="text-blue-600 hover:underline font-medium">Explore our communities</a> to find the right fit.</p>',
    category: "Care Options",
    communityId: null,
    sortOrder: 3,
    active: true
  },
  {
    question: "What dining options are available?",
    answer: "All communities offer restaurant-style dining with chef-prepared meals.",
    answerHtml: '<p>All Stage Senior communities feature <a href="/dining" class="text-blue-600 hover:underline font-medium">restaurant-style dining</a> with chef-prepared meals, flexible dining times, and accommodations for special dietary needs.</p>',
    category: "Dining & Amenities",
    communityId: null,
    sortOrder: 4,
    active: true
  },
  {
    question: "What amenities do your communities offer?",
    answer: "Communities feature fitness centers, beauty salons, courtyards, and more.",
    answerHtml: '<p>Our communities include <a href="/fitness-therapy" class="text-blue-600 hover:underline font-medium">fitness and wellness facilities</a>, <a href="/beauty-salon" class="text-blue-600 hover:underline font-medium">full-service beauty salons</a>, <a href="/courtyards-patios" class="text-blue-600 hover:underline font-medium">beautiful outdoor spaces</a>, and more. Visit our <a href="/communities" class="text-blue-600 hover:underline font-medium">communities page</a> to explore specific amenities.</p>',
    category: "Dining & Amenities",
    communityId: null,
    sortOrder: 5,
    active: true
  },
  {
    question: "What safety features are in place?",
    answer: "We provide 24/7 staff, emergency response systems, and advanced monitoring technology.",
    answerHtml: '<p>Stage Senior communities prioritize <a href="/safety-with-dignity" class="text-blue-600 hover:underline font-medium">safety with dignity</a> through 24/7 licensed staff, emergency response systems, secure building access, and advanced monitoring technology.</p>',
    category: "Safety & Security",
    communityId: null,
    sortOrder: 6,
    active: true
  },
  {
    question: "Are pets allowed?",
    answer: "Many communities are pet-friendly. Contact us for specific pet policies.",
    answerHtml: '<p>Many Stage Senior communities welcome pets. Pet policies vary by location. <a href="/contact" class="text-blue-600 hover:underline font-medium">Contact us</a> or visit individual <a href="/communities" class="text-blue-600 hover:underline font-medium">community pages</a> for specific pet policies.</p>',
    category: "Lifestyle",
    communityId: null,
    sortOrder: 7,
    active: true
  },
  {
    question: "What activities and events are offered?",
    answer: "Communities offer a full calendar of activities, events, and outings.",
    answerHtml: '<p>Stage Senior communities provide engaging activities including fitness classes, arts and crafts, live entertainment, outings, and social events. <a href="/events" class="text-blue-600 hover:underline font-medium">View our events calendar</a> or visit <a href="/communities" class="text-blue-600 hover:underline font-medium">individual community pages</a> for details.</p>',
    category: "Lifestyle",
    communityId: null,
    sortOrder: 8,
    active: true
  }
];

const healthyAtHomeFAQs = [
  {
    question: "What is Healthy at Home?",
    answer: "Healthy at Home provides non-medical in-home care services throughout the Denver Metro area.",
    answerHtml: '<p><a href="/in-home-care" class="text-blue-600 hover:underline font-medium">Healthy at Home</a> is Stage Senior\'s in-home care service providing compassionate, non-medical care throughout the Denver Metro area, including personal care, homemaking, meal preparation, and companionship.</p>',
    category: "Healthy at Home",
    communityId: null,
    sortOrder: 9,
    active: true
  },
  {
    question: "What areas does Healthy at Home serve?",
    answer: "We serve the Denver Metro area including Denver, Aurora, Littleton, Golden, Westminster, and Arvada.",
    answerHtml: '<p>Healthy at Home serves the Denver Metro area including Denver, Aurora, Littleton, Golden, Westminster, and Arvada. <a href="/contact" class="text-blue-600 hover:underline font-medium">Contact us</a> to discuss your specific location and care needs.</p>',
    category: "Healthy at Home",
    communityId: null,
    sortOrder: 10,
    active: true
  },
  {
    question: "What personal care services are offered?",
    answer: "We provide compassionate assistance with bathing, dressing, grooming, and other daily personal care needs.",
    answerHtml: '<p>Our caregivers provide dignified assistance with bathing, dressing, grooming, toileting, and other personal hygiene needs while maintaining your independence. <a href="/in-home-care" class="text-blue-600 hover:underline font-medium">View all personal care services</a>.</p>',
    category: "Healthy at Home",
    communityId: null,
    sortOrder: 11,
    active: true
  },
  {
    question: "Do you help with meal preparation and homemaking?",
    answer: "Yes, we assist with meal preparation, light housekeeping, laundry, and keeping your home comfortable.",
    answerHtml: '<p>Our caregivers help with nutritious meal preparation, light housekeeping, laundry, and maintaining a clean, comfortable home environment. <a href="/in-home-care" class="text-blue-600 hover:underline font-medium">Learn about homemaking services</a>.</p>',
    category: "Healthy at Home",
    communityId: null,
    sortOrder: 12,
    active: true
  },
  {
    question: "Can you help with mobility and fall prevention?",
    answer: "Yes, we provide safe movement assistance and fall prevention support to maintain your active lifestyle.",
    answerHtml: '<p>Our caregivers assist with safe transfers, walking support, and implement fall prevention strategies to help you stay active and independent. <a href="/in-home-care" class="text-blue-600 hover:underline font-medium">Explore mobility support services</a>.</p>',
    category: "Healthy at Home",
    communityId: null,
    sortOrder: 13,
    active: true
  },
  {
    question: "Do you provide transportation and errands?",
    answer: "Yes, we help with medical appointments, grocery shopping, errands, and staying connected with your community.",
    answerHtml: '<p>Our caregivers provide transportation to medical appointments, assist with grocery shopping and errands, and offer meaningful companionship. Call <a href="tel:3032909000" class="text-blue-600 hover:underline font-medium">(303) 290-9000</a> to learn more.</p>',
    category: "Healthy at Home",
    communityId: null,
    sortOrder: 14,
    active: true
  },
  {
    question: "What is respite care?",
    answer: "Respite care gives family caregivers a break while ensuring continuous quality care for your loved one.",
    answerHtml: '<p>Family-caregiver respite provides temporary relief for primary caregivers, giving you the break you need while maintaining high-quality care. <a href="/in-home-care" class="text-blue-600 hover:underline font-medium">Learn about respite services</a>.</p>',
    category: "Healthy at Home",
    communityId: null,
    sortOrder: 15,
    active: true
  },
  {
    question: "Are caregivers employees or contractors?",
    answer: "All caregivers are direct employees who undergo comprehensive background checks and training.",
    answerHtml: '<p>Never contractors—all Healthy at Home caregivers are thoroughly vetted employees who undergo comprehensive background checks, rigorous training, and ongoing supervision. <a href="/in-home-care" class="text-blue-600 hover:underline font-medium">Learn about our caregiver standards</a>.</p>',
    category: "Healthy at Home",
    communityId: null,
    sortOrder: 16,
    active: true
  },
  {
    question: "How quickly can care start?",
    answer: "Same-day and next-day starts are often available with flexible scheduling.",
    answerHtml: '<p>We offer flexible scheduling with same-day and next-day starts often available. <a href="/contact" class="text-blue-600 hover:underline font-medium">Contact us</a> or call <a href="tel:3032909000" class="text-blue-600 hover:underline font-medium">(303) 290-9000</a> to schedule a free care assessment.</p>',
    category: "Healthy at Home",
    communityId: null,
    sortOrder: 17,
    active: true
  },
  {
    question: "Is Healthy at Home a franchise?",
    answer: "No, we are locally owned and operated in Colorado with local leadership.",
    answerHtml: '<p>Healthy at Home is not a franchise. We are Colorado-based and locally owned, bringing the same commitment to quality that families across the state have trusted for years. <a href="/about-us" class="text-blue-600 hover:underline font-medium">Learn more about us</a>.</p>',
    category: "Healthy at Home",
    communityId: null,
    sortOrder: 18,
    active: true
  },
  {
    question: "How do I get started with a care assessment?",
    answer: "Call (303) 290-9000 or contact us online to schedule your free care assessment.",
    answerHtml: '<p>Getting started is easy. Call <a href="tel:3032909000" class="text-blue-600 hover:underline font-medium">(303) 290-9000</a> or <a href="/contact" class="text-blue-600 hover:underline font-medium">contact us online</a> to schedule your free care assessment. We\'ll build a custom care plan within 24 hours.</p>',
    category: "Healthy at Home",
    communityId: null,
    sortOrder: 19,
    active: true
  },
  {
    question: "What makes Healthy at Home different?",
    answer: "Background-checked employees, local ownership, flexible schedules, and affiliation with Stage Senior.",
    answerHtml: '<p>As a Stage Senior affiliated service, we combine background-checked employee caregivers, local Colorado ownership, flexible care schedules, and the trusted quality families have relied on for years. <a href="/in-home-care" class="text-blue-600 hover:underline font-medium">Discover the Healthy at Home difference</a>.</p>',
    category: "Healthy at Home",
    communityId: null,
    sortOrder: 20,
    active: true
  }
];

export async function resetFAQs() {
  console.log("🗑️  Starting FAQ reset...\n");

  try {
    // Step 1: Delete all existing FAQs
    console.log("📋 Fetching and deleting existing FAQs...");
    const existingFAQs = await storage.getFaqs({});
    console.log(`Found ${existingFAQs.length} existing FAQs`);

    for (const faq of existingFAQs) {
      await storage.deleteFaq(faq.id);
    }
    console.log(`✅ Deleted ${existingFAQs.length} FAQs\n`);

    // Step 2: Create Stage Senior FAQs
    console.log("📝 Creating Stage Senior FAQs...");
    for (const faq of stageSeniorFAQs) {
      await storage.createFaq(faq as any);
      console.log(`✓ Created: "${faq.question}"`);
    }
    console.log(`\n✅ Created ${stageSeniorFAQs.length} Stage Senior FAQs\n`);

    // Step 3: Create Healthy at Home FAQs
    console.log("🏠 Creating Healthy at Home FAQs...");
    for (const faq of healthyAtHomeFAQs) {
      await storage.createFaq(faq as any);
      console.log(`✓ Created: "${faq.question}"`);
    }
    console.log(`\n✅ Created ${healthyAtHomeFAQs.length} Healthy at Home FAQs\n`);

    console.log("🎉 FAQ reset completed successfully!");
    console.log(`Total FAQs: ${stageSeniorFAQs.length + healthyAtHomeFAQs.length}`);

    return {
      success: true,
      deleted: existingFAQs.length,
      created: stageSeniorFAQs.length + healthyAtHomeFAQs.length
    };

  } catch (error) {
    console.error("\n❌ Error during FAQ reset:", error);
    throw error;
  }
}
