import {
  communities,
  posts,
  events,
  faqs,
  galleries,
  tourRequests,
  type Community,
  type InsertCommunity,
  type Post,
  type InsertPost,
  type Event,
  type InsertEvent,
  type Faq,
  type InsertFaq,
  type Gallery,
  type InsertGallery,
  type TourRequest,
  type InsertTourRequest,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, like, isNull, or, sql } from "drizzle-orm";

export interface IStorage {
  // Community operations
  getCommunities(filters?: {
    careTypes?: string[];
    city?: string;
    active?: boolean;
  }): Promise<Community[]>;
  getCommunity(slug: string): Promise<Community | undefined>;
  getCommunityById(id: string): Promise<Community | undefined>;
  createCommunity(community: InsertCommunity): Promise<Community>;
  updateCommunity(id: string, community: Partial<InsertCommunity>): Promise<Community>;
  deleteCommunity(id: string): Promise<void>;

  // Post operations
  getPosts(filters?: {
    published?: boolean;
    communityId?: string;
    tags?: string[];
  }): Promise<Post[]>;
  getPost(slug: string): Promise<Post | undefined>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post>;
  deletePost(id: string): Promise<void>;

  // Event operations
  getEvents(filters?: {
    communityId?: string;
    upcoming?: boolean;
    public?: boolean;
  }): Promise<Event[]>;
  getEvent(slug: string): Promise<Event | undefined>;
  getEventById(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;

  // FAQ operations
  getFaqs(filters?: {
    communityId?: string;
    category?: string;
    active?: boolean;
  }): Promise<Faq[]>;
  getFaq(id: string): Promise<Faq | undefined>;
  createFaq(faq: InsertFaq): Promise<Faq>;
  updateFaq(id: string, faq: Partial<InsertFaq>): Promise<Faq>;
  deleteFaq(id: string): Promise<void>;

  // Gallery operations
  getGalleries(filters?: {
    communityId?: string;
    category?: string;
    active?: boolean;
  }): Promise<Gallery[]>;
  getGallery(id: string): Promise<Gallery | undefined>;
  createGallery(gallery: InsertGallery): Promise<Gallery>;
  updateGallery(id: string, gallery: Partial<InsertGallery>): Promise<Gallery>;
  deleteGallery(id: string): Promise<void>;

  // Tour request operations
  getTourRequests(filters?: {
    communityId?: string;
    status?: string;
  }): Promise<TourRequest[]>;
  getTourRequest(id: string): Promise<TourRequest | undefined>;
  createTourRequest(tourRequest: InsertTourRequest): Promise<TourRequest>;
  updateTourRequest(id: string, tourRequest: Partial<InsertTourRequest>): Promise<TourRequest>;
  deleteTourRequest(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Community operations
  async getCommunities(filters?: {
    careTypes?: string[];
    city?: string;
    active?: boolean;
  }): Promise<Community[]> {
    let query = db.select().from(communities);
    
    const conditions = [];
    if (filters?.active !== undefined) {
      conditions.push(eq(communities.active, filters.active));
    }
    if (filters?.city) {
      conditions.push(like(communities.city, `%${filters.city}%`));
    }
    if (filters?.careTypes && filters.careTypes.length > 0) {
      // Use PostgreSQL JSON operator to check if any care type matches
      conditions.push(
        sql`${communities.careTypes} && ${JSON.stringify(filters.careTypes)}`
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(communities.featured), asc(communities.name));
  }

  async getCommunity(slug: string): Promise<Community | undefined> {
    const [community] = await db
      .select()
      .from(communities)
      .where(eq(communities.slug, slug));
    return community;
  }

  async getCommunityById(id: string): Promise<Community | undefined> {
    const [community] = await db
      .select()
      .from(communities)
      .where(eq(communities.id, id));
    return community;
  }

  async createCommunity(community: InsertCommunity): Promise<Community> {
    const [created] = await db
      .insert(communities)
      .values(community)
      .returning();
    return created;
  }

  async updateCommunity(id: string, community: Partial<InsertCommunity>): Promise<Community> {
    const [updated] = await db
      .update(communities)
      .set(community)
      .where(eq(communities.id, id))
      .returning();
    return updated;
  }

  async deleteCommunity(id: string): Promise<void> {
    await db.delete(communities).where(eq(communities.id, id));
  }

  // Post operations
  async getPosts(filters?: {
    published?: boolean;
    communityId?: string;
    tags?: string[];
  }): Promise<Post[]> {
    let query = db.select().from(posts);
    
    const conditions = [];
    if (filters?.published !== undefined) {
      conditions.push(eq(posts.published, filters.published));
    }
    if (filters?.communityId) {
      conditions.push(eq(posts.communityId, filters.communityId));
    }
    if (filters?.tags && filters.tags.length > 0) {
      conditions.push(
        sql`${posts.tags} && ${JSON.stringify(filters.tags)}`
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(posts.publishedAt), desc(posts.createdAt));
  }

  async getPost(slug: string): Promise<Post | undefined> {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug));
    return post;
  }

  async getPostById(id: string): Promise<Post | undefined> {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id));
    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [created] = await db
      .insert(posts)
      .values(post)
      .returning();
    return created;
  }

  async updatePost(id: string, post: Partial<InsertPost>): Promise<Post> {
    const [updated] = await db
      .update(posts)
      .set(post)
      .where(eq(posts.id, id))
      .returning();
    return updated;
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  // Event operations
  async getEvents(filters?: {
    communityId?: string;
    upcoming?: boolean;
    public?: boolean;
  }): Promise<Event[]> {
    let query = db.select().from(events);
    
    const conditions = [];
    if (filters?.communityId) {
      conditions.push(eq(events.communityId, filters.communityId));
    }
    if (filters?.upcoming !== undefined && filters.upcoming) {
      conditions.push(sql`${events.startsAt} > NOW()`);
    }
    if (filters?.public !== undefined) {
      conditions.push(eq(events.isPublic, filters.public));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(asc(events.startsAt));
  }

  async getEvent(slug: string): Promise<Event | undefined> {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.slug, slug));
    return event;
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db
      .insert(events)
      .values(event)
      .returning();
    return created;
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event> {
    const [updated] = await db
      .update(events)
      .set(event)
      .where(eq(events.id, id))
      .returning();
    return updated;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // FAQ operations
  async getFaqs(filters?: {
    communityId?: string;
    category?: string;
    active?: boolean;
  }): Promise<Faq[]> {
    let query = db.select().from(faqs);
    
    const conditions = [];
    if (filters?.communityId) {
      conditions.push(eq(faqs.communityId, filters.communityId));
    }
    if (filters?.category) {
      conditions.push(eq(faqs.category, filters.category));
    }
    if (filters?.active !== undefined) {
      conditions.push(eq(faqs.active, filters.active));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(asc(faqs.sortOrder), asc(faqs.question));
  }

  async getFaq(id: string): Promise<Faq | undefined> {
    const [faq] = await db
      .select()
      .from(faqs)
      .where(eq(faqs.id, id));
    return faq;
  }

  async createFaq(faq: InsertFaq): Promise<Faq> {
    const [created] = await db
      .insert(faqs)
      .values(faq)
      .returning();
    return created;
  }

  async updateFaq(id: string, faq: Partial<InsertFaq>): Promise<Faq> {
    const [updated] = await db
      .update(faqs)
      .set(faq)
      .where(eq(faqs.id, id))
      .returning();
    return updated;
  }

  async deleteFaq(id: string): Promise<void> {
    await db.delete(faqs).where(eq(faqs.id, id));
  }

  // Gallery operations
  async getGalleries(filters?: {
    communityId?: string;
    category?: string;
    active?: boolean;
  }): Promise<Gallery[]> {
    let query = db.select().from(galleries);
    
    const conditions = [];
    if (filters?.communityId) {
      conditions.push(eq(galleries.communityId, filters.communityId));
    }
    if (filters?.category) {
      conditions.push(eq(galleries.category, filters.category));
    }
    if (filters?.active !== undefined) {
      conditions.push(eq(galleries.active, filters.active));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(galleries.createdAt));
  }

  async getGallery(id: string): Promise<Gallery | undefined> {
    const [gallery] = await db
      .select()
      .from(galleries)
      .where(eq(galleries.id, id));
    return gallery;
  }

  async createGallery(gallery: InsertGallery): Promise<Gallery> {
    const [created] = await db
      .insert(galleries)
      .values(gallery)
      .returning();
    return created;
  }

  async updateGallery(id: string, gallery: Partial<InsertGallery>): Promise<Gallery> {
    const [updated] = await db
      .update(galleries)
      .set(gallery)
      .where(eq(galleries.id, id))
      .returning();
    return updated;
  }

  async deleteGallery(id: string): Promise<void> {
    await db.delete(galleries).where(eq(galleries.id, id));
  }

  // Tour request operations
  async getTourRequests(filters?: {
    communityId?: string;
    status?: string;
  }): Promise<TourRequest[]> {
    let query = db.select().from(tourRequests);
    
    const conditions = [];
    if (filters?.communityId) {
      conditions.push(eq(tourRequests.communityId, filters.communityId));
    }
    if (filters?.status) {
      conditions.push(eq(tourRequests.status, filters.status));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(tourRequests.createdAt));
  }

  async getTourRequest(id: string): Promise<TourRequest | undefined> {
    const [tourRequest] = await db
      .select()
      .from(tourRequests)
      .where(eq(tourRequests.id, id));
    return tourRequest;
  }

  async createTourRequest(tourRequest: InsertTourRequest): Promise<TourRequest> {
    const [created] = await db
      .insert(tourRequests)
      .values(tourRequest)
      .returning();
    return created;
  }

  async updateTourRequest(id: string, tourRequest: Partial<InsertTourRequest>): Promise<TourRequest> {
    const [updated] = await db
      .update(tourRequests)
      .set(tourRequest)
      .where(eq(tourRequests.id, id))
      .returning();
    return updated;
  }

  async deleteTourRequest(id: string): Promise<void> {
    await db.delete(tourRequests).where(eq(tourRequests.id, id));
  }
}

export const storage = new DatabaseStorage();
