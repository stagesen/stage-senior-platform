import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CommunitiesCarousel from "@/components/CommunitiesCarousel";
import { PageHero } from "@/components/PageHero";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import { setMetaTags } from "@/lib/metaTags";
import type { Community, PageContentSection } from "@shared/schema";

export default function ProfessionalManagement() {
  useEffect(() => {
    const baseUrl = window.location.origin;
    setMetaTags({
      title: "Professional Senior Living Management Services | Stage Senior",
      description: "Expert management services for senior living communities. Local leadership, proven excellence, and compassionate care tailored to each resident.",
      canonicalUrl: `${baseUrl}/services/management`,
      ogTitle: "Professional Senior Living Management Services",
      ogDescription: "Expert management services for senior living communities. Local leadership, proven excellence, and compassionate care tailored to each resident.",
      ogType: "website",
      ogUrl: `${baseUrl}/services/management`,
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
    .filter(section => section.pagePath === "/services/management" && section.active)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        pagePath="/services/management"
        defaultTitle="Professional Management Services"
        defaultSubtitle="Local Leadership, Proven Excellence"
      />

      {/* Main Content Sections */}
      <div className="py-16">
        {activeSections.map((section) => {
          // Special handling for operational excellence pillars section
          if (section.sectionKey === "operational_excellence_pillars") {
            const content = section.content as any;
            return (
              <section key={section.id} className="py-12 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {content.features?.map((feature: any, index: number) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold text-foreground mb-4" data-testid={`pillar-${index}`}>
                          {feature.title}
                        </h3>
                        <ul className="space-y-3">
                          {feature.description.split('\n').map((item: string, itemIndex: number) => {
                            const cleanedItem = item.replace(/^[•\-]\s*/, '');
                            if (cleanedItem.trim()) {
                              return (
                                <li key={itemIndex} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">{cleanedItem}</span>
                                </li>
                              );
                            }
                            return null;
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // Special handling for proven track record with visual element
          if (section.sectionKey === "proven_track_record") {
            return (
              <section key={section.id} className="py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="track-record-title">
                        Proven Track Record
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed" data-testid="track-record-description">
                        Our hands-on management approach has created a portfolio of successful communities throughout the Denver metro area. 
                        We maintain direct accessibility to both our on-site staff and investors, ensuring alignment with our high standards 
                        of care and service.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl h-80 flex items-center justify-center">
                      <div className="text-white/20 text-6xl font-bold">3</div>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          return <PageSectionRenderer key={section.id} section={section} />;
        })}
      </div>

      {/* Communities Section */}
      <section className="py-20 bg-white">
        <CommunitiesCarousel
          communities={communities || []}
          isLoading={isLoading}
          title="Communities We Manage"
          subtitle="Discover our expertly managed senior living communities"
        />
      </section>

    </div>
  );
}