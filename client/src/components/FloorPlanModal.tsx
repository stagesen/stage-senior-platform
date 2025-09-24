import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  ChevronRight, 
  BedDouble, 
  Bath, 
  Square, 
  Download,
  Calendar,
  Home,
  Check
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Reset image index when floor plan changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [floorPlan.id]);

  // Create array of available images
  const images: { url: string; caption: string }[] = [];
  if (floorPlan.imageUrl) {
    images.push({ url: floorPlan.imageUrl, caption: "Living Space" });
  }
  if (floorPlan.planImageUrl) {
    images.push({ url: floorPlan.planImageUrl, caption: "Floor Plan Layout" });
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? Math.max(images.length - 1, 0) : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev >= images.length - 1 ? 0 : prev + 1
    );
  };
  
  // Safely get current image index, clamped to valid range
  const safeImageIndex = images.length > 0 
    ? Math.min(currentImageIndex, images.length - 1) 
    : 0;

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
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        data-testid={`floor-plan-modal-${floorPlan.id}`}
      >
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {floorPlan.name}
              </DialogTitle>
              <p className="text-muted-foreground mt-1">{communityName}</p>
            </div>
            <div className="text-right">
              {getAvailabilityBadge(floorPlan.availability)}
              {floorPlan.startingPrice && (
                <p className="text-2xl font-bold text-primary mt-2">
                  {formatPrice(floorPlan.startingPrice)}/mo
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="gallery" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-6">
            {images.length > 0 ? (
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={images[safeImageIndex]?.url || ''}
                    alt={images[safeImageIndex]?.caption || 'Floor plan image'}
                    className="w-full h-full object-contain"
                    data-testid={`modal-gallery-image-${safeImageIndex}`}
                  />
                </div>
                
                {images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={handlePreviousImage}
                      data-testid="modal-gallery-previous"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={handleNextImage}
                      data-testid="modal-gallery-next"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
                      {images[safeImageIndex]?.caption || 'Image'} ({safeImageIndex + 1}/{images.length})
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Home className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="floorplan" className="mt-6">
            {floorPlan.planImageUrl ? (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg overflow-hidden">
                  <img
                    src={floorPlan.planImageUrl}
                    alt={`${floorPlan.name} floor plan`}
                    className="w-full h-auto"
                    data-testid="modal-floor-plan-image"
                  />
                </div>
                
                {floorPlan.pdfUrl && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(floorPlan.pdfUrl!, '_blank', 'noopener,noreferrer')}
                    data-testid="button-download-pdf"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Floor Plan PDF
                  </Button>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Square className="h-12 w-12 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Floor plan not available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="mt-6 space-y-6">
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
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button className="flex-1" data-testid={`button-schedule-tour-${floorPlan.id}`}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule a Tour
          </Button>
          <Button variant="outline" className="flex-1" data-testid={`button-contact-${floorPlan.id}`}>
            Contact Us
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}