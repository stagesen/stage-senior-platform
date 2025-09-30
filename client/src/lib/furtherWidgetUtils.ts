/**
 * Maps community slugs to their corresponding Further CSS classes
 */

type CommunitySlug = 
  | 'gardens-at-columbine'
  | 'the-gardens-on-quail'
  | 'golden-pond'
  | 'stonebridge-senior';

type FurtherCSSClass = 
  | 'columbinefurther'
  | 'quailfurther'
  | 'goldenpondfurther'
  | 'stonebridgefurther'
  | '';

const COMMUNITY_FURTHER_CLASS_MAP: Record<string, FurtherCSSClass> = {
  'gardens-at-columbine': 'columbinefurther',
  'the-gardens-on-quail': 'quailfurther',
  'golden-pond': 'goldenpondfurther',
  'stonebridge-senior': 'stonebridgefurther',
};

/**
 * Maps a community slug to its corresponding Further CSS class
 * @param slug - The community slug to map
 * @returns The corresponding Further CSS class or empty string for unknown slugs
 */
export function getCommunityFurtherClass(slug: string): FurtherCSSClass {
  return COMMUNITY_FURTHER_CLASS_MAP[slug] || '';
}

/**
 * Type guard to check if a slug is a valid community slug
 * @param slug - The slug to check
 * @returns True if the slug is a valid community slug, false otherwise
 */
export function isValidCommunitySlug(slug: string): slug is CommunitySlug {
  return slug in COMMUNITY_FURTHER_CLASS_MAP;
}