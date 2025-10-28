import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import type { PageContentSection } from "@shared/schema";

export default function CourtyardsPatios() {
  const searchParams = new URLSearchParams(window.location.search);
  const fromCommunity = searchParams.get('from');

  // Fetch community data when coming from a specific community
  const { data: communityData } = useQuery<any>({
    queryKey: [`/api/communities/${fromCommunity}/full`],
    enabled: !!fromCommunity,
  });

  // Fetch page content sections
  const { data: sections = [], isLoading } = useQuery<PageContentSection[]>({
    queryKey: ["/api/page-content", { pagePath: "/courtyards-patios", active: true }],
    queryFn: async () => {
      const response = await fetch("/api/page-content?pagePath=/courtyards-patios&active=true");
      if (!response.ok) throw new Error("Failed to fetch page content");
      const data = await response.json();
      return data.sort((a: PageContentSection, b: PageContentSection) => 
        (a.sortOrder || 0) - (b.sortOrder || 0)
      );
    }
  });

  // Use community-specific image if available
  const heroBackgroundImage = communityData?.community?.courtyardsImageId || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2000&q=80";

  useEffect(() => {
    document.title = "Courtyards & Outdoor Spaces | Senior Living Communities";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Enjoy beautiful courtyards, gardens, and outdoor spaces at our senior living communities. Safe, accessible patios, walking paths, and garden areas designed for relaxation, activities, and connection with nature.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Enjoy beautiful courtyards, gardens, and outdoor spaces at our senior living communities. Safe, accessible patios, walking paths, and garden areas designed for relaxation, activities, and connection with nature.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        pagePath="/courtyards-patios"
        defaultTitle="Courtyards & Outdoor Spaces"
        defaultSubtitle="Connect with Nature in Beautiful, Safe Environments"
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
                <BreadcrumbPage data-testid="breadcrumb-current">Courtyards & Outdoor Spaces</BreadcrumbPage>
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
          {sections.map((section) => (
            <PageSectionRenderer key={section.id} section={section} />
          ))}
        </>
      )}
    </div>
  );
}
