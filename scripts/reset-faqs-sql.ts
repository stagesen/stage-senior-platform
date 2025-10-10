#!/usr/bin/env tsx

// SQL-based script to reset FAQs

import { Pool } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Stage Senior FAQs
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

// Healthy at Home FAQs
const healthyAtHomeFAQs = [
  {
    question: "What is Healthy at Home?",
    answer: "Healthy at Home provides non-medical in-home care services throughout the Denver Metro area.",
    answerHtml: '<p><a href="/in-home-care" class="text-blue-600 hover:underline font-medium">Healthy at Home</a> is Stage Senior\'s in-home care service providing compassionate, non-medical care throughout the Denver Metro area, including personal care, homemaking, meal preparation, and companionship.</p>',
    category: "About",
    communityId: "healthyathome",
    sortOrder: 1,
    active: true
  },
  {
    question: "What areas does Healthy at Home serve?",
    answer: "We serve the Denver Metro area including Denver, Aurora, Littleton, Golden, Westminster, and Arvada.",
    answerHtml: '<p>Healthy at Home serves the Denver Metro area including Denver, Aurora, Littleton, Golden, Westminster, and Arvada. <a href="/contact" class="text-blue-600 hover:underline font-medium">Contact us</a> to discuss your specific location and care needs.</p>',
    category: "Service Area",
    communityId: "healthyathome",
    sortOrder: 2,
    active: true
  },
  {
    question: "What services does Healthy at Home provide?",
    answer: "We provide personal care, homemaking, meal prep, medication reminders, mobility assistance, transportation, and companionship.",
    answerHtml: '<p>Services include personal care assistance, light housekeeping, meal preparation, medication reminders, mobility support, transportation, and companionship. <a href="/in-home-care" class="text-blue-600 hover:underline font-medium">Learn more about our services</a>.</p>',
    category: "Services",
    communityId: "healthyathome",
    sortOrder: 3,
    active: true
  },
  {
    question: "How quickly can care start?",
    answer: "Same-day and next-day starts are often available.",
    answerHtml: '<p>We offer flexible scheduling with same-day and next-day starts often available. <a href="/contact" class="text-blue-600 hover:underline font-medium">Contact us</a> or call <a href="tel:3032909000" class="text-blue-600 hover:underline font-medium">(303) 290-9000</a> to schedule a free care assessment.</p>',
    category: "Getting Started",
    communityId: "healthyathome",
    sortOrder: 4,
    active: true
  },
  {
    question: "Are caregivers background checked?",
    answer: "Yes, all caregivers are employees who undergo thorough background checks.",
    answerHtml: '<p>Yes. All Healthy at Home caregivers are direct employees (not contractors) who undergo comprehensive background checks and training. <a href="/in-home-care" class="text-blue-600 hover:underline font-medium">Learn more about our standards</a>.</p>',
    category: "Caregivers",
    communityId: "healthyathome",
    sortOrder: 5,
    active: true
  }
];

async function main() {
  console.log("🗑️  Starting FAQ reset via SQL...\n");

  const client = await pool.connect();

  try {
    // Step 1: Delete all existing FAQs
    console.log("📋 Deleting all existing FAQs...");
    await client.query('DELETE FROM faqs');
    console.log("✅ Deleted all existing FAQs\n");

    // Step 2: Insert Stage Senior FAQs
    console.log("📝 Creating Stage Senior FAQs...");
    for (const faq of stageSeniorFAQs) {
      await client.query(
        `INSERT INTO faqs (question, answer, answer_html, category, community_id, sort_order, active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [faq.question, faq.answer, faq.answerHtml, faq.category, faq.communityId, faq.sortOrder, faq.active]
      );
      console.log(`✓ Created: "${faq.question}"`);
    }
    console.log(`\n✅ Created ${stageSeniorFAQs.length} Stage Senior FAQs\n`);

    // Step 3: Insert Healthy at Home FAQs
    console.log("🏠 Creating Healthy at Home FAQs...");
    for (const faq of healthyAtHomeFAQs) {
      await client.query(
        `INSERT INTO faqs (question, answer, answer_html, category, community_id, sort_order, active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [faq.question, faq.answer, faq.answerHtml, faq.category, faq.communityId, faq.sortOrder, faq.active]
      );
      console.log(`✓ Created: "${faq.question}"`);
    }
    console.log(`\n✅ Created ${healthyAtHomeFAQs.length} Healthy at Home FAQs\n`);

    console.log("🎉 FAQ reset completed successfully!");
    console.log(`\nTotal FAQs: ${stageSeniorFAQs.length + healthyAtHomeFAQs.length}`);

  } catch (error) {
    console.error("\n❌ Error during FAQ reset:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
