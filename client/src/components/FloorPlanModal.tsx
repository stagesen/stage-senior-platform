import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BedDouble, 
  Bath, 
  Square, 
  Download,
  Calendar,
  Check,
  Phone
} from "lucide-react";
import type { FloorPlan } from "@shared/schema";

interface FloorPlanModalProps {
  floorPlan: FloorPlan;
  communityName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FloorPlanModal({ 
  floorPlan, 
  communityName,
  isOpen, 
  onOpenChange 
}: FloorPlanModalProps) {
  // Create array of available images - floor plan first
  const images: { url: string; caption: string; type: 'plan' | 'photo' }[] = [];
  if (floorPlan.planImageUrl) {
    images.push({ url: floorPlan.planImageUrl, caption: "Floor Plan Layout", type: 'plan' });
  }
  if (floorPlan.imageUrl) {
    images.push({ url: floorPlan.imageUrl, caption: "Living Space", type: 'photo' });
  }
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Reset image index when floor plan changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [floorPlan.id]);

  const formatPrice = (price: number | null) => {
    if (!price) return 'Contact for pricing';
    return `$${price.toLocaleString()}`;
  };

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto p-4 sm:p-6"
        data-testid={`floor-plan-modal-${floorPlan.id}`}
      >
        <DialogHeader className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-bold">
                {floorPlan.name}
              </DialogTitle>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">{communityName}</p>
            </div>
            <div className="text-left sm:text-right">
              {getAvailabilityBadge(floorPlan.availability)}
              {floorPlan.startingPrice && (
                <p className="text-xl sm:text-2xl font-bold text-primary mt-1 sm:mt-2">
                  {formatPrice(floorPlan.startingPrice)}/mo
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Main Image Display */}
        {images.length > 0 ? (
          <div className="space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={images[selectedImageIndex]?.url || ''}
                alt={images[selectedImageIndex]?.caption || 'Floor plan image'}
                className="w-full h-full object-contain"
                data-testid={`modal-main-image-${selectedImageIndex}`}
              />
              <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs sm:text-sm">
                {images[selectedImageIndex]?.caption}
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    data-testid={`modal-thumbnail-${index}`}
                  >
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-full object-cover"
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-primary/10" />
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {/* PDF Download */}
            {floorPlan.pdfUrl && (
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => window.open(floorPlan.pdfUrl!, '_blank', 'noopener,noreferrer')}
                data-testid="button-download-pdf"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Floor Plan PDF
              </Button>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center p-8">
            <Square className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">No images available</p>
          </div>
        )}

        {/* Details Section */}
        <div className="space-y-4 sm:space-y-6 mt-6">
            {/* Specifications */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <BedDouble className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{floorPlan.bedrooms}</p>
                <p className="text-sm text-muted-foreground">
                  {floorPlan.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-4 text-center">
                <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">
                  {floorPlan.bathrooms != null 
                    ? parseFloat(String(floorPlan.bathrooms)) || '—'
                    : '—'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {floorPlan.bathrooms != null && parseFloat(String(floorPlan.bathrooms)) === 1 
                    ? 'Bathroom' 
                    : 'Bathrooms'}
                </p>
              </div>
              
              {floorPlan.squareFeet && (
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{floorPlan.squareFeet}</p>
                  <p className="text-sm text-muted-foreground">Sq Ft</p>
                </div>
              )}
            </div>

            {/* Description */}
            {floorPlan.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{floorPlan.description}</p>
              </div>
            )}

            {/* Highlights */}
            {floorPlan.highlights && floorPlan.highlights.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Features & Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {floorPlan.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
          <Button className="flex-1" data-testid={`button-schedule-tour-${floorPlan.id}`}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule a Tour
          </Button>
          <Button variant="outline" className="flex-1" data-testid={`button-contact-${floorPlan.id}`}>
            <Phone className="h-4 w-4 mr-2" />
            Contact Us
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}