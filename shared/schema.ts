import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  decimal,
  integer,
  boolean,
  jsonb,
  uuid,
  serial,
  bigint,
  date
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication - referenced by javascript_auth_all_persistance integration
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  email: varchar("email", { length: 255 }),
  role: varchar("role", { length: 50 }).default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Site settings table - global site configuration
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 255 }).default("Stage Senior"),
  companyPhoneDisplay: varchar("company_phone_display", { length: 20 }).default("(970) 444-4689"),
  companyPhoneDial: varchar("company_phone_dial", { length: 20 }).default("+19704444689"),
  companyEmail: varchar("company_email", { length: 255 }),
  supportEmail: varchar("support_email", { length: 255 }),
  companyAddress: text("company_address"),
  companyCity: varchar("company_city", { length: 100 }),
  companyState: varchar("company_state", { length: 2 }),
  companyZip: varchar("company_zip", { length: 10 }),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Master tables
export const careTypes = pgTable("care_types", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const amenities = pgTable("amenities", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const communities = pgTable("communities", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  street: text("street"),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull().default("CO"),
  zip: varchar("zip", { length: 10 }),
  zipCode: varchar("zip_code", { length: 10 }), // Keep for backwards compatibility
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  lat: decimal("lat", { precision: 10, scale: 8 }), // Additional field from CSV
  lng: decimal("lng", { precision: 11, scale: 8 }), // Additional field from CSV
  phoneDisplay: varchar("phone_display", { length: 20 }),
  phoneDial: varchar("phone_dial", { length: 20 }),
  secondaryPhoneDisplay: varchar("secondary_phone_display", { length: 20 }),
  secondaryPhoneDial: varchar("secondary_phone_dial", { length: 20 }),
  email: varchar("email", { length: 255 }),
  instagramUrl: text("instagram_url"),
  facebookUrl: text("facebook_url"),
  linkedinUrl: text("linkedin_url"),
  heroImageUrl: text("hero_image_url"), // Keep for backward compatibility
  imageId: varchar("image_id", { length: 255 }).references(() => images.id), // New image reference
  logoImageId: varchar("logo_image_id", { length: 255 }).references(() => images.id), // Logo image reference
  invertedLogoImageId: varchar("inverted_logo_image_id", { length: 255 }).references(() => images.id), // Inverted logo image reference
  contactImageId: varchar("contact_image_id", { length: 255 }).references(() => images.id), // Contact Us card image reference
  pricingImageId: varchar("pricing_image_id", { length: 255 }).references(() => images.id), // Pricing card image reference
  brochureImageId: varchar("brochure_image_id", { length: 255 }).references(() => images.id), // Brochure card image reference
  brochureLink: text("brochure_link"), // Brochure link URL
  experienceImageId: varchar("experience_image_id", { length: 255 }).references(() => images.id), // Experience our Community image reference
  calendarFile1Id: varchar("calendar_file_1_id", { length: 255 }).references(() => images.id), // First calendar file
  calendarFile1ButtonText: varchar("calendar_file_1_button_text", { length: 100 }), // Button text for first calendar
  calendarFile2Id: varchar("calendar_file_2_id", { length: 255 }).references(() => images.id), // Second calendar file  
  calendarFile2ButtonText: varchar("calendar_file_2_button_text", { length: 100 }), // Button text for second calendar
  fitnessImageId: varchar("fitness_image_id", { length: 255 }).references(() => images.id), // Fitness center image
  privateDiningImageId: varchar("private_dining_image_id", { length: 255 }).references(() => images.id), // Private dining room image
  salonImageId: varchar("salon_image_id", { length: 255 }).references(() => images.id), // Salon & spa image
  courtyardsImageId: varchar("courtyards_image_id", { length: 255 }).references(() => images.id), // Courtyards & patios image
  overview: text("overview"),
  heading: varchar("heading", { length: 255 }), // Heading displayed above description on detail page
  subheading: text("subheading"), // Subheading displayed below heading and above description
  description: text("description"),
  shortDescription: text("short_description"),
  startingRateDisplay: varchar("starting_rate_display", { length: 100 }),
  startingPrice: integer("starting_price"),
  careTypes: jsonb("care_types").$type<string[]>().default([]), // Keep for backwards compatibility
  amenities: jsonb("amenities").$type<string[]>().default([]), // Keep for backwards compatibility
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoDesc: text("seo_desc"), // Additional field from CSV
  phone: varchar("phone", { length: 20 }), // Keep for backwards compatibility
  address: text("address"), // Keep for backwards compatibility
  mainColorHex: varchar("main_color_hex", { length: 7 }),
  ctaColorHex: varchar("cta_color_hex", { length: 7 }),
  featured: boolean("featured").default(false),
  active: boolean("active").default(true),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.8"),
  reviewCount: integer("review_count").default(0),
  licenseStatus: varchar("license_status", { length: 100 }).default("Licensed & Insured"),
  sameDayTours: boolean("same_day_tours").default(true),
  noObligation: boolean("no_obligation").default(true),
  talkFurtherId: text("talk_further_id"),
  videoUrl: text("video_url"),
  propertyMapUrl: text("property_map_url"),
  cluster: varchar("cluster", { length: 100 }), // Geographic cluster for landing page recommendations: 'littleton', 'arvada', 'golden'
  // Community credentials and verified stats
  yearEstablished: integer("year_established"),
  licensedSince: date("licensed_since"),
  residentCapacity: integer("resident_capacity"),
  specialCertifications: jsonb("special_certifications").$type<string[]>().default([]),
  verifiedStats: jsonb("verified_stats").$type<Record<string, number | string>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Junction tables for many-to-many relationships
export const communitiesCareTypes = pgTable("communities_care_types", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  careTypeId: uuid("care_type_id").notNull().references(() => careTypes.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communitiesAmenities = pgTable("communities_amenities", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  amenityId: uuid("amenity_id").notNull().references(() => amenities.id, { onDelete: "cascade" }),
  imageId: varchar("image_id", { length: 255 }).references(() => images.id), // Community-specific amenity image override
  createdAt: timestamp("created_at").defaultNow(),
});

// Community highlights table
export const communityHighlights = pgTable("community_highlights", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageId: varchar("image_id", { length: 255 }).references(() => images.id),
  ctaLabel: varchar("cta_label", { length: 100 }),
  ctaHref: varchar("cta_href", { length: 500 }),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community features table for "Experience the Difference" section
export const communityFeatures = pgTable("community_features", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  eyebrow: varchar("eyebrow", { length: 100 }),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  imageId: varchar("image_id", { length: 255 }).references(() => images.id),
  imageAlt: varchar("image_alt", { length: 500 }),
  ctaLabel: varchar("cta_label", { length: 100 }),
  ctaHref: varchar("cta_href", { length: 500 }),
  imageLeft: boolean("image_left").default(false),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary"),
  bodyHtml: text("body_html"), // Additional field from CSV
  content: text("content").notNull(),
  heroImageUrl: text("hero_image_url"), // Keep for backward compatibility
  imageId: varchar("image_id", { length: 255 }).references(() => images.id), // New image reference
  tags: text("tags").array().default(sql`ARRAY[]::text[]`),
  attachmentId: varchar("attachment_id", { length: 255 }), // Reference to uploaded file
  communityId: uuid("community_id").references(() => communities.id, { onDelete: "cascade" }),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Post attachments table for storing file attachment metadata
export const postAttachments = pgTable("post_attachments", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }), // Nullable - can be null until linked to a post
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  objectKey: text("object_key"), // For object storage reference
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes"),
  uploadedBy: integer("uploaded_by"), // User ID who uploaded the file
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  eventSlug: varchar("event_slug", { length: 255 }), // Additional field from CSV
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary"),
  description: text("description"),
  imageUrl: text("image_url"), // Keep for backward compatibility
  imageId: varchar("image_id", { length: 255 }).references(() => images.id), // New image reference
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at"),
  locationText: text("location_text"),
  rsvpUrl: text("rsvp_url"),
  communityId: uuid("community_id").references(() => communities.id, { onDelete: "cascade" }),
  published: boolean("published").default(false),
  maxAttendees: integer("max_attendees"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer"),
  answerHtml: text("answer_html"), // Additional field from CSV
  category: varchar("category", { length: 100 }),
  communityId: uuid("community_id").references(() => communities.id, { onDelete: "cascade" }),
  sort: integer("sort").default(0), // Additional field from CSV
  sortOrder: integer("sort_order").default(0), // Keep for backwards compatibility
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const galleries = pgTable("galleries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  gallerySlug: varchar("gallery_slug", { length: 255 }), // Additional field from CSV
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  hero: boolean("hero").default(false), // Additional field from CSV
  published: boolean("published").default(false), // Additional field from CSV
  images: jsonb("images").$type<Array<{
    url: string;
    alt: string;
    width?: number;
    height?: number;
    caption?: string;
  }>>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]), // Additional field from CSV
  communityId: uuid("community_id").references(() => communities.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 100 }),
  thumbnailIndex: integer("thumbnail_index"), // New field for selecting thumbnail image
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team members table
export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }),
  bio: text("bio"),
  avatarImageId: varchar("avatar_image_id", { length: 255 }).references(() => images.id),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  twitterUrl: varchar("twitter_url", { length: 500 }),
  tags: jsonb("tags").$type<string[]>().default([]), // Community associations and tags
  sortOrder: integer("sort_order").default(0),
  featured: boolean("featured").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  mainImage: text("main_image"),
  thumbnailImage: text("thumbnail_image"),
  galleryImages: jsonb("gallery_images").$type<string[]>().default([]),
  featured: boolean("featured").default(false),
  category: varchar("category", { length: 100 }),
  author: varchar("author", { length: 255 }), // Legacy field for backward compatibility
  authorId: uuid("author_id").references(() => teamMembers.id), // Reference to team member
  tags: jsonb("tags").$type<string[]>().default([]),
  communityId: uuid("community_id").references(() => communities.id, { onDelete: "cascade" }),
  published: boolean("published").default(true),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tourRequests = pgTable("tour_requests", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  communityId: uuid("community_id").references(() => communities.id, { onDelete: "cascade" }),
  preferredDate: timestamp("preferred_date"),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("new"),
  notes: text("notes"),
  lastContactedAt: timestamp("last_contacted_at"),
  scheduledDate: timestamp("scheduled_date"),
  // UTM tracking fields for campaign attribution
  utmSource: varchar("utm_source", { length: 255 }),
  utmMedium: varchar("utm_medium", { length: 255 }),
  utmCampaign: varchar("utm_campaign", { length: 255 }),
  utmTerm: varchar("utm_term", { length: 255 }),
  utmContent: varchar("utm_content", { length: 255 }),
  landingPageUrl: text("landing_page_url"), // Track which landing page they came from
  // Conversion tracking fields for Google Ads and Meta
  transactionId: varchar("transaction_id", { length: 255 }), // Unique ID for deduplication across platforms
  gclid: varchar("gclid", { length: 255 }), // Google Click ID
  gbraid: varchar("gbraid", { length: 255 }), // Google Ads enhanced conversion ID (iOS)
  wbraid: varchar("wbraid", { length: 255 }), // Google Ads enhanced conversion ID (Web)
  fbp: varchar("fbp", { length: 255 }), // Meta _fbp cookie
  fbc: varchar("fbc", { length: 255 }), // Meta _fbc cookie (click ID)
  fbclid: varchar("fbclid", { length: 255 }), // Facebook Click ID
  clientUserAgent: text("client_user_agent"), // Browser user agent for Meta CAPI
  clientIpAddress: varchar("client_ip_address", { length: 45 }), // User IP address for Meta CAPI
  conversionTier1SentAt: timestamp("conversion_tier_1_sent_at"), // When Tier 1 conversion was sent
  conversionTier2SentAt: timestamp("conversion_tier_2_sent_at"), // When Tier 2 conversion was sent
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Landing page templates for dynamic marketing pages
export const landingPageTemplates = pgTable("landing_page_templates", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // e.g., 'assisted-living-golden-co'
  urlPattern: varchar("url_pattern", { length: 255 }).notNull(), // e.g., '/assisted-living/:city', '/care/:careType/:location'
  templateType: varchar("template_type", { length: 100 }).notNull(), // 'location-specific', 'care-type-specific', 'hybrid'
  
  // SEO & Content
  title: varchar("title", { length: 255 }).notNull(), // Page title (can use tokens like {city}, {careType}, {communityName})
  metaDescription: text("meta_description"),
  h1Headline: varchar("h1_headline", { length: 500 }), // Main headline (supports tokens)
  subheadline: text("subheadline"),
  
  // Community & Care Type Associations
  communityId: uuid("community_id").references(() => communities.id, { onDelete: "cascade" }), // Specific community or null for multi-community
  careTypeId: uuid("care_type_id").references(() => careTypes.id), // Specific care type or null
  cities: text("cities").array().default(sql`ARRAY[]::text[]`), // List of cities this template targets
  
  // Content Configuration
  showGallery: boolean("show_gallery").default(true),
  showTestimonials: boolean("show_testimonials").default(true),
  showTeamMembers: boolean("show_team_members").default(true),
  showPricing: boolean("show_pricing").default(true),
  showFloorPlans: boolean("show_floor_plans").default(false),
  showFaqs: boolean("show_faqs").default(true),
  
  // Hero/PageHero settings
  heroImageId: varchar("hero_image_id", { length: 255 }).references(() => images.id),
  heroTitle: varchar("hero_title", { length: 500 }), // Override hero title (supports tokens)
  heroSubtitle: text("hero_subtitle"),
  heroCtaText: varchar("hero_cta_text", { length: 100 }),
  
  // Additional settings
  customContent: jsonb("custom_content").$type<Record<string, any>>(), // Flexible content sections
  active: boolean("active").default(true),
  sortOrder: integer("sort_order").default(0),

  // Optimization & Tracking fields
  schemaOrgJson: jsonb("schema_org_json").$type<Record<string, any>>(), // Structured data for rich snippets
  testimonialVideoUrl: varchar("testimonial_video_url", { length: 500 }), // Embedded testimonial video
  heroVideoUrl: varchar("hero_video_url", { length: 500 }), // Hero background video
  customScripts: text("custom_scripts"), // Custom JS/tracking scripts (A/B testing, analytics)
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).default("0"), // Conversion rate percentage
  impressions: integer("impressions").default(0), // Total page views/impressions
  conversions: integer("conversions").default(0), // Total conversions (tours scheduled)
  lastOptimizedAt: timestamp("last_optimized_at").defaultNow(), // Last optimization date

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const floorPlans = pgTable("floor_plans", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: uuid("community_id").references(() => communities.id, { onDelete: "cascade" }),
  careTypeId: uuid("care_type_id").references(() => careTypes.id),
  planSlug: varchar("plan_slug", { length: 255 }), // Additional field from CSV
  name: varchar("name", { length: 255 }).notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }).notNull(),
  squareFeet: integer("square_feet"),
  description: text("description"),
  highlights: jsonb("highlights").$type<string[]>().default([]),
  images: jsonb("images").$type<string[]>().default([]), // Additional field from CSV for multiple images
  imageUrl: text("image_url"), // Keep for backward compatibility
  imageId: varchar("image_id", { length: 255 }).references(() => images.id), // New image reference
  planImageUrl: text("plan_image_url"),
  specPdfUrl: text("spec_pdf_url"), // Additional field from CSV
  pdfUrl: text("pdf_url"), // Keep for backwards compatibility
  accessible: boolean("accessible").default(false), // Additional field from CSV
  startingRateDisplay: varchar("starting_rate_display", { length: 100 }), // Additional field from CSV
  startingPrice: integer("starting_price"),
  availability: varchar("availability", { length: 50 }).default("available"),
  sortPriority: integer("sort_priority").default(0), // Additional field from CSV
  sortOrder: integer("sort_order").default(0), // Keep for backwards compatibility
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: uuid("community_id").references(() => communities.id, { onDelete: "cascade" }),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorRelation: varchar("author_relation", { length: 100 }),
  content: text("content").notNull(),
  highlight: text("highlight"), // Key quote to highlight
  rating: integer("rating"),
  imageId: varchar("image_id", { length: 255 }).references(() => images.id), // Author image
  featured: boolean("featured").default(false),
  approved: boolean("approved").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Social Posts table for managing custom social media posts for each community
export const socialPosts = pgTable("social_posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  imageId: varchar("image_id", { length: 255 }).references(() => images.id),
  caption: text("caption"),
  linkUrl: text("link_url"),
  author: varchar("author", { length: 255 }),
  postDate: timestamp("post_date").defaultNow(),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Images table for storing all image metadata
export const images = pgTable("images", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  objectKey: text("object_key").notNull(), // Key in object storage
  url: text("url").notNull(), // Public URL
  alt: text("alt"), // Alt text for accessibility
  width: integer("width"),
  height: integer("height"),
  sizeBytes: integer("size_bytes"),
  mimeType: text("mime_type"),
  variants: jsonb("variants").$type<Record<string, { url: string; width: number; height: number; sizeBytes: number }>>(), // Different image sizes
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Junction table between galleries and images
export const galleryImages = pgTable("gallery_images", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  galleryId: uuid("gallery_id").notNull().references(() => galleries.id, { onDelete: "cascade" }),
  imageId: varchar("image_id", { length: 255 }).notNull().references(() => images.id, { onDelete: "cascade" }),
  caption: text("caption"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Junction table between floor plans and images
export const floorPlanImages = pgTable("floor_plan_images", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  floorPlanId: uuid("floor_plan_id").notNull().references(() => floorPlans.id, { onDelete: "cascade" }),
  imageId: varchar("image_id", { length: 255 }).notNull().references(() => images.id, { onDelete: "cascade" }),
  caption: text("caption"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Google Ads conversion actions table for tracking conversion configurations
export const googleAdsConversionActions = pgTable("google_ads_conversion_actions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  resourceName: text("resource_name"), // Full Google Ads resource name (e.g., "customers/123/conversionActions/456")
  conversionActionId: text("conversion_action_id"), // Numeric ID extracted from resource name
  name: varchar("name", { length: 255 }), // Display name (e.g., "Schedule Tour")
  conversionLabel: text("conversion_label"), // GTM label extracted from tag snippets (CRITICAL field)
  category: varchar("category", { length: 50 }), // Conversion category (e.g., "LEAD")
  value: decimal("value", { precision: 10, scale: 2 }), // Conversion value (e.g., 250.00)
  currency: varchar("currency", { length: 3 }).default("USD"), // Currency code
  countingType: varchar("counting_type", { length: 50 }), // e.g., "ONE_PER_CLICK"
  status: varchar("status", { length: 50 }), // e.g., "ENABLED", "PAUSED", "REMOVED"
  isPrimary: boolean("is_primary").default(false), // Whether this is a primary conversion for bidding
  attributionModel: varchar("attribution_model", { length: 50 }), // e.g., "DATA_DRIVEN", "LAST_CLICK"
  clickThroughWindowDays: integer("click_through_window_days").default(90), // Click-through conversion window
  viewThroughWindowDays: integer("view_through_window_days").default(30), // View-through conversion window
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  syncedAt: timestamp("synced_at"), // Last time synced from Google Ads API
});

// Google Ads campaigns table for managing ad campaigns
export const googleAdsCampaigns = pgTable("google_ads_campaigns", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  resourceName: text("resource_name"), // Google Ads resource name (e.g., "customers/123/campaigns/456")
  campaignId: text("campaign_id"), // Numeric ID from Google Ads
  name: varchar("name", { length: 255 }).notNull(), // Campaign name
  
  // Local references
  landingPageTemplateId: uuid("landing_page_template_id").references(() => landingPageTemplates.id, { onDelete: "set null" }),
  communityId: uuid("community_id").references(() => communities.id, { onDelete: "set null" }),
  
  // Campaign configuration
  status: varchar("status", { length: 50 }).default("PAUSED"), // ENABLED, PAUSED, REMOVED
  budgetAmountMicros: bigint("budget_amount_micros", { mode: "number" }), // Daily budget in micros ($50 = 50000000)
  biddingStrategy: varchar("bidding_strategy", { length: 100 }).default("MANUAL_CPC"), // MANUAL_CPC, MAXIMIZE_CONVERSIONS, TARGET_CPA
  targetCpaMicros: bigint("target_cpa_micros", { mode: "number" }), // Target CPA in micros
  
  // Network settings
  targetGoogleSearch: boolean("target_google_search").default(true),
  targetSearchNetwork: boolean("target_search_network").default(true),
  targetContentNetwork: boolean("target_content_network").default(false),
  
  // Tracking
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  conversions: decimal("conversions", { precision: 10, scale: 2 }).default("0"),
  cost: decimal("cost", { precision: 12, scale: 2 }).default("0"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  syncedAt: timestamp("synced_at"), // Last sync with Google Ads API
});

// Google Ads ad groups table
export const googleAdsAdGroups = pgTable("google_ads_ad_groups", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  resourceName: text("resource_name"), // Google Ads resource name
  adGroupId: text("ad_group_id"), // Numeric ID from Google Ads
  campaignId: uuid("campaign_id").notNull().references(() => googleAdsCampaigns.id, { onDelete: "cascade" }),
  
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("ENABLED"), // ENABLED, PAUSED, REMOVED
  cpcBidMicros: bigint("cpc_bid_micros", { mode: "number" }), // Max CPC bid in micros
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Google Ads keywords table
export const googleAdsKeywords = pgTable("google_ads_keywords", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  resourceName: text("resource_name"), // Google Ads resource name
  criterionId: text("criterion_id"), // Numeric ID from Google Ads
  adGroupId: uuid("ad_group_id").notNull().references(() => googleAdsAdGroups.id, { onDelete: "cascade" }),
  
  keywordText: varchar("keyword_text", { length: 500 }).notNull(),
  matchType: varchar("match_type", { length: 50 }).notNull().default("BROAD"), // EXACT, PHRASE, BROAD
  status: varchar("status", { length: 50 }).default("ENABLED"),
  cpcBidMicros: bigint("cpc_bid_micros", { mode: "number" }), // Keyword-level bid override
  
  // Performance metrics
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  conversions: decimal("conversions", { precision: 10, scale: 2 }).default("0"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Google Ads responsive search ads table
export const googleAdsAds = pgTable("google_ads_ads", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  resourceName: text("resource_name"), // Google Ads resource name
  adId: text("ad_id"), // Numeric ID from Google Ads
  adGroupId: uuid("ad_group_id").notNull().references(() => googleAdsAdGroups.id, { onDelete: "cascade" }),
  
  status: varchar("status", { length: 50 }).default("ENABLED"),
  headlines: jsonb("headlines").$type<string[]>().notNull(), // Array of up to 15 headlines (max 30 chars each)
  descriptions: jsonb("descriptions").$type<string[]>().notNull(), // Array of up to 4 descriptions (max 90 chars each)
  finalUrl: text("final_url").notNull(), // Landing page URL
  path1: varchar("path1", { length: 15 }), // Display URL path 1
  path2: varchar("path2", { length: 15 }), // Display URL path 2
  
  // Performance metrics
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  conversions: decimal("conversions", { precision: 10, scale: 2 }).default("0"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quizzes - for Senior Care Navigator and other interactive assessments
export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  resultTitle: varchar("result_title", { length: 255 }), // Title shown on results page
  resultMessage: text("result_message"), // General message shown with results
  resultTiers: jsonb("result_tiers").$type<Array<{
    name: string;
    minScore: number;
    maxScore: number;
    description: string;
    recommendations: string;
  }>>(), // Score-based result tiers for weighted scoring
  active: boolean("active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quiz Questions
export const quizQuestions = pgTable("quiz_questions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: uuid("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  questionType: varchar("question_type", { length: 50 }).notNull().default("multiple_choice"), // 'multiple_choice', 'text', 'scale'
  sortOrder: integer("sort_order").default(0),
  required: boolean("required").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quiz Answer Options
export const quizAnswerOptions = pgTable("quiz_answer_options", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  questionId: uuid("question_id").notNull().references(() => quizQuestions.id, { onDelete: "cascade" }),
  answerText: text("answer_text").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }), // Weighted score value for this answer option
  resultCategory: varchar("result_category", { length: 100 }), // Used to categorize persona (adult_children, prospective_resident, healthcare_referrer)
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz Responses - stores user submissions
export const quizResponses = pgTable("quiz_responses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: uuid("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  zipCode: varchar("zip_code", { length: 10 }),
  timeline: varchar("timeline", { length: 100 }), // 'immediate', '1-3 months', '3-6 months', '6-12 months', '1+ years'
  answers: jsonb("answers").$type<Array<{ questionId: string; answerOptionId?: string; textAnswer?: string }>>().notNull(),
  totalScore: decimal("total_score", { precision: 6, scale: 2 }), // Calculated total weighted score
  resultCategory: varchar("result_category", { length: 100 }), // Calculated tier/persona based on score
  // UTM tracking
  utmSource: varchar("utm_source", { length: 255 }),
  utmMedium: varchar("utm_medium", { length: 255 }),
  utmCampaign: varchar("utm_campaign", { length: 255 }),
  utmTerm: varchar("utm_term", { length: 255 }),
  utmContent: varchar("utm_content", { length: 255 }),
  landingPageUrl: text("landing_page_url"),
  // Conversion tracking
  transactionId: varchar("transaction_id", { length: 255 }),
  gclid: varchar("gclid", { length: 255 }),
  fbclid: varchar("fbclid", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content Assets - downloadable resources (PDFs, guides, reports)
export const contentAssets = pgTable("content_assets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // 'guide', 'report', 'checklist', 'ebook'
  fileUrl: text("file_url"), // Object storage URL or external link
  objectKey: text("object_key"), // Object storage key for file
  thumbnailImageId: varchar("thumbnail_image_id", { length: 255 }).references(() => images.id),
  fileSize: integer("file_size"), // Size in bytes
  mimeType: varchar("mime_type", { length: 100 }),
  requiredFields: jsonb("required_fields").$type<string[]>().default([]), // Fields to collect: ['email', 'zipCode', 'timeline', 'phone']
  articleContent: text("article_content"), // Rich HTML content for article
  featuredImageId: varchar("featured_image_id", { length: 255 }).references(() => images.id),
  authorId: uuid("author_id").references(() => teamMembers.id),
  ctaText: varchar("cta_text", { length: 100 }).default("Download Full Guide"), // Customizable CTA button text
  active: boolean("active").default(true),
  sortOrder: integer("sort_order").default(0),
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Asset Downloads - tracks who downloaded what
export const assetDownloads = pgTable("asset_downloads", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: uuid("asset_id").notNull().references(() => contentAssets.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  zipCode: varchar("zip_code", { length: 10 }),
  timeline: varchar("timeline", { length: 100 }),
  // UTM tracking
  utmSource: varchar("utm_source", { length: 255 }),
  utmMedium: varchar("utm_medium", { length: 255 }),
  utmCampaign: varchar("utm_campaign", { length: 255 }),
  utmTerm: varchar("utm_term", { length: 255 }),
  utmContent: varchar("utm_content", { length: 255 }),
  landingPageUrl: text("landing_page_url"),
  // Conversion tracking
  transactionId: varchar("transaction_id", { length: 255 }),
  gclid: varchar("gclid", { length: 255 }),
  fbclid: varchar("fbclid", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const careTypesRelations = relations(careTypes, ({ many }) => ({
  communities: many(communitiesCareTypes),
}));

export const amenitiesRelations = relations(amenities, ({ many }) => ({
  communities: many(communitiesAmenities),
}));

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  posts: many(posts),
  events: many(events),
  faqs: many(faqs),
  galleries: many(galleries),
  blogPosts: many(blogPosts),
  tourRequests: many(tourRequests),
  floorPlans: many(floorPlans),
  testimonials: many(testimonials),
  careTypes: many(communitiesCareTypes),
  amenities: many(communitiesAmenities),
  highlights: many(communityHighlights),
  image: one(images, {
    fields: [communities.imageId],
    references: [images.id],
  }),
}));

export const communitiesCareTypesRelations = relations(communitiesCareTypes, ({ one }) => ({
  community: one(communities, {
    fields: [communitiesCareTypes.communityId],
    references: [communities.id],
  }),
  careType: one(careTypes, {
    fields: [communitiesCareTypes.careTypeId],
    references: [careTypes.id],
  }),
}));

export const communitiesAmenitiesRelations = relations(communitiesAmenities, ({ one }) => ({
  community: one(communities, {
    fields: [communitiesAmenities.communityId],
    references: [communities.id],
  }),
  amenity: one(amenities, {
    fields: [communitiesAmenities.amenityId],
    references: [amenities.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  community: one(communities, {
    fields: [posts.communityId],
    references: [communities.id],
  }),
  image: one(images, {
    fields: [posts.imageId],
    references: [images.id],
  }),
  attachments: many(postAttachments),
}));

export const postAttachmentsRelations = relations(postAttachments, ({ one }) => ({
  post: one(posts, {
    fields: [postAttachments.postId],
    references: [posts.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  community: one(communities, {
    fields: [blogPosts.communityId],
    references: [communities.id],
  }),
  author: one(teamMembers, {
    fields: [blogPosts.authorId],
    references: [teamMembers.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  community: one(communities, {
    fields: [events.communityId],
    references: [communities.id],
  }),
  image: one(images, {
    fields: [events.imageId],
    references: [images.id],
  }),
}));

export const faqsRelations = relations(faqs, ({ one }) => ({
  community: one(communities, {
    fields: [faqs.communityId],
    references: [communities.id],
  }),
}));

export const galleriesRelations = relations(galleries, ({ one, many }) => ({
  community: one(communities, {
    fields: [galleries.communityId],
    references: [communities.id],
  }),
  images: many(galleryImages),
}));

export const tourRequestsRelations = relations(tourRequests, ({ one }) => ({
  community: one(communities, {
    fields: [tourRequests.communityId],
    references: [communities.id],
  }),
}));

export const landingPageTemplatesRelations = relations(landingPageTemplates, ({ one }) => ({
  community: one(communities, {
    fields: [landingPageTemplates.communityId],
    references: [communities.id],
  }),
  careType: one(careTypes, {
    fields: [landingPageTemplates.careTypeId],
    references: [careTypes.id],
  }),
  heroImage: one(images, {
    fields: [landingPageTemplates.heroImageId],
    references: [images.id],
  }),
}));

export const floorPlansRelations = relations(floorPlans, ({ one, many }) => ({
  community: one(communities, {
    fields: [floorPlans.communityId],
    references: [communities.id],
  }),
  careType: one(careTypes, {
    fields: [floorPlans.careTypeId],
    references: [careTypes.id],
  }),
  image: one(images, {
    fields: [floorPlans.imageId],
    references: [images.id],
  }),
  images: many(floorPlanImages),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  community: one(communities, {
    fields: [testimonials.communityId],
    references: [communities.id],
  }),
}));

export const communityHighlightsRelations = relations(communityHighlights, ({ one }) => ({
  community: one(communities, {
    fields: [communityHighlights.communityId],
    references: [communities.id],
  }),
  image: one(images, {
    fields: [communityHighlights.imageId],
    references: [images.id],
  }),
}));

export const galleryImagesRelations = relations(galleryImages, ({ one }) => ({
  gallery: one(galleries, {
    fields: [galleryImages.galleryId],
    references: [galleries.id],
  }),
  image: one(images, {
    fields: [galleryImages.imageId],
    references: [images.id],
  }),
}));

export const floorPlanImagesRelations = relations(floorPlanImages, ({ one }) => ({
  floorPlan: one(floorPlans, {
    fields: [floorPlanImages.floorPlanId],
    references: [floorPlans.id],
  }),
  image: one(images, {
    fields: [floorPlanImages.imageId],
    references: [images.id],
  }),
}));

export const imagesRelations = relations(images, ({ one, many }) => ({
  uploadedBy: one(users, {
    fields: [images.uploadedBy],
    references: [users.id],
  }),
  galleries: many(galleryImages),
  floorPlans: many(floorPlanImages),
}));

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(quizQuestions),
  responses: many(quizResponses),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
  answerOptions: many(quizAnswerOptions),
}));

export const quizAnswerOptionsRelations = relations(quizAnswerOptions, ({ one }) => ({
  question: one(quizQuestions, {
    fields: [quizAnswerOptions.questionId],
    references: [quizQuestions.id],
  }),
}));

export const quizResponsesRelations = relations(quizResponses, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizResponses.quizId],
    references: [quizzes.id],
  }),
}));

export const contentAssetsRelations = relations(contentAssets, ({ one, many }) => ({
  thumbnailImage: one(images, {
    fields: [contentAssets.thumbnailImageId],
    references: [images.id],
  }),
  downloads: many(assetDownloads),
}));

export const assetDownloadsRelations = relations(assetDownloads, ({ one }) => ({
  asset: one(contentAssets, {
    fields: [assetDownloads.assetId],
    references: [contentAssets.id],
  }),
}));

// Insert schemas
export const insertCareTypeSchema = createInsertSchema(careTypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAmenitySchema = createInsertSchema(amenities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunitySchema = createInsertSchema(communities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Only name is required, all other fields are optional
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  propertyMapUrl: z.string().optional().nullable(),
  mainColorHex: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Invalid hex color format (use #RRGGBB)").optional(),
  ctaColorHex: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Invalid hex color format (use #RRGGBB)").optional(),
  yearEstablished: z.number().min(1800).max(new Date().getFullYear()).optional().nullable(),
  licensedSince: z.string().optional().nullable(), // Date string in ISO format
  residentCapacity: z.number().min(1).optional().nullable(),
  specialCertifications: z.array(z.string()).optional(),
  verifiedStats: z.record(z.union([z.number(), z.string()])).optional(),
});

export const insertCommunityCareTypeSchema = createInsertSchema(communitiesCareTypes).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityAmenitySchema = createInsertSchema(communitiesAmenities).omit({
  id: true,
  createdAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  tags: z.array(z.string()).optional().default([]),
  attachmentId: z.string().optional(),
});

export const insertPostAttachmentSchema = createInsertSchema(postAttachments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  publishedAt: z.coerce.date().nullable().optional(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().nullable().optional(),
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGallerySchema = createInsertSchema(galleries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTourRequestSchema = createInsertSchema(tourRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Enhanced validation for better UX
  name: z.string().min(2, "Please enter at least 2 characters").max(100, "Name is too long"),
  phone: z.string().min(10, "Please enter a valid phone number").regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  message: z.string().max(1000, "Message is too long").optional(),
  status: z.enum(["new", "contacted", "scheduled", "toured", "follow-up", "converted", "not-interested"]).optional(),
  notes: z.string().optional(),
  lastContactedAt: z.coerce.date().optional(),
  scheduledDate: z.coerce.date().optional(),
  // Bot protection fields (not stored in database)
  captchaToken: z.string().optional(),
  honeypot: z.string().optional(),
  formLoadTime: z.number().optional(),
});

export const insertLandingPageTemplateSchema = createInsertSchema(landingPageTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  urlPattern: z.string().min(1, "URL pattern is required"),
  templateType: z.enum(["location", "community", "general", "location-specific", "care-type-specific", "hybrid"]),
  title: z.string().min(1, "Title is required"),
  cities: z.array(z.string()).optional().default([]),
});

export const insertFloorPlanSchema = createInsertSchema(floorPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  postDate: z.coerce.date().optional(),
});

export const insertCommunityHighlightSchema = createInsertSchema(communityHighlights).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunityFeatureSchema = createInsertSchema(communityFeatures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  createdAt: true,
});

export const insertFloorPlanImageSchema = createInsertSchema(floorPlanImages).omit({
  id: true,
  createdAt: true,
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username is too long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
});

export const insertGoogleAdsConversionActionSchema = createInsertSchema(googleAdsConversionActions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGoogleAdsCampaignSchema = createInsertSchema(googleAdsCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  syncedAt: true,
});

export const insertGoogleAdsAdGroupSchema = createInsertSchema(googleAdsAdGroups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGoogleAdsKeywordSchema = createInsertSchema(googleAdsKeywords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGoogleAdsAdSchema = createInsertSchema(googleAdsAds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Page heroes table for managing hero sections across pages
export const pageHeroes = pgTable("page_heroes", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  pagePath: varchar("page_path", { length: 255 }).notNull().unique(), // e.g., '/communities', '/care-points'
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  backgroundImageUrl: text("background_image_url").notNull(), // Keep for backward compatibility
  imageId: varchar("image_id", { length: 255 }).references(() => images.id), // New image reference
  ctaText: varchar("cta_text", { length: 100 }),
  ctaLink: varchar("cta_link", { length: 255 }),
  overlayOpacity: decimal("overlay_opacity", { precision: 3, scale: 2 }).default("0.50"), // 0-1 for background overlay darkness
  textAlignment: varchar("text_alignment", { length: 20 }).default("center"), // left, center, right
  active: boolean("active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPageHeroSchema = createInsertSchema(pageHeroes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Homepage sections for managing homepage content
export const homepageSections = pgTable("homepage_sections", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(), // e.g., "safety-with-dignity", "hero", "features"
  sectionType: text("section_type").notNull(), // "hero", "feature", "cta", "content"
  title: text("title"),
  subtitle: text("subtitle"),
  body: text("body"), // Can store markdown or rich text
  ctaLabel: text("cta_label"),
  ctaUrl: text("cta_url"),
  imageId: varchar("image_id", { length: 255 }).references(() => images.id, { onDelete: "set null" }),
  sortOrder: integer("sort_order").default(0),
  visible: boolean("visible").default(true),
  metadata: jsonb("metadata").$type<Record<string, any>>(), // Flexible field for additional data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertHomepageSectionSchema = createInsertSchema(homepageSections).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Types
export type CareType = typeof careTypes.$inferSelect;
export type InsertCareType = z.infer<typeof insertCareTypeSchema>;
export type Amenity = typeof amenities.$inferSelect;
export type InsertAmenity = z.infer<typeof insertAmenitySchema>;
export type Community = typeof communities.$inferSelect;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type CommunityCard = {
  id: string;
  name: string;
  slug: string;
  city: string;
  imageId: string | null;
};
export type CommunityCareType = typeof communitiesCareTypes.$inferSelect;
export type InsertCommunityCareType = z.infer<typeof insertCommunityCareTypeSchema>;
export type CommunityAmenity = typeof communitiesAmenities.$inferSelect;
export type InsertCommunityAmenity = z.infer<typeof insertCommunityAmenitySchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type PostAttachment = typeof postAttachments.$inferSelect;
export type InsertPostAttachment = z.infer<typeof insertPostAttachmentSchema>;
export type BlogPost = typeof blogPosts.$inferSelect & {
  authorDetails?: {
    id: string;
    name: string;
    slug: string;
    role: string;
    department: string | null;
    avatarImageId: string | null;
    email: string | null;
  };
};
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Faq = typeof faqs.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Gallery = typeof galleries.$inferSelect;
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type TourRequest = typeof tourRequests.$inferSelect;
export type InsertTourRequest = z.infer<typeof insertTourRequestSchema>;
export type LandingPageTemplate = typeof landingPageTemplates.$inferSelect;
export type InsertLandingPageTemplate = z.infer<typeof insertLandingPageTemplateSchema>;
export type FloorPlan = typeof floorPlans.$inferSelect;
export type InsertFloorPlan = z.infer<typeof insertFloorPlanSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type CommunityHighlight = typeof communityHighlights.$inferSelect;
export type InsertCommunityHighlight = z.infer<typeof insertCommunityHighlightSchema>;
export type CommunityFeature = typeof communityFeatures.$inferSelect;
export type InsertCommunityFeature = z.infer<typeof insertCommunityFeatureSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type FloorPlanImage = typeof floorPlanImages.$inferSelect;
export type InsertFloorPlanImage = z.infer<typeof insertFloorPlanImageSchema>;

export type FloorPlanImageWithDetails = FloorPlanImage & {
  imageUrl: string;
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  objectKey: string;
  variants?: any;
  uploadedAt?: Date | null;
};

export type GalleryImageWithDetails = GalleryImage & {
  imageUrl: string;
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  objectKey?: string | null;
  variants?: any | null;
  uploadedAt?: Date | null;
  galleryTitle?: string | null;
  gallerySlug?: string | null;
  category?: string | null;
  communityId?: string | null;
  hero?: boolean | null;
  published?: boolean | null;
  galleryActive?: boolean | null;
};

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectGoogleAdsConversionAction = typeof googleAdsConversionActions.$inferSelect;
export type InsertGoogleAdsConversionAction = z.infer<typeof insertGoogleAdsConversionActionSchema>;
export type GoogleAdsCampaign = typeof googleAdsCampaigns.$inferSelect;
export type InsertGoogleAdsCampaign = z.infer<typeof insertGoogleAdsCampaignSchema>;
export type GoogleAdsAdGroup = typeof googleAdsAdGroups.$inferSelect;
export type InsertGoogleAdsAdGroup = z.infer<typeof insertGoogleAdsAdGroupSchema>;
export type GoogleAdsKeyword = typeof googleAdsKeywords.$inferSelect;
export type InsertGoogleAdsKeyword = z.infer<typeof insertGoogleAdsKeywordSchema>;
export type GoogleAdsAd = typeof googleAdsAds.$inferSelect;
export type InsertGoogleAdsAd = z.infer<typeof insertGoogleAdsAdSchema>;
export type PageHero = typeof pageHeroes.$inferSelect;
export type InsertPageHero = z.infer<typeof insertPageHeroSchema>;
export type HomepageSection = typeof homepageSections.$inferSelect;
export type InsertHomepageSection = z.infer<typeof insertHomepageSectionSchema>;

// Homepage Config table
export const homepageConfig = pgTable("homepage_config", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  sectionKey: varchar("section_key", { length: 100 }).notNull().unique(),
  heading: text("heading"),
  subheading: text("subheading"),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertHomepageConfigSchema = createInsertSchema(homepageConfig, {
  sectionKey: z.string().min(1).max(100),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type HomepageConfig = typeof homepageConfig.$inferSelect;
export type InsertHomepageConfig = z.infer<typeof insertHomepageConfigSchema>;

// Email Recipients table for tour request notifications
export const emailRecipients = pgTable("email_recipients", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEmailRecipientSchema = createInsertSchema(emailRecipients, {
  email: z.string().email().max(255),
  name: z.string().max(255).optional(),
  active: z.boolean().default(true),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type EmailRecipient = typeof emailRecipients.$inferSelect;
export type InsertEmailRecipient = z.infer<typeof insertEmailRecipientSchema>;

// Page Content Sections table for managing dynamic page content
export const pageContentSections = pgTable("page_content_sections", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  pagePath: varchar("page_path", { length: 255 }), // e.g., '/courtyards-patios' (optional if using landingPageTemplateId)
  landingPageTemplateId: uuid("landing_page_template_id").references(() => landingPageTemplates.id, { onDelete: "cascade" }), // Link to landing page template
  sectionType: varchar("section_type", { length: 100 }).notNull(), // e.g., 'text_block', 'feature_list', 'benefit_cards'
  sectionKey: varchar("section_key", { length: 255 }).notNull(), // Unique identifier for the section
  title: text("title"),
  subtitle: text("subtitle"),
  content: jsonb("content").$type<Record<string, any>>(), // Flexible JSON for section data
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPageContentSectionSchema = createInsertSchema(pageContentSections, {
  pagePath: z.string().min(1).max(255).optional(),
  landingPageTemplateId: z.string().uuid().optional(),
  sectionType: z.string().min(1).max(100),
  sectionKey: z.string().min(1).max(255),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.record(z.any()).optional(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
}).omit({ id: true, createdAt: true, updatedAt: true }).refine(
  (data) => data.pagePath || data.landingPageTemplateId,
  { message: "Either pagePath or landingPageTemplateId must be provided" }
);

export type PageContentSection = typeof pageContentSections.$inferSelect;
export type InsertPageContentSection = z.infer<typeof insertPageContentSectionSchema>;

// Exit Intent Popup table - singleton table for managing exit intent popup settings
export const exitIntentPopup = pgTable("exit_intent_popup", {
  id: integer("id").primaryKey().default(1), // Singleton - only one row with id=1
  title: varchar("title", { length: 255 }).notNull().default("Wait! Don't Miss This"),
  message: text("message").notNull().default("Get our comprehensive Senior Living Guide absolutely free"),
  ctaText: varchar("cta_text", { length: 100 }).notNull().default("Get My Free Guide"),
  ctaLink: text("cta_link"), // Optional link for CTA button
  imageId: varchar("image_id", { length: 255 }).references(() => images.id, { onDelete: "set null" }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertExitIntentPopupSchema = createInsertSchema(exitIntentPopup, {
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  ctaText: z.string().min(1).max(100),
  ctaLink: z.string().optional(),
  imageId: z.string().optional(),
  active: z.boolean().default(true),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type ExitIntentPopup = typeof exitIntentPopup.$inferSelect;
export type InsertExitIntentPopup = z.infer<typeof insertExitIntentPopupSchema>;

// Exit Intent Popup Submissions table - tracks email captures from exit intent popups
export const exitIntentSubmissions = pgTable("exit_intent_submissions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull(),
  source: varchar("source", { length: 255 }), // Which page they were on when popup showed
  utmSource: varchar("utm_source", { length: 255 }),
  utmMedium: varchar("utm_medium", { length: 255 }),
  utmCampaign: varchar("utm_campaign", { length: 255 }),
  utmTerm: varchar("utm_term", { length: 255 }),
  utmContent: varchar("utm_content", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExitIntentSubmissionSchema = createInsertSchema(exitIntentSubmissions, {
  email: z.string().email(),
  source: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
}).omit({ id: true, createdAt: true });

export type ExitIntentSubmission = typeof exitIntentSubmissions.$inferSelect;
export type InsertExitIntentSubmission = z.infer<typeof insertExitIntentSubmissionSchema>;

// Quiz schemas and types
export const insertQuizSchema = createInsertSchema(quizzes, {
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  resultTitle: z.string().max(255).optional(),
  resultMessage: z.string().optional(),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions, {
  quizId: z.string().uuid(),
  questionText: z.string().min(1),
  questionType: z.enum(["multiple_choice", "text", "scale"]).default("multiple_choice"),
  sortOrder: z.number().int().default(0),
  required: z.boolean().default(true),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

export const insertQuizAnswerOptionSchema = createInsertSchema(quizAnswerOptions, {
  questionId: z.string().uuid(),
  answerText: z.string().min(1),
  resultCategory: z.string().max(100).optional(),
  sortOrder: z.number().int().default(0),
}).omit({ id: true, createdAt: true });

export type QuizAnswerOption = typeof quizAnswerOptions.$inferSelect;
export type InsertQuizAnswerOption = z.infer<typeof insertQuizAnswerOptionSchema>;

export const insertQuizResponseSchema = createInsertSchema(quizResponses, {
  quizId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().max(255).optional(),
  phone: z.string().max(20).optional(),
  zipCode: z.string().max(10).optional(),
  timeline: z.string().max(100).optional(),
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    answerOptionId: z.string().uuid().optional(),
    textAnswer: z.string().optional(),
  })),
  resultCategory: z.string().max(100).optional(),
}).omit({ id: true, createdAt: true });

export type QuizResponse = typeof quizResponses.$inferSelect;
export type InsertQuizResponse = z.infer<typeof insertQuizResponseSchema>;

// Content asset schemas and types
export const insertContentAssetSchema = createInsertSchema(contentAssets, {
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  fileUrl: z.string().optional(),
  objectKey: z.string().optional(),
  thumbnailImageId: z.string().optional().nullable(),
  fileSize: z.number().int().optional().nullable(),
  mimeType: z.string().max(100).optional(),
  requiredFields: z.array(z.string()).default([]),
  articleContent: z.string().optional(),
  featuredImageId: z.string().optional().nullable(),
  authorId: z.string().uuid().optional().nullable(),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
}).omit({ id: true, downloadCount: true, createdAt: true, updatedAt: true });

export type ContentAsset = typeof contentAssets.$inferSelect;
export type InsertContentAsset = z.infer<typeof insertContentAssetSchema>;

export const insertAssetDownloadSchema = createInsertSchema(assetDownloads, {
  assetId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().max(255).optional(),
  phone: z.string().max(20).optional(),
  zipCode: z.string().max(10).optional(),
  timeline: z.string().max(100).optional(),
}).omit({ id: true, createdAt: true });

export type AssetDownload = typeof assetDownloads.$inferSelect;
export type InsertAssetDownload = z.infer<typeof insertAssetDownloadSchema>;

// Site settings schemas and types
export const insertSiteSettingsSchema = createInsertSchema(siteSettings, {
  companyName: z.string().min(1).max(255).default("Stage Senior"),
  companyPhoneDisplay: z.string().max(20).default("(970) 444-4689"),
  companyPhoneDial: z.string().max(20).default("+19704444689"),
  companyEmail: z.string().email().optional().nullable(),
  companyAddress: z.string().optional().nullable(),
  companyCity: z.string().max(100).optional().nullable(),
  companyState: z.string().length(2).optional().nullable(),
  companyZip: z.string().max(10).optional().nullable(),
  facebookUrl: z.string().url().optional().nullable(),
  instagramUrl: z.string().url().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  twitterUrl: z.string().url().optional().nullable(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
