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
  Trees
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import ScrollToTop from "@/components/ScrollToTop";
import stageSeniorLogo from "@assets/stagesenior-logo_1758726889154.webp";
import type { 
  Community, 
  Event, 
  Faq, 
  Gallery, 
  FloorPlan, 
  Testimonial, 
  GalleryImageWithDetails, 
  Post, 
  BlogPost 
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

// Local subcomponent: Floor Plans Grid
const FloorPlansGrid = ({ plans, onOpen }: { plans: any[], onOpen: (plan: any) => void }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group" 
          onClick={() => onOpen(plan)}
          data-testid={`floor-plan-${plan.id}`}
        >
          {plan.imageUrl && (
            <AspectRatio ratio={4/3}>
              <img
                src={plan.imageUrl}
                alt={`${plan.name} floor plan`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                data-testid={`floor-plan-image-${plan.id}`}
              />
            </AspectRatio>
          )}
          <CardContent className="p-5">
            <h4 className="font-semibold text-lg mb-2" data-testid={`floor-plan-name-${plan.id}`}>
              {plan.name}
            </h4>
            {plan.startingPrice && (
              <p className="text-2xl font-bold text-primary mb-3" data-testid={`floor-plan-price-${plan.id}`}>
                {formatPrice(plan.startingPrice)}<span className="text-sm font-normal">/mo</span>
              </p>
            )}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
              {plan.bedrooms !== null && (
                <span className="flex items-center gap-1" data-testid={`floor-plan-bedrooms-${plan.id}`}>
                  <Bed className="w-4 h-4" />
                  {plan.bedrooms} {plan.bedrooms === 1 ? 'Bed' : 'Beds'}
                </span>
              )}
              {plan.bathrooms !== null && (
                <span className="flex items-center gap-1" data-testid={`floor-plan-bathrooms-${plan.id}`}>
                  <Bath className="w-4 h-4" />
                  {Number(plan.bathrooms)} {Number(plan.bathrooms) === 1 ? 'Bath' : 'Baths'}
                </span>
              )}
              {plan.squareFeet && (
                <span className="flex items-center gap-1" data-testid={`floor-plan-sqft-${plan.id}`}>
                  <Square className="w-4 h-4" />
                  {plan.squareFeet} sq ft
                </span>
              )}
            </div>
            <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium">View Details</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Local subcomponent: Gallery Overview
const GalleryOverview = ({ galleries, onGallerySelect }: { galleries: any[], onGallerySelect: (gallery: any) => void }) => {
  // Map our gallery categories to icons
  const categoryConfig = {
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
                      {previewImages.map((image, idx) => (
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
                  <h3 className="font-bold text-lg text-gray-900 mb-1.5 group-hover:text-primary transition-colors" data-testid={`gallery-title-${gallery.id}`}>
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
                    <h3 className="font-semibold text-sm mb-0.5">{gallery.title}</h3>
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
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id}>
              <div className="px-8 py-12 text-center">
                <blockquote className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight" data-testid={`testimonial-quote-${testimonial.id}`}>
                  "{testimonial.content}"
                </blockquote>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-gray-800" data-testid={`testimonial-author-${testimonial.id}`}>
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className={`${imageLeft ? 'md:order-2' : ''}`}>
        {eyebrow && (
          <Badge className="mb-4 bg-primary/10 text-primary border-0">
            {eyebrow}
          </Badge>
        )}
        <h3 className="text-3xl font-bold mb-4">{title}</h3>
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
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover rounded-2xl shadow-xl"
          />
        </AspectRatio>
      </div>
    </div>
  );
};

// Local subcomponent: Action Panel
const ActionPanel = ({ community }: { community: any }) => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pricing Card */}
          <Card className="shadow-lg border-2 border-primary/20 overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000"
                alt="Comfortable senior living apartment"
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl">Monthly Pricing</CardTitle>
              <CardDescription className="text-3xl font-bold text-primary mt-2" data-testid="pricing-amount">
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
                  <span>No buy-in fees</span>
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
              <Button className="w-full" variant="outline" data-testid="button-view-pricing">
                View Floor Plan Pricing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2000"
                alt="Friendly staff ready to help"
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
              <CardDescription>Get in touch with our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <a href={`tel:${community.phone || '+1-303-436-2300'}`} className="text-primary hover:underline">
                      {community.phone || "(303) 436-2300"}
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
          <Card className="shadow-lg bg-primary/5 border-primary/20 overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1554224155-67261b3ff858f?q=80&w=2000"
                alt="Community brochure preview"
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Community Brochure</CardTitle>
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
              <Button className="w-full" data-testid="button-download-brochure">
                <Download className="w-4 h-4 mr-2" />
                Download PDF Brochure
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Local subcomponent: Enhanced Bottom CTA
const EnhancedBottomCTA = ({ community }: { community: any }) => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={community.heroImageUrl || 'https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?q=80&w=2000'}
          alt="Community background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
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

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Ready to Experience {community.name}?
        </h2>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
          Join our community of residents who are living their best life. Schedule a personalized tour today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 shadow-2xl bg-white text-primary hover:bg-gray-100"
            data-testid="button-schedule-tour-hero"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Your Tour Today
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg"
            asChild
            data-testid="button-call-hero"
          >
            <a href={`tel:${community.phone || '+1-303-436-2300'}`}>
              <Phone className="w-5 h-5 mr-2" />
              Call {community.phone || "(303) 436-2300"}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default function CommunityDetail() {
  const params = useParams();
  const slug = params.slug;
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(null);
  const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>("overview");
  const [showNav, setShowNav] = useState(false);

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

  // Hero logo overlay functionality
  const heroLogoSrc =
    (community as any)?.logoImageUrl ||
    (community as any)?.logoUrl ||
    stageSeniorLogo;

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

  return (
    <div className="min-h-screen bg-white" style={communityStyles}>
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img
          src={community.heroImageUrl || `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600`}
          alt={`${community.name} - Senior Living Community`}
          className="w-full h-full object-cover"
          data-testid="hero-image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        {/* Hero Logo Overlay */}
        {heroLogoSrc && (
          <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg px-4 py-3 md:px-6 md:py-4 border border-white/60">
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" data-testid="community-name">
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
                className="shadow-sm"
                style={{ 
                  backgroundColor: (community as any)?.ctaColorHex || '#f59e0b',
                  color: (community as any)?.ctaColorHex ? getAccessibleTextColor((community as any).ctaColorHex) : '#ffffff'
                }}
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

      {/* Main Content with Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6" data-testid="overview-title">
                Welcome to {community.name}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6" data-testid="community-description">
                {community.description || community.shortDescription || 
                  "Experience exceptional senior living in a warm, welcoming community designed with your comfort and well-being in mind. Our dedicated team provides personalized care and support, ensuring every resident enjoys a fulfilling lifestyle."}
              </p>
              <p className="text-gray-600 leading-relaxed">
                At {community.name}, we believe in fostering a fulfilling lifestyle for our residents. Living in our community makes it easy to nurture your mind, body, and spirit—whether it's over a meal or during a group activity. With daily opportunities for creativity, learning, fitness, and social connections, you'll discover ways to ignite your passions and uncover new possibilities.
              </p>
            </section>

            {/* Featured Testimonial */}
            {testimonials.length > 0 && (
              <div className="mb-12">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Star className="w-12 h-12 text-primary fill-primary/20" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg italic leading-relaxed mb-4">
                          "{testimonials[0].content}"
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-semibold text-lg">
                              {testimonials[0].authorName?.charAt(0) || 'R'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">{testimonials[0].authorName}</p>
                            <p className="text-sm text-gray-600">{testimonials[0].authorRelation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Features & Highlights */}
            <section id="highlights" className="scroll-mt-24">
              <h2 className="text-3xl font-bold mb-8">Community Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {community.slug === 'golden-pond' ? (
                  <>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
                          alt="Locally Owned & Rooted in Golden"
                          className="w-full h-full object-cover"
                          data-testid="highlight-locally-owned"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Locally Owned & Rooted in Golden</h3>
                        <p className="text-gray-600">
                          More than two decades of service, trusted by families through word of mouth.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?w=800&q=80"
                          alt="All Levels of Care in One Place"
                          className="w-full h-full object-cover"
                          data-testid="highlight-care-levels"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">All Levels of Care in One Place</h3>
                        <p className="text-gray-600">
                          Independent, Assisted, and Memory Care — seamless transitions without the stress of moving again.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80"
                          alt="Stable, Familiar Staff"
                          className="w-full h-full object-cover"
                          data-testid="highlight-staff"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Stable, Familiar Staff</h3>
                        <p className="text-gray-600">
                          Many caregivers and managers have been here for years, creating continuity and real relationships.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
                          alt="Active, Connected Lifestyle"
                          className="w-full h-full object-cover"
                          data-testid="highlight-lifestyle"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Active, Connected Lifestyle</h3>
                        <p className="text-gray-600">
                          Fitness, art, social events, and outings into Golden keep residents engaged and part of the community.
                        </p>
                      </CardContent>
                    </Card>
                  </>
                ) : community.slug === 'the-gardens-on-quail' ? (
                  <>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=800&q=80"
                          alt="Independent Plus Option"
                          className="w-full h-full object-cover"
                          data-testid="highlight-independent-plus"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Independent Plus Option</h3>
                        <p className="text-gray-600">
                          A unique choice for seniors who want independence with optional support.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?w=800&q=80"
                          alt="Seamless Care Transitions"
                          className="w-full h-full object-cover"
                          data-testid="highlight-seamless-care"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Seamless Care Transitions</h3>
                        <p className="text-gray-600">
                          Move easily between Independent, Assisted, and Memory Care.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80"
                          alt="Community Connections"
                          className="w-full h-full object-cover"
                          data-testid="highlight-community-connections"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Community Connections</h3>
                        <p className="text-gray-600">
                          Partnerships with Arvada schools, churches, and non-profits keep residents engaged.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80"
                          alt="Upscale, Modern Design"
                          className="w-full h-full object-cover"
                          data-testid="highlight-modern-design"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Upscale, Modern Design</h3>
                        <p className="text-gray-600">
                          Bistro, theater, library, and courtyards for comfortable daily living.
                        </p>
                      </CardContent>
                    </Card>
                  </>
                ) : community.slug === 'gardens-at-columbine' ? (
                  <>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80"
                          alt="Beautiful Gardens"
                          className="w-full h-full object-cover"
                          data-testid="highlight-gardens"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Beautiful Gardens</h3>
                        <p className="text-gray-600">
                          Over two acres of outdoor paths, art, and water features.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80"
                          alt="Strong Staff Tenure"
                          className="w-full h-full object-cover"
                          data-testid="highlight-staff-tenure"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Strong Staff Tenure</h3>
                        <p className="text-gray-600">
                          Many caregivers and directors have been here since the community opened.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
                          alt="Dedicated Memory Care Wing"
                          className="w-full h-full object-cover"
                          data-testid="highlight-memory-care"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Dedicated Memory Care Wing</h3>
                        <p className="text-gray-600">
                          Secure, bright, and purpose-built for dementia care.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=800&q=80"
                          alt="Home-Like Feel"
                          className="w-full h-full object-cover"
                          data-testid="highlight-home-like"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Home-Like Feel</h3>
                        <p className="text-gray-600">
                          A warm, personal environment rather than a corporate setting.
                        </p>
                      </CardContent>
                    </Card>
                  </>
                ) : community.slug === 'stonebridge-senior' ? (
                  <>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?w=800&q=80"
                          alt="Personalized Care Plans"
                          className="w-full h-full object-cover"
                          data-testid="highlight-personalized-plans"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Personalized Care Plans</h3>
                        <p className="text-gray-600">
                          Developed with residents and families, updated regularly.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1559234938-b60fff04894d?w=800&q=80"
                          alt="Your Story First Philosophy"
                          className="w-full h-full object-cover"
                          data-testid="highlight-story-first"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Your Story First Philosophy</h3>
                        <p className="text-gray-600">
                          Staff learn each resident's life story to guide daily care.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=800&q=80"
                          alt="Cozy, Intimate Setting"
                          className="w-full h-full object-cover"
                          data-testid="highlight-intimate"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Cozy, Intimate Setting</h3>
                        <p className="text-gray-600">
                          Smaller community feel with modern amenities.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=800&q=80"
                          alt="Pet-Friendly"
                          className="w-full h-full object-cover"
                          data-testid="highlight-pet-friendly"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Pet-Friendly</h3>
                        <p className="text-gray-600">
                          Residents are welcome to bring pets; pet therapy is also offered.
                        </p>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80"
                          alt="Vibrant Community Life"
                          className="w-full h-full object-cover"
                          data-testid="highlight-community-life"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Vibrant Community Life</h3>
                        <p className="text-gray-600">
                          Join a warm community where friendships flourish and every day brings new opportunities for connection and growth.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?w=800&q=80"
                          alt="Personalized Care"
                          className="w-full h-full object-cover"
                          data-testid="highlight-personalized-care"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Personalized Care</h3>
                        <p className="text-gray-600">
                          Our dedicated team provides tailored support that honors your independence while ensuring comfort and safety.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
                          alt="Active Lifestyle"
                          className="w-full h-full object-cover"
                          data-testid="highlight-active-lifestyle"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">Active Lifestyle</h3>
                        <p className="text-gray-600">
                          From fitness classes to cultural outings, enjoy a full calendar of activities designed to keep you engaged.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://images.unsplash.com/photo-1559304787-b655434341065?w=800&q=80"
                          alt="24/7 Support"
                          className="w-full h-full object-cover"
                          data-testid="highlight-24-7-support"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-primary">24/7 Support</h3>
                        <p className="text-gray-600">
                          Rest easy knowing our caring staff is available around the clock for assistance whenever you need it.
                        </p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </section>

            {/* Amenities Showcase */}
            {community.amenities && community.amenities.length > 0 && (
              <section id="amenities" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-8">Amenities & Services</h2>
                <div className="bg-gray-50 rounded-2xl p-8">
                  <p className="text-lg text-gray-600 mb-8">
                    Step into a lifestyle where every day feels like a retreat. Our community is packed with thoughtful amenities designed to make life easier and more enjoyable.
                  </p>
                  {/* Show featured amenities with images first if available */}
                  {(community as any).amenities && 
                   (community as any).amenities.filter((am: any) => am.imageUrl).length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Featured Amenities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(community as any).amenities
                          .filter((am: any) => am.imageUrl)
                          .map((amenity: any, index: number) => {
                            const IconComponent = amenity.icon ? 
                              (amenity.icon === 'Utensils' ? Coffee : 
                               amenity.icon === 'Coffee' ? Coffee :
                               amenity.icon === 'Car' ? Car :
                               amenity.icon === 'Activity' ? Activity :
                               amenity.icon === 'BookOpen' ? BookOpen :
                               amenity.icon === 'Heart' ? Heart :
                               amenity.icon === 'Users' ? Users :
                               amenity.icon === 'Wifi' ? Wifi :
                               Sparkles) : 
                              getAmenityIcon(amenity.name);
                            return (
                              <Card 
                                key={`featured-${index}`}
                                className="overflow-hidden hover:shadow-lg transition-shadow"
                                data-testid={`featured-amenity-${index}`}
                              >
                                <div className="h-48 overflow-hidden">
                                  <img 
                                    src={amenity.imageUrl} 
                                    alt={amenity.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <CardContent className="p-4">
                                  <div className="flex items-start space-x-3">
                                    <IconComponent className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                      <h4 className="font-semibold text-base">{amenity.name}</h4>
                                      {amenity.description && (
                                        <p className="text-sm text-gray-600 mt-1">{amenity.description}</p>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Show all amenities in compact grid */}
                  <h3 className="text-xl font-semibold mb-4">
                    {(community as any).amenities && 
                     (community as any).amenities.filter((am: any) => am.imageUrl).length > 0 
                      ? "All Amenities" 
                      : ""}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {((community as any).amenities || 
                      community.amenities?.map(name => ({ name })) || []
                    ).map((amenity: any, index: number) => {
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

                      return (
                        <div 
                          key={`amenity-${index}`}
                          className="flex items-center space-x-3 bg-white rounded-lg p-4"
                          data-testid={`amenity-${index}`}
                        >
                          <IconComponent className="w-8 h-8 text-primary flex-shrink-0" />
                          <span className="text-sm font-medium">{amenityName}</span>
                        </div>
                      );
                    })}
                  </div>
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
                  <CardTitle className="text-3xl" data-testid="pricing-amount">
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
                      <span>No buy-in fees</span>
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
                <CardContent className="space-y-4">
                  <Input 
                    placeholder="Your Name" 
                    data-testid="input-tour-name"
                  />
                  <Input 
                    placeholder="Phone Number" 
                    type="tel"
                    data-testid="input-tour-phone"
                  />
                  <Input 
                    placeholder="Email Address" 
                    type="email"
                    data-testid="input-tour-email"
                  />
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white" 
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
              <Card className="shadow-lg bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <Download className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Community Brochure</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get detailed information about our community, floor plans, and services
                  </p>
                  <Button variant="outline" className="w-full" data-testid="button-download-brochure">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
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
            <h2 className="text-4xl font-bold mb-4">Experience the Difference</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover a community where every detail is designed for your comfort, enjoyment, and well-being.
            </p>
          </div>

          <FeatureSection
            eyebrow="Fine Dining"
            title="Extraordinary Dining Experience"
            body="There's no need to worry about cooking. You can dine on nutritious, homestyle cuisine in our beautiful dining room—complete with great conversation. Our professional chefs prepare fresh, locally-sourced meals daily, with menus designed by nutritionists to meet your dietary needs."
            imageUrl="https://images.unsplash.com/photo-1577308856961-1d3371de3c2b?q=80&w=800&auto=format&fit=crop"
            imageAlt="Extraordinary dining experience featuring seniors enjoying nutritious, homestyle cuisine in a beautiful dining room"
            cta={{ label: "View Sample Menu", href: "#menu" }}
            imageLeft={false}
          />

          <FeatureSection
            eyebrow="Active Living"
            title="Engaging Lifestyle Programs"
            body="From staying active to getting creative to learning new skills, we offer a diverse variety of ways for you to pursue your hobbies and interests. Our activities director creates a monthly calendar filled with fitness classes, art workshops, educational seminars, and social events tailored to your preferences."
            imageUrl="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop"
            imageAlt="Engaging lifestyle activities featuring seniors staying active, getting creative, and learning new skills"
            cta={{ label: "View Engagement Calendar", href: `/events?community=${community.slug || community.id}` }}
            imageLeft={true}
          />

          <FeatureSection
            eyebrow="Prime Location"
            title="Ideal Location & Neighborhood"
            body="You can easily enjoy the area with nearby attractions, dining options, and recreational activities perfectly suited for an active lifestyle. Our community is conveniently located near medical facilities, shopping centers, parks, and cultural destinations, keeping you connected to everything you love."
            imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop"
            imageAlt="Seniors enjoying ideal location lifestyle with access to golf courses, local eateries, and parks"
            cta={{ label: "Get Directions", href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(community.address || `${community.city}, ${community.state} ${community.zipCode}`)}` }}
            imageLeft={false}
          />

          <FeatureSection
            eyebrow="Personalized Care"
            title="24/7 Professional Care Team"
            body="Rest assured knowing our dedicated team of licensed nurses and certified caregivers is available around the clock. We provide personalized care plans tailored to your unique needs, from medication management to assistance with daily activities, all while preserving your independence and dignity."
            imageUrl="https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?q=80&w=800&auto=format&fit=crop"
            imageAlt="Professional care team assisting seniors with compassion and expertise"
            imageLeft={true}
          />
        </section>

            {/* Floor Plans Section */}
            {floorPlans.length > 0 && (
              <section id="floor-plans" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-8">Floor Plans & Pricing</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Each apartment home is designed for comfort and independence, with modern conveniences and thoughtful layouts.
                </p>
                <FloorPlansGrid 
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

            {/* Featured Image Section */}
            {community.heroImageUrl && (
              <section>
                <h2 className="text-3xl font-bold mb-8">Experience Our Community</h2>
                <div className="rounded-2xl overflow-hidden shadow-2xl mb-12">
                  <img
                    src={community.heroImageUrl}
                    alt={`${community.name} - Featured Image`}
                    className="w-full h-[400px] object-cover"
                    data-testid="featured-image"
                  />
                </div>
              </section>
            )}

            {/* Photo Gallery */}
            {galleries.length > 0 && (
              <section id="gallery" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-8">Photo Gallery</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Explore our vibrant community life, comfortable living spaces, dedicated care team, and beautiful Colorado surroundings.
                </p>
                <GalleryOverview 
                  galleries={galleries}
                  onGallerySelect={(gallery) => {
                    setSelectedGallery(gallery);
                    setIsGalleryModalOpen(true);
                  }}
                />
              </section>
            )}

            {/* Events & Activities - Full Width */}
            {events.length > 0 && (
              <section id="events" className="scroll-mt-24">
                <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
                <div className="space-y-6">
                  {events.slice(0, 4).map((event) => (
                    <div key={event.id} className="w-full">
                      <EventCard event={event} />
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
                <h2 className="text-3xl font-bold mb-8">What Residents & Families Say</h2>
                <TestimonialsCarousel testimonials={testimonials} />
              </section>
            )}

            {/* Latest News - Blog Posts */}
            {blogPosts.length > 0 && (
              <section id="news" className="py-8 scroll-mt-24">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Latest News & Activities</h2>
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
                    <Card key={post.id} className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden bg-white" data-testid={`blog-post-${post.id}`}>
                      <div className="relative">
                        {(post.mainImage || post.thumbnailImage) ? (
                          <div className="h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                            <img
                              src={post.thumbnailImage || post.mainImage || ''}
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
                <h2 className="text-3xl font-bold mb-8">Helpful Resources</h2>
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
                        <h3 className="font-semibold mb-2 line-clamp-2" data-testid={`resource-title-${post.id}`}>
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3" data-testid={`resource-summary-${post.id}`}>
                          {post.summary || post.content.substring(0, 100) + '...'}
                        </p>
                        <Button variant="link" className="p-0 h-auto text-sm text-primary hover:text-primary/80" asChild>
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
                <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
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
              <h2 className="text-3xl font-bold mb-8">Location & Neighborhood</h2>
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
                    <h3 className="font-semibold mb-3">Nearby Healthcare</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• St. Joseph Hospital - 5 miles</li>
                      <li>• Kaiser Permanente - 3 miles</li>
                      <li>• CVS Pharmacy - 0.5 miles</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Local Amenities</h3>
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
            <ActionPanel community={community} />

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

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}