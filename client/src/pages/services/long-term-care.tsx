import { useEffect } from "react";
import { Phone, Mail, FileText, Shield, CheckCircle, Calendar, Briefcase, ClipboardCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import CommunityServiceCard from "@/components/CommunityServiceCard";
import type { Community } from "@shared/schema";

export default function LongTermCare() {
  useEffect(() => {
    document.title = "Long Term Care Insurance Services | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Expert long-term care insurance services from Stage Senior. Maximize your benefits with our comprehensive claims processing, policy review, and certification support.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Expert long-term care insurance services from Stage Senior. Maximize your benefits with our comprehensive claims processing, policy review, and certification support.';
      document.head.appendChild(meta);
    }
  }, []);

  // Fetch communities from API
  const { data: communities, isLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    staleTime: 5 * 60 * 1000,
  });

  const serviceHighlights = [
    "Expert Policy Review",
    "Streamlined Claims Processing",
    "Clinical Certification Support",
    "Monthly Claims Management"
  ];

  const serviceDetails = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Expert Policy Review",
      description: "We thoroughly analyze your policy to identify all available benefits and coverage options, helping you make informed decisions about your care."
    },
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "Streamlined Claims Processing",
      description: "From initial filing through ongoing management, we handle all documentation and submissions to ensure prompt, accurate processing of your claims."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Clinical Certification Support",
      description: "Our clinical team works directly with insurance providers to facilitate initial certification and maintain ongoing coverage eligibility."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Monthly Claims Management",
      description: "We process all required monthly documentation, coordinating directly with insurance companies to ensure consistent, timely payments."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="hero-title">
            Long Term Care Insurance Services
          </h1>
          <p className="text-xl md:text-2xl text-white/90" data-testid="hero-subtitle">
            Maximizing Your Insurance Benefits
          </p>
        </div>
      </section>

      {/* Service Highlights Bar */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {serviceHighlights.map((highlight, index) => (
              <div 
                key={index}
                className="bg-white px-4 py-3 rounded-lg shadow-sm text-center"
                data-testid={`highlight-${index}`}
              >
                <p className="text-sm font-semibold text-foreground">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Support Process Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8" data-testid="support-process-title">
            Our Comprehensive Support Process
          </h2>
          <Link href="/about-us">
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
              data-testid="about-us-button"
            >
              ABOUT US
            </Button>
          </Link>
        </div>
      </section>

      {/* Service Details Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceDetails.map((service, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                data-testid={`service-detail-${index}`}
              >
                <div className="text-primary mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center" data-testid="contact-title">
              Contact Our Claims Team
            </h2>
            <p className="text-lg text-white/90 mb-8 text-center max-w-3xl mx-auto" data-testid="contact-description">
              Let our experienced team help you navigate your long-term care insurance benefits. 
              Contact us today to learn how we can assist you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-center justify-center space-x-3">
                <Phone className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Phone</p>
                  <a href="tel:3036473914" className="text-white font-semibold hover:underline" data-testid="contact-phone">
                    (303) 647-3914
                  </a>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-3">
                <Briefcase className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Fax</p>
                  <span className="text-white font-semibold" data-testid="contact-fax">
                    (303) 648-6763
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-3">
                <Mail className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-sm text-white/80">Email</p>
                  <a href="mailto:ltc@stagesenior.com" className="text-white font-semibold hover:underline" data-testid="contact-email">
                    ltc@stagesenior.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="communities-title">
              Our Communities and Resources
            </h2>
            <p className="text-lg text-muted-foreground">
              Elevating Senior Care Across Colorado
            </p>
          </div>

          {/* Community Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          ) : communities && communities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communities.slice(0, 4).map((community) => (
                <CommunityServiceCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No communities available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}