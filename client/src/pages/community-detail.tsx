import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import GalleryLightbox from "@/components/GalleryLightbox";
import EventCard from "@/components/EventCard";
import { 
  MapPin, 
  Phone, 
  Calendar, 
  Mail,
  Star,
  Shield,
  ChevronLeft
} from "lucide-react";
import { Link } from "wouter";
import type { Community, Event, Faq, Gallery } from "@shared/schema";

export default function CommunityDetail() {
  const params = useParams();
  const slug = params.slug;

  const { data: community, isLoading: communityLoading } = useQuery<Community>({
    queryKey: ["/api/communities", slug],
    enabled: !!slug,
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events", { communityId: community?.id, upcoming: true }],
    enabled: !!community?.id,
  });

  const { data: faqs = [] } = useQuery<Faq[]>({
    queryKey: ["/api/faqs", { communityId: community?.id, active: true }],
    enabled: !!community?.id,
  });

  const { data: galleries = [] } = useQuery<Gallery[]>({
    queryKey: ["/api/galleries", { communityId: community?.id, active: true }],
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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={community.heroImageUrl || `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600`}
          alt={`${community.name} - Senior Living Community`}
          className="w-full h-full object-cover"
          data-testid="hero-image"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-white">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20 mb-4" 
                asChild
                data-testid="button-back"
              >
                <Link href="/communities">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Communities
                </Link>
              </Button>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4" data-testid="community-name">
                {community.name}
              </h1>
              <div className="flex items-center text-xl mb-4" data-testid="community-location">
                <MapPin className="w-5 h-5 mr-2" />
                {community.city}, {community.state}
              </div>
              {community.careTypes && community.careTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {community.careTypes.map((careType) => (
                    <Badge 
                      key={careType} 
                      variant="secondary" 
                      className="bg-white/20 text-white border-white/30"
                      data-testid={`care-type-${careType}`}
                    >
                      {careType.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-schedule-tour-hero"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Tour
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-black"
                  asChild
                  data-testid="button-call-hero"
                >
                  <a href={`tel:${community.phone || '+1-303-555-0123'}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4" data-testid="tabs-list">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
                <TabsTrigger value="gallery" data-testid="tab-gallery">Gallery</TabsTrigger>
                <TabsTrigger value="faq" data-testid="tab-faq">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle data-testid="overview-title">About {community.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed" data-testid="community-description">
                      {community.description || community.shortDescription || 
                        "Experience exceptional senior living in a warm, welcoming community designed with your comfort and well-being in mind."}
                    </p>
                  </CardContent>
                </Card>

                {/* Amenities */}
                {community.amenities && community.amenities.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle data-testid="amenities-title">Amenities & Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {community.amenities.map((amenity, index) => (
                          <div 
                            key={index} 
                            className="flex items-center space-x-2"
                            data-testid={`amenity-${index}`}
                          >
                            <Star className="w-4 h-4 text-primary" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle data-testid="contact-title">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {community.address && (
                      <div className="flex items-start space-x-2" data-testid="contact-address">
                        <MapPin className="w-4 h-4 text-primary mt-1" />
                        <span>{community.address}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2" data-testid="contact-phone">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{community.phone || "(303) 555-0123"}</span>
                    </div>
                    <div className="flex items-center space-x-2" data-testid="contact-email">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>info@stagesenior.com</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="events" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle data-testid="events-title">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {events.length > 0 ? (
                      <div className="space-y-4">
                        {events.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8" data-testid="no-events">
                        No upcoming events scheduled at this time.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="gallery" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle data-testid="gallery-title">Photo Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {galleries.length > 0 ? (
                      <div className="space-y-6">
                        {galleries.map((gallery) => (
                          <GalleryLightbox key={gallery.id} gallery={gallery} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8" data-testid="no-gallery">
                        Photos coming soon.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="faq" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle data-testid="faq-title">Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {faqs.length > 0 ? (
                      <Accordion type="single" collapsible className="space-y-2">
                        {faqs.map((faq) => (
                          <AccordionItem key={faq.id} value={faq.id} data-testid={`faq-item-${faq.id}`}>
                            <AccordionTrigger className="text-left" data-testid={`faq-question-${faq.id}`}>
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${faq.id}`}>
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <p className="text-muted-foreground text-center py-8" data-testid="no-faqs">
                        No FAQs available at this time.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-foreground" data-testid="pricing-amount">
                    {formatPrice(community.startingPrice)}
                  </div>
                  {community.startingPrice && (
                    <div className="text-sm text-muted-foreground">starting per month</div>
                  )}
                </div>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-schedule-tour-sidebar"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Tour
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    asChild
                    data-testid="button-call-sidebar"
                  >
                    <a href={`tel:${community.phone || '+1-303-555-0123'}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4" data-testid="trust-title">
                  Why Choose Us
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center" data-testid="trust-licensed">
                    <Shield className="w-4 h-4 text-primary mr-2" />
                    <span>Licensed & Insured</span>
                  </div>
                  <div className="flex items-center" data-testid="trust-local">
                    <Star className="w-4 h-4 text-primary mr-2" />
                    <span>Locally Owned Since 2016</span>
                  </div>
                  <div className="flex items-center" data-testid="trust-staff">
                    <Star className="w-4 h-4 text-primary mr-2" />
                    <span>Exceptional Staff Tenure</span>
                  </div>
                  <div className="flex items-center" data-testid="trust-satisfaction">
                    <Star className="w-4 h-4 text-primary mr-2" />
                    <span>High Resident Satisfaction</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-muted/50 to-muted h-64 relative flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground" data-testid="map-placeholder">Location Map</p>
                    <p className="text-xs text-muted-foreground">{community.city}, {community.state}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
