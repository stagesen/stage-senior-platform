import { useQuery } from "@tanstack/react-query";
import type { Image } from "@shared/schema";

/**
 * Hook to resolve an image URL from either an image ID or a direct URL
 * @param value - Either a UUID-formatted image ID or a full URL
 * @returns The resolved image URL, undefined if not available, or null if loading
 */
export function useResolveImageUrl(value: string | undefined | null) {
  // Check if it's a UUID pattern (image ID)
  const isImageId = value && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  
  // Fetch image data if it's an image ID
  const { data: imageData, isLoading, isError } = useQuery<Image>({
    queryKey: ['/api/images', value],
    enabled: !!isImageId,
  });
  
  // Return null if loading (to distinguish from undefined which means no value)
  if (isImageId && isLoading) {
    return null;
  }
  
  // If there was an error fetching the image, return undefined
  if (isImageId && isError) {
    return undefined;
  }
  
  // No value provided
  if (!value) {
    return undefined;
  }
  
  // It's already a URL (starts with http/https or is a relative path)
  if (!isImageId) {
    return value;
  }
  
  // Return the URL from the fetched image data
  return imageData?.url;
}