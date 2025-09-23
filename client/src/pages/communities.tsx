import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, Phone, Info, Map, List } from "lucide-react";
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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/10 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6" data-testid="page-title">
              <span className="text-primary">Locally Owned</span>, Resident-Focused <span className="text-primary">Senior Living</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto" data-testid="page-description">
              Stage Senior provides exceptional assisted living, memory care, and independent living across Colorado. 
              We prioritize dignity, comfort, and joy for residents with personalized care plans since 2016.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-schedule-tour"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule a Tour
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                data-testid="button-call-hero"
              >
                <a href="tel:+1-303-555-0123">
                  <Phone className="w-5 h-5 mr-2" />
                  (303) 555-0123
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-card py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search Input */}
            <div className="lg:col-span-1">
              <label htmlFor="location-search" className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <div className="relative">
                <Input
                  id="location-search"
                  placeholder="City or ZIP code"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pr-10"
                  data-testid="input-location"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            {/* Care Type Filter */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Care Type</label>
              <div className="flex flex-wrap gap-2">
                {CARE_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    variant={selectedCareType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCareType(type.value)}
                    className={selectedCareType === type.value ? 
                      "bg-primary text-primary-foreground" : 
                      "hover:bg-primary hover:text-primary-foreground"
                    }
                    data-testid={`filter-${type.value}`}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="lg:col-span-1 flex items-end">
              <div className="flex bg-muted rounded-lg p-1 w-full">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setViewMode("list")}
                  data-testid="view-list"
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === "map" ? "secondary" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setViewMode("map")}
                  data-testid="view-map"
                >
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Communities List */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Results Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground" data-testid="results-count">
                {sortedCommunities.length} Communities Found
              </h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Sort by Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
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
                    <CommunityCard 
                      key={community.id} 
                      community={community}
                      isSelected={selectedCommunityId === community.id}
                      onSelect={() => setSelectedCommunityId(community.id)}
                    />
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
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Interactive Map */}
              {viewMode === "list" && (
                <Card>
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
              
              {/* Tour Request Form */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="tour-form-title">
                    Schedule a Tour Today
                  </h3>
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
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      data-testid="button-submit-tour"
                    >
                      Request Tour
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Contact Info */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="contact-title">
                    Need Help Choosing?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4" data-testid="contact-description">
                    Our Colorado senior living experts understand the urgency and importance of finding the right care. 
                    We'll help you navigate your options with transparent pricing and fast tour scheduling.
                  </p>
                  <Button 
                    asChild
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-call-expert"
                  >
                    <a href="tel:+1-303-555-0123">
                      <Phone className="w-4 h-4 mr-2" />
                      Call (303) 555-0123
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
