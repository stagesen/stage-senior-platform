import { useEffect } from "react";
import { Link } from "wouter";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/PageHero";
import { useQuery } from "@tanstack/react-query";
import CommunitiesCarousel from "@/components/CommunitiesCarousel";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import { setMetaTags, getCanonicalUrl } from "@/lib/metaTags";
import type { Community, PageContentSection } from "@shared/schema";

export default function Services() {
  useEffect(() => {
    setMetaTags({
      title: "Our Services | Stage Senior",
      description: "Discover Stage Senior's comprehensive senior living management solutions, spiritual care programs, and long-term care insurance services across Colorado communities.",
      canonicalUrl: getCanonicalUrl("/services"),
      ogType: "website",
    });
  }, []);

  // Fetch content sections from API
  const { data: sections, isLoading: sectionsLoading } = useQuery<PageContentSection[]>({
    queryKey: ["/api/page-content?pagePath=/services"],
    staleTime: 5 * 60 * 1000,
  });

  // Fetch communities from API
  const { data: communities, isLoading: communitiesLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        pagePath="/services"
        defaultTitle="Senior Living Management Solutions"
        titleAccentWords={["Management Solutions"]}
        defaultSubtitle="Comprehensive Care & Support Services"
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
                <BreadcrumbPage data-testid="breadcrumb-current">Our Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Service Sections from Database */}
      {sectionsLoading ? (
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      ) : (
        sections?.filter(s => s.active).map((section) => (
          <PageSectionRenderer key={section.id} section={section} />
        ))
      )}

      {/* Bottom Section - Communities */}
      <section id="communities" className="py-20 bg-gray-50 scroll-mt-24">
        <CommunitiesCarousel
          communities={communities || []}
          isLoading={communitiesLoading}
          title="Our Communities"
          subtitle="Experience senior living across Colorado"
        />
      </section>
    </div>
  );
}