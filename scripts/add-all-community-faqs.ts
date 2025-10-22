import { db } from "../server/db";
import { faqs } from "@shared/schema";

const communityFAQs = {
  // Golden Pond Retirement Community
  "ac9dae44-d18f-4e96-b3bf-ba3d4fc406e9": [
    {
      question: "What types of senior living care does Golden Pond offer?",
      answer: "Golden Pond offers three levels of care: Independent Living with 39 units for active seniors, Assisted Living with 76 units for those who need daily support, and Memory Care with 15 specialized units for residents with Alzheimer's or dementia. Each level of care is designed to meet specific needs while maintaining dignity and independence.",
      category: "Living Options",
      sortOrder: 1
    },
    {
      question: "How much does it cost to live at Golden Pond?",
      answer: "Pricing at Golden Pond varies based on the level of care needed, apartment size, and specific services required. We offer personalized care plans to ensure you only pay for the services you need. For current pricing information and to discuss your specific situation, please call us at (303) 502-5554 to schedule a tour and consultation.",
      category: "Pricing",
      sortOrder: 2
    },
    {
      question: "Where is Golden Pond located and is it easy to access?",
      answer: "Golden Pond is located in Golden, Colorado, just 1.8 miles from Downtown Golden and 15 miles from Denver. Our beautiful 7-acre campus offers a peaceful setting while remaining easily accessible for family visits and convenient for residents who want to stay connected to the community.",
      category: "Location",
      sortOrder: 3
    },
    {
      question: "What amenities are available at Golden Pond?",
      answer: "Our 7-acre campus features restaurant-style dining, a modern fitness center, a full-service salon and spa, a movie theater, and a well-stocked library. Residents can enjoy beautifully landscaped grounds, common areas for socializing, and a variety of spaces designed for comfort and enrichment.",
      category: "Amenities",
      sortOrder: 4
    },
    {
      question: "Does Golden Pond provide transportation services?",
      answer: "Yes! We offer complimentary transportation to medical appointments on Mondays, Wednesdays, and Fridays within a 30-mile round trip. We also provide weekly organized trips to shopping centers, cultural events, and local attractions to keep residents active and engaged in the community.",
      category: "Transportation",
      sortOrder: 5
    },
    {
      question: "Can I bring my pet to Golden Pond?",
      answer: "Yes, small pets are welcome at Golden Pond! We understand how important pets are to our residents' well-being and happiness. Please contact us at (303) 502-5554 to discuss our pet policy and any size or breed restrictions.",
      category: "Pet Policy",
      sortOrder: 6
    },
    {
      question: "What is the dining experience like at Golden Pond?",
      answer: "Golden Pond features restaurant-style dining with chef-prepared meals served in our elegant dining room. We offer nutritious, delicious meals with varied menus that accommodate dietary needs and preferences. Residents enjoy quality food in a social setting that makes every meal an opportunity to connect with neighbors.",
      category: "Dining",
      sortOrder: 7
    },
    {
      question: "What activities and enrichment programs does Golden Pond offer?",
      answer: "We provide a robust calendar of activities including fitness classes, art programs, musical performances, educational seminars, gardening clubs, and social events. Our activities are designed to promote physical health, mental stimulation, and social connection. Residents can participate as much or as little as they choose.",
      category: "Activities",
      sortOrder: 8
    },
    {
      question: "How long has Golden Pond been serving the Golden community?",
      answer: "Golden Pond was established in 2004 and has been a trusted part of the Golden community for over 20 years. We are locally owned and operated, which means we're deeply invested in providing exceptional care and being good neighbors in the community we call home.",
      category: "About Us",
      sortOrder: 9
    },
    {
      question: "What healthcare services are available at Golden Pond?",
      answer: "Our assisted living and memory care residents receive personalized care from trained staff available around the clock. We provide medication management, assistance with daily activities, and coordination with healthcare providers. Our team works closely with residents, families, and medical professionals to ensure comprehensive care.",
      category: "Healthcare",
      sortOrder: 10
    },
    {
      question: "What makes Golden Pond's Memory Care program special?",
      answer: "Our Memory Care neighborhood has 15 specialized units designed specifically for residents with Alzheimer's and dementia. We provide a secure, engaging environment with specially trained staff who understand memory care needs. Our program focuses on maintaining dignity, reducing confusion, and creating meaningful daily experiences.",
      category: "Memory Care",
      sortOrder: 11
    },
    {
      question: "How do I start the process of moving to Golden Pond?",
      answer: "The first step is to schedule a tour of our community by calling (303) 502-5554. During your visit, you'll meet our team, see our amenities, and discuss your specific needs. We'll work with you to create a personalized care plan and guide you through every step of the move-in process.",
      category: "Move-In Process",
      sortOrder: 12
    }
  ],

  // The Gardens on Quail
  "b2c48ce7-11cb-4216-afdb-f2429ccae81f": [
    {
      question: "What types of care are available at The Gardens on Quail?",
      answer: "The Gardens on Quail offers Assisted Living with 56 units for seniors who need support with daily activities, and our specialized Memory Care neighborhood called \"Dallas Creek\" with 27 units dedicated to residents with Alzheimer's and dementia. Both programs provide personalized care in a comfortable, home-like setting.",
      category: "Living Options",
      sortOrder: 1
    },
    {
      question: "Does The Gardens on Quail offer respite care?",
      answer: "Yes! We offer respite care with a minimum stay of 2 weeks. Pricing is $350 for a 2-week stay or $250 per day for stays up to 30 days. This gives family caregivers a well-deserved break while ensuring their loved one receives professional care in a safe, engaging environment.",
      category: "Respite Care",
      sortOrder: 2
    },
    {
      question: "Where is The Gardens on Quail located?",
      answer: "We're located at 6447 Quail Street in Arvada, Colorado, near charming Olde Town Arvada. Our location offers easy access to shopping, dining, and cultural attractions while providing a peaceful neighborhood setting for our residents.",
      category: "Location",
      sortOrder: 3
    },
    {
      question: "What unique amenities does The Gardens on Quail offer?",
      answer: "Our community features a heated courtyard with a model train set, a greenhouse for gardening enthusiasts, a vegetable garden where residents can grow fresh produce, a full-service hair salon, a theater room for movie nights, and a putting green for golf lovers. These unique amenities create engaging experiences tailored to diverse interests.",
      category: "Amenities",
      sortOrder: 4
    },
    {
      question: "Are WiFi and cable TV included?",
      answer: "Yes! All residents at The Gardens on Quail enjoy free WiFi throughout the community and cable TV is included in your monthly rate. We believe staying connected with family, friends, and favorite entertainment is important for quality of life.",
      category: "Amenities",
      sortOrder: 5
    },
    {
      question: "What type of lease agreement does The Gardens on Quail require?",
      answer: "We operate on a month-to-month lease basis, providing flexibility for our residents and their families. This means you're not locked into a long-term contract and can adjust as care needs change.",
      category: "Lease Terms",
      sortOrder: 6
    },
    {
      question: "What dining options are available at The Gardens on Quail?",
      answer: "We provide chef-prepared, restaurant-style meals daily in our dining room. Our menus feature nutritious, delicious options that accommodate dietary restrictions and preferences. Dining is a social experience where residents can enjoy good food and great company.",
      category: "Dining",
      sortOrder: 7
    },
    {
      question: "When did The Gardens on Quail open?",
      answer: "The Gardens on Quail opened in 2013 and has been serving the Arvada community for over a decade. We've built a reputation for providing compassionate, personalized care in a beautiful, well-maintained setting.",
      category: "About Us",
      sortOrder: 8
    },
    {
      question: "What makes the Dallas Creek Memory Care neighborhood special?",
      answer: "Dallas Creek is our dedicated Memory Care neighborhood with 27 units designed specifically for residents with memory loss. The secure environment features specialized programming, trained staff who understand dementia care, and a layout that reduces confusion while promoting independence and engagement.",
      category: "Memory Care",
      sortOrder: 9
    },
    {
      question: "What activities can residents participate in at The Gardens on Quail?",
      answer: "We offer a diverse activity calendar including gardening in our greenhouse and vegetable garden, putting on our golf green, movie screenings in our theater, arts and crafts, fitness programs, musical entertainment, and social gatherings. Activities are designed to promote physical, mental, and social well-being.",
      category: "Activities",
      sortOrder: 10
    },
    {
      question: "How can I learn more or schedule a tour of The Gardens on Quail?",
      answer: "We'd love to show you around! Call us at (720) 864-1101 to schedule a personal tour. You'll meet our caring team, see our unique amenities like the heated courtyard and greenhouse, and learn how we can support your loved one's needs.",
      category: "Tours",
      sortOrder: 11
    },
    {
      question: "What services are included in the monthly rate at The Gardens on Quail?",
      answer: "Our monthly rate includes restaurant-style meals, housekeeping and laundry services, medication management, assistance with daily activities, free WiFi and cable TV, activities and entertainment, and 24-hour staff support. We create personalized care plans so you only pay for the level of assistance you need.",
      category: "Pricing",
      sortOrder: 12
    }
  ],

  // The Gardens at Columbine
  "dea2cbbe-32da-4774-a85b-5dd9286892ed": [
    {
      question: "What types of senior living does The Gardens at Columbine provide?",
      answer: "The Gardens at Columbine offers Assisted Living and Memory Care services. Our Memory Care program includes 26 private apartments specifically designed for residents with Alzheimer's and dementia, featuring secure environments and specialized care protocols.",
      category: "Living Options",
      sortOrder: 1
    },
    {
      question: "Where is The Gardens at Columbine located?",
      answer: "We're located in Littleton, Colorado, just 5 miles from Downtown Littleton and 15 miles from Denver. Our prime location on 3 acres of beautifully landscaped botanical gardens offers a peaceful setting while keeping residents close to family, shopping, and medical services.",
      category: "Location",
      sortOrder: 2
    },
    {
      question: "What makes The Gardens at Columbine's outdoor spaces special?",
      answer: "Our community sits on 3 acres of stunning botanical gardens featuring walking paths, seasonal flowers, mature trees, and peaceful seating areas. These gardens provide residents with a beautiful, therapeutic environment to enjoy nature, take walks, or simply relax outdoors.",
      category: "Amenities",
      sortOrder: 3
    },
    {
      question: "Are pets allowed at The Gardens at Columbine?",
      answer: "Yes! The Gardens at Columbine is pet-friendly. We understand the important role pets play in seniors' lives and welcome them as part of our community. Please contact us at (720) 740-1249 to discuss our pet policy details.",
      category: "Pet Policy",
      sortOrder: 4
    },
    {
      question: "What amenities are available at The Gardens at Columbine?",
      answer: "Our community features a full-service salon and barbershop, a well-stocked library, a fitness and rehabilitation center with modern equipment, and beautiful common areas for socializing. Combined with our 3-acre botanical gardens, we provide diverse spaces for relaxation, activity, and connection.",
      category: "Amenities",
      sortOrder: 5
    },
    {
      question: "What healthcare services does The Gardens at Columbine provide?",
      answer: "We offer 24/7 licensed nursing care, medication management, assistance with activities of daily living, and coordination with outside healthcare providers. Our trained staff provides personalized care based on each resident's individual needs and preferences.",
      category: "Healthcare",
      sortOrder: 6
    },
    {
      question: "Does The Gardens at Columbine offer spiritual support?",
      answer: "Yes, we provide chaplain services for residents who desire spiritual care and support. Our chaplain is available for one-on-one visits, spiritual counseling, and can help coordinate religious services. We respect and support residents of all faith backgrounds.",
      category: "Spiritual Care",
      sortOrder: 7
    },
    {
      question: "How long has The Gardens at Columbine been in operation?",
      answer: "The Gardens at Columbine was established in 2000 and has been serving the Littleton community for over 25 years. We are family-owned and operated, which means we bring a personal touch and long-term commitment to quality care.",
      category: "About Us",
      sortOrder: 8
    },
    {
      question: "What is included in the Memory Care program at The Gardens at Columbine?",
      answer: "Our Memory Care program features 26 private apartments in a secure environment designed specifically for residents with memory loss. We provide specialized programming, trained staff experienced in dementia care, structured routines, and therapeutic activities that promote engagement and preserve dignity.",
      category: "Memory Care",
      sortOrder: 9
    },
    {
      question: "What dining experience can residents expect?",
      answer: "We offer chef-prepared meals in our dining room with menus designed for nutrition, variety, and taste. Our culinary team accommodates dietary restrictions and personal preferences. Meals are served in a restaurant-style setting that encourages social interaction and makes dining a highlight of the day.",
      category: "Dining",
      sortOrder: 10
    },
    {
      question: "What activities and programs are available at The Gardens at Columbine?",
      answer: "We provide a comprehensive activities program including fitness classes in our rehabilitation center, gardening in our botanical gardens, arts and crafts, musical performances, educational programs, social events, and outings to local attractions. Our goal is to keep residents active, engaged, and connected.",
      category: "Activities",
      sortOrder: 11
    },
    {
      question: "How do I schedule a tour of The Gardens at Columbine?",
      answer: "We'd be delighted to show you our beautiful community and botanical gardens! Please call us at (720) 740-1249 to schedule a personal tour. You'll meet our caring team, see our amenities, and learn how our family-owned community can provide the perfect home for your loved one.",
      category: "Tours",
      sortOrder: 12
    }
  ],

  // Stonebridge Senior
  "d20c45d3-8201-476a-aeb3-9b941f717ccf": [
    {
      question: "What types of care does Stonebridge Senior offer?",
      answer: "Stonebridge Senior provides Assisted Living and Memory Care services in Arvada's beautiful Ralston Creek neighborhood. We focus on personalized, story-first care that honors each resident's unique life journey while providing the support they need.",
      category: "Living Options",
      sortOrder: 1
    },
    {
      question: "Where is Stonebridge Senior located?",
      answer: "Stonebridge Senior is located in Arvada's peaceful Ralston Creek neighborhood. Our setting offers a quiet, residential atmosphere while remaining close to shopping, healthcare, and all the amenities Arvada has to offer.",
      category: "Location",
      sortOrder: 2
    },
    {
      question: "Are there any current promotions at Stonebridge Senior?",
      answer: "Yes! For a limited time, new residents can receive $500 off their monthly rent for life. This exclusive offer provides significant long-term savings while ensuring you receive the same exceptional care and services. Contact us soon to learn more about this special promotion.",
      category: "Pricing",
      sortOrder: 3
    },
    {
      question: "What does 'story-first approach' mean at Stonebridge Senior?",
      answer: "Our story-first approach means we take time to learn about each resident's life history, preferences, routines, and what makes them unique. This deep understanding allows us to provide truly personalized care that respects individuality and creates meaningful daily experiences tailored to each person.",
      category: "Care Philosophy",
      sortOrder: 4
    },
    {
      question: "What amenities are available at Stonebridge Senior?",
      answer: "Our community features beautiful gardens with water features for peaceful outdoor enjoyment, secure courtyards perfect for safe strolling, comfortable common areas for socializing, and modern living spaces. We've designed every aspect of our community to feel like home while providing necessary care and support.",
      category: "Amenities",
      sortOrder: 5
    },
    {
      question: "What dining options does Stonebridge Senior provide?",
      answer: "We offer chef-prepared meals made with fresh ingredients and served in our dining room. Our culinary team creates diverse, delicious menus that accommodate dietary needs and preferences. We believe good food and social dining experiences are essential to quality of life.",
      category: "Dining",
      sortOrder: 6
    },
    {
      question: "Is WiFi and TV service included at Stonebridge Senior?",
      answer: "Yes! All residents have access to community WiFi and DirectTV HD service is included. We understand that staying connected and entertained is important, whether it's video calling family, browsing the internet, or watching favorite shows.",
      category: "Amenities",
      sortOrder: 7
    },
    {
      question: "What level of care is available at Stonebridge Senior?",
      answer: "We provide 24/7 licensed care from trained professionals who are always available to assist residents. Our care services include medication management, help with daily activities, and personalized support based on individual needs—all delivered with compassion and respect.",
      category: "Healthcare",
      sortOrder: 8
    },
    {
      question: "Does Stonebridge Senior accommodate individual routines and preferences?",
      answer: "Absolutely! We pride ourselves on offering flexible routines that adapt to each resident's preferences. Whether you're an early riser or night owl, prefer breakfast in your apartment or the dining room, we work to honor your lifestyle while providing the care you need.",
      category: "Lifestyle",
      sortOrder: 9
    },
    {
      question: "What makes Stonebridge Senior's Memory Care program unique?",
      answer: "Our Memory Care program combines our story-first approach with specialized dementia care in a secure environment. We use each resident's life story to create meaningful activities and routines. Our trained staff understands memory loss and provides compassionate care that preserves dignity and promotes engagement.",
      category: "Memory Care",
      sortOrder: 10
    },
    {
      question: "What activities and programs are offered at Stonebridge Senior?",
      answer: "We offer diverse activities including exercise programs, arts and crafts, music therapy, gardening in our beautiful outdoor spaces, social events, and outings to local attractions. Our programming is designed around residents' interests and abilities to promote engagement, joy, and connection.",
      category: "Activities",
      sortOrder: 11
    },
    {
      question: "How can I learn more about Stonebridge Senior or schedule a visit?",
      answer: "We invite you to visit and experience our warm, welcoming community firsthand. Call us to schedule a personal tour where you can see our beautiful gardens and courtyards, meet our caring team, and learn about our story-first approach to care. Don't forget to ask about our limited-time $500 monthly discount!",
      category: "Tours",
      sortOrder: 12
    }
  ]
};

async function addAllFAQs() {
  console.log("Starting to add FAQs for all communities...\n");
  
  let totalCreated = 0;
  let totalErrors = 0;

  for (const [communityId, faqList] of Object.entries(communityFAQs)) {
    console.log(`\nProcessing community: ${communityId}`);
    console.log(`Creating ${faqList.length} FAQs...`);
    
    for (const faqData of faqList) {
      try {
        await db.insert(faqs).values({
          communityId,
          question: faqData.question,
          answer: faqData.answer,
          category: faqData.category,
          sortOrder: faqData.sortOrder,
          active: true
        });
        
        totalCreated++;
        console.log(`✓ Created: ${faqData.question.substring(0, 60)}...`);
      } catch (error) {
        totalErrors++;
        console.error(`✗ Error creating FAQ: ${faqData.question.substring(0, 60)}...`);
        console.error(`  Error: ${error}`);
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("FAQ Creation Summary:");
  console.log("=".repeat(60));
  console.log(`Total FAQs created: ${totalCreated}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Communities updated: ${Object.keys(communityFAQs).length}`);
  console.log("=".repeat(60));

  return {
    totalCreated,
    totalErrors,
    communitiesUpdated: Object.keys(communityFAQs).length
  };
}

// Run the script
addAllFAQs()
  .then((result) => {
    console.log("\n✓ Script completed successfully!");
    console.log(`Created ${result.totalCreated} FAQs across ${result.communitiesUpdated} communities`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n✗ Script failed:", error);
    process.exit(1);
  });
