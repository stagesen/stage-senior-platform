/**
 * Meta tags utility for managing SEO and Open Graph tags
 * Since react-helmet-async is not installed, we manage meta tags via direct DOM manipulation
 */

export interface MetaTagsConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
  ogSiteName?: string;
  ogLocality?: string;
  ogRegion?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
}

/**
 * Sanitizes text for meta tags by stripping HTML and limiting length
 */
export function sanitizeMetaText(text: string, maxLength?: number): string {
  // Strip HTML tags
  const stripped = text.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  const decoded = stripped
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Trim and limit length
  const trimmed = decoded.trim();
  if (maxLength && trimmed.length > maxLength) {
    return trimmed.substring(0, maxLength - 3) + '...';
  }
  return trimmed;
}

/**
 * Sets or updates a meta tag
 */
function setMetaTag(property: string, content: string, isProperty = false): void {
  const attribute = isProperty ? 'property' : 'name';
  let metaTag = document.querySelector(`meta[${attribute}="${property}"]`);
  
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attribute, property);
    document.head.appendChild(metaTag);
  }
  
  metaTag.setAttribute('content', content);
}

/**
 * Sets or updates the canonical link tag
 */
function setCanonicalUrl(url: string): void {
  let linkTag = document.querySelector('link[rel="canonical"]');
  
  if (!linkTag) {
    linkTag = document.createElement('link');
    linkTag.setAttribute('rel', 'canonical');
    document.head.appendChild(linkTag);
  }
  
  linkTag.setAttribute('href', url);
}

/**
 * Removes all dynamically added meta tags (cleanup)
 */
export function clearMetaTags(): void {
  // Remove Open Graph tags
  const ogTags = document.querySelectorAll('meta[property^="og:"]');
  ogTags.forEach(tag => tag.remove());
  
  // Remove article tags
  const articleTags = document.querySelectorAll('meta[property^="article:"]');
  articleTags.forEach(tag => tag.remove());
}

/**
 * Sets all meta tags for a page
 */
export function setMetaTags(config: MetaTagsConfig): void {
  // Set title
  document.title = config.title;
  
  // Set meta description
  setMetaTag('description', sanitizeMetaText(config.description, 155));
  
  // Set canonical URL
  if (config.canonicalUrl) {
    setCanonicalUrl(config.canonicalUrl);
  }
  
  // Set Open Graph tags
  setMetaTag('og:title', config.ogTitle || config.title, true);
  setMetaTag('og:description', sanitizeMetaText(config.ogDescription || config.description, 155), true);
  setMetaTag('og:type', config.ogType || 'website', true);
  setMetaTag('og:site_name', config.ogSiteName || 'Stage Senior', true);
  
  if (config.ogUrl || config.canonicalUrl) {
    setMetaTag('og:url', config.ogUrl || config.canonicalUrl || window.location.href, true);
  }
  
  if (config.ogImage) {
    setMetaTag('og:image', config.ogImage, true);
  }
  
  if (config.ogLocality) {
    setMetaTag('og:locality', config.ogLocality, true);
  }
  
  if (config.ogRegion) {
    setMetaTag('og:region', config.ogRegion, true);
  }
  
  // Set article tags if provided
  if (config.articlePublishedTime) {
    setMetaTag('article:published_time', config.articlePublishedTime, true);
  }
  
  if (config.articleModifiedTime) {
    setMetaTag('article:modified_time', config.articleModifiedTime, true);
  }
}

/**
 * Helper function to get the canonical URL for the current page
 */
export function getCanonicalUrl(path?: string): string {
  const origin = window.location.origin;
  const pathname = path || window.location.pathname;
  return `${origin}${pathname}`;
}

/**
 * Adds a preload link for LCP (Largest Contentful Paint) optimization
 * This makes images discoverable from the HTML immediately
 */
export function preloadLCPImage(imageUrl: string): void {
  if (!imageUrl) return;
  
  // Check if preload link already exists
  const existingPreload = document.querySelector(`link[rel="preload"][href="${imageUrl}"]`);
  if (existingPreload) return;
  
  // Create and add preload link
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = imageUrl;
  link.setAttribute('fetchpriority', 'high');
  
  // Insert at the beginning of head for maximum priority
  document.head.insertBefore(link, document.head.firstChild);
}

/**
 * Helper function to format care types for display
 * Maps alternative care type names to standard names
 */
export function formatCareType(careType: string): string {
  const careTypeMap: Record<string, string> = {
    "assisted-living": "Assisted Living",
    "memory-care": "Memory Care",
    "alzheimers-care": "Memory Care",
    "dementia-care": "Memory Care",
    "independent-living": "Independent Living",
    "skilled-nursing": "Skilled Nursing",
  };

  // If we have a direct mapping, use it
  if (careTypeMap[careType]) {
    return careTypeMap[careType];
  }

  // Otherwise, fall back to title-casing the slug
  return careType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
