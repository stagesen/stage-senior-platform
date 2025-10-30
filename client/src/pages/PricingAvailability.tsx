import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import PricingRangeEstimator from "@/components/landing-sections/PricingRangeEstimator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "wouter";
import { MapPin, Phone, CheckCircle, Clock, Home } from "lucide-react";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getPrimaryPhoneHref, getCityState } from "@/lib/communityContact";
import type { Community, FloorPlan, PageContentSection } from "@shared/schema";

export default function PricingAvailability() {
  const { openScheduleTour } = useScheduleTour();
  const { companyPhoneDisplay, companyPhoneDial } = useSiteSettings();

  useEffect(() => {
    document.title = "Transparent Pricing & Current Availability | Stage Senior";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'View current pricing and availability for Stage Senior communities. Get transparent pricing ranges by care level and see real-time apartment availability.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'View current pricing and availability for Stage Senior communities. Get transparent pricing ranges by care level and see real-time apartment availability.';
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

  const { data: allFloorPlans = [] } = useQuery<FloorPlan[]>({
    queryKey: ["/api/floor-plans"],
  });

  const pricingSection: PageContentSection = {
    id: "pricing-estimator",
    pagePath: "/pricing-and-availability",
    sectionKey: "pricing-estimator",
    sectionType: "pricing_estimator",
    title: "Estimate Your Monthly Cost",
    subtitle: "Adjust the options below to see an estimated monthly cost",
    content: {},
    sortOrder: 0,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const communitiesWithPricing = communities.filter(c => c.startingPrice || c.startingRateDisplay);

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        pagePath="/pricing-and-availability"
        defaultTitle="Transparent Pricing & Current Availability"
        defaultSubtitle="Clear pricing information to help you plan"
      />

      <PricingRangeEstimator section={pricingSection} />

      <section className="py-20 bg-white" data-testid="pricing-by-community">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="pricing-title">
              Pricing by Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="pricing-subtitle">
              Compare starting prices across our communities
            </p>
          </div>

          {communitiesLoading ? (
            <div className="flex items-center justify-center min-h-[30vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="communities-pricing-grid">
              {communitiesWithPricing.map((community) => (
                <CommunityPricingCard 
                  key={community.id} 
                  community={community}
                  floorPlans={allFloorPlans.filter(fp => fp.communityId === community.id && fp.active)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50" data-testid="availability-table">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="availability-title">
              Current Availability
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="availability-subtitle">
              See what's available now at our communities
            </p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Community</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Available Units</TableHead>
                      <TableHead>Starting From</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {communities.map((community) => {
                      const availableFloorPlans = allFloorPlans.filter(
                        fp => fp.communityId === community.id && 
                              fp.active && 
                              fp.availability === 'available'
                      );
                      const limitedFloorPlans = allFloorPlans.filter(
                        fp => fp.communityId === community.id && 
                              fp.active && 
                              fp.availability === 'limited'
                      );

                      return (
                        <TableRow key={community.id} data-testid={`availability-row-${community.slug}`}>
                          <TableCell className="font-semibold">{community.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {community.city}, {community.state}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {availableFloorPlans.length > 0 && (
                                <Badge variant="default" className="w-fit">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {availableFloorPlans.length} Available
                                </Badge>
                              )}
                              {limitedFloorPlans.length > 0 && (
                                <Badge variant="secondary" className="w-fit">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {limitedFloorPlans.length} Limited
                                </Badge>
                              )}
                              {availableFloorPlans.length === 0 && limitedFloorPlans.length === 0 && (
                                <span className="text-sm text-muted-foreground">Contact for availability</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {community.startingPrice ? (
                              <span className="font-semibold text-primary">
                                ${community.startingPrice.toLocaleString()}/mo
                              </span>
                            ) : community.startingRateDisplay ? (
                              <span className="font-semibold text-primary">
                                {community.startingRateDisplay}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">Contact for pricing</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline" asChild data-testid={`button-view-${community.slug}`}>
                                <Link href={`/communities/${community.slug}`}>
                                  View
                                </Link>
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => openScheduleTour({ communityId: community.id })}
                                data-testid={`button-tour-${community.slug}`}
                              >
                                Schedule Tour
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Have Questions About Pricing?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Our team is here to help you understand all your options and find the best fit for your budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => openScheduleTour()}
              data-testid="button-schedule-tour"
            >
              Schedule a Tour
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
              data-testid="button-call"
            >
              <a href={`tel:${companyPhoneDial}`}>
                <Phone className="w-5 h-5 mr-2" />
                Call {companyPhoneDisplay}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

interface CommunityPricingCardProps {
  community: Community;
  floorPlans: FloorPlan[];
}

function CommunityPricingCard({ community, floorPlans }: CommunityPricingCardProps) {
  const imageUrl = useResolveImageUrl(community.imageId || community.heroImageUrl);
  
  const availableCount = floorPlans.filter(fp => fp.availability === 'available').length;
  const lowestPrice = floorPlans.reduce((min, fp) => {
    if (!fp.startingPrice) return min;
    return min === null || fp.startingPrice < min ? fp.startingPrice : min;
  }, null as number | null);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`pricing-card-${community.slug}`}>
      <div className="aspect-video overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={community.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Home className="w-12 h-12 text-primary/30" />
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <span>{community.name}</span>
          {availableCount > 0 && (
            <Badge variant="default" className="ml-2">
              {availableCount} Available
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {getCityState(community)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          {lowestPrice || community.startingPrice ? (
            <p className="text-2xl font-bold text-primary">
              Starting at ${(lowestPrice || community.startingPrice)!.toLocaleString()}/mo
            </p>
          ) : community.startingRateDisplay ? (
            <p className="text-2xl font-bold text-primary">
              {community.startingRateDisplay}
            </p>
          ) : (
            <p className="text-lg text-muted-foreground">Contact for pricing</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" asChild data-testid={`button-details-${community.slug}`}>
            <Link href={`/communities/${community.slug}`}>
              View Details
            </Link>
          </Button>
          {community.phoneDisplay && (
            <Button variant="outline" size="icon" asChild data-testid={`button-phone-${community.slug}`}>
              <a href={getPrimaryPhoneHref(community)}>
                <Phone className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
