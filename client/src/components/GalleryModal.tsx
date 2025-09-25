import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Grid } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface Gallery {
  id: string;
  title: string;
  description?: string;
  images?: GalleryImage[];
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gallery: Gallery | null;
  initialImageIndex?: number;
}

export default function GalleryModal({ isOpen, onClose, gallery, initialImageIndex = 0 }: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);
  const [showThumbnails, setShowThumbnails] = useState(true);

  const images = gallery?.images || [];
  const currentImage = images[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialImageIndex);
  }, [initialImageIndex, gallery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!gallery || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/95">
        <VisuallyHidden>
          <DialogTitle>{gallery.title || 'Gallery'}</DialogTitle>
          <DialogDescription>
            Browse through the {gallery.title || 'gallery'} collection. Use arrow keys to navigate between images or click the thumbnails below.
          </DialogDescription>
        </VisuallyHidden>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h2 className="text-xl font-semibold">{gallery.title}</h2>
              <p className="text-sm opacity-75">
                {currentIndex + 1} of {images.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowThumbnails(!showThumbnails)}
                className="text-white hover:bg-white/20"
                data-testid="toggle-thumbnails"
              >
                <Grid className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
                data-testid="close-gallery-modal"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Image Container */}
        <div className="relative flex items-center justify-center h-full min-h-[400px]">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 z-10 text-white bg-black/50 hover:bg-black/70"
            data-testid="gallery-previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Current Image */}
          <div className="flex flex-col items-center justify-center px-16 py-20">
            <img
              src={currentImage.url}
              alt={currentImage.alt || `Image ${currentIndex + 1}`}
              className="max-w-full max-h-[70vh] object-contain"
              data-testid="gallery-current-image"
            />
            {currentImage.caption && (
              <p className="mt-4 text-white text-center max-w-2xl">
                {currentImage.caption}
              </p>
            )}
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 z-10 text-white bg-black/50 hover:bg-black/70"
            data-testid="gallery-next"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Thumbnail Strip */}
        {showThumbnails && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 overflow-hidden rounded transition-all",
                    currentIndex === index
                      ? "ring-2 ring-white opacity-100"
                      : "opacity-50 hover:opacity-75"
                  )}
                  data-testid={`gallery-thumbnail-${index}`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}