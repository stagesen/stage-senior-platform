import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import CommunitiesCarousel from "@/components/CommunitiesCarousel";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import { setMetaTags } from "@/lib/metaTags";
import type { Community, PageContentSection } from "@shared/schema";

export default function Chaplaincy() {
  useEffect(() => {
    const baseUrl = window.location.origin;
    setMetaTags({
      title: "Spiritual Care & Chaplaincy Services | Stage Senior",
      description: "Compassionate spiritual care and chaplaincy services for seniors. Supporting residents' faith and emotional wellbeing in our communities.",
      canonicalUrl: `${baseUrl}/services/chaplaincy`,
      ogTitle: "Spiritual Care & Chaplaincy Services",
      ogDescription: "Compassionate spiritual care and chaplaincy services for seniors. Supporting residents' faith and emotional wellbeing in our communities.",
      ogType: "website",
      ogUrl: `${baseUrl}/services/chaplaincy`,
      ogSiteName: "Stage Senior Living"
    });
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

  // Get active sections for this page, sorted by sortOrder
  const activeSections = pageSections
    .filter(section => section.pagePath === "/services/chaplaincy" && section.active)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        pagePath="/services/chaplaincy"
        defaultTitle="Chaplaincy Services"
        defaultSubtitle="Spiritual care and support"
      />

      {/* Dynamic Content Sections from Database */}
      {activeSections.map((section) => (
        <PageSectionRenderer key={section.id} section={section} />
      ))}

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