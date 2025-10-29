import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { PageContentSection } from "@shared/schema";

export default function BeautySalon() {
  const searchParams = new URLSearchParams(window.location.search);
  const fromCommunity = searchParams.get('from');

  // Fetch community data when coming from a specific community
  const { data: communityData } = useQuery<any>({
    queryKey: [`/api/communities/${fromCommunity}/full`],
    enabled: !!fromCommunity,
  });

  // Fetch page content sections
  const { data: sections = [], isLoading } = useQuery<PageContentSection[]>({
    queryKey: ["/api/page-content", { pagePath: "/beauty-salon", active: true }],
    queryFn: async () => {
      const response = await fetch("/api/page-content?pagePath=/beauty-salon&active=true");
      if (!response.ok) throw new Error("Failed to fetch page content");
      const data = await response.json();
      return data.sort((a: PageContentSection, b: PageContentSection) => 
        (a.sortOrder || 0) - (b.sortOrder || 0)
      );
    }
  });

  // Resolve community salon image URL
  const salonImageUrl = useResolveImageUrl(communityData?.community?.salonImageId);

  useEffect(() => {
    document.title = "Beauty Salon & Barber Services | Senior Living Communities";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Enjoy convenient on-site beauty salon and barber services at our senior living communities. Professional haircuts, styling, color treatments, and grooming services that help residents look and feel their best.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Enjoy convenient on-site beauty salon and barber services at our senior living communities. Professional haircuts, styling, color treatments, and grooming services that help residents look and feel their best.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero pagePath="/beauty-salon" />

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
                <BreadcrumbPage data-testid="breadcrumb-current">Beauty Salon & Barber</BreadcrumbPage>
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
            // Pass community salon image to the first hero_section
            const isFirstHeroSection = index === sections.findIndex(s => s.sectionType === 'hero_section');
            const communityImageId = isFirstHeroSection && fromCommunity ? communityData?.community?.salonImageId : undefined;
            
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
