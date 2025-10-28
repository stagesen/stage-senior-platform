import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import PageSectionRenderer from "@/components/PageSectionRenderer";
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

  // Use community-specific image if available
  const heroBackgroundImage = communityData?.community?.privateDiningImageId || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=2000&q=80";

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
      <PageHero
        pagePath="/dining"
        defaultTitle="Exceptional Dining Experiences"
        defaultSubtitle="Restaurant-Style Service • Fresh Daily • Social Connection"
        defaultBackgroundImage={heroBackgroundImage}
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
                <BreadcrumbPage data-testid="breadcrumb-current">Dining Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Render content sections from database */}
      {isLoading ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      ) : (
        <>
          {(() => {
            // Find the index of the first hero_section
            const firstHeroIndex = sections.findIndex(s => s.sectionType === 'hero_section');
            
            return sections.map((section, index) => {
              // Pass community private dining image to the first hero_section only
              const isFirstHeroSection = index === firstHeroIndex && firstHeroIndex !== -1;
              const communityImageId = isFirstHeroSection ? communityData?.community?.privateDiningImageId : undefined;
              
              return (
                <PageSectionRenderer 
                  key={section.id} 
                  section={section}
                  communityImageId={communityImageId}
                />
              );
            });
          })()}
        </>
      )}
    </div>
  );
}
