import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, Phone, Info, Map, List, Star, Shield, ChevronDown } from "lucide-react";
import CommunityCard from "@/components/CommunityCard";
import CommunityMap from "@/components/CommunityMap";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Community, InsertTourRequest } from "@shared/schema";

const CARE_TYPES = [
  { value: "all", label: "All Communities" },
  { value: "assisted-living", label: "Assisted Living" },
  { value: "memory-care", label: "Memory Care" },
  { value: "independent-living", label: "Independent Living" },
];

export default function Communities() {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCareType, setSelectedCareType] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | undefined>();
  const [showMap, setShowMap] = useState(true);

  const { toast } = useToast();

  const { data: communities = [], isLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  const filteredCommunities = communities.filter((community) => {
    const matchesLocation = !searchLocation || 
      community.city.toLowerCase().includes(searchLocation.toLowerCase()) ||
      community.zipCode?.includes(searchLocation);
    
    const matchesCareType = selectedCareType === "all" || 
      community.careTypes?.includes(selectedCareType);

    return matchesLocation && matchesCareType;
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
      <section className="bg-gradient-to-br from-background to-primary/5 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" data-testid="page-title">
                <span className="block text-foreground">Independent Living</span>
                <span className="block text-primary mt-2">Tailored to You</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="page-description">
                Explore our four Colorado communities where exceptional care meets the comfort of home. 
                With personalized support and vibrant community life, your loved ones will thrive.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-card rounded-full shadow-lg p-2 flex items-center">
                <div className="flex-1 flex items-center px-4">
                  <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
                  <input
                    type="text"
                    placeholder="Search by city or ZIP code..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                    data-testid="input-hero-search"
                  />
                </div>
                <Button 
                  size="lg" 
                  className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-hero-search"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-lg hover:shadow-xl transition-all"
                data-testid="button-schedule-tour"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Your Visit
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-lg rounded-lg"
                asChild
                data-testid="button-call-hero"
              >
                <a href="tel:+1-303-436-2300">
                  <Phone className="w-5 h-5 mr-2" />
                  (303) 436-2300
                </a>
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="secondary" className="px-3 py-1">Since 2016</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="secondary" className="px-3 py-1">4 Communities</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="secondary" className="px-3 py-1">98% Satisfaction</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Map Section */}
      <section className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Explore Our Communities on the Map</h2>
            <p className="text-lg text-gray-600">
              Click on any location to learn more about that community
            </p>
          </div>
          
          {/* Full Width Map */}
          <Card className="shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[500px] relative">
                {isLoading ? (
                  <div className="h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                      <p className="text-lg text-gray-600">Loading map...</p>
                    </div>
                  </div>
                ) : (
                  <CommunityMap 
                    communities={sortedCommunities}
                    selectedCommunityId={selectedCommunityId}
                    onCommunitySelect={(community) => {
                      setSelectedCommunityId(community.id);
                      scrollToCommunity(community.id);
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Toggle Map Visibility Button */}
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowMap(!showMap)}
              className="gap-2"
              data-testid="button-toggle-map"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showMap ? 'rotate-180' : ''}`} />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white py-6 sticky top-0 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Care Type Filter */}
            <div className="flex flex-wrap gap-2">
              {CARE_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedCareType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCareType(type.value)}
                  className={`rounded-full px-4 py-2 transition-all ${
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
              <SelectTrigger className="w-40 rounded-full" data-testid="select-sort">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground" data-testid="results-count">
            {sortedCommunities.length} {sortedCommunities.length === 1 ? 'Community' : 'Communities'} Found
          </h2>
          <p className="text-muted-foreground mt-2">Discover the perfect senior living community for your loved one</p>
        </div>
        
        {/* Communities List */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <Skeleton className="w-full h-64" />
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
      <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Families Choose Stage Senior
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear directly from families who've found peace of mind with our communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial Cards */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "The staff at Golden Pond has been amazing with my mother. She's happier and more active than she's been in years. The community activities and personalized care have truly made a difference."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Daughter of Resident</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "Moving my father to The Gardens on Quail was the best decision. The memory care program is exceptional, and the staff treats him with such dignity and respect. I finally have peace of mind."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">Michael Chen</p>
                  <p className="text-sm text-muted-foreground">Son of Resident</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "The Gardens at Columbine feels like a real home, not an institution. My mom loves the garden spaces and has made wonderful friends. The locally-owned aspect really shows in their attention to detail."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">Emily Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Daughter of Resident</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find the Right Community?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our senior living advisors are here to help you every step of the way
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6"
              data-testid="button-schedule-tour-cta"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Tours
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-primary text-lg px-8 py-6"
              asChild
              data-testid="button-call-cta"
            >
              <a href="tel:+1-303-436-2300">
                <Phone className="w-5 h-5 mr-2" />
                Call (303) 436-2300
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}