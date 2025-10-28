import { useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Phone, Star, HelpCircle, Check } from "lucide-react";
import CommunityCard from "@/components/CommunityCard";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load map component to reduce initial bundle size (~45 KiB savings)
const CommunityMap = lazy(() => import("@/components/CommunityMap"));
import { PageHero } from "@/components/PageHero";
import CommunitySelectionModal from "@/components/CommunitySelectionModal";
import TestimonialSection from "@/components/TestimonialSection";
import type { Community } from "@shared/schema";

const CARE_TYPES = [
  { value: "all", label: "All Communities" },
  { value: "assisted-living", label: "Assisted Living" },
  { value: "memory-care", label: "Memory Care" },
  { value: "independent-living", label: "Independent Living" },
];

export default function Communities() {
  const [selectedCareType, setSelectedCareType] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | undefined>();
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [, navigate] = useLocation();

  const { data: communities = [], isLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  const filteredCommunities = communities.filter((community) => {
    const matchesCareType = selectedCareType === "all" ||
      community.careTypes?.includes(selectedCareType);

    return matchesCareType;
  });

  const sortedCommunities = [...filteredCommunities].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.startingPrice || 0) - (b.startingPrice || 0);
      case "price-high":
        return (b.startingPrice || 0) - (a.startingPrice || 0);
      case "distance":
        return a.city.localeCompare(b.city);
      default:
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    }
  });

  const scrollToCommunity = (communityId: string) => {
    const element = document.getElementById(`community-card-${communityId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add a highlight effect
      element.classList.add("ring-4", "ring-primary", "ring-opacity-50");
      setTimeout(() => {
        element.classList.remove("ring-4", "ring-primary", "ring-opacity-50");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        pagePath="/communities"
        defaultTitle="Independent Living Tailored to You"
        defaultSubtitle="Explore our four Colorado communities where exceptional care meets the comfort of home."
        defaultBackgroundImage="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=2000&q=80"
        className="pb-40"
      />

      {/* Hero Actions & Map Overlap */}
      <section className="relative z-20 -mt-20 sm:-mt-24 lg:-mt-32 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[var(--deep-blue)] to-[var(--bright-blue)] text-white rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-6 sm:py-10 shadow-2xl flex flex-col items-center gap-4 sm:gap-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-6 text-base sm:text-lg bg-white text-[var(--deep-blue)] hover:bg-gray-100 shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowCommunityModal(true)}
                data-testid="button-get-help"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Get Help Choosing
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-transparent border-white text-white hover:bg-white hover:text-[var(--deep-blue)] backdrop-blur-sm"
                onClick={() => window.open('tel:+1-970-444-4689', '_self')}
                data-testid="button-quick-call"
              >
                <Phone className="w-5 h-5 mr-2" />
                <span className="sm:hidden">Call Now</span>
                <span className="hidden sm:inline">(970) 444-4689</span>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-white/90">
              <Badge className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">
                Since 2016
              </Badge>
              <Badge className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors">
                4 Communities
              </Badge>
            </div>
          </div>

          <Card className="mt-6 sm:mt-10 shadow-2xl overflow-hidden border-0 animate-slideUp">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white px-4 sm:px-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Explore Our Communities on the Map
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground">
                Click on any location to learn more about that community
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[350px] sm:h-[450px] lg:h-[500px] relative">
                {isLoading ? (
                  <div className="h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                      <p className="text-base sm:text-lg text-gray-600">Loading map...</p>
                    </div>
                  </div>
                ) : (
                  <Suspense fallback={
                    <div className="h-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                        <p className="text-base sm:text-lg text-gray-600">Loading map...</p>
                      </div>
                    </div>
                  }>
                    <CommunityMap
                      communities={sortedCommunities}
                      selectedCommunityId={selectedCommunityId}
                      onCommunitySelect={(community) => {
                        setSelectedCommunityId(community.id);
                        scrollToCommunity(community.id);
                      }}
                    />
                  </Suspense>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white py-4 sm:py-6 sticky top-0 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Care Type Filter */}
            <div className="flex flex-wrap gap-2">
              {CARE_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedCareType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCareType(type.value)}
                  className={`rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all ${
                    selectedCareType === type.value
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-primary/10"
                  }`}
                  data-testid={`filter-${type.value}`}
                >
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Sort Control */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40 rounded-full" data-testid="select-sort" aria-label="Sort communities">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Communities List */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <Skeleton className="w-full h-48 sm:h-64" />
                    </div>
                    <div className="md:col-span-3 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-16 w-full" />
                      <div className="flex gap-3">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 flex-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedCommunities.length > 0 ? (
          <div className="space-y-6">
            {sortedCommunities.map((community) => (
              <div
                key={community.id}
                id={`community-card-${community.id}`}
                className="transform transition-all hover:-translate-y-1 duration-300"
              >
                <CommunityCard
                  community={community}
                  isSelected={selectedCommunityId === community.id}
                  onSelect={() => setSelectedCommunityId(community.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground" data-testid="no-results">
                No communities found matching your criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* CTA Section with Contact */}
      <section id="contact-section" className="relative bg-gradient-to-br from-[var(--deep-blue)] to-[var(--bright-blue)] text-white py-16 sm:py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 animate-fadeIn">
            Ready to Find the Right Community?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 text-white/95 max-w-2xl mx-auto leading-relaxed">
            Our senior living advisors are here to help you every step of the way
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg bg-white text-[var(--deep-blue)] hover:bg-gray-100 shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold talkfurther-schedule-tour"
              onClick={() => setShowCommunityModal(true)}
              data-testid="button-schedule-tour-cta"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Tours
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-[var(--deep-blue)] transform hover:scale-105 transition-all duration-200 font-semibold"
              onClick={() => window.open('tel:+1-970-444-4689', '_self')}
              data-testid="button-call-cta"
            >
              <Phone className="w-5 h-5 mr-2" />
              <span className="sm:hidden">Call Now</span>
              <span className="hidden sm:inline">Call (970) 444-4689</span>
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-white/80 text-sm sm:text-base pt-8 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-white" />
              <span>Same-day tours available</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-white" />
              <span>No obligation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-white" />
              <span>Locally owned since 2016</span>
            </div>
          </div>
        </div>
      </section>

      {/* Community Selection Modal */}
      <CommunitySelectionModal 
        open={showCommunityModal}
        onOpenChange={setShowCommunityModal}
        communities={communities}
      />
    </div>
  );
}