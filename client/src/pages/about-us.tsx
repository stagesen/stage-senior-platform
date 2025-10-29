import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  Shield, Heart, Users, Award, Phone, Mail, MapPin, Calendar, Star,
  Building, TrendingUp, Target
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { TeamCarousel } from "@/components/TeamCarousel";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { setMetaTags, getCanonicalUrl } from "@/lib/metaTags";
import EmphasizedHeading from "@/components/EmphasizedHeading";
import type { PageContentSection } from "@shared/schema";

// Icon mapping helper
const iconMap: Record<string, any> = {
  heart: Heart,
  users: Users,
  shield: Shield,
  award: Award,
  calendar: Calendar,
  star: Star,
  building: Building,
  phone: Phone,
  mail: Mail,
  mappin: MapPin,
  trendingup: TrendingUp,
  target: Target,
};

// Helper to get icon component from name
function getIconComponent(iconName: string | undefined) {
  if (!iconName) return Heart;
  const Icon = iconMap[iconName.toLowerCase().replace(/[^a-z]/g, '')];
  return Icon || Heart;
}

// Section Renderers
function renderSectionHeader(section: PageContentSection) {
  const content = section.content as { heading?: string; subheading?: string; accentWords?: string[] } | undefined;
  const heading = content?.heading ?? section.title ?? '';
  
  return (
    <section key={section.id} id={section.sectionKey ?? undefined} className="py-8 bg-white scroll-mt-24" data-testid={`section-${section.sectionKey ?? 'header'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <EmphasizedHeading
            text={heading}
            accentWords={content?.accentWords || undefined}
            className="text-3xl md:text-4xl font-bold text-foreground mb-6"
            accentClassName="text-primary font-extrabold"
          />
          {content?.subheading && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {content.subheading}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function renderBenefitCards(section: PageContentSection) {
  const content = section.content as { cards?: Array<{ title: string; description: string; icon?: string }> } | undefined;
  const cards = content?.cards || [];
  
  // Stats variant (4 cards with short titles like "2016", "98%")
  const isStatsVariant = cards.length === 4 && cards.every(c => c.title.length <= 10);
  
  // Determine grid columns based on section key and number of cards
  const isCoreValues = section.sectionKey === "core-values";
  const shouldExpandToFill = section.sectionKey === "by-the-numbers" || section.sectionKey === "what-makes-us-different";
  
  if (isStatsVariant) {
    // Determine grid layout for stats
    let gridColsClass = "grid-cols-2 md:grid-cols-4"; // default for stats
    if (shouldExpandToFill) {
      // For "By the Numbers" and "What Makes Us Different", expand to fill row
      switch (cards.length) {
        case 1:
          gridColsClass = "grid-cols-1";
          break;
        case 2:
          gridColsClass = "grid-cols-1 md:grid-cols-2";
          break;
        case 3:
          gridColsClass = "grid-cols-1 md:grid-cols-3";
          break;
        case 5:
          gridColsClass = "grid-cols-2 md:grid-cols-5";
          break;
        case 6:
          gridColsClass = "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
          break;
        default:
          gridColsClass = "grid-cols-2 md:grid-cols-4";
      }
    }
    
    return (
      <section key={section.id} id={section.sectionKey ?? undefined} className="py-8 scroll-mt-24" data-testid={`section-${section.sectionKey ?? 'section'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {section.title && (
            <h3 className="text-2xl font-bold text-center mb-8">{section.title}</h3>
          )}
          <div className="bg-primary/5 rounded-xl p-8">
            <div className={`grid ${gridColsClass} gap-8 text-center`}>
              {cards.map((card, index) => {
                const IconComponent = getIconComponent(card.icon);
                return (
                  <div key={index} data-testid={`stat-${index}`}>
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {card.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {card.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Regular benefit cards (values, highlights, etc.)
  // Determine grid layout
  let gridColsClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"; // default (for core-values)
  
  if (shouldExpandToFill) {
    // For "By the Numbers" and "What Makes Us Different", expand to fill row
    switch (cards.length) {
      case 1:
        gridColsClass = "grid-cols-1";
        break;
      case 2:
        gridColsClass = "grid-cols-1 md:grid-cols-2";
        break;
      case 3:
        gridColsClass = "grid-cols-1 md:grid-cols-3";
        break;
      case 5:
        gridColsClass = "grid-cols-2 md:grid-cols-5";
        break;
      case 6:
        gridColsClass = "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
        break;
      default:
        gridColsClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    }
  } else if (!isCoreValues) {
    // For other sections (not core-values and not expand-to-fill), use adaptive layout
    switch (cards.length) {
      case 1:
        gridColsClass = "grid-cols-1";
        break;
      case 2:
        gridColsClass = "grid-cols-1 md:grid-cols-2";
        break;
      case 3:
        gridColsClass = "grid-cols-1 md:grid-cols-3";
        break;
      default:
        gridColsClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    }
  }
  
  return (
    <section key={section.id} id={section.sectionKey ?? undefined} className="py-8 bg-white scroll-mt-24" data-testid={`section-${section.sectionKey ?? 'section'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {section.title && (
          <h3 className="text-2xl font-bold text-center mb-8">{section.title}</h3>
        )}
        <div className={`grid ${gridColsClass} gap-8`}>
          {cards.map((card, index) => {
            const IconComponent = getIconComponent(card.icon);
            return (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow" data-testid={`card-${index}`}>
                <CardContent className="pt-6">
                  <div className="text-primary mb-4 flex justify-center">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function renderTextBlock(section: PageContentSection) {
  const content = section.content as { text?: string } | undefined;
  const htmlContent = content?.text || '';
  
  return (
    <section key={section.id} id={section.sectionKey ?? undefined} className="py-16 bg-gray-50 scroll-mt-24" data-testid={`section-${section.sectionKey ?? 'section'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </section>
  );
}

function renderCTA(section: PageContentSection, openScheduleTour: () => void) {
  const content = section.content as { 
    heading?: string; 
    description?: string; 
    buttonText?: string; 
    buttonLink?: string; 
  } | undefined;
  
  return (
    <section key={section.id} className="py-16 bg-primary text-primary-foreground" data-testid={`section-${section.sectionKey ?? 'cta'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {content?.heading || section.title}
        </h2>
        {content?.description && (
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            {content.description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            variant="secondary"
            className="px-8 py-6 text-lg talkfurther-schedule-tour"
            onClick={() => openScheduleTour()}
            data-testid="button-schedule-tour"
          >
            <Calendar className="w-5 h-5 mr-2" />
            {content?.buttonText || "Schedule a Tour"}
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-6 text-lg"
            asChild
            data-testid="button-call-now"
          >
            <a href="tel:+1-970-444-4689">
              <Phone className="w-5 h-5 mr-2" />
              Call (970) 444-4689
            </a>
          </Button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div data-testid="contact-phone">
              <Phone className="w-6 h-6 mx-auto mb-2" />
              <p className="font-semibold">Call Us</p>
              <p className="text-primary-foreground/90">(970) 444-4689</p>
            </div>
            <div data-testid="contact-email">
              <Mail className="w-6 h-6 mx-auto mb-2" />
              <p className="font-semibold">Email Us</p>
              <p className="text-primary-foreground/90">info@stagesenior.com</p>
            </div>
            <div data-testid="contact-address">
              <MapPin className="w-6 h-6 mx-auto mb-2" />
              <p className="font-semibold">Visit Us</p>
              <p className="text-primary-foreground/90">
                8100 E Arapahoe Road, Suite 208<br />
                Centennial, CO 80112
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutUs() {
  const { openScheduleTour } = useScheduleTour();

  // Fetch page content sections
  const { data: allSections = [] } = useQuery<PageContentSection[]>({
    queryKey: ["/api/page-content"],
  });

  // Filter and sort sections for this page
  const pageSections = allSections
    .filter((section) => section.pagePath === "/about-us" && section.active)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Get hero section content
  const heroSection = pageSections.find(s => s.sectionType === "hero_section");
  const heroContent = heroSection?.content as { heading?: string; description?: string; imageUrl?: string } | undefined;
  
  // Resolve hero image URL (handles both UUIDs and direct URLs)
  const resolvedHeroImage = useResolveImageUrl(heroContent?.imageUrl);
  
  useEffect(() => {
    setMetaTags({
      title: "About Us | Stage Senior",
      description: "Learn about Stage Senior Management - a locally owned, Colorado-based senior living management company founded in 2016. Discover our mission, values, leadership, and commitment to exceptional resident care.",
      canonicalUrl: getCanonicalUrl("/about-us"),
      ogType: "website",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        pagePath="/about-us"
        defaultTitle="About Stage Senior"
        defaultSubtitle="Locally Owned, Resident-Focused"
        defaultBackgroundImage="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=2000&q=80"
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb data-testid="breadcrumb-navigation">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" data-testid="breadcrumb-home">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage data-testid="breadcrumb-current">About Us</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Content Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6" data-testid="page-title">
                {heroContent?.heading || "About Stage Senior"}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="hero-description">
                {heroContent?.description || "Since 2016, we've been transforming senior living communities into vibrant homes where dignity, comfort, and joy come first. As a locally owned Colorado company, we bring authentic hometown values to sophisticated senior care."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" data-testid="button-tour-communities">
                  <Link href="/communities">
                    <MapPin className="w-5 h-5 mr-2" />
                    Tour Our Communities
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-call-us">
                  <a href="tel:+1-970-444-4689">
                    <Phone className="w-5 h-5 mr-2" />
                    (970) 444-4689
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={resolvedHeroImage || "https://images.unsplash.com/photo-1559628233-0fb74da9d96b?q=80&w=800&auto=format&fit=crop"}
                alt="Stage Senior team providing compassionate care to residents"
                className="rounded-lg shadow-xl w-full"
                data-testid="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Content Sections */}
      {pageSections.map((section, index) => {
        // Skip hero section (already rendered above)
        if (section.sectionType === "hero_section") return null;
        
        // Render section based on type
        switch (section.sectionType) {
          case "section_header":
            return renderSectionHeader(section);
          
          case "benefit_cards":
            // Insert TeamCarousel after core-values section
            if (section.sectionKey === "core-values") {
              return (
                <div key={`wrapper-${section.id}`}>
                  {renderBenefitCards(section)}
                  <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <TeamCarousel 
                        filterTag="Stage Management"
                        title="Our Leadership Team"
                        subtitle="Elevating Senior Care Across Colorado"
                      />
                    </div>
                  </section>
                </div>
              );
            }
            return renderBenefitCards(section);
          
          case "text_block":
            return renderTextBlock(section);
          
          case "cta":
            return renderCTA(section, openScheduleTour);
          
          default:
            return null;
        }
      })}
    </div>
  );
}
