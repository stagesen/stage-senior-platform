import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Upload,
  X,
  FileText,
  Loader2,
  Download,
  File,
  FileIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploaderProps {
  value: string | undefined; // Attachment ID
  onChange: (value: string | undefined) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
  showDownload?: boolean;
}

interface AttachmentInfo {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  createdAt?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileIcon(mimeType: string) {
  if (mimeType === "application/pdf") {
    return <FileText className="h-8 w-8 text-red-500" />;
  }
  if (mimeType.includes("word") || mimeType.includes("document")) {
    return <FileIcon className="h-8 w-8 text-blue-500" />;
  }
  return <File className="h-8 w-8 text-gray-500" />;
}

export default function DocumentUploader({
  value,
  onChange,
  label,
  accept = ".pdf,.doc,.docx",
  maxSize = 25 * 1024 * 1024, // 25MB default
  disabled = false,
  className,
  showDownload = true,
}: DocumentUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing attachment details
  const { data: attachment, isLoading: isLoadingAttachment } = useQuery<AttachmentInfo>({
    queryKey: ["/api/post-attachments", value],
    enabled: !!value,
    queryFn: async () => {
      const response = await fetch(`/api/post-attachments/${value}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch attachment');
      return response.json();
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("document", file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      try {
        const response = await fetch("/api/post-attachments/upload", {
          method: "POST",
          body: formData,
          credentials: 'include',
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to upload document");
        }

        return response.json();
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    },
    onSuccess: (data) => {
      onChange(data.id);
      setIsUploading(false);
      setUploadProgress(100);
      queryClient.invalidateQueries({ queryKey: ["/api/post-attachments", data.id] });
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully",
      });
      setTimeout(() => setUploadProgress(0), 500);
    },
    onError: (error: Error) => {
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (attachmentId: string) => {
      await apiRequest(`/api/post-attachments/${attachmentId}`, "DELETE");
    },
    onSuccess: () => {
      onChange(undefined);
      queryClient.invalidateQueries({ queryKey: ["/api/post-attachments"] });
      toast({
        title: "Document removed",
        description: "The attachment has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Failed to remove",
        description: "Could not remove the attachment",
        variant: "destructive",
      });
    },
  });

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }

    // Check file type
    const allowedTypes = accept.split(",").map(t => t.trim());
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const isAllowed = allowedTypes.some(type => {
      if (type.startsWith(".")) {
        return fileExtension === type;
      }
      return file.type.includes(type);
    });

    if (!isAllowed) {
      return `File type not allowed. Accepted types: ${accept}`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const error = validateFile(file);

    if (error) {
      toast({
        title: "Invalid file",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    uploadMutation.mutate(file);
  };

  // Handle delete
  const handleDelete = () => {
    if (!value) return;
    if (window.confirm("Are you sure you want to remove this attachment?")) {
      deleteMutation.mutate(value);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!attachment) return;
    window.open(attachment.url, "_blank");
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
    e.target.value = "";
  };

  // Render loading state
  if (isLoadingAttachment && value) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label className="text-sm font-medium" data-testid="label-document-uploader">
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

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium" data-testid="label-document-uploader">
          {label}
        </label>
      )}

      {/* Display attached document */}
      {attachment && (
        <Card className="border-2">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {getFileIcon(attachment.mimeType)}
              <div>
                <p className="font-medium text-sm">{attachment.originalName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(attachment.sizeBytes)}
                  {attachment.createdAt && ` • Uploaded ${new Date(attachment.createdAt).toLocaleDateString()}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showDownload && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  data-testid="button-download-attachment"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={disabled || deleteMutation.isPending}
                data-testid="button-remove-attachment"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress Bar */}
      {isUploading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading document...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Upload Area - Only show if no attachment */}
      {!attachment && (
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
          data-testid="upload-area-document"
        >
          <CardContent className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="p-3 rounded-full bg-muted mb-4">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <p className="text-sm font-medium mb-1">
              {isDragActive ? "Drop file here" : "Click to upload or drag and drop"}
            </p>
            
            <p className="text-xs text-muted-foreground mb-4">
              Upload a document attachment (PDF, DOC, DOCX)
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="text-xs">
                Max size: {formatFileSize(maxSize)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {accept}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        disabled={disabled || !!attachment}
        className="hidden"
        data-testid="input-file-upload-document"
      />
    </div>
  );
}