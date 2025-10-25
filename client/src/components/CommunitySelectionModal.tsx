import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPrimaryPhoneDisplay, getCityState } from "@/lib/communityContact";
import type { Community, CommunityCard } from "@shared/schema";
import { useScheduleTour } from "@/hooks/useScheduleTour";

interface CommunitySelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communities: (Community | CommunityCard)[];
  onSelectCommunity?: (community: Community | CommunityCard) => void;
}

export default function CommunitySelectionModal({
  open,
  onOpenChange,
  communities,
  onSelectCommunity,
}: CommunitySelectionModalProps) {
  const { openScheduleTour } = useScheduleTour();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto" data-testid="community-selection-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Select a Community to Schedule Your Tour
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose from our beautiful communities across Colorado. Each offers exceptional care and amenities.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 sm:grid-cols-2">
          {communities.map((community) => (
            <Card
              key={community.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
              data-testid={`community-selection-card-${community.slug}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-start justify-between">
                  <span
                    className="text-lg font-semibold"
                    data-testid={`community-name-${community.slug}`}
                  >
                    {community.name}
                  </span>
                </CardTitle>
                <div
                  className="flex items-center text-sm text-muted-foreground mt-1"
                  data-testid={`community-location-${community.slug}`}
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  {getCityState(community)}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {'shortDescription' in community && community.shortDescription && (
                  <p
                    className="text-sm text-muted-foreground mb-4 line-clamp-2"
                    data-testid={`community-description-${community.slug}`}
                  >
                    {community.shortDescription}
                  </p>
                )}
                
                {'phoneDisplay' in community && community.phoneDisplay && (
                  <p
                    className="text-sm text-muted-foreground mb-4"
                    data-testid={`community-phone-${community.slug}`}
                  >
                    Call: {getPrimaryPhoneDisplay(community)}
                  </p>
                )}
                
                <Button
                  className={`w-full talkfurther-schedule-tour ${community.slug ? `community-${community.slug}` : ''}`}
                  size="default"
                  data-community-id={community.id}
                  data-community-slug={community.slug}
                  data-community-name={community.name}
                  data-testid={`button-schedule-tour-${community.slug}`}
                  onClick={() => {
                    if (onSelectCommunity) {
                      onSelectCommunity(community);
                    } else {
                      openScheduleTour({
                        communityId: community.id,
                        communityName: community.name,
                      });
                    }
                    onOpenChange(false);
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Tour
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {communities.length === 0 && (
          <div
            className="text-center py-8 text-muted-foreground"
            data-testid="no-communities-message"
          >
            No communities available at this time.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}