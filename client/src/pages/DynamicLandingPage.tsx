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

export default function DynamicLandingPage() {
  const params = useParams();
  const [location] = useLocation();
  const { openScheduleTour } = useScheduleTour();
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(null);

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

  // Filter communities based on template settings
  const targetCommunities = template?.communityId
    ? allCommunities.filter(c => c.id === template.communityId)
    : template?.cities?.length
    ? allCommunities.filter(c => template.cities?.includes(c.city))
    : allCommunities;

  const primaryCommunity = targetCommunities[0];

  // Simple care type name mapping for token replacement (fallback to URL params)
  const getCareTypeName = () => {
    // First try URL params
    if (urlParams.careType) {
      return urlParams.careType.charAt(0).toUpperCase() + urlParams.careType.slice(1);
    }
    
    // Then try to infer from URL pattern
    if (template?.urlPattern) {
      if (template.urlPattern.includes('assisted-living')) return "Assisted Living";
      if (template.urlPattern.includes('memory-care')) return "Memory Care";
      if (template.urlPattern.includes('independent-living')) return "Independent Living";
      if (template.urlPattern.includes('skilled-nursing')) return "Skilled Nursing";
    }
    
    // Fallback based on care type ID mapping (known UUIDs from database)
    const careTypeIdMap: Record<string, string> = {
      "f7f9f6c3-5500-4f5f-b6eb-66e322b44cbd": "Assisted Living",
      "1c08656d-0383-4eed-8bf5-4c3c4673ea33": "Memory Care",
      "35e9d6a3-5444-4a66-a2a3-a9c8b728f4ea": "Independent Living",
    };
    
    return template?.careTypeId ? careTypeIdMap[template.careTypeId] || "Senior Living" : "Senior Living";
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
  const { data: floorPlans = [] } = useQuery<FloorPlan[]>({
    queryKey: [`/api/floor-plans?communityId=${primaryCommunity?.id}&active=true`],
    enabled: !!template?.showFloorPlans && !!primaryCommunity,
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

  // Resolve hero image
  const heroImageUrl = useResolveImageUrl(template?.heroImageId);

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

  return (
    <div className="min-h-screen bg-white" data-testid="dynamic-landing-page">
      {/* Hero Section - Always shown */}
      <PageHero
        pagePath={pathname}
        defaultTitle={replaceTokens(pageTitle, tokens)}
        defaultSubtitle={pageSubtitle ? replaceTokens(pageSubtitle, tokens) : undefined}
        defaultBackgroundImage={heroImageUrl || undefined}
      />

      {/* Main H1 Headline */}
      {template.h1Headline && (
        <section className="py-12 bg-gradient-to-br from-primary/5 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
              data-testid="main-headline"
            >
              {replaceTokens(template.h1Headline, tokens)}
            </h1>
            {template.subheadline && (
              <p 
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
                data-testid="subheadline"
              >
                {replaceTokens(template.subheadline, tokens)}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Community Highlights - shown if showTestimonials (reusing testimonials section) */}
      {template.showTestimonials && testimonials.length > 0 && (
        <section className="py-16" data-testid="section-testimonials">
          <TestimonialSection />
        </section>
      )}

      {/* Photo Gallery - shown if showGallery */}
      {template.showGallery && galleries.length > 0 && (
        <section className="py-16 bg-gray-50" data-testid="section-gallery">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm font-semibold">Photo Gallery</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                See Our Beautiful Community
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{gallery.title}</h3>
                      {gallery.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {gallery.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3 text-primary">
                        <span className="text-sm font-medium">View Gallery</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Communities Section - Always shown if we have communities */}
      {targetCommunities.length > 0 && (
        <section className="py-16" data-testid="section-communities">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Home className="w-4 h-4" />
                <span className="text-sm font-semibold">Our Communities</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Find Your Perfect Home
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{comm.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {comm.city}, {comm.state}
                        </span>
                      </div>
                      {comm.shortDescription && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {comm.shortDescription}
                        </p>
                      )}
                      <Button
                        asChild
                        className="w-full"
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

      {/* Team Members - shown if showTeamMembers */}
      {template.showTeamMembers && teamMembers.length > 0 && (
        <section className="py-16 bg-gray-50" data-testid="section-team">
          <TeamCarousel
            filterTag={primaryCommunity?.slug || "Stage Management"}
            title="Meet Our Team"
            subtitle="Dedicated professionals committed to exceptional care"
          />
        </section>
      )}

      {/* Pricing & Floor Plans - shown if showPricing or showFloorPlans */}
      {(template.showPricing || template.showFloorPlans) && floorPlans.length > 0 && (
        <section className="py-16" data-testid="section-floor-plans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Floor Plans & Pricing</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Choose Your Ideal Living Space
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-3">{plan.name}</h3>
                      {template.showPricing && plan.startingPrice && (
                        <p className="text-3xl font-bold text-primary mb-4">
                          {formatPrice(plan.startingPrice)}
                          <span className="text-base font-normal text-gray-600">/mo</span>
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-base text-gray-700 mb-4">
                        {plan.bedrooms !== null && (
                          <span className="flex items-center gap-2">
                            <Bed className="w-5 h-5 text-primary" />
                            <span className="font-medium">{plan.bedrooms}</span>{" "}
                            {plan.bedrooms === 1 ? "Bed" : "Beds"}
                          </span>
                        )}
                        {plan.bathrooms !== null && (
                          <span className="flex items-center gap-2">
                            <Bath className="w-5 h-5 text-primary" />
                            <span className="font-medium">{Number(plan.bathrooms)}</span>{" "}
                            {Number(plan.bathrooms) === 1 ? "Bath" : "Baths"}
                          </span>
                        )}
                        {plan.squareFeet && (
                          <span className="flex items-center gap-2">
                            <Square className="w-5 h-5 text-primary" />
                            <span className="font-medium">{plan.squareFeet}</span> sq ft
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-base font-semibold text-primary">View Floor Plan</span>
                        <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQs - shown if showFaqs */}
      {template.showFaqs && faqs.length > 0 && (
        <section className="py-16 bg-gray-50" data-testid="section-faqs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Find answers to common questions about our community
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index}`} data-testid={`faq-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answerHtml ? (
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                      />
                    ) : (
                      <p className="text-muted-foreground">{faq.answer}</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* CTA Section - Always shown */}
      <section className="py-20 bg-primary text-white" data-testid="section-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {template.heroCtaText || "Ready to Learn More?"}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Schedule a tour today and discover why families choose{" "}
                {primaryCommunity?.name || "our community"} for their loved ones.
              </p>
              <div className="flex flex-wrap gap-4">
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
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
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
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Request Information</h3>
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
    </div>
  );
}
