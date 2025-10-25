import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  CarouselProgressBar,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  MapPin,
  Calendar,
  ArrowRight,
  Home,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { getCityState } from "@/lib/communityContact";
import type { Community } from "@shared/schema";

interface CarouselCommunityCardProps {
  community: Community;
  index: number;
  selectedIndex: number;
  onScheduleTour: (community: Community) => void;
}

const CarouselCommunityCard = ({ 
  community, 
  index, 
  selectedIndex, 
  onScheduleTour 
}: CarouselCommunityCardProps) => {
  const resolvedHeroUrl = useResolveImageUrl(community.heroImageUrl);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl transition-all duration-500 ease-out ${
        selectedIndex === index 
          ? 'scale-105 opacity-100' 
          : 'scale-100 opacity-95 hover:scale-102 hover:opacity-100'
      }`}
    >
      <Card className="border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
        <div className="relative h-64 overflow-hidden rounded-t-xl">
          {resolvedHeroUrl ? (
            <img 
              src={resolvedHeroUrl} 
              alt={community.name}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              data-testid={`carousel-image-${community.id}`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Home className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* Subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Location badge */}
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-gray-700" data-testid={`carousel-location-${community.id}`}>
                {getCityState(community)}
              </span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          {/* Community name and description */}
          <div className="space-y-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1" data-testid={`carousel-name-${community.id}`}>
              {community.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3 min-h-[3rem]" data-testid={`carousel-description-${community.id}`}>
              {community.shortDescription || community.description || 'Experience exceptional senior living in a warm, welcoming community designed for your comfort and care.'}
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="space-y-2">
            <Button 
              variant="default"
              className={`w-full talkfurther-schedule-tour ${community.slug ? `community-${community.slug}` : ''}`}
              onClick={() => onScheduleTour(community)}
              data-community-id={community.id}
              data-community-slug={community.slug}
              data-community-name={community.name}
              data-testid={`carousel-button-schedule-${community.id}`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Tour
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              asChild
              data-testid={`carousel-button-learn-${community.id}`}
            >
              <Link href={`/communities/${community.slug}`}>
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface SkeletonCardProps {}

const SkeletonCard = ({}: SkeletonCardProps) => (
  <Card className="border border-gray-200 h-full">
    <Skeleton className="h-64 w-full rounded-t-xl" />
    <CardContent className="p-6">
      <div className="space-y-3 mb-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </CardContent>
  </Card>
);

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = "No communities available at this time." }: EmptyStateProps) => (
  <div className="text-center py-12">
    <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <Home className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Communities Found</h3>
    <p className="text-gray-600 mb-6 max-w-sm mx-auto">{message}</p>
    <Button asChild variant="default" data-testid="carousel-empty-browse">
      <Link href="/communities">
        Browse All Communities
        <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </Button>
  </div>
);

export interface CommunitiesCarouselProps {
  communities: Community[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
  emptyMessage?: string;
  showHeader?: boolean;
}

export default function CommunitiesCarousel({
  communities,
  isLoading = false,
  title = "Explore Our Communities",
  subtitle = "Discover the perfect community for your loved ones",
  className = "",
  emptyMessage,
  showHeader = true
}: CommunitiesCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateSelectedIndex = () => {
      setSelectedIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", updateSelectedIndex);
    updateSelectedIndex();

    return () => {
      carouselApi.off("select", updateSelectedIndex);
    };
  }, [carouselApi]);

  const handleScheduleTour = (community: Community) => {
    setSelectedCommunity(community);
    setShowLeadCapture(true);
  };

  const handleLeadCaptureSuccess = () => {
    setShowLeadCapture(false);
    setSelectedCommunity(null);
  };

  return (
    <div className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {showHeader && (
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {/* Content */}
        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : communities.length === 0 ? (
          // Empty state
          <EmptyState message={emptyMessage} />
        ) : communities.length === 1 ? (
          // Single community - no carousel needed
          <div className="max-w-md mx-auto">
            <CarouselCommunityCard
              community={communities[0]}
              index={0}
              selectedIndex={0}
              onScheduleTour={handleScheduleTour}
            />
          </div>
        ) : (
          // Carousel for multiple communities
          <div className="relative">
            <Carousel
              opts={{
                loop: true,
                align: "start",
              }}
              setApi={setCarouselApi}
              className="w-full"
              data-testid="communities-carousel"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {communities.map((community, index) => (
                  <CarouselItem 
                    key={community.id} 
                    className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                    data-testid={`carousel-item-${community.id}`}
                  >
                    <CarouselCommunityCard
                      community={community}
                      index={index}
                      selectedIndex={selectedIndex}
                      onScheduleTour={handleScheduleTour}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Navigation arrows - hidden on mobile for better UX */}
              <CarouselPrevious 
                className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 h-10 w-10 bg-white hover:bg-gray-50 text-gray-700 shadow-lg border-gray-200"
                aria-label="Previous community"
                data-testid="carousel-previous"
              />
              <CarouselNext 
                className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10 bg-white hover:bg-gray-50 text-gray-700 shadow-lg border-gray-200"
                aria-label="Next community"
                data-testid="carousel-next"
              />
              
              {/* Progress indicators */}
              <div className="flex flex-col items-center gap-4 mt-8">
                {/* Dot indicators */}
                <CarouselDots
                  count={communities.length}
                  current={selectedIndex}
                  className="flex items-center justify-center gap-2"
                  data-testid="carousel-dots"
                />
                
                {/* Progress bar */}
                <CarouselProgressBar
                  current={selectedIndex}
                  total={communities.length}
                  className="w-64 max-w-full h-1"
                  data-testid="carousel-progress"
                />
                
                {/* Position indicator */}
                <div className="text-gray-600 text-sm font-medium" data-testid="carousel-position">
                  {selectedIndex + 1} of {communities.length} communities
                </div>
              </div>
            </Carousel>
          </div>
        )}
      </div>

      {/* Lead Capture Modal */}
      <Dialog open={showLeadCapture} onOpenChange={setShowLeadCapture}>
        <DialogContent className="max-w-md">
          {selectedCommunity && (
            <LeadCaptureForm
              variant="modal"
              title="Schedule Your Tour"
              description={`Get a personalized tour of ${selectedCommunity.name}`}
              communityId={selectedCommunity.id}
              communityName={selectedCommunity.name}
              urgencyText="📞 Same-day tours available"
              onSuccess={handleLeadCaptureSuccess}
              className="border-0 shadow-none bg-transparent"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}