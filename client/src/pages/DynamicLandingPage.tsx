import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero } from "@/components/PageHero";
import TestimonialSection from "@/components/TestimonialSection";
import { TeamCarousel } from "@/components/TeamCarousel";
import GalleryModal from "@/components/GalleryModal";
import FloorPlanModal from "@/components/FloorPlanModal";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import { ExitIntentPopup, useExitIntent } from "@/components/ExitIntentPopup";
import CommunityMap from "@/components/CommunityMap";
import CommunityCredentials from "@/components/landing-sections/CommunityCredentials";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import NotFound from "@/pages/not-found";
import { generateSchemaOrgData } from "@/lib/schemaOrg";
import { getPrimaryPhoneDisplay, getPrimaryPhoneHref, getCityState } from "@/lib/communityContact";
import { toTitleCase, cn } from "@/lib/utils";
import { setMetaTags, getCanonicalUrl, formatCareType } from "@/lib/metaTags";
import {
  getMarketCharacteristics,
  processContentSection,
  type MarketCharacteristics
} from "@/lib/contentVariantSelector";
import stageLogo from '@/assets/stage-logo.webp';
import FadeIn from "@/components/animations/FadeIn";
import ScaleHeader from "@/components/animations/ScaleHeader";
import StaggerContainer from "@/components/animations/StaggerContainer";
import StaggerItem from "@/components/animations/StaggerItem";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Image as ImageIcon,
  Users,
  Home,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Bed,
  Bath,
  Square,
  Shield,
  Award,
  Clock,
  TrendingUp,
  Download,
  MessageCircle,
  Navigation,
  ChevronRight,
  Trees,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type {
  LandingPageTemplate,
  Community,
  Gallery,
  Testimonial,
  TeamMember,
  Faq,
  FloorPlan,
  GalleryImageWithDetails,
  CommunityHighlight,
  Amenity,
  CareType,
  PageContentSection,
} from "@shared/schema";

// City-to-cluster mapping function
const mapCityToCluster = (city: string | undefined): string | undefined => {
  if (!city) return undefined;
  
  const cityLower = city.toLowerCase().trim();
  
  // Direct cluster mappings
  const clusterMap: Record<string, string> = {
    'littleton': 'littleton',
    'arvada': 'arvada',
    'golden': 'golden',
    'englewood': 'littleton',  // nearby
    'lakewood': 'golden',      // nearby
    'wheat-ridge': 'arvada',   // nearby
    'denver': 'littleton',     // default fallback
    'highlands-ranch': 'littleton',
    'aurora': 'arvada',
    'westminster': 'arvada',
    'centennial': 'littleton',
    'broomfield': 'arvada',
    'lone-tree': 'littleton',
    'greenwood-village': 'littleton',
  };
  
  return clusterMap[cityLower];
};

// Token replacement configuration and fallbacks
interface TokenConfig {
  value: string;
  fallback: string;
  isRequired?: boolean;
}

interface TokenValidationResult {
  hasErrors: boolean;
  missingTokens: string[];
  processedText: string;
}

// Default fallback values for common tokens
const TOKEN_FALLBACKS: Record<string, string> = {
  city: "Colorado",
  careType: "Senior Living",
  communityName: "Stage Senior",
  location: "Colorado",
};

// Helper function to replace tokens in text with validation and fallbacks
const replaceTokens = (
  text: string | undefined | null,
  tokens: Record<string, string>
): string => {
  // Handle undefined or null text
  if (!text) {
    return "";
  }

  const result = replaceTokensWithValidation(text, tokens);

  // Log warnings for missing tokens in development
  if (result.hasErrors && result.missingTokens.length > 0) {
    console.warn(
      `[Token Replacement Warning] Missing or empty tokens detected:`,
      result.missingTokens.join(", "),
      `\nOriginal text: "${text}"`
    );
  }

  return result.processedText;
};

// Advanced token replacement with validation and smart fallbacks
const replaceTokensWithValidation = (
  text: string,
  tokens: Record<string, string>
): TokenValidationResult => {
  let result = text;
  const missingTokens: string[] = [];
  let hasErrors = false;

  // Build token configs with fallbacks
  const tokenConfigs: Record<string, TokenConfig> = {};
  Object.entries(tokens).forEach(([key, value]) => {
    tokenConfigs[key] = {
      value: value?.trim() || "",
      fallback: TOKEN_FALLBACKS[key] || "",
      isRequired: ["city", "careType"].includes(key),
    };
  });

  // First pass: Detect empty tokens and track issues
  Object.entries(tokenConfigs).forEach(([key, config]) => {
    const regex = new RegExp(`\\{${key}\\}`, "gi");

    if (regex.test(text)) {
      if (!config.value) {
        hasErrors = true;
        missingTokens.push(key);
      }
    }
  });

  // Second pass: Replace tokens with smart fallbacks
  Object.entries(tokenConfigs).forEach(([key, config]) => {
    const regex = new RegExp(`\\{${key}\\}`, "gi");
    const replacementValue = config.value || config.fallback;

    result = result.replace(regex, replacementValue);
  });

  // Third pass: Clean up awkward sentence structures
  result = cleanUpTokenReplacementArtifacts(result);

  return {
    hasErrors,
    missingTokens,
    processedText: result,
  };
};

// Clean up common artifacts from token replacement
const cleanUpTokenReplacementArtifacts = (text: string): string => {
  let cleaned = text;

  // Remove awkward patterns like "in , Colorado" -> "in Colorado"
  cleaned = cleaned.replace(/\bin\s*,\s*/gi, "in ");

  // Remove patterns like "to in " -> "to "
  cleaned = cleaned.replace(/\bto\s+in\s+$/gi, "to ");

  // Remove double spaces
  cleaned = cleaned.replace(/\s{2,}/g, " ");

  // Remove trailing commas and spaces
  cleaned = cleaned.replace(/,\s*$/, "");

  // Remove patterns like "Living in ," -> "Living in Colorado"
  // This catches cases where city was empty but we still have the structure
  cleaned = cleaned.replace(/\bin\s*,/gi, "in");

  // Clean up patterns like "Welcome to in" -> "Welcome to"
  cleaned = cleaned.replace(/\bto\s+in\s*$/i, "to");

  // Trim whitespace
  cleaned = cleaned.trim();

  // Capitalize common care types and terms
  cleaned = capitalizeCommonTerms(cleaned);

  return cleaned;
};

// Capitalize common care types and other terms that should always be title case
const capitalizeCommonTerms = (text: string): string => {
  let result = text;

  // Care types - case insensitive replacement
  const careTypeMap: Record<string, string> = {
    'assisted living': 'Assisted Living',
    'memory care': 'Memory Care',
    'independent living': 'Independent Living',
    'skilled nursing': 'Skilled Nursing',
    'senior living': 'Senior Living',
  };

  // Replace each care type with proper capitalization
  Object.entries(careTypeMap).forEach(([lowercase, titleCase]) => {
    // Use word boundary regex for accurate replacement
    const regex = new RegExp(`\\b${lowercase}\\b`, 'gi');
    result = result.replace(regex, titleCase);
  });

  return result;
};

// SEO-friendly fallback content for pages with missing data
interface FallbackContent {
  title: string;
  subtitle?: string;
  metaDescription: string;
}

const getFallbackContent = (
  pageType: "city" | "careType" | "generic",
  tokens: Record<string, string>
): FallbackContent => {
  const careType = tokens.careType || "Senior Living";
  const city = tokens.city || "Colorado";

  switch (pageType) {
    case "city":
      return {
        title: `${careType} in ${city}`,
        subtitle: `Discover exceptional ${careType.toLowerCase()} communities in ${city}`,
        metaDescription: `Explore top-rated ${careType.toLowerCase()} options in ${city}. Schedule a tour today and find the perfect community for your loved ones.`,
      };
    case "careType":
      return {
        title: `${careType} Communities`,
        subtitle: `Experience compassionate ${careType.toLowerCase()} at Stage Senior`,
        metaDescription: `Stage Senior offers exceptional ${careType.toLowerCase()} with personalized care, engaging activities, and comfortable living spaces. Schedule a tour today.`,
      };
    case "generic":
    default:
      return {
        title: "Senior Living Communities in Colorado",
        subtitle: "Discover Stage Senior's exceptional care and vibrant community life",
        metaDescription: "Stage Senior provides exceptional senior living in Colorado with personalized care, engaging activities, and comfortable living spaces. Schedule a tour today.",
      };
  }
};

// Helper function for formatting prices
const formatPrice = (price: number | undefined | null): string => {
  if (price === null || price === undefined) return "Contact for pricing";
  if (price === 0) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Feature Section component - Alternating left/right layout
const FeatureSection = ({ 
  highlight,
  imageLeft = false
}: { 
  highlight: CommunityHighlight;
  imageLeft?: boolean;
}) => {
  const highlightImageUrl = useResolveImageUrl(highlight.imageId);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className={`${imageLeft ? 'md:order-2' : ''}`}>
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">{highlight.title}</h3>
        <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">{highlight.description}</p>
        {highlight.ctaLabel && highlight.ctaHref && (
          <Button 
            variant="outline" 
            size="lg" 
            asChild 
            data-testid={`button-feature-${highlight.id}`}
          >
            <a href={highlight.ctaHref}>
              {highlight.ctaLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        )}
      </div>
      <div className={`${imageLeft ? 'md:order-1' : ''}`}>
        {highlightImageUrl && (
          <AspectRatio ratio={4/3}>
            <img
              src={highlightImageUrl}
              alt={highlight.title}
              className="w-full h-full object-cover rounded-2xl shadow-xl"
              loading="lazy"
            />
          </AspectRatio>
        )}
      </div>
    </div>
  );
};

// Floor Plan Card component - Properly resolves images using hook
const FloorPlanCard = ({ plan, onClick }: { plan: FloorPlan; onClick: () => void }) => {
  const planImageUrl = useResolveImageUrl(plan.imageId) || plan.imageUrl || plan.planImageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
  
  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={onClick}
      data-testid={`floor-plan-card-${plan.id}`}
    >
      <AspectRatio ratio={4 / 3}>
        <img
          src={planImageUrl}
          alt={plan.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </AspectRatio>
      <CardContent className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-3">{plan.name}</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          {plan.bedrooms > 0 && (
            <div className="flex items-center gap-1 text-sm md:text-base text-muted-foreground">
              <Bed className="w-4 h-4" />
              <span>{plan.bedrooms} Bed</span>
            </div>
          )}
          {plan.bathrooms && Number(plan.bathrooms) > 0 && (
            <div className="flex items-center gap-1 text-sm md:text-base text-muted-foreground">
              <Bath className="w-4 h-4" />
              <span>{plan.bathrooms} Bath</span>
            </div>
          )}
          {plan.squareFeet && (
            <div className="flex items-center gap-1 text-sm md:text-base text-muted-foreground">
              <Square className="w-4 h-4" />
              <span>{plan.squareFeet} sq ft</span>
            </div>
          )}
        </div>
        {plan.startingPrice && (
          <div className="mb-4">
            <p className="text-xs md:text-sm text-muted-foreground">Starting at</p>
            <p className="text-xl md:text-2xl font-bold text-primary">
              {formatPrice(plan.startingPrice)}/mo
            </p>
          </div>
        )}
        <Button
          variant="outline"
          className="w-full min-h-[44px] group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          data-testid={`button-view-floor-plan-${plan.id}`}
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

// Community Card component - Properly resolves images using hook
const CommunityCardLP = ({ community }: { community: Community }) => {
  // Use useResolveImageUrl to handle both UUIDs and direct URLs
  const communityImageUrl = useResolveImageUrl(community.heroImageUrl || community.imageId) || "https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?w=800&q=80";
  
  return (
    <Card
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 group"
      data-testid={`community-card-${community.id}`}
    >
      <AspectRatio ratio={16 / 9}>
        <img
          src={communityImageUrl}
          alt={community.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </AspectRatio>
      <CardContent className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-2">{community.name}</h3>
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {getCityState(community)}
          </span>
        </div>
        {community.shortDescription && (
          <p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-3">
            {community.shortDescription}
          </p>
        )}
        <Button
          asChild
          className="w-full min-h-[44px]"
          data-testid={`button-view-community-${community.id}`}
        >
          <a href={`/communities/${community.slug}`}>
            Learn More
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

// Gallery Overview component - Shows galleries with preview grids
const GalleryOverview = ({ galleries, onGallerySelect }: { galleries: Gallery[], onGallerySelect: (gallery: Gallery) => void }) => {
  // Map our gallery categories to icons
  const categoryConfig: Record<string, { icon: typeof Users; displayName: string }> = {
    'life-activities': { icon: Users, displayName: 'Life & Activities' },
    'apartments-spaces': { icon: Home, displayName: 'Apartments & Spaces' },
    'care-team': { icon: Heart, displayName: 'Care & Team' },
    'outdoors-colorado': { icon: Trees, displayName: 'Outdoors & Colorado' },
  };

  // Ensure galleries is always an array
  const items = galleries ?? [];

  // Get galleries with images for the main grid (show first 4 galleries)
  const galleriesWithImages = items.filter(g => g.images && g.images.length > 0);
  const mainGalleries = galleriesWithImages.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Gallery Cards Grid - Show first 4 galleries as cards */}
      {mainGalleries.length > 0 && (
        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {mainGalleries.map((gallery) => {
            const images = gallery.images || [];
            const totalImages = images.length;
            const previewImages = images.slice(0, 4);

            return (
              <StaggerItem key={gallery.id}>
                <Card 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-gray-50 to-white border-gray-200"
                  onClick={() => onGallerySelect(gallery)}
                  data-testid={`gallery-card-${gallery.id}`}
                >
                {/* Gallery Preview Grid */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  {previewImages.length > 0 && (
                    <div className={`grid ${previewImages.length === 1 ? 'grid-cols-1' : previewImages.length === 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-0.5 h-full`}>
                      {previewImages.map((image: { url: string; alt?: string }, idx: number) => (
                        <div 
                          key={idx}
                          className={`relative overflow-hidden ${
                            previewImages.length === 3 && idx === 0 ? 'col-span-2' : ''
                          } ${previewImages.length === 4 ? '' : ''}`}
                        >
                          <img
                            src={image.url}
                            alt={image.alt || `${gallery.title} image ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Overlay with fade effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* View Gallery Text on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <span className="text-gray-900 font-semibold flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        View Gallery
                      </span>
                    </div>
                  </div>

                  {/* Image Count Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-lg">
                    <ImageIcon className="w-4 h-4" />
                    <span>{totalImages} {totalImages === 1 ? 'Photo' : 'Photos'}</span>
                  </div>
                </div>

                {/* Gallery Info */}
                <CardContent className="p-5 bg-white">
                  <h3 className="font-bold text-xl text-gray-900 mb-1.5 group-hover:text-primary transition-colors" data-testid={`gallery-title-${gallery.id}`}>
                    {gallery.title}
                  </h3>
                  {gallery.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {gallery.description}
                    </p>
                  )}
                  <div className="flex items-center mt-3 text-primary group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium">Explore Gallery</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      {/* Gallery Category Cards - Additional galleries or categories */}
      {items.length > 4 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.slice(4, 8).map((gallery) => {
            const config = gallery.category ? (categoryConfig[gallery.category] || { icon: ImageIcon, displayName: gallery.title }) : { icon: ImageIcon, displayName: gallery.title };
            const IconComponent = config.icon;
            const coverImage = gallery.images?.[0];
            const totalImages = gallery.images?.length || 0;

            return (
              <Card 
                key={gallery.id} 
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => onGallerySelect(gallery)}
                data-testid={`gallery-category-${gallery.category}`}
              >
                <AspectRatio ratio={4/3}>
                  {coverImage ? (
                    <img
                      src={coverImage.url}
                      alt={coverImage.alt || `${gallery.title} gallery`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                      <IconComponent className="w-12 h-12 text-primary/30" />
                    </div>
                  )}
                </AspectRatio>
                <CardContent className="p-3">
                  <h4 className="font-semibold text-sm mb-1">{config.displayName}</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    <span>{totalImages} {totalImages === 1 ? 'Photo' : 'Photos'}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Export token utilities for testing and debugging
// Can be accessed via window.tokenUtils in browser console
if (typeof window !== 'undefined') {
  (window as any).tokenUtils = {
    replaceTokens,
    replaceTokensWithValidation,
    cleanUpTokenReplacementArtifacts,
    TOKEN_FALLBACKS,
    testTokenReplacement: (text: string, tokens: Record<string, string>) => {
      console.log('Input text:', text);
      console.log('Input tokens:', tokens);
      const result = replaceTokensWithValidation(text, tokens);
      console.log('Output:', result.processedText);
      console.log('Has errors:', result.hasErrors);
      console.log('Missing tokens:', result.missingTokens);
      return result;
    }
  };
}

export default function DynamicLandingPage() {
  const params = useParams();
  const [location] = useLocation();
  const { openScheduleTour } = useScheduleTour();
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>("overview");
  const [showStickyMobileCTA, setShowStickyMobileCTA] = useState(false);

  // Fetch exit intent popup configuration
  const { data: exitIntentConfig } = useQuery<{active: boolean}>({
    queryKey: ["/api/exit-intent-popup"],
    select: (data: any) => ({ active: data?.active || false }),
  });

  // Enable exit intent detection if popup is active
  const { showPopup, setShowPopup } = useExitIntent(exitIntentConfig?.active);

  // Strip query params from location for efficient caching
  // This ensures URLs with different UTM parameters use the same cache entry
  const pathname = location.split('?')[0];

  // Fetch all landing page data in one consolidated request
  // This replaces 10 separate API calls with a single request for better performance
  const { data: pageData, isLoading: templateLoading, error: templateError } = useQuery<{
    template: LandingPageTemplate;
    params: Record<string, string>;
    primaryCommunity: Community;
    allCommunities: Community[];
    highlights: CommunityHighlight[];
    amenities: Amenity[];
    careTypes: CareType[];
    galleries?: Gallery[];
    testimonials?: Testimonial[];
    teamMembers?: TeamMember[];
    faqs?: Faq[];
    floorPlans?: FloorPlan[];
  }>({
    queryKey: ["/api/landing-page-templates/resolve/full", pathname],
    queryFn: async () => {
      const response = await fetch(`/api/landing-page-templates/resolve/full?url=${encodeURIComponent(pathname)}`);

      if (!response.ok) {
        throw new Error("Template not found");
      }

      return response.json();
    },
  });

  const template = pageData?.template;
  const urlParams = pageData?.params || {};
  const primaryCommunity = pageData?.primaryCommunity;
  const communityHighlights = pageData?.highlights || [];
  const communityAmenities = pageData?.amenities || [];
  const communityCareTypes = pageData?.careTypes || [];
  const galleries = pageData?.galleries || [];
  const testimonials = pageData?.testimonials || [];
  const teamMembers = pageData?.teamMembers || [];

  // Extract care type from URL pattern and params
  const getCareTypeSlug = (): string | null => {
    // Try URL pattern first
    if (template?.urlPattern) {
      if (template.urlPattern.includes('assisted-living')) return 'assisted-living';
      if (template.urlPattern.includes('memory-care')) return 'memory-care';
      if (template.urlPattern.includes('independent-living')) return 'independent-living';
      if (template.urlPattern.includes('skilled-nursing')) return 'skilled-nursing';
    }

    // Try URL params
    if (urlParams.careType) return urlParams.careType.toLowerCase();

    return null;
  };

  const careTypeSlug = getCareTypeSlug();

  // Build query parameters for server-side filtering
  // This replaces client-side filtering for better performance
  const buildCommunityFilters = () => {
    const filters: Record<string, string> = {
      activeOnly: 'true',
    };

    // Extract city from URL params
    const city = urlParams.city || (template?.cities && template.cities.length > 0 ? template.cities[0] : undefined);
    
    // Map city to cluster and use cluster filter instead of city
    const cluster = mapCityToCluster(city);
    
    if (cluster) {
      filters.cluster = cluster;
    } else if (city) {
      // Fallback to city if no cluster mapping exists
      filters.city = city;
    }

    // Add care type filter if present
    if (careTypeSlug) {
      filters.careType = careTypeSlug;
    }

    return filters;
  };

  const communityFilters = buildCommunityFilters();

  // Fetch filtered communities from server - replaces client-side filtering
  // Only fetch if we need to show alternative communities (when not showing a single community)
  const shouldFetchCommunities = !template?.communityId;
  const { data: filteredCommunities = [] } = useQuery<Community[]>({
    queryKey: ['/api/communities', communityFilters],
    queryFn: async () => {
      const queryParams = new URLSearchParams(communityFilters);
      const response = await fetch(`/api/communities?${queryParams}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch communities");
      }
      
      return response.json();
    },
    enabled: shouldFetchCommunities && !!template,
  });

  // Use server-filtered communities (no more client-side filtering needed!)
  const targetCommunities = template?.communityId 
    ? [primaryCommunity].filter(Boolean) as Community[]
    : filteredCommunities;

  // Determine the page path pattern for fetching page content sections
  const getPagePathPattern = (): string => {
    // For /:careLevel/:city pages, use "/:careLevel/:city"
    // For /cost/:careLevel/:city pages, use "/cost/:careLevel/:city"
    if (template?.urlPattern) {
      // Extract pattern by replacing dynamic segments
      return template.urlPattern
        .replace(':careLevel', urlParams.careLevel || careTypeSlug || 'assisted-living')
        .replace(':city', urlParams.city || 'littleton');
    }
    return pathname;
  };

  const pagePathPattern = getPagePathPattern();

  // Fetch page content sections for this page
  const { data: pageSections = [] } = useQuery<PageContentSection[]>({
    queryKey: ['/api/page-content', pagePathPattern],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        pagePath: pagePathPattern,
        active: 'true',
      });
      const response = await fetch(`/api/page-content?${queryParams}`);
      
      if (!response.ok) {
        // If sections not found, return empty array (not an error)
        if (response.status === 404) return [];
        throw new Error("Failed to fetch page content sections");
      }
      
      return response.json();
    },
    throwOnError: false,
    enabled: !!template,
  });

  // Sort page sections by sortOrder and filter for active sections
  const activeSections = pageSections
    .filter(section => section.active)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Simple care type name mapping for token replacement
  // Includes alternative names for Memory Care (alzheimers-care, dementia-care)
  const getCareTypeName = () => {
    if (careTypeSlug === 'assisted-living') return "Assisted Living";
    if (careTypeSlug === 'memory-care') return "Memory Care";
    if (careTypeSlug === 'alzheimers-care') return "Memory Care";
    if (careTypeSlug === 'dementia-care') return "Memory Care";
    if (careTypeSlug === 'independent-living') return "Independent Living";
    if (careTypeSlug === 'skilled-nursing') return "Skilled Nursing";
    return "Senior Living";
  };

  // Filter FAQs by care type if specified in the template
  // Exclude FAQs that mention ONLY irrelevant care types
  const allFaqs = pageData?.faqs || [];
  const faqs = careTypeSlug
    ? allFaqs.filter(faq => {
        const currentCareType = getCareTypeName().toLowerCase();
        const questionAndAnswer = (faq.question + ' ' + faq.answer).toLowerCase();

        // List of care types to check
        const careTypes = [
          'independent living',
          'assisted living',
          'memory care',
          'skilled nursing'
        ];

        // If FAQ mentions the current care type, include it
        if (questionAndAnswer.includes(currentCareType)) {
          return true;
        }

        // If FAQ mentions other care types but not the current one, exclude it
        const mentionsOtherCareTypes = careTypes
          .filter(type => type !== currentCareType)
          .some(type => questionAndAnswer.includes(type));

        // Exclude FAQs that mention other care types but not current one
        return !mentionsOtherCareTypes;
      })
    : allFaqs;

  // Filter floor plans by care type if specified in the template
  const allFloorPlans = pageData?.floorPlans || [];
  const floorPlans = careTypeSlug
    ? allFloorPlans.filter(fp =>
        fp.name.toLowerCase().includes(getCareTypeName().toLowerCase())
      )
    : allFloorPlans;

  // Build tokens for replacement with validation and smart defaults
  const buildTokens = (): Record<string, string> => {
    const cityValue = urlParams.city || primaryCommunity?.city || "";
    const careTypeName = getCareTypeName();
    const locationValue = urlParams.location || primaryCommunity?.city || "";

    // Ensure we have sensible values - use fallbacks if primary values are empty
    const city = toTitleCase(cityValue) || TOKEN_FALLBACKS.city;
    const careType = toTitleCase(careTypeName) || TOKEN_FALLBACKS.careType;
    const communityName = primaryCommunity?.name || TOKEN_FALLBACKS.communityName;
    const location = toTitleCase(locationValue) || TOKEN_FALLBACKS.location;

    return {
      city,
      careType,
      communityName,
      location,
    };
  };

  const tokens = buildTokens();

  // Determine market characteristics for content variant selection
  const cityValue = urlParams.city || primaryCommunity?.city;
  const marketCharacteristics = getMarketCharacteristics(cityValue);

  // Validate token health and log warnings for admins
  useEffect(() => {
    if (!template) return;

    const validateTokens = () => {
      const issues: string[] = [];

      // Check if we're using fallback values (indicates missing data)
      if (tokens.city === TOKEN_FALLBACKS.city && !primaryCommunity?.city) {
        issues.push("City information is missing - using fallback: 'Colorado'");
      }

      if (tokens.careType === TOKEN_FALLBACKS.careType && !careTypeSlug) {
        issues.push("Care type information is missing - using fallback: 'Senior Living'");
      }

      if (tokens.communityName === TOKEN_FALLBACKS.communityName && !primaryCommunity?.name) {
        issues.push("Community name is missing - using fallback: 'Stage Senior'");
      }

      // Check if template has token placeholders that might not be filled
      const templateTexts = [
        template.title,
        template.heroTitle,
        template.heroSubtitle,
        template.metaDescription,
        template.h1Headline,
        template.subheadline,
      ].filter(Boolean) as string[];

      const allTemplateText = templateTexts.join(" ");
      const tokenPattern = /\{(\w+)\}/g;
      const foundTokens = Array.from(allTemplateText.matchAll(tokenPattern)).map(m => m[1]);

      foundTokens.forEach(tokenKey => {
        if (!tokens[tokenKey] || tokens[tokenKey] === TOKEN_FALLBACKS[tokenKey]) {
          issues.push(`Template uses token {${tokenKey}} but value is missing or using fallback`);
        }
      });

      if (issues.length > 0) {
        console.warn(
          `[Page Token Validation] Landing page "${template.title || 'Unknown'}" has token issues:`,
          issues
        );
        console.info(
          `Current tokens:`,
          tokens
        );
      }
    };

    validateTokens();
  }, [template, tokens, primaryCommunity, careTypeSlug]);

  // Set page title and meta description with OG tags and canonical URL
  useEffect(() => {
    if (template) {
      const title = replaceTokens(template.title, tokens);
      const finalTitle = title.includes('Stage Senior') ? title : `${title} | Stage Senior`;
      const description = template.metaDescription 
        ? replaceTokens(template.metaDescription, tokens) 
        : '';
      
      const heroImageUrl = primaryCommunity?.heroImageUrl 
        ? (primaryCommunity.heroImageUrl.startsWith('http') 
          ? primaryCommunity.heroImageUrl 
          : `${window.location.origin}/api/images/${primaryCommunity.heroImageUrl}`)
        : `${window.location.origin}${stageLogo}`;

      setMetaTags({
        title: finalTitle,
        description: description,
        canonicalUrl: getCanonicalUrl(pathname),
        ogType: careTypeSlug ? "website" : "place",
        ogImage: heroImageUrl,
        ogLocality: tokens.city,
        ogRegion: "CO",
      });
    }
  }, [template, tokens, pathname, primaryCommunity, careTypeSlug]);

  // Inject Schema.org structured data for SEO
  useEffect(() => {
    if (!template) return;

    // Generate Schema.org data
    const schemas = generateSchemaOrgData({
      community: primaryCommunity,
      careType: careTypeSlug || undefined,
      template,
      pathname,
    });

    // Create script tags for each schema
    const scriptTags: HTMLScriptElement[] = [];

    schemas.forEach((schema, index) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = `schema-org-${index}`;
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      scriptTags.push(script);
    });

    // Cleanup function to remove script tags when component unmounts or dependencies change
    return () => {
      scriptTags.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [template, primaryCommunity, careTypeSlug, pathname]);

  // Scroll tracking for sticky mobile CTA
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyMobileCTA(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Resolve hero image - prioritize community's hero image over template's
  // Note: heroImageUrl can contain either image IDs or direct URLs, useResolveImageUrl handles both
  const heroImageUrl = useResolveImageUrl(primaryCommunity?.heroImageUrl || template?.heroImageId);
  
  // Resolve community logo image
  const communityLogoUrl = useResolveImageUrl(primaryCommunity?.logoImageId);

  // Loading state
  if (templateLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Skeleton className="h-[500px] w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-12 w-2/3 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Template not found - show NotFound component
  if (!templateLoading && (!template || templateError)) {
    return <NotFound />;
  }

  // Guard to ensure template is defined (TypeScript type narrowing)
  if (!template) {
    return null;
  }

  const pageTitle = toTitleCase(template.heroTitle || template.h1Headline || template.title);
  const pageSubtitle = template.heroSubtitle || template.subheadline;

  // Inline Components
  /* DEPRECATED: Hard-coded trust badges and stats - replaced with database-driven CommunityCredentials component
  const TrustBadgeBar = () => (
    <section className="bg-primary/5 border-y border-primary/10 py-6 md:py-4" data-testid="trust-badge-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-8 h-8 md:w-6 md:h-6 text-primary" />
            <span className="text-sm md:text-base font-semibold">Licensed & Insured</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <TrendingUp className="w-8 h-8 md:w-6 md:h-6 text-primary" />
            <span className="text-sm md:text-base font-semibold">Locally Owned Since 2016</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Clock className="w-8 h-8 md:w-6 md:h-6 text-primary" />
            <span className="text-sm md:text-base font-semibold">Same-Day Tours</span>
          </div>
        </div>
      </div>
    </section>
  );

  const StatsStrip = () => (
    <section className="py-12 md:py-16" data-testid="stats-strip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
          <StaggerItem>
            <Card className="text-center p-6 md:p-8 border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
                <p className="text-base md:text-lg text-muted-foreground">Families Trust Us</p>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="text-center p-6 md:p-8 border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">20+</div>
                <p className="text-base md:text-lg text-muted-foreground">Years of Excellence</p>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
  */

  const ScarcityNotice = () => (
    <section className="py-6 md:py-8 bg-amber-50 border-y border-amber-200" data-testid="scarcity-notice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
          <div className="flex items-center gap-2 text-amber-700">
            <Clock className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-semibold text-sm md:text-base">Limited Availability</span>
          </div>
          <p className="text-sm md:text-base text-amber-900">
            Only a few tour slots available this week. Schedule yours today!
          </p>
        </div>
      </div>
    </section>
  );

  type CTAVariant = "primary" | "secondary" | "tertiary";

  const CTASection = ({ 
    variant = "primary", 
    heading, 
    subheading, 
    ctaText 
  }: { 
    variant?: CTAVariant; 
    heading: string; 
    subheading?: string; 
    ctaText: string;
  }) => {
    const bgColors = {
      primary: "bg-primary text-white",
      secondary: "bg-gray-50",
      tertiary: "bg-white",
    };

    const buttonVariants = {
      primary: "secondary" as const,
      secondary: "default" as const,
      tertiary: "outline" as const,
    };

    return (
      <section className={`py-12 md:py-16 ${bgColors[variant]}`} data-testid={`cta-section-${variant}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${variant === "primary" ? "text-white" : "text-foreground"}`}>
            {heading}
          </h2>
          {subheading && (
            <p className={`text-lg md:text-xl mb-8 max-w-3xl mx-auto ${variant === "primary" ? "text-white/90" : "text-muted-foreground"}`}>
              {subheading}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() =>
                openScheduleTour({
                  communityId: primaryCommunity?.id,
                  communityName: primaryCommunity?.name,
                  title: `Schedule a Tour${primaryCommunity?.name ? ` at ${primaryCommunity.name}` : ""}`,
                })
              }
              className={`min-h-[44px] w-full sm:w-auto talkfurther-schedule-tour ${primaryCommunity?.slug ? `community-${primaryCommunity.slug}` : ''} ${variant === "primary" ? "bg-white text-primary hover:bg-white/90" : ""}`}
              data-community-id={primaryCommunity?.id}
              data-community-slug={primaryCommunity?.slug}
              data-community-name={primaryCommunity?.name}
              data-testid={`button-cta-${variant}`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              {ctaText}
            </Button>
            {primaryCommunity?.phoneDisplay && (
              <Button
                size="lg"
                asChild
                className={`min-h-[44px] w-full sm:w-auto ${variant === "primary" ? "bg-white text-primary hover:bg-white/90" : "variant-outline"}`}
                data-testid={`button-phone-${variant}`}
              >
                <a href={getPrimaryPhoneHref(primaryCommunity)}>
                  <Phone className="w-5 h-5 mr-2" />
                  {getPrimaryPhoneDisplay(primaryCommunity)}
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  };

  const StickyMobileCTA = () => {
    if (!showStickyMobileCTA) return null;

    return (
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200 pb-safe"
        data-testid="sticky-mobile-cta"
      >
        <div className="grid grid-cols-2 gap-2 p-3">
          <Button
            size="lg"
            onClick={() =>
              openScheduleTour({
                communityId: primaryCommunity?.id,
                communityName: primaryCommunity?.name,
                title: `Schedule a Tour${primaryCommunity?.name ? ` at ${primaryCommunity.name}` : ""}`,
              })
            }
            className={`min-h-[44px] w-full talkfurther-schedule-tour ${primaryCommunity?.slug ? `community-${primaryCommunity.slug}` : ''}`}
            data-community-id={primaryCommunity?.id}
            data-community-slug={primaryCommunity?.slug}
            data-community-name={primaryCommunity?.name}
            data-testid="button-sticky-schedule-tour"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Tour
          </Button>
          {primaryCommunity?.phoneDisplay && (
            <Button
              size="lg"
              variant="outline"
              asChild
              className="min-h-[44px] w-full"
              data-testid="button-sticky-call"
            >
              <a href={getPrimaryPhoneHref(primaryCommunity)}>
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white" data-testid="dynamic-landing-page">
      {/* 1. Hero Section with CTA Overlay */}
      <div className="relative">
        <PageHero
          pagePath={pathname}
          defaultTitle={replaceTokens(pageTitle, tokens)}
          defaultSubtitle={pageSubtitle ? replaceTokens(pageSubtitle, tokens) : undefined}
          defaultBackgroundImage={heroImageUrl || undefined}
          logoUrl={communityLogoUrl || undefined}
          logoAlt={`${primaryCommunity?.name} logo`}
        />
        
        {/* CTA Overlay - Bottom of hero */}
        <FadeIn direction="up" delay={0.3}>
          <div className="absolute bottom-0 left-0 right-0 w-full z-30 py-6 md:py-8" data-testid="hero-cta-overlay">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                <Button
                  size="lg"
                  onClick={() =>
                    openScheduleTour({
                      communityId: primaryCommunity?.id,
                      communityName: primaryCommunity?.name,
                      title: `Schedule a Tour${primaryCommunity?.name ? ` at ${primaryCommunity.name}` : ""}`,
                    })
                  }
                  className={`min-h-[56px] px-8 text-lg w-full md:w-auto shadow-lg hover:shadow-xl transition-shadow talkfurther-schedule-tour ${primaryCommunity?.slug ? `community-${primaryCommunity.slug}` : ''}`}
                  data-community-id={primaryCommunity?.id}
                  data-community-slug={primaryCommunity?.slug}
                  data-community-name={primaryCommunity?.name}
                  data-testid="button-hero-cta-schedule"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {template.heroCtaText || "Schedule Your Free Tour"}
                </Button>
                {primaryCommunity?.phoneDisplay && (
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="min-h-[56px] px-8 text-lg w-full md:w-auto border-2 border-white text-white hover:bg-white/20"
                    data-testid="button-hero-cta-phone"
                  >
                    <a href={getPrimaryPhoneHref(primaryCommunity)}>
                      <Phone className="w-5 h-5 mr-2" />
                      {getPrimaryPhoneDisplay(primaryCommunity)}
                    </a>
                  </Button>
                )}
              </div>
              <p className="text-center text-sm text-white/90 mt-4">
                <Clock className="w-4 h-4 inline mr-1" />
                Same-day tours available • No obligation • Free parking
              </p>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* 1b. Map Section - Show on "near me" and "best" pages */}
      {template.urlPattern && (template.urlPattern.includes('-near-me') || template.urlPattern.includes('/best-')) && filteredCommunities.length > 0 && (
        <FadeIn direction="up" delay={0.2}>
          <section className="w-full" data-testid="section-community-map" style={{ height: '500px' }}>
            <CommunityMap 
              communities={filteredCommunities}
              selectedCommunityId={primaryCommunity?.id}
            />
          </section>
        </FadeIn>
      )}

      {/* Sticky Navigation Bar */}
      {(() => {
        const navSections = [];
        
        if (template.customContent) {
          navSections.push({ id: 'content', label: 'Overview', icon: Home });
        }
        if ((template.showPricing || template.showFloorPlans) && floorPlans.length > 0) {
          navSections.push({ id: 'floor-plans', label: 'Floor Plans', icon: Home });
        }
        if (template.showGallery && galleries.length > 0) {
          navSections.push({ id: 'gallery', label: 'Gallery', icon: ImageIcon });
        }
        if (template.showTestimonials && testimonials.length > 0) {
          navSections.push({ id: 'testimonials', label: 'Reviews', icon: Star });
        }
        if (communityAmenities.length > 0) {
          navSections.push({ id: 'amenities', label: 'Amenities', icon: CheckCircle });
        }
        if (primaryCommunity && (primaryCommunity.street || primaryCommunity.lat)) {
          navSections.push({ id: 'location', label: 'Location', icon: MapPin });
        }

        const handleNavClick = (sectionId: string) => {
          const element = document.getElementById(sectionId);
          if (!element) return;

          const navElement = document.querySelector<HTMLElement>('[data-landing-sticky-nav]');
          const offset = (navElement?.offsetHeight ?? 0) + 16;

          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition < 0 ? 0 : offsetPosition,
            behavior: "smooth",
          });

          setActiveSection(sectionId);
        };

        return navSections.length > 0 ? (
          <div 
            className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm"
            data-landing-sticky-nav
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex gap-2 overflow-x-auto py-3 scrollbar-hide" aria-label="Page sections">
                {navSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => handleNavClick(section.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all text-sm font-medium",
                        activeSection === section.id
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      data-testid={`nav-${section.id}`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        ) : null;
      })()}

      {/* 1c. Custom Content Sections - Template-specific helpful content (MOVED UP) */}
      {template.customContent && (
        <>
          {/* Intro Section */}
          {template.customContent.introSection && (() => {
            // Process intro section with smart content variant selection
            const processedIntro = processContentSection(
              template.customContent.introSection,
              marketCharacteristics,
              careTypeSlug || undefined
            );

            return (
              <FadeIn direction="up" delay={0.1}>
                <section id="content" className="py-12 md:py-16 bg-white" data-testid="section-intro-custom">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                      {toTitleCase(replaceTokens(processedIntro.heading || template.customContent.introSection.heading, tokens))}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      {replaceTokens(processedIntro.content || template.customContent.introSection.content, tokens)}
                    </p>
                    {processedIntro.highlights && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {processedIntro.highlights.map((highlight: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3" data-testid={`intro-highlight-${idx}`}>
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-base">{replaceTokens(highlight, tokens)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </FadeIn>
            );
          })()}

          {/* Why Choose Section */}
          {template.customContent.whyChooseSection && (() => {
            // Process why choose section with smart content variant selection
            const processedWhyChoose = processContentSection(
              template.customContent.whyChooseSection,
              marketCharacteristics,
              careTypeSlug || undefined
            );

            return (
              <section className="py-12 md:py-16 bg-gray-50" data-testid="section-why-choose-custom">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                    {toTitleCase(replaceTokens(processedWhyChoose.heading || template.customContent.whyChooseSection.heading, tokens))}
                  </h2>
                  <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {processedWhyChoose.reasons?.map((reason: any, idx: number) => (
                      <StaggerItem key={idx}>
                        <Card className="h-full hover:shadow-lg transition-shadow" data-testid={`why-choose-card-${idx}`}>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold mb-3">
                              {replaceTokens(reason.title, tokens)}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {replaceTokens(reason.description, tokens)}
                            </p>
                          </CardContent>
                        </Card>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </section>
            );
          })()}

          {/* Local Context Section */}
          {template.customContent.localContextSection && (() => {
            // Process local context section with smart content variant selection
            const processedLocalContext = processContentSection(
              template.customContent.localContextSection,
              marketCharacteristics,
              careTypeSlug || undefined
            );

            return (
              <FadeIn direction="up" delay={0.2}>
                <section className="py-12 md:py-16 bg-primary/5" data-testid="section-local-context-custom">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                      {toTitleCase(replaceTokens(processedLocalContext.heading || template.customContent.localContextSection.heading, tokens))}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      {replaceTokens(processedLocalContext.content || template.customContent.localContextSection.content, tokens)}
                    </p>
                    {processedLocalContext.features && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {processedLocalContext.features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3" data-testid={`local-feature-${idx}`}>
                            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-base">{replaceTokens(feature, tokens)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </FadeIn>
            );
          })()}

          {/* Care Details Section */}
          {template.customContent.careDetailsSection && (() => {
            // Process care details section with smart content variant selection
            const processedCareDetails = processContentSection(
              template.customContent.careDetailsSection,
              marketCharacteristics,
              careTypeSlug || undefined
            );

            return (
              <section className="py-12 md:py-16 bg-white" data-testid="section-care-details-custom">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                    {toTitleCase(replaceTokens(processedCareDetails.heading || template.customContent.careDetailsSection.heading, tokens))}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {replaceTokens(processedCareDetails.content || template.customContent.careDetailsSection.content, tokens)}
                  </p>
                  {processedCareDetails.keyPoints && (
                    <div className="space-y-3 mt-8">
                      {processedCareDetails.keyPoints.map((point: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg" data-testid={`care-point-${idx}`}>
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-base">{replaceTokens(point, tokens)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })()}

          {/* FAQ Preview Section */}
          {template.customContent.faqPreview && template.customContent.faqPreview.length > 0 && (
            <FadeIn direction="up" delay={0.2}>
              <section className="py-12 md:py-16 bg-gray-50" data-testid="section-faq-preview-custom">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                    Frequently Asked Questions
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {template.customContent.faqPreview.map((faq: any, idx: number) => (
                      <AccordionItem 
                        key={idx} 
                        value={`faq-${idx}`} 
                        className="bg-white border rounded-lg px-6"
                        data-testid={`faq-item-${idx}`}
                      >
                        <AccordionTrigger className="text-left font-semibold hover:no-underline">
                          {replaceTokens(faq.question, tokens)}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                          {replaceTokens(faq.answer, tokens)}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </section>
            </FadeIn>
          )}

          {/* Resources Section - Main Heading as Accordion */}
          {template.customContent.resourcesSection && template.customContent.resourcesSection.resources && (
            <FadeIn direction="up" delay={0.2}>
              <section className="py-12 md:py-16 bg-white" data-testid="section-resources-custom">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="resources-main" className="border rounded-lg px-6">
                      <AccordionTrigger 
                        className="text-3xl md:text-4xl font-bold hover:no-underline py-6"
                        data-testid="button-resources-section"
                      >
                        {toTitleCase(replaceTokens(template.customContent.resourcesSection.heading, tokens))}
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {template.customContent.resourcesSection.resources.map((resource: any, idx: number) => (
                            <Card key={idx} className="bg-gray-50" data-testid={`resource-card-${idx}`}>
                              <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-3">
                                  {replaceTokens(resource.name, tokens)}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                  {replaceTokens(resource.description, tokens)}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </section>
            </FadeIn>
          )}
        </>
      )}

      {/* 1d. Page Content Sections - Dynamic sections from database */}
      {activeSections.length > 0 && activeSections
        .filter(section => section.sectionType !== 'cta_row') // Skip CTARow since we have hero overlay
        .map((section) => {
          // Pass currentCareType prop to CareComparisonTool sections
          if (section.sectionType === 'care_comparison_tool') {
            return (
              <PageSectionRenderer 
                key={section.id} 
                section={section}
                currentCareType={careTypeSlug || undefined}
              />
            );
          }
          
          return (
            <PageSectionRenderer 
              key={section.id} 
              section={section}
            />
          );
        })}

      {/* 1a. Care Type Focus - Show specific care type if landing page is for a specific care type */}
      {careTypeSlug && getCareTypeName() !== "Senior Living" && (
        <section className="py-8 md:py-12 bg-primary/5" data-testid="section-care-type-focus">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base md:text-lg font-semibold inline-flex items-center gap-2"
                data-testid="care-type-focus-badge"
              >
                <Heart className="w-5 h-5" />
                Specializing in {getCareTypeName()}
              </Badge>
            </div>
          </div>
        </section>
      )}

      {/* 2. & 3. Community Credentials - Database-driven trust badges and stats */}
      {primaryCommunity && <CommunityCredentials community={primaryCommunity} />}

      {/* 4. Community Highlights - What makes this community special (alternating feature sections) */}
      {communityHighlights.length > 0 && (
        <section className="py-12 md:py-16" data-testid="section-highlights">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <ScaleHeader scaleFrom={0.85} scaleTo={1}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Experience the Difference</h2>
              </ScaleHeader>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                Discover a community where every detail is designed for your comfort, enjoyment, and well-being.
              </p>
            </div>

            <div className="space-y-16 md:space-y-20">
              {communityHighlights.map((highlight, index) => (
                <FadeIn 
                  key={highlight.id}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={0.1}
                >
                  <FeatureSection 
                    highlight={highlight}
                    imageLeft={index % 2 === 1}
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Floor Plans & Pricing - Show what they'll get (filtered by care type) */}
      {(template.showPricing || template.showFloorPlans) && floorPlans.length > 0 && (
        <section id="floor-plans" className="py-12 md:py-16" data-testid="section-floor-plans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 md:mb-6">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-semibold">
                  {careTypeSlug ? `${getCareTypeName()} Floor Plans` : 'Floor Plans & Pricing'}
                </span>
              </div>
              <ScaleHeader scaleFrom={0.85} scaleTo={1}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
                  Choose Your Ideal Living Space
                </h2>
              </ScaleHeader>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {careTypeSlug 
                  ? `Explore our ${getCareTypeName().toLowerCase()} floor plans with transparent pricing`
                  : 'Explore our thoughtfully designed floor plans with transparent pricing'}
              </p>
            </div>

            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {floorPlans.map((plan) => (
                <StaggerItem key={plan.id}>
                  <FloorPlanCard
                    plan={plan}
                    onClick={() => setSelectedFloorPlan(plan)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* 6. Photo Gallery - Visual engagement */}
      {template.showGallery && galleries.length > 0 && (
        <section id="gallery" className="py-12 md:py-16 bg-gray-50" data-testid="section-gallery">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 md:mb-6">
                <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-semibold">Photo Gallery</span>
              </div>
              <ScaleHeader scaleFrom={0.85} scaleTo={1}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
                  See Our Beautiful Community
                </h2>
              </ScaleHeader>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our vibrant community life, comfortable living spaces, and beautiful surroundings
              </p>
            </div>

            <GalleryOverview 
              galleries={galleries}
              onGallerySelect={(gallery) => setSelectedGallery(gallery)}
            />
          </div>
        </section>
      )}

      {/* 7. Testimonials - Social proof from satisfied families */}
      {template.showTestimonials && testimonials.length > 0 && (
        <FadeIn direction="up" delay={0.2}>
          <section id="testimonials" className="py-12 md:py-16" data-testid="section-testimonials">
            <TestimonialSection 
              communityId={primaryCommunity?.id}
              communityName={primaryCommunity?.name}
              communitySlug={primaryCommunity?.slug}
            />
          </section>
        </FadeIn>
      )}

      {/* 8. Community Amenities - Comprehensive details */}
      {communityAmenities.length > 0 && (
        <section id="amenities" className="py-12 md:py-16 bg-gray-50" data-testid="section-amenities">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 md:mb-6">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-semibold">Amenities & Services</span>
              </div>
              <ScaleHeader scaleFrom={0.85} scaleTo={1}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
                  Exceptional Care & Comfort
                </h2>
              </ScaleHeader>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience our comprehensive amenities designed for your wellbeing
              </p>
            </div>

            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {communityAmenities.map((amenity) => (
                <StaggerItem key={amenity.id}>
                  <div
                    className="flex items-start gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                    data-testid={`amenity-item-${amenity.id}`}
                  >
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base mb-1">{amenity.name}</h3>
                      {amenity.description && (
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {amenity.description}
                        </p>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* 9. Team Members - Meet the caring professionals */}
      {template.showTeamMembers && teamMembers.length > 0 && (
        <section className="py-12 md:py-16" data-testid="section-team">
          <TeamCarousel
            filterTag={primaryCommunity?.slug || "Stage Management"}
            title="Meet Our Team"
            subtitle="Dedicated professionals committed to exceptional care"
          />
        </section>
      )}

      {/* 10. Single Strong CTA - Primary conversion point */}
      <CTASection
        variant="primary"
        heading="Ready to Experience the Difference?"
        subheading={`Schedule your personalized tour of ${primaryCommunity?.name || 'our community'} today. See firsthand why families choose us for their loved ones.`}
        ctaText="Schedule Your Tour"
      />

      {/* 12. Location & Map - Find and visit us */}
      {primaryCommunity && (primaryCommunity.street || primaryCommunity.lat) && (
        <section id="location" className="py-12 md:py-16" data-testid="section-location">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 md:mb-6">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-semibold">Visit Us</span>
              </div>
              <ScaleHeader scaleFrom={0.85} scaleTo={1}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
                  Find {primaryCommunity.name}
                </h2>
              </ScaleHeader>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Conveniently located in {primaryCommunity.city}, {primaryCommunity.state}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Map */}
              <div className="order-2 lg:order-1">
                <Card className="overflow-hidden h-full min-h-[400px]">
                  {primaryCommunity.lat && primaryCommunity.lng ? (
                    <iframe
                      src={`https://www.google.com/maps?q=${primaryCommunity.lat},${primaryCommunity.lng}&hl=es;z=14&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: "400px" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${primaryCommunity.name}`}
                      data-testid="location-map"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[400px] bg-gray-100 flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </Card>
              </div>

              {/* Contact Information */}
              <div className="order-1 lg:order-2 flex flex-col justify-center">
                <Card className="p-6 md:p-8">
                  <CardContent className="p-0 space-y-6">
                    {/* Address */}
                    {primaryCommunity.street && (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Address</h3>
                          <p className="text-muted-foreground">
                            {primaryCommunity.street}
                            <br />
                            {primaryCommunity.city}, {primaryCommunity.state} {primaryCommunity.zip || primaryCommunity.zipCode}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    {primaryCommunity.phoneDisplay && (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Phone className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Phone</h3>
                          <a
                            href={getPrimaryPhoneHref(primaryCommunity)}
                            className="text-muted-foreground hover:text-primary transition-colors text-lg"
                            data-testid="phone-link"
                          >
                            {getPrimaryPhoneDisplay(primaryCommunity)}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Get Directions Button */}
                    {primaryCommunity.lat && primaryCommunity.lng && (
                      <div className="pt-4">
                        <Button
                          asChild
                          size="lg"
                          className="w-full min-h-[44px]"
                          data-testid="button-get-directions"
                        >
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${primaryCommunity.lat},${primaryCommunity.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Navigation className="w-5 h-5 mr-2" />
                            Get Directions
                          </a>
                        </Button>
                      </div>
                    )}

                    {/* Schedule Tour CTA */}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="lg"
                        className={`w-full min-h-[44px] talkfurther-schedule-tour ${primaryCommunity?.slug ? `community-${primaryCommunity.slug}` : ''}`}
                        onClick={() =>
                          openScheduleTour({
                            communityId: primaryCommunity?.id,
                            communityName: primaryCommunity?.name,
                            title: `Schedule a Tour at ${primaryCommunity?.name}`,
                          })
                        }
                        data-community-id={primaryCommunity?.id}
                        data-community-slug={primaryCommunity?.slug}
                        data-community-name={primaryCommunity?.name}
                        data-testid="button-schedule-tour-location"
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        Schedule a Tour
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 13. FAQs - Address common concerns */}
      {template.showFaqs && faqs.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50" data-testid="section-faqs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 md:mb-6">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-semibold">FAQs</span>
              </div>
              <ScaleHeader scaleFrom={0.85} scaleTo={1}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
                  Frequently Asked Questions
                </h2>
              </ScaleHeader>
              <p className="text-base md:text-lg text-muted-foreground">
                Find answers to common questions about our community
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index}`} data-testid={`faq-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-sm md:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answerHtml ? (
                      <div
                        className="prose prose-sm max-w-none text-sm md:text-base"
                        dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                      />
                    ) : (
                      <p className="text-muted-foreground text-sm md:text-base">{faq.answer}</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* 14. Final CTA Section - Last conversion opportunity */}
      <section className="py-12 md:py-20 bg-primary text-white" data-testid="section-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                {template.heroCtaText || "Ready to Learn More?"}
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8">
                Schedule a tour today and discover why families choose{" "}
                {primaryCommunity?.name || "our community"} for their loved ones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() =>
                    openScheduleTour({
                      communityId: primaryCommunity?.id,
                      communityName: primaryCommunity?.name,
                      title: `Schedule a Tour${
                        primaryCommunity?.name ? ` at ${primaryCommunity.name}` : ""
                      }`,
                    })
                  }
                  className={`bg-white text-primary hover:bg-white/90 min-h-[44px] w-full sm:w-auto talkfurther-schedule-tour ${primaryCommunity?.slug ? `community-${primaryCommunity.slug}` : ''}`}
                  data-community-id={primaryCommunity?.id}
                  data-community-slug={primaryCommunity?.slug}
                  data-community-name={primaryCommunity?.name}
                  data-testid="button-schedule-tour-cta"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule a Tour
                </Button>
                {primaryCommunity?.phoneDisplay && (
                  <Button
                    size="lg"
                    asChild
                    className="bg-white text-primary hover:bg-white/90 min-h-[44px] w-full sm:w-auto"
                    data-testid="button-call-cta"
                  >
                    <a href={getPrimaryPhoneHref(primaryCommunity)}>
                      <Phone className="w-5 h-5 mr-2" />
                      {getPrimaryPhoneDisplay(primaryCommunity)}
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Request Information</h3>
                <LeadCaptureForm
                  communityId={primaryCommunity?.id}
                  variant="sidebar"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedGallery && (
        <GalleryModal
          isOpen={!!selectedGallery}
          onClose={() => setSelectedGallery(null)}
          gallery={{
            ...selectedGallery,
            description: selectedGallery.description || undefined,
            images: selectedGallery.images || undefined,
          }}
        />
      )}

      {selectedFloorPlan && (
        <FloorPlanModal
          isOpen={!!selectedFloorPlan}
          onOpenChange={(open) => !open && setSelectedFloorPlan(null)}
          floorPlan={selectedFloorPlan}
          communityName={primaryCommunity?.name || ""}
          communityId={primaryCommunity?.id}
          communitySlug={primaryCommunity?.slug}
        />
      )}

      {/* Exit Intent Popup */}
      <ExitIntentPopup
        open={showPopup}
        onOpenChange={setShowPopup}
      />

      {/* 14. Sticky Mobile CTA - Fixed bottom on mobile */}
      <StickyMobileCTA />
    </div>
  );
}
