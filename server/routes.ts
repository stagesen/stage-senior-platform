import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import {
  uploadSingle,
  uploadMultiple,
  uploadDocument,
  uploadMixed,
  processSingleImageUpload,
  processMultipleImageUploads,
  processDocumentUpload,
  processMixedFileUpload,
  deleteFromObjectStorage,
  handleUploadError,
} from "./upload";
import {
  insertCommunitySchema,
  insertPostSchema,
  insertBlogPostSchema,
  insertEventSchema,
  insertFaqSchema,
  insertGallerySchema,
  insertTourRequestSchema,
  insertEmailRecipientSchema,
  insertFloorPlanSchema,
  insertTestimonialSchema,
  insertCommunityHighlightSchema,
  insertCommunityFeatureSchema,
  insertGalleryImageSchema,
  insertCareTypeSchema,
  insertAmenitySchema,
  insertPageHeroSchema,
  insertTeamMemberSchema,
  insertHomepageSectionSchema,
  insertHomepageConfigSchema,
} from "@shared/schema";

// Middleware to protect admin routes - referenced by javascript_auth_all_persistance integration
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication - referenced by javascript_auth_all_persistance integration
  setupAuth(app);
  
  // Community routes
  app.get("/api/communities", async (req, res) => {
    try {
      const { careTypes, city, active } = req.query;
      const filters: any = {};
      
      if (careTypes) {
        filters.careTypes = Array.isArray(careTypes) ? careTypes : [careTypes];
      }
      if (city) {
        filters.city = city as string;
      }
      if (active !== undefined) {
        filters.active = active === 'true';
      }
      
      const communities = await storage.getCommunities(filters);
      res.json(communities);
    } catch (error) {
      console.error("Error fetching communities:", error);
      res.status(500).json({ message: "Failed to fetch communities" });
    }
  });

  app.get("/api/communities/:slug", async (req, res) => {
    try {
      const community = await storage.getCommunity(req.params.slug);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      
      // Include care type and amenity IDs from junction tables
      const careTypeIds = await storage.getCommunityCareTypes(community.id);
      const amenityIds = await storage.getCommunityAmenities(community.id);
      
      res.json({
        ...community,
        careTypeIds,
        amenityIds,
      });
    } catch (error) {
      console.error("Error fetching community:", error);
      res.status(500).json({ message: "Failed to fetch community" });
    }
  });

  app.post("/api/communities", requireAuth, async (req, res) => {
    try {
      const { careTypeIds, amenityIds, ...communityData } = req.body;
      const validatedData = insertCommunitySchema.parse(communityData);
      const community = await storage.createCommunity(validatedData);
      
      // Set care types and amenities if provided
      if (careTypeIds && Array.isArray(careTypeIds)) {
        await storage.setCommunityCareTypes(community.id, careTypeIds);
      }
      if (amenityIds && Array.isArray(amenityIds)) {
        await storage.setCommunityAmenities(community.id, amenityIds);
      }
      
      // Return the community with its relationships
      res.status(201).json({
        ...community,
        careTypeIds: careTypeIds || [],
        amenityIds: amenityIds || [],
      });
    } catch (error) {
      console.error("Error creating community:", error);
      res.status(400).json({ message: "Failed to create community" });
    }
  });

  app.put("/api/communities/:id", requireAuth, async (req, res) => {
    try {
      const { careTypeIds, amenityIds, ...communityData } = req.body;
      const validatedData = insertCommunitySchema.partial().parse(communityData);
      const community = await storage.updateCommunity(req.params.id, validatedData);
      
      // Update care types and amenities if provided
      if (careTypeIds !== undefined && Array.isArray(careTypeIds)) {
        await storage.setCommunityCareTypes(req.params.id, careTypeIds);
      }
      if (amenityIds !== undefined && Array.isArray(amenityIds)) {
        await storage.setCommunityAmenities(req.params.id, amenityIds);
      }
      
      // Fetch the updated relationships
      const updatedCareTypeIds = await storage.getCommunityCareTypes(req.params.id);
      const updatedAmenityIds = await storage.getCommunityAmenities(req.params.id);
      
      // Return the community with its relationships
      res.json({
        ...community,
        careTypeIds: updatedCareTypeIds,
        amenityIds: updatedAmenityIds,
      });
    } catch (error) {
      console.error("Error updating community:", error);
      res.status(400).json({ message: "Failed to update community" });
    }
  });

  app.delete("/api/communities/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteCommunity(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting community:", error);
      res.status(500).json({ message: "Failed to delete community" });
    }
  });

  // Post routes
  app.get("/api/posts", async (req, res) => {
    try {
      const { published, communityId, tags } = req.query;
      const filters: any = {};
      
      if (published !== undefined) {
        filters.published = published === 'true';
      }
      if (communityId) {
        filters.communityId = communityId as string;
      }
      if (tags) {
        filters.tags = Array.isArray(tags) ? tags : [tags];
      }
      
      const posts = await storage.getPosts(filters);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/posts/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPostSchema.partial().parse(req.body);
      const post = await storage.updatePost(req.params.id, validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(400).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", requireAuth, async (req, res) => {
    try {
      await storage.deletePost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Post Attachment routes
  app.post("/api/post-attachments/upload", requireAuth, uploadDocument, async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
      }

      const user = req.user as any;
      const attachment = await processDocumentUpload(req.file, user?.id);
      
      res.status(201).json({
        id: attachment.attachmentId,
        filename: attachment.filename,
        originalName: attachment.originalName,
        url: attachment.url,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  app.get("/api/post-attachments/:id", requireAuth, async (req, res) => {
    try {
      const attachment = await storage.getPostAttachment(req.params.id);
      if (!attachment) {
        return res.status(404).json({ message: "Attachment not found" });
      }
      res.json(attachment);
    } catch (error) {
      console.error("Error fetching attachment:", error);
      res.status(500).json({ message: "Failed to fetch attachment" });
    }
  });

  app.get("/api/post-attachments", requireAuth, async (req, res) => {
    try {
      const { postId } = req.query;
      if (!postId) {
        return res.status(400).json({ message: "postId is required" });
      }
      const attachments = await storage.getPostAttachments(postId as string);
      res.json(attachments);
    } catch (error) {
      console.error("Error fetching attachments:", error);
      res.status(500).json({ message: "Failed to fetch attachments" });
    }
  });

  app.delete("/api/post-attachments/:id", requireAuth, async (req, res) => {
    try {
      const attachment = await storage.getPostAttachment(req.params.id);
      if (!attachment) {
        return res.status(404).json({ message: "Attachment not found" });
      }
      
      // Delete from object storage
      if (attachment.objectKey) {
        await deleteFromObjectStorage(attachment.objectKey);
      }
      
      // Delete from database
      await storage.deletePostAttachment(req.params.id);
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting attachment:", error);
      res.status(500).json({ message: "Failed to delete attachment" });
    }
  });

  // Newsletter routes
  app.get("/api/posts/latest-newsletter/:communityId", async (req, res) => {
    try {
      const { communityId } = req.params;
      
      // First get the community to get its name
      const community = await storage.getCommunityById(communityId);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      
      // Find the latest blog post with "Newsletter" tag and matching community
      const posts = await storage.getBlogPosts({
        published: true,
        communityId: communityId,
        tags: ["Newsletter"],
      });
      
      // Get the most recent newsletter post
      const latestPost = posts
        .sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
          return dateB - dateA;
        })[0];
      
      if (!latestPost) {
        return res.status(404).json({ message: "No newsletter found for this community" });
      }
      
      // Get attachments if the post has any
      let attachments = [];
      if (latestPost.attachmentId) {
        const attachment = await storage.getPostAttachment(latestPost.attachmentId);
        if (attachment) {
          attachments = [attachment];
        }
      }
      
      res.json({
        ...latestPost,
        attachments,
        community,
      });
    } catch (error) {
      console.error("Error fetching latest newsletter:", error);
      res.status(500).json({ message: "Failed to fetch latest newsletter" });
    }
  });

  // Blog Post routes
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const { published, communityId, tags, category, author } = req.query;
      const filters: any = {};

      if (published !== undefined) {
        filters.published = published === 'true';
      }
      if (communityId) {
        filters.communityId = communityId as string;
      }
      if (category) {
        filters.category = category as string;
      }
      if (author) {
        filters.author = author as string;
      }
      if (tags && typeof tags === 'string') {
        filters.tags = tags.split(',');
      }

      const posts = await storage.getBlogPosts(filters);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog-posts", requireAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      
      // If there's an attachmentId, link it to the post
      if (req.body.attachmentId) {
        await storage.updatePostAttachment(req.body.attachmentId, { postId: post.id });
      }
      
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/blog-posts/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validatedData);
      
      // Handle attachment update
      if (req.body.attachmentId !== undefined) {
        // First, remove any existing attachment for this post
        const existingAttachments = await storage.getPostAttachments(req.params.id);
        for (const attachment of existingAttachments) {
          if (attachment.id !== req.body.attachmentId) {
            // Delete the old attachment from storage
            if (attachment.objectKey) {
              await deleteFromObjectStorage(attachment.objectKey);
            }
            await storage.deletePostAttachment(attachment.id);
          }
        }
        
        // Link the new attachment if provided
        if (req.body.attachmentId) {
          await storage.updatePostAttachment(req.body.attachmentId, { postId: req.params.id });
        }
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(400).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog-posts/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const { communityId, upcoming, public: isPublic } = req.query;
      const filters: any = {};
      
      if (communityId) {
        filters.communityId = communityId as string;
      }
      if (upcoming !== undefined) {
        filters.upcoming = upcoming === 'true';
      }
      if (isPublic !== undefined) {
        filters.public = isPublic === 'true';
      }
      
      const events = await storage.getEvents(filters);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:slug", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.slug);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", requireAuth, async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({ message: "Failed to create event" });
    }
  });

  app.put("/api/events/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, validatedData);
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(400).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // FAQ routes
  app.get("/api/faqs", async (req, res) => {
    try {
      const { communityId, category, active } = req.query;
      const filters: any = {};
      
      if (communityId) {
        filters.communityId = communityId as string;
      }
      if (category) {
        filters.category = category as string;
      }
      if (active !== undefined) {
        filters.active = active === 'true';
      }
      
      const faqs = await storage.getFaqs(filters);
      res.json(faqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  app.post("/api/faqs", requireAuth, async (req, res) => {
    try {
      const validatedData = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq(validatedData);
      res.status(201).json(faq);
    } catch (error) {
      console.error("Error creating FAQ:", error);
      res.status(400).json({ message: "Failed to create FAQ" });
    }
  });

  app.put("/api/faqs/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertFaqSchema.partial().parse(req.body);
      const faq = await storage.updateFaq(req.params.id, validatedData);
      res.json(faq);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      res.status(400).json({ message: "Failed to update FAQ" });
    }
  });

  app.delete("/api/faqs/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteFaq(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      res.status(500).json({ message: "Failed to delete FAQ" });
    }
  });

  // Gallery routes
  app.get("/api/galleries", async (req, res) => {
    try {
      const { communityId, category, active } = req.query;
      const filters: any = {};
      
      if (communityId) {
        filters.communityId = communityId as string;
      }
      if (category) {
        filters.category = category as string;
      }
      if (active !== undefined) {
        filters.active = active === 'true';
      }
      
      const galleries = await storage.getGalleries(filters);
      res.json(galleries);
    } catch (error) {
      console.error("Error fetching galleries:", error);
      res.status(500).json({ message: "Failed to fetch galleries" });
    }
  });

  app.post("/api/galleries", requireAuth, async (req, res) => {
    try {
      const validatedData = insertGallerySchema.parse(req.body);
      const gallery = await storage.createGallery(validatedData);
      res.status(201).json(gallery);
    } catch (error) {
      console.error("Error creating gallery:", error);
      res.status(400).json({ message: "Failed to create gallery" });
    }
  });

  app.put("/api/galleries/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertGallerySchema.partial().parse(req.body);
      const gallery = await storage.updateGallery(req.params.id, validatedData);
      res.json(gallery);
    } catch (error) {
      console.error("Error updating gallery:", error);
      res.status(400).json({ message: "Failed to update gallery" });
    }
  });

  app.delete("/api/galleries/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteGallery(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting gallery:", error);
      res.status(500).json({ message: "Failed to delete gallery" });
    }
  });

  // Get gallery images by gallery ID
  app.get("/api/galleries/:galleryId/images", async (req, res) => {
    try {
      const images = await storage.getGalleryImagesByGalleryId(req.params.galleryId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  // Delete a specific image from a gallery
  app.delete("/api/galleries/:galleryId/images/:imageId", requireAuth, async (req, res) => {
    try {
      await storage.deleteGalleryImage(req.params.imageId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({ message: "Failed to delete gallery image" });
    }
  });

  // Tour request routes - Protected because they contain PII
  app.get("/api/tour-requests", requireAuth, async (req, res) => {
    try {
      const { communityId, status } = req.query;
      const filters: any = {};
      
      if (communityId) {
        filters.communityId = communityId as string;
      }
      if (status) {
        filters.status = status as string;
      }
      
      const tourRequests = await storage.getTourRequests(filters);
      res.json(tourRequests);
    } catch (error) {
      console.error("Error fetching tour requests:", error);
      res.status(500).json({ message: "Failed to fetch tour requests" });
    }
  });

  app.post("/api/tour-requests", async (req, res) => {
    try {
      const validatedData = insertTourRequestSchema.parse(req.body);
      const tourRequest = await storage.createTourRequest(validatedData);
      res.status(201).json(tourRequest);
    } catch (error) {
      console.error("Error creating tour request:", error);
      res.status(400).json({ message: "Failed to create tour request" });
    }
  });

  app.put("/api/tour-requests/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTourRequestSchema.partial().parse(req.body);
      const tourRequest = await storage.updateTourRequest(req.params.id, validatedData);
      res.json(tourRequest);
    } catch (error) {
      console.error("Error updating tour request:", error);
      res.status(400).json({ message: "Failed to update tour request" });
    }
  });

  app.delete("/api/tour-requests/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteTourRequest(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting tour request:", error);
      res.status(500).json({ message: "Failed to delete tour request" });
    }
  });

  // Email recipient routes - Admin only
  app.get("/api/email-recipients", requireAuth, async (req, res) => {
    try {
      const { activeOnly } = req.query;
      const recipients = await storage.getEmailRecipients(activeOnly === 'true');
      res.json(recipients);
    } catch (error) {
      console.error("Error fetching email recipients:", error);
      res.status(500).json({ message: "Failed to fetch email recipients" });
    }
  });

  app.get("/api/email-recipients/:id", requireAuth, async (req, res) => {
    try {
      const recipient = await storage.getEmailRecipient(req.params.id);
      if (!recipient) {
        return res.status(404).json({ message: "Email recipient not found" });
      }
      res.json(recipient);
    } catch (error) {
      console.error("Error fetching email recipient:", error);
      res.status(500).json({ message: "Failed to fetch email recipient" });
    }
  });

  app.post("/api/email-recipients", requireAuth, async (req, res) => {
    try {
      const validatedData = insertEmailRecipientSchema.parse(req.body);
      const recipient = await storage.createEmailRecipient(validatedData);
      res.status(201).json(recipient);
    } catch (error) {
      console.error("Error creating email recipient:", error);
      res.status(400).json({ message: "Failed to create email recipient" });
    }
  });

  app.put("/api/email-recipients/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertEmailRecipientSchema.partial().parse(req.body);
      const recipient = await storage.updateEmailRecipient(req.params.id, validatedData);
      res.json(recipient);
    } catch (error) {
      console.error("Error updating email recipient:", error);
      res.status(400).json({ message: "Failed to update email recipient" });
    }
  });

  app.delete("/api/email-recipients/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteEmailRecipient(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting email recipient:", error);
      res.status(500).json({ message: "Failed to delete email recipient" });
    }
  });

  // Floor plan routes
  app.get("/api/floor-plans", async (req, res) => {
    try {
      const { communityId, active } = req.query;
      const filters: any = {};
      
      if (communityId) {
        filters.communityId = communityId as string;
      }
      if (active !== undefined) {
        filters.active = active === 'true';
      }
      
      const floorPlans = await storage.getFloorPlans(filters);
      res.json(floorPlans);
    } catch (error) {
      console.error("Error fetching floor plans:", error);
      res.status(500).json({ message: "Failed to fetch floor plans" });
    }
  });

  app.get("/api/floor-plans/:id", async (req, res) => {
    try {
      const floorPlan = await storage.getFloorPlan(req.params.id);
      if (!floorPlan) {
        return res.status(404).json({ message: "Floor plan not found" });
      }
      res.json(floorPlan);
    } catch (error) {
      console.error("Error fetching floor plan:", error);
      res.status(500).json({ message: "Failed to fetch floor plan" });
    }
  });

  app.post("/api/floor-plans", requireAuth, async (req, res) => {
    try {
      const validatedData = insertFloorPlanSchema.parse(req.body);
      const floorPlan = await storage.createFloorPlan(validatedData);
      res.status(201).json(floorPlan);
    } catch (error) {
      console.error("Error creating floor plan:", error);
      res.status(400).json({ message: "Failed to create floor plan" });
    }
  });

  app.put("/api/floor-plans/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertFloorPlanSchema.partial().parse(req.body);
      const floorPlan = await storage.updateFloorPlan(req.params.id, validatedData);
      res.json(floorPlan);
    } catch (error) {
      console.error("Error updating floor plan:", error);
      res.status(400).json({ message: "Failed to update floor plan" });
    }
  });

  app.delete("/api/floor-plans/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteFloorPlan(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting floor plan:", error);
      res.status(500).json({ message: "Failed to delete floor plan" });
    }
  });

  // Floor plan image routes
  app.get("/api/floor-plans/:floorPlanId/images", async (req, res) => {
    try {
      const images = await storage.getFloorPlanImages(req.params.floorPlanId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching floor plan images:", error);
      res.status(500).json({ message: "Failed to fetch floor plan images" });
    }
  });

  app.post("/api/floor-plans/:floorPlanId/images", requireAuth, async (req, res) => {
    try {
      const { imageId, caption, sortOrder } = req.body;
      if (!imageId) {
        return res.status(400).json({ message: "Image ID is required" });
      }
      
      const image = await storage.addFloorPlanImage({
        floorPlanId: req.params.floorPlanId,
        imageId,
        caption,
        sortOrder,
      });
      res.status(201).json(image);
    } catch (error) {
      console.error("Error adding floor plan image:", error);
      res.status(400).json({ message: "Failed to add floor plan image" });
    }
  });

  app.delete("/api/floor-plans/:floorPlanId/images/:imageId", requireAuth, async (req, res) => {
    try {
      await storage.removeFloorPlanImage(req.params.floorPlanId, req.params.imageId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing floor plan image:", error);
      res.status(500).json({ message: "Failed to remove floor plan image" });
    }
  });

  app.put("/api/floor-plans/:floorPlanId/images/order", requireAuth, async (req, res) => {
    try {
      const { updates } = req.body;
      if (!Array.isArray(updates)) {
        return res.status(400).json({ message: "Updates array is required" });
      }
      
      await storage.updateFloorPlanImageOrder(req.params.floorPlanId, updates);
      res.json({ message: "Sort order updated successfully" });
    } catch (error) {
      console.error("Error updating floor plan image order:", error);
      res.status(400).json({ message: "Failed to update image order" });
    }
  });

  // Testimonial routes - Public read for approved, protected for management
  app.get("/api/testimonials", async (req, res) => {
    try {
      const { communityId, featured, approved } = req.query;
      const filters: any = {};
      
      // If not authenticated, only show approved testimonials
      if (!req.user) {
        filters.approved = true;
      } else {
        // Authenticated users can filter by approved status
        if (approved !== undefined) {
          filters.approved = approved === 'true';
        }
      }
      
      if (communityId) {
        filters.communityId = communityId as string;
      }
      if (featured !== undefined) {
        filters.featured = featured === 'true';
      }
      
      const testimonials = await storage.getTestimonials(filters);
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/testimonials/:id", async (req, res) => {
    try {
      const testimonial = await storage.getTestimonial(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      console.error("Error fetching testimonial:", error);
      res.status(500).json({ message: "Failed to fetch testimonial" });
    }
  });

  app.post("/api/testimonials", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(400).json({ message: "Failed to create testimonial" });
    }
  });

  app.put("/api/testimonials/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(req.params.id, validatedData);
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(400).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/testimonials/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteTestimonial(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // Community highlights routes
  
  // Get all highlights (for admin)
  app.get("/api/community-highlights", async (req, res) => {
    try {
      const highlights = await storage.getAllCommunityHighlights();
      res.json(highlights);
    } catch (error) {
      console.error("Error fetching all community highlights:", error);
      res.status(500).json({ message: "Failed to fetch community highlights" });
    }
  });

  app.get("/api/communities/:communityId/highlights", async (req, res) => {
    try {
      const highlights = await storage.getCommunityHighlights(req.params.communityId);
      res.json(highlights);
    } catch (error) {
      console.error("Error fetching community highlights:", error);
      res.status(500).json({ message: "Failed to fetch community highlights" });
    }
  });

  app.get("/api/community-highlights/:id", async (req, res) => {
    try {
      const highlight = await storage.getCommunityHighlight(req.params.id);
      if (!highlight) {
        return res.status(404).json({ message: "Highlight not found" });
      }
      res.json(highlight);
    } catch (error) {
      console.error("Error fetching community highlight:", error);
      res.status(500).json({ message: "Failed to fetch community highlight" });
    }
  });

  app.post("/api/community-highlights", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCommunityHighlightSchema.parse(req.body);
      const highlight = await storage.createCommunityHighlight(validatedData);
      res.status(201).json(highlight);
    } catch (error) {
      console.error("Error creating community highlight:", error);
      res.status(400).json({ message: "Failed to create community highlight" });
    }
  });

  app.put("/api/community-highlights/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCommunityHighlightSchema.partial().parse(req.body);
      const highlight = await storage.updateCommunityHighlight(req.params.id, validatedData);
      res.json(highlight);
    } catch (error) {
      console.error("Error updating community highlight:", error);
      res.status(400).json({ message: "Failed to update community highlight" });
    }
  });

  app.delete("/api/community-highlights/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteCommunityHighlight(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting community highlight:", error);
      res.status(500).json({ message: "Failed to delete community highlight" });
    }
  });

  // Community features routes (Experience the Difference section)
  app.get("/api/communities/:communityId/features", async (req, res) => {
    try {
      const features = await storage.getCommunityFeatures(req.params.communityId);
      res.json(features);
    } catch (error) {
      console.error("Error fetching community features:", error);
      res.status(500).json({ message: "Failed to fetch community features" });
    }
  });

  app.get("/api/community-features/:id", async (req, res) => {
    try {
      const feature = await storage.getCommunityFeature(req.params.id);
      if (!feature) {
        return res.status(404).json({ message: "Feature not found" });
      }
      res.json(feature);
    } catch (error) {
      console.error("Error fetching community feature:", error);
      res.status(500).json({ message: "Failed to fetch community feature" });
    }
  });

  app.post("/api/community-features", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCommunityFeatureSchema.parse(req.body);
      const feature = await storage.createCommunityFeature(validatedData);
      res.status(201).json(feature);
    } catch (error) {
      console.error("Error creating community feature:", error);
      res.status(400).json({ message: "Failed to create community feature" });
    }
  });

  app.put("/api/community-features/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCommunityFeatureSchema.partial().parse(req.body);
      const feature = await storage.updateCommunityFeature(req.params.id, validatedData);
      res.json(feature);
    } catch (error) {
      console.error("Error updating community feature:", error);
      res.status(400).json({ message: "Failed to update community feature" });
    }
  });

  app.delete("/api/community-features/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteCommunityFeature(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting community feature:", error);
      res.status(500).json({ message: "Failed to delete community feature" });
    }
  });

  // Gallery image routes
  app.get("/api/gallery-images", async (req, res) => {
    try {
      const { communityId, category, featured, active } = req.query;
      const filters: any = {};
      
      if (communityId) {
        filters.communityId = communityId as string;
      }
      if (category) {
        filters.category = category as string;
      }
      if (featured !== undefined) {
        filters.featured = featured === 'true';
      }
      if (active !== undefined) {
        filters.active = active === 'true';
      }
      
      const galleryImages = await storage.getFilteredGalleryImages(filters);
      res.json(galleryImages);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  app.get("/api/gallery-images/:id", async (req, res) => {
    try {
      const galleryImage = await storage.getGalleryImage(req.params.id);
      if (!galleryImage) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      res.json(galleryImage);
    } catch (error) {
      console.error("Error fetching gallery image:", error);
      res.status(500).json({ message: "Failed to fetch gallery image" });
    }
  });

  app.post("/api/gallery-images", requireAuth, async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.parse(req.body);
      const galleryImage = await storage.createGalleryImage(validatedData);
      res.status(201).json(galleryImage);
    } catch (error) {
      console.error("Error creating gallery image:", error);
      res.status(400).json({ message: "Failed to create gallery image" });
    }
  });

  app.put("/api/gallery-images/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.partial().parse(req.body);
      const galleryImage = await storage.updateGalleryImage(req.params.id, validatedData);
      res.json(galleryImage);
    } catch (error) {
      console.error("Error updating gallery image:", error);
      res.status(400).json({ message: "Failed to update gallery image" });
    }
  });

  app.delete("/api/gallery-images/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteGalleryImage(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({ message: "Failed to delete gallery image" });
    }
  });

  // Care type routes
  app.get("/api/care-types", async (req, res) => {
    try {
      const { active } = req.query;
      const filters: any = {};
      
      if (active !== undefined) {
        filters.active = active === 'true';
      }
      
      const careTypes = await storage.getCareTypes(filters);
      res.json(careTypes);
    } catch (error) {
      console.error("Error fetching care types:", error);
      res.status(500).json({ message: "Failed to fetch care types" });
    }
  });

  app.get("/api/care-types/:slug", async (req, res) => {
    try {
      const careType = await storage.getCareType(req.params.slug);
      if (!careType) {
        return res.status(404).json({ message: "Care type not found" });
      }
      res.json(careType);
    } catch (error) {
      console.error("Error fetching care type:", error);
      res.status(500).json({ message: "Failed to fetch care type" });
    }
  });

  // Care type routes
  app.get("/api/care-types", async (req, res) => {
    try {
      const { active } = req.query;
      const filters: any = {};
      
      if (active !== undefined) {
        filters.active = active === 'true';
      }
      
      const careTypes = await storage.getCareTypes(filters);
      res.json(careTypes);
    } catch (error) {
      console.error("Error fetching care types:", error);
      res.status(500).json({ message: "Failed to fetch care types" });
    }
  });

  app.get("/api/care-types/:id", async (req, res) => {
    try {
      const careType = await storage.getCareTypeById(req.params.id);
      if (!careType) {
        return res.status(404).json({ message: "Care type not found" });
      }
      res.json(careType);
    } catch (error) {
      console.error("Error fetching care type:", error);
      res.status(500).json({ message: "Failed to fetch care type" });
    }
  });

  app.post("/api/care-types", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCareTypeSchema.parse(req.body);
      const careType = await storage.createCareType(validatedData);
      res.status(201).json(careType);
    } catch (error) {
      console.error("Error creating care type:", error);
      res.status(400).json({ message: "Failed to create care type" });
    }
  });

  app.put("/api/care-types/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCareTypeSchema.partial().parse(req.body);
      const careType = await storage.updateCareType(req.params.id, validatedData);
      res.json(careType);
    } catch (error) {
      console.error("Error updating care type:", error);
      res.status(400).json({ message: "Failed to update care type" });
    }
  });

  app.delete("/api/care-types/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteCareType(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting care type:", error);
      res.status(500).json({ message: "Failed to delete care type" });
    }
  });

  // Amenity routes
  app.get("/api/amenities", async (req, res) => {
    try {
      const { active } = req.query;
      const filters: any = {};
      
      if (active !== undefined) {
        filters.active = active === 'true';
      }
      
      const amenities = await storage.getAmenities(filters);
      res.json(amenities);
    } catch (error) {
      console.error("Error fetching amenities:", error);
      res.status(500).json({ message: "Failed to fetch amenities" });
    }
  });

  app.get("/api/amenities/:id", async (req, res) => {
    try {
      const amenity = await storage.getAmenityById(req.params.id);
      if (!amenity) {
        return res.status(404).json({ message: "Amenity not found" });
      }
      res.json(amenity);
    } catch (error) {
      console.error("Error fetching amenity:", error);
      res.status(500).json({ message: "Failed to fetch amenity" });
    }
  });

  app.post("/api/amenities", requireAuth, async (req, res) => {
    try {
      const validatedData = insertAmenitySchema.parse(req.body);
      const amenity = await storage.createAmenity(validatedData);
      res.status(201).json(amenity);
    } catch (error) {
      console.error("Error creating amenity:", error);
      res.status(400).json({ message: "Failed to create amenity" });
    }
  });

  app.put("/api/amenities/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertAmenitySchema.partial().parse(req.body);
      const amenity = await storage.updateAmenity(req.params.id, validatedData);
      res.json(amenity);
    } catch (error) {
      console.error("Error updating amenity:", error);
      res.status(400).json({ message: "Failed to update amenity" });
    }
  });

  app.delete("/api/amenities/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteAmenity(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting amenity:", error);
      res.status(500).json({ message: "Failed to delete amenity" });
    }
  });

  // Page hero routes
  app.get("/api/page-heroes", async (req, res) => {
    try {
      const { active } = req.query;
      const filters: any = {};
      
      if (active !== undefined) {
        filters.active = active === 'true';
      }
      
      const pageHeroes = await storage.getPageHeroes(filters);
      res.json(pageHeroes);
    } catch (error) {
      console.error("Error fetching page heroes:", error);
      res.status(500).json({ message: "Failed to fetch page heroes" });
    }
  });

  app.get("/api/page-heroes/:pagePath", async (req, res) => {
    try {
      const pageHero = await storage.getPageHero(req.params.pagePath);
      if (!pageHero) {
        return res.status(404).json({ message: "Page hero not found" });
      }
      res.json(pageHero);
    } catch (error) {
      console.error("Error fetching page hero:", error);
      res.status(500).json({ message: "Failed to fetch page hero" });
    }
  });

  app.post("/api/page-heroes", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPageHeroSchema.parse(req.body);
      
      // Check if a page hero already exists for this page path
      const existingPageHero = await storage.getPageHero(validatedData.pagePath);
      if (existingPageHero) {
        return res.status(409).json({ 
          message: `A hero section already exists for this page. Please edit the existing hero instead.`,
          existingId: existingPageHero.id 
        });
      }
      
      const pageHero = await storage.createPageHero(validatedData);
      res.status(201).json(pageHero);
    } catch (error) {
      console.error("Error creating page hero:", error);
      if ((error as any)?.code === '23505') { // PostgreSQL unique constraint violation
        res.status(409).json({ message: "A hero section already exists for this page. Please edit the existing hero instead." });
      } else {
        res.status(400).json({ message: "Failed to create page hero" });
      }
    }
  });

  app.put("/api/page-heroes/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPageHeroSchema.partial().parse(req.body);
      
      // If pagePath is being updated, check for conflicts
      if (validatedData.pagePath) {
        const existingPageHero = await storage.getPageHero(validatedData.pagePath);
        if (existingPageHero && existingPageHero.id !== req.params.id) {
          return res.status(409).json({ 
            message: `A hero section already exists for this page. Please choose a different page.`,
            existingId: existingPageHero.id 
          });
        }
      }
      
      const pageHero = await storage.updatePageHero(req.params.id, validatedData);
      res.json(pageHero);
    } catch (error) {
      console.error("Error updating page hero:", error);
      if ((error as any)?.code === '23505') { // PostgreSQL unique constraint violation
        res.status(409).json({ message: "A hero section already exists for this page. Please choose a different page." });
      } else {
        res.status(400).json({ message: "Failed to update page hero" });
      }
    }
  });

  app.delete("/api/page-heroes/:id", requireAuth, async (req, res) => {
    try {
      await storage.deletePageHero(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting page hero:", error);
      res.status(500).json({ message: "Failed to delete page hero" });
    }
  });

  // Team member routes
  app.get("/api/team-members", async (req, res) => {
    try {
      const { includeInactive } = req.query;
      const members = await storage.getAllTeamMembers(includeInactive === 'true');
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.get("/api/team-members/:id", async (req, res) => {
    try {
      const member = await storage.getTeamMemberById(req.params.id);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error fetching team member:", error);
      res.status(500).json({ message: "Failed to fetch team member" });
    }
  });

  app.get("/api/team-members/slug/:slug", async (req, res) => {
    try {
      const member = await storage.getTeamMemberBySlug(req.params.slug);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error fetching team member:", error);
      res.status(500).json({ message: "Failed to fetch team member" });
    }
  });

  // Get team members by community
  app.get("/api/communities/:communityId/team-members", async (req, res) => {
    try {
      const members = await storage.getTeamMembersByCommunity(req.params.communityId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members for community:", error);
      res.status(500).json({ message: "Failed to fetch team members for community" });
    }
  });

  app.post("/api/team-members", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(400).json({ message: "Failed to create team member" });
    }
  });

  app.put("/api/team-members/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTeamMemberSchema.partial().parse(req.body);
      const member = await storage.updateTeamMember(req.params.id, validatedData);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(400).json({ message: "Failed to update team member" });
    }
  });

  app.patch("/api/team-members/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTeamMemberSchema.partial().parse(req.body);
      const member = await storage.updateTeamMember(req.params.id, validatedData);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(400).json({ message: "Failed to update team member" });
    }
  });

  app.delete("/api/team-members/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteTeamMember(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  // Homepage section routes
  app.get("/api/homepage-sections", async (req, res) => {
    try {
      const { includeInvisible } = req.query;
      const sections = await storage.getHomepageSections(includeInvisible === 'true');
      res.json(sections);
    } catch (error) {
      console.error("Error fetching homepage sections:", error);
      res.status(500).json({ message: "Failed to fetch homepage sections" });
    }
  });

  app.get("/api/homepage-sections/:slug", async (req, res) => {
    try {
      const section = await storage.getHomepageSectionBySlug(req.params.slug);
      if (!section) {
        return res.status(404).json({ message: "Homepage section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Error fetching homepage section:", error);
      res.status(500).json({ message: "Failed to fetch homepage section" });
    }
  });

  app.post("/api/homepage-sections", requireAuth, async (req, res) => {
    try {
      const validatedData = insertHomepageSectionSchema.parse(req.body);
      
      // Check if slug already exists
      const existing = await storage.getHomepageSectionBySlug(validatedData.slug);
      if (existing) {
        return res.status(409).json({ message: "A homepage section with this slug already exists" });
      }
      
      const section = await storage.createHomepageSection(validatedData);
      res.status(201).json(section);
    } catch (error) {
      console.error("Error creating homepage section:", error);
      res.status(400).json({ message: "Failed to create homepage section" });
    }
  });

  app.put("/api/homepage-sections/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertHomepageSectionSchema.partial().parse(req.body);
      
      // If slug is being changed, check for conflicts
      if (validatedData.slug) {
        const existing = await storage.getHomepageSectionBySlug(validatedData.slug);
        if (existing && existing.id !== req.params.id) {
          return res.status(409).json({ message: "A homepage section with this slug already exists" });
        }
      }
      
      const section = await storage.updateHomepageSection(req.params.id, validatedData);
      if (!section) {
        return res.status(404).json({ message: "Homepage section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Error updating homepage section:", error);
      res.status(400).json({ message: "Failed to update homepage section" });
    }
  });

  app.delete("/api/homepage-sections/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteHomepageSection(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting homepage section:", error);
      res.status(500).json({ message: "Failed to delete homepage section" });
    }
  });

  // Homepage config routes
  app.get("/api/homepage-config/:sectionKey", async (req, res) => {
    try {
      const config = await storage.getHomepageConfig(req.params.sectionKey);
      if (!config) {
        // Return empty config if none exists
        return res.json({ heading: '', subheading: '' });
      }
      res.json(config);
    } catch (error) {
      console.error("Error fetching homepage config:", error);
      res.status(500).json({ message: "Failed to fetch homepage config" });
    }
  });

  app.put("/api/homepage-config/:sectionKey", requireAuth, async (req, res) => {
    try {
      const validatedData = insertHomepageConfigSchema.partial().parse(req.body);
      const config = await storage.updateHomepageConfig(req.params.sectionKey, validatedData);
      res.json(config);
    } catch (error) {
      console.error("Error updating homepage config:", error);
      res.status(400).json({ message: "Failed to update homepage config" });
    }
  });

  // Image upload routes
  // Single image upload
  app.post("/api/upload", requireAuth, uploadSingle, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get authenticated user ID
      const uploadedBy = (req.user as any)?.id;
      
      const result = await processSingleImageUpload(req.file, uploadedBy);
      res.json(result);
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Multiple image upload
  app.post("/api/upload-multiple", requireAuth, uploadMultiple, async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      // Get authenticated user ID
      const uploadedBy = (req.user as any)?.id;
      
      const results = await processMultipleImageUploads(files, uploadedBy);
      res.json(results);
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ message: "Failed to upload images" });
    }
  });

  // Mixed file upload (images and PDFs) - for calendar files
  app.post("/api/upload-mixed", requireAuth, uploadMixed, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get authenticated user ID
      const uploadedBy = (req.user as any)?.id;
      
      const result = await processMixedFileUpload(req.file, uploadedBy);
      res.json(result);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Get all images
  app.get("/api/images", requireAuth, async (req, res) => {
    try {
      const images = await storage.getImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  // Get single image
  app.get("/api/images/:id", async (req, res) => {
    try {
      const image = await storage.getImage(req.params.id);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.json(image);
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ message: "Failed to fetch image" });
    }
  });

  // Delete image
  app.delete("/api/images/:id", requireAuth, async (req, res) => {
    try {
      // Get image to find object key
      const image = await storage.getImage(req.params.id);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Check if image is referenced by any entities
      const imageId = req.params.id;
      const references = await storage.checkImageReferences(imageId);
      
      if (references.length > 0) {
        // Image is in use, return 409 Conflict
        const referencedTables = references.map(ref => ref.table).join(", ");
        return res.status(409).json({ 
          message: `Cannot delete image. It is currently referenced by: ${referencedTables}. Please update or remove these references before deleting the image.`,
          references: references
        });
      }

      // Delete from object storage
      await deleteFromObjectStorage(image.objectKey);
      
      // Delete from database
      await storage.deleteImage(req.params.id);
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  // Serve images from object storage bucket
  app.get("/:bucketId/public/:filename", async (req, res) => {
    try {
      const { bucketId, filename } = req.params;

      // Import Storage from Google Cloud
      const { Storage } = await import("@google-cloud/storage");

      // Initialize storage client with Replit sidecar configuration
      const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
      const objectStorageClient = new Storage({
        credentials: {
          audience: "replit",
          subject_token_type: "access_token",
          token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
          type: "external_account",
          credential_source: {
            url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
            format: {
              type: "json",
              subject_token_field_name: "access_token",
            },
          },
          universe_domain: "googleapis.com",
        },
        projectId: "",
      });

      // Get the file from the bucket
      const bucket = objectStorageClient.bucket(bucketId);
      const file = bucket.file(`public/${filename}`);

      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Get file metadata to set proper content type
      const [metadata] = await file.getMetadata();

      // Set appropriate headers
      if (metadata.contentType) {
        res.setHeader("Content-Type", metadata.contentType);
      }
      res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

      // Stream the file to the response
      file.createReadStream()
        .on("error", (error) => {
          console.error("Error streaming image:", error);
          res.status(500).json({ message: "Failed to load image" });
        })
        .pipe(res);
    } catch (error) {
      console.error("Error serving image from bucket:", error);
      res.status(500).json({ message: "Failed to serve image" });
    }
  });

  // Error handler for upload middleware
  app.use(handleUploadError);

  const httpServer = createServer(app);
  return httpServer;
}
