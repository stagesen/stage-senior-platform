import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UploadResponse {
  imageId: string;
  url: string;
  width?: number;
  height?: number;
}

interface MultipleUploadResponse {
  imageId: string;
  url: string;
  width?: number;
  height?: number;
}

export const useImageUpload = (options?: {
  onSuccess?: (data: UploadResponse | MultipleUploadResponse[]) => void;
  onError?: (error: Error) => void;
  multiple?: boolean;
  mixedMode?: boolean; // Allow PDFs and images
}) => {
  const { toast } = useToast();

  return useMutation<UploadResponse | MultipleUploadResponse[], Error, File | File[]>({
    mutationFn: async (files) => {
      const isMultiple = Array.isArray(files);
      const formData = new FormData();

      if (isMultiple) {
        files.forEach((file) => {
          formData.append("images", file);
        });
      } else {
        // Use different field name for mixed mode
        formData.append(options?.mixedMode ? "file" : "image", files);
      }

      // Determine endpoint based on mode
      let endpoint = "/api/upload";
      if (isMultiple) {
        endpoint = "/api/upload-multiple";
      } else if (options?.mixedMode) {
        endpoint = "/api/upload-mixed";
      }

      const response = await fetch(
        endpoint,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate images query to refresh any lists
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      
      // Invalidate individual image queries if needed
      if (Array.isArray(data)) {
        data.forEach((img) => {
          queryClient.invalidateQueries({ queryKey: ["/api/images", img.imageId] });
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/images", data.imageId] });
      }

      toast({
        title: "Success",
        description: Array.isArray(data) 
          ? `Successfully uploaded ${data.length} image${data.length > 1 ? 's' : ''}`
          : "Image uploaded successfully",
      });

      options?.onSuccess?.(data);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      options?.onError?.(error);
    },
  });
};