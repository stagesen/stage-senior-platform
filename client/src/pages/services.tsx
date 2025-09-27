import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import CommunityServiceCard from "@/components/CommunityServiceCard";
import type { Community } from "@shared/schema";

export default function Services() {
  useEffect(() => {
    document.title = "Our Services | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover Stage Senior\'s comprehensive senior living management solutions, spiritual care programs, and long-term care insurance services across Colorado communities.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover Stage Senior\'s comprehensive senior living management solutions, spiritual care programs, and long-term care insurance services across Colorado communities.';
      document.head.appendChild(meta);
    }
  }, []);

  const services = [
    {
      title: "Expert Management Services",
      description: "Transform your senior living community with our proven management expertise. From independent living to memory care, we optimize operations while maintaining the highest standards of resident care and satisfaction.",
      buttonText: "LEARN MORE",
      href: "/services/management",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Spiritual Care & Support",
      description: "Our dedicated chaplaincy program provides essential spiritual and emotional support throughout your community. We build meaningful relationships that enhance the well-being of residents, families, and staff alike.",
      buttonText: "EXPLORE",
      href: "/services/chaplaincy",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      title: "Long-Term Care Insurance Excellence",
      description: "Navigate the complexities of long-term care insurance with confidence. Our specialized team handles everything from policy review to claims processing, ensuring maximum benefits and full compliance.",
      buttonText: "LEARN MORE",
      href: "/services/long-term-care",
      gradient: "bg-gradient-to-br from-green-500 to-green-600"
    }
  ];

  // Fetch communities from API
  const { data: communities, isLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Senior Living Management Solutions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
            At Stage Management, we deliver comprehensive solutions tailored to the unique needs of senior living communities. 
            Our specialized services ensure operational excellence, compassionate care, and sustainable growth for your community.
          </p>
        </div>
      </section>

      {/* Three Service Sections with Alternating Layout */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
                data-testid={`service-section-${index}`}
              >
                {/* Image Placeholder */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div 
                    className={`${service.gradient} rounded-2xl shadow-xl h-80 lg:h-96 w-full flex items-center justify-center`}
                    data-testid={`service-image-${index}`}
                  >
                    {/* Placeholder for image - using gradient for now */}
                    <div className="text-white/20 text-6xl font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground" data-testid={`service-title-${index}`}>
                      {service.title}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed" data-testid={`service-description-${index}`}>
                      {service.description}
                    </p>
                    <Button 
                      variant="default"
                      size="lg"
                      asChild
                      className="group"
                      data-testid={`service-button-${index}`}
                    >
                      <a href={service.href}>
                        <span className="font-semibold">{service.buttonText}</span>
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Section - Communities */}
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