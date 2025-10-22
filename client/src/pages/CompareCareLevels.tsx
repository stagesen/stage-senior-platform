import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import CareComparisonTool from "@/components/landing-sections/CareComparisonTool";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import type { Faq, PageContentSection } from "@shared/schema";

export default function CompareCareLevels() {
  useEffect(() => {
    document.title = "Understanding Senior Care Levels | Compare Care Options | Stage Senior";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Compare independent living, assisted living, and memory care options. Understand which level of care is right for your loved one with detailed comparisons and FAQs.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Compare independent living, assisted living, and memory care options. Understand which level of care is right for your loved one with detailed comparisons and FAQs.';
      document.head.appendChild(meta);
    }
  }, []);

  const { data: faqs = [], isLoading: faqsLoading } = useQuery<Faq[]>({
    queryKey: ["/api/faqs"],
  });

  // Filter FAQs related to care levels
  const careLevelFaqs = faqs.filter(faq => 
    faq.active && 
    (faq.category?.toLowerCase().includes('care') || 
     faq.question.toLowerCase().includes('care level') ||
     faq.question.toLowerCase().includes('assisted living') ||
     faq.question.toLowerCase().includes('memory care') ||
     faq.question.toLowerCase().includes('independent living'))
  ).sort((a, b) => (a.sortOrder || a.sort || 0) - (b.sortOrder || b.sort || 0));

  // Create a mock section for the CareComparisonTool
  const comparisonSection: PageContentSection = {
    id: "care-comparison",
    pagePath: "/compare-care-levels",
    sectionKey: "care-comparison",
    sectionType: "care_comparison",
    title: "Compare Care Levels",
    subtitle: "Find the right level of care for your loved one",
    content: {},
    sortOrder: 0,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        pagePath="/compare-care-levels"
        defaultTitle="Understanding Senior Care Levels"
        defaultSubtitle="Compare options to find the perfect fit for your loved one"
      />

      <CareComparisonTool section={comparisonSection} />

      <section className="py-20 bg-white" data-testid="faq-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="faq-title">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="faq-subtitle">
              Get answers to common questions about care levels
            </p>
          </div>

          {faqsLoading ? (
            <div className="flex items-center justify-center min-h-[30vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : careLevelFaqs.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {careLevelFaqs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`faq-${index}`} data-testid={`faq-item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold" data-testid={`faq-question-${index}`}>
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${index}`}>
                        {faq.answerHtml ? (
                          <div dangerouslySetInnerHTML={{ __html: faq.answerHtml }} />
                        ) : (
                          <p>{faq.answer}</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No FAQs available at this time.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
