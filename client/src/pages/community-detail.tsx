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
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import ScrollToTop from "@/components/ScrollToTop";
import stageSeniorLogo from "@assets/stagesenior-logo_1758726889154.webp";
import type { Community, Event, Faq, Gallery, FloorPlan, Testimonial, GalleryImage, Post, BlogPost } from "@shared/schema";

export default function CommunityDetail() {
  const params = useParams();
  const slug = params.slug;
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(null);
  const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>("overview");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!slug || window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

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

  const { data: galleryImages = [] } = useQuery<GalleryImage[]>({
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
  const hasGallery = galleryImages.length > 0;
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

  // Helper functions
  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for pricing";
    return `$${price.toLocaleString()}`;
  };

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

    const headerElement = document.querySelector<HTMLElement>('[data-testid="header"]');
    const navElement = document.querySelector<HTMLElement>('[data-community-sticky-nav]');
    const offset = (headerElement?.offsetHeight ?? 0) + (navElement?.offsetHeight ?? 0) + 16;

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
    const mainColor = (community as any).mainColorHex || '#2563eb';
    const ctaColor = (community as any).ctaColorHex || '#f59e0b';
    
    return {
      '--community-main': mainColor,
      '--community-cta': ctaColor,
      '--community-main-text': getAccessibleTextColor(mainColor),
      '--community-cta-text': getAccessibleTextColor(ctaColor),
    } as React.CSSProperties;
  }, [(community as any)?.mainColorHex, (community as any)?.ctaColorHex]);

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
        
        {/* Back Button */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 lg:p-8 z-20">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20" 
            asChild
            data-testid="button-back"
          >
            <Link href="/communities">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Communities
            </Link>
          </Button>
        </div>
        
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

      {navSections.length > 0 && (
        <div
          className="sticky top-16 z-40 bg-white/98 backdrop-blur-md border-b border-border shadow-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
          data-community-sticky-nav
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-2 overflow-x-auto py-3" aria-label="Community sections">
              {navSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleNavClick(section.id)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-transparent text-muted-foreground border-border hover:bg-primary/10"
                  )}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content with Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-32">
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

            {/* Features & Highlights */}
            <section id="highlights" className="scroll-mt-32">
              <h2 className="text-3xl font-bold mb-8">Community Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <Users className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Vibrant Community Life</h3>
                    <p className="text-gray-600">
                      Join a warm community where friendships flourish and every day brings new opportunities for connection and growth.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <Heart className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Personalized Care</h3>
                    <p className="text-gray-600">
                      Our dedicated team provides tailored support that honors your independence while ensuring comfort and safety.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <Activity className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Active Lifestyle</h3>
                    <p className="text-gray-600">
                      From fitness classes to cultural outings, enjoy a full calendar of activities designed to keep you engaged.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <Shield className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                    <p className="text-gray-600">
                      Rest easy knowing our caring staff is available around the clock for assistance whenever you need it.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Amenities Showcase */}
            {community.amenities && community.amenities.length > 0 && (
              <section id="amenities" className="scroll-mt-32">
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

            {/* Features Highlights Section */}
            <section>
              <h2 className="text-3xl font-bold mb-8">Experience the Difference</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Extraordinary Dining */}
                <Card className="overflow-hidden hover:shadow-xl transition-shadow group" data-testid="feature-extraordinary-dining">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1577308856961-1d3371de3c2b?q=80&w=800&auto=format&fit=crop"
                      alt="Extraordinary dining experience featuring seniors enjoying nutritious, homestyle cuisine in a beautiful dining room"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      data-testid="feature-dining-image"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3" data-testid="feature-dining-title">
                      Extraordinary Dining
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed" data-testid="feature-dining-description">
                      There's no need to worry about cooking. You can dine on nutritious, homestyle cuisine in our beautiful dining room—complete with great conversation.
                    </p>
                    <Button variant="outline" className="w-full" data-testid="button-sample-menu">
                      Sample Menu
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Engaging Lifestyle */}
                <Card className="overflow-hidden hover:shadow-xl transition-shadow group" data-testid="feature-engaging-lifestyle">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop"
                      alt="Engaging lifestyle activities featuring seniors staying active, getting creative, and learning new skills"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      data-testid="feature-lifestyle-image"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3" data-testid="feature-lifestyle-title">
                      Engaging Lifestyle
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed" data-testid="feature-lifestyle-description">
                      From staying active to getting creative to learning new skills, we offer a diverse variety of ways for you to pursue your hobbies and interests.
                    </p>
                    <Button variant="outline" className="w-full" asChild data-testid="button-engagement-calendar">
                      <Link href={`/events?community=${community.slug || community.id}`}>
                        Engagement Calendar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Ideal Location */}
                <Card className="overflow-hidden hover:shadow-xl transition-shadow group" data-testid="feature-ideal-location">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop"
                      alt="Seniors enjoying ideal location lifestyle with access to golf courses, local eateries, and parks"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      data-testid="feature-location-image"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3" data-testid="feature-location-title">
                      Ideal Location
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed" data-testid="feature-location-description">
                      You can easily enjoy the area with nearby attractions, dining options, and recreational activities perfectly suited for an active lifestyle.
                    </p>
                    <Button variant="outline" className="w-full" asChild data-testid="button-map-directions">
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          community.address || `${community.city}, ${community.state} ${community.zipCode}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Map and Directions
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Floor Plans Section */}
            {floorPlans.length > 0 && (
              <section id="floor-plans" className="scroll-mt-32">
                <h2 className="text-3xl font-bold mb-8">Floor Plans & Pricing</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Each apartment home is designed for comfort and independence, with modern conveniences and thoughtful layouts.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {floorPlans.slice(0, 4).map((floorPlan) => (
                    <Card 
                      key={floorPlan.id} 
                      className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group" 
                      onClick={() => {
                        setSelectedFloorPlan(floorPlan);
                        setIsFloorPlanModalOpen(true);
                      }}
                      data-testid={`floor-plan-${floorPlan.id}`}
                    >
                      {floorPlan.imageUrl && (
                        <div className="relative h-48 bg-gray-100">
                          <img
                            src={floorPlan.imageUrl}
                            alt={`${floorPlan.name} floor plan`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            data-testid={`floor-plan-image-${floorPlan.id}`}
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h4 className="text-xl font-semibold mb-2" data-testid={`floor-plan-name-${floorPlan.id}`}>
                          {floorPlan.name}
                        </h4>
                        {floorPlan.startingPrice && (
                          <p className="text-2xl font-bold text-primary mb-4" data-testid={`floor-plan-price-${floorPlan.id}`}>
                            {formatPrice(floorPlan.startingPrice)}<span className="text-base font-normal">/mo</span>
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          {floorPlan.bedrooms !== null && (
                            <span className="flex items-center gap-1" data-testid={`floor-plan-bedrooms-${floorPlan.id}`}>
                              <Bed className="w-4 h-4" />
                              {floorPlan.bedrooms} {floorPlan.bedrooms === 1 ? 'Bed' : 'Beds'}
                            </span>
                          )}
                          {floorPlan.bathrooms !== null && (
                            <span className="flex items-center gap-1" data-testid={`floor-plan-bathrooms-${floorPlan.id}`}>
                              <Bath className="w-4 h-4" />
                              {Number(floorPlan.bathrooms)} {Number(floorPlan.bathrooms) === 1 ? 'Bath' : 'Baths'}
                            </span>
                          )}
                          {floorPlan.squareFeet && (
                            <span className="flex items-center gap-1" data-testid={`floor-plan-sqft-${floorPlan.id}`}>
                              <Square className="w-4 h-4" />
                              {floorPlan.squareFeet} sq ft
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-primary group-hover:translate-x-2 transition-transform">
                          <span className="text-sm font-medium">View Details</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {floorPlans.length > 4 && (
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
            {galleryImages.length > 0 && (
              <section id="gallery" className="scroll-mt-32">
                <h2 className="text-3xl font-bold mb-8">Photo Gallery</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Explore our bright, comfortable spaces and serene outdoor areas through our community gallery.
                </p>

                {/* Category Filters */}
                {galleryCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    <Button
                      variant={selectedGalleryCategory === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedGalleryCategory(null)}
                      data-testid="gallery-filter-all"
                    >
                      All Photos
                    </Button>
                    {galleryCategories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedGalleryCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedGalleryCategory(category)}
                        data-testid={`gallery-filter-${category}`}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages
                    .filter(img => !selectedGalleryCategory || img.category === selectedGalleryCategory)
                    .slice(0, 9)
                    .map((image) => (
                      <div 
                        key={image.id} 
                        className="group cursor-pointer aspect-video rounded-lg overflow-hidden"
                        data-testid={`gallery-image-${image.id}`}
                      >
                        <img
                          src={image.url}
                          alt={image.caption || `${community.name} gallery`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Events & Activities - Full Width */}
            {events.length > 0 && (
              <section id="events" className="scroll-mt-32">
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
              <section id="testimonials" className="scroll-mt-32">
                <h2 className="text-3xl font-bold mb-8">What Residents & Families Say</h2>
                <div className="space-y-6">
                  {testimonials.slice(0, 3).map((testimonial) => (
                    <Card key={testimonial.id} className="border-l-4 border-l-primary" data-testid={`testimonial-${testimonial.id}`}>
                      <CardContent className="p-8">
                        <blockquote className="text-lg text-gray-700 italic mb-6" data-testid={`testimonial-content-${testimonial.id}`}>
                          "{testimonial.content}"
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900" data-testid={`testimonial-author-${testimonial.id}`}>
                              {testimonial.authorName}
                            </p>
                            {testimonial.authorRelation && (
                              <p className="text-sm text-gray-600" data-testid={`testimonial-relation-${testimonial.id}`}>
                                {testimonial.authorRelation}
                              </p>
                            )}
                          </div>
                          {testimonial.rating && (
                            <div className="flex items-center gap-1" data-testid={`testimonial-rating-${testimonial.id}`}>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-5 h-5 ${i < (testimonial.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Latest News - Blog Posts */}
            {blogPosts.length > 0 && (
              <section id="news" className="py-8 scroll-mt-32">
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
                  {blogPosts.slice(0, 6).map((post) => (
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
                {blogPosts.length > 6 && (
                  <div className="text-center mt-10">
                    <Button
                      variant="outline"
                      size="lg"
                      className="group border-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
                      asChild
                      data-testid="button-view-all-posts"
                    >
                      <Link href="/blog">
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
              <section id="faqs" className="scroll-mt-32">
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
            <section id="neighborhood" className="scroll-mt-32">
              <h2 className="text-3xl font-bold mb-8">Location & Neighborhood</h2>
              <div className="bg-gray-100 rounded-xl h-96 mb-6" data-testid="map-placeholder">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">{community.address}</p>
                    <p>{community.city}, {community.state} {community.zipCode}</p>
                  </div>
                </div>
              </div>
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
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32 space-y-6">
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
                    className="w-full shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-105" 
                    size="lg"
                    style={{
                      backgroundColor: 'var(--community-cta)',
                      color: 'var(--community-cta-text)',
                      borderColor: 'var(--community-cta)',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                    data-testid="button-schedule-tour"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Tour
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    asChild
                    data-testid="button-call"
                  >
                    <a href={`tel:${community.phone || '+1-303-436-2300'}`}>
                      <Phone className="w-4 h-4 mr-3" />
                      {community.phone || "(303) 436-2300"}
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    asChild
                    data-testid="button-email"
                  >
                    <a href={`mailto:${community.email || 'info@stagesenior.com'}`}>
                      <Mail className="w-4 h-4 mr-3" />
                      Email Us
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

      {/* White Card CTA Section */}
      <div className="py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-0 bg-white">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Ready to Experience {community.name}?
              </h2>
              <p className="text-xl mb-8 text-gray-600">
                Join our community of residents who are living their best life. Schedule a personalized tour today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-lg shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-3xl"
                  style={{
                    backgroundColor: 'var(--community-cta)',
                    color: 'var(--community-cta-text)',
                    borderColor: 'var(--community-cta)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                  data-testid="button-schedule-tour-cta"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Your Tour
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl border-gray-300 hover:bg-gray-50"
                  data-testid="button-call-cta"
                  asChild
                >
                  <a href={`tel:${community.phone || '+1-303-436-2300'}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    Call {community.phone || "(303) 436-2300"}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}