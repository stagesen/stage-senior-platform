import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { PageHero } from "@/components/PageHero";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CommunitySelectionModal from "@/components/CommunitySelectionModal";
import { getPrimaryPhoneDisplay, getPrimaryPhoneHref, getCityStateZip } from "@/lib/communityContact";
import { setMetaTags, getCanonicalUrl } from "@/lib/metaTags";
import type { Community } from "@shared/schema";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageSquare,
  Building2,
  CheckCircle,
  Navigation
} from "lucide-react";

export default function Contact() {
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  
  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const baseUrl = window.location.origin;
    setMetaTags({
      title: "Contact Stage Senior | Get in Touch",
      description: "Contact Stage Senior for questions about our communities, schedule a tour, or learn more about senior living options. We're here to help.",
      canonicalUrl: `${baseUrl}/contact`,
      ogTitle: "Contact Stage Senior | Get in Touch",
      ogDescription: "Contact Stage Senior for questions about our communities, schedule a tour, or learn more about senior living options. We're here to help.",
      ogType: "website",
      ogUrl: `${baseUrl}/contact`,
      ogSiteName: "Stage Senior Living"
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        pagePath="/contact"
        defaultTitle="Get in Touch"
        defaultSubtitle="We're Here to Help"
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
                <BreadcrumbPage data-testid="breadcrumb-current">Contact Us</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Contact Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-muted-foreground mb-4">
                  Speak directly with a senior living advisor
                </p>
                <Button asChild className="w-full">
                  <a href="tel:+1-970-444-4689">
                    (970) 444-4689
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-4">
                  Get answers to your questions via email
                </p>
                <Button asChild className="w-full" variant="outline">
                  <a href="mailto:info@stagesenior.com">
                    info@stagesenior.com
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Schedule a Tour</h3>
                <p className="text-muted-foreground mb-4">
                  Visit our communities and see the difference
                </p>
                <Button 
                  className="w-full talkfurther-schedule-tour" 
                  variant="secondary"
                  onClick={() => setShowCommunityModal(true)}
                  data-testid="button-schedule-tour"
                >
                  Book Your Visit
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-8">
                Have questions? Need more information? Fill out the form and we'll get back to you within one business day.
              </p>
              <LeadCaptureForm 
                variant="inline"
                title=""
                description=""
                urgencyText="We typically respond within 24 hours"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Corporate Office
              </h2>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold">Stage Management, LLC</p>
                        <p className="text-muted-foreground">
                          8100 E Arapahoe Road, Suite 208<br />
                          Centennial, CO 80112
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <a href="tel:+1-970-444-4689" className="text-muted-foreground hover:text-primary">
                        (970) 444-4689
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <a href="mailto:info@stagesenior.com" className="text-muted-foreground hover:text-primary">
                        info@stagesenior.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <p className="text-muted-foreground">
                        Monday - Friday: 8:00 AM - 6:00 PM<br />
                        Saturday - Sunday: 9:00 AM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-xl font-bold mb-4">Quick Assistance</h3>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong>Urgent Placement:</strong> Call (970) 444-4689 for immediate assistance
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Weekend Tours:</strong> Available by appointment at all communities
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Virtual Tours:</strong> Schedule a video walkthrough if you can't visit in person
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Locations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Community Locations
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Visit any of our four Colorado communities to experience the Stage Senior difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communities.map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{community.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-muted-foreground">
                          {community.street}<br />
                          {getCityStateZip(community)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <a href={getPrimaryPhoneHref(community)} className="text-muted-foreground hover:text-primary">
                        {getPrimaryPhoneDisplay(community)}
                      </a>
                    </div>
                    <Button 
                      asChild 
                      className="w-full"
                      variant="outline"
                      data-testid={`button-directions-${community.slug}`}
                    >
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${community.street}, ${community.city}, ${community.state} ${community.zip}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Generation Panel - Same as Homepage */}
      <section className="py-16 bg-gradient-to-br from-[var(--deep-blue)] to-[var(--bright-blue)] relative overflow-hidden">
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
              />
            ) : (
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-[var(--deep-blue)]">Ready to explore?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Let us help you find the perfect senior living community for your loved one.
                  </p>
                  <Button 
                    size="lg" 
                    className="w-full bg-[var(--deep-blue)] text-white hover:bg-gradient-to-r hover:from-[var(--deep-blue)] hover:to-[var(--bright-blue)]"
                    onClick={() => setShowContactForm(true)}
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