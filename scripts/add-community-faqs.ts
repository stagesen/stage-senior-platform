#!/usr/bin/env tsx

// Script to add community-specific FAQs to the database

const API_BASE_URL = "http://localhost:5000";

interface Community {
  id: string;
  name: string;
  slug: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
  communityId?: string;
  sortOrder: number;
  active: boolean;
}

// FAQ data for each community
const communityFAQs = {
  "the-gardens-at-columbine": [
    {
      question: "Where exactly are you, and how easy is it to visit?",
      answer: "We're located in Littleton—about 10 minutes to Downtown Littleton and 15 miles to Downtown Denver, with quick access to Santa Fe Dr and C-470. Tours can be in-person or virtual.",
      category: "Location & Visiting"
    },
    {
      question: "What living options do you actually have?",
      answer: "Assisted Living and a secure Memory Care neighborhood (122 total apartments: 96 AL / 26 MC). If needs change, you don't have to move across town—we handle the transition here.",
      category: "Care Levels"
    },
    {
      question: "How 'homey' does it feel day-to-day?",
      answer: "Expect a true garden campus—private courtyards, walking paths, and patio spaces—plus a calendar built for connection (Happy Hour Fridays, family brunches, holiday events).",
      category: "Living Experience"
    },
    {
      question: "Can Mom keep her doctor? What medical help comes in?",
      answer: "Yes—families often keep primary physicians. We also coordinate concierge physicians and on-site rehab/therapies to reduce outside trips.",
      category: "Medical & Healthcare"
    },
    {
      question: "Is dining flexible? Can we share a meal during a tour?",
      answer: "Restaurant-style meals daily with in-room delivery on request—and we regularly host prospective families for a complimentary lunch during tours.",
      category: "Dining"
    },
    {
      question: "Transportation for appointments?",
      answer: "Yes—scheduled transportation for medical visits and local errands is included.",
      category: "Transportation"
    },
    {
      question: "Pets—can Dad bring his dog?",
      answer: "We're pet-friendly; residents routinely enjoy pet programs and visits.",
      category: "Pet Policy"
    },
    {
      question: "Spiritual support available?",
      answer: "Yes. Beyond local faith options, Stage Senior offers an optional Chaplain Program via Senior Living Chaplains for residents, families, and staff.",
      category: "Spiritual Care"
    },
    {
      question: "New to Littleton? What's nearby for seniors and caregivers?",
      answer: "Use our Littleton Senior Guide for local healthcare, transportation (RTD Access-a-Ride), activities, and caregiver support. For dementia support and classes, the Alzheimer's Association Colorado chapter is excellent.",
      category: "Local Resources"
    },
    {
      question: "How do we take the next step—today?",
      answer: "Grab a virtual tour or book a visit; we'll talk apartment types, current availability, and a personalized care plan.",
      category: "Getting Started"
    }
  ],
  "the-gardens-on-quail": [
    {
      question: "What kind of community is this, and where?",
      answer: "An upscale Assisted Living & Memory Care community in Arvada, minutes from Olde Town—quiet neighborhood, easy access for family.",
      category: "Location & Overview"
    },
    {
      question: "What will my mom's day look like?",
      answer: "Clubs, art therapy, pet interaction, live music, and Memory-Care-specific engagement (balloon volleyball, hallway bowling)—plus seasonal events (luau, craft fairs).",
      category: "Daily Life & Activities"
    },
    {
      question: "Is it pet-friendly?",
      answer: "Yes—bring the furry friend. (Respite guests can, too.)",
      category: "Pet Policy"
    },
    {
      question: "Any standout amenities we should know about?",
      answer: "Heated courtyard with a working train set, greenhouse, putting green, salon, workout center, library, theater—designed to feel lively and welcoming.",
      category: "Amenities"
    },
    {
      question: "What if care needs change?",
      answer: "We coordinate seamless transitions inside the community; staff and directors stay closely involved. Concierge physicians and on-site allied health providers visit regularly.",
      category: "Care Transitions"
    },
    {
      question: "Short-term or respite stays while we figure things out?",
      answer: "Yes—two-week minimum respite stays with full access to activities and amenities.",
      category: "Respite Care"
    },
    {
      question: "Spiritual care?",
      answer: "On-site chapel support plus Stage Senior's Chaplain Program (optional, all faiths welcome).",
      category: "Spiritual Care"
    },
    {
      question: "Dining—can she eat in her suite if needed?",
      answer: "Chef-crafted, restaurant-style meals daily; in-suite delivery is available. (Families often join for a meal during tours.)",
      category: "Dining"
    },
    {
      question: "New to Arvada? Where should we start?",
      answer: "See our Arvada Senior Guide for local healthcare, activities, transportation, and more. For dementia education and 24/7 helpline (800-272-3900), tap the Alzheimer's Association Colorado.",
      category: "Local Resources"
    },
    {
      question: "Need a decision framework you can print?",
      answer: "Download the Decision Guide (care level quiz, comparison sheets, visit checklist).",
      category: "Resources & Tools"
    }
  ],
  "golden-pond": [
    {
      question: "Who are you a good fit for?",
      answer: "Independent Living, Assisted Living, and Memory Care on one campus—so couples with different needs can stay close and residents can 'age in place' with familiar faces.",
      category: "Care Levels"
    },
    {
      question: "Where are you and what's around?",
      answer: "Located in Golden, just 1.8 miles from Downtown Golden with views of North Table Mountain.",
      category: "Location"
    },
    {
      question: "How active is the lifestyle?",
      answer: "Think happy hours, live music, clubs, scenic drives, and special events (even Memory Care Prom). Family can join for larger celebrations.",
      category: "Activities & Lifestyle"
    },
    {
      question: "Does Memory Care have its own space and programming?",
      answer: "Yes—The Meadows Memory Care has 15 private studios, secure courtyards, daily engagement, and trained staff 24/7.",
      category: "Memory Care"
    },
    {
      question: "Pets—can Dad bring his dog?",
      answer: "Yes—Golden Pond is pet-friendly across levels of care.",
      category: "Pet Policy"
    },
    {
      question: "Dining options for my mom (and us)?",
      answer: "Restaurant-style dining with varied menus and the ability to dine in your apartment; families are welcome to share a meal during tours.",
      category: "Dining"
    },
    {
      question: "Transportation for appointments and outings?",
      answer: "Scheduled transportation is included. (For broader Denver-metro mobility, seniors can also look at RTD's Access-a-Ride and Senior Shopper.)",
      category: "Transportation"
    },
    {
      question: "Local resources we shouldn't miss?",
      answer: "Use our Golden Senior Guide (healthcare, transit, activities, faith, volunteering). City events are easy to plug into year-round.",
      category: "Local Resources"
    },
    {
      question: "How do we tour and talk specifics (pricing, availability)?",
      answer: "Book a virtual or in-person tour; we'll walk floor plans, current openings, and your care plan together.",
      category: "Getting Started"
    },
    {
      question: "Want a printable decision toolkit?",
      answer: "Download our Decision Guide (care-level quiz, community comparison, visit checklist).",
      category: "Resources & Tools"
    }
  ],
  "stonebridge-senior": [
    {
      question: "What makes Stonebridge feel different?",
      answer: "Your Story First®: before services or schedules, we learn the resident's routines, history, and family traditions, then tailor care (and keep updating it with you).",
      category: "Our Approach"
    },
    {
      question: "Where are you and how do we visit?",
      answer: "Located in Arvada, CO. Same-day and next-day tours are common—call or schedule online.",
      category: "Location & Tours"
    },
    {
      question: "What care levels do you offer?",
      answer: "Assisted Living and secure Memory Care, with 24/7 trained staff and an activities program that adapts to abilities.",
      category: "Care Levels"
    },
    {
      question: "What's daily life like?",
      answer: "Three chef-prepared meals, clubs and outings, music and exercise, garden time, faith services, and family events. See the activities calendar and sample menu anytime.",
      category: "Daily Life"
    },
    {
      question: "Dietary needs and family meals?",
      answer: "We support special diets; there's a private dining room for family gatherings and celebrations.",
      category: "Dining"
    },
    {
      question: "Medical support and emergencies?",
      answer: "We coordinate visiting physicians and allied health (PT/OT/speech, podiatry, mobile dental, pharmacy). Apartments have emergency response; staff are on-site 24/7 with established protocols.",
      category: "Medical & Healthcare"
    },
    {
      question: "Is Stonebridge pet-friendly?",
      answer: "Ask the team about current pet guidelines; many families choose Stonebridge because it balances home-like warmth with safety. (Our testimonials page gives a feel for the culture.)",
      category: "Pet Policy"
    },
    {
      question: "Spiritual support?",
      answer: "Stage Senior's optional Chaplain Program is available across our communities for residents, families, and staff.",
      category: "Spiritual Care"
    },
    {
      question: "New to Arvada? What resources help families most?",
      answer: "Start with our Local Area Guide and the Arvada Senior Guide (care, transportation, activities). For dementia education and a 24/7 helpline, use the Alzheimer's Association Colorado chapter.",
      category: "Local Resources"
    },
    {
      question: "Finances—any benefits we should look into?",
      answer: "If the resident is a wartime veteran or surviving spouse, ask your advisor about VA Pension with Aid & Attendance; it can offset care costs for those who qualify. (We can't determine eligibility, but these are the official starting points.)",
      category: "Financial Assistance"
    }
  ]
};

async function fetchCommunities(): Promise<Community[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/communities?active=true`);
    if (!response.ok) {
      throw new Error(`Failed to fetch communities: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

async function createFAQ(faq: FAQ): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/faqs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(faq)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create FAQ: ${errorText}`);
    }

    const createdFaq = await response.json();
    console.log(`✓ Created FAQ: "${faq.question}" for community`);
  } catch (error) {
    console.error(`✗ Failed to create FAQ: "${faq.question}"`, error);
  }
}

async function main() {
  console.log("Starting FAQ import...\n");

  try {
    // Fetch all communities
    console.log("Fetching communities...");
    const communities = await fetchCommunities();
    console.log(`Found ${communities.length} communities\n`);

    // Process each community's FAQs
    for (const community of communities) {
      const faqs = communityFAQs[community.slug as keyof typeof communityFAQs];

      if (!faqs) {
        console.log(`⚠ No FAQs defined for ${community.name} (${community.slug})\n`);
        continue;
      }

      console.log(`\n📝 Adding FAQs for ${community.name}...`);
      console.log(`   Found ${faqs.length} FAQ items`);

      // Add each FAQ
      for (let i = 0; i < faqs.length; i++) {
        const faqData: FAQ = {
          ...faqs[i],
          communityId: community.id,
          sortOrder: i + 1,
          active: true
        };

        await createFAQ(faqData);

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`✓ Completed FAQs for ${community.name}\n`);
    }

    console.log("\n✅ FAQ import completed successfully!");

  } catch (error) {
    console.error("\n❌ Error during FAQ import:", error);
    process.exit(1);
  }
}

// Run the script
main();