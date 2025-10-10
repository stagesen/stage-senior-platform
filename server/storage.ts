import {
  communities,
  posts,
  postAttachments,
  blogPosts,
  events,
  faqs,
  galleries,
  tourRequests,
  floorPlans,
  testimonials,
  galleryImages,
  floorPlanImages,
  careTypes,
  communitiesCareTypes,
  amenities,
  communitiesAmenities,
  communityHighlights,
  communityFeatures,
  users,
  images,
  teamMembers,
  type Community,
  type InsertCommunity,
  type Post,
  type InsertPost,
  type PostAttachment,
  type InsertPostAttachment,
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
  type CommunityHighlight,
  type InsertCommunityHighlight,
  type CommunityFeature,
  type InsertCommunityFeature,
  type GalleryImage,
  type InsertGalleryImage,
  type GalleryImageWithDetails,
  type FloorPlanImage,
  type InsertFloorPlanImage,
  type FloorPlanImageWithDetails,
  type CareType,
  type InsertCareType,
  type Amenity,
  type User,
  type InsertUser,
  type Image,
  type InsertImage,
  type TeamMember,
  type InsertTeamMember,
  pageHeroes,
  type PageHero,
  type InsertPageHero,
  homepageSections,
  type HomepageSection,
  type InsertHomepageSection,
  homepageConfig,
  type HomepageConfig,
  type InsertHomepageConfig,
  emailRecipients,
  type EmailRecipient,
  type InsertEmailRecipient,
  pageContentSections,
  type PageContentSection,
  type InsertPageContentSection,
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

  // Post attachment operations
  createPostAttachment(attachment: InsertPostAttachment): Promise<PostAttachment>;
  updatePostAttachment(id: string, attachment: Partial<InsertPostAttachment>): Promise<PostAttachment>;
  getPostAttachment(id: string): Promise<PostAttachment | undefined>;
  getPostAttachments(postId: string): Promise<PostAttachment[]>;
  deletePostAttachment(id: string): Promise<void>;

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

  // Community highlights operations
  getAllCommunityHighlights(): Promise<CommunityHighlight[]>;
  getCommunityHighlights(communityId: string): Promise<CommunityHighlight[]>;
  getCommunityHighlight(id: string): Promise<CommunityHighlight | undefined>;
  createCommunityHighlight(highlight: InsertCommunityHighlight): Promise<CommunityHighlight>;
  updateCommunityHighlight(id: string, highlight: Partial<InsertCommunityHighlight>): Promise<CommunityHighlight>;
  deleteCommunityHighlight(id: string): Promise<void>;

  // Community features operations
  getAllCommunityFeatures(): Promise<CommunityFeature[]>;
  getCommunityFeatures(communityId: string): Promise<CommunityFeature[]>;
  getCommunityFeature(id: string): Promise<CommunityFeature | undefined>;
  createCommunityFeature(feature: InsertCommunityFeature): Promise<CommunityFeature>;
  updateCommunityFeature(id: string, feature: Partial<InsertCommunityFeature>): Promise<CommunityFeature>;
  deleteCommunityFeature(id: string): Promise<void>;

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
  createCareType(careType: InsertCareType): Promise<CareType>;
  updateCareType(id: string, careType: Partial<InsertCareType>): Promise<CareType>;
  deleteCareType(id: string): Promise<void>;

  // Amenity operations
  getAmenities(filters?: {
    active?: boolean;
  }): Promise<Amenity[]>;
  getAmenity(slug: string): Promise<Amenity | undefined>;
  getAmenityById(id: string): Promise<Amenity | undefined>;
  createAmenity(amenity: InsertAmenity): Promise<Amenity>;
  updateAmenity(id: string, amenity: Partial<InsertAmenity>): Promise<Amenity>;
  deleteAmenity(id: string): Promise<void>;

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
  unreferenceImage(imageId: string): Promise<void>;
  getGalleryImagesByGalleryId(galleryId: string): Promise<GalleryImageWithDetails[]>;

  // Floor plan image operations
  getFloorPlanImages(floorPlanId: string): Promise<FloorPlanImageWithDetails[]>;
  addFloorPlanImage(data: { floorPlanId: string; imageId: string; caption?: string; sortOrder?: number }): Promise<FloorPlanImage>;
  removeFloorPlanImage(floorPlanId: string, imageId: string): Promise<void>;
  updateFloorPlanImageOrder(floorPlanId: string, updates: Array<{ imageId: string; sortOrder: number }>): Promise<void>;

  // Community-Care Type relationship operations
  getCommunityCareTypes(communityId: string): Promise<string[]>;
  setCommunityCareTypes(communityId: string, careTypeIds: string[]): Promise<void>;
  getAllCommunitiesCareTypes(): Promise<Array<{ communityId: string; careTypeId: string }>>;

  // Community-Amenity relationship operations
  getCommunityAmenities(communityId: string): Promise<string[]>;
  setCommunityAmenities(communityId: string, amenityIds: string[]): Promise<void>;
  getAllCommunitiesAmenities(): Promise<Array<{ communityId: string; amenityId: string }>>;

  // Gallery image operations
  getAllGalleryImages(): Promise<GalleryImage[]>;

  // Team member operations
  getAllTeamMembers(includeInactive?: boolean): Promise<TeamMember[]>;
  getTeamMemberById(id: string): Promise<TeamMember | null>;
  getTeamMemberBySlug(slug: string): Promise<TeamMember | null>;
  getTeamMembersByCommunity(communityId: string): Promise<TeamMember[]>;
  createTeamMember(data: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, data: Partial<InsertTeamMember>): Promise<TeamMember | null>;
  deleteTeamMember(id: string): Promise<void>;

  // Homepage section operations  
  getHomepageSections(includeInvisible?: boolean): Promise<HomepageSection[]>;
  getHomepageSectionBySlug(slug: string): Promise<HomepageSection | null>;
  createHomepageSection(data: InsertHomepageSection): Promise<HomepageSection>;
  updateHomepageSection(id: string, data: Partial<InsertHomepageSection>): Promise<HomepageSection | null>;
  deleteHomepageSection(id: string): Promise<void>;

  // Homepage config operations
  getHomepageConfig(sectionKey: string): Promise<HomepageConfig | null>;
  updateHomepageConfig(sectionKey: string, data: Partial<InsertHomepageConfig>): Promise<HomepageConfig>;

  // Email recipient operations
  getEmailRecipients(activeOnly?: boolean): Promise<EmailRecipient[]>;
  getEmailRecipient(id: string): Promise<EmailRecipient | undefined>;
  createEmailRecipient(recipient: InsertEmailRecipient): Promise<EmailRecipient>;
  updateEmailRecipient(id: string, recipient: Partial<InsertEmailRecipient>): Promise<EmailRecipient>;
  deleteEmailRecipient(id: string): Promise<void>;

  // Page content section operations
  getPageContentSections(pagePath?: string, activeOnly?: boolean): Promise<PageContentSection[]>;
  getPageContentSection(id: string): Promise<PageContentSection | undefined>;
  createPageContentSection(section: InsertPageContentSection): Promise<PageContentSection>;
  updatePageContentSection(id: string, section: Partial<InsertPageContentSection>): Promise<PageContentSection>;
  deletePageContentSection(id: string): Promise<void>;
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
          careTypeId: communitiesCareTypes.careTypeId,
          careTypeSlug: careTypes.slug,
        })
        .from(communitiesCareTypes)
        .leftJoin(careTypes, eq(communitiesCareTypes.careTypeId, careTypes.id))
        .where(inArray(communitiesCareTypes.communityId, communityIds));
      
      // Group care types by community
      const careTypesByCommunity: Record<string, string[]> = {};
      const careTypeIdsByCommunity: Record<string, string[]> = {};
      for (const ct of careTypesData) {
        if (!careTypesByCommunity[ct.communityId]) {
          careTypesByCommunity[ct.communityId] = [];
          careTypeIdsByCommunity[ct.communityId] = [];
        }
        if (ct.careTypeSlug) {
          careTypesByCommunity[ct.communityId].push(ct.careTypeSlug);
        }
        if (ct.careTypeId) {
          careTypeIdsByCommunity[ct.communityId].push(ct.careTypeId);
        }
      }
      
      // Fetch amenities with full data including imageUrl
      const amenitiesData = await db
        .select({
          communityId: communitiesAmenities.communityId,
          amenityId: communitiesAmenities.amenityId,
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
      const amenityIdsByCommunity: Record<string, string[]> = {};
      for (const am of amenitiesData) {
        if (!amenitiesByCommunity[am.communityId]) {
          amenitiesByCommunity[am.communityId] = [];
          amenityIdsByCommunity[am.communityId] = [];
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
        if (am.amenityId) {
          amenityIdsByCommunity[am.communityId].push(am.amenityId);
        }
      }
      
      // Update communities with data from junction tables
      for (const community of communitiesData) {
        const junctionCareTypes = careTypesByCommunity[community.id];
        const junctionCareTypeIds = careTypeIdsByCommunity[community.id];
        if (junctionCareTypes && junctionCareTypes.length > 0) {
          community.careTypes = junctionCareTypes;
        }
        if (junctionCareTypeIds && junctionCareTypeIds.length > 0) {
          (community as any).careTypeIds = junctionCareTypeIds;
        }
        
        const junctionAmenities = amenitiesByCommunity[community.id];
        const junctionAmenityIds = amenityIdsByCommunity[community.id];
        if (junctionAmenities && junctionAmenities.length > 0) {
          // Use full amenity objects from junction table
          (community as any).amenitiesData = junctionAmenities;
          // Keep simple string array for backward compatibility
          community.amenities = junctionAmenities.map((a: any) => a.name);
        }
        if (junctionAmenityIds && junctionAmenityIds.length > 0) {
          (community as any).amenityIds = junctionAmenityIds;
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
      // For jsonb array tags, we need to check if any of the filter tags exist in the array
      const tagConditions = filters.tags.map(tag => 
        sql`${posts.tags}::jsonb @> ${JSON.stringify([tag])}::jsonb`
      );
      conditions.push(or(...tagConditions));
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

  // Post attachment operations
  async createPostAttachment(attachment: InsertPostAttachment): Promise<PostAttachment> {
    const [created] = await db
      .insert(postAttachments)
      .values(attachment)
      .returning();
    return created;
  }

  async getPostAttachment(id: string): Promise<PostAttachment | undefined> {
    const [attachment] = await db
      .select()
      .from(postAttachments)
      .where(eq(postAttachments.id, id));
    return attachment;
  }

  async getPostAttachments(postId: string): Promise<PostAttachment[]> {
    return await db
      .select()
      .from(postAttachments)
      .where(eq(postAttachments.postId, postId))
      .orderBy(asc(postAttachments.createdAt));
  }

  async updatePostAttachment(id: string, attachment: Partial<InsertPostAttachment>): Promise<PostAttachment> {
    const [updated] = await db
      .update(postAttachments)
      .set({
        ...attachment,
        updatedAt: new Date()
      })
      .where(eq(postAttachments.id, id))
      .returning();
    return updated;
  }

  async deletePostAttachment(id: string): Promise<void> {
    await db.delete(postAttachments).where(eq(postAttachments.id, id));
  }

  // Blog Post operations
  async getBlogPosts(filters?: {
    published?: boolean;
    communityId?: string;
    tags?: string[];
    category?: string;
    author?: string;
  }): Promise<BlogPost[]> {
    let query = db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        content: blogPosts.content,
        summary: blogPosts.summary,
        mainImage: blogPosts.mainImage,
        thumbnailImage: blogPosts.thumbnailImage,
        galleryImages: blogPosts.galleryImages,
        featured: blogPosts.featured,
        category: blogPosts.category,
        author: blogPosts.author,
        authorId: blogPosts.authorId,
        tags: blogPosts.tags,
        communityId: blogPosts.communityId,
        published: blogPosts.published,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorName: teamMembers.name,
        authorRole: teamMembers.role,
        authorDepartment: teamMembers.department,
        authorAvatarImageId: teamMembers.avatarImageId,
        authorSlug: teamMembers.slug,
        authorEmail: teamMembers.email,
      })
      .from(blogPosts)
      .leftJoin(teamMembers, eq(blogPosts.authorId, teamMembers.id));

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
    
    // Add tags filtering using PostgreSQL jsonb operators
    if (filters?.tags && filters.tags.length > 0) {
      // Check if any of the filter tags exist in the jsonb array
      const tagConditions = filters.tags.map(tag => 
        sql`${blogPosts.tags}::jsonb @> ${JSON.stringify([tag])}::jsonb`
      );
      conditions.push(or(...tagConditions));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;

    // Transform results to include author details
    const transformedResults = results.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      summary: post.summary,
      mainImage: post.mainImage,
      thumbnailImage: post.thumbnailImage,
      galleryImages: post.galleryImages,
      featured: post.featured,
      category: post.category,
      author: post.author, // Legacy field
      authorId: post.authorId,
      tags: post.tags,
      communityId: post.communityId,
      published: post.published,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      // Include author details if available
      ...(post.authorId && post.authorName ? {
        authorDetails: {
          id: post.authorId,
          name: post.authorName,
          slug: post.authorSlug,
          role: post.authorRole,
          department: post.authorDepartment,
          avatarImageId: post.authorAvatarImageId,
          email: post.authorEmail,
        }
      } : {})
    })) as BlogPost[];

    return transformedResults;
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const results = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        content: blogPosts.content,
        summary: blogPosts.summary,
        mainImage: blogPosts.mainImage,
        thumbnailImage: blogPosts.thumbnailImage,
        galleryImages: blogPosts.galleryImages,
        featured: blogPosts.featured,
        category: blogPosts.category,
        author: blogPosts.author,
        authorId: blogPosts.authorId,
        tags: blogPosts.tags,
        communityId: blogPosts.communityId,
        published: blogPosts.published,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorName: teamMembers.name,
        authorRole: teamMembers.role,
        authorDepartment: teamMembers.department,
        authorAvatarImageId: teamMembers.avatarImageId,
        authorSlug: teamMembers.slug,
        authorEmail: teamMembers.email,
      })
      .from(blogPosts)
      .leftJoin(teamMembers, eq(blogPosts.authorId, teamMembers.id))
      .where(eq(blogPosts.slug, slug));

    if (results.length === 0) return undefined;

    const post = results[0];
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      summary: post.summary,
      mainImage: post.mainImage,
      thumbnailImage: post.thumbnailImage,
      galleryImages: post.galleryImages,
      featured: post.featured,
      category: post.category,
      author: post.author, // Legacy field
      authorId: post.authorId,
      tags: post.tags,
      communityId: post.communityId,
      published: post.published,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      // Include author details if available
      ...(post.authorId && post.authorName ? {
        authorDetails: {
          id: post.authorId,
          name: post.authorName,
          slug: post.authorSlug,
          role: post.authorRole,
          department: post.authorDepartment,
          avatarImageId: post.authorAvatarImageId,
          email: post.authorEmail,
        }
      } : {})
    } as BlogPost;
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const results = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        content: blogPosts.content,
        summary: blogPosts.summary,
        mainImage: blogPosts.mainImage,
        thumbnailImage: blogPosts.thumbnailImage,
        galleryImages: blogPosts.galleryImages,
        featured: blogPosts.featured,
        category: blogPosts.category,
        author: blogPosts.author,
        authorId: blogPosts.authorId,
        tags: blogPosts.tags,
        communityId: blogPosts.communityId,
        published: blogPosts.published,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorName: teamMembers.name,
        authorRole: teamMembers.role,
        authorDepartment: teamMembers.department,
        authorAvatarImageId: teamMembers.avatarImageId,
        authorSlug: teamMembers.slug,
        authorEmail: teamMembers.email,
      })
      .from(blogPosts)
      .leftJoin(teamMembers, eq(blogPosts.authorId, teamMembers.id))
      .where(eq(blogPosts.id, id));

    if (results.length === 0) return undefined;

    const post = results[0];
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      summary: post.summary,
      mainImage: post.mainImage,
      thumbnailImage: post.thumbnailImage,
      galleryImages: post.galleryImages,
      featured: post.featured,
      category: post.category,
      author: post.author, // Legacy field
      authorId: post.authorId,
      tags: post.tags,
      communityId: post.communityId,
      published: post.published,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      // Include author details if available
      ...(post.authorId && post.authorName ? {
        authorDetails: {
          id: post.authorId,
          name: post.authorName,
          slug: post.authorSlug,
          role: post.authorRole,
          department: post.authorDepartment,
          avatarImageId: post.authorAvatarImageId,
          email: post.authorEmail,
        }
      } : {})
    } as BlogPost;
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

  // Community highlights operations
  async getAllCommunityHighlights(): Promise<CommunityHighlight[]> {
    const highlights = await db
      .select()
      .from(communityHighlights)
      .orderBy(asc(communityHighlights.sortOrder), desc(communityHighlights.createdAt));
    return highlights;
  }

  async getCommunityHighlights(communityId: string): Promise<CommunityHighlight[]> {
    const highlights = await db
      .select()
      .from(communityHighlights)
      .where(
        and(
          eq(communityHighlights.communityId, communityId),
          eq(communityHighlights.active, true)
        )
      )
      .orderBy(asc(communityHighlights.sortOrder));
    return highlights;
  }

  async getCommunityHighlight(id: string): Promise<CommunityHighlight | undefined> {
    const [highlight] = await db
      .select()
      .from(communityHighlights)
      .where(eq(communityHighlights.id, id));
    return highlight;
  }

  async createCommunityHighlight(highlight: InsertCommunityHighlight): Promise<CommunityHighlight> {
    const [created] = await db
      .insert(communityHighlights)
      .values(highlight)
      .returning();
    return created;
  }

  async updateCommunityHighlight(id: string, highlight: Partial<InsertCommunityHighlight>): Promise<CommunityHighlight> {
    const [updated] = await db
      .update(communityHighlights)
      .set({
        ...highlight,
        updatedAt: new Date()
      })
      .where(eq(communityHighlights.id, id))
      .returning();
    return updated;
  }

  async deleteCommunityHighlight(id: string): Promise<void> {
    await db.delete(communityHighlights).where(eq(communityHighlights.id, id));
  }

  // Community features operations
  async getAllCommunityFeatures(): Promise<CommunityFeature[]> {
    const features = await db
      .select()
      .from(communityFeatures)
      .orderBy(asc(communityFeatures.sortOrder));
    return features;
  }

  async getCommunityFeatures(communityId: string): Promise<CommunityFeature[]> {
    const features = await db
      .select()
      .from(communityFeatures)
      .where(
        and(
          eq(communityFeatures.communityId, communityId),
          eq(communityFeatures.active, true)
        )
      )
      .orderBy(asc(communityFeatures.sortOrder));
    return features;
  }

  async getCommunityFeature(id: string): Promise<CommunityFeature | undefined> {
    const [feature] = await db
      .select()
      .from(communityFeatures)
      .where(eq(communityFeatures.id, id));
    return feature;
  }

  async createCommunityFeature(feature: InsertCommunityFeature): Promise<CommunityFeature> {
    const [created] = await db
      .insert(communityFeatures)
      .values(feature)
      .returning();
    return created;
  }

  async updateCommunityFeature(id: string, feature: Partial<InsertCommunityFeature>): Promise<CommunityFeature> {
    const [updated] = await db
      .update(communityFeatures)
      .set({
        ...feature,
        updatedAt: new Date()
      })
      .where(eq(communityFeatures.id, id))
      .returning();
    return updated;
  }

  async deleteCommunityFeature(id: string): Promise<void> {
    await db.delete(communityFeatures).where(eq(communityFeatures.id, id));
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

  async createCareType(careType: InsertCareType): Promise<CareType> {
    const [created] = await db
      .insert(careTypes)
      .values(careType)
      .returning();
    return created;
  }

  async updateCareType(id: string, careType: Partial<InsertCareType>): Promise<CareType> {
    const [updated] = await db
      .update(careTypes)
      .set(careType)
      .where(eq(careTypes.id, id))
      .returning();
    return updated;
  }

  async deleteCareType(id: string): Promise<void> {
    await db.delete(careTypes).where(eq(careTypes.id, id));
  }

  // Amenity operations
  async getAmenities(filters?: {
    active?: boolean;
  }): Promise<Amenity[]> {
    let query = db.select().from(amenities);
    
    if (filters?.active !== undefined) {
      query = query.where(eq(amenities.active, filters.active));
    }
    
    return await query.orderBy(asc(amenities.sortOrder), asc(amenities.name));
  }

  async getAmenity(slug: string): Promise<Amenity | undefined> {
    const [amenity] = await db
      .select()
      .from(amenities)
      .where(eq(amenities.slug, slug));
    return amenity;
  }

  async getAmenityById(id: string): Promise<Amenity | undefined> {
    const [amenity] = await db
      .select()
      .from(amenities)
      .where(eq(amenities.id, id));
    return amenity;
  }

  async createAmenity(amenity: InsertAmenity): Promise<Amenity> {
    const [created] = await db
      .insert(amenities)
      .values(amenity)
      .returning();
    return created;
  }

  async updateAmenity(id: string, amenity: Partial<InsertAmenity>): Promise<Amenity> {
    const [updated] = await db
      .update(amenities)
      .set(amenity)
      .where(eq(amenities.id, id))
      .returning();
    return updated;
  }

  async deleteAmenity(id: string): Promise<void> {
    await db.delete(amenities).where(eq(amenities.id, id));
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

  async unreferenceImage(imageId: string): Promise<void> {
    // Set all image references to NULL across all tables
    // This allows the image to be deleted without foreign key constraint issues
    // Each field must be updated separately to avoid setting unrelated fields to NULL
    
    console.log(`[UNREFERENCE] Starting unreference for image: ${imageId}`);
    
    // Update communities table - each field separately
    console.log(`[UNREFERENCE] Updating communities.imageId`);
    await db.update(communities)
      .set({ imageId: null })
      .where(eq(communities.imageId, imageId));
    
    await db.update(communities)
      .set({ logoImageId: null })
      .where(eq(communities.logoImageId, imageId));
    
    await db.update(communities)
      .set({ contactImageId: null })
      .where(eq(communities.contactImageId, imageId));
    
    await db.update(communities)
      .set({ pricingImageId: null })
      .where(eq(communities.pricingImageId, imageId));
    
    await db.update(communities)
      .set({ brochureImageId: null })
      .where(eq(communities.brochureImageId, imageId));
    
    await db.update(communities)
      .set({ experienceImageId: null })
      .where(eq(communities.experienceImageId, imageId));
    
    await db.update(communities)
      .set({ calendarFile1Id: null })
      .where(eq(communities.calendarFile1Id, imageId));
    
    await db.update(communities)
      .set({ calendarFile2Id: null })
      .where(eq(communities.calendarFile2Id, imageId));
    
    await db.update(communities)
      .set({ fitnessImageId: null })
      .where(eq(communities.fitnessImageId, imageId));
    
    await db.update(communities)
      .set({ privateDiningImageId: null })
      .where(eq(communities.privateDiningImageId, imageId));
    
    await db.update(communities)
      .set({ experienceImage1Id: null })
      .where(eq(communities.experienceImage1Id, imageId));
    
    await db.update(communities)
      .set({ experienceImage2Id: null })
      .where(eq(communities.experienceImage2Id, imageId));
    
    await db.update(communities)
      .set({ experienceImage3Id: null })
      .where(eq(communities.experienceImage3Id, imageId));
    
    await db.update(communities)
      .set({ experienceImage4Id: null })
      .where(eq(communities.experienceImage4Id, imageId));
    
    // Update posts table
    await db.update(posts)
      .set({ imageId: null })
      .where(eq(posts.imageId, imageId));
    
    // Update events table
    await db.update(events)
      .set({ imageId: null })
      .where(eq(events.imageId, imageId));
    
    // Update floor_plans table
    await db.update(floorPlans)
      .set({ imageId: null })
      .where(eq(floorPlans.imageId, imageId));
    
    // Update page_heroes table
    await db.update(pageHeroes)
      .set({ imageId: null })
      .where(eq(pageHeroes.imageId, imageId));
    
    // Delete gallery_images records (they're just junction table entries)
    await db.delete(galleryImages)
      .where(eq(galleryImages.imageId, imageId));
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

  // Floor plan image operations
  async getFloorPlanImages(floorPlanId: string): Promise<FloorPlanImageWithDetails[]> {
    const results = await db
      .select({
        id: floorPlanImages.id,
        floorPlanId: floorPlanImages.floorPlanId,
        imageId: floorPlanImages.imageId,
        caption: floorPlanImages.caption,
        sortOrder: floorPlanImages.sortOrder,
        createdAt: floorPlanImages.createdAt,
        imageUrl: images.url,
        url: images.url,
        alt: images.alt,
        width: images.width,
        height: images.height,
        objectKey: images.objectKey,
        variants: images.variants,
        uploadedAt: images.createdAt,
      })
      .from(floorPlanImages)
      .innerJoin(images, eq(floorPlanImages.imageId, images.id))
      .where(eq(floorPlanImages.floorPlanId, floorPlanId))
      .orderBy(asc(floorPlanImages.sortOrder));
    
    return results;
  }

  async addFloorPlanImage(data: { 
    floorPlanId: string; 
    imageId: string; 
    caption?: string; 
    sortOrder?: number 
  }): Promise<FloorPlanImage> {
    const [created] = await db
      .insert(floorPlanImages)
      .values({
        floorPlanId: data.floorPlanId,
        imageId: data.imageId,
        caption: data.caption,
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();
    return created;
  }

  async removeFloorPlanImage(floorPlanId: string, imageId: string): Promise<void> {
    await db
      .delete(floorPlanImages)
      .where(
        and(
          eq(floorPlanImages.floorPlanId, floorPlanId),
          eq(floorPlanImages.imageId, imageId)
        )
      );
  }

  async updateFloorPlanImageOrder(
    floorPlanId: string, 
    updates: Array<{ imageId: string; sortOrder: number }>
  ): Promise<void> {
    // Update each image's sort order in a transaction
    await db.transaction(async (tx) => {
      for (const update of updates) {
        await tx
          .update(floorPlanImages)
          .set({ sortOrder: update.sortOrder })
          .where(
            and(
              eq(floorPlanImages.floorPlanId, floorPlanId),
              eq(floorPlanImages.imageId, update.imageId)
            )
          );
      }
    });
  }

  // Community-Care Type relationships
  async getCommunityCareTypes(communityId: string): Promise<string[]> {
    const results = await db
      .select({ careTypeId: communitiesCareTypes.careTypeId })
      .from(communitiesCareTypes)
      .where(eq(communitiesCareTypes.communityId, communityId));
    
    return results.map(r => r.careTypeId);
  }

  async setCommunityCareTypes(communityId: string, careTypeIds: string[]): Promise<void> {
    await db.transaction(async (tx) => {
      // Delete existing relationships
      await tx.delete(communitiesCareTypes)
        .where(eq(communitiesCareTypes.communityId, communityId));
      
      // Insert new relationships
      if (careTypeIds.length > 0) {
        const values = careTypeIds.map(careTypeId => ({
          communityId,
          careTypeId,
        }));
        
        await tx.insert(communitiesCareTypes).values(values);
      }
    });
  }

  async getAllCommunitiesCareTypes(): Promise<Array<{ communityId: string; careTypeId: string }>> {
    const results = await db
      .select({
        communityId: communitiesCareTypes.communityId,
        careTypeId: communitiesCareTypes.careTypeId
      })
      .from(communitiesCareTypes);
    
    return results;
  }

  // Community-Amenity relationships
  async getCommunityAmenities(communityId: string): Promise<string[]> {
    const results = await db
      .select({ amenityId: communitiesAmenities.amenityId })
      .from(communitiesAmenities)
      .where(eq(communitiesAmenities.communityId, communityId));
    
    return results.map(r => r.amenityId);
  }

  async setCommunityAmenities(communityId: string, amenityIds: string[]): Promise<void> {
    await db.transaction(async (tx) => {
      // Delete existing relationships
      await tx.delete(communitiesAmenities)
        .where(eq(communitiesAmenities.communityId, communityId));
      
      // Insert new relationships
      if (amenityIds.length > 0) {
        const values = amenityIds.map(amenityId => ({
          communityId,
          amenityId,
        }));
        
        await tx.insert(communitiesAmenities).values(values);
      }
    });
  }

  async getAllCommunitiesAmenities(): Promise<Array<{ communityId: string; amenityId: string }>> {
    const results = await db
      .select({
        communityId: communitiesAmenities.communityId,
        amenityId: communitiesAmenities.amenityId
      })
      .from(communitiesAmenities);
    
    return results;
  }

  async getAllGalleryImages(): Promise<GalleryImage[]> {
    const results = await db
      .select()
      .from(galleryImages)
      .orderBy(asc(galleryImages.sortOrder));
    
    return results;
  }

  // Team member operations
  async getAllTeamMembers(includeInactive?: boolean): Promise<TeamMember[]> {
    let query = db.select().from(teamMembers);
    
    if (!includeInactive) {
      query = query.where(eq(teamMembers.active, true));
    }
    
    const members = await query.orderBy(
      asc(teamMembers.sortOrder),
      asc(teamMembers.name)
    );
    
    // Ensure tags field is always an array
    return members.map(member => ({
      ...member,
      tags: member.tags || []
    }));
  }

  async getTeamMemberById(id: string): Promise<TeamMember | null> {
    const [member] = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.id, id));
    
    if (!member) {
      return null;
    }
    
    // Ensure tags is always an array
    return {
      ...member,
      tags: member.tags || []
    };
  }

  async getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
    const [member] = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.slug, slug));
    
    if (!member) {
      return null;
    }
    
    // Ensure tags is always an array
    return {
      ...member,
      tags: member.tags || []
    };
  }

  async getTeamMembersByCommunity(communityId: string): Promise<TeamMember[]> {
    // First get the community name to match against tags
    const community = await this.getCommunityById(communityId);
    if (!community) {
      return [];
    }
    
    // Find team members that have a tag matching the community name
    // Check for exact match or match with "The " prefix
    const members = await db
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.active, true),
          or(
            sql`${teamMembers.tags}::jsonb ? ${community.name}`,
            sql`${teamMembers.tags}::jsonb ? ${'The ' + community.name}`,
            sql`EXISTS (SELECT 1 FROM jsonb_array_elements_text(${teamMembers.tags}::jsonb) AS tag WHERE lower(tag) = lower(${community.name}))`
          )
        )
      )
      .orderBy(
        asc(teamMembers.sortOrder),
        asc(teamMembers.name)
      );
    
    // Ensure tags field is always an array
    return members.map(member => ({
      ...member,
      tags: member.tags || []
    }));
  }

  async createTeamMember(data: InsertTeamMember): Promise<TeamMember> {
    // Generate slug from name if not provided
    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Ensure tags is an array or default to empty array
    const memberData = {
      ...data,
      tags: data.tags || []
    };
    
    const [created] = await db
      .insert(teamMembers)
      .values(memberData)
      .returning();
    
    // Ensure tags is always returned as an array
    return {
      ...created,
      tags: created.tags || []
    };
  }

  async updateTeamMember(id: string, data: Partial<InsertTeamMember>): Promise<TeamMember | null> {
    // Update slug if name is changed and slug is not explicitly provided
    if (data.name && !data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Ensure tags is handled properly if provided
    const updateData: any = {
      ...data,
      updatedAt: new Date()
    };
    if (data.tags !== undefined) {
      updateData.tags = data.tags || [];
    }
    
    const [updated] = await db
      .update(teamMembers)
      .set(updateData)
      .where(eq(teamMembers.id, id))
      .returning();
    
    if (!updated) {
      return null;
    }
    
    // Ensure tags is always returned as an array
    return {
      ...updated,
      tags: updated.tags || []
    };
  }

  async deleteTeamMember(id: string): Promise<void> {
    // First, set all blog posts with this author to null
    await db
      .update(blogPosts)
      .set({ authorId: null })
      .where(eq(blogPosts.authorId, id));
    
    // Then delete the team member
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  // Homepage section operations
  async getHomepageSections(includeInvisible = false): Promise<HomepageSection[]> {
    let query = db.select().from(homepageSections);
    
    if (!includeInvisible) {
      query = query.where(eq(homepageSections.visible, true));
    }
    
    const sections = await query.orderBy(asc(homepageSections.sortOrder));
    return sections;
  }

  async getHomepageSectionBySlug(slug: string): Promise<HomepageSection | null> {
    const [section] = await db
      .select()
      .from(homepageSections)
      .where(eq(homepageSections.slug, slug));
    
    return section || null;
  }

  async createHomepageSection(data: InsertHomepageSection): Promise<HomepageSection> {
    const [created] = await db
      .insert(homepageSections)
      .values(data)
      .returning();
    
    return created;
  }

  async updateHomepageSection(id: string, data: Partial<InsertHomepageSection>): Promise<HomepageSection | null> {
    const [updated] = await db
      .update(homepageSections)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(homepageSections.id, id))
      .returning();
    
    return updated || null;
  }

  async deleteHomepageSection(id: string): Promise<void> {
    await db.delete(homepageSections).where(eq(homepageSections.id, id));
  }

  // Homepage config operations
  async getHomepageConfig(sectionKey: string): Promise<HomepageConfig | null> {
    const [config] = await db
      .select()
      .from(homepageConfig)
      .where(eq(homepageConfig.sectionKey, sectionKey));
    
    return config || null;
  }

  async updateHomepageConfig(sectionKey: string, data: Partial<InsertHomepageConfig>): Promise<HomepageConfig> {
    // Try to update first
    const existing = await this.getHomepageConfig(sectionKey);
    
    if (existing) {
      const [updated] = await db
        .update(homepageConfig)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(homepageConfig.sectionKey, sectionKey))
        .returning();
      
      return updated;
    } else {
      // Create if doesn't exist
      const [created] = await db
        .insert(homepageConfig)
        .values({
          ...data,
          sectionKey: sectionKey
        })
        .returning();
      
      return created;
    }
  }

  // Email recipient operations
  async getEmailRecipients(activeOnly?: boolean): Promise<EmailRecipient[]> {
    let query = db.select().from(emailRecipients);
    
    if (activeOnly) {
      query = query.where(eq(emailRecipients.active, true)) as any;
    }
    
    const recipients = await query.orderBy(asc(emailRecipients.email));
    return recipients;
  }

  async getEmailRecipient(id: string): Promise<EmailRecipient | undefined> {
    const [recipient] = await db
      .select()
      .from(emailRecipients)
      .where(eq(emailRecipients.id, id));
    
    return recipient;
  }

  async createEmailRecipient(recipient: InsertEmailRecipient): Promise<EmailRecipient> {
    const [created] = await db
      .insert(emailRecipients)
      .values(recipient)
      .returning();
    
    return created;
  }

  async updateEmailRecipient(id: string, recipient: Partial<InsertEmailRecipient>): Promise<EmailRecipient> {
    const [updated] = await db
      .update(emailRecipients)
      .set({
        ...recipient,
        updatedAt: new Date()
      })
      .where(eq(emailRecipients.id, id))
      .returning();
    
    return updated;
  }

  async deleteEmailRecipient(id: string): Promise<void> {
    await db.delete(emailRecipients).where(eq(emailRecipients.id, id));
  }

  // Page content section operations
  async getPageContentSections(pagePath?: string, activeOnly?: boolean): Promise<PageContentSection[]> {
    let query = db.select().from(pageContentSections);
    
    const conditions = [];
    if (pagePath) {
      conditions.push(eq(pageContentSections.pagePath, pagePath));
    }
    if (activeOnly) {
      conditions.push(eq(pageContentSections.active, true));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    const sections = await query.orderBy(asc(pageContentSections.sortOrder));
    return sections;
  }

  async getPageContentSection(id: string): Promise<PageContentSection | undefined> {
    const [section] = await db
      .select()
      .from(pageContentSections)
      .where(eq(pageContentSections.id, id));
    
    return section;
  }

  async createPageContentSection(section: InsertPageContentSection): Promise<PageContentSection> {
    const [created] = await db
      .insert(pageContentSections)
      .values(section)
      .returning();
    
    return created;
  }

  async updatePageContentSection(id: string, section: Partial<InsertPageContentSection>): Promise<PageContentSection> {
    const [updated] = await db
      .update(pageContentSections)
      .set({
        ...section,
        updatedAt: new Date()
      })
      .where(eq(pageContentSections.id, id))
      .returning();
    
    return updated;
  }

  async deletePageContentSection(id: string): Promise<void> {
    await db.delete(pageContentSections).where(eq(pageContentSections.id, id));
  }
}

export const storage = new DatabaseStorage();
