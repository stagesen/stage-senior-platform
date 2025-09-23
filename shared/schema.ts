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
  uuid
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const communities = pgTable("communities", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull().default("CO"),
  zipCode: varchar("zip_code", { length: 10 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  heroImageUrl: text("hero_image_url"),
  description: text("description"),
  shortDescription: text("short_description"),
  startingPrice: integer("starting_price"),
  careTypes: jsonb("care_types").$type<string[]>().default([]),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  featured: boolean("featured").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary"),
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
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary"),
  description: text("description"),
  imageUrl: text("image_url"),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at"),
  locationText: text("location_text"),
  rsvpUrl: text("rsvp_url"),
  communityId: uuid("community_id").references(() => communities.id),
  maxAttendees: integer("max_attendees"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }),
  communityId: uuid("community_id").references(() => communities.id),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const galleries = pgTable("galleries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  images: jsonb("images").$type<Array<{
    url: string;
    alt: string;
    width?: number;
    height?: number;
    caption?: string;
  }>>().default([]),
  communityId: uuid("community_id").references(() => communities.id),
  category: varchar("category", { length: 100 }),
  active: boolean("active").default(true),
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
  name: varchar("name", { length: 255 }).notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }).notNull(),
  squareFeet: integer("square_feet"),
  description: text("description"),
  highlights: jsonb("highlights").$type<string[]>().default([]),
  imageUrl: text("image_url"),
  planImageUrl: text("plan_image_url"),
  pdfUrl: text("pdf_url"),
  startingPrice: integer("starting_price"),
  availability: varchar("availability", { length: 50 }).default("available"),
  sortOrder: integer("sort_order").default(0),
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
export const communitiesRelations = relations(communities, ({ many }) => ({
  posts: many(posts),
  events: many(events),
  faqs: many(faqs),
  galleries: many(galleries),
  tourRequests: many(tourRequests),
  floorPlans: many(floorPlans),
  testimonials: many(testimonials),
  galleryImages: many(galleryImages),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  community: one(communities, {
    fields: [posts.communityId],
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
export const insertCommunitySchema = createInsertSchema(communities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
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

// Types
export type Community = typeof communities.$inferSelect;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
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
