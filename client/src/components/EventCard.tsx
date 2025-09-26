import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  // Resolve image URL
  const resolvedImageUrl = useResolveImageUrl(event.imageUrl);
  
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const isUpcoming = new Date(event.startsAt) > new Date();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow" data-testid={`event-card-${event.slug}`}>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Event Image */}
          <div className="md:col-span-1">
            <img
              src={resolvedImageUrl || `https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300`}
              alt={event.title}
              className="w-full h-48 md:h-full object-cover"
              data-testid={`event-image-${event.slug}`}
            />
          </div>
          
          {/* Event Details */}
          <div className="md:col-span-3 p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-foreground mb-1" data-testid={`event-title-${event.slug}`}>
                  {event.title}
                </h4>
                <div className="flex items-center text-sm text-muted-foreground mb-2" data-testid={`event-datetime-${event.slug}`}>
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDateTime(event.startsAt)}
                  {event.endsAt && (
                    <>
                      <span className="mx-2">-</span>
                      <Clock className="w-4 h-4 mr-1" />
                      {new Intl.DateTimeFormat('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      }).format(new Date(event.endsAt))}
                    </>
                  )}
                </div>
                {event.locationText && (
                  <div className="flex items-center text-sm text-muted-foreground mb-2" data-testid={`event-location-${event.slug}`}>
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.locationText}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {isUpcoming && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary" data-testid={`event-upcoming-${event.slug}`}>
                    Upcoming
                  </Badge>
                )}
                {event.isPublic && (
                  <Badge variant="outline" data-testid={`event-public-${event.slug}`}>
                    Public
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Event Description */}
            {event.summary && (
              <p className="text-muted-foreground mb-4 line-clamp-2" data-testid={`event-summary-${event.slug}`}>
                {event.summary}
              </p>
            )}
            
            {/* Event Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              {event.rsvpUrl && (
                <Button 
                  variant="default" 
                  size="sm" 
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid={`button-rsvp-${event.slug}`}
                >
                  <a href={event.rsvpUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    RSVP
                  </a>
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                data-testid={`button-details-${event.slug}`}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
