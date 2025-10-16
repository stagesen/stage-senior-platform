import { db } from "../server/db";
import { pageContentSections } from "@shared/schema";

async function migrateServicesPages() {
  console.log("Starting Services Pages migration...\n");

  // 1. CHAPLAINCY PAGE CONTENT SECTIONS
  console.log("Migrating /services/chaplaincy page...");
  
  await db.insert(pageContentSections).values([
    {
      pagePath: "/services/chaplaincy",
      sectionType: "hero_section",
      sectionKey: "vision_for_spiritual_care",
      title: "Our Vision for Spiritual Care",
      content: {
        heading: "Our Vision for Spiritual Care",
        description: "At Stage Management, we believe that genuine care extends beyond physical comfort to embrace emotional and spiritual well-being. Through our partnership with Senior Living Chaplains, a division of Marketplace Chaplains, we provide dedicated spiritual support that welcomes and nurtures residents of all faiths and backgrounds.",
        imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
      },
      sortOrder: 1,
      active: true
    },
    {
      pagePath: "/services/chaplaincy",
      sectionType: "section_header",
      sectionKey: "chaplain_services_header",
      title: "Professional Chaplain Services Header",
      content: {
        heading: "Professional Chaplain Services",
        subheading: "Our specially trained chaplains offer:"
      },
      sortOrder: 2,
      active: true
    },
    {
      pagePath: "/services/chaplaincy",
      sectionType: "benefit_cards",
      sectionKey: "chaplain_services_cards",
      title: "Chaplain Services Cards",
      content: {
        cards: [
          { 
            title: "24/7 Support", 
            description: "24/7 emotional and spiritual support", 
            icon: "Clock" 
          },
          { 
            title: "Personal Counseling", 
            description: "Confidential personal counseling", 
            icon: "Shield" 
          },
          { 
            title: "Weekly Services", 
            description: "Weekly ceremonies and services", 
            icon: "Calendar" 
          },
          { 
            title: "Crisis Support", 
            description: "Crisis response and support", 
            icon: "Heart" 
          },
          { 
            title: "Community Visits", 
            description: "Regular community visits", 
            icon: "Users" 
          }
        ]
      },
      sortOrder: 3,
      active: true
    },
    {
      pagePath: "/services/chaplaincy",
      sectionType: "cta",
      sectionKey: "stage_cares_cta",
      title: "Stage Cares CTA",
      content: {
        heading: "Community Care Through Stage Cares",
        description: "Our commitment to compassionate care extends beyond our residents through Stage Cares, our community impact initiative. This employee-funded benevolence program provides crucial support to community team members facing unexpected hardships. We also actively engage with both local and international non-profit organizations, donating time, money, and resources to create positive change beyond our walls.",
        buttonText: "Explore Stage Cares Foundation",
        buttonLink: "/stage-cares"
      },
      sortOrder: 4,
      active: true
    }
  ]);

  console.log("✓ Chaplaincy page migrated\n");

  // 2. LONG-TERM CARE PAGE CONTENT SECTIONS
  console.log("Migrating /services/long-term-care page...");
  
  await db.insert(pageContentSections).values([
    {
      pagePath: "/services/long-term-care",
      sectionType: "feature_list",
      sectionKey: "service_highlights",
      title: "Service Highlights",
      content: {
        items: [
          { title: "Expert Policy Review", description: "Comprehensive analysis of your coverage" },
          { title: "Streamlined Claims Processing", description: "Efficient documentation and filing" },
          { title: "Clinical Certification Support", description: "Direct coordination with insurers" },
          { title: "Monthly Claims Management", description: "Ongoing documentation processing" }
        ]
      },
      sortOrder: 1,
      active: true
    },
    {
      pagePath: "/services/long-term-care",
      sectionType: "hero_section",
      sectionKey: "comprehensive_support_process",
      title: "Our Comprehensive Support Process",
      content: {
        heading: "Our Comprehensive Support Process",
        description: "Our experienced team provides comprehensive support to help you maximize your long-term care insurance benefits. From initial policy review through ongoing claims management, we handle all aspects of the insurance process so you can focus on what matters most.",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
      },
      sortOrder: 2,
      active: true
    },
    {
      pagePath: "/services/long-term-care",
      sectionType: "benefit_cards",
      sectionKey: "service_details",
      title: "Service Details",
      content: {
        cards: [
          { 
            title: "Expert Policy Review", 
            description: "We thoroughly analyze your policy to identify all available benefits and coverage options, helping you make informed decisions about your care.", 
            icon: "FileText" 
          },
          { 
            title: "Streamlined Claims Processing", 
            description: "From initial filing through ongoing management, we handle all documentation and submissions to ensure prompt, accurate processing of your claims.", 
            icon: "ClipboardCheck" 
          },
          { 
            title: "Clinical Certification Support", 
            description: "Our clinical team works directly with insurance providers to facilitate initial certification and maintain ongoing coverage eligibility.", 
            icon: "Shield" 
          },
          { 
            title: "Monthly Claims Management", 
            description: "We process all required monthly documentation, coordinating directly with insurance companies to ensure consistent, timely payments.", 
            icon: "Calendar" 
          }
        ]
      },
      sortOrder: 3,
      active: true
    },
    {
      pagePath: "/services/long-term-care",
      sectionType: "text_block",
      sectionKey: "contact_section",
      title: "Contact Information",
      content: {
        text: `<div class="contact-info">
          <h2>Contact Our Claims Team</h2>
          <p>Let our experienced team help you navigate your long-term care insurance benefits. Contact us today to learn how we can assist you.</p>
          <div class="contact-details">
            <div class="contact-item">
              <strong>Phone:</strong> <a href="tel:3036473914">(303) 647-3914</a>
            </div>
            <div class="contact-item">
              <strong>Fax:</strong> (303) 648-6763
            </div>
            <div class="contact-item">
              <strong>Email:</strong> <a href="mailto:ltc@stagesenior.com">ltc@stagesenior.com</a>
            </div>
          </div>
        </div>`
      },
      sortOrder: 4,
      active: true
    }
  ]);

  console.log("✓ Long-term care page migrated\n");

  // 3. MANAGEMENT PAGE CONTENT SECTIONS
  console.log("Migrating /services/management page...");
  
  await db.insert(pageContentSections).values([
    {
      pagePath: "/services/management",
      sectionType: "hero_section",
      sectionKey: "management_philosophy",
      title: "Our Management Philosophy",
      content: {
        heading: "Our Management Philosophy",
        description: "We believe that senior living should be a chapter of life marked by dignity, purpose, and joy. Our management approach focuses on creating environments where residents thrive, families find peace of mind, and staff members grow professionally.",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
      },
      sortOrder: 1,
      active: true
    },
    {
      pagePath: "/services/management",
      sectionType: "section_header",
      sectionKey: "operational_excellence_header",
      title: "Operational Excellence Header",
      content: {
        heading: "Operational Excellence",
        subheading: ""
      },
      sortOrder: 2,
      active: true
    },
    {
      pagePath: "/services/management",
      sectionType: "feature_grid",
      sectionKey: "operational_excellence_pillars",
      title: "Operational Excellence Pillars",
      content: {
        features: [
          { 
            title: "Comprehensive Operating Systems", 
            description: "• Sophisticated management protocols that ensure consistency and quality\n• Performance tracking and transparent reporting\n• Proactive maintenance and property management\n• Integrated technology solutions for enhanced care delivery", 
            icon: "" 
          },
          { 
            title: "Service Excellence", 
            description: "• Premium dining experiences with chef-crafted menus\n• Engaging activity programs that promote social connection\n• Professional housekeeping and maintenance services\n• Personalized care plans that adapt to changing needs", 
            icon: "" 
          },
          { 
            title: "Team Development", 
            description: "• Ongoing professional training and advancement opportunities\n• Competitive compensation and benefits\n• Supportive work environment that promotes retention\n• Regular team recognition and appreciation programs", 
            icon: "" 
          }
        ],
        columns: 3
      },
      sortOrder: 3,
      active: true
    },
    {
      pagePath: "/services/management",
      sectionType: "text_block",
      sectionKey: "proven_track_record",
      title: "Proven Track Record",
      content: {
        text: `<h2>Proven Track Record</h2>
<p>Our hands-on management approach has created a portfolio of successful communities throughout the Denver metro area. We maintain direct accessibility to both our on-site staff and investors, ensuring alignment with our high standards of care and service.</p>`
      },
      sortOrder: 4,
      active: true
    },
    {
      pagePath: "/services/management",
      sectionType: "section_header",
      sectionKey: "service_areas_header",
      title: "Service Areas Header",
      content: {
        heading: "Our Service Areas",
        subheading: "Comprehensive solutions for every aspect of senior living management"
      },
      sortOrder: 5,
      active: true
    },
    {
      pagePath: "/services/management",
      sectionType: "feature_grid",
      sectionKey: "service_areas_grid",
      title: "Service Areas Grid",
      content: {
        features: [
          { 
            title: "Financial Management & Optimization", 
            description: "We drive success through strategic budgeting and revenue optimization. Our transparent reporting and risk management protect your investment while maximizing operational efficiency.", 
            icon: "TrendingUp" 
          },
          { 
            title: "Operational Excellence", 
            description: "We maintain exceptional standards through proactive quality assurance and regulatory compliance. Our integrated technology and maintenance programs ensure smooth, efficient operations.", 
            icon: "Building2" 
          },
          { 
            title: "Clinical Care Management", 
            description: "Our comprehensive care protocols adapt to each resident's evolving needs. Through healthcare partnerships and staff training, we deliver consistent, high-quality care.", 
            icon: "Heart" 
          },
          { 
            title: "Resident Experience Enhancement", 
            description: "We create engaging activities and premium dining experiences that residents love. Our life enrichment programs and family communication systems ensure active, connected communities.", 
            icon: "Users" 
          },
          { 
            title: "Marketing & Occupancy Growth", 
            description: "We build strong occupancy through targeted marketing and community outreach. Our sales training and referral networks help communities thrive and grow.", 
            icon: "BarChart3" 
          },
          { 
            title: "Staffing & Human Resources", 
            description: "We attract and retain exceptional teams through strategic recruitment and development. Our engagement initiatives create positive cultures where staff excel.", 
            icon: "Briefcase" 
          }
        ],
        columns: 3
      },
      sortOrder: 6,
      active: true
    }
  ]);

  console.log("✓ Management page migrated\n");

  console.log("✅ All Services pages migrated successfully!");
}

migrateServicesPages()
  .then(() => {
    console.log("\nMigration complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
