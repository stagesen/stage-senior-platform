import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export const useImageDelete = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const { toast } = useToast();

  return useMutation<void, Error, string>({
    mutationFn: async (imageId: string) => {
      const response = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Image not found");
        }
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to delete image");
      }
    },
    onSuccess: () => {
      // Invalidate images query to refresh any lists
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });

      options?.onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
      options?.onError?.(error);
    },
  });
};