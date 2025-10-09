import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import TestimonialSection from "@/components/TestimonialSection";
import CommunitySelectionModal from "@/components/CommunitySelectionModal";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  CarouselProgressBar,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  MapPin,
  Calendar,
  Phone,
  Star,
  Shield,
  Heart,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Mail,
  Activity
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { Community, HomepageSection, HomepageConfig } from "@shared/schema";
import seniorCaregiverDocuments from '@/assets/senior-caregiver-documents.webp';
import carePricingImage from '@/assets/cp-home.webp';

// Subcomponent for carousel items that handles image resolution
const CarouselCommunityCard = ({ 
  community, 
  index, 
  selectedIndex, 
  setShowContactForm 
}: { 
  community: Community; 
  index: number; 
  selectedIndex: number; 
  setShowContactForm: (show: boolean) => void;
}) => {
  const resolvedHeroUrl = useResolveImageUrl(community.heroImageUrl);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-lg transition-all duration-500 ease-out ${
        selectedIndex === index 
          ? 'scale-110 opacity-100 shadow-2xl ring-4 ring-white/20 z-10' 
          : 'scale-90 opacity-75 hover:scale-95 hover:opacity-85'
      }`}
    >
      <Card className="border-0 shadow-lg">
        <div className="relative h-80 overflow-hidden">
          {resolvedHeroUrl ? (
            <img 
              src={resolvedHeroUrl} 
              alt={community.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              data-testid={`community-image-${community.id}`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/30 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-white drop-shadow-md" />
            </div>
          )}
          {/* Enhanced gradient overlays for better text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-lg font-bold mb-2 drop-shadow-md" data-testid={`community-name-${community.id}`}>
              {community.name}
            </h3>
            
            {/* Care Type Badges */}
            {community.careTypes && community.careTypes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {community.careTypes.map((careType) => {
                  const getCareTypeStyle = () => {
                    const lowerCareType = careType.toLowerCase();
                    if (lowerCareType.includes('memory')) return 'bg-purple-500/80 text-white';
                    if (lowerCareType.includes('assisted')) return 'bg-blue-500/80 text-white';
                    if (lowerCareType.includes('independent')) return 'bg-green-500/80 text-white';
                    return 'bg-white/20 text-white';
                  };
                  
                  const formatCareType = (type: string) => {
                    return type
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                  };
                  
                  return (
                    <Badge 
                      key={careType}
                      variant="secondary" 
                      className={`text-xs px-2 py-0.5 ${getCareTypeStyle()} border-0 backdrop-blur-sm`}
                      data-testid={`care-type-badge-${community.id}-${careType}`}
                    >
                      {formatCareType(careType)}
                    </Badge>
                  );
                })}
              </div>
            )}
            
            <p className="text-sm text-white mb-3 line-clamp-2 drop-shadow-sm">
              {community.shortDescription || community.description}
            </p>
            <div className="flex items-center gap-1 text-sm text-white mb-4 drop-shadow-sm">
              <MapPin className="w-4 h-4" />
              <span data-testid={`community-address-${community.id}`}>
                {community.street && community.city 
                  ? `${community.street}, ${community.city}, ${community.state}`
                  : `${community.city}, ${community.state}`}
              </span>
            </div>
            
            {/* CTAs */}
            <div className="flex gap-2">
              <Button 
                asChild 
                variant="secondary"
                size="sm"
                className="w-full bg-white text-primary hover:bg-white/90 font-semibold shadow-md"
                data-testid={`button-learn-more-${community.id}`}
              >
                <Link href={`/communities/${community.slug}`}>
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function Home() {
  const { openScheduleTour } = useScheduleTour();
  const [showContactForm, setShowContactForm] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch homepage hero data
  const { data: heroData } = useQuery({
    queryKey: ['/api/page-heroes', '/'],
    queryFn: async () => {
      const response = await fetch('/api/page-heroes/' + encodeURIComponent('/'));
      if (!response.ok) {
        // Return null if no hero data exists
        if (response.status === 404) return null;
        throw new Error('Failed to fetch page hero');
      }
      return response.json();
    },
  });

  // Default hero content for fallback
  const defaultHero = {
    title: "Colorado senior living that feels like home — with the professionalism families trust.",
    subtitle: "Locally Owned • Resident‑Focused",
    description: "Four Front Range communities + in-home support. Clear pricing, personalized care, and a team supported as well as they support you.",
    backgroundImageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1600&auto=format&fit=crop",
    ctaText: "Find a Community",
    ctaLink: "/communities",
    overlayOpacity: "0.85",
    textAlignment: "left",
  };

  // Merge hero data with defaults (only use non-empty values from API)
  const hero = {
    ...defaultHero,
    ...(heroData ? {
      title: heroData.title || defaultHero.title,
      subtitle: heroData.subtitle || defaultHero.subtitle,
      description: heroData.description || defaultHero.description,
      backgroundImageUrl: heroData.backgroundImageUrl || defaultHero.backgroundImageUrl,
      ctaText: heroData.ctaText || defaultHero.ctaText,
      ctaLink: heroData.ctaLink || defaultHero.ctaLink,
      overlayOpacity: heroData.overlayOpacity || defaultHero.overlayOpacity,
      textAlignment: heroData.textAlignment || defaultHero.textAlignment,
    } : {}),
  };

  // Resolve the background image URL if it's an image ID
  const resolvedBackgroundImageUrl = useResolveImageUrl(hero.backgroundImageUrl);

  // Track selected carousel index for visual emphasis
  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateSelectedIndex = () => {
      setSelectedIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", updateSelectedIndex);
    updateSelectedIndex(); // Set initial index

    return () => {
      carouselApi.off("select", updateSelectedIndex);
    };
  }, [carouselApi]);

  const { data: communities = [], isLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  // Fetch homepage sections
  const { data: homepageSections = [] } = useQuery<HomepageSection[]>({
    queryKey: ["/api/homepage-sections"],
  });
  
  // Get the sections we need
  const transparentSection = homepageSections.find(s => s.slug === 'transparent-pricing' && s.visible);
  const locallyOwnedSection = homepageSections.find(s => s.slug === 'locally-owned' && s.visible);
  const safetySection = homepageSections.find(s => s.slug === 'safety-with-dignity' && s.visible);
  
  // Resolve image URLs at component level (hooks must be called at top level)
  const transparentSectionImageUrl = useResolveImageUrl(transparentSection?.imageId);
  const locallyOwnedSectionImageUrl = useResolveImageUrl(locallyOwnedSection?.imageId);
  const safetySectionImageUrl = useResolveImageUrl(safetySection?.imageId);

  // Fetch homepage config for the differentiators section
  const { data: homepageConfig } = useQuery<HomepageConfig>({
    queryKey: ["/api/homepage-config/stage-difference"],
    queryFn: async () => {
      const response = await fetch("/api/homepage-config/stage-difference");
      if (!response.ok) {
        // Return default if no config exists
        if (response.status === 404) return null;
        throw new Error("Failed to fetch homepage config");
      }
      return response.json();
    },
  });

  const featuredCommunities = communities; // Show all communities in carousel

  const handleFormSuccess = () => {
    setShowContactForm(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        {resolvedBackgroundImageUrl && (
          <img
            src={resolvedBackgroundImageUrl}
            alt="Senior living community with beautiful gardens"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
        )}
        {!resolvedBackgroundImageUrl && resolvedBackgroundImageUrl !== null && (
          <img
            src={hero.backgroundImageUrl}
            alt="Senior living community with beautiful gardens"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
        )}
        {/* Enhanced Multi-layer Overlay for Better Text Legibility */}
        <div className="absolute inset-0 bg-black/20" />
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[var(--deep-blue)] via-[var(--bright-blue)] to-[var(--deep-blue)]"
          style={{ opacity: parseFloat(hero.overlayOpacity || "0.85") }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-white">
          <div className={`max-w-3xl ${hero.textAlignment === 'center' ? 'mx-auto text-center' : hero.textAlignment === 'right' ? 'ml-auto text-right' : ''}`}>
            {hero.subtitle && (
              <p className="uppercase tracking-widest text-white text-xs mb-2 drop-shadow-sm" data-testid="hero-tagline">
                {hero.subtitle}
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white drop-shadow-md" data-testid="hero-title">
              {hero.title}
            </h1>
            {hero.description && (
              <p className="mt-6 text-xl text-white leading-relaxed drop-shadow-sm" data-testid="hero-description">
                {hero.description}
              </p>
            )}
            <div className={`mt-8 flex flex-wrap gap-4 ${hero.textAlignment === 'center' ? 'justify-center' : hero.textAlignment === 'right' ? 'justify-end' : ''}`}>
              {hero.ctaText && hero.ctaLink && (
                <Button 
                  size="lg" 
                  className="bg-[var(--stage-copper)] text-white hover:bg-gradient-to-r hover:from-[var(--stage-copper)] hover:to-[var(--foothill-sage)] font-semibold shadow-lg px-8 py-6 text-lg transition-all duration-300"
                  asChild
                  data-testid="button-hero-cta"
                >
                  <Link href={hero.ctaLink}>
                    {hero.ctaLink.includes('communities') && <MapPin className="w-5 h-5 mr-2" />}
                    {hero.ctaText}
                  </Link>
                </Button>
              )}
              <Button 
                size="lg" 
                variant="glassmorphism"
                className="font-semibold px-8 py-6 text-lg"
                onClick={() => openScheduleTour({
                  title: "Schedule a Tour",
                  description: "Visit one of our Colorado communities and experience the Stage Senior difference."
                })}
                data-testid="button-schedule-tour"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Tour
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Carousel */}
      <section id="finder" className="py-16 bg-primary text-white relative overflow-hidden">
        {/* Enhanced dark background overlay */}
        <div className="absolute inset-0 bg-primary/95 z-0" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Find your Colorado community
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Find a community near you and explore all the benefits of vibrant independent living.
            </p>
          </div>
          
          {/* Carousel */}
          {isLoading ? (
            <div className="flex justify-center gap-6 px-12">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="relative overflow-hidden flex-shrink-0 w-full max-w-md bg-white/10 border-white/20">
                  <Skeleton className="h-80 bg-white/20" />
                  <CardContent className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-3/4 bg-white/30" />
                      <Skeleton className="h-4 w-1/2 bg-white/20" />
                      <Skeleton className="h-4 w-full bg-white/20" />
                      <Skeleton className="h-10 w-full mt-4 bg-white/30" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredCommunities.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto mb-6 text-white/60" />
              <h3 className="text-2xl font-bold mb-4">No communities found</h3>
              <p className="text-white/90 mb-6">
                Try adjusting your search or filters to find communities that match your needs.
              </p>
              <Button asChild variant="secondary" size="lg" data-testid="button-view-all-communities">
                <Link href="/communities">
                  View All Communities
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Carousel
                opts={{
                  loop: true,
                  align: "center",
                }}
                setApi={setCarouselApi}
                className="w-full"
                data-testid="communities-carousel"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {featuredCommunities.map((community, index) => (
                    <CarouselItem 
                      key={community.id} 
                      className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                      data-testid={`carousel-item-${community.id}`}
                    >
                      <CarouselCommunityCard
                        community={community}
                        index={index}
                        selectedIndex={selectedIndex}
                        setShowContactForm={setShowContactForm}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                {/* Navigation - only show if more than 1 community */}
                {featuredCommunities.length > 1 && (
                  <>
                    <CarouselPrevious 
                      className="absolute -left-12 top-1/2 -translate-y-1/2 h-10 w-10 bg-white text-primary hover:bg-white/90 shadow-lg border-0"
                      aria-label="Previous community"
                      data-testid="carousel-previous"
                    />
                    <CarouselNext 
                      className="absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10 bg-white text-primary hover:bg-white/90 shadow-lg border-0"
                      aria-label="Next community"
                      data-testid="carousel-next"
                    />
                  </>
                )}
                
                {/* Progress indicators - inside carousel context */}
                <div className="flex flex-col items-center gap-3 mt-6">
                  {/* Dot indicators */}
                  <CarouselDots
                    count={featuredCommunities.length}
                    current={selectedIndex}
                    className="flex items-center justify-center gap-2"
                    data-testid="carousel-dots"
                  />
                  
                  {/* Progress bar */}
                  <CarouselProgressBar
                    current={selectedIndex}
                    total={featuredCommunities.length}
                    className="w-64 max-w-full"
                    data-testid="carousel-progress"
                  />
                  
                  {/* Current position indicator */}
                  <div className="text-white/70 text-sm font-medium" data-testid="carousel-position">
                    {selectedIndex + 1} of {featuredCommunities.length}
                  </div>
                </div>
              </Carousel>
            </div>
          )}
        </div>
      </section>

      {/* Featured Differentiators */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {homepageConfig?.heading || "What Makes Stage Senior Different"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {homepageConfig?.subheading || "Three pillars that define our commitment to Colorado families"}
            </p>
          </div>
          
          <div className="space-y-24">
            {/* Feature 1: Transparent Care Points - Left Aligned */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                  {transparentSectionImageUrl && (
                    <img
                      src={transparentSectionImageUrl}
                      alt="Senior resident reviewing care pricing with staff member"  
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  {!transparentSectionImageUrl && transparentSectionImageUrl !== null && (
                    <img
                      src={carePricingImage}
                      alt="Senior resident reviewing care pricing with staff member"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  {transparentSection?.subtitle || 'Featured'}
                </Badge>
                <h3 className="text-3xl font-bold mb-6">
                  <CheckCircle className="inline w-8 h-8 text-primary mr-3" />
                  {transparentSection?.title || 'Transparent Care-Based Pricing'}
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {transparentSection?.body || 'No hidden fees. No surprises. Our published Care Points menu clearly shows what services cost and when they apply. Changes only happen when care needs truly change—with advance notice and family partnership every step of the way.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild data-testid="button-care-points">
                    <Link href={transparentSection?.ctaUrl || '/care-points'}>
                      {transparentSection?.ctaLabel || 'See How Care Points Work'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Feature 2: Locally Owned - Right Aligned */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  {locallyOwnedSection?.subtitle || 'Since 2016'}
                </Badge>
                <h3 className="text-3xl font-bold mb-6">
                  <Award className="inline w-8 h-8 text-primary mr-3" />
                  {locallyOwnedSection?.title || 'Locally Owned & Operated'}
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {locallyOwnedSection?.body || 'Colorado born, Colorado proud. As a locally owned company, we make decisions right here—not in some corporate boardroom. Our leadership knows residents by name, and our teams stay for years, not months. That\'s the difference local ownership makes.'}
                </p>
                {locallyOwnedSection?.ctaLabel && locallyOwnedSection?.ctaUrl && (
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Button size="lg" asChild data-testid="button-locally-owned">
                      <Link href={locallyOwnedSection.ctaUrl}>
                        {locallyOwnedSection.ctaLabel}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Decision-makers you can actually meet</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Long-tenured staff who become like family</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Community partnerships that run deep</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                  {locallyOwnedSectionImageUrl && (
                    <img
                      src={locallyOwnedSectionImageUrl}
                      alt="Local Colorado team and leadership"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  {!locallyOwnedSectionImageUrl && locallyOwnedSectionImageUrl !== null && (
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1600&auto=format&fit=crop"
                      alt="Local Colorado team and leadership"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Feature 3: Safety with Dignity - Left Aligned */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                  {safetySectionImageUrl && (
                    <img
                      src={safetySectionImageUrl}
                      alt="Advanced safety technology"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  {!safetySectionImageUrl && safetySectionImageUrl !== null && (
                    <img
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop"
                      alt="Advanced safety technology"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  {safetySection?.subtitle || 'Innovation'}
                </Badge>
                <h3 className="text-3xl font-bold mb-6">
                  <Shield className="inline w-8 h-8 text-primary mr-3" />
                  {safetySection?.title || 'Safety with Dignity'}
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {safetySection?.body || 'Advanced fall detection that works like a guardian angel—always watching, never intrusive. Our smart technology provides rapid response while preserving independence and privacy. It\'s safety that respects dignity, not a system that feels like surveillance.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild data-testid="button-safety-dignity">
                    <Link href={safetySection?.ctaUrl || '/safety-with-dignity'}>
                      {safetySection?.ctaLabel || 'Explore Our Technology'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* Pricing Teaser */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/5 to-white border-primary/20 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Link href="/care-points">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 hover:text-primary transition-colors cursor-pointer">
                      Clear pricing, no surprises
                    </h2>
                  </Link>
                  <p className="text-xl text-muted-foreground mb-6">
                    See starting rates by community and explore our Care Points system that prevents unexpected charges. We give advance notice and partner with families on any changes.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg" 
                      variant="outline"
                      asChild
                      data-testid="button-learn-care-points"
                    >
                      <Link href="/care-points">How Care Points Work</Link>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-primary mb-2">$3,855+</div>
                    <div className="text-sm text-muted-foreground">Starting Monthly Rate</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-primary mb-2">4</div>
                    <div className="text-sm text-muted-foreground">Colorado Communities</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-primary mb-2">2016</div>
                    <div className="text-sm text-muted-foreground">Locally Owned Since</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Lead Generation Panel - Blue Background for CTA Emphasis */}
      <section id="lead" className="py-16 bg-gradient-to-br from-[var(--deep-blue)] to-[var(--bright-blue)] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Talk to a real local advisor today
              </h2>
              <p className="text-xl text-white/90 mb-6">
                Get a callback today
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-[var(--deep-blue)] text-white hover:bg-gradient-to-r hover:from-[var(--deep-blue)] hover:to-[var(--bright-blue)]"
                  asChild
                  data-testid="button-call-now"
                >
                  <a href="tel:+1-970-444-4689">
                    <Phone className="w-5 h-5 mr-2" />
                    Call (970) 444‑4689
                  </a>
                </Button>
                <Button 
                  variant="glassmorphism"
                  size="lg" 
                  onClick={() => setShowContactForm(true)}
                  data-testid="button-request-callback"
                >
                  Request Callback
                </Button>
              </div>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  Same‑day and next‑day tours available
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  Transparent availability & pricing information
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  Expert help comparing communities and care options
                </li>
              </ul>
            </div>
            
{showContactForm ? (
              <LeadCaptureForm
                variant="inline"
                title="Get Your Free Consultation"
                description="Talk to a local senior living advisor about your needs and timeline"
                urgencyText="✨ Most calls returned within 10 minutes"
                onSuccess={handleFormSuccess}
                className="max-w-lg"
              />
            ) : (
              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <Mail className="w-16 h-16 mx-auto mb-6 text-primary" />
                  <h3 className="text-2xl font-bold mb-4">Get Expert Guidance</h3>
                  <p className="text-muted-foreground mb-6">
                    Our senior living advisors are standing by to help you find the perfect community for your loved one.
                  </p>
                  <Button 
                    size="lg" 
                    variant="default"
                    onClick={() => setShowContactForm(true)}
                    className="w-full"
                    data-testid="button-show-contact-form"
                  >
                    Start Your Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
      
      {/* Community Selection Modal */}
      <CommunitySelectionModal 
        open={showCommunityModal}
        onOpenChange={setShowCommunityModal}
        communities={communities}
      />
    </div>
  );
}