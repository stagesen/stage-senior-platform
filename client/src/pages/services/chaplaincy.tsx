import { useEffect } from "react";
import { Heart, Users, HandHeart, Clock, Shield, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHero } from "@/components/PageHero";
import CommunitiesCarousel from "@/components/CommunitiesCarousel";
import type { Community, PageContentSection } from "@shared/schema";

export default function Chaplaincy() {
  useEffect(() => {
    document.title = "Chaplain Program | Stage Senior";

    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stage Senior Chaplain Program provides compassionate spiritual support for residents of all faiths. Professional chaplains offer 24/7 emotional support, counseling, and spiritual care.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Stage Senior Chaplain Program provides compassionate spiritual support for residents of all faiths. Professional chaplains offer 24/7 emotional support, counseling, and spiritual care.';
      document.head.appendChild(meta);
    }
  }, []);

  // Fetch communities from API
  const { data: communities, isLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    staleTime: 5 * 60 * 1000,
  });

  // Fetch page content sections
  const { data: pageSections = [] } = useQuery<PageContentSection[]>({
    queryKey: ["/api/page-content"],
  });

  // Get hero section content
  const heroSection = pageSections.find(
    (section) => section.pagePath === "/services/chaplaincy" && section.sectionType === "hero_section" && section.active
  );
  const heroContent = heroSection?.content as { heading?: string; description?: string; imageUrl?: string } | undefined;

  const chaplainServices = [
    {
      icon: <Clock className="w-6 h-6" />,
      text: "24/7 emotional and spiritual support"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      text: "Confidential personal counseling"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      text: "Weekly ceremonies and services"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      text: "Crisis response and support"
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: "Regular community visits"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        pagePath="/services/chaplaincy"
        defaultTitle="Chaplaincy Services"
        defaultSubtitle="Spiritual care and support"
        defaultDescription="Interfaith spiritual support and pastoral care for all residents"
      />

      {/* Our Vision for Spiritual Care Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="vision-title">
                {heroContent?.heading || "Our Vision for Spiritual Care"}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="vision-description">
                {heroContent?.description || "At Stage Management, we believe that genuine care extends beyond physical comfort to embrace emotional and spiritual well-being. Through our partnership with Senior Living Chaplains, a division of Marketplace Chaplains, we provide dedicated spiritual support that welcomes and nurtures residents of all faiths and backgrounds."}
              </p>
            </div>
            <div className="relative rounded-2xl shadow-xl h-80 overflow-hidden">
              <img
                src={heroContent?.imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"}
                alt="Chaplaincy services"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Professional Chaplain Services Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="services-title">
              Professional Chaplain Services
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="services-subtitle">
              Our specially trained chaplains offer:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {chaplainServices.map((service, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                data-testid={`service-${index}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-primary flex-shrink-0">
                    {service.icon}
                  </div>
                  <p className="text-foreground">{service.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Care Through Stage Cares Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" data-testid="stage-cares-title">
              Community Care Through Stage Cares
            </h2>
            <div className="space-y-6 text-lg text-white/95 leading-relaxed">
              <p data-testid="stage-cares-text-1">
                Our commitment to compassionate care extends beyond our residents through Stage Cares, our community impact initiative.
              </p>
              <p data-testid="stage-cares-text-2">
                This employee-funded benevolence program provides crucial support to community team members facing unexpected hardships. We also actively engage with both local and international non-profit organizations, donating time, money, and resources to create positive change beyond our walls.
              </p>
            </div>
            <div className="mt-8 text-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                data-testid="button-explore-stage-cares"
              >
                <Link href="/stage-cares">
                  Explore Stage Cares Foundation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-20 bg-gray-50">
        <CommunitiesCarousel
          communities={communities || []}
          isLoading={isLoading}
          title="Communities with Chaplaincy Services"
          subtitle="Spiritual care and support at our Colorado communities"
        />
      </section>
    </div>
  );
}