import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import type { PageContentSection } from "@shared/schema";

export default function FitnessTherapy() {
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
    queryKey: ["/api/page-content", { pagePath: "/fitness-therapy", active: true }],
    queryFn: async () => {
      const response = await fetch("/api/page-content?pagePath=/fitness-therapy&active=true");
      if (!response.ok) throw new Error("Failed to fetch page content");
      const data = await response.json();
      return data.sort((a: PageContentSection, b: PageContentSection) => 
        (a.sortOrder || 0) - (b.sortOrder || 0)
      );
    }
  });

  // Use community-specific image if available
  const heroBackgroundImage = communityData?.community?.fitnessImageId || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=2000&q=80";

  useEffect(() => {
    document.title = "Fitness & Therapy Center | Senior Living Communities";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover our comprehensive fitness and therapy center offering personalized exercise programs, physical therapy, occupational therapy, and group fitness classes designed specifically for senior wellness and independence.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover our comprehensive fitness and therapy center offering personalized exercise programs, physical therapy, occupational therapy, and group fitness classes designed specifically for senior wellness and independence.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        pagePath="/fitness-therapy"
        defaultTitle="Fitness & Therapy Center"
        defaultSubtitle="Your Journey to Wellness Starts Here"
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
                <BreadcrumbLink asChild>
                  <Link href="/services" data-testid="breadcrumb-services">Services</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage data-testid="breadcrumb-current">Fitness & Therapy</BreadcrumbPage>
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
          {sections.map((section, index) => {
            // Pass community fitness image to the first hero_section
            const isFirstHeroSection = index === 0 && section.sectionType === 'hero_section';
            const communityImageId = isFirstHeroSection ? communityData?.community?.fitnessImageId : undefined;
            
            return (
              <PageSectionRenderer 
                key={section.id} 
                section={section}
                communityImageId={communityImageId}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
