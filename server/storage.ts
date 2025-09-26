import {
  communities,
  posts,
  blogPosts,
  events,
  faqs,
  galleries,
  tourRequests,
  floorPlans,
  testimonials,
  galleryImages,
  careTypes,
  communitiesCareTypes,
  amenities,
  communitiesAmenities,
  users,
  images,
  type Community,
  type InsertCommunity,
  type Post,
  type InsertPost,
  type BlogPost,
  type InsertBlogPost,
  type Event,
  type InsertEvent,
  type Faq,
  type InsertFaq,
  type Gallery,
  type InsertGallery,
  type TourRequest,
  type InsertTourRequest,
  type FloorPlan,
  type InsertFloorPlan,
  type Testimonial,
  type InsertTestimonial,
  type GalleryImage,
  type InsertGalleryImage,
  type GalleryImageWithDetails,
  type CareType,
  type InsertCareType,
  type Amenity,
  type User,
  type InsertUser,
  type Image,
  type InsertImage,
  pageHeroes,
  type PageHero,
  type InsertPageHero,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, like, isNull, or, sql, inArray } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const galleryImageDetailsSelection = {
  id: galleryImages.id,
  galleryId: galleryImages.galleryId,
  imageId: galleryImages.imageId,
  caption: galleryImages.caption,
  sortOrder: galleryImages.sortOrder,
  createdAt: galleryImages.createdAt,
  imageUrl: images.url,
  url: images.url,
  alt: images.alt,
  width: images.width,
  height: images.height,
  objectKey: images.objectKey,
  variants: images.variants,
  uploadedAt: images.createdAt,
  galleryTitle: galleries.title,
  gallerySlug: galleries.gallerySlug,
  category: galleries.category,
  communityId: galleries.communityId,
  hero: galleries.hero,
  published: galleries.published,
  galleryActive: galleries.active,
};

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

  // Blog Post operations
  getBlogPosts(filters?: {
    published?: boolean;
    communityId?: string;
    tags?: string[];
    category?: string;
    author?: string;
  }): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<void>;

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

  // Floor plan operations
  getFloorPlans(filters?: {
    communityId?: string;
    active?: boolean;
  }): Promise<FloorPlan[]>;
  getFloorPlan(id: string): Promise<FloorPlan | undefined>;
  createFloorPlan(floorPlan: InsertFloorPlan): Promise<FloorPlan>;
  updateFloorPlan(id: string, floorPlan: Partial<InsertFloorPlan>): Promise<FloorPlan>;
  deleteFloorPlan(id: string): Promise<void>;

  // Testimonial operations
  getTestimonials(filters?: {
    communityId?: string;
    featured?: boolean;
    approved?: boolean;
  }): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: string): Promise<void>;

  // Gallery image operations
  getFilteredGalleryImages(filters?: {
    communityId?: string;
    category?: string;
    featured?: boolean;
    active?: boolean;
  }): Promise<GalleryImageWithDetails[]>;
  getGalleryImage(id: string): Promise<GalleryImageWithDetails | undefined>;
  createGalleryImage(galleryImage: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: string, galleryImage: Partial<InsertGalleryImage>): Promise<GalleryImage>;
  deleteGalleryImage(id: string): Promise<void>;

  // Care type operations
  getCareTypes(filters?: {
    active?: boolean;
  }): Promise<CareType[]>;
  getCareType(slug: string): Promise<CareType | undefined>;
  getCareTypeById(id: string): Promise<CareType | undefined>;

  // User operations - referenced by javascript_auth_all_persistance integration
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserCount(): Promise<number>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;

  // Session store - referenced by javascript_auth_all_persistance integration
  sessionStore: session.Store;

  // Page hero operations
  getPageHeroes(filters?: {
    active?: boolean;
  }): Promise<PageHero[]>;
  getPageHero(pagePath: string): Promise<PageHero | undefined>;
  getPageHeroById(id: string): Promise<PageHero | undefined>;
  createPageHero(pageHero: InsertPageHero): Promise<PageHero>;
  updatePageHero(id: string, pageHero: Partial<InsertPageHero>): Promise<PageHero>;
  deletePageHero(id: string): Promise<void>;

  // Image operations
  createImage(image: InsertImage): Promise<Image>;
  getImage(id: string): Promise<Image | null>;
  getImages(): Promise<Image[]>;
  deleteImage(id: string): Promise<void>;
  checkImageReferences(imageId: string): Promise<Array<{ table: string; count: number }>>;
  getGalleryImagesByGalleryId(galleryId: string): Promise<GalleryImageWithDetails[]>;
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
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const communitiesData = await query.orderBy(desc(communities.featured), asc(communities.name));
    
    // Fetch care types and amenities for all communities from junction tables
    const communityIds = communitiesData.map(c => c.id);
    if (communityIds.length > 0) {
      // Fetch care types
      const careTypesData = await db
        .select({
          communityId: communitiesCareTypes.communityId,
          careTypeSlug: careTypes.slug,
        })
        .from(communitiesCareTypes)
        .leftJoin(careTypes, eq(communitiesCareTypes.careTypeId, careTypes.id))
        .where(inArray(communitiesCareTypes.communityId, communityIds));
      
      // Group care types by community
      const careTypesByCommunity: Record<string, string[]> = {};
      for (const ct of careTypesData) {
        if (!careTypesByCommunity[ct.communityId]) {
          careTypesByCommunity[ct.communityId] = [];
        }
        if (ct.careTypeSlug) {
          careTypesByCommunity[ct.communityId].push(ct.careTypeSlug);
        }
      }
      
      // Fetch amenities with full data including imageUrl
      const amenitiesData = await db
        .select({
          communityId: communitiesAmenities.communityId,
          amenityName: amenities.name,
          amenityIcon: amenities.icon,
          amenityImageUrl: amenities.imageUrl,
          amenityDescription: amenities.description,
          amenityCategory: amenities.category,
          amenitySortOrder: amenities.sortOrder,
        })
        .from(communitiesAmenities)
        .leftJoin(amenities, eq(communitiesAmenities.amenityId, amenities.id))
        .where(
          and(
            inArray(communitiesAmenities.communityId, communityIds),
            eq(amenities.active, true)
          )
        )
        .orderBy(asc(amenities.sortOrder), asc(amenities.name));
      
      // Group amenities by community
      const amenitiesByCommunity: Record<string, any[]> = {};
      for (const am of amenitiesData) {
        if (!amenitiesByCommunity[am.communityId]) {
          amenitiesByCommunity[am.communityId] = [];
        }
        if (am.amenityName) {
          amenitiesByCommunity[am.communityId].push({
            name: am.amenityName,
            icon: am.amenityIcon,
            imageUrl: am.amenityImageUrl,
            description: am.amenityDescription,
            category: am.amenityCategory,
            sortOrder: am.amenitySortOrder,
          });
        }
      }
      
      // Update communities with data from junction tables
      for (const community of communitiesData) {
        const junctionCareTypes = careTypesByCommunity[community.id];
        if (junctionCareTypes && junctionCareTypes.length > 0) {
          community.careTypes = junctionCareTypes;
        }
        
        const junctionAmenities = amenitiesByCommunity[community.id];
        if (junctionAmenities && junctionAmenities.length > 0) {
          // Use full amenity objects from junction table
          (community as any).amenitiesData = junctionAmenities;
          // Keep simple string array for backward compatibility
          community.amenities = junctionAmenities.map((a: any) => a.name);
        }
        // Keep existing JSON data as fallback if no junction data exists
      }
    }
    
    // Filter by care types if specified
    if (filters?.careTypes && filters.careTypes.length > 0) {
      return communitiesData.filter(community => {
        return filters.careTypes!.some(ct => community.careTypes?.includes(ct));
      });
    }
    
    return communitiesData;
  }

  async getCommunity(slug: string): Promise<Community | undefined> {
    const [community] = await db
      .select()
      .from(communities)
      .where(eq(communities.slug, slug));
    
    if (community) {
      // Fetch care types from junction table
      const careTypesData = await db
        .select({
          careTypeSlug: careTypes.slug,
        })
        .from(communitiesCareTypes)
        .leftJoin(careTypes, eq(communitiesCareTypes.careTypeId, careTypes.id))
        .where(eq(communitiesCareTypes.communityId, community.id));
      
      if (careTypesData.length > 0) {
        community.careTypes = careTypesData
          .filter(ct => ct.careTypeSlug !== null)
          .map(ct => ct.careTypeSlug!);
      }
      
      // Fetch amenities with full data including imageUrl
      const amenitiesData = await db
        .select({
          amenityName: amenities.name,
          amenityIcon: amenities.icon,
          amenityImageUrl: amenities.imageUrl,
          amenityDescription: amenities.description,
          amenityCategory: amenities.category,
          amenitySortOrder: amenities.sortOrder,
        })
        .from(communitiesAmenities)
        .leftJoin(amenities, eq(communitiesAmenities.amenityId, amenities.id))
        .where(
          and(
            eq(communitiesAmenities.communityId, community.id),
            eq(amenities.active, true)
          )
        )
        .orderBy(asc(amenities.sortOrder), asc(amenities.name));
      
      if (amenitiesData.length > 0) {
        const fullAmenities = amenitiesData
          .filter(am => am.amenityName !== null)
          .map(am => ({
            name: am.amenityName!,
            icon: am.amenityIcon,
            imageUrl: am.amenityImageUrl,
            description: am.amenityDescription,
            category: am.amenityCategory,
            sortOrder: am.amenitySortOrder,
          }));
        
        // Use full amenity objects
        (community as any).amenitiesData = fullAmenities;
        // Keep simple string array for backward compatibility
        community.amenities = fullAmenities.map(a => a.name);
      }
    }
    
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

  // Blog Post operations
  async getBlogPosts(filters?: {
    published?: boolean;
    communityId?: string;
    tags?: string[];
    category?: string;
    author?: string;
  }): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);

    const conditions = [];
    if (filters?.published !== undefined) {
      conditions.push(eq(blogPosts.published, filters.published));
    }
    if (filters?.communityId) {
      conditions.push(eq(blogPosts.communityId, filters.communityId));
    }
    if (filters?.category) {
      conditions.push(eq(blogPosts.category, filters.category));
    }
    if (filters?.author) {
      conditions.push(eq(blogPosts.author, filters.author));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;

    // Filter by tags if specified
    if (filters?.tags && filters.tags.length > 0) {
      return results.filter(post =>
        filters.tags!.some(tag => post.tags?.includes(tag))
      );
    }

    return results;
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return created;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updated] = await db
      .update(blogPosts)
      .set(post)
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
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

  // Floor plan operations
  async getFloorPlans(filters?: {
    communityId?: string;
    active?: boolean;
  }): Promise<FloorPlan[]> {
    let query = db.select().from(floorPlans);
    
    const conditions = [];
    if (filters?.communityId) {
      conditions.push(eq(floorPlans.communityId, filters.communityId));
    }
    if (filters?.active !== undefined) {
      conditions.push(eq(floorPlans.active, filters.active));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(asc(floorPlans.sortOrder), asc(floorPlans.name));
  }

  async getFloorPlan(id: string): Promise<FloorPlan | undefined> {
    const [floorPlan] = await db
      .select()
      .from(floorPlans)
      .where(eq(floorPlans.id, id));
    return floorPlan;
  }

  async createFloorPlan(floorPlan: InsertFloorPlan): Promise<FloorPlan> {
    const [created] = await db
      .insert(floorPlans)
      .values(floorPlan)
      .returning();
    return created;
  }

  async updateFloorPlan(id: string, floorPlan: Partial<InsertFloorPlan>): Promise<FloorPlan> {
    const [updated] = await db
      .update(floorPlans)
      .set(floorPlan)
      .where(eq(floorPlans.id, id))
      .returning();
    return updated;
  }

  async deleteFloorPlan(id: string): Promise<void> {
    await db.delete(floorPlans).where(eq(floorPlans.id, id));
  }

  // Testimonial operations
  async getTestimonials(filters?: {
    communityId?: string;
    featured?: boolean;
    approved?: boolean;
  }): Promise<Testimonial[]> {
    let query = db.select().from(testimonials);
    
    const conditions = [];
    if (filters?.communityId) {
      conditions.push(eq(testimonials.communityId, filters.communityId));
    }
    if (filters?.featured !== undefined) {
      conditions.push(eq(testimonials.featured, filters.featured));
    }
    if (filters?.approved !== undefined) {
      conditions.push(eq(testimonials.approved, filters.approved));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(testimonials.featured), asc(testimonials.sortOrder), desc(testimonials.createdAt));
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id));
    return testimonial;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [created] = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return created;
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial> {
    const [updated] = await db
      .update(testimonials)
      .set(testimonial)
      .where(eq(testimonials.id, id))
      .returning();
    return updated;
  }

  async deleteTestimonial(id: string): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  // Gallery image operations
  async getFilteredGalleryImages(filters?: {
    communityId?: string;
    category?: string;
    featured?: boolean;
    active?: boolean;
  }): Promise<GalleryImageWithDetails[]> {
    const conditions = [];
    if (filters?.communityId) {
      conditions.push(eq(galleries.communityId, filters.communityId));
    }
    if (filters?.category) {
      conditions.push(eq(galleries.category, filters.category));
    }
    if (filters?.featured !== undefined) {
      conditions.push(eq(galleries.hero, filters.featured));
    }
    if (filters?.active !== undefined) {
      conditions.push(eq(galleries.active, filters.active));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return await db
      .select(galleryImageDetailsSelection)
      .from(galleryImages)
      .innerJoin(images, eq(galleryImages.imageId, images.id))
      .innerJoin(galleries, eq(galleryImages.galleryId, galleries.id))
      .where(whereClause)
      .orderBy(desc(galleries.hero), asc(galleryImages.sortOrder), desc(galleryImages.createdAt));
  }

  async getGalleryImage(id: string): Promise<GalleryImageWithDetails | undefined> {
    const [result] = await db
      .select(galleryImageDetailsSelection)
      .from(galleryImages)
      .innerJoin(images, eq(galleryImages.imageId, images.id))
      .innerJoin(galleries, eq(galleryImages.galleryId, galleries.id))
      .where(eq(galleryImages.id, id));
    return result;
  }

  async createGalleryImage(galleryImage: InsertGalleryImage): Promise<GalleryImage> {
    const [created] = await db
      .insert(galleryImages)
      .values(galleryImage)
      .returning();
    return created;
  }

  async updateGalleryImage(id: string, galleryImage: Partial<InsertGalleryImage>): Promise<GalleryImage> {
    const [updated] = await db
      .update(galleryImages)
      .set(galleryImage)
      .where(eq(galleryImages.id, id))
      .returning();
    return updated;
  }

  async deleteGalleryImage(id: string): Promise<void> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }

  // Care type operations
  async getCareTypes(filters?: {
    active?: boolean;
  }): Promise<CareType[]> {
    let query = db.select().from(careTypes);
    
    if (filters?.active !== undefined) {
      query = query.where(eq(careTypes.active, filters.active));
    }
    
    return await query.orderBy(asc(careTypes.sortOrder), asc(careTypes.name));
  }

  async getCareType(slug: string): Promise<CareType | undefined> {
    const [careType] = await db
      .select()
      .from(careTypes)
      .where(eq(careTypes.slug, slug));
    return careType;
  }

  async getCareTypeById(id: string): Promise<CareType | undefined> {
    const [careType] = await db
      .select()
      .from(careTypes)
      .where(eq(careTypes.id, id));
    return careType;
  }

  // User operations - referenced by javascript_auth_all_persistance integration
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserCount(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users);
    return result?.count || 0;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db
      .insert(users)
      .values(user)
      .returning();
    return created;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User> {
    const [updated] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Session store - referenced by javascript_auth_all_persistance integration
  sessionStore: session.Store;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true 
    });
  }

  // Page hero operations
  async getPageHeroes(filters?: {
    active?: boolean;
  }): Promise<PageHero[]> {
    let query = db.select().from(pageHeroes);
    
    if (filters?.active !== undefined) {
      query = query.where(eq(pageHeroes.active, filters.active));
    }
    
    return await query.orderBy(asc(pageHeroes.sortOrder), asc(pageHeroes.pagePath));
  }

  async getPageHero(pagePath: string): Promise<PageHero | undefined> {
    const [pageHero] = await db
      .select()
      .from(pageHeroes)
      .where(eq(pageHeroes.pagePath, pagePath));
    return pageHero;
  }

  async getPageHeroById(id: string): Promise<PageHero | undefined> {
    const [pageHero] = await db
      .select()
      .from(pageHeroes)
      .where(eq(pageHeroes.id, id));
    return pageHero;
  }

  async createPageHero(pageHero: InsertPageHero): Promise<PageHero> {
    const [created] = await db
      .insert(pageHeroes)
      .values(pageHero)
      .returning();
    return created;
  }

  async updatePageHero(id: string, pageHero: Partial<InsertPageHero>): Promise<PageHero> {
    const [updated] = await db
      .update(pageHeroes)
      .set(pageHero)
      .where(eq(pageHeroes.id, id))
      .returning();
    return updated;
  }

  async deletePageHero(id: string): Promise<void> {
    await db.delete(pageHeroes).where(eq(pageHeroes.id, id));
  }

  // Image operations
  async createImage(image: InsertImage): Promise<Image> {
    const [created] = await db
      .insert(images)
      .values(image)
      .returning();
    return created;
  }

  async getImage(id: string): Promise<Image | null> {
    const [image] = await db
      .select()
      .from(images)
      .where(eq(images.id, id));
    return image || null;
  }

  async getImages(): Promise<Image[]> {
    return await db
      .select()
      .from(images)
      .orderBy(desc(images.createdAt));
  }

  async checkImageReferences(imageId: string): Promise<Array<{ table: string; count: number }>> {
    const references: Array<{ table: string; count: number }> = [];

    // Check communities table
    const [communitiesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(communities)
      .where(eq(communities.imageId, imageId));
    if (communitiesCount.count > 0) {
      references.push({ table: "communities", count: communitiesCount.count });
    }

    // Check posts table
    const [postsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(eq(posts.imageId, imageId));
    if (postsCount.count > 0) {
      references.push({ table: "posts", count: postsCount.count });
    }

    // Check events table
    const [eventsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(events)
      .where(eq(events.imageId, imageId));
    if (eventsCount.count > 0) {
      references.push({ table: "events", count: eventsCount.count });
    }

    // Check floor_plans table
    const [floorPlansCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(floorPlans)
      .where(eq(floorPlans.imageId, imageId));
    if (floorPlansCount.count > 0) {
      references.push({ table: "floor_plans", count: floorPlansCount.count });
    }

    // Check page_heroes table
    const [pageHeroesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageHeroes)
      .where(eq(pageHeroes.imageId, imageId));
    if (pageHeroesCount.count > 0) {
      references.push({ table: "page_heroes", count: pageHeroesCount.count });
    }

    // Check gallery_images table
    const [galleryImagesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(galleryImages)
      .where(eq(galleryImages.imageId, imageId));
    if (galleryImagesCount.count > 0) {
      references.push({ table: "gallery_images", count: galleryImagesCount.count });
    }

    return references;
  }

  async deleteImage(id: string): Promise<void> {
    await db.delete(images).where(eq(images.id, id));
  }

  async getGalleryImagesByGalleryId(galleryId: string): Promise<GalleryImageWithDetails[]> {
    return await db
      .select(galleryImageDetailsSelection)
      .from(galleryImages)
      .innerJoin(images, eq(galleryImages.imageId, images.id))
      .innerJoin(galleries, eq(galleryImages.galleryId, galleries.id))
      .where(eq(galleryImages.galleryId, galleryId))
      .orderBy(asc(galleryImages.sortOrder));
  }
}

export const storage = new DatabaseStorage();
