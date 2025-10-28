import { useQuery } from "@tanstack/react-query";
import type { Image } from "@shared/schema";

/**
 * Hook to resolve an image URL from either an image ID or a direct URL
 * @param value - Either an image ID (UUID or string) or a full URL
 * @returns The resolved image URL, undefined if not available, or null if loading
 */
export function useResolveImageUrl(value: string | undefined | null) {
  // No value provided
  if (!value) {
    return undefined;
  }
  
  // Check if it's already a full URL (starts with http/https or /)
  const isUrl = value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/');
  
  // If it's a URL, return it directly
  if (isUrl) {
    return value;
  }
  
  // Otherwise, treat it as an image ID and fetch from the API
  const { data: imageData, isLoading, isError } = useQuery<Image>({
    queryKey: ['/api/images', value],
    enabled: true,
  });
  
  // Return null if loading (to distinguish from undefined which means no value)
  if (isLoading) {
    return null;
  }
  
  // If there was an error fetching the image, return undefined
  if (isError) {
    return undefined;
  }
  
  // Return the URL from the fetched image data
  return imageData?.url;
}