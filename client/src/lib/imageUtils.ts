/**
 * Image optimization utilities for responsive images
 */

/**
 * Generate srcset attribute for responsive images
 * Uses our image optimization endpoint to serve resized versions
 */
export function generateImageSrcSet(imageUrl: string | undefined, widths: number[] = [400, 800, 1200]): string {
  if (!imageUrl) return '';

  // Check if it's an object storage URL
  const isObjectStorage = imageUrl.includes('/replit-objstore-') || imageUrl.includes('/public/');

  if (!isObjectStorage) {
    // For external URLs, return as-is (can't optimize)
    return imageUrl;
  }

  // Generate srcset with different widths using our optimization endpoint
  const srcsetParts = widths.map(width => {
    const optimizedUrl = `/api/images/resize?url=${encodeURIComponent(imageUrl)}&w=${width}&q=80`;
    return `${optimizedUrl} ${width}w`;
  });

  return srcsetParts.join(', ');
}

/**
 * Get optimized image URL with specific dimensions
 */
export function getOptimizedImageUrl(
  imageUrl: string | undefined,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  if (!imageUrl) return '';

  const { width, height, quality = 80 } = options;

  // Check if it's an object storage URL
  const isObjectStorage = imageUrl.includes('/replit-objstore-') || imageUrl.includes('/public/');

  if (!isObjectStorage) {
    return imageUrl;
  }

  // Build query parameters
  const params = new URLSearchParams();
  params.set('url', imageUrl);
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());

  return `/api/images/resize?${params.toString()}`;
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateImageSizes(breakpoints: { [key: string]: string } = {}): string {
  const defaultBreakpoints = {
    '(max-width: 640px)': '100vw',
    '(max-width: 768px)': '50vw',
    '(max-width: 1024px)': '33vw',
    ...breakpoints,
  };

  const sizes = Object.entries(defaultBreakpoints)
    .map(([query, size]) => `${query} ${size}`)
    .join(', ');

  return sizes + ', 800px'; // Default size
}
