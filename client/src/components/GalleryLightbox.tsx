import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Gallery } from "@shared/schema";

interface GalleryLightboxProps {
  gallery: Gallery;
}

export default function GalleryLightbox({ gallery }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!gallery.images || gallery.images.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? (gallery.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev === (gallery.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      handleNext();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-4" data-testid={`gallery-${gallery.id}`}>
      {gallery.title && (
        <h4 className="text-lg font-semibold text-foreground" data-testid={`gallery-title-${gallery.id}`}>
          {gallery.title}
        </h4>
      )}
      
      {gallery.description && (
        <p className="text-muted-foreground" data-testid={`gallery-description-${gallery.id}`}>
          {gallery.description}
        </p>
      )}
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.images.map((image, index) => (
          <Dialog key={index} open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button
                className="relative group overflow-hidden rounded-lg aspect-square"
                onClick={() => {
                  setCurrentIndex(index);
                  setIsOpen(true);
                }}
                data-testid={`gallery-image-${gallery.id}-${index}`}
              >
                <img
                  src={image.url}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            </DialogTrigger>
            
            <DialogContent 
              className="max-w-6xl max-h-[90vh] p-0 bg-black/95 border-none"
              onKeyDown={handleKeyDown}
              data-testid={`gallery-lightbox-${gallery.id}`}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                  data-testid="lightbox-close"
                >
                  <X className="w-6 h-6" />
                </Button>
                
                {/* Navigation Buttons */}
                {(gallery.images?.length || 0) > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                      onClick={handlePrevious}
                      data-testid="lightbox-previous"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                      onClick={handleNext}
                      data-testid="lightbox-next"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
                
                {/* Main Image */}
                <div className="relative max-w-full max-h-full p-8">
                  <img
                    src={gallery.images?.[currentIndex]?.url || ""}
                    alt={gallery.images?.[currentIndex]?.alt || `Gallery image ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                    data-testid={`lightbox-image-${currentIndex}`}
                  />
                  
                  {/* Image Caption */}
                  {gallery.images?.[currentIndex]?.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                      <p className="text-center" data-testid={`lightbox-caption-${currentIndex}`}>
                        {gallery.images?.[currentIndex]?.caption}
                      </p>
                    </div>
                  )}
                  
                  {/* Image Counter */}
                  {(gallery.images?.length || 0) > 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      <span data-testid="lightbox-counter">
                        {currentIndex + 1} / {gallery.images?.length || 0}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
