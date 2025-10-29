import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { PageContentSection } from "@shared/schema";

export default function Dining() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const fromCommunity = searchParams.get('from');

  // Fetch community data when coming from a specific community
  const { data: communityData } = useQuery<any>({
    queryKey: [`/api/communities/${fromCommunity}/full`],
    enabled: !!fromCommunity,
  });

  // Fetch page content sections
  const { data: sections = [], isLoading } = useQuery<PageContentSection[]>({
    queryKey: ["/api/page-content", { pagePath: "/dining", active: true }],
    queryFn: async () => {
      const response = await fetch("/api/page-content?pagePath=/dining&active=true");
      if (!response.ok) throw new Error("Failed to fetch page content");
      const data = await response.json();
      return data.sort((a: PageContentSection, b: PageContentSection) => 
        (a.sortOrder || 0) - (b.sortOrder || 0)
      );
    }
  });

  // Resolve community dining image URL
  const diningImageUrl = useResolveImageUrl(communityData?.community?.privateDiningImageId);

  useEffect(() => {
    document.title = "Dining & Restaurant Services | Senior Living Communities";
    
    const metaContent = 'Experience exceptional restaurant-style dining and private family dining rooms at our senior living communities. Fresh, nutritious meals prepared daily with dietary accommodations and social dining experiences.';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metaContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = metaContent;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero pagePath="/dining" />

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
                <BreadcrumbPage data-testid="breadcrumb-current">Dining Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Community-specific amenity intro section */}
      {fromCommunity && communityData?.community?.privateDiningImageId && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Image on the left */}
              <div className="relative rounded-xl overflow-hidden shadow-lg h-64 lg:h-80">
                <img
                  src={diningImageUrl || ''}
                  alt="Private Dining"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Text on the right */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Restaurant-Style Dining Excellence
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Experience exceptional restaurant-style dining with fresh, nutritious meals prepared daily by our culinary team. Our elegant dining rooms and private family dining spaces provide the perfect setting for enjoying delicious food and meaningful connections with friends and family.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Render content sections from database */}
      {isLoading ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      ) : (
        <>
          {sections.map((section) => (
            <PageSectionRenderer 
              key={section.id} 
              section={section}
            />
          ))}
        </>
      )}
    </div>
  );
}
