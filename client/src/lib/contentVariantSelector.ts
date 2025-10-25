/**
 * Content Variant Selection System
 *
 * This module provides intelligent content selection based on market characteristics
 * to eliminate duplicate content issues on landing pages.
 */

export interface MarketCharacteristics {
  size: 'metro' | 'suburban' | 'rural';
  competitive: 'high' | 'medium' | 'low';
  pricing: 'premium' | 'mid-range' | 'budget-friendly';
  demographics: 'affluent' | 'middle-class' | 'mixed';
}

export interface ContentVariant {
  variantId: string;
  marketSize?: ('metro' | 'suburban' | 'rural')[];
  careTypes?: string[];
  marketCharacteristics?: {
    competitive?: ('high' | 'medium' | 'low')[];
    pricing?: ('premium' | 'mid-range' | 'budget-friendly')[];
    demographics?: ('affluent' | 'middle-class' | 'mixed')[];
  };
  content: string | string[];
  weight?: number; // For A/B testing or prioritization (higher = preferred)
}

export interface ContentSectionWithVariants {
  heading?: string | { default: string; variants?: ContentVariant[] };
  content?: string | { default: string; variants?: ContentVariant[] };
  highlights?: string[] | { default: string[]; variants?: ContentVariant[] };
  reasons?: any[] | { default: any[]; variants?: ContentVariant[] };
  features?: string[] | { default: string[]; variants?: ContentVariant[] };
  keyPoints?: string[] | { default: string[]; variants?: ContentVariant[] };
}

/**
 * City-to-market characteristics mapping
 * Defines market characteristics for different cities/locations
 */
const CITY_MARKET_MAP: Record<string, MarketCharacteristics> = {
  // Metro areas - high competition, higher pricing
  'denver': {
    size: 'metro',
    competitive: 'high',
    pricing: 'premium',
    demographics: 'affluent',
  },
  'aurora': {
    size: 'metro',
    competitive: 'high',
    pricing: 'mid-range',
    demographics: 'mixed',
  },

  // Suburban areas - medium competition
  'littleton': {
    size: 'suburban',
    competitive: 'medium',
    pricing: 'mid-range',
    demographics: 'middle-class',
  },
  'arvada': {
    size: 'suburban',
    competitive: 'medium',
    pricing: 'mid-range',
    demographics: 'middle-class',
  },
  'golden': {
    size: 'suburban',
    competitive: 'low',
    pricing: 'premium',
    demographics: 'affluent',
  },
  'lakewood': {
    size: 'suburban',
    competitive: 'medium',
    pricing: 'mid-range',
    demographics: 'middle-class',
  },
  'wheat-ridge': {
    size: 'suburban',
    competitive: 'low',
    pricing: 'budget-friendly',
    demographics: 'middle-class',
  },
  'englewood': {
    size: 'suburban',
    competitive: 'medium',
    pricing: 'mid-range',
    demographics: 'middle-class',
  },
  'centennial': {
    size: 'suburban',
    competitive: 'medium',
    pricing: 'premium',
    demographics: 'affluent',
  },
  'highlands-ranch': {
    size: 'suburban',
    competitive: 'medium',
    pricing: 'premium',
    demographics: 'affluent',
  },
  'greenwood-village': {
    size: 'suburban',
    competitive: 'low',
    pricing: 'premium',
    demographics: 'affluent',
  },

  // Smaller/rural areas - low competition
  'lone-tree': {
    size: 'suburban',
    competitive: 'low',
    pricing: 'premium',
    demographics: 'affluent',
  },
  'westminster': {
    size: 'suburban',
    competitive: 'medium',
    pricing: 'mid-range',
    demographics: 'middle-class',
  },
  'broomfield': {
    size: 'suburban',
    competitive: 'low',
    pricing: 'mid-range',
    demographics: 'middle-class',
  },
};

/**
 * Determine market characteristics from city/location
 */
export function getMarketCharacteristics(city: string | undefined): MarketCharacteristics {
  if (!city) {
    // Default fallback characteristics
    return {
      size: 'suburban',
      competitive: 'medium',
      pricing: 'mid-range',
      demographics: 'middle-class',
    };
  }

  const cityKey = city.toLowerCase().trim().replace(/\s+/g, '-');
  return CITY_MARKET_MAP[cityKey] || {
    size: 'suburban',
    competitive: 'medium',
    pricing: 'mid-range',
    demographics: 'middle-class',
  };
}

/**
 * Calculate match score for a content variant based on current context
 */
function calculateVariantScore(
  variant: ContentVariant,
  marketChars: MarketCharacteristics,
  careType?: string
): number {
  let score = variant.weight || 1;

  // Match market size (highest priority)
  if (variant.marketSize && variant.marketSize.includes(marketChars.size)) {
    score += 10;
  }

  // Match care type
  if (careType && variant.careTypes && variant.careTypes.includes(careType)) {
    score += 8;
  }

  // Match market characteristics
  if (variant.marketCharacteristics) {
    if (variant.marketCharacteristics.competitive?.includes(marketChars.competitive)) {
      score += 5;
    }
    if (variant.marketCharacteristics.pricing?.includes(marketChars.pricing)) {
      score += 5;
    }
    if (variant.marketCharacteristics.demographics?.includes(marketChars.demographics)) {
      score += 3;
    }
  }

  return score;
}

/**
 * Select the best content variant based on market characteristics
 */
export function selectContentVariant(
  content: string | { default: string; variants?: ContentVariant[] },
  marketChars: MarketCharacteristics,
  careType?: string
): string {
  // If content is just a string, return it
  if (typeof content === 'string') {
    return content;
  }

  // If no variants defined, return default
  if (!content.variants || content.variants.length === 0) {
    return content.default;
  }

  // Score all variants
  const scoredVariants = content.variants.map(variant => ({
    variant,
    score: calculateVariantScore(variant, marketChars, careType),
  }));

  // Sort by score (highest first)
  scoredVariants.sort((a, b) => b.score - a.score);

  // Get the best match (must have score > 0 to be considered a match)
  const bestMatch = scoredVariants[0];

  if (bestMatch && bestMatch.score > 0) {
    return typeof bestMatch.variant.content === 'string'
      ? bestMatch.variant.content
      : bestMatch.variant.content[0]; // If array, take first item
  }

  // Fallback to default
  return content.default;
}

/**
 * Select the best array content variant (for highlights, features, etc.)
 */
export function selectArrayVariant(
  content: string[] | { default: string[]; variants?: ContentVariant[] },
  marketChars: MarketCharacteristics,
  careType?: string
): string[] {
  // If content is just an array, return it
  if (Array.isArray(content)) {
    return content;
  }

  // If no variants defined, return default
  if (!content.variants || content.variants.length === 0) {
    return content.default;
  }

  // Score all variants
  const scoredVariants = content.variants.map(variant => ({
    variant,
    score: calculateVariantScore(variant, marketChars, careType),
  }));

  // Sort by score (highest first)
  scoredVariants.sort((a, b) => b.score - a.score);

  // Get the best match
  const bestMatch = scoredVariants[0];

  if (bestMatch && bestMatch.score > 0) {
    return Array.isArray(bestMatch.variant.content)
      ? bestMatch.variant.content
      : [bestMatch.variant.content];
  }

  // Fallback to default
  return content.default;
}

/**
 * Select the best object array variant (for reasons, etc.)
 */
export function selectObjectArrayVariant(
  content: any[] | { default: any[]; variants?: ContentVariant[] },
  marketChars: MarketCharacteristics,
  careType?: string
): any[] {
  // If content is just an array, return it
  if (Array.isArray(content)) {
    return content;
  }

  // If no variants defined, return default
  if (!content.variants || content.variants.length === 0) {
    return content.default;
  }

  // Score all variants
  const scoredVariants = content.variants.map(variant => ({
    variant,
    score: calculateVariantScore(variant, marketChars, careType),
  }));

  // Sort by score (highest first)
  scoredVariants.sort((a, b) => b.score - a.score);

  // Get the best match
  const bestMatch = scoredVariants[0];

  if (bestMatch && bestMatch.score > 0) {
    return Array.isArray(bestMatch.variant.content)
      ? bestMatch.variant.content
      : [bestMatch.variant.content];
  }

  // Fallback to default
  return content.default;
}

/**
 * Process an entire content section and select appropriate variants
 */
export function processContentSection(
  section: ContentSectionWithVariants,
  marketChars: MarketCharacteristics,
  careType?: string
): any {
  const processed: any = {};

  // Process heading
  if (section.heading) {
    processed.heading = selectContentVariant(section.heading as any, marketChars, careType);
  }

  // Process content
  if (section.content) {
    processed.content = selectContentVariant(section.content as any, marketChars, careType);
  }

  // Process highlights
  if (section.highlights) {
    processed.highlights = selectArrayVariant(section.highlights as any, marketChars, careType);
  }

  // Process reasons
  if (section.reasons) {
    processed.reasons = selectObjectArrayVariant(section.reasons as any, marketChars, careType);
  }

  // Process features
  if (section.features) {
    processed.features = selectArrayVariant(section.features as any, marketChars, careType);
  }

  // Process keyPoints
  if (section.keyPoints) {
    processed.keyPoints = selectArrayVariant(section.keyPoints as any, marketChars, careType);
  }

  return processed;
}
