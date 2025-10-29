import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import TestimonialSection from "@/components/TestimonialSection";
import EmphasizedHeading from "@/components/EmphasizedHeading";
import type { PageContentSection } from "@shared/schema";

export default function WhyStageSenior() {
  useEffect(() => {
    document.title = "Why Families Choose Stage Senior | Trusted Senior Living";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover why families choose Stage Senior for their loved ones. Read real stories, explore our values, and learn what makes our Colorado senior living communities exceptional.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover why families choose Stage Senior for their loved ones. Read real stories, explore our values, and learn what makes our Colorado senior living communities exceptional.';
      document.head.appendChild(meta);
    }
  }, []);

  const { data: allSections = [], isLoading } = useQuery<PageContentSection[]>({
    queryKey: ["/api/page-content"],
  });

  const pageSections = allSections
    .filter((section) => section.pagePath === "/why-stage-senior" && section.active)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        pagePath="/why-stage-senior"
        defaultTitle="Why Families Choose Stage Senior"
        defaultSubtitle="Experience the difference that compassionate, personalized care makes"
      />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {pageSections.map((section) => (
            <PageSectionRenderer key={section.id} section={section} />
          ))}
        </>
      )}

      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <EmphasizedHeading
              splitText={{
                primary: "Hear From",
                accent: "Our Families"
              }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              accentClassName="text-primary font-extrabold"
              data-testid="testimonials-title"
            />
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="testimonials-subtitle">
              Real stories from families who have chosen Stage Senior communities for their loved ones
            </p>
          </div>
          <TestimonialSection />
        </div>
      </section>
    </div>
  );
}
