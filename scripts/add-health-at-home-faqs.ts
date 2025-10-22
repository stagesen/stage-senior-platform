import { db } from "../server/db";
import { faqs } from "@shared/schema";

async function addHealthAtHomeFAQs() {
  console.log("Adding Health at Home FAQs...");

  const healthAtHomeFAQs = [
    {
      question: "What services does Health at Home provide?",
      answer: "Health at Home offers comprehensive in-home senior care services including personal care (bathing, dressing, grooming), companion care, meal preparation, light housekeeping, medication management, transportation to appointments, and skilled nursing care. We also provide specialized services such as dementia care, physical therapy, and 24/7 live-in care options tailored to your individual needs.",
      category: "Services",
      sort: 1,
      active: true,
    },
    {
      question: "What areas does Health at Home serve?",
      answer: "We proudly serve seniors across multiple counties in Florida, including Palm Beach County, Broward County, Martin County, St. Lucie County, and Indian River County. Our caregivers are available 7 days a week to provide in-home care services throughout these communities.",
      category: "Service Areas",
      sort: 2,
      active: true,
    },
    {
      question: "Are your caregivers qualified and background-checked?",
      answer: "Yes, absolutely. All of our caregivers are personally interviewed, fully insured, and have completed comprehensive criminal record checks. Our team includes trained Housekeepers, Caregivers, Care Aides, and Licensed Nurses (RNs and LPNs) who receive ongoing training to provide the highest quality care.",
      category: "Caregivers",
      sort: 3,
      active: true,
    },
    {
      question: "How quickly can care services begin?",
      answer: "Emergency respite relief can usually begin within 24 hours of your initial call. For standard care arrangements, we work quickly to match you with the right caregiver and can typically start services within a few days. All services can be arranged on a short-term or long-term basis based on your needs.",
      category: "Getting Started",
      sort: 4,
      active: true,
    },
    {
      question: "What is the difference between companion care and personal care?",
      answer: "Companion care focuses on social interaction, companionship, and assistance with activities like shopping, errands, meal preparation, and light housekeeping. Personal care includes all companion services plus hands-on assistance with activities of daily living such as bathing, dressing, grooming, mobility assistance, and medication management.",
      category: "Services",
      sort: 5,
      active: true,
    },
    {
      question: "Does Health at Home provide dementia and Alzheimer's care?",
      answer: "Yes, we offer specialized dementia and Alzheimer's care with caregivers who have advanced training in memory loss care. Our compassionate team provides 24/7 support, creating a safe and structured environment that reduces stress for both the individual and their family while maintaining dignity and quality of life.",
      category: "Specialized Care",
      sort: 6,
      active: true,
    },
    {
      question: "What does skilled nursing care include?",
      answer: "Our skilled nursing services are provided by Registered Nurses (RNs) and Licensed Practical Nurses (LPNs) and include wound care, post-surgical recovery support, medication management, chronic disease management (diabetes, COPD, heart failure), IV therapy, and coordination with physicians and specialists for complex medical conditions.",
      category: "Specialized Care",
      sort: 7,
      active: true,
    },
    {
      question: "Can I receive physical therapy at home?",
      answer: "Yes! We offer in-home physical therapy services delivered by licensed and experienced physical therapists. Treatment plans are customized to your specific needs and goals, helping you recover from surgery, injury, or illness while staying in the comfort and convenience of your own home.",
      category: "Specialized Care",
      sort: 8,
      active: true,
    },
    {
      question: "What are the care schedule options?",
      answer: "We offer flexible scheduling to meet your needs, including part-time care (a few hours daily), full-time care, 24-hour care, and live-in care arrangements. Services are available 7 days a week, and schedules can be adjusted on short notice to accommodate changing needs or emergencies.",
      category: "Scheduling",
      sort: 9,
      active: true,
    },
    {
      question: "Does insurance cover Health at Home services?",
      answer: "Many of our services are covered by Medicare and Medicaid, depending on your eligibility and the type of care needed. We accept most insurance types and work with you to understand your coverage options. Our team can help you navigate insurance questions and explore payment options during your care consultation.",
      category: "Pricing & Insurance",
      sort: 10,
      active: true,
    },
    {
      question: "How do I get started with Health at Home?",
      answer: "Getting started is easy! Simply call us at (772) 288-7386 or contact us online to schedule a free care consultation. One of our talented specialists will assess your needs, answer your questions, and create a customized care plan that's right for you or your loved one.",
      category: "Getting Started",
      sort: 11,
      active: true,
    },
    {
      question: "Can family members be involved in the care plan?",
      answer: "Absolutely! We believe family involvement is essential to providing the best care. We work closely with family members to develop and adjust care plans, provide regular updates on your loved one's well-being, and welcome your input and feedback. Our goal is to support both seniors and their families throughout the care journey.",
      category: "Family Involvement",
      sort: 12,
      active: true,
    },
  ];

  try {
    for (const faq of healthAtHomeFAQs) {
      await db.insert(faqs).values(faq);
      console.log(`✓ Added FAQ: "${faq.question}"`);
    }

    console.log("\n✅ Successfully added all 12 Health at Home FAQs!");
    console.log("These are general FAQs (not community-specific) and will be available platform-wide.");
  } catch (error) {
    console.error("❌ Error adding FAQs:", error);
    throw error;
  }
}

addHealthAtHomeFAQs()
  .then(() => {
    console.log("\n🎉 Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error);
    process.exit(1);
  });
