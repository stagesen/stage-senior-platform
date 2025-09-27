import { useEffect } from "react";
import { Heart, Users, HandHeart, Clock, Shield, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import CommunityServiceCard from "@/components/CommunityServiceCard";
import type { Community } from "@shared/schema";

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
      <section className="relative py-32 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="hero-title">
            Chaplain Program
          </h1>
          <p className="text-xl md:text-2xl text-white/90" data-testid="hero-subtitle">
            Compassionate Spiritual Support
          </p>
        </div>
      </section>

      {/* Our Vision for Spiritual Care Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center" data-testid="vision-title">
            Our Vision for Spiritual Care
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p data-testid="vision-text-1">
              At Stage Management, we believe that genuine care extends beyond physical comfort to embrace emotional and spiritual well-being.
            </p>
            <p data-testid="vision-text-2">
              Through our partnership with Senior Living Chaplains, a division of Marketplace Chaplains, we provide dedicated spiritual support that welcomes and nurtures residents of all faiths and backgrounds.
            </p>
            <p data-testid="vision-text-3">
              Our chaplains are specially trained in senior care, bringing both professional expertise and heartfelt dedication to their role in our communities.
            </p>
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
            <p className="text-lg text-muted-foreground" data-testid="communities-subtitle">
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