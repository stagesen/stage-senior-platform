import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, ExternalLink, Users } from "lucide-react";
import type { Event } from "@shared/schema";

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
  if (!event) return null;

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const isUpcoming = new Date(event.startsAt) > new Date();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="event-details-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" data-testid="modal-event-title">
            {event.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Event Image */}
          {event.imageUrl && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
                data-testid="modal-event-image"
              />
            </div>
          )}

          {/* Event Status */}
          <div className="flex items-center gap-2">
            <Badge 
              variant={isUpcoming ? "default" : "secondary"}
              data-testid="modal-event-status"
            >
              {isUpcoming ? "Upcoming" : "Past Event"}
            </Badge>
            {event.isPublic && (
              <Badge variant="outline" data-testid="modal-event-public">
                Public Event
              </Badge>
            )}
          </div>

          {/* Date and Time */}
          <div className="space-y-3">
            <div className="flex items-center text-foreground" data-testid="modal-event-datetime">
              <Calendar className="w-5 h-5 mr-3 text-primary" />
              <div>
                <div className="font-medium">
                  {formatDateTime(event.startsAt)}
                </div>
                {event.endsAt && (
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    Ends at {formatTime(event.endsAt)}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {event.locationText && (
              <div className="flex items-center text-foreground" data-testid="modal-event-location">
                <MapPin className="w-5 h-5 mr-3 text-primary" />
                <span>{event.locationText}</span>
              </div>
            )}

            {/* Max Attendees */}
            {event.maxAttendees && (
              <div className="flex items-center text-foreground" data-testid="modal-event-capacity">
                <Users className="w-5 h-5 mr-3 text-primary" />
                <span>Limited to {event.maxAttendees} attendees</span>
              </div>
            )}
          </div>

          {/* Summary */}
          {event.summary && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-muted-foreground" data-testid="modal-event-summary">
                {event.summary}
              </p>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground leading-relaxed" data-testid="modal-event-description">
                {event.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {event.rsvpUrl && isUpcoming && (
              <Button 
                asChild
                className="flex-1"
                data-testid="button-rsvp"
              >
                <a 
                  href={event.rsvpUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  RSVP for Event
                </a>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              data-testid="button-close-modal"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}