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
import type { Community } from "@shared/schema";

interface CommunitySelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communities: Community[];
}

export default function CommunitySelectionModal({
  open,
  onOpenChange,
  communities,
}: CommunitySelectionModalProps) {
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
                  {community.city}, {community.state}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {community.shortDescription && (
                  <p
                    className="text-sm text-muted-foreground mb-4 line-clamp-2"
                    data-testid={`community-description-${community.slug}`}
                  >
                    {community.shortDescription}
                  </p>
                )}
                
                {community.phoneDisplay && (
                  <p
                    className="text-sm text-muted-foreground mb-4"
                    data-testid={`community-phone-${community.slug}`}
                  >
                    Call: {community.phoneDisplay}
                  </p>
                )}
                
                <Button
                  className="w-full"
                  size="default"
                  data-testid={`button-schedule-tour-${community.slug}`}
                  onClick={() => {
                    window.location.href = `/communities/${community.slug}/#/further/55`;
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