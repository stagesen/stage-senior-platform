import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Building2, Home, HelpCircle } from "lucide-react";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import type { Faq, Community } from "@shared/schema";

export default function FAQs() {
  const [selectedFilter, setSelectedFilter] = useState<string>("stage-senior");
  const [searchQuery, setSearchQuery] = useState("");
  const { openScheduleTour } = useScheduleTour();

  const { data: faqs = [], isLoading: isLoadingFaqs } = useQuery<Faq[]>({
    queryKey: ['/api/faqs']
  });

  const { data: communities = [], isLoading: isLoadingCommunities } = useQuery<Community[]>({
    queryKey: ['/api/communities']
  });

  const isLoading = isLoadingFaqs || isLoadingCommunities;

  // Filter and search FAQs
  const filteredFaqs = useMemo(() => {
    let filtered = faqs;

    // Filter by community/service
    if (selectedFilter === "stage-senior") {
      // Show Stage Senior FAQs (communityId = null and category != "Healthy at Home")
      filtered = filtered.filter(faq =>
        (!faq.communityId || faq.communityId === null) && faq.category !== "Healthy at Home"
      );
    } else if (selectedFilter === "healthy-at-home") {
      // Show Healthy at Home FAQs (category = "Healthy at Home")
      filtered = filtered.filter(faq => faq.category === "Healthy at Home");
    } else {
      // Filter by specific community
      filtered = filtered.filter(faq => faq.communityId === selectedFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer?.toLowerCase().includes(query) ||
        faq.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [faqs, selectedFilter, searchQuery]);

  // Group FAQs by category
  const categorizedFaqs = useMemo(() => {
    const grouped = filteredFaqs.reduce((acc, faq) => {
      const category = faq.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(faq);
      return acc;
    }, {} as Record<string, Faq[]>);

    // Sort FAQs within each category
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    });

    return grouped;
  }, [filteredFaqs]);

  const categories = Object.keys(categorizedFaqs).sort();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-gray-900" data-testid="page-title">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our senior living communities and services.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mb-12">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Filter by:</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedFilter === "stage-senior" ? "default" : "outline"}
                onClick={() => setSelectedFilter("stage-senior")}
                className="rounded-full px-6"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Stage Senior
              </Button>
              <Button
                variant={selectedFilter === "healthy-at-home" ? "default" : "outline"}
                onClick={() => setSelectedFilter("healthy-at-home")}
                className="rounded-full px-6"
              >
                <Home className="w-4 h-4 mr-2" />
                Healthy at Home
              </Button>
              {communities.map((community) => (
                <Button
                  key={community.id}
                  variant={selectedFilter === community.id ? "default" : "outline"}
                  onClick={() => setSelectedFilter(community.id)}
                  className="rounded-full px-6"
                >
                  {community.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <strong>{filteredFaqs.length}</strong> {filteredFaqs.length === 1 ? 'question' : 'questions'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* FAQ Content */}
          {filteredFaqs.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No FAQs found</h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? "Try adjusting your search terms or filters."
                    : "No FAQs available for the selected filter."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category}>
                  <div className="mb-4">
                    <Badge variant="secondary" className="text-sm px-4 py-2">
                      {category}
                    </Badge>
                  </div>
                  <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <Accordion type="single" collapsible className="w-full">
                        {categorizedFaqs[category].map((faq, index) => (
                          <AccordionItem
                            key={faq.id}
                            value={faq.id}
                            data-testid={`faq-item-${index}`}
                            className="border-b-gray-200 last:border-0"
                          >
                            <AccordionTrigger
                              className="text-left hover:text-blue-600 transition-colors py-4"
                              data-testid={`faq-question-${index}`}
                            >
                              <span className="text-lg font-medium pr-4">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent
                              data-testid={`faq-answer-${index}`}
                              className="text-gray-700 leading-relaxed pb-4"
                            >
                              {faq.answerHtml ? (
                                <div
                                  className="prose prose-blue max-w-none"
                                  dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                                />
                              ) : (
                                <p>{faq.answer}</p>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* Contact CTA */}
          <Card className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
              <p className="text-blue-50 mb-6">
                We're here to help. Schedule a tour or speak with one of our senior living experts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                  onClick={() => openScheduleTour({
                    title: "Schedule a Tour",
                    description: "Visit one of our Colorado communities and get answers to your questions."
                  })}
                >
                  Schedule a Tour
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}