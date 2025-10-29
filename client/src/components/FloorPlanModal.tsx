import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  BedDouble, 
  Bath, 
  Square, 
  Download,
  Calendar,
  Check,
  Phone,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { FloorPlan, FloorPlanImageWithDetails } from "@shared/schema";

interface FloorPlanModalProps {
  floorPlan: FloorPlan;
  communityName: string;
  communityId?: string;
  communitySlug?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FloorPlanModal({ 
  floorPlan, 
  communityName,
  communityId,
  communitySlug,
  isOpen, 
  onOpenChange 
}: FloorPlanModalProps) {
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Fetch floor plan gallery images
  const { data: floorPlanImages = [], isLoading: loadingImages, isError: galleryError } = useQuery<FloorPlanImageWithDetails[]>({
    queryKey: ["/api/floor-plans", floorPlan.id, "images"],
    enabled: isOpen && !!floorPlan.id,
  });
  
  // Resolve image URLs - check imageId first (new), then fall back to old URL fields
  const resolvedPlanImageUrl = useResolveImageUrl(floorPlan.planImageUrl);
  const resolvedImageUrl = useResolveImageUrl(floorPlan.imageId || floorPlan.imageUrl);

  // Check if we're still loading the main image
  const isLoadingMainImage = (floorPlan.imageId || floorPlan.imageUrl) && resolvedImageUrl === null;

  // Combine main floor plan image with gallery images
  const images: { url: string; caption: string; type: 'plan' | 'photo' }[] = [];
  if (resolvedPlanImageUrl) {
    images.push({ url: resolvedPlanImageUrl, caption: "Floor Plan Layout", type: 'plan' });
  }
  if (resolvedImageUrl) {
    images.push({ url: resolvedImageUrl, caption: "Living Space", type: 'photo' });
  }
  // Add gallery images from the database
  floorPlanImages.forEach((img) => {
    const imgUrl = img.imageUrl || img.url;
    // Note: Gallery images are already resolved URLs from the database
    if (imgUrl) {
      images.push({
        url: imgUrl,
        caption: img.caption || "Gallery Image",
        type: 'photo'
      });
    }
  });
  
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
        className="w-[95vw] max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-y-auto p-4 sm:p-6"
        data-testid={`floor-plan-modal-${floorPlan.id}`}
      >
        <DialogHeader className="mb-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="min-w-0 text-left order-2 sm:order-1">
                <DialogTitle className="text-xl sm:text-2xl font-bold">
                  {floorPlan.name}
                </DialogTitle>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">{communityName}</p>
              </div>
              <div className="text-left sm:text-right order-1 sm:order-2 flex items-center gap-2">
                {getAvailabilityBadge(floorPlan.availability)}
                {floorPlan.startingPrice && (
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    {formatPrice(floorPlan.startingPrice)}/mo
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Main Image Display with Carousel */}
        {(isLoadingMainImage || loadingImages) && images.length === 0 ? (
          <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center p-8">
            <div className="animate-pulse space-y-2 text-center">
              <Square className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Loading images...</p>
            </div>
          </div>
        ) : images.length > 0 ? (
          <div className="space-y-4">
            {images.length > 1 ? (
              <Carousel 
                className="w-full"
                opts={{
                  startIndex: selectedImageIndex,
                  loop: true,
                }}
              >
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[4/3] sm:aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.caption}
                          className="w-full h-full object-contain"
                          data-testid={`modal-carousel-image-${index}`}
                        />
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                          <div className="bg-background/80 px-3 py-1 rounded">
                            <p className="text-xs sm:text-sm font-medium">{image.caption}</p>
                          </div>
                          <div className="bg-background/80 px-2 py-1 rounded text-xs sm:text-sm">
                            {index + 1} / {images.length}
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-white/95 hover:bg-white shadow-lg border-2 min-h-[44px] min-w-[44px]" />
                <CarouselNext className="right-2 bg-white/95 hover:bg-white shadow-lg border-2 min-h-[44px] min-w-[44px]" />
              </Carousel>
            ) : (
              <div className="relative aspect-[4/3] sm:aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={images[0]?.url || ''}
                  alt={images[0]?.caption || 'Floor plan image'}
                  className="w-full h-full object-contain"
                  data-testid={`modal-main-image-0`}
                />
                <div className="absolute bottom-2 left-2 bg-background/80 px-3 py-1 rounded">
                  <p className="text-xs sm:text-sm font-medium">{images[0]?.caption}</p>
                </div>
              </div>
            )}
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImageIndex(index);
                      // Navigate carousel to selected index
                      const carousel = document.querySelector('[data-carousel-root]');
                      if (carousel) {
                        const event = new CustomEvent('carousel-goto', { detail: index });
                        carousel.dispatchEvent(event);
                      }
                    }}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-muted rounded-lg p-3 sm:p-4 text-center">
                <BedDouble className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-primary" />
                <p className="text-xl sm:text-2xl font-bold">{floorPlan.bedrooms}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {floorPlan.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-3 sm:p-4 text-center">
                <Bath className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-primary" />
                <p className="text-xl sm:text-2xl font-bold">
                  {floorPlan.bathrooms != null 
                    ? parseFloat(String(floorPlan.bathrooms)) || '—'
                    : '—'}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {floorPlan.bathrooms != null && parseFloat(String(floorPlan.bathrooms)) === 1 
                    ? 'Bathroom' 
                    : 'Bathrooms'}
                </p>
              </div>
              
              {floorPlan.squareFeet && (
                <div className="bg-muted rounded-lg p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
                  <Square className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xl sm:text-2xl font-bold">{floorPlan.squareFeet}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Sq Ft</p>
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

        {/* Enhanced Action Buttons with Lead Capture */}
        {!showLeadCapture ? (
          <div className="space-y-4 mt-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                variant="default" 
                className="flex-1 h-12 text-base font-semibold talkfurther-schedule-tour" 
                onClick={() => setShowLeadCapture(true)}
                data-community-id={communityId}
                data-community-slug={communitySlug}
                data-community-name={communityName}
                data-testid={`button-schedule-tour-${floorPlan.id}`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule a Tour
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-12 text-base font-semibold" 
                asChild
                data-testid={`button-call-${floorPlan.id}`}
              >
                <a href="tel:+1-970-444-4689">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3 flex-shrink-0 text-green-600" />
                <span>Same-day tours</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3 flex-shrink-0 text-green-600" />
                <span>No obligation</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3 flex-shrink-0 text-green-600" />
                <span>Free consultation</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <LeadCaptureForm
              variant="modal"
              title="Schedule Your Tour"
              description={`Get personalized tour of ${floorPlan.name} at ${communityName}`}
              communityId={communityId}
              communityName={communityName}
              urgencyText="📞 Same-day tours available"
              onSuccess={() => {
                setShowLeadCapture(false);
                onOpenChange(false);
              }}
              className="border-0 shadow-none bg-transparent"
            />
            <Button 
              variant="ghost" 
              onClick={() => setShowLeadCapture(false)}
              className="w-full mt-3"
              data-testid={`button-back-${floorPlan.id}`}
            >
              ← Back to Floor Plan
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}