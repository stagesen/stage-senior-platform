import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FloorPlanModal from "@/components/FloorPlanModal";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { getPrimaryPhoneDisplay, getPrimaryPhoneHref, getCityState } from "@/lib/communityContact";
import { Link } from "wouter";
import { BedDouble, Bath, Square, MapPin, ArrowRight, Home } from "lucide-react";
import type { Community, FloorPlan } from "@shared/schema";

export default function VirtualTours() {
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  useEffect(() => {
    document.title = "Virtual Tours & Floor Plans | Explore Stage Senior Communities";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore our senior living communities virtually. View detailed floor plans, photos, and layouts for independent living, assisted living, and memory care apartments.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Explore our senior living communities virtually. View detailed floor plans, photos, and layouts for independent living, assisted living, and memory care apartments.';
      document.head.appendChild(meta);
    }
  }, []);

  const { data: communities = [], isLoading: communitiesLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities", { active: true }],
    queryFn: async () => {
      const response = await fetch("/api/communities?active=true");
      if (!response.ok) throw new Error("Failed to fetch communities");
      return response.json();
    },
  });

  const { data: allFloorPlans = [], isLoading: floorPlansLoading } = useQuery<FloorPlan[]>({
    queryKey: ["/api/floor-plans"],
  });

  const handleFloorPlanClick = (floorPlan: FloorPlan, community: Community) => {
    setSelectedFloorPlan(floorPlan);
    setSelectedCommunity(community);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        pagePath="/virtual-tour-and-floorplans"
        defaultTitle="Explore Our Communities"
        defaultSubtitle="Virtual tours and detailed floor plans"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {communitiesLoading || floorPlansLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue={communities[0]?.id} className="w-full" data-testid="communities-tabs">
            <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: `repeat(${communities.length}, minmax(0, 1fr))` }}>
              {communities.map((community) => (
                <TabsTrigger 
                  key={community.id} 
                  value={community.id}
                  data-testid={`tab-${community.slug}`}
                >
                  {community.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {communities.map((community) => {
              const communityFloorPlans = allFloorPlans.filter(
                fp => fp.communityId === community.id && fp.active
              ).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

              return (
                <TabsContent key={community.id} value={community.id} data-testid={`content-${community.slug}`}>
                  <CommunitySection
                    community={community}
                    floorPlans={communityFloorPlans}
                    onFloorPlanClick={handleFloorPlanClick}
                  />
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>

      {selectedFloorPlan && selectedCommunity && (
        <FloorPlanModal
          floorPlan={selectedFloorPlan}
          communityName={selectedCommunity.name}
          communityId={selectedCommunity.id}
          communitySlug={selectedCommunity.slug}
          isOpen={!!selectedFloorPlan}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedFloorPlan(null);
              setSelectedCommunity(null);
            }
          }}
        />
      )}
    </div>
  );
}

interface CommunitySectionProps {
  community: Community;
  floorPlans: FloorPlan[];
  onFloorPlanClick: (floorPlan: FloorPlan, community: Community) => void;
}

function CommunitySection({ community, floorPlans, onFloorPlanClick }: CommunitySectionProps) {
  const heroImageUrl = useResolveImageUrl(community.imageId || community.heroImageUrl);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden" data-testid={`community-card-${community.slug}`}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video md:aspect-auto">
            {heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt={community.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Home className="w-16 h-16 text-primary/30" />
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">{community.name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span>{getCityState(community)}</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {community.description || community.overview || "Explore our beautiful community and find the perfect living space for your needs."}
            </p>
            <div className="flex gap-4">
              <Button asChild data-testid={`button-view-community-${community.slug}`}>
                <Link href={`/communities/${community.slug}`}>
                  View Full Community
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              {community.phoneDisplay && (
                <Button variant="outline" asChild data-testid={`button-call-${community.slug}`}>
                  <a href={getPrimaryPhoneHref(community)}>
                    Call {getPrimaryPhoneDisplay(community)}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {floorPlans.length > 0 ? (
        <>
          <h3 className="text-2xl font-bold text-foreground mb-6">Available Floor Plans</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid={`floor-plans-grid-${community.slug}`}>
            {floorPlans.map((floorPlan) => (
              <FloorPlanCard
                key={floorPlan.id}
                floorPlan={floorPlan}
                onClick={() => onFloorPlanClick(floorPlan, community)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <p className="text-lg text-muted-foreground">
            Floor plans coming soon. Contact us for more information.
          </p>
        </div>
      )}
    </div>
  );
}

interface FloorPlanCardProps {
  floorPlan: FloorPlan;
  onClick: () => void;
}

function FloorPlanCard({ floorPlan, onClick }: FloorPlanCardProps) {
  const imageUrl = useResolveImageUrl(floorPlan.imageId || floorPlan.imageUrl);

  const getAvailabilityBadge = (availability: string | null) => {
    const variant = availability === 'available' ? 'default' : 
                    availability === 'limited' ? 'secondary' : 'outline';
    return availability ? (
      <Badge variant={variant} className="capitalize">
        {availability}
      </Badge>
    ) : null;
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
      data-testid={`floor-plan-card-${floorPlan.id}`}
    >
      <div className="aspect-video overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={floorPlan.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <Home className="w-12 h-12 text-primary/30" />
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-xl">{floorPlan.name}</CardTitle>
          {getAvailabilityBadge(floorPlan.availability)}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4" />
            <span>{floorPlan.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{floorPlan.bathrooms} Bath</span>
          </div>
          {floorPlan.squareFeet && (
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{floorPlan.squareFeet} sq ft</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {floorPlan.startingPrice && (
          <p className="text-lg font-bold text-primary mb-2">
            Starting at ${floorPlan.startingPrice.toLocaleString()}/mo
          </p>
        )}
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          View Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
