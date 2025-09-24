import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertCommunitySchema,
  insertPostSchema,
  insertBlogPostSchema,
  insertEventSchema,
  insertFaqSchema,
  insertGallerySchema,
  insertTourRequestSchema,
  insertFloorPlanSchema,
  insertTestimonialSchema,
  insertGalleryImageSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
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
      res.json(community);
    } catch (error) {
      console.error("Error fetching community:", error);
      res.status(500).json({ message: "Failed to fetch community" });
    }
  });

  app.post("/api/communities", async (req, res) => {
    try {
      const validatedData = insertCommunitySchema.parse(req.body);
      const community = await storage.createCommunity(validatedData);
      res.status(201).json(community);
    } catch (error) {
      console.error("Error creating community:", error);
      res.status(400).json({ message: "Failed to create community" });
    }
  });

  app.put("/api/communities/:id", async (req, res) => {
    try {
      const validatedData = insertCommunitySchema.partial().parse(req.body);
      const community = await storage.updateCommunity(req.params.id, validatedData);
      res.json(community);
    } catch (error) {
      console.error("Error updating community:", error);
      res.status(400).json({ message: "Failed to update community" });
    }
  });

  app.delete("/api/communities/:id", async (req, res) => {
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

  app.post("/api/posts", async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/posts/:id", async (req, res) => {
    try {
      const validatedData = insertPostSchema.partial().parse(req.body);
      const post = await storage.updatePost(req.params.id, validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(400).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    try {
      await storage.deletePost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
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

  app.post("/api/blog-posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/blog-posts/:id", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(400).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog-posts/:id", async (req, res) => {
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

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({ message: "Failed to create event" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const validatedData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, validatedData);
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(400).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
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

  app.post("/api/faqs", async (req, res) => {
    try {
      const validatedData = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq(validatedData);
      res.status(201).json(faq);
    } catch (error) {
      console.error("Error creating FAQ:", error);
      res.status(400).json({ message: "Failed to create FAQ" });
    }
  });

  app.put("/api/faqs/:id", async (req, res) => {
    try {
      const validatedData = insertFaqSchema.partial().parse(req.body);
      const faq = await storage.updateFaq(req.params.id, validatedData);
      res.json(faq);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      res.status(400).json({ message: "Failed to update FAQ" });
    }
  });

  app.delete("/api/faqs/:id", async (req, res) => {
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

  app.post("/api/galleries", async (req, res) => {
    try {
      const validatedData = insertGallerySchema.parse(req.body);
      const gallery = await storage.createGallery(validatedData);
      res.status(201).json(gallery);
    } catch (error) {
      console.error("Error creating gallery:", error);
      res.status(400).json({ message: "Failed to create gallery" });
    }
  });

  app.put("/api/galleries/:id", async (req, res) => {
    try {
      const validatedData = insertGallerySchema.partial().parse(req.body);
      const gallery = await storage.updateGallery(req.params.id, validatedData);
      res.json(gallery);
    } catch (error) {
      console.error("Error updating gallery:", error);
      res.status(400).json({ message: "Failed to update gallery" });
    }
  });

  app.delete("/api/galleries/:id", async (req, res) => {
    try {
      await storage.deleteGallery(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting gallery:", error);
      res.status(500).json({ message: "Failed to delete gallery" });
    }
  });

  // Tour request routes
  app.get("/api/tour-requests", async (req, res) => {
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

  app.put("/api/tour-requests/:id", async (req, res) => {
    try {
      const validatedData = insertTourRequestSchema.partial().parse(req.body);
      const tourRequest = await storage.updateTourRequest(req.params.id, validatedData);
      res.json(tourRequest);
    } catch (error) {
      console.error("Error updating tour request:", error);
      res.status(400).json({ message: "Failed to update tour request" });
    }
  });

  app.delete("/api/tour-requests/:id", async (req, res) => {
    try {
      await storage.deleteTourRequest(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting tour request:", error);
      res.status(500).json({ message: "Failed to delete tour request" });
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

  app.post("/api/floor-plans", async (req, res) => {
    try {
      const validatedData = insertFloorPlanSchema.parse(req.body);
      const floorPlan = await storage.createFloorPlan(validatedData);
      res.status(201).json(floorPlan);
    } catch (error) {
      console.error("Error creating floor plan:", error);
      res.status(400).json({ message: "Failed to create floor plan" });
    }
  });

  app.put("/api/floor-plans/:id", async (req, res) => {
    try {
      const validatedData = insertFloorPlanSchema.partial().parse(req.body);
      const floorPlan = await storage.updateFloorPlan(req.params.id, validatedData);
      res.json(floorPlan);
    } catch (error) {
      console.error("Error updating floor plan:", error);
      res.status(400).json({ message: "Failed to update floor plan" });
    }
  });

  app.delete("/api/floor-plans/:id", async (req, res) => {
    try {
      await storage.deleteFloorPlan(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting floor plan:", error);
      res.status(500).json({ message: "Failed to delete floor plan" });
    }
  });

  // Testimonial routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const { communityId, featured, approved } = req.query;
      const filters: any = {};
      
      if (communityId) {
        filters.communityId = communityId as string;
      }
      if (featured !== undefined) {
        filters.featured = featured === 'true';
      }
      if (approved !== undefined) {
        filters.approved = approved === 'true';
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

  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(400).json({ message: "Failed to create testimonial" });
    }
  });

  app.put("/api/testimonials/:id", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(req.params.id, validatedData);
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(400).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    try {
      await storage.deleteTestimonial(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
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
      
      const galleryImages = await storage.getGalleryImages(filters);
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

  app.post("/api/gallery-images", async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.parse(req.body);
      const galleryImage = await storage.createGalleryImage(validatedData);
      res.status(201).json(galleryImage);
    } catch (error) {
      console.error("Error creating gallery image:", error);
      res.status(400).json({ message: "Failed to create gallery image" });
    }
  });

  app.put("/api/gallery-images/:id", async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.partial().parse(req.body);
      const galleryImage = await storage.updateGalleryImage(req.params.id, validatedData);
      res.json(galleryImage);
    } catch (error) {
      console.error("Error updating gallery image:", error);
      res.status(400).json({ message: "Failed to update gallery image" });
    }
  });

  app.delete("/api/gallery-images/:id", async (req, res) => {
    try {
      await storage.deleteGalleryImage(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({ message: "Failed to delete gallery image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
