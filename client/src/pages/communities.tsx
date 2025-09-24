import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, Phone, Info, Map, List, Star, Shield } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | undefined>();
  const [tourForm, setTourForm] = useState({
    name: "",
    phone: "",
    communityId: "",
    preferredDate: "",
  });

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
        // For now, just sort by city name
        return a.city.localeCompare(b.city);
      default:
        // Relevance: featured first, then by name
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    }
  });

  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tourRequest: InsertTourRequest = {
        name: tourForm.name,
        phone: tourForm.phone,
        communityId: tourForm.communityId || undefined,
        preferredDate: tourForm.preferredDate ? new Date(tourForm.preferredDate) : undefined,
      };

      await apiRequest("POST", "/api/tour-requests", tourRequest);
      
      toast({
        title: "Tour Request Submitted",
        description: "Thank you for your interest! We will contact you shortly to schedule your tour.",
      });

      setTourForm({
        name: "",
        phone: "",
        communityId: "",
        preferredDate: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit tour request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - More spacious */}
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
                <a href="tel:+1-303-555-0123">
                  <Phone className="w-5 h-5 mr-2" />
                  (303) 555-0123
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

      {/* Search and Filters - Better spacing */}
      <section className="bg-card/50 backdrop-blur py-6 sticky top-0 z-40 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Care Type Filter - Simplified */}
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
            
            {/* Sort and View Controls */}
            <div className="ml-auto flex items-center gap-3">
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
              
              <div className="flex bg-muted rounded-full p-1">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-full px-4"
                  onClick={() => setViewMode("list")}
                  data-testid="view-list"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-full px-4"
                  onClick={() => setViewMode("map")}
                  data-testid="view-map"
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - More spacious */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground" data-testid="results-count">
            {sortedCommunities.length} {sortedCommunities.length === 1 ? 'Community' : 'Communities'} Found
          </h2>
          <p className="text-muted-foreground mt-2">Discover the perfect senior living community for your loved one</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Communities List */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Communities */}
            {viewMode === "list" ? (
              isLoading ? (
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
                    <div key={community.id} className="transform transition-all hover:-translate-y-1">
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
              )
            ) : (
              // Map View
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="h-96 bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading map...</p>
                      </div>
                    </div>
                  ) : (
                    <CommunityMap 
                      communities={sortedCommunities}
                      selectedCommunityId={selectedCommunityId}
                      onCommunitySelect={(community) => {
                        setSelectedCommunityId(community.id);
                        setViewMode("list");
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar - More modern */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              
              {/* Interactive Map */}
              {viewMode === "list" && (
                <Card className="shadow-lg">
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="bg-gradient-to-br from-muted/50 to-muted h-96 relative flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-lg font-medium text-foreground">Loading Map...</p>
                        </div>
                      </div>
                    ) : (
                      <CommunityMap 
                        communities={sortedCommunities}
                        selectedCommunityId={selectedCommunityId}
                        onCommunitySelect={(community) => {
                          setSelectedCommunityId(community.id);
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Tour Request Form - Enhanced */}
              <Card className="shadow-lg bg-gradient-to-br from-card to-card/95">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Calendar className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-foreground mb-2" data-testid="tour-form-title">
                      Schedule Your Visit
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Experience our communities firsthand
                    </p>
                  </div>
                  <form onSubmit={handleTourSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="tour-name" className="block text-sm font-medium text-foreground mb-1">
                        Full Name
                      </label>
                      <Input
                        id="tour-name"
                        value={tourForm.name}
                        onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                        required
                        data-testid="input-tour-name"
                      />
                    </div>
                    <div>
                      <label htmlFor="tour-phone" className="block text-sm font-medium text-foreground mb-1">
                        Phone Number
                      </label>
                      <Input
                        id="tour-phone"
                        type="tel"
                        value={tourForm.phone}
                        onChange={(e) => setTourForm({ ...tourForm, phone: e.target.value })}
                        required
                        data-testid="input-tour-phone"
                      />
                    </div>
                    <div>
                      <label htmlFor="tour-community" className="block text-sm font-medium text-foreground mb-1">
                        Preferred Community
                      </label>
                      <Select 
                        value={tourForm.communityId} 
                        onValueChange={(value) => setTourForm({ ...tourForm, communityId: value })}
                      >
                        <SelectTrigger data-testid="select-tour-community">
                          <SelectValue placeholder="Select a community" />
                        </SelectTrigger>
                        <SelectContent>
                          {communities.map((community) => (
                            <SelectItem key={community.id} value={community.id}>
                              {community.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="tour-date" className="block text-sm font-medium text-foreground mb-1">
                        Preferred Date
                      </label>
                      <Input
                        id="tour-date"
                        type="date"
                        value={tourForm.preferredDate}
                        onChange={(e) => setTourForm({ ...tourForm, preferredDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        data-testid="input-tour-date"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
                      data-testid="button-submit-tour"
                    >
                      Request Your Tour
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Contact Info - Enhanced */}
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center mb-4">
                    <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-foreground mb-2" data-testid="contact-title">
                      Expert Guidance
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed" data-testid="contact-description">
                    Our Colorado senior living experts understand the urgency and importance of finding the right care. 
                    We'll help you navigate your options with transparent pricing and fast tour scheduling.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      asChild
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6"
                      data-testid="button-call-expert"
                    >
                      <a href="tel:+1-303-555-0123">
                        <Phone className="w-4 h-4 mr-2" />
                        Call (303) 555-0123
                      </a>
                    </Button>
                    <div className="text-center text-xs text-muted-foreground">
                      Mon-Fri 8am-6pm, Sat 9am-4pm
                    </div>
                  </div>
                </CardContent>
              </Card>
              
            </div>
          </div>
          
        </div>
      </main>

      {/* Testimonials Section - New */}
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
            {/* Testimonial Card 1 */}
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
            
            {/* Testimonial Card 2 */}
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
            
            {/* Testimonial Card 3 */}
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
          
          <div className="text-center mt-12">
            <Button size="lg" className="px-8 py-6 text-lg">
              Read More Reviews
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
