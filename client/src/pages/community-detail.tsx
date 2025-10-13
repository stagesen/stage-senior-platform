import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import EventCard from "@/components/EventCard";
import EventDetailsModal from "@/components/EventDetailsModal";
import FloorPlanModal from "@/components/FloorPlanModal";
import GalleryModal from "@/components/GalleryModal";
import CommunityMap from "@/components/CommunityMap";
import { 
  MapPin, 
  Phone, 
  Calendar, 
  Mail,
  Star,
  Shield,
  ChevronLeft,
  Home,
  Users,
  Sparkles,
  Image,
  MessageSquare,
  Wifi,
  Car,
  Coffee,
  Heart,
  Activity,
  BookOpen,
  Clock,
  DollarSign,
  CheckCircle,
  ChevronRight,
  Bath,
  Bed,
  Square,
  Download,
  ArrowRight,
  Trees,
  User
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { getCommunityFurtherClass } from "@/lib/furtherWidgetUtils";
import ScrollToTop from "@/components/ScrollToTop";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import stageSeniorLogo from "@assets/stage-horizintal_1759766576925.webp";
import defaultBrochureImage from "@/assets/community-brochure-default.png";
import NewsletterCard from "@/components/NewsletterCard";
import type { 
  Community, 
  Event, 
  Faq, 
  Gallery, 
  FloorPlan, 
  Testimonial, 
  GalleryImageWithDetails, 
  Post, 
  BlogPost,
  CommunityHighlight,
  TeamMember 
} from "@shared/schema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Helper function for formatting prices
const formatPrice = (price: number | undefined | null): string => {
  if (price === null || price === undefined) return 'Contact for pricing';
  if (price === 0) return '$0'; // Handle actual zero price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Local subcomponent: Highlight Card
const HighlightCard = ({ highlight }: { highlight: { title: string; description: string; imageUrl?: string; imageId?: string; ctaLabel?: string; ctaHref?: string } }) => {
  // Pass imageId directly - useResolveImageUrl handles the API path internally
  const resolvedImageUrl = useResolveImageUrl(highlight.imageId || highlight.imageUrl);
  
  return (
    <Card className="overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <img
          src={resolvedImageUrl || "https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?w=800&q=80"}
          alt={highlight.title}
          className="w-full h-full object-cover"
          data-testid={`highlight-${highlight.title.toLowerCase().replace(/\s+/g, '-')}`}
        />
      </AspectRatio>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-primary">{highlight.title}</h3>
        <p className="text-gray-600 mb-4">{highlight.description}</p>
        {highlight.ctaLabel && highlight.ctaHref && (
          <Button 
            asChild 
            variant="default" 
            size="sm"
            data-testid={`highlight-cta-${highlight.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {highlight.ctaHref.startsWith('http') ? (
              <a href={highlight.ctaHref} target="_blank" rel="noopener noreferrer">
                {highlight.ctaLabel}
                <ChevronRight className="ml-1 w-4 h-4" />
              </a>
            ) : (
              <Link href={highlight.ctaHref}>
                {highlight.ctaLabel}
                <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Local subcomponent: Floor Plan Card
const FloorPlanCard = ({ plan, onOpen }: { plan: any, onOpen: (plan: any) => void }) => {
  const resolvedImageUrl = useResolveImageUrl(plan.imageId || plan.imageUrl);

  return (
    <Card
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border-gray-200 h-full flex flex-col"
      onClick={() => onOpen(plan)}
      data-testid={`floor-plan-${plan.id}`}
    >
      {resolvedImageUrl && (
        <div className="relative overflow-hidden bg-gray-100">
          <AspectRatio ratio={16/10}>
            <img
              src={resolvedImageUrl}
              alt={`${plan.name} floor plan`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              data-testid={`floor-plan-image-${plan.id}`}
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h4 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-primary transition-colors" data-testid={`floor-plan-name-${plan.id}`}>
            {plan.name}
          </h4>
          {plan.startingPrice && (
            <p className="text-3xl font-bold text-primary mb-4" data-testid={`floor-plan-price-${plan.id}`}>
              {formatPrice(plan.startingPrice)}
              <span className="text-base font-normal text-gray-600">/mo</span>
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-base text-gray-700 mb-4">
            {plan.bedrooms !== null && (
              <span className="flex items-center gap-2" data-testid={`floor-plan-bedrooms-${plan.id}`}>
                <Bed className="w-5 h-5 text-primary" />
                <span className="font-medium">{plan.bedrooms}</span> {plan.bedrooms === 1 ? 'Bed' : 'Beds'}
              </span>
            )}
            {plan.bathrooms !== null && (
              <span className="flex items-center gap-2" data-testid={`floor-plan-bathrooms-${plan.id}`}>
                <Bath className="w-5 h-5 text-primary" />
                <span className="font-medium">{Number(plan.bathrooms)}</span> {Number(plan.bathrooms) === 1 ? 'Bath' : 'Baths'}
              </span>
            )}
            {plan.squareFeet && (
              <span className="flex items-center gap-2" data-testid={`floor-plan-sqft-${plan.id}`}>
                <Square className="w-5 h-5 text-primary" />
                <span className="font-medium">{plan.squareFeet}</span> sq ft
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-base font-semibold text-primary group-hover:text-primary-dark transition-colors">View Floor Plan</span>
          <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to extract care type from floor plan name
const extractCareType = (planName: string): string => {
  // Try format: "Care Type - Plan Name" (care type comes first)
  const beforeDashMatch = planName.match(/^(.+?)\s*(?:–|—|-)\s*/);
  if (beforeDashMatch) {
    return beforeDashMatch[1].trim();
  }

  // Try format: "Plan Name – Care Type" (care type comes last)
  const afterDashMatch = planName.match(/(?:–|—|-)\s*(.+)$/);
  if (afterDashMatch) {
    return afterDashMatch[1].trim();
  }

  // No dash found, return the whole name
  return planName.trim();
};

// Local subcomponent: Floor Plans Carousel
const FloorPlansCarousel = ({ plans, onOpen }: { plans: any[], onOpen: (plan: any) => void }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedCareType, setSelectedCareType] = useState<string>("All");

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Extract unique care types from plans
  const careTypes = useMemo(() => {
    const types = new Set<string>();
    plans.forEach(plan => {
      const careType = extractCareType(plan.name);
      types.add(careType);
    });
    return ["All", ...Array.from(types).sort()];
  }, [plans]);

  // Filter plans based on selected care type
  const filteredPlans = useMemo(() => {
    if (selectedCareType === "All") return plans;
    return plans.filter(plan => extractCareType(plan.name) === selectedCareType);
  }, [plans, selectedCareType]);

  // Reset carousel to first slide when filter changes
  useEffect(() => {
    if (api) {
      api.scrollTo(0);
    }
  }, [selectedCareType, api]);

  return (
    <div className="relative">
      {/* Care Type Filter Buttons */}
      {careTypes.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {careTypes.map((careType) => (
            <Button
              key={careType}
              variant={selectedCareType === careType ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCareType(careType)}
              className="transition-all"
            >
              {careType}
            </Button>
          ))}
        </div>
      )}

      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: filteredPlans.length > 1,
        }}
        className="w-full px-4 md:px-16"
      >
        <CarouselContent className="-ml-4 md:-ml-6">
          {filteredPlans.map((plan, index) => {
            const isCurrent = index === current;
            const isPrev = index === current - 1 || (current === 0 && index === filteredPlans.length - 1);
            const isNext = index === current + 1 || (current === filteredPlans.length - 1 && index === 0);
            
            return (
              <CarouselItem 
                key={plan.id} 
                className={cn(
                  "pl-4 md:pl-6 basis-full transition-all duration-700 ease-in-out",
                  isCurrent 
                    ? "md:basis-3/5 lg:basis-1/2 scale-100 opacity-100 z-10" 
                    : "md:basis-2/5 lg:basis-1/4 scale-90 md:scale-75 opacity-50 md:opacity-30 z-0"
                )}
              >
                <div 
                  className={cn(
                    "transition-all duration-700 ease-in-out h-full",
                    !isCurrent && "pointer-events-none select-none"
                  )}
                >
                  <FloorPlanCard plan={plan} onOpen={onOpen} />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-8 lg:-left-14 h-14 w-14 bg-white/95 hover:bg-white shadow-xl border-2 hover:scale-110 transition-all" />
        <CarouselNext className="hidden md:flex -right-8 lg:-right-14 h-14 w-14 bg-white/95 hover:bg-white shadow-xl border-2 hover:scale-110 transition-all" />
      </Carousel>

      {/* Carousel indicators */}
      {filteredPlans.length > 0 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 rounded-full transition-all",
                current === index ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredPlans.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No floor plans available for {selectedCareType}
        </div>
      )}
    </div>
  );
};

// Local subcomponent: Gallery Overview
const GalleryOverview = ({ galleries, onGallerySelect }: { galleries: any[], onGallerySelect: (gallery: any) => void }) => {
  // Map our gallery categories to icons
  const categoryConfig: Record<string, { icon: typeof Users; displayName: string }> = {
    'life-activities': { icon: Users, displayName: 'Life & Activities' },
    'apartments-spaces': { icon: Home, displayName: 'Apartments & Spaces' },
    'care-team': { icon: Heart, displayName: 'Care & Team' },
    'outdoors-colorado': { icon: Trees, displayName: 'Outdoors & Colorado' },
  };

  // Ensure galleries is always an array
  const items = galleries ?? [];

  // Get galleries with images for the main grid (show first 4 galleries)
  const galleriesWithImages = items.filter(g => g.images && g.images.length > 0);
  const mainGalleries = galleriesWithImages.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Gallery Cards Grid - Show first 4 galleries as cards */}
      {mainGalleries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {mainGalleries.map((gallery) => {
            const images = gallery.images || [];
            const totalImages = images.length;
            const previewImages = images.slice(0, 4);

            return (
              <Card 
                key={gallery.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-gray-50 to-white border-gray-200"
                onClick={() => onGallerySelect(gallery)}
                data-testid={`gallery-card-${gallery.id}`}
              >
                {/* Gallery Preview Grid */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  {previewImages.length > 0 && (
                    <div className={`grid ${previewImages.length === 1 ? 'grid-cols-1' : previewImages.length === 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-0.5 h-full`}>
                      {previewImages.map((image: { url: string; alt?: string }, idx: number) => (
                        <div 
                          key={idx}
                          className={`relative overflow-hidden ${
                            previewImages.length === 3 && idx === 0 ? 'col-span-2' : ''
                          } ${previewImages.length === 4 ? '' : ''}`}
                        >
                          <img
                            src={image.url}
                            alt={image.alt || `${gallery.title} image ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Overlay with fade effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* View Gallery Text on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <span className="text-gray-900 font-semibold flex items-center gap-2">
                        <Image className="w-5 h-5" />
                        View Gallery
                      </span>
                    </div>
                  </div>

                  {/* Image Count Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-lg">
                    <Image className="w-4 h-4" />
                    <span>{totalImages} {totalImages === 1 ? 'Photo' : 'Photos'}</span>
                  </div>
                </div>

                {/* Gallery Info */}
                <CardContent className="p-5 bg-white">
                  <h3 className="font-bold text-xl text-gray-900 mb-1.5 group-hover:text-primary transition-colors" data-testid={`gallery-title-${gallery.id}`}>
                    {gallery.title}
                  </h3>
                  {gallery.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {gallery.description}
                    </p>
                  )}
                  <div className="flex items-center mt-3 text-primary group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium">Explore Gallery</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Gallery Category Cards - Additional galleries or categories */}
      {items.length > 4 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.slice(4, 8).map((gallery) => {
            const config = categoryConfig[gallery.category] || { icon: Image, displayName: gallery.title };
            const IconComponent = config.icon;
            const coverImage = gallery.images?.[0];
            const totalImages = gallery.images?.length || 0;

            return (
              <Card 
                key={gallery.id} 
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => onGallerySelect(gallery)}
                data-testid={`gallery-category-${gallery.category}`}
              >
                <AspectRatio ratio={4/3}>
                  {coverImage ? (
                    <img
                      src={coverImage.url}
                      alt={coverImage.alt || `${gallery.title} gallery`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                      <IconComponent className="w-12 h-12 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-semibold text-lg mb-0.5">{gallery.title}</h3>
                    <p className="text-xs opacity-90">{totalImages} Photos</p>
                  </div>
                </AspectRatio>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Local subcomponent: Testimonials Carousel
const TestimonialsCarousel = ({ testimonials }: { testimonials: any[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-advance with respect to reduced motion
  useEffect(() => {
    if (!api) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id}>
              <div className="px-8 py-12 text-center">
                <blockquote className="text-xl md:text-2xl font-bold text-gray-900 mb-8 leading-tight" data-testid={`testimonial-quote-${testimonial.id}`}>
                  "{testimonial.content}"
                </blockquote>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-800" data-testid={`testimonial-author-${testimonial.id}`}>
                    {testimonial.authorName}
                  </p>
                  {testimonial.authorRelation && (
                    <p className="text-lg text-gray-600" data-testid={`testimonial-relation-${testimonial.id}`}>
                      {testimonial.authorRelation}
                    </p>
                  )}
                  {testimonial.rating && (
                    <div className="flex items-center justify-center gap-1 mt-4" data-testid={`testimonial-rating-${testimonial.id}`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-6 h-6 ${i < (testimonial.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              current === index + 1 ? 'bg-primary w-8' : 'bg-gray-300'
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Local subcomponent: Feature Section
const FeatureSection = ({ 
  title, 
  eyebrow, 
  body, 
  imageUrl, 
  imageAlt, 
  cta, 
  imageLeft = false 
}: { 
  title: string;
  eyebrow?: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  cta?: { label: string; href: string; };
  imageLeft?: boolean;
}) => {
  const resolvedImageUrl = useResolveImageUrl(imageUrl);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className={`${imageLeft ? 'md:order-2' : ''}`}>
        {eyebrow && (
          <Badge className="mb-4 bg-primary/10 text-primary border-0">
            {eyebrow}
          </Badge>
        )}
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">{body}</p>
        {cta && (
          <Button variant="outline" size="lg" asChild data-testid={`button-feature-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <Link href={cta.href}>
              {cta.label}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        )}
      </div>
      <div className={`${imageLeft ? 'md:order-1' : ''}`}>
        <AspectRatio ratio={4/3}>
          <img
            src={resolvedImageUrl || imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover rounded-2xl shadow-xl"
          />
        </AspectRatio>
      </div>
    </div>
  );
};

// Component to fetch and display community features
const CommunityFeatures = ({ community }: { community: Community }) => {
  // Resolve experience images
  const experienceImage1Url = useResolveImageUrl(community.experienceImage1Id);
  const experienceImage2Url = useResolveImageUrl(community.experienceImage2Id);
  const experienceImage3Url = useResolveImageUrl(community.experienceImage3Id);
  const experienceImage4Url = useResolveImageUrl(community.experienceImage4Id);

  // Fetch features from database
  const { data: features = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/communities/${community.id}/features`],
  });

  // Default hardcoded features as fallback - use uploaded experience images if available
  const defaultFeatures = [
    {
      eyebrow: "Fine Dining",
      title: "Extraordinary Dining Experience",
      body: "There's no need to worry about cooking. You can dine on nutritious, homestyle cuisine in our beautiful dining room—complete with great conversation. Our professional chefs prepare fresh, locally-sourced meals daily, with menus designed by nutritionists to meet your dietary needs.",
      imageUrl: experienceImage1Url || "https://images.unsplash.com/photo-1577308856961-1d3371de3c2b?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Extraordinary dining experience featuring seniors enjoying nutritious, homestyle cuisine in a beautiful dining room",
      ctaLabel: "View Sample Menu",
      ctaHref: "#menu",
      imageLeft: false
    },
    {
      eyebrow: "Active Living",
      title: "Engaging Lifestyle Programs",
      body: "From staying active to getting creative to learning new skills, we offer a diverse variety of ways for you to pursue your hobbies and interests. Our activities director creates a monthly calendar filled with fitness classes, art workshops, educational seminars, and social events tailored to your preferences.",
      imageUrl: experienceImage2Url || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Engaging lifestyle activities featuring seniors staying active, getting creative, and learning new skills",
      ctaLabel: "View Engagement Calendar",
      ctaHref: `/events?community=${community.slug || community.id}`,
      imageLeft: true
    },
    {
      eyebrow: "Prime Location",
      title: "Ideal Location & Neighborhood",
      body: "You can easily enjoy the area with nearby attractions, dining options, and recreational activities perfectly suited for an active lifestyle. Our community is conveniently located near medical facilities, shopping centers, parks, and cultural destinations, keeping you connected to everything you love.",
      imageUrl: experienceImage3Url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Seniors enjoying ideal location lifestyle with access to golf courses, local eateries, and parks",
      ctaLabel: "Get Directions",
      ctaHref: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(community.address || `${community.city}, ${community.state} ${community.zipCode}`)}`,
      imageLeft: false
    },
    {
      eyebrow: "Personalized Care",
      title: "24/7 Professional Care Team",
      body: "Rest assured knowing our dedicated team of licensed nurses and certified caregivers is available around the clock. We provide personalized care plans tailored to your unique needs, from medication management to assistance with daily activities, all while preserving your independence and dignity.",
      imageUrl: experienceImage4Url || "https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Professional care team assisting seniors with compassion and expertise",
      imageLeft: true
    }
  ];

  // Use database features if available, otherwise use defaults
  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  if (isLoading) {
    return (
      <div className="space-y-20">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <Skeleton className="h-64" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {displayFeatures
        .filter((feature: any) => feature.active !== false) // Show all features if active is undefined or true
        .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((feature: any, index: number) => (
          <FeatureSection
            key={feature.id || index}
            eyebrow={feature.eyebrow}
            title={feature.title}
            body={feature.body}
            imageUrl={feature.imageUrl || feature.imageId || ""}
            imageAlt={feature.imageAlt || `${feature.title} image`}
            cta={feature.ctaLabel && feature.ctaHref ? {
              label: feature.ctaLabel,
              href: feature.ctaHref
            } : undefined}
            imageLeft={feature.imageLeft}
          />
        ))}
    </>
  );
};


// Local subcomponent: Blog Post Card
const BlogPostCard = ({ post }: { post: BlogPost }) => {
  const resolvedThumbnail = useResolveImageUrl(post.thumbnailImage);
  const resolvedMainImage = useResolveImageUrl(post.mainImage);
  
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden bg-white" data-testid={`blog-post-${post.id}`}>
      <div className="relative">
        {(resolvedThumbnail || resolvedMainImage) ? (
          <div className="h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <img
              src={resolvedThumbnail || resolvedMainImage || ''}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="h-56 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
            <Image className="w-16 h-16 text-primary/30" />
          </div>
        )}
        {post.featured && (
          <Badge className="absolute top-4 left-4 bg-yellow-500 text-white border-0">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </Badge>
        )}
        {post.category && (
          <Badge className="absolute top-4 right-4 bg-white/90 text-gray-700 backdrop-blur-sm">
            {post.category}
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          {post.author && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="capitalize">{post.author.replace(/-/g, ' ')}</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors" data-testid={`blog-post-title-${post.id}`}>
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4" data-testid={`blog-post-summary-${post.id}`}>
          {post.summary || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {post.tags && post.tags.slice(0, 2).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                {tag}
              </Badge>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 group/btn" asChild>
            <Link href={`/blog/${post.slug}`}>
              <span className="mr-1">Read</span>
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Local subcomponent: Action Panel
const ActionPanel = ({ community, handleNavClick }: { community: any; handleNavClick: (sectionId: string) => void }) => {
  // Fetch team members for this community
  const { data: teamMembers = [], isLoading: teamMembersLoading } = useQuery<TeamMember[]>({
    queryKey: [`/api/communities/${community.id}/team-members`],
    enabled: !!community?.id,
  });

  // Get the primary contact (first team member)
  const primaryContact = teamMembers[0];
  
  // Resolve avatar image URL - pass ID directly without /api/images prefix
  const avatarImageUrl = useResolveImageUrl(primaryContact?.avatarImageId || null);

  // Resolve image URLs
  const resolvedBrochureUrl = useResolveImageUrl(community?.brochureImageId);
  const resolvedContactUrl = useResolveImageUrl(community?.contactImageId);
  const resolvedPricingUrl = useResolveImageUrl(community?.pricingImageId);

  // Determine grid columns based on whether we have a team member
  const gridCols = primaryContact ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {/* Pricing Card */}
          <Card className="shadow-lg border-2 border-primary/20 overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={resolvedPricingUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000"}
                alt="Comfortable senior living apartment"
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Monthly Pricing</CardTitle>
              <CardDescription className="text-2xl font-bold text-primary mt-2" data-testid="pricing-amount">
                {community.startingPrice !== null && community.startingPrice !== undefined ? (
                  <>{formatPrice(community.startingPrice)}<span className="text-lg font-normal">/mo*</span></>
                ) : (
                  formatPrice(community.startingPrice)
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                {community.startingPrice !== null && community.startingPrice !== undefined
                  ? '*Pricing varies by care level and apartment type.'
                  : 'Contact us for personalized pricing information.'}
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <Link href="/care-points" className="text-primary hover:underline">
                    Care Points Pricing
                  </Link>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Month-to-month rentals</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>All-inclusive pricing</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                data-testid="button-view-pricing"
                onClick={() => handleNavClick('floor-plans')}
              >
                View Floor Plan Pricing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Team Member Card */}
          {primaryContact && (
            <Card className="shadow-lg border-2 border-primary/20 overflow-hidden">
              <div className="h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                {avatarImageUrl ? (
                  <img
                    src={avatarImageUrl}
                    alt={primaryContact.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-24 h-24 text-primary/40" />
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  A Message from Leadership
                </CardTitle>
                <CardDescription className="text-lg font-semibold text-gray-800 mt-2">
                  {primaryContact.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">{primaryContact.role}</p>
                  {primaryContact.department && (
                    <p className="text-xs text-gray-600">{primaryContact.department}</p>
                  )}
                </div>
                {primaryContact.bio ? (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {primaryContact.bio}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Welcome to {community.name}! Our team is dedicated to providing exceptional care and creating a warm, welcoming home for every resident. I invite you to meet our entire care team who makes this community so special.
                  </p>
                )}
                <Button asChild className="w-full" data-testid="button-meet-team">
                  <Link href={`/team?community=${community.slug}`}>
                    <Users className="w-4 h-4 mr-2" />
                    Meet the Team
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card className="shadow-lg overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={resolvedContactUrl || "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2000"}
                alt="Friendly staff ready to help"
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Contact Us</CardTitle>
              <CardDescription>Get in touch with our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <a href={`tel:${community.phone || '+1-970-444-4689'}`} className="text-primary hover:underline">
                      {community.phone || "(970) 444-4689"}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Visit Us</p>
                    <p className="text-sm text-muted-foreground">
                      {community.address}<br />
                      {community.city}, {community.state} {community.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Office Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Mon-Fri: 9:00 AM - 6:00 PM<br />
                      Sat-Sun: 10:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Brochure */}
          <Card className="shadow-lg border-primary/20 overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={resolvedBrochureUrl || defaultBrochureImage}
                alt="Community brochure preview"
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Community Brochure</CardTitle>
              <CardDescription>Complete information guide</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Get detailed information about our community, floor plans, services, and amenities in our comprehensive brochure.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span>Floor plans & pricing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span>Amenities & services</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span>Care levels & support</span>
                </li>
              </ul>
              {community.brochureLink ? (
                <Button 
                  className="w-full" 
                  data-testid="button-download-brochure"
                  asChild
                >
                  <a href={community.brochureLink} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    View PDF Brochure
                  </a>
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  data-testid="button-download-brochure"
                  disabled
                >
                  <Download className="w-4 h-4 mr-2" />
                  Brochure Not Available
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Local subcomponent: Enhanced Bottom CTA
const EnhancedBottomCTA = ({ community }: { community: any }) => {
  const { openScheduleTour } = useScheduleTour();
  const heroImageUrl = useResolveImageUrl(community?.heroImageUrl);
  
  // Check if we're resolving an image ID (UUID pattern)
  const isHeroImageId = community?.heroImageUrl && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(community.heroImageUrl);
  
  // Only use resolved URL when ready (prevents flash), otherwise use fallback or show gradient
  const finalHeroImageUrl = (isHeroImageId && heroImageUrl === null) 
    ? undefined // Still loading - show gradient instead
    : (heroImageUrl || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?q=80&w=2000');
  
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {finalHeroImageUrl ? (
          <>
            <img
              src={finalHeroImageUrl}
              alt="Community background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/75 via-blue-800/65 to-blue-600/55" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        {community.heroLogoSrc && (
          <img 
            src={community.heroLogoSrc} 
            alt={`${community.name} logo`}
            className="h-20 mx-auto mb-8"
          />
        )}

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Ready to Experience {community.name}?
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto">
          Join our community of residents who are living their best life. Schedule a personalized tour today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className={cn("text-lg px-8 py-6 shadow-2xl bg-white text-primary hover:bg-gray-100", getCommunityFurtherClass(community.slug || ''))}
            onClick={() => openScheduleTour({
              communityId: community.id,
              communityName: community.name,
              title: `Schedule a Tour at ${community.name}`,
              description: `Visit ${community.name} in ${community.city} to experience our exceptional community and amenities firsthand.`
            })}
            data-testid="button-schedule-tour-hero"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Your Tour Today
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white text-white bg-transparent hover:bg-white hover:text-gray-900 px-8 py-6 text-lg"
            asChild
            data-testid="button-call-hero"
          >
            <a href={`tel:${community.phone || '+1-970-444-4689'}`}>
              <Phone className="w-5 h-5 mr-2" />
              Call {community.phone || "(970) 444-4689"}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default function CommunityDetail() {
  const { openScheduleTour } = useScheduleTour();
  const params = useParams();
  const slug = params.slug;
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(null);
  const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<any>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>("overview");
  const [showNav, setShowNav] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!slug || window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  // Effect to show/hide navigation based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Show nav when scrolled past hero section (500px is roughly the hero height)
      const scrollPosition = window.scrollY;
      const heroHeight = 500; // Matches the hero section height
      setShowNav(scrollPosition > heroHeight - 100); // Show a bit before hero ends
    };

    window.addEventListener('scroll', handleScroll);
    // Don't check initial position - always start hidden

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: community, isLoading: communityLoading } = useQuery<Community>({
    queryKey: [`/api/communities/${slug}`],
    enabled: !!slug,
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: [`/api/events?communityId=${community?.id || ''}&upcoming=true`],
    enabled: !!slug && !!community?.id,
  });

  const { data: faqs = [] } = useQuery<Faq[]>({
    queryKey: [`/api/faqs?communityId=${community?.id || ''}&active=true`],
    enabled: !!slug && !!community?.id,
  });

  const { data: galleries = [] } = useQuery<Gallery[]>({
    queryKey: [`/api/galleries?communityId=${community?.id || ''}&active=true`],
    enabled: !!slug && !!community?.id,
  });

  const { data: floorPlans = [] } = useQuery<FloorPlan[]>({
    queryKey: [`/api/floor-plans?communityId=${community?.id || ''}&active=true`],
    enabled: !!slug && !!community?.id,
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: [`/api/testimonials?communityId=${community?.id || ''}&approved=true`],
    enabled: !!slug && !!community?.id,
  });

  const { data: galleryImages = [] } = useQuery<GalleryImageWithDetails[]>({
    queryKey: [`/api/gallery-images?communityId=${community?.id || ''}&active=true`],
    enabled: !!slug && !!community?.id,
  });

  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: [`/api/posts?communityId=${community?.id || ''}&published=true`],
    enabled: !!slug && !!community?.id,
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: [`/api/blog-posts?communityId=${community?.id || ''}&published=true`],
    enabled: !!slug && !!community?.id,
  });

  const { data: highlights = [] } = useQuery<CommunityHighlight[]>({
    queryKey: [`/api/communities/${community?.id || ''}/highlights`],
    enabled: !!slug && !!community?.id,
  });

  // Resolve hero image URL (handle both image ID and full URL)
  const heroImageUrl = useResolveImageUrl(community?.heroImageUrl);
  
  // Resolve experience image URL from experienceImageId field
  const experienceImageUrl = useResolveImageUrl(community?.experienceImageId);
  
  // Resolve private dining image URL from privateDiningImageId field
  const privateDiningImageUrl = useResolveImageUrl(community?.privateDiningImageId);

  // Computed values based on query data
  const galleryCategories = Array.from(new Set(galleryImages.map(img => img.category).filter(Boolean)));

  const hasAmenities = Boolean(
    (community as any)?.amenitiesData?.length || community?.amenities?.length
  );
  const hasFloorPlans = floorPlans.length > 0;
  const hasGallery = galleries.length > 0 && galleries.some(g => g.images && g.images.length > 0);
  const hasEvents = events.length > 0;
  const hasTestimonials = testimonials.length > 0;
  const hasPosts = posts.length > 0;
  const hasFaqs = faqs.length > 0;

  // Navigation sections memoization
  const navSections = useMemo(() => {
    const sections: { id: string; label: string }[] = [
      { id: "overview", label: "Overview" },
      { id: "highlights", label: "Highlights" },
    ];

    if (hasAmenities) {
      sections.push({ id: "amenities", label: "Amenities" });
    }

    if (hasFloorPlans) {
      sections.push({ id: "floor-plans", label: "Floor Plans & Pricing" });
    }

    if (hasGallery) {
      sections.push({ id: "gallery", label: "Gallery" });
    }

    if (hasEvents) {
      sections.push({ id: "events", label: "Events" });
    }

    if (hasTestimonials) {
      sections.push({ id: "testimonials", label: "Testimonials" });
    }

    if (hasPosts) {
      sections.push({ id: "news", label: "News" });
    }

    if (hasFaqs) {
      sections.push({ id: "faqs", label: "FAQs" });
    }

    sections.push({ id: "neighborhood", label: "Neighborhood" });
    sections.push({ id: "contact", label: "Contact" });

    return sections;
  }, [hasAmenities, hasFloorPlans, hasGallery, hasEvents, hasTestimonials, hasPosts, hasFaqs]);

  // Effect to manage active section based on navigation sections
  useEffect(() => {
    if (!navSections.length) {
      setActiveSection(null);
      return;
    }

    setActiveSection((current) => {
      if (current && navSections.some((section) => section.id === current)) {
        return current;
      }

      return navSections[0].id;
    });
  }, [navSections]);

  // Intersection Observer effect for active section tracking
  useEffect(() => {
    if (!navSections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const fallbackEntries = [...entries].sort(
          (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
        );

        const nextActiveEntry = visibleEntries[0] ?? fallbackEntries[0];
        const nextActiveId =
          nextActiveEntry?.target instanceof HTMLElement ? nextActiveEntry.target.id : null;

        if (nextActiveId) {
          setActiveSection(nextActiveId);
        }
      },
      {
        rootMargin: "-150px 0px -60%",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    const elements = navSections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [navSections]);

  // Helper functions - formatPrice is defined at the top of the file

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('dining')) return Coffee;
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return Wifi;
    if (amenityLower.includes('transport')) return Car;
    if (amenityLower.includes('fitness') || amenityLower.includes('gym')) return Activity;
    if (amenityLower.includes('library') || amenityLower.includes('learn')) return BookOpen;
    if (amenityLower.includes('health') || amenityLower.includes('medical')) return Heart;
    if (amenityLower.includes('social') || amenityLower.includes('community')) return Users;
    return Sparkles;
  };

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) {
      return;
    }

    const navElement = document.querySelector<HTMLElement>('[data-community-sticky-nav]');
    const offset = (navElement?.offsetHeight ?? 0) + 16;

    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition < 0 ? 0 : offsetPosition,
      behavior: "smooth",
    });

    setActiveSection(sectionId);
  };

  // Resolve the logo image from logoImageId
  const resolvedLogoUrl = useResolveImageUrl(community?.logoImageId);
  
  // Resolve the brochure image from brochureImageId 
  const resolvedBrochureUrl = useResolveImageUrl(community?.brochureImageId);
  
  // Hero logo overlay functionality
  const heroLogoSrc = resolvedLogoUrl || (community as any)?.logoUrl || (community as any)?.logoImageUrl || stageSeniorLogo;
  const heroLogoAlt = (community as any)?.logoAlt || `${community?.name || 'Community'} logo`;

  // WCAG contrast calculation for better accessibility
  const getContrastRatio = (color1: string, color2: string) => {
    const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = ((rgb >> 16) & 0xff) / 255;
      const g = ((rgb >> 8) & 0xff) / 255;
      const b = (rgb & 0xff) / 255;

      const sRGB = [r, g, b].map(c => 
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );

      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  };

  const getAccessibleTextColor = (bgColor: string) => {
    if (!bgColor || !bgColor.match(/^#[0-9a-fA-F]{6}$/)) return '#ffffff';

    const whiteContrast = getContrastRatio(bgColor, '#ffffff');
    const blackContrast = getContrastRatio(bgColor, '#000000');

    // Use WCAG AA standard (4.5:1 ratio)
    return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
  };

  // Memoize community styles to avoid recreation on each render
  const communityStyles = useMemo(() => {
    const mainColor = (community as any)?.mainColorHex || '#2563eb';
    const ctaColor = (community as any)?.ctaColorHex || '#f59e0b';

    return {
      '--community-main': mainColor,
      '--community-cta': ctaColor,
      '--community-main-text': getAccessibleTextColor(mainColor),
      '--community-cta-text': getAccessibleTextColor(ctaColor),
    } as React.CSSProperties;
  }, [(community as any)?.mainColorHex, (community as any)?.ctaColorHex]);

  // Early returns after all hooks
  if (communityLoading) {
    return (
      <div className="min-h-screen">
        <div className="h-96 bg-muted animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-12 w-2/3" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4" data-testid="not-found-title">
              Community Not Found
            </h1>
            <p className="text-muted-foreground mb-6" data-testid="not-found-description">
              The community you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild data-testid="button-back-communities">
              <Link href="/communities">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Communities
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if we're resolving an image ID (UUID pattern)
  const isHeroImageId = community?.heroImageUrl && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(community.heroImageUrl);
  
  // Only use resolved URL when ready (prevents flash), otherwise use fallback or show gradient
  const finalHeroImageUrl = (isHeroImageId && heroImageUrl === null) 
    ? undefined // Still loading - show gradient instead
    : (heroImageUrl || `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600`);

  return (
    <div className="min-h-screen bg-white" style={communityStyles}>
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {finalHeroImageUrl ? (
          <>
            <img
              src={finalHeroImageUrl}
              alt={`${community.name} - Senior Living Community`}
              className="w-full h-full object-cover"
              data-testid="hero-image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-800/60 to-blue-600/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600" />
        )}

        {/* Hero Logo Overlay */}
        {heroLogoSrc && (
          <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20">
            <div className="bg-white rounded-2xl shadow-lg px-4 py-3 md:px-6 md:py-4 border border-gray-300">
              <img
                src={heroLogoSrc}
                alt={heroLogoAlt}
                className="h-12 md:h-16 w-auto object-contain"
                data-testid="community-hero-logo"
              />
            </div>
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="community-name">
              {community.name}
            </h1>
            <div className="flex items-center text-white/90 text-lg mb-4" data-testid="community-location">
              <MapPin className="w-5 h-5 mr-2" />
              {community.address || `${community.city}, ${community.state} ${community.zipCode}`}
            </div>
            {community.careTypes && community.careTypes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {community.careTypes.map((careType) => (
                  <Badge 
                    key={careType} 
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm px-3 py-1"
                    data-testid={`care-type-${careType}`}
                  >
                    {careType.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Static Navigation Bar - Always visible below hero */}
      {navSections.length > 0 && (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-2 overflow-x-auto py-3" aria-label="Community sections">
              {navSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleNavClick(section.id)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                    activeSection === section.id
                      ? "text-primary border-primary"
                      : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                  )}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Sticky Community Navigation Bar - Appears on scroll */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md transition-all duration-300 ease-in-out",
          showNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
        data-community-sticky-nav
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section with Logo and Contact */}
          <div className="flex items-center justify-between py-4">
            {/* Community Branding */}
            <div className="flex items-center gap-4">
              {heroLogoSrc ? (
                <img
                  src={heroLogoSrc}
                  alt={heroLogoAlt}
                  className="h-10 md:h-12 w-auto object-contain"
                  data-testid="nav-community-logo"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: (community as any)?.mainColorHex || '#2563eb' }}
                  >
                    <Home className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">{community.name}</h2>
                    <p className="text-xs text-gray-600 hidden md:block">{community.city}, {community.state}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {community.phoneDisplay && (
                <a
                  href={`tel:${community.phoneDial || community.phoneDisplay}`}
                  className="hidden md:flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                  data-testid="nav-phone"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">{community.phoneDisplay}</span>
                </a>
              )}
              <Button 
                size="sm"
                className={cn("shadow-sm", getCommunityFurtherClass(community.slug || ''))}
                style={{ 
                  backgroundColor: (community as any)?.ctaColorHex || '#f59e0b',
                  color: (community as any)?.ctaColorHex ? getAccessibleTextColor((community as any).ctaColorHex) : '#ffffff'
                }}
                onClick={() => openScheduleTour({
                  communityId: community.id,
                  communityName: community.name,
                  title: `Schedule a Tour at ${community.name}`,
                  description: `Visit ${community.name} in ${community.city} to see our beautiful community and amenities in person.`
                })}
                data-testid="nav-schedule-tour"
              >
                <Calendar className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Schedule</span> Tour
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                asChild
                className="md:hidden"
                data-testid="nav-back-mobile"
              >
                <Link href="/communities">
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </Button>
              <Button 
                variant="outline"
                size="sm"
                asChild
                className="hidden md:inline-flex"
                data-testid="nav-back-desktop"
              >
                <Link href="/communities">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  All Communities
                </Link>
              </Button>
            </div>
          </div>

          {/* Section Navigation */}
          {navSections.length > 0 && (
            <nav className="flex gap-2 overflow-x-auto pb-3 -mb-px" aria-label="Community sections">
              {navSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleNavClick(section.id)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                    activeSection === section.id
                      ? "text-primary border-primary"
                      : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                  )}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* Newsletter Section - Featured Resource */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overview Content */}
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" data-testid="overview-title">
              Welcome to {community.name}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6" data-testid="community-description">
              {community.description || community.shortDescription ||
                "Experience exceptional senior living in a warm, welcoming community designed with your comfort and well-being in mind. Our dedicated team provides personalized care and support, ensuring every resident enjoys a fulfilling lifestyle."}
            </p>
          </div>

          {/* Newsletter Card */}
          <div className="md:col-span-1">
            <NewsletterCard communityId={community.id} />
          </div>
        </div>
      </div>

      {/* Main Content with Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">

            {/* Featured Testimonial */}
            {testimonials.length > 0 && (
              <div className="mb-12">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg overflow-hidden">
                  <CardContent className="p-8 md:p-12">
                    <div className="max-w-4xl mx-auto text-center">
                      {/* Quote Icon */}
                      <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                      </div>

                      {/* Testimonial Content */}
                      <blockquote className="text-xl md:text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
                        "{testimonials[0].content}"
                      </blockquote>

                      {/* Rating Stars */}
                      {testimonials[0].rating && (
                        <div className="flex items-center justify-center gap-1 mb-6">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < (testimonials[0].rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Author Info */}
                      <div className="flex items-center justify-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
                          <span className="text-primary font-bold text-xl">
                            {testimonials[0].authorName?.charAt(0) || 'R'}
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-lg text-gray-900">{testimonials[0].authorName}</p>
                          {testimonials[0].authorRelation && (
                            <p className="text-sm text-gray-600">{testimonials[0].authorRelation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Features & Highlights */}
            {highlights.length > 0 && (
              <section id="highlights" className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Community Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {highlights.map((highlight) => (
                    <HighlightCard key={highlight.id} highlight={{
                      ...highlight,
                      imageId: highlight.imageId ?? undefined,
                      ctaLabel: highlight.ctaLabel ?? undefined,
                      ctaHref: highlight.ctaHref ?? undefined
                    }} />
                  ))}
                </div>
              </section>
            )}


            {/* Amenities Showcase */}
            {community.amenities && community.amenities.length > 0 && (
              <section id="amenities" className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Amenities & Services</h2>
                <div className="bg-gray-50 rounded-2xl p-8">
                  <p className="text-lg text-gray-600 mb-8">
                    Step into a lifestyle where every day feels like a retreat. Our community is packed with thoughtful amenities designed to make life easier and more enjoyable.
                  </p>
                  <div className="flex flex-col gap-3">
                    {(() => {
                      const amenitiesList = (community as any).amenities || 
                        community.amenities?.map(name => ({ name })) || [];
                      const displayedAmenities = showAllAmenities ? amenitiesList : amenitiesList.slice(0, 5);
                      
                      return displayedAmenities.map((amenity: any, index: number) => {
                        const amenityName = typeof amenity === 'string' ? amenity : amenity.name;
                        const IconComponent = typeof amenity === 'string' ? 
                          getAmenityIcon(amenity) :
                          (amenity.icon ? 
                            (amenity.icon === 'Utensils' ? Coffee : 
                             amenity.icon === 'Coffee' ? Coffee :
                             amenity.icon === 'Car' ? Car :
                             amenity.icon === 'Activity' ? Activity :
                             amenity.icon === 'BookOpen' ? BookOpen :
                             amenity.icon === 'Heart' ? Heart :
                             amenity.icon === 'Users' ? Users :
                             amenity.icon === 'Wifi' ? Wifi :
                             Sparkles) : 
                            getAmenityIcon(amenityName));

                        // Helper function to determine amenity linking
                        const getAmenityLink = (name: string): { href: string; testIdPrefix: string } | null => {
                          if (!name) return null;
                          const lowerName = name.toLowerCase();
                          
                          // Check for dining-related amenities
                          const isRestaurantDining = lowerName.includes('restaurant') && lowerName.includes('dining');
                          const isPrivateFamilyDining = lowerName.includes('private') && lowerName.includes('family') && lowerName.includes('dining');
                          if (isRestaurantDining || isPrivateFamilyDining) {
                            return { href: `/dining?from=${community.slug}`, testIdPrefix: 'dining' };
                          }
                          
                          // Check for beauty salon/barber amenities
                          if (lowerName.includes('beauty salon') || lowerName.includes('barber')) {
                            return { href: `/beauty-salon?from=${community.slug}`, testIdPrefix: 'beauty-salon' };
                          }
                          
                          // Check for fitness/therapy amenities
                          if (lowerName.includes('fitness') || lowerName.includes('therapy')) {
                            return { href: `/fitness-therapy?from=${community.slug}`, testIdPrefix: 'fitness-therapy' };
                          }
                          
                          // Check for courtyard/patio amenities
                          if (lowerName.includes('courtyard') || lowerName.includes('patio') || 
                              lowerName.includes('garden') || lowerName.includes('outdoor')) {
                            return { href: `/courtyards-patios?from=${community.slug}`, testIdPrefix: 'courtyards-patios' };
                          }
                          
                          return null;
                        };

                        const amenityLink = getAmenityLink(amenityName);

                        return amenityLink ? (
                          <Link 
                            key={`amenity-${index}`}
                            href={amenityLink.href}
                            className="flex items-center justify-between bg-white rounded-lg p-4 hover:bg-primary/5 hover:shadow-md transition-all duration-200 cursor-pointer group"
                            data-testid={`amenity-link-${amenityLink.testIdPrefix}-${index}`}
                          >
                            <div className="flex items-center space-x-3">
                              <IconComponent className="w-8 h-8 text-primary flex-shrink-0" />
                              <span className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">{amenityName}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        ) : (
                          <div 
                            key={`amenity-${index}`}
                            className="flex items-center space-x-3 bg-white rounded-lg p-4"
                            data-testid={`amenity-${index}`}
                          >
                            <IconComponent className="w-8 h-8 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium">{amenityName}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  {(() => {
                    const amenitiesList = (community as any).amenities || 
                      community.amenities?.map(name => ({ name })) || [];
                    const hasMoreAmenities = amenitiesList.length > 5;
                    
                    return hasMoreAmenities && (
                      <div className="mt-6 text-center">
                        <Button
                          variant="outline"
                          onClick={() => setShowAllAmenities(!showAllAmenities)}
                          className="px-6"
                          data-testid="toggle-amenities-button"
                        >
                          {showAllAmenities ? 'Show Less' : `Show All ${amenitiesList.length} Amenities`}
                          <ChevronRight className={`ml-2 w-4 h-4 transition-transform ${showAllAmenities ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              </section>
            )}

          </div>

          {/* Sticky Sidebar - Only for Top Sections */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-6">
              {/* Pricing Card */}
              <Card className="shadow-lg border-2 border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardDescription>Monthly rentals start at</CardDescription>
                  <CardTitle className="text-2xl" data-testid="pricing-amount">
                    {formatPrice(community.startingPrice)}<span className="text-lg font-normal">/mo*</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <p className="text-sm text-gray-600">
                    *Pricing varies by care level and apartment type. Contact us for personalized pricing.
                  </p>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <Link href="/care-points" className="text-primary hover:underline">
                        Care Points Pricing
                      </Link>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Month-to-month rental</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>All utilities included</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Tour Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Schedule Your Visit</CardTitle>
                  <CardDescription>
                    Tour our community and meet our caring team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className={cn("w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white", getCommunityFurtherClass(community.slug || ''))} 
                    onClick={() => openScheduleTour({
                      communityId: community.id,
                      communityName: community.name,
                      title: `Schedule Your Visit to ${community.name}`,
                      description: `Tour our community in ${community.city} and meet our caring team.`
                    })}
                    data-testid="button-schedule-tour"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Your Tour
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" asChild data-testid="button-call-community">
                    <a href={`tel:${community.phoneDial || community.phoneDisplay || '+1-800-555-0123'}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {community.phoneDisplay || community.phone || '(800) 555-0123'}
                    </a>
                  </Button>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                      <div className="text-sm">
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">
                          {community.address}<br />
                          {community.city}, {community.state} {community.zipCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground mt-1" />
                      <div className="text-sm">
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">
                          {community.email || 'info@example.com'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground mt-1" />
                      <div className="text-sm">
                        <p className="font-medium">Office Hours</p>
                        <p className="text-muted-foreground">
                          Mon-Fri: 9:00 AM - 6:00 PM<br />
                          Sat-Sun: 10:00 AM - 5:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Brochure */}
              <Card className="shadow-lg bg-primary/5 border-primary/20 overflow-hidden">
                {(resolvedBrochureUrl || defaultBrochureImage) && (
                  <AspectRatio ratio={4 / 3}>
                    <img
                      src={resolvedBrochureUrl || defaultBrochureImage}
                      alt={`${community.name} Brochure`}
                      className="w-full h-full object-cover"
                      data-testid="brochure-image"
                    />
                  </AspectRatio>
                )}
                <CardContent className="p-6 text-center">
                  {!(resolvedBrochureUrl || defaultBrochureImage) && (
                    <Download className="w-10 h-10 text-primary mx-auto mb-4" />
                  )}
                  <h3 className="text-xl font-semibold mb-2">Community Brochure</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get detailed information about our community, floor plans, and services
                  </p>
                  {community.brochureLink ? (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      data-testid="button-download-brochure"
                      asChild
                    >
                      <a href={community.brochureLink} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        View PDF
                      </a>
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      data-testid="button-download-brochure"
                      disabled
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Brochure Not Available
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>


      {/* Full-width sections after amenities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-16">

        {/* Experience the Difference - Feature Sections */}
        <section id="features" className="scroll-mt-24 space-y-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Experience the Difference</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover a community where every detail is designed for your comfort, enjoyment, and well-being.
            </p>
          </div>

          <CommunityFeatures community={community} />
        </section>

            {/* Floor Plans Section */}
            {floorPlans.length > 0 && (
              <section id="floor-plans" className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Floor Plans & Pricing</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Each apartment home is designed for comfort and independence, with modern conveniences and thoughtful layouts.
                </p>
                <FloorPlansCarousel
                  plans={floorPlans}
                  onOpen={(plan) => {
                    setSelectedFloorPlan(plan);
                    setIsFloorPlanModalOpen(true);
                  }}
                />
                {floorPlans.length > 8 && (
                  <div className="text-center mt-8">
                    <Button variant="outline" size="lg" data-testid="button-view-all-floor-plans">
                      View All {floorPlans.length} Floor Plans
                    </Button>
                  </div>
                )}
              </section>
            )}

            {/* Experience Our Community Section */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-8">Experience Our Community</h2>
              {experienceImageUrl && (
                <div className="rounded-2xl overflow-hidden shadow-2xl mb-12">
                  <img
                    src={experienceImageUrl}
                    alt={`Experience ${community.name}`}
                    className="w-full h-[400px] object-cover"
                    data-testid="experience-image"
                  />
                </div>
              )}
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Discover what makes {community.name} special. From our welcoming atmosphere to our dedicated care team, 
                every aspect of our community is designed to help you live your best life. We invite you to experience 
                the warmth, comfort, and vibrant lifestyle that defines our community.
              </p>
            </section>

            {/* Photo Gallery */}
            {galleries.length > 0 && (
              <section id="gallery" className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Photo Gallery</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Explore our vibrant community life, comfortable living spaces, dedicated care team, and beautiful Colorado surroundings.
                </p>
                <GalleryOverview 
                  galleries={galleries}
                  onGallerySelect={(gallery) => {
                    setSelectedGallery(gallery as Gallery);
                    setIsGalleryModalOpen(true);
                  }}
                />
              </section>
            )}

            {/* Events & Activities - Full Width */}
            {events.length > 0 && (
              <section id="events" className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Upcoming Events</h2>
                <div className="space-y-6">
                  {events.slice(0, 4).map((event) => (
                    <div key={event.id} className="w-full">
                      <EventCard 
                        event={event} 
                        onViewDetails={() => setSelectedEvent(event)}
                      />
                    </div>
                  ))}
                </div>
                {events.length > 4 && (
                  <div className="text-center mt-8">
                    <Button variant="outline" size="lg" asChild data-testid="button-view-all-events">
                      <Link href="/events">
                        View All Events
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                )}
              </section>
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <section id="testimonials" className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">What Residents & Families Say</h2>
                <TestimonialsCarousel testimonials={testimonials} />
              </section>
            )}

            {/* Latest News - Blog Posts */}
            {blogPosts.length > 0 && (
              <section id="news" className="py-8 scroll-mt-24">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Latest News & Activities</h2>
                    <p className="text-lg text-gray-600">
                      Discover what's happening in our vibrant {community.name} community
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {blogPosts.length} Stories
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPosts.slice(0, 3).map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
                {blogPosts.length > 3 && (
                  <div className="text-center mt-10">
                    <Button
                      variant="outline"
                      size="lg"
                      className="group border-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
                      asChild
                      data-testid="button-view-all-posts"
                    >
                      <Link href={`/blog?community=${community.id}`}>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explore All {blogPosts.length} Stories
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                )}
              </section>
            )}

            {/* Resources Section - Regular Posts */}
            {posts.length > 0 && (
              <section className="py-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Helpful Resources</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Educational articles about senior living, health tips, and care guidance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.slice(0, 3).map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow" data-testid={`resource-${post.id}`}>
                      {post.heroImageUrl && (
                        <div className="h-40 overflow-hidden bg-gray-100">
                          <img
                            src={post.heroImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString()}</span>
                          {post.tags && post.tags[0] && (
                            <Badge variant="outline" className="text-xs ml-auto">
                              {post.tags[0]}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2" data-testid={`resource-title-${post.id}`}>
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3" data-testid={`resource-summary-${post.id}`}>
                          {post.summary || post.content.substring(0, 100) + '...'}
                        </p>
                        <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80" size="sm" asChild>
                          <Link href={`/resources/${post.slug}`}>
                            Learn More →
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <section id="faqs" className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.slice(0, 6).map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-6 bg-gray-50" data-testid={`faq-${faq.id}`}>
                      <AccordionTrigger className="text-left hover:no-underline py-4 text-lg" data-testid={`faq-question-${faq.id}`}>
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-gray-600" data-testid={`faq-answer-${faq.id}`}>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                {faqs.length > 6 && (
                  <div className="text-center mt-8">
                    <Button variant="outline" size="lg" asChild data-testid="button-view-all-faqs">
                      <Link href="/faqs">
                        View All FAQs
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                )}
              </section>
            )}

            {/* Location & Neighborhood */}
            <section id="neighborhood" className="scroll-mt-24">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">Location & Neighborhood</h2>
              <Card className="mb-6 overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-96" data-testid="community-map">
                    {community.latitude && community.longitude ? (
                      <CommunityMap 
                        communities={[community]}
                        selectedCommunityId={community.id}
                      />
                    ) : (
                      <div className="bg-gray-100 rounded-xl h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 mx-auto mb-4" />
                          <p className="text-lg font-medium">{community.address}</p>
                          <p>{community.city}, {community.state} {community.zipCode}</p>
                          <p className="text-sm mt-2">Map coordinates not available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Nearby Healthcare</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• St. Joseph Hospital - 5 miles</li>
                      <li>• Kaiser Permanente - 3 miles</li>
                      <li>• CVS Pharmacy - 0.5 miles</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Local Amenities</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• King Soopers - 1 mile</li>
                      <li>• Parks & Recreation - 2 miles</li>
                      <li>• Shopping Centers - 3 miles</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Action Panel - Contact, Pricing, and Resources */}
            <ActionPanel community={community} handleNavClick={handleNavClick} />

            {/* Enhanced Bottom CTA */}
            <EnhancedBottomCTA community={community} />
          </div>

      {/* Floor Plan Modal */}
      {selectedFloorPlan && (
        <FloorPlanModal
          floorPlan={selectedFloorPlan}
          communityName={community?.name || ''}
          isOpen={isFloorPlanModalOpen}
          onOpenChange={(open) => {
            setIsFloorPlanModalOpen(open);
            if (!open) {
              setSelectedFloorPlan(null);
            }
          }}
        />
      )}

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => {
          setIsGalleryModalOpen(false);
          setSelectedGallery(null);
        }}
        gallery={selectedGallery}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}