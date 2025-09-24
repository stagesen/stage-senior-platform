import { useQuery } from "@tanstack/react-query";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Faq } from "@shared/schema";

export default function FAQs() {
  const { data: faqs = [], isLoading } = useQuery<Faq[]>({
    queryKey: ['/api/faqs']
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Group FAQs by category
  const categories = faqs.reduce((acc, faq) => {
    const category = faq.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, Faq[]>);

  // Sort FAQs within each category
  Object.keys(categories).forEach(category => {
    categories[category].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4" data-testid="page-title">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Find answers to common questions about our senior living communities.
        </p>

        {Object.keys(categories).length === 1 ? (
          // If only one category, show as simple accordion
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.id} value={faq.id} data-testid={`faq-item-${index}`}>
                    <AccordionTrigger className="text-left" data-testid={`faq-question-${index}`}>
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent data-testid={`faq-answer-${index}`}>
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
          // If multiple categories, show with tabs
          <Tabs defaultValue={Object.keys(categories)[0]} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(categories).length}, 1fr)` }}>
              {Object.keys(categories).map((category) => (
                <TabsTrigger key={category} value={category} data-testid={`tab-${category.toLowerCase()}`}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(categories).map(([category, categoryFaqs]) => (
              <TabsContent key={category} value={category}>
                <Card>
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible className="w-full">
                      {categoryFaqs.map((faq, index) => (
                        <AccordionItem key={faq.id} value={faq.id} data-testid={`faq-item-${category.toLowerCase()}-${index}`}>
                          <AccordionTrigger className="text-left" data-testid={`faq-question-${category.toLowerCase()}-${index}`}>
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent data-testid={`faq-answer-${category.toLowerCase()}-${index}`}>
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
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}