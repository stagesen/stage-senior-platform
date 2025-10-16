import { z } from "zod";
import type { LucideIcon } from "lucide-react";
import { FileText, Grid3x3, List, Snowflake, Layout, Heading, Megaphone, Image } from "lucide-react";

// Define the content structure for each section type
export const textBlockContentSchema = z.object({
  text: z.string(),
});

export const benefitCardsContentSchema = z.object({
  cards: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
  })),
});

export const featureListContentSchema = z.object({
  items: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })),
});

export const seasonalCardsContentSchema = z.object({
  cards: z.array(z.object({
    season: z.string(),
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().optional(),
  })),
});

export const featureGridContentSchema = z.object({
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
  })),
  columns: z.number().min(1).max(4).default(3),
});

export const sectionHeaderContentSchema = z.object({
  heading: z.string(),
  subheading: z.string().optional(),
});

export const ctaContentSchema = z.object({
  heading: z.string(),
  description: z.string().optional(),
  buttonText: z.string(),
  buttonLink: z.string(),
});

export const heroSectionContentSchema = z.object({
  heading: z.string(),
  description: z.string(),
  imageUrl: z.string(),
});

// Section type metadata
export interface SectionTypeMetadata {
  type: string;
  name: string;
  description: string;
  icon: LucideIcon;
  contentSchema: z.ZodType<any>;
  defaultContent: any;
  category: "text" | "cards" | "layout" | "interactive";
}

export const SECTION_TYPES: Record<string, SectionTypeMetadata> = {
  text_block: {
    type: "text_block",
    name: "Text Block",
    description: "A simple rich text content block",
    icon: FileText,
    contentSchema: textBlockContentSchema,
    defaultContent: {
      text: "",
    },
    category: "text",
  },
  benefit_cards: {
    type: "benefit_cards",
    name: "Benefit Cards",
    description: "Display benefits or features in card format",
    icon: Grid3x3,
    contentSchema: benefitCardsContentSchema,
    defaultContent: {
      cards: [
        { title: "", description: "", icon: "" },
      ],
    },
    category: "cards",
  },
  feature_list: {
    type: "feature_list",
    name: "Feature List",
    description: "A list of features with titles and descriptions",
    icon: List,
    contentSchema: featureListContentSchema,
    defaultContent: {
      items: [
        { title: "", description: "" },
      ],
    },
    category: "cards",
  },
  seasonal_cards: {
    type: "seasonal_cards",
    name: "Seasonal Cards",
    description: "Display seasonal content with images",
    icon: Snowflake,
    contentSchema: seasonalCardsContentSchema,
    defaultContent: {
      cards: [
        { season: "", title: "", description: "", imageUrl: "" },
      ],
    },
    category: "cards",
  },
  feature_grid: {
    type: "feature_grid",
    name: "Feature Grid",
    description: "Grid layout of features with icons",
    icon: Layout,
    contentSchema: featureGridContentSchema,
    defaultContent: {
      features: [
        { title: "", description: "", icon: "" },
      ],
      columns: 3,
    },
    category: "layout",
  },
  section_header: {
    type: "section_header",
    name: "Section Header",
    description: "A heading with optional subheading",
    icon: Heading,
    contentSchema: sectionHeaderContentSchema,
    defaultContent: {
      heading: "",
      subheading: "",
    },
    category: "text",
  },
  cta: {
    type: "cta",
    name: "Call to Action",
    description: "A prominent call-to-action with button",
    icon: Megaphone,
    contentSchema: ctaContentSchema,
    defaultContent: {
      heading: "",
      description: "",
      buttonText: "",
      buttonLink: "",
    },
    category: "interactive",
  },
  hero_section: {
    type: "hero_section",
    name: "Hero Section",
    description: "Hero section with heading, description, and image",
    icon: Image,
    contentSchema: heroSectionContentSchema,
    defaultContent: {
      heading: "",
      description: "",
      imageUrl: "",
    },
    category: "layout",
  },
};

// Get section type metadata by type string
export function getSectionTypeMetadata(type: string): SectionTypeMetadata | undefined {
  return SECTION_TYPES[type];
}

// Get all section types as array
export function getAllSectionTypes(): SectionTypeMetadata[] {
  return Object.values(SECTION_TYPES);
}

// Parse content safely
export function parseContent(type: string, content: string | null): any {
  const metadata = getSectionTypeMetadata(type);
  if (!metadata) return {};
  
  try {
    if (typeof content === 'string') {
      const parsed = JSON.parse(content);
      return metadata.contentSchema.parse(parsed);
    }
    return content || metadata.defaultContent;
  } catch (error) {
    console.error(`Failed to parse content for ${type}:`, error);
    return metadata.defaultContent;
  }
}

// Available pages configuration
export const AVAILABLE_PAGES = [
  { path: '/about-us', name: 'About Us', emoji: '👥', description: 'Company information and team' },
  { path: '/courtyards-patios', name: 'Courtyards & Patios', emoji: '🌳', description: 'Outdoor spaces and garden areas' },
  { path: '/dining', name: 'Dining Services', emoji: '🍽️', description: 'Restaurant-style dining and menus' },
  { path: '/beauty-salon', name: 'Beauty Salon & Barber', emoji: '💇', description: 'On-site beauty and barber services' },
  { path: '/fitness-therapy', name: 'Fitness & Therapy', emoji: '💪', description: 'Fitness center and therapy programs' },
  { path: '/safety-with-dignity', name: 'Safety with Dignity', emoji: '🛡️', description: 'Fall detection program' },
  { path: '/care-points', name: 'Care Points', emoji: '📊', description: 'Pricing system information' },
  { path: '/stage-cares', name: 'Stage Cares Foundation', emoji: '❤️', description: 'Foundation and charitable work' },
  { path: '/in-home-care', name: 'In-Home Care', emoji: '🏠', description: 'In-home care services' },
  { path: '/accessibility', name: 'Accessibility', emoji: '♿', description: 'Accessibility statement' },
  { path: '/services/management', name: 'Management Services', emoji: '🏢', description: 'Professional management' },
  { path: '/services/chaplaincy', name: 'Chaplaincy Program', emoji: '⛪', description: 'Spiritual care services' },
  { path: '/services/long-term-care', name: 'Long-Term Care', emoji: '📋', description: 'Insurance and support' },
] as const;

export function getPageInfo(path: string) {
  return AVAILABLE_PAGES.find(p => p.path === path);
}
