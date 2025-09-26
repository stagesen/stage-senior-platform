import { useQuery } from "@tanstack/react-query";
import type { Image } from "@shared/schema";

interface UseImageOptions {
  enabled?: boolean;
  onError?: (error: Error) => void;
}

export const useImage = (imageId: string | undefined, options?: UseImageOptions) => {
  return useQuery<Image>({
    queryKey: ["/api/images", imageId],
    queryFn: async () => {
      if (!imageId) {
        throw new Error("No image ID provided");
      }

      const response = await fetch(`/api/images/${imageId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Image not found");
        }
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch image");
      }

      return response.json();
    },
    enabled: !!imageId && (options?.enabled !== false),
    retry: (failureCount, error) => {
      // Don't retry if the image doesn't exist
      if (error instanceof Error && error.message === "Image not found") {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook for fetching multiple images
export const useImages = (imageIds: string[], options?: UseImageOptions) => {
  return useQuery<Image[]>({
    queryKey: ["/api/images", "multiple", imageIds],
    queryFn: async () => {
      const promises = imageIds.map(async (id) => {
        const response = await fetch(`/api/images/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          // Return null for missing images instead of throwing
          return null;
        }

        return response.json();
      });

      const results = await Promise.all(promises);
      // Filter out null results (missing images)
      return results.filter((img): img is Image => img !== null);
    },
    enabled: imageIds.length > 0 && (options?.enabled !== false),
  });
};