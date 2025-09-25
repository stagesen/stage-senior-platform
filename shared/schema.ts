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
  heroImageUrl: text("hero_image_url"),
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

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary"),
  bodyHtml: text("body_html"), // Additional field from CSV
  content: text("content").notNull(),
  heroImageUrl: text("hero_image_url"),
  tags: jsonb("tags").$type<string[]>().default([]),
  communityId: uuid("community_id").references(() => communities.id),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  eventSlug: varchar("event_slug", { length: 255 }), // Additional field from CSV
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary"),
  description: text("description"),
  imageUrl: text("image_url"),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at"),
  locationText: text("location_text"),
  rsvpUrl: text("rsvp_url"),
  communityId: uuid("community_id").references(() => communities.id),
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
  communityId: uuid("community_id").references(() => communities.id),
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
  communityId: uuid("community_id").references(() => communities.id),
  category: varchar("category", { length: 100 }),
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
  author: varchar("author", { length: 255 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  communityId: uuid("community_id").references(() => communities.id),
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
  communityId: uuid("community_id").references(() => communities.id),
  preferredDate: timestamp("preferred_date"),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const floorPlans = pgTable("floor_plans", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: uuid("community_id").references(() => communities.id),
  planSlug: varchar("plan_slug", { length: 255 }), // Additional field from CSV
  name: varchar("name", { length: 255 }).notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }).notNull(),
  squareFeet: integer("square_feet"),
  description: text("description"),
  highlights: jsonb("highlights").$type<string[]>().default([]),
  images: jsonb("images").$type<string[]>().default([]), // Additional field from CSV for multiple images
  imageUrl: text("image_url"),
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
  communityId: uuid("community_id").references(() => communities.id),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorRelation: varchar("author_relation", { length: 100 }),
  content: text("content").notNull(),
  rating: integer("rating"),
  featured: boolean("featured").default(false),
  approved: boolean("approved").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const galleryImages = pgTable("gallery_images", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  communityId: uuid("community_id").references(() => communities.id),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  caption: text("caption"),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  width: integer("width"),
  height: integer("height"),
  featured: boolean("featured").default(false),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const careTypesRelations = relations(careTypes, ({ many }) => ({
  communities: many(communitiesCareTypes),
}));

export const amenitiesRelations = relations(amenities, ({ many }) => ({
  communities: many(communitiesAmenities),
}));

export const communitiesRelations = relations(communities, ({ many }) => ({
  posts: many(posts),
  events: many(events),
  faqs: many(faqs),
  galleries: many(galleries),
  blogPosts: many(blogPosts),
  tourRequests: many(tourRequests),
  floorPlans: many(floorPlans),
  testimonials: many(testimonials),
  galleryImages: many(galleryImages),
  careTypes: many(communitiesCareTypes),
  amenities: many(communitiesAmenities),
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

export const postsRelations = relations(posts, ({ one }) => ({
  community: one(communities, {
    fields: [posts.communityId],
    references: [communities.id],
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
}));

export const faqsRelations = relations(faqs, ({ one }) => ({
  community: one(communities, {
    fields: [faqs.communityId],
    references: [communities.id],
  }),
}));

export const galleriesRelations = relations(galleries, ({ one }) => ({
  community: one(communities, {
    fields: [galleries.communityId],
    references: [communities.id],
  }),
}));

export const tourRequestsRelations = relations(tourRequests, ({ one }) => ({
  community: one(communities, {
    fields: [tourRequests.communityId],
    references: [communities.id],
  }),
}));

export const floorPlansRelations = relations(floorPlans, ({ one }) => ({
  community: one(communities, {
    fields: [floorPlans.communityId],
    references: [communities.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  community: one(communities, {
    fields: [testimonials.communityId],
    references: [communities.id],
  }),
}));

export const galleryImagesRelations = relations(galleryImages, ({ one }) => ({
  community: one(communities, {
    fields: [galleryImages.communityId],
    references: [communities.id],
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
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
