import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useImageDelete } from "@/hooks/useImageDelete";
import { useImage, useImages } from "@/hooks/useImage";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  Trash2,
  GripVertical,
  AlertCircle,
  FileImage,
  Star,
  StarOff,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string | string[] | undefined;
  onChange: (value: string | string[] | undefined) => void;
  multiple?: boolean;
  label?: string;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number; // for multiple mode
  disabled?: boolean;
  className?: string;
  // Gallery-specific props
  showDelete?: boolean;
  showReorder?: boolean;
  showThumbnailSelector?: boolean;
  thumbnailIndex?: number;
  onThumbnailChange?: (index: number | undefined) => void;
  onReorder?: (reorderedImages: string[]) => void;
}

interface PreviewImage {
  id?: string; // Image ID from database
  url: string;
  name?: string;
  size?: number;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  label,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  disabled = false,
  className,
  showDelete = true,
  showReorder = false,
  showThumbnailSelector = false,
  thumbnailIndex,
  onThumbnailChange,
  onReorder,
}: ImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Convert value to array for consistent handling
  const imageIds = Array.isArray(value) ? value : value ? [value] : [];

  // Always call hooks to maintain consistent order (React Rules of Hooks)
  const multipleImagesQuery = useImages(multiple ? imageIds : []);
  const singleImageQuery = useImage(!multiple && imageIds[0] ? imageIds[0] : undefined);

  // Select the appropriate data based on mode
  const existingImages = multiple ? multipleImagesQuery.data : undefined;
  const isLoadingImages = multiple ? multipleImagesQuery.isLoading : false;
  
  const singleImage = !multiple ? singleImageQuery.data : undefined;
  const isLoadingSingle = !multiple ? singleImageQuery.isLoading : false;

  // Upload mutation
  const uploadMutation = useImageUpload({
    onSuccess: (data) => {
      if (Array.isArray(data)) {
        // Multiple upload
        const newIds = data.map((img) => img.imageId);
        const updatedIds = [...imageIds, ...newIds];
        onChange(updatedIds);
        
        // Update preview with uploaded images
        setPreviewImages((prev) => {
          const uploaded = data.map((img) => ({
            id: img.imageId,
            url: img.url,
            isUploading: false,
            uploadProgress: 100,
          }));
          return [...prev.filter((p) => p.id), ...uploaded];
        });
      } else {
        // Single upload
        onChange(data.imageId);
        setPreviewImages([{
          id: data.imageId,
          url: data.url,
          isUploading: false,
          uploadProgress: 100,
        }]);
      }
      setIsUploading(false);
      setUploadProgress(0);
    },
    onError: () => {
      setIsUploading(false);
      setUploadProgress(0);
      setPreviewImages((prev) => prev.filter((p) => !p.isUploading));
    },
  });

  // Delete mutation
  const deleteMutation = useImageDelete({
    onSuccess: () => {
      // Handled in the delete handler
    },
  });

  // Update preview images when existing images are loaded
  useEffect(() => {
    if (multiple && existingImages && existingImages.length > 0) {
      const existingPreviews = existingImages.map((img) => ({
        id: img.id,
        url: img.url,
        name: img.alt || "Uploaded image",
      }));
      setPreviewImages(existingPreviews);
    } else if (!multiple && singleImage) {
      setPreviewImages([{
        id: singleImage.id,
        url: singleImage.url,
        name: singleImage.alt || "Uploaded image",
      }]);
    } else if (imageIds.length === 0) {
      setPreviewImages([]);
    }
  }, [multiple, existingImages, singleImage, imageIds.length]);

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size first
    if (file.size > maxSize) {
      return `File size must be less than ${(maxSize / (1024 * 1024)).toFixed(0)}MB`;
    }

    // Check accept pattern
    const acceptedTypes = accept.split(",").map((t) => t.trim());
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const fileMimeType = file.type;
    
    // Check if file matches any accepted type
    const isAccepted = acceptedTypes.some((type) => {
      // Handle wildcards like "image/*"
      if (type === "image/*" && fileMimeType.startsWith("image/")) return true;
      // Handle specific MIME types
      if (type === fileMimeType) return true;
      // Handle file extensions
      if (type === fileExtension) return true;
      // Handle specific PDF and document cases
      if (type === ".pdf" && (fileMimeType === "application/pdf" || fileExtension === ".pdf")) return true;
      if (type === ".doc" && (fileMimeType === "application/msword" || fileExtension === ".doc")) return true;
      if (type === ".docx" && (fileMimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || fileExtension === ".docx")) return true;
      // Handle wildcard patterns
      if (type.endsWith("*") && fileMimeType.startsWith(type.replace("*", ""))) return true;
      return false;
    });

    if (!isAccepted) {
      return `File type not accepted. Allowed types: ${accept}`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Validate number of files for multiple mode
    if (multiple) {
      const totalFiles = imageIds.length + fileArray.length;
      if (totalFiles > maxFiles) {
        toast({
          title: "Too many files",
          description: `Maximum ${maxFiles} files allowed. You have ${imageIds.length} and are trying to add ${fileArray.length} more.`,
          variant: "destructive",
        });
        return;
      }
    } else if (fileArray.length > 1) {
      toast({
        title: "Single file only",
        description: "Please select only one image",
        variant: "destructive",
      });
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      toast({
        title: "Invalid files",
        description: errors.join("\n"),
        variant: "destructive",
      });
    }

    if (validFiles.length === 0) return;

    // Create preview images
    const newPreviews: PreviewImage[] = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      isUploading: true,
      uploadProgress: 0,
    }));

    if (!multiple) {
      setPreviewImages(newPreviews);
    } else {
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }

    // Upload files
    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      if (multiple) {
        await uploadMutation.mutateAsync(validFiles);
      } else {
        await uploadMutation.mutateAsync(validFiles[0]);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Clean up object URLs
      newPreviews.forEach((preview) => {
        if (preview.url.startsWith("blob:")) {
          URL.revokeObjectURL(preview.url);
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  // Handle delete
  const handleDelete = async (imageId: string) => {
    if (!imageId) return;

    try {
      await deleteMutation.mutateAsync(imageId);

      if (multiple) {
        const updatedIds = imageIds.filter((id) => id !== imageId);
        onChange(updatedIds.length > 0 ? updatedIds : undefined);
        setPreviewImages((prev) => prev.filter((p) => p.id !== imageId));
      } else {
        onChange(undefined);
        setPreviewImages([]);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Handle reordering
  const handleMoveUp = (index: number) => {
    if (index === 0 || !multiple) return;
    
    const newIds = [...imageIds];
    [newIds[index], newIds[index - 1]] = [newIds[index - 1], newIds[index]];
    onChange(newIds);
    
    if (onReorder) {
      onReorder(newIds);
    }

    // Update preview images order
    const newPreviews = [...previewImages];
    [newPreviews[index], newPreviews[index - 1]] = [newPreviews[index - 1], newPreviews[index]];
    setPreviewImages(newPreviews);

    // Update thumbnail index if needed
    if (thumbnailIndex === index) {
      onThumbnailChange?.(index - 1);
    } else if (thumbnailIndex === index - 1) {
      onThumbnailChange?.(index);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index === imageIds.length - 1 || !multiple) return;
    
    const newIds = [...imageIds];
    [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
    onChange(newIds);
    
    if (onReorder) {
      onReorder(newIds);
    }

    // Update preview images order
    const newPreviews = [...previewImages];
    [newPreviews[index], newPreviews[index + 1]] = [newPreviews[index + 1], newPreviews[index]];
    setPreviewImages(newPreviews);

    // Update thumbnail index if needed
    if (thumbnailIndex === index) {
      onThumbnailChange?.(index + 1);
    } else if (thumbnailIndex === index + 1) {
      onThumbnailChange?.(index);
    }
  };

  // Handle thumbnail selection
  const handleSetThumbnail = (index: number) => {
    if (onThumbnailChange) {
      onThumbnailChange(thumbnailIndex === index ? undefined : index);
    }
  };

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [disabled]);

  // Handle click to browse
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  // Render loading state
  if (isLoadingImages || isLoadingSingle) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label className="text-sm font-medium" data-testid="label-image-uploader">
            {label}
          </label>
        )}
        <Card className="border-2 border-dashed">
          <CardContent className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const showUploadArea = !multiple ? previewImages.length === 0 : previewImages.length < maxFiles;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium" data-testid="label-image-uploader">
          {label}
        </label>
      )}

      {/* Preview Images */}
      {previewImages.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {previewImages.length} {previewImages.length === 1 ? 'Image' : 'Images'} Uploaded
            </Badge>
            {!multiple && previewImages.length === 1 && (
              <span className="text-xs text-muted-foreground">
                Click the X to remove and upload a different image
              </span>
            )}
          </div>
          <div className={cn(
            "grid gap-4",
            multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1"
          )}>
            {previewImages.map((image, index) => (
              <Card
                key={image.id || index}
                className="relative overflow-hidden group border-2 border-green-500/50"
                data-testid={`preview-image-${image.id || index}`}
              >
                <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={image.name || "Uploaded image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";
                  }}
                />
                
                {/* Upload Progress Overlay */}
                {image.isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-xs">Uploading...</p>
                      {image.uploadProgress !== undefined && (
                        <Progress value={image.uploadProgress} className="w-20 h-1 mt-2" />
                      )}
                    </div>
                  </div>
                )}

                {/* Gallery Controls */}
                {!image.isUploading && image.id && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {/* Thumbnail Selector */}
                    {showThumbnailSelector && multiple && (
                      <button
                        type="button"
                        onClick={() => handleSetThumbnail(index)}
                        disabled={disabled}
                        className={cn(
                          "p-1.5 rounded-md",
                          thumbnailIndex === index
                            ? "bg-yellow-500 text-white opacity-100"
                            : "bg-gray-800 text-white",
                          "hover:bg-opacity-90 disabled:opacity-50"
                        )}
                        title={thumbnailIndex === index ? "Remove as thumbnail" : "Set as thumbnail"}
                        data-testid={`button-thumbnail-image-${image.id}`}
                      >
                        {thumbnailIndex === index ? (
                          <Star className="h-4 w-4 fill-current" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </button>
                    )}

                    {/* Reorder Buttons */}
                    {showReorder && multiple && (
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={disabled || index === 0}
                          className={cn(
                            "p-1 rounded-t-md bg-gray-800 text-white",
                            "hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          )}
                          title="Move up"
                          data-testid={`button-move-up-${image.id}`}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={disabled || index === previewImages.length - 1}
                          className={cn(
                            "p-1 rounded-b-md bg-gray-800 text-white",
                            "hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          )}
                          title="Move down"
                          data-testid={`button-move-down-${image.id}`}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    {/* Delete Button */}
                    {showDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(image.id!)}
                        disabled={disabled || deleteMutation.isPending}
                        className={cn(
                          "p-1.5 rounded-md",
                          "bg-red-500 text-white",
                          "hover:bg-red-600 disabled:opacity-50"
                        )}
                        data-testid={`button-delete-image-${image.id}`}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Error State */}
                {image.error && (
                  <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                    <div className="text-red-600 text-center p-2">
                      <AlertCircle className="h-8 w-8 mx-auto mb-1" />
                      <p className="text-xs">{image.error}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Image Name and Info */}
              <div className="p-2 bg-muted">
                {thumbnailIndex === index && (
                  <Badge variant="default" className="mb-1 text-xs">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Thumbnail
                  </Badge>
                )}
                {image.name && (
                  <p className="text-xs truncate" title={image.name}>
                    {image.name}
                  </p>
                )}
                {image.size && (
                  <p className="text-xs text-muted-foreground">
                    {(image.size / 1024).toFixed(1)} KB
                  </p>
                )}
                {showReorder && multiple && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Position: {index + 1} of {previewImages.length}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Progress Bar */}
      {isUploading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Upload Area */}
      {showUploadArea && (
        <div className="space-y-2">
          {previewImages.length === 0 && !multiple && (
            <Badge variant="outline" className="text-xs border-orange-500/50 text-orange-600">
              <AlertCircle className="w-3 h-3 mr-1" />
              No image uploaded yet - Click below to add one
            </Badge>
          )}
          <Card
            className={cn(
              "border-2 border-dashed transition-colors cursor-pointer",
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            data-testid="upload-area"
          >
            <CardContent className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="p-3 rounded-full bg-muted mb-4">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              
              <p className="text-sm font-medium mb-1">
                {isDragActive ? "Drop files here" : 
                  previewImages.length === 0 ? "Click to upload or drag and drop" :
                  "Add more images"}
              </p>
              
              <p className="text-xs text-muted-foreground mb-4">
                {multiple 
                  ? `Upload up to ${maxFiles} images`
                  : previewImages.length === 0 ? "Upload an image" : "Replace current image"
                }
              </p>

              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-xs">
                  Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
                </Badge>
                {accept !== "image/*" && (
                  <Badge variant="secondary" className="text-xs">
                    {accept}
                  </Badge>
                )}
              </div>

              {multiple && imageIds.length > 0 && (
                <p className="text-xs text-muted-foreground mt-4">
                  {imageIds.length} of {maxFiles} images uploaded
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        disabled={disabled}
        className="hidden"
        data-testid="input-file-upload"
      />

      {/* Helper Text */}
      {multiple && previewImages.length >= maxFiles && (
        <p className="text-sm text-muted-foreground">
          Maximum number of images reached ({maxFiles})
        </p>
      )}
    </div>
  );
}