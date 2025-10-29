import { useEffect } from "react";
import { Phone, Mail, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PageHero } from "@/components/PageHero";
import CommunitiesCarousel from "@/components/CommunitiesCarousel";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import { setMetaTags } from "@/lib/metaTags";
import type { Community, PageContentSection } from "@shared/schema";

export default function LongTermCare() {
  useEffect(() => {
    const baseUrl = window.location.origin;
    setMetaTags({
      title: "Long-Term Care Planning & Services | Stage Senior",
      description: "Comprehensive long-term care solutions for seniors. Professional guidance for assisted living, memory care, and extended care planning.",
      canonicalUrl: `${baseUrl}/services/long-term-care`,
      ogTitle: "Long-Term Care Planning & Services",
      ogDescription: "Comprehensive long-term care solutions for seniors. Professional guidance for assisted living, memory care, and extended care planning.",
      ogType: "website",
      ogUrl: `${baseUrl}/services/long-term-care`,
      ogSiteName: "Stage Senior Living"
    });
  }, []);

  // Fetch communities from API
  const { data: communities, isLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    staleTime: 5 * 60 * 1000,
  });

  // Fetch page content sections
  const { data: pageSections = [] } = useQuery<PageContentSection[]>({
    queryKey: ["/api/page-content"],
  });

  // Get active sections for this page, sorted by sortOrder
  const activeSections = pageSections
    .filter(section => section.pagePath === "/services/long-term-care" && section.active)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Get hero section for the button
  const heroSection = activeSections.find(s => s.sectionKey === "comprehensive_support_process");
  const heroContent = heroSection?.content as { heading?: string; description?: string; imageUrl?: string } | undefined;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        pagePath="/services/long-term-care"
        defaultTitle="Long-Term Care Services"
        defaultSubtitle="Skilled nursing and extended care"
      />

      {/* Dynamic Content Sections from Database */}
      {activeSections.map((section) => {
        // Special handling for comprehensive support section with button
        if (section.sectionKey === "comprehensive_support_process") {
          return (
            <section key={section.id} className="py-20 bg-white">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="comprehensive_support_process-title">
                      {heroContent?.heading}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6" data-testid="comprehensive_support_process-description">
                      {heroContent?.description}
                    </p>
                    <Link href="/about-us">
                      <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                        data-testid="about-us-button"
                      >
                        ABOUT US
                      </Button>
                    </Link>
                  </div>
                  <div className="relative rounded-2xl shadow-xl h-80 overflow-hidden">
                    <img
                      src={heroContent?.imageUrl}
                      alt={heroContent?.heading}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // Special handling for contact section with contact details
        if (section.sectionKey === "contact_section") {
          return (
            <section key={section.id} className="py-20 bg-white">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-12 text-white">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center" data-testid="contact-title">
                    Contact Our Claims Team
                  </h2>
                  <p className="text-lg text-white/90 mb-8 text-center max-w-3xl mx-auto" data-testid="contact-description">
                    Let our experienced team help you navigate your long-term care insurance benefits. 
                    Contact us today to learn how we can assist you.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="flex items-center justify-center space-x-3">
                      <Phone className="w-5 h-5 text-white/80" />
                      <div>
                        <p className="text-sm text-white/80">Phone</p>
                        <a href="tel:3036473914" className="text-white font-semibold hover:underline" data-testid="contact-phone">
                          (303) 647-3914
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-3">
                      <Briefcase className="w-5 h-5 text-white/80" />
                      <div>
                        <p className="text-sm text-white/80">Fax</p>
                        <span className="text-white font-semibold" data-testid="contact-fax">
                          (303) 648-6763
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-3">
                      <Mail className="w-5 h-5 text-white/80" />
                      <div>
                        <p className="text-sm text-white/80">Email</p>
                        <a href="mailto:ltc@stagesenior.com" className="text-white font-semibold hover:underline" data-testid="contact-email">
                          ltc@stagesenior.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        return <PageSectionRenderer key={section.id} section={section} />;
      })}

      {/* Communities Section */}
      <section className="py-20 bg-gray-50">
        <CommunitiesCarousel
          communities={communities || []}
          isLoading={isLoading}
          title="Communities with LTC Insurance Support"
          subtitle="We help navigate long-term care insurance at all our locations"
        />
      </section>
    </div>
  );
}