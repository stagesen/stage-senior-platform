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
  serial
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
  heroImageUrl: text("hero_image_url"), // Keep for backward compatibility
  imageId: varchar("image_id", { length: 255 }).references(() => images.id), // New image reference
  logoImageId: varchar("logo_image_id", { length: 255 }).references(() => images.id), // Logo image reference
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
  experienceImage1Id: varchar("experience_image_1_id", { length: 255 }).references(() => images.id), // Experience the Difference image 1
  experienceImage2Id: varchar("experience_image_2_id", { length: 255 }).references(() => images.id), // Experience the Difference image 2
  experienceImage3Id: varchar("experience_image_3_id", { length: 255 }).references(() => images.id), // Experience the Difference image 3
  experienceImage4Id: varchar("experience_image_4_id", { length: 255 }).references(() => images.id), // Experience the Difference image 4
  overview: text("overview"),
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
  mainColorHex: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Invalid hex color format (use #RRGGBB)").optional(),
  ctaColorHex: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Invalid hex color format (use #RRGGBB)").optional(),
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

// Page heroes table for managing hero sections across pages
export const pageHeroes = pgTable("page_heroes", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  pagePath: varchar("page_path", { length: 255 }).notNull().unique(), // e.g., '/communities', '/care-points'
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
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
export type CommunityCareType = typeof communitiesCareTypes.$inferSelect;
export type InsertCommunityCareType = z.infer<typeof insertCommunityCareTypeSchema>;
export type CommunityAmenity = typeof communitiesAmenities.$inferSelect;
export type InsertCommunityAmenity = z.infer<typeof insertCommunityAmenitySchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type PostAttachment = typeof postAttachments.$inferSelect;
export type InsertPostAttachment = z.infer<typeof insertPostAttachmentSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Faq = typeof faqs.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Gallery = typeof galleries.$inferSelect;
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type TourRequest = typeof tourRequests.$inferSelect;
export type InsertTourRequest = z.infer<typeof insertTourRequestSchema>;
export type FloorPlan = typeof floorPlans.$inferSelect;
export type InsertFloorPlan = z.infer<typeof insertFloorPlanSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
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
