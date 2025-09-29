import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ImageUploader from "@/components/ImageUploader";
import {
  Loader2,
  Copy,
  Eye,
  Trash2,
  Calendar,
  ImageIcon,
  Maximize2,
  Download,
  X,
  FileImage,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import type { Image } from "@shared/schema";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

function ImageCard({ image, onDelete, onView }: {
  image: Image;
  onDelete: (id: string) => void;
  onView: (image: Image) => void;
}) {
  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyUrl = () => {
    const fullUrl = `${window.location.origin}${image.url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopySuccess(true);
      toast({
        title: "Copied!",
        description: "Image URL copied to clipboard",
      });
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={image.url}
          alt={image.alt || "Gallery image"}
          className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
          onClick={() => onView(image)}
          data-testid={`image-preview-${image.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            <Button
              size="sm"
              variant="secondary"
              className="h-8"
              onClick={() => onView(image)}
              data-testid={`button-view-${image.id}`}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(image.id);
              }}
              data-testid={`button-delete-${image.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" title={image.alt || "No description"}>
              {image.alt || "No description"}
            </p>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span data-testid={`text-dimensions-${image.id}`}>
                  {image.width && image.height ? `${image.width}×${image.height}px` : "Unknown dimensions"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span data-testid={`text-size-${image.id}`}>
                  {image.sizeBytes ? formatFileSize(image.sizeBytes) : "Unknown size"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span data-testid={`text-date-${image.id}`}>
                  {image.createdAt ? format(new Date(image.createdAt), "MMM d, yyyy") : "Unknown"}
                </span>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant={copySuccess ? "default" : "outline"}
            className="h-8 w-8 p-0 shrink-0"
            onClick={handleCopyUrl}
            data-testid={`button-copy-url-${image.id}`}
            title="Copy image URL"
          >
            {copySuccess ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {image.uploadedBy && (
          <div className="text-xs text-muted-foreground">
            Uploaded by user #{image.uploadedBy}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ImageViewModal({ image, isOpen, onClose }: {
  image: Image | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();

  if (!image) return null;

  const handleCopyUrl = () => {
    const fullUrl = `${window.location.origin}${image.url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      toast({
        title: "Copied!",
        description: "Image URL copied to clipboard",
      });
    });
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.alt || `image-${image.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{image.alt || "Image Preview"}</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyUrl}
                data-testid="button-modal-copy-url"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                data-testid="button-modal-download"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                data-testid="button-modal-close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative bg-muted rounded-lg overflow-hidden">
            <img
              src={image.url}
              alt={image.alt || "Gallery image"}
              className="w-full h-auto max-h-[70vh] object-contain"
              data-testid="image-modal-preview"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dimensions</p>
              <p className="text-sm" data-testid="modal-text-dimensions">
                {image.width && image.height ? `${image.width} × ${image.height} px` : "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">File Size</p>
              <p className="text-sm" data-testid="modal-text-size">
                {image.sizeBytes ? formatFileSize(image.sizeBytes) : "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upload Date</p>
              <p className="text-sm" data-testid="modal-text-date">
                {image.createdAt ? format(new Date(image.createdAt), "PPP") : "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">File Type</p>
              <p className="text-sm" data-testid="modal-text-type">
                {image.mimeType || "image/jpeg"}
              </p>
            </div>
          </div>
          {image.objectKey && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium text-muted-foreground">Storage Key</p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block">
                {image.objectKey}
              </code>
            </div>
          )}
          <div className="pt-2 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-2">Full URL</p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 overflow-x-auto">
                {window.location.origin}{image.url}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyUrl}
                data-testid="button-modal-copy-full-url"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PageGalleryAdmin() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all images
  const { data: images = [], isLoading, error } = useQuery<Image[]>({
    queryKey: ["/api/images"],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/images/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (image: Image) => {
    setSelectedImage(image);
    setIsViewModalOpen(true);
  };

  const handleUploadSuccess = (newImages: string | string[] | undefined) => {
    if (newImages) {
      const imageIds = Array.isArray(newImages) ? newImages : [newImages];
      setUploadedImages(imageIds);
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      toast({
        title: "Success",
        description: `${imageIds.length} image(s) uploaded successfully`,
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Image Gallery</CardTitle>
            <CardDescription>Manage all uploaded images in one place</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <X className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium">Failed to load images</h3>
            <p className="text-sm text-muted-foreground">
              There was an error loading the image gallery. Please try again.
            </p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/images"] })}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image Gallery</CardTitle>
          <CardDescription>
            Manage all uploaded images in one place. Upload new images, view details, and copy URLs for use in your content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed rounded-lg p-6 bg-muted/30">
            <div className="mb-3">
              <h3 className="text-sm font-medium mb-1">Upload Images</h3>
              <p className="text-xs text-muted-foreground">
                Upload one or more images to the gallery. Maximum file size: 10MB per image.
              </p>
            </div>
            <ImageUploader
              value={uploadedImages}
              onChange={handleUploadSuccess}
              multiple={true}
              maxFiles={10}
              accept="image/*"
              data-testid="image-uploader-gallery"
            />
          </div>

          {/* Image Grid */}
          {images.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileImage className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No images yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Upload your first image to get started with the gallery.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    {images.length} {images.length === 1 ? "image" : "images"}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {images.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Modal */}
      <ImageViewModal
        image={selectedImage}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedImage(null);
        }}
      />
    </div>
  );
}