import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { PageHero } from "@/components/PageHero";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CommunitySelectionModal from "@/components/CommunitySelectionModal";
import type { Community } from "@shared/schema";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageSquare,
  Building2
} from "lucide-react";

export default function Contact() {
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  
  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    document.title = "Contact Us | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact Stage Senior today. Call (303) 436-2300 or visit one of our four Colorado communities. Schedule tours, get answers, and explore senior living options.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Contact Stage Senior today. Call (303) 436-2300 or visit one of our four Colorado communities. Schedule tours, get answers, and explore senior living options.';
      document.head.appendChild(meta);
    }
  }, []);

  const communityLocations = [
    {
      name: "The Gardens at Columbine",
      address: "5130 W Ken Caryl Ave",
      city: "Littleton, CO 80128",
      phone: "(303) 973-5450"
    },
    {
      name: "The Gardens on Quail",
      address: "6055 Quail St",
      city: "Arvada, CO 80004",
      phone: "(303) 424-6116"
    },
    {
      name: "Golden Pond",
      address: "14301 W. 21st Ave",
      city: "Golden, CO 80401",
      phone: "(303) 271-0300"
    },
    {
      name: "Stonebridge Senior",
      address: "5555 W. 59th Ave",
      city: "Arvada, CO 80002",
      phone: "(303) 425-1400"
    }
  ];

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
                  <a href="tel:+1-303-436-2300">
                    (303) 436-2300
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
                  className="w-full" 
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
                      <a href="tel:+1-303-436-2300" className="text-muted-foreground hover:text-primary">
                        (303) 436-2300
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
                    <strong>Urgent Placement:</strong> Call (303) 436-2300 for immediate assistance
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
            {communityLocations.map((community, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{community.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="text-muted-foreground">
                          {community.address}<br />
                          {community.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <a href={`tel:${community.phone.replace(/[^0-9]/g, '')}`} className="text-muted-foreground hover:text-primary">
                        {community.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Start a Conversation
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Every family's journey is unique. We're here to listen, guide, and support you through this important decision.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="tel:+1-303-436-2300">
              <Phone className="w-5 h-5 mr-2" />
              Call Now: (303) 436-2300
            </a>
          </Button>
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