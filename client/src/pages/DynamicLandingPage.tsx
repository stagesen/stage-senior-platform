import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero } from "@/components/PageHero";
import TestimonialSection from "@/components/TestimonialSection";
import { TeamCarousel } from "@/components/TeamCarousel";
import GalleryModal from "@/components/GalleryModal";
import FloorPlanModal from "@/components/FloorPlanModal";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import NotFound from "@/pages/not-found";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Image as ImageIcon,
  Users,
  Home,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Bed,
  Bath,
  Square,
  Shield,
  Award,
  Clock,
  TrendingUp,
  Download,
  MessageCircle,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type {
  LandingPageTemplate,
  Community,
  Gallery,
  Testimonial,
  TeamMember,
  Faq,
  FloorPlan,
  GalleryImageWithDetails,
  CommunityHighlight,
  Amenity,
  CareType,
} from "@shared/schema";

// Helper function to replace tokens in text
const replaceTokens = (
  text: string,
  tokens: Record<string, string>
): string => {
  let result = text;
  Object.entries(tokens).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, "gi");
    result = result.replace(regex, value);
  });
  return result;
};

// Helper function for formatting prices
const formatPrice = (price: number | undefined | null): string => {
  if (price === null || price === undefined) return "Contact for pricing";
  if (price === 0) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Highlight Card component - Separated to properly use hooks
const HighlightCard = ({ highlight }: { highlight: CommunityHighlight }) => {
  const highlightImageUrl = useResolveImageUrl(highlight.imageId);
  
  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300"
      data-testid={`highlight-card-${highlight.id}`}
    >
      {highlightImageUrl && (
        <AspectRatio ratio={16 / 9}>
          <img
            src={highlightImageUrl}
            alt={highlight.title}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
      )}
      <CardContent className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-3">{highlight.title}</h3>
        <p className="text-sm md:text-base text-muted-foreground mb-4">
          {highlight.description}
        </p>
        {highlight.ctaLabel && highlight.ctaHref && (
          <Button
            variant="outline"
            asChild
            className="w-full min-h-[44px]"
          >
            <a href={highlight.ctaHref}>
              {highlight.ctaLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default function DynamicLandingPage() {
  const params = useParams();
  const [location] = useLocation();
  const { openScheduleTour } = useScheduleTour();
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(null);
  const [showStickyMobileCTA, setShowStickyMobileCTA] = useState(false);

  // Strip query params from location for efficient caching
  // This ensures URLs with different UTM parameters use the same cache entry
  const pathname = location.split('?')[0];

  // Fetch landing page template and extract params from URL using the resolve endpoint
  const { data: resolveData, isLoading: templateLoading, error: templateError } = useQuery<{
    template: LandingPageTemplate;
    params: Record<string, string>;
  }>({
    queryKey: ["/api/landing-page-templates/resolve", pathname],
    queryFn: async () => {
      const response = await fetch(`/api/landing-page-templates/resolve?url=${encodeURIComponent(pathname)}`);
      
      if (!response.ok) {
        throw new Error("Template not found");
      }
      
      return response.json();
    },
  });

  const template = resolveData?.template;
  const urlParams = resolveData?.params || {};

  // Fetch all communities
  const { data: allCommunities = [] } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    enabled: !!template,
  });

  // Filter communities based on template settings and URL parameters
  // Priority: 1) template.communityId, 2) URL city param (city or slug), 3) template.cities array, 4) all communities
  let targetCommunities: Community[] = [];
  
  if (template?.communityId) {
    // Explicit community ID in template
    targetCommunities = allCommunities.filter(c => c.id === template.communityId);
  } else if (urlParams.city) {
    // Try to match by city name first
    const cityMatches = allCommunities.filter(c => 
      c.city.toLowerCase() === urlParams.city.toLowerCase()
    );
    
    if (cityMatches.length > 0) {
      targetCommunities = cityMatches;
    } else {
      // If no city match, try matching by slug (e.g., "arvada-stonebridge" → "stonebridge-senior")
      // Split both the URL param and slugs by hyphens and look for common significant words
      const urlWords = urlParams.city.toLowerCase().split('-');
      const slugMatch = allCommunities.find(c => {
        const slugWords = c.slug.toLowerCase().split('-');
        // Check if they share at least one significant word (excluding common words like "the", "at", "on")
        const commonWords = ['the', 'at', 'on', 'in'];
        const significantUrlWords = urlWords.filter(w => !commonWords.includes(w));
        const significantSlugWords = slugWords.filter(w => !commonWords.includes(w));
        
        return significantUrlWords.some(urlWord => 
          significantSlugWords.some(slugWord => 
            urlWord.includes(slugWord) || slugWord.includes(urlWord)
          )
        );
      });
      
      if (slugMatch) {
        targetCommunities = [slugMatch];
      } else {
        // Still no match, fall back to template cities or all communities
        targetCommunities = template?.cities?.length
          ? allCommunities.filter(c => template.cities?.includes(c.city))
          : allCommunities;
      }
    }
  } else if (template?.cities?.length) {
    targetCommunities = allCommunities.filter(c => template.cities?.includes(c.city));
  } else {
    targetCommunities = allCommunities;
  }

  // For Arvada URLs without a specific community template, prefer Gardens on Quail (flagship)
  const primaryCommunity = urlParams.city?.toLowerCase() === 'arvada' && targetCommunities.length > 1
    ? targetCommunities.find(c => c.slug === 'the-gardens-on-quail') || targetCommunities[0]
    : targetCommunities[0];

  // Extract care type from URL pattern and params
  const getCareTypeSlug = (): string | null => {
    // Try URL pattern first
    if (template?.urlPattern) {
      if (template.urlPattern.includes('assisted-living')) return 'assisted-living';
      if (template.urlPattern.includes('memory-care')) return 'memory-care';
      if (template.urlPattern.includes('independent-living')) return 'independent-living';
      if (template.urlPattern.includes('skilled-nursing')) return 'skilled-nursing';
    }
    
    // Try URL params
    if (urlParams.careType) return urlParams.careType.toLowerCase();
    
    return null;
  };

  const careTypeSlug = getCareTypeSlug();

  // Simple care type name mapping for token replacement
  const getCareTypeName = () => {
    if (careTypeSlug === 'assisted-living') return "Assisted Living";
    if (careTypeSlug === 'memory-care') return "Memory Care";
    if (careTypeSlug === 'independent-living') return "Independent Living";
    if (careTypeSlug === 'skilled-nursing') return "Skilled Nursing";
    return "Senior Living";
  };

  // Fetch galleries (if showGallery is true)
  const { data: galleries = [] } = useQuery<Gallery[]>({
    queryKey: [`/api/galleries?communityId=${primaryCommunity?.id}&active=true`],
    enabled: !!template?.showGallery && !!primaryCommunity,
  });

  // Fetch testimonials (if showTestimonials is true)
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: [`/api/testimonials?communityId=${primaryCommunity?.id}&approved=true&featured=true`],
    enabled: !!template?.showTestimonials && !!primaryCommunity,
  });

  // Fetch team members (if showTeamMembers is true)
  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members?active=true"],
    enabled: !!template?.showTeamMembers,
  });

  // Fetch FAQs (if showFaqs is true)
  const { data: faqs = [] } = useQuery<Faq[]>({
    queryKey: [`/api/faqs?communityId=${primaryCommunity?.id}&active=true`],
    enabled: !!template?.showFaqs && !!primaryCommunity,
  });

  // Fetch floor plans (if showFloorPlans is true)
  const { data: allFloorPlans = [] } = useQuery<FloorPlan[]>({
    queryKey: [`/api/floor-plans?communityId=${primaryCommunity?.id}&active=true`],
    enabled: !!template?.showFloorPlans && !!primaryCommunity,
  });

  // Filter floor plans by care type if specified in the template
  const floorPlans = careTypeSlug
    ? allFloorPlans.filter(fp => 
        fp.name.toLowerCase().includes(getCareTypeName().toLowerCase())
      )
    : allFloorPlans;

  // Fetch community highlights (if available)
  const { data: communityHighlights = [] } = useQuery<CommunityHighlight[]>({
    queryKey: [`/api/community-highlights?communityId=${primaryCommunity?.id}&active=true`],
    enabled: !!primaryCommunity,
  });

  // Fetch community amenities with details
  const { data: communityAmenities = [] } = useQuery<Amenity[]>({
    queryKey: [`/api/communities/${primaryCommunity?.id}/amenities`],
    enabled: !!primaryCommunity,
  });

  // Fetch community care types
  const { data: communityCareTypes = [] } = useQuery<CareType[]>({
    queryKey: [`/api/communities/${primaryCommunity?.id}/care-types`],
    enabled: !!primaryCommunity,
  });

  // Build tokens for replacement
  const tokens = {
    city: urlParams.city || primaryCommunity?.city || "",
    careType: getCareTypeName(),
    communityName: primaryCommunity?.name || "",
    location: urlParams.location || primaryCommunity?.city || "",
  };

  // Set page title and meta description
  useEffect(() => {
    if (template) {
      const title = replaceTokens(template.title, tokens);
      document.title = title;

      if (template.metaDescription) {
        let metaTag = document.querySelector('meta[name="description"]');
        if (!metaTag) {
          metaTag = document.createElement("meta");
          metaTag.setAttribute("name", "description");
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute(
          "content",
          replaceTokens(template.metaDescription, tokens)
        );
      }
    }
  }, [template, tokens]);

  // Scroll tracking for sticky mobile CTA
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyMobileCTA(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Resolve hero image - prioritize community's hero image over template's
  const heroImageUrl = useResolveImageUrl(primaryCommunity?.imageId || template?.heroImageId);

  // Loading state
  if (templateLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Skeleton className="h-[500px] w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-12 w-2/3 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Template not found - show NotFound component
  if (!templateLoading && (!template || templateError)) {
    return <NotFound />;
  }

  // Guard to ensure template is defined (TypeScript type narrowing)
  if (!template) {
    return null;
  }

  const pageTitle = template.heroTitle || template.h1Headline || template.title;
  const pageSubtitle = template.heroSubtitle || template.subheadline;

  // Inline Components
  const TrustBadgeBar = () => (
    <section className="bg-primary/5 border-y border-primary/10 py-6 md:py-4" data-testid="trust-badge-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-8 h-8 md:w-6 md:h-6 text-primary" />
            <span className="text-sm md:text-base font-semibold">Licensed & Insured</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Award className="w-8 h-8 md:w-6 md:h-6 text-primary" />
            <span className="text-sm md:text-base font-semibold">98%+ Satisfaction</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <TrendingUp className="w-8 h-8 md:w-6 md:h-6 text-primary" />
            <span className="text-sm md:text-base font-semibold">Locally Owned Since 2016</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Clock className="w-8 h-8 md:w-6 md:h-6 text-primary" />
            <span className="text-sm md:text-base font-semibold">Same-Day Tours</span>
          </div>
        </div>
      </div>
    </section>
  );

  const StatsStrip = () => (
    <section className="py-12 md:py-16" data-testid="stats-strip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          <Card className="text-center p-6 md:p-8 border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-0">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <p className="text-base md:text-lg text-muted-foreground">Families Trust Us</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 md:p-8 border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-0">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">20+</div>
              <p className="text-base md:text-lg text-muted-foreground">Years of Excellence</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 md:p-8 border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-0">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
                4.8 <Star className="w-8 h-8 md:w-10 md:h-10 fill-primary text-primary" />
              </div>
              <p className="text-base md:text-lg text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );

  const ScarcityNotice = () => (
    <section className="py-6 md:py-8 bg-amber-50 border-y border-amber-200" data-testid="scarcity-notice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
          <div className="flex items-center gap-2 text-amber-700">
            <Clock className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-semibold text-sm md:text-base">Limited Availability</span>
          </div>
          <p className="text-sm md:text-base text-amber-900">
            Only a few tour slots available this week. Schedule yours today!
          </p>
        </div>
      </div>
    </section>
  );

  type CTAVariant = "primary" | "secondary" | "tertiary";

  const CTASection = ({ 
    variant = "primary", 
    heading, 
    subheading, 
    ctaText 
  }: { 
    variant?: CTAVariant; 
    heading: string; 
    subheading?: string; 
    ctaText: string;
  }) => {
    const bgColors = {
      primary: "bg-primary text-white",
      secondary: "bg-gray-50",
      tertiary: "bg-white",
    };

    const buttonVariants = {
      primary: "secondary" as const,
      secondary: "default" as const,
      tertiary: "outline" as const,
    };

    return (
      <section className={`py-12 md:py-16 ${bgColors[variant]}`} data-testid={`cta-section-${variant}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${variant === "primary" ? "text-white" : "text-foreground"}`}>
            {heading}
          </h2>
          {subheading && (
            <p className={`text-lg md:text-xl mb-8 max-w-3xl mx-auto ${variant === "primary" ? "text-white/90" : "text-muted-foreground"}`}>
              {subheading}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant={buttonVariants[variant]}
              onClick={() =>
                openScheduleTour({
                  communityId: primaryCommunity?.id,
                  communityName: primaryCommunity?.name,
                  title: `Schedule a Tour${primaryCommunity?.name ? ` at ${primaryCommunity.name}` : ""}`,
                })
              }
              className="min-h-[44px] w-full sm:w-auto"
              data-testid={`button-cta-${variant}`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              {ctaText}
            </Button>
            {primaryCommunity?.phoneDisplay && (
              <Button
                size="lg"
                variant="outline"
                asChild
                className={`min-h-[44px] w-full sm:w-auto ${variant === "primary" ? "bg-white/10 border-white/30 text-white hover:bg-white/20" : ""}`}
                data-testid={`button-phone-${variant}`}
              >
                <a href={`tel:${primaryCommunity.phoneDial || primaryCommunity.phoneDisplay}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  {primaryCommunity.phoneDisplay}
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  };

  const StickyMobileCTA = () => {
    if (!showStickyMobileCTA) return null;

    return (
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200 pb-safe"
        data-testid="sticky-mobile-cta"
      >
        <div className="grid grid-cols-2 gap-2 p-3">
          <Button
            size="lg"
            onClick={() =>
              openScheduleTour({
                communityId: primaryCommunity?.id,
                communityName: primaryCommunity?.name,
                title: `Schedule a Tour${primaryCommunity?.name ? ` at ${primaryCommunity.name}` : ""}`,
              })
            }
            className="min-h-[44px] w-full"
            data-testid="button-sticky-schedule-tour"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Tour
          </Button>
          {primaryCommunity?.phoneDisplay && (
            <Button
              size="lg"
              variant="outline"
              asChild
              className="min-h-[44px] w-full"
              data-testid="button-sticky-call"
            >
              <a href={`tel:${primaryCommunity.phoneDial || primaryCommunity.phoneDisplay}`}>
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white" data-testid="dynamic-landing-page">
      {/* 1. Hero Section - Always shown */}
      <PageHero
        pagePath={pathname}
        defaultTitle={replaceTokens(pageTitle, tokens)}
        defaultSubtitle={pageSubtitle ? replaceTokens(pageSubtitle, tokens) : undefined}
        defaultBackgroundImage={heroImageUrl || undefined}
      />

      {/* 1a. Care Type Focus - Show specific care type if landing page is for a specific care type */}
      {careTypeSlug && getCareTypeName() !== "Senior Living" && (
        <section className="py-8 md:py-12 bg-primary/5" data-testid="section-care-type-focus">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base md:text-lg font-semibold inline-flex items-center gap-2"
                data-testid="care-type-focus-badge"
              >
                <Heart className="w-5 h-5" />
                Specializing in {getCareTypeName()}
              </Badge>
            </div>
          </div>
        </section>
      )}

      {/* 2. Trust Badge Bar - Builds credibility immediately */}
      <TrustBadgeBar />

      {/* 3. Stats Strip - Social proof numbers */}
      <StatsStrip />

      {/* 4. First CTA - Primary conversion opportunity */}
      <CTASection
        variant="primary"
        heading="Schedule Your Tour Today"
        subheading="Experience our community firsthand. Book a personalized tour and see why families choose us."
        ctaText="Schedule Your Tour"
      />

      {/* 5. Testimonials - Social proof from satisfied families */}
      {template.showTestimonials && testimonials.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50" data-testid="section-testimonials">
          <TestimonialSection />
        </section>
      )}

      {/* 6. Scarcity Notice - Create urgency */}
      <ScarcityNotice />

      {/* 7. Community Highlights - Show available communities */}
      {targetCommunities.length > 0 && (
        <section className="py-12 md:py-16" data-testid="section-communities">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 md:mb-6">
                <Home className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-semibold">Our Communities</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
                Find Your Perfect Home
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our exceptional senior living communities across Colorado
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {targetCommunities.map((comm) => {
                const communityImageUrl = comm.heroImageUrl || comm.imageId || "https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?w=800&q=80";
                
                return (
                  <Card
                    key={comm.id}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                    data-testid={`community-card-${comm.id}`}
                  >
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={communityImageUrl}
                        alt={comm.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </AspectRatio>
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-lg md:text-xl font-bold mb-2">{comm.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {comm.city}, {comm.state}
                        </span>
                      </div>
                      {comm.shortDescription && (
                        <p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-3">
                          {comm.shortDescription}
                        </p>
                      )}
                      <Button
                        asChild
                        className="w-full min-h-[44px]"
                        data-testid={`button-view-community-${comm.id}`}
                      >
                        <a href={`/communities/${comm.slug}`}>
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7a. Community Highlights - Specific features of this community */}
      {communityHighlights.length > 0 && (
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-white to-primary/5" data-testid="section-highlights">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 md:mb-6">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-semibold">Community Highlights</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
                What Makes {primaryCommunity?.name} Special
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the unique features that set our community apart
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {communityHighlights.map((highlight) => (
                <HighlightCard key={highlight.id} highlight={highlight} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Second CTA - Phone call option */}
      <CTASection
        variant="secondary"
        heading="Questions? We're Here to Help"
        subheading="Our friendly team is ready to answer your questions and provide personalized guidance."
        ctaText="Call Us Today"
      />

      {/* 9. Photo Gallery - Visual engagement */}
      {template.showGallery && galleries.length > 0 && (
        <section className="py-12 md:py-16" data-testid="section-gallery">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 md:mb-6">
                <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-semibold">Photo Gallery</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
                See Our Beautiful Community
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Take a virtual tour through our welcoming spaces and vibrant community life
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {galleries.slice(0, 6).map((gallery) => {
                const thumbnail = gallery.images?.[0];
                const thumbnailUrl = thumbnail?.url || "https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?w=800&q=80";
                
                return (
                  <Card
                    key={gallery.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedGallery(gallery)}
                    data-testid={`gallery-card-${gallery.id}`}
                  >
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={thumbnailUrl}
                        alt={gallery.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </AspectRatio>
                    <CardContent className="p-3 md:p-4">
                      <h3 className="font-semibold text-base md:text-lg mb-1">{gallery.title}</h3>
                      {gallery.description && (
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                          {gallery.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 md:mt-3 text-primary">
                        <span className="text-xs md:text-sm font-medium">View Gallery</span>
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 9a. Community Amenities - Services and features */}
      {communityAmenities.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50" data-testid="section-amenities">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 md:mb-6">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-semibold">Amenities & Services</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
                Exceptional Care & Comfort
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience our comprehensive amenities designed for your wellbeing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {communityAmenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="flex items-start gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                  data-testid={`amenity-item-${amenity.id}`}
                >
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">{amenity.name}</h3>
                    {amenity.description && (
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {amenity.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. Team Members - Meet the caring professionals */}
      {template.showTeamMembers && teamMembers.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50" data-testid="section-team">
          <TeamCarousel
            filterTag={primaryCommunity?.slug || "Stage Management"}
            title="Meet Our Team"
            subtitle="Dedicated professionals committed to exceptional care"
          />
        </section>
      )}

      {/* 11. Floor Plans & Pricing - Detailed living options */}
      {(template.showPricing || template.showFloorPlans) && floorPlans.length > 0 && (
        <section className="py-12 md:py-16" data-testid="section-floor-plans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 md:mb-6">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-semibold">Floor Plans & Pricing</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
                Choose Your Ideal Living Space
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our thoughtfully designed floor plans with transparent pricing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {floorPlans.map((plan) => {
                const planImageUrl = plan.imageUrl || plan.imageId;
                
                return (
                  <Card
                    key={plan.id}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedFloorPlan(plan)}
                    data-testid={`floor-plan-card-${plan.id}`}
                  >
                    {planImageUrl && (
                      <AspectRatio ratio={16 / 10}>
                        <img
                          src={planImageUrl}
                          alt={`${plan.name} floor plan`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </AspectRatio>
                    )}
                    <CardContent className="p-4 md:p-6">
                      <h3 className="font-bold text-lg md:text-xl mb-3">{plan.name}</h3>
                      {template.showPricing && plan.startingPrice && (
                        <p className="text-2xl md:text-3xl font-bold text-primary mb-4">
                          {formatPrice(plan.startingPrice)}
                          <span className="text-sm md:text-base font-normal text-gray-600">/mo</span>
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 md:gap-4 text-sm md:text-base text-gray-700 mb-4">
                        {plan.bedrooms !== null && (
                          <span className="flex items-center gap-1.5 md:gap-2">
                            <Bed className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                            <span className="font-medium">{plan.bedrooms}</span>{" "}
                            {plan.bedrooms === 1 ? "Bed" : "Beds"}
                          </span>
                        )}
                        {plan.bathrooms !== null && (
                          <span className="flex items-center gap-1.5 md:gap-2">
                            <Bath className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                            <span className="font-medium">{Number(plan.bathrooms)}</span>{" "}
                            {Number(plan.bathrooms) === 1 ? "Bath" : "Baths"}
                          </span>
                        )}
                        {plan.squareFeet && (
                          <span className="flex items-center gap-1.5 md:gap-2">
                            <Square className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                            <span className="font-medium">{plan.squareFeet}</span> sq ft
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm md:text-base font-semibold text-primary">View Floor Plan</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 12. FAQs - Address common concerns */}
      {template.showFaqs && faqs.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50" data-testid="section-faqs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 md:mb-6">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-semibold">FAQs</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Find answers to common questions about our community
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index}`} data-testid={`faq-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-sm md:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answerHtml ? (
                      <div
                        className="prose prose-sm max-w-none text-sm md:text-base"
                        dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                      />
                    ) : (
                      <p className="text-muted-foreground text-sm md:text-base">{faq.answer}</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* 13. Final CTA Section - Last conversion opportunity */}
      <section className="py-12 md:py-20 bg-primary text-white" data-testid="section-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                {template.heroCtaText || "Ready to Learn More?"}
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8">
                Schedule a tour today and discover why families choose{" "}
                {primaryCommunity?.name || "our community"} for their loved ones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() =>
                    openScheduleTour({
                      communityId: primaryCommunity?.id,
                      communityName: primaryCommunity?.name,
                      title: `Schedule a Tour${
                        primaryCommunity?.name ? ` at ${primaryCommunity.name}` : ""
                      }`,
                    })
                  }
                  className="min-h-[44px] w-full sm:w-auto"
                  data-testid="button-schedule-tour-cta"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule a Tour
                </Button>
                {primaryCommunity?.phoneDisplay && (
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 min-h-[44px] w-full sm:w-auto"
                    data-testid="button-call-cta"
                  >
                    <a href={`tel:${primaryCommunity.phoneDial || primaryCommunity.phoneDisplay}`}>
                      <Phone className="w-5 h-5 mr-2" />
                      {primaryCommunity.phoneDisplay}
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Request Information</h3>
                <LeadCaptureForm
                  communityId={primaryCommunity?.id}
                  variant="sidebar"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedGallery && (
        <GalleryModal
          isOpen={!!selectedGallery}
          onClose={() => setSelectedGallery(null)}
          gallery={{
            ...selectedGallery,
            description: selectedGallery.description || undefined,
            images: selectedGallery.images || undefined,
          }}
        />
      )}

      {selectedFloorPlan && (
        <FloorPlanModal
          isOpen={!!selectedFloorPlan}
          onOpenChange={(open) => !open && setSelectedFloorPlan(null)}
          floorPlan={selectedFloorPlan}
          communityName={primaryCommunity?.name || ""}
          communityId={primaryCommunity?.id}
        />
      )}

      {/* 14. Sticky Mobile CTA - Fixed bottom on mobile */}
      <StickyMobileCTA />
    </div>
  );
}
