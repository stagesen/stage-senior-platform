import type { Community, LandingPageTemplate } from "@shared/schema";

/**
 * Schema.org structured data utility for generating JSON-LD
 * Improves SEO and enables rich snippets in search results
 */

export interface SchemaOrgParams {
  community?: Community;
  careType?: string;
  template: LandingPageTemplate;
  pathname: string;
}

export interface LocalBusinessSchema {
  "@context": string;
  "@type": string;
  name: string;
  description?: string;
  image?: string[];
  address?: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: string;
    longitude: string;
  };
  telephone?: string;
  email?: string;
  url: string;
  priceRange?: string;
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string;
    reviewCount: number;
  };
  openingHours?: string;
}

export interface ServiceSchema {
  "@context": string;
  "@type": string;
  name: string;
  description?: string;
  provider: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  areaServed?: {
    "@type": "City";
    name: string;
  };
  serviceType: string;
  url: string;
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string;
    reviewCount: number;
  };
}

export interface BreadcrumbListSchema {
  "@context": string;
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Generates a LocalBusiness schema for community landing pages
 */
export function generateLocalBusinessSchema(params: SchemaOrgParams): LocalBusinessSchema | null {
  const { community, template } = params;

  if (!community) {
    return null;
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://stagesenior.com";
  const schema: LocalBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "SeniorCenterOrCommunity",
    name: community.name,
    url: `${baseUrl}${params.pathname}`,
  };

  // Add description
  if (community.shortDescription) {
    schema.description = community.shortDescription;
  } else if (community.description) {
    schema.description = community.description.substring(0, 200);
  } else if (template.metaDescription) {
    schema.description = template.metaDescription;
  }

  // Add images
  const images: string[] = [];
  if (community.heroImageUrl) {
    images.push(community.heroImageUrl);
  }
  if (images.length > 0) {
    schema.image = images;
  }

  // Add address
  if (community.street && community.city && community.state) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: community.street,
      addressLocality: community.city,
      addressRegion: community.state,
      addressCountry: "US",
    };

    if (community.zip || community.zipCode) {
      schema.address.postalCode = community.zip || community.zipCode || undefined;
    }
  }

  // Add geo coordinates
  const lat = community.lat || community.latitude;
  const lng = community.lng || community.longitude;
  if (lat && lng) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: String(lat),
      longitude: String(lng),
    };
  }

  // Add contact information
  if (community.phoneDisplay || community.phone) {
    schema.telephone = community.phoneDisplay || community.phone || undefined;
  }

  if (community.email) {
    schema.email = community.email;
  }

  // Add price range
  if (community.startingPrice) {
    if (community.startingPrice < 3000) {
      schema.priceRange = "$";
    } else if (community.startingPrice < 5000) {
      schema.priceRange = "$$";
    } else if (community.startingPrice < 7000) {
      schema.priceRange = "$$$";
    } else {
      schema.priceRange = "$$$$";
    }
  } else if (community.startingRateDisplay) {
    schema.priceRange = "$$-$$$";
  }

  // Add aggregate rating
  const rating = community.rating ? parseFloat(String(community.rating)) : 4.8;
  const reviewCount = community.reviewCount || 100;
  schema.aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: String(rating),
    reviewCount: reviewCount,
  };

  // Add opening hours - typically senior communities are accessible during business hours
  schema.openingHours = "Mo-Su 08:00-17:00";

  return schema;
}

/**
 * Generates a Service schema for care type pages
 */
export function generateServiceSchema(params: SchemaOrgParams): ServiceSchema | null {
  const { careType, community, template } = params;

  if (!careType) {
    return null;
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://stagesenior.com";
  const careTypeNames: Record<string, string> = {
    "assisted-living": "Assisted Living",
    "memory-care": "Memory Care",
    "independent-living": "Independent Living",
    "skilled-nursing": "Skilled Nursing",
  };

  const careTypeName = careTypeNames[careType] || "Senior Living";

  const schema: ServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: careTypeName,
    serviceType: careTypeName,
    url: `${baseUrl}${params.pathname}`,
    provider: {
      "@type": "Organization",
      name: community?.name || "Stage Senior",
      url: baseUrl,
    },
  };

  // Add description
  if (template.metaDescription) {
    schema.description = template.metaDescription;
  }

  // Add area served
  if (community?.city) {
    schema.areaServed = {
      "@type": "City",
      name: community.city,
    };
  }

  // Add aggregate rating
  const rating = community?.rating ? parseFloat(String(community.rating)) : 4.8;
  const reviewCount = community?.reviewCount || 100;
  schema.aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: String(rating),
    reviewCount: reviewCount,
  };

  return schema;
}

/**
 * Generates a BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(params: SchemaOrgParams): BreadcrumbListSchema {
  const { pathname, community, careType } = params;
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://stagesenior.com";

  const breadcrumbs: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
  ];

  // Parse pathname to build breadcrumbs
  const pathParts = pathname.split("/").filter(Boolean);

  // Add care type if present
  if (careType) {
    const careTypeNames: Record<string, string> = {
      "assisted-living": "Assisted Living",
      "memory-care": "Memory Care",
      "independent-living": "Independent Living",
      "skilled-nursing": "Skilled Nursing",
    };
    breadcrumbs.push({
      "@type": "ListItem",
      position: breadcrumbs.length + 1,
      name: careTypeNames[careType] || careType,
      item: `${baseUrl}/${careType}`,
    });
  }

  // Add community if present
  if (community) {
    breadcrumbs.push({
      "@type": "ListItem",
      position: breadcrumbs.length + 1,
      name: community.name,
      item: `${baseUrl}/communities/${community.slug}`,
    });
  }

  // Add current page as last breadcrumb without link
  if (pathParts.length > 0 && pathname !== "/") {
    const lastPart = pathParts[pathParts.length - 1];
    const displayName = lastPart
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      "@type": "ListItem",
      position: breadcrumbs.length + 1,
      name: displayName,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs,
  };
}

/**
 * Main function to generate all relevant schemas for a landing page
 * Returns an array of schema objects to be injected as JSON-LD
 */
export function generateSchemaOrgData(params: SchemaOrgParams): Array<LocalBusinessSchema | ServiceSchema | BreadcrumbListSchema> {
  const schemas: Array<LocalBusinessSchema | ServiceSchema | BreadcrumbListSchema> = [];

  // Generate LocalBusiness schema for community pages
  if (params.community) {
    const localBusinessSchema = generateLocalBusinessSchema(params);
    if (localBusinessSchema) {
      schemas.push(localBusinessSchema);
    }
  }

  // Generate Service schema for care type pages
  if (params.careType) {
    const serviceSchema = generateServiceSchema(params);
    if (serviceSchema) {
      schemas.push(serviceSchema);
    }
  }

  // Always generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema(params);
  schemas.push(breadcrumbSchema);

  return schemas;
}
