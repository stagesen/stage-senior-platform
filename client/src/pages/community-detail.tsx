import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "@/components/EventCard";
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
  BookOpen
} from "lucide-react";
import { Link } from "wouter";
import type { Community, Event, Faq, Gallery, FloorPlan, Testimonial, GalleryImage } from "@shared/schema";

export default function CommunityDetail() {
  const params = useParams();
  const slug = params.slug;

  const { data: community, isLoading: communityLoading } = useQuery<Community>({
    queryKey: [`/api/communities/${slug}`],
    enabled: !!slug,
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: [`/api/events?communityId=${community?.id}&upcoming=true`],
    enabled: !!community?.id,
  });

  const { data: faqs = [] } = useQuery<Faq[]>({
    queryKey: [`/api/faqs?communityId=${community?.id}&active=true`],
    enabled: !!community?.id,
  });

  const { data: galleries = [] } = useQuery<Gallery[]>({
    queryKey: [`/api/galleries?communityId=${community?.id}&active=true`],
    enabled: !!community?.id,
  });

  const { data: floorPlans = [] } = useQuery<FloorPlan[]>({
    queryKey: [`/api/floor-plans?communityId=${community?.id}&active=true`],
    enabled: !!community?.id,
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: [`/api/testimonials?communityId=${community?.id}&approved=true`],
    enabled: !!community?.id,
  });

  const { data: galleryImages = [] } = useQuery<GalleryImage[]>({
    queryKey: [`/api/gallery-images?communityId=${community?.id}&active=true`],
    enabled: !!community?.id,
  });

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

  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for pricing";
    return `$${price.toLocaleString()}`;
  };

  // Get amenity icons
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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src={community.heroImageUrl || `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600`}
          alt={`${community.name} - Senior Living Community`}
          className="w-full h-full object-cover"
          data-testid="hero-image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between">
          {/* Top Navigation */}
          <div className="p-6">
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
          
          {/* Bottom Content */}
          <div className="p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 items-end">
                {/* Left Side - Community Info */}
                <div className="text-white">
                  <h1 className="text-4xl lg:text-5xl font-bold mb-3" data-testid="community-name">
                    {community.name}
                  </h1>
                  <div className="flex items-center text-lg mb-4 opacity-90" data-testid="community-location">
                    <MapPin className="w-5 h-5 mr-2" />
                    {community.address || `${community.city}, ${community.state} ${community.zipCode}`}
                  </div>
                  {community.careTypes && community.careTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {community.careTypes.map((careType) => (
                        <Badge 
                          key={careType} 
                          className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
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
                
                {/* Right Side - Pricing Card */}
                <div className="bg-white rounded-lg p-6 shadow-xl">
                  <div className="text-sm text-gray-600 mb-2">Monthly rentals start at</div>
                  <div className="text-4xl font-bold text-gray-900 mb-1" data-testid="pricing-amount">
                    {formatPrice(community.startingPrice)}<span className="text-lg font-normal">/month*</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    {community.shortDescription || "Experience exceptional senior living in our welcoming community."}
                  </p>
                  <div className="space-y-3">
                    <Button 
                      size="lg" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      data-testid="button-schedule-tour-hero"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Reserve Your Tour
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full"
                      asChild
                      data-testid="button-call-hero"
                    >
                      <a href={`tel:${community.phone || '+1-303-555-0123'}`}>
                        <Phone className="w-5 h-5 mr-2" />
                        {community.phone || "(303) 555-0123"}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <main className="relative -mt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-t-xl shadow-lg">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full h-auto p-0 bg-transparent rounded-none border-b" data-testid="tabs-list">
                <div className="flex flex-wrap justify-center">
                  <TabsTrigger 
                    value="overview" 
                    className="px-6 py-4 text-base font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    data-testid="tab-overview"
                  >
                    Life at {community.name?.split(' ')[0]}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="apartments" 
                    className="px-6 py-4 text-base font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    data-testid="tab-apartments"
                  >
                    Apartments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="amenities" 
                    className="px-6 py-4 text-base font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    data-testid="tab-amenities"
                  >
                    Services & Amenities
                  </TabsTrigger>
                  <TabsTrigger 
                    value="gallery" 
                    className="px-6 py-4 text-base font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    data-testid="tab-gallery"
                  >
                    Tour & Gallery
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experience" 
                    className="px-6 py-4 text-base font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    data-testid="tab-experience"
                  >
                    Experience
                  </TabsTrigger>
                </div>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="p-8 lg:p-12 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6" data-testid="overview-title">
                    Welcome to {community.name}
                  </h2>
                  <div className="prose prose-lg max-w-none text-gray-600">
                    <p data-testid="community-description">
                      {community.description || community.shortDescription || 
                        "Experience exceptional senior living in a warm, welcoming community designed with your comfort and well-being in mind. Our dedicated team provides personalized care and support, ensuring every resident enjoys a fulfilling lifestyle."}
                    </p>
                  </div>
                </div>

                {/* Highlights Section */}
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Ignite Your Passion. Build Meaningful Connections.</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    At {community.name}, we believe in fostering a fulfilling lifestyle for our residents. Living in our community makes it easy to nurture your mind, body, and spirit—whether it's over a meal or during a group activity. With daily opportunities for creativity, learning, fitness, and social connections, you'll discover ways to ignite your passions and uncover new possibilities.
                  </p>
                </div>

                {/* Upcoming Events */}
                {events.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">Announcements & Events</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {events.slice(0, 2).map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Apartments Tab */}
              <TabsContent value="apartments" className="p-8 lg:p-12 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6" data-testid="apartments-title">
                    A Comfortable Lifestyle Awaits
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Each apartment home is designed for ease and comfort, with every feature aimed at supporting your independent lifestyle. With modern and personalized conveniences, you can relax and focus on enjoying the things that matter most.
                  </p>
                </div>

                {/* Floor Plans Grid */}
                {floorPlans.length > 0 ? (
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">Our Floor Plans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {floorPlans.map((floorPlan) => (
                        <Card key={floorPlan.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`floor-plan-${floorPlan.id}`}>
                          {floorPlan.imageUrl && (
                            <div className="aspect-w-16 aspect-h-9">
                              <img
                                src={floorPlan.imageUrl}
                                alt={`${floorPlan.name} floor plan`}
                                className="w-full h-48 object-cover"
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
                                Starting at {formatPrice(floorPlan.startingPrice)}/month*
                              </p>
                            )}
                            <div className="flex gap-4 mb-4 text-sm">
                              {floorPlan.bedrooms !== null && (
                                <span data-testid={`floor-plan-bedrooms-${floorPlan.id}`}>
                                  {floorPlan.bedrooms} {floorPlan.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                                </span>
                              )}
                              {floorPlan.bathrooms !== null && (
                                <span data-testid={`floor-plan-bathrooms-${floorPlan.id}`}>
                                  {floorPlan.bathrooms} {floorPlan.bathrooms === 1 ? 'Bath' : 'Baths'}
                                </span>
                              )}
                            </div>
                            {floorPlan.careType && (
                              <Badge className="mb-4" data-testid={`floor-plan-care-type-${floorPlan.id}`}>
                                {floorPlan.careType}
                              </Badge>
                            )}
                            <Button className="w-full" data-testid={`button-reserve-tour-${floorPlan.id}`}>
                              Reserve Your Tour
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12" data-testid="no-floor-plans">
                    Floor plans coming soon. Contact us for current availability.
                  </p>
                )}
              </TabsContent>

              {/* Services & Amenities Tab */}
              <TabsContent value="amenities" className="p-8 lg:p-12 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6" data-testid="amenities-title">
                    Endless Amenities for Effortless Living
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Step into a lifestyle where every day feels like a retreat. Our community is packed with thoughtful amenities designed to make life easier, more enjoyable, and filled with opportunities for connection.
                  </p>
                </div>

                {/* Amenities Grid */}
                {community.amenities && community.amenities.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {community.amenities.map((amenity, index) => {
                      const Icon = getAmenityIcon(amenity);
                      return (
                        <div 
                          key={index}
                          className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          data-testid={`amenity-${index}`}
                        >
                          <Icon className="w-10 h-10 text-primary mb-3" />
                          <span className="text-sm font-medium">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Services Section */}
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Discover Convenient Living</h3>
                  <p className="text-gray-600 mb-6">
                    We offer a variety of helpful services so you can focus on the things that matter most.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                      <Car className="w-12 h-12 text-primary mb-4" />
                      <h4 className="text-lg font-semibold mb-2">Transportation</h4>
                      <p className="text-gray-600 text-sm">
                        Scheduled transportation for medical appointments and local outings.
                      </p>
                    </Card>
                    <Card className="p-6">
                      <Sparkles className="w-12 h-12 text-primary mb-4" />
                      <h4 className="text-lg font-semibold mb-2">Housekeeping</h4>
                      <p className="text-gray-600 text-sm">
                        Weekly housekeeping and linen service to help you enjoy your time.
                      </p>
                    </Card>
                    <Card className="p-6">
                      <Shield className="w-12 h-12 text-primary mb-4" />
                      <h4 className="text-lg font-semibold mb-2">Emergency Assistance</h4>
                      <p className="text-gray-600 text-sm">
                        24/7 support available should you need assistance at any time.
                      </p>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery" className="p-8 lg:p-12 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6" data-testid="gallery-title">
                    Explore {community.name}
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Take a virtual tour of our community. You'll find bright, comfortable spaces throughout, as well as ample amenities and serene outdoor areas.
                  </p>
                </div>

                {/* Photo Gallery */}
                {galleryImages.length > 0 ? (
                  <div>
                    {/* Group images by category */}
                    {Array.from(new Set(galleryImages.map(img => img.category).filter(Boolean))).map((category) => (
                      <div key={category} className="mb-8">
                        <h3 className="text-xl font-semibold mb-4" data-testid={`gallery-category-${category}`}>
                          {category}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {galleryImages
                            .filter(img => img.category === category)
                            .map((image) => (
                              <div key={image.id} className="group cursor-pointer" data-testid={`gallery-image-${image.id}`}>
                                <div className="overflow-hidden rounded-lg">
                                  <img
                                    src={image.imageUrl}
                                    alt={image.caption || `${community.name} - ${category}`}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                {image.caption && (
                                  <p className="mt-2 text-sm text-gray-600 group-hover:text-gray-900">
                                    {image.caption}
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12" data-testid="no-gallery">
                    Photo gallery coming soon.
                  </p>
                )}
              </TabsContent>

              {/* Experience Tab (Testimonials) */}
              <TabsContent value="experience" className="p-8 lg:p-12 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6" data-testid="testimonials-title">
                    What Families Are Saying
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Hear directly from families who have experienced the exceptional care and vibrant lifestyle at {community.name}.
                  </p>
                </div>

                {/* Testimonials */}
                {testimonials.length > 0 ? (
                  <div className="space-y-6">
                    {testimonials.map((testimonial) => (
                      <Card key={testimonial.id} className="p-8 bg-gradient-to-r from-gray-50 to-white" data-testid={`testimonial-${testimonial.id}`}>
                        <div className="flex items-start gap-4">
                          <MessageSquare className="w-12 h-12 text-primary/20 flex-shrink-0 mt-2" />
                          <div className="flex-1">
                            <blockquote className="text-lg italic text-gray-700 mb-4" data-testid={`testimonial-content-${testimonial.id}`}>
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
                                      className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12" data-testid="no-testimonials">
                    Testimonials coming soon.
                  </p>
                )}

                {/* FAQs Section */}
                {faqs.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h3>
                    <Accordion type="single" collapsible className="space-y-4">
                      {faqs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-6" data-testid={`faq-${faq.id}`}>
                          <AccordionTrigger className="text-left hover:no-underline py-4" data-testid={`faq-question-${faq.id}`}>
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 text-gray-600" data-testid={`faq-answer-${faq.id}`}>
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Contact Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience {community.name}?</h2>
          <p className="text-xl mb-8 opacity-90">
            Schedule a tour today and see why families choose our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              data-testid="button-schedule-tour-cta"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Your Tour
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-primary"
              asChild
              data-testid="button-call-cta"
            >
              <a href={`tel:${community.phone || '+1-303-555-0123'}`}>
                <Phone className="w-5 h-5 mr-2" />
                {community.phone || "(303) 555-0123"}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}