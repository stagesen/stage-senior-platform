import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { setupAuth } from "./auth";
import { utmTrackingMiddleware } from "./utm-tracking";
import { clickIdCaptureMiddleware } from "./click-id-middleware";
import { sendTourRequestNotification, sendExitIntentSubmissionNotification } from "./email";
import { sendConversion } from "./conversion-service";
import { validateConversionPayload, generateTransactionId, type ConversionPayload } from "./conversion-utils";
import { tourRequestLimiter, verifyCaptcha, detectHoneypot, detectSpeedAnomaly, logSecurityEvent } from "./security-middleware";
import { googleAdsService } from "./google-ads-service";
import DOMPurify from "isomorphic-dompurify";
import { eq, desc } from "drizzle-orm";
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
  insertPageContentSectionSchema,
  insertLandingPageTemplateSchema,
  insertGoogleAdsConversionActionSchema,
  insertGoogleAdsCampaignSchema,
  insertGoogleAdsAdGroupSchema,
  insertGoogleAdsKeywordSchema,
  insertGoogleAdsAdSchema,
  insertExitIntentPopupSchema,
  insertExitIntentSubmissionSchema,
  googleAdsConversionActions,
  googleAdsCampaigns,
  googleAdsAdGroups,
  googleAdsKeywords,
  googleAdsAds,
  type SelectGoogleAdsConversionAction,
  type InsertGoogleAdsConversionAction,
} from "@shared/schema";
import { z } from "zod";

// Middleware to protect admin routes - referenced by javascript_auth_all_persistance integration
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Helper function to sanitize HTML content for blog posts
function sanitizeBlogContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel']
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication - referenced by javascript_auth_all_persistance integration
  setupAuth(app);
  
  // UTM tracking middleware - captures campaign data from query parameters
  app.use(utmTrackingMiddleware);
  
  // Click ID capture middleware - captures Google Ads and Meta click IDs
  app.use(clickIdCaptureMiddleware);
  
  // Root health check endpoint for deployment health checks (production only)
  // In development, Vite middleware handles the root route
  if (process.env.NODE_ENV === "production") {
    app.get("/", (_req, res) => {
      res.status(200).json({ status: "ok" });
    });
  }
  
  // Diagnostic endpoint for debugging production issues
  app.get("/api/health", async (_req, res) => {
    try {
      // Check database connectivity
      const dbCheck = await storage.getUserCount().then(() => true).catch(() => false);
      
      // Check session secret in production
      const sessionSecretSet = process.env.NODE_ENV !== "production" || !!process.env.SESSION_SECRET;
      
      res.json({ 
        status: "ok",
        database: dbCheck ? "connected" : "error",
        sessionSecret: sessionSecretSet ? "configured" : "missing",
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error",
        message: "Health check failed"
      });
    }
  });

  // Conversion tracking endpoint - sends events to Google Ads and Meta
  app.post("/api/conversions", async (req, res) => {
    try {
      const payload = req.body as Partial<ConversionPayload>;
      
      // Validate payload
      const validation = validateConversionPayload(payload);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
        });
      }
      
      // Send conversion to both Google Ads and Meta
      const result = await sendConversion(payload as ConversionPayload);
      
      // Return results
      res.json({
        success: true,
        google: result.google,
        meta: result.meta,
        transactionId: payload.transactionId,
      });
    } catch (error: any) {
      console.error('[Conversion API] Error processing conversion:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process conversion',
      });
    }
  });

  // Google Ads conversion actions management routes
  
  // GET /api/google-ads/conversions - List all conversion actions from database
  app.get("/api/google-ads/conversions", async (req, res) => {
    try {
      const conversions = await db
        .select()
        .from(googleAdsConversionActions)
        .orderBy(desc(googleAdsConversionActions.createdAt));
      
      res.json(conversions);
    } catch (error: any) {
      console.error('Error fetching Google Ads conversions:', error);
      res.status(500).json({ 
        message: 'Failed to fetch conversion actions',
        error: error.message 
      });
    }
  });

  // POST /api/google-ads/conversions/sync - Sync conversion actions from Google Ads API
  app.post("/api/google-ads/conversions/sync", async (req, res) => {
    try {
      // Fetch conversion actions from Google Ads API
      const apiConversions = await googleAdsService.listConversionActions();
      
      let syncedCount = 0;
      let updatedCount = 0;
      
      // Process each conversion from API
      for (const apiConversion of apiConversions) {
        // Check if conversion exists in database by resourceName
        const existingConversion = await db
          .select()
          .from(googleAdsConversionActions)
          .where(eq(googleAdsConversionActions.resourceName, apiConversion.resourceName))
          .limit(1);
        
        if (existingConversion.length > 0) {
          // Update existing conversion with all metadata fields
          await db
            .update(googleAdsConversionActions)
            .set({
              name: apiConversion.name,
              category: apiConversion.category,
              conversionActionId: apiConversion.id,
              status: apiConversion.status,
              conversionLabel: apiConversion.conversionActionLabel || existingConversion[0].conversionLabel,
              value: apiConversion.value?.toString() || null,
              attributionModel: apiConversion.attributionModel || null,
              countingType: apiConversion.countingType || null,
              clickThroughWindowDays: apiConversion.clickThroughWindowDays || null,
              viewThroughWindowDays: apiConversion.viewThroughWindowDays || null,
              syncedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(googleAdsConversionActions.resourceName, apiConversion.resourceName));
          
          updatedCount++;
        } else {
          // Insert new conversion with all metadata fields
          const insertData: InsertGoogleAdsConversionAction = {
            resourceName: apiConversion.resourceName,
            conversionActionId: apiConversion.id,
            name: apiConversion.name,
            conversionLabel: apiConversion.conversionActionLabel || null,
            category: apiConversion.category,
            status: apiConversion.status,
            value: apiConversion.value?.toString() || null,
            attributionModel: apiConversion.attributionModel || null,
            countingType: apiConversion.countingType || null,
            clickThroughWindowDays: apiConversion.clickThroughWindowDays || null,
            viewThroughWindowDays: apiConversion.viewThroughWindowDays || null,
            syncedAt: new Date(),
          };
          
          await db.insert(googleAdsConversionActions).values(insertData);
          syncedCount++;
        }
      }
      
      res.json({
        success: true,
        synced: syncedCount,
        updated: updatedCount,
        total: apiConversions.length,
      });
    } catch (error: any) {
      console.error('Error syncing Google Ads conversions:', error);
      res.status(500).json({ 
        message: 'Failed to sync conversion actions',
        error: error.message 
      });
    }
  });

  // POST /api/google-ads/conversions - Create a new conversion action
  app.post("/api/google-ads/conversions", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertGoogleAdsConversionActionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validationResult.error.errors,
        });
      }
      
      const { name, category, value, isPrimary, attributionModel } = req.body;
      
      // Create conversion action in Google Ads
      const apiResult = await googleAdsService.createConversionAction({
        name,
        category: category || 'LEAD',
        value: value ? parseFloat(value) : undefined,
        attributionModel: attributionModel || 'DATA_DRIVEN',
      });
      
      // Save to database with conversion label from API response
      const insertData: InsertGoogleAdsConversionAction = {
        resourceName: apiResult.resourceName,
        conversionActionId: apiResult.id,
        name: apiResult.name,
        conversionLabel: apiResult.conversionActionLabel || null,
        category: apiResult.category,
        value: value || null,
        status: apiResult.status,
        isPrimary: isPrimary || false,
        attributionModel: attributionModel || null,
        syncedAt: new Date(),
      };
      
      const [createdConversion] = await db
        .insert(googleAdsConversionActions)
        .values(insertData)
        .returning();
      
      res.status(201).json(createdConversion);
    } catch (error: any) {
      console.error('Error creating Google Ads conversion:', error);
      res.status(500).json({ 
        message: 'Failed to create conversion action',
        error: error.message 
      });
    }
  });

  // GET /api/google-ads/conversions/:id - Get single conversion by ID
  app.get("/api/google-ads/conversions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const [conversion] = await db
        .select()
        .from(googleAdsConversionActions)
        .where(eq(googleAdsConversionActions.id, id))
        .limit(1);
      
      if (!conversion) {
        return res.status(404).json({ 
          message: 'Conversion action not found' 
        });
      }
      
      res.json(conversion);
    } catch (error: any) {
      console.error('Error fetching Google Ads conversion:', error);
      res.status(500).json({ 
        message: 'Failed to fetch conversion action',
        error: error.message 
      });
    }
  });

  // Google Ads Campaign routes
  
  // GET /api/google-ads/campaigns - List all campaigns
  app.get("/api/google-ads/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getGoogleAdsCampaigns();
      res.json(campaigns);
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
      res.status(500).json({ 
        message: 'Failed to fetch campaigns',
        error: error.message 
      });
    }
  });

  // GET /api/google-ads/campaigns/:id - Get campaign with details
  app.get("/api/google-ads/campaigns/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const campaign = await storage.getGoogleAdsCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      // Get related ad groups, keywords, and ads
      const adGroups = await storage.getGoogleAdsAdGroups(id);
      const campaignWithDetails = {
        ...campaign,
        adGroups: await Promise.all(adGroups.map(async (adGroup) => {
          const keywords = await storage.getGoogleAdsKeywords(adGroup.id);
          const ads = await storage.getGoogleAdsAds(adGroup.id);
          return {
            ...adGroup,
            keywords,
            ads,
          };
        })),
      };

      res.json(campaignWithDetails);
    } catch (error: any) {
      console.error('Error fetching campaign:', error);
      res.status(500).json({ 
        message: 'Failed to fetch campaign',
        error: error.message 
      });
    }
  });

  // POST /api/google-ads/campaigns - Create a complete campaign
  app.post("/api/google-ads/campaigns", async (req, res) => {
    // Define validation schema for campaign creation request
    const createCampaignRequestSchema = z.object({
      name: z.string().min(1, "Campaign name is required").max(255, "Campaign name is too long"),
      budgetAmount: z.number().positive("Budget amount must be positive"),
      landingPageTemplateId: z.string().uuid("Invalid landing page template ID").optional().nullable(),
      communityId: z.string().uuid("Invalid community ID").optional().nullable(),
      keywords: z.array(z.object({
        text: z.string().min(1, "Keyword text is required"),
        matchType: z.enum(["BROAD", "PHRASE", "EXACT"]).optional().default("BROAD"),
      })).optional().default([]),
      headlines: z.array(z.string().min(1)).min(3, "At least 3 headlines are required").max(15, "Maximum 15 headlines allowed").optional(),
      descriptions: z.array(z.string().min(1)).min(2, "At least 2 descriptions are required").max(4, "Maximum 4 descriptions allowed").optional(),
      finalUrl: z.string().url("Invalid final URL").optional(),
      biddingStrategy: z.enum(["MANUAL_CPC", "TARGET_CPA", "MAXIMIZE_CONVERSIONS"]).optional().default("MANUAL_CPC"),
      targetCpa: z.number().positive("Target CPA must be positive").optional().nullable(),
    });

    try {
      // Step 1: Validate request body
      const validationResult = createCampaignRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      const {
        name,
        budgetAmount,
        landingPageTemplateId,
        communityId,
        keywords,
        headlines,
        descriptions,
        finalUrl,
        biddingStrategy,
        targetCpa,
      } = validationResult.data;

      // Step 2: Verify referenced entities exist (if provided)
      if (landingPageTemplateId) {
        const template = await storage.getLandingPageTemplate(landingPageTemplateId);
        if (!template) {
          return res.status(404).json({ 
            message: 'Landing page template not found',
          });
        }
      }

      if (communityId) {
        const community = await storage.getCommunity(communityId);
        if (!community) {
          return res.status(404).json({ 
            message: 'Community not found',
          });
        }
      }

      // Step 3: Start database transaction for all database operations
      let dbCampaign: any;
      let budgetResourceName: string;
      let campaignResult: { resourceName: string; id: string };
      
      try {
        // Create budget in Google Ads (not part of transaction - external API)
        const budgetAmountMicros = Math.round(budgetAmount * 1000000);
        budgetResourceName = await googleAdsService.createCampaignBudget(
          `Budget for ${name}`,
          budgetAmountMicros
        );

        // Create campaign in Google Ads (not part of transaction - external API)
        campaignResult = await googleAdsService.createCampaign({
          name,
          budgetResourceName,
          status: 'PAUSED',
          biddingStrategy: biddingStrategy,
          targetCpaMicros: targetCpa ? Math.round(targetCpa * 1000000) : undefined,
        });

        // All database operations within transaction
        await db.transaction(async (tx) => {
          // Save campaign to database
          const [campaign] = await tx.insert(googleAdsCampaigns).values({
            name,
            resourceName: campaignResult.resourceName,
            campaignId: campaignResult.id,
            landingPageTemplateId: landingPageTemplateId || null,
            communityId: communityId || null,
            status: 'PAUSED',
            budgetAmountMicros,
            biddingStrategy: biddingStrategy || 'MANUAL_CPC',
            targetCpaMicros: targetCpa ? Math.round(targetCpa * 1000000) : null,
          }).returning();
          
          dbCampaign = campaign;

          // Create ad group in Google Ads
          const adGroupResult = await googleAdsService.createAdGroup({
            name: `${name} - Ad Group 1`,
            campaignResourceName: campaignResult.resourceName,
            cpcBidMicros: 1000000, // $1 default bid
          });

          // Save ad group to database
          const [dbAdGroup] = await tx.insert(googleAdsAdGroups).values({
            name: `${name} - Ad Group 1`,
            resourceName: adGroupResult.resourceName,
            adGroupId: adGroupResult.id,
            campaignId: campaign.id,
            cpcBidMicros: 1000000,
          }).returning();

          // Add keywords if provided
          if (keywords && keywords.length > 0) {
            const keywordResults = await googleAdsService.addKeywords({
              adGroupResourceName: adGroupResult.resourceName,
              keywords: keywords.map((kw) => ({
                text: kw.text,
                matchType: kw.matchType || 'BROAD',
              })),
            });

            // Save keywords to database
            for (const kw of keywordResults) {
              await tx.insert(googleAdsKeywords).values({
                keywordText: kw.text,
                matchType: 'BROAD',
                resourceName: kw.resourceName,
                criterionId: kw.id,
                adGroupId: dbAdGroup.id,
              });
            }
          }

          // Create responsive search ad if all required fields provided
          if (headlines && descriptions && finalUrl) {
            const adResult = await googleAdsService.createResponsiveSearchAd({
              adGroupResourceName: adGroupResult.resourceName,
              headlines,
              descriptions,
              finalUrl,
            });

            // Save ad to database
            await tx.insert(googleAdsAds).values({
              resourceName: adResult.resourceName,
              adId: adResult.id,
              adGroupId: dbAdGroup.id,
              headlines,
              descriptions,
              finalUrl,
            });
          }
        });

        res.status(201).json({
          campaign: dbCampaign,
          message: 'Campaign created successfully',
        });

      } catch (txError: any) {
        // Transaction failed - database operations were rolled back
        // Log the full error for debugging but return sanitized message
        console.error('[Google Ads Campaign] Transaction failed:', txError);
        
        // Check for specific error types
        if (txError.message?.includes('duplicate key')) {
          return res.status(409).json({ 
            message: 'Campaign with this name or resource already exists',
          });
        }
        
        if (txError.message?.includes('foreign key constraint')) {
          return res.status(400).json({ 
            message: 'Invalid reference to landing page template or community',
          });
        }

        // Check for Google Ads API errors
        if (txError.message?.includes('PERMISSION_DENIED') || txError.message?.includes('UNAUTHENTICATED')) {
          return res.status(403).json({ 
            message: 'Google Ads API authentication failed',
          });
        }

        if (txError.message?.includes('QUOTA_EXCEEDED')) {
          return res.status(429).json({ 
            message: 'Google Ads API quota exceeded. Please try again later.',
          });
        }

        // Generic error - don't expose internal details
        throw txError; // Re-throw to outer catch for generic 500 handling
      }

    } catch (error: any) {
      // Outer catch for any errors not handled by transaction catch
      console.error('[Google Ads Campaign] Error creating campaign:', error);
      
      // Return generic error message without exposing sensitive details
      res.status(500).json({ 
        message: 'Failed to create campaign. Please try again or contact support.',
      });
    }
  });

  // DELETE /api/google-ads/campaigns/:id - Delete campaign
  app.delete("/api/google-ads/campaigns/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGoogleAdsCampaign(id);
      res.json({ message: 'Campaign deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      res.status(500).json({ 
        message: 'Failed to delete campaign',
        error: error.message 
      });
    }
  });
  
  // Community routes
  app.get("/api/communities", async (req, res) => {
    try {
      const { careTypes, careType, city, state, active, activeOnly, cluster } = req.query;
      const filters: any = {};
      
      // Support both careTypes (legacy, plural) and careType (new, singular)
      if (careType) {
        filters.careType = careType as string;
      } else if (careTypes) {
        // For backwards compatibility, if careTypes is provided, use the first one
        const careTypesArray = Array.isArray(careTypes) ? careTypes : [careTypes];
        if (careTypesArray.length > 0) {
          filters.careType = careTypesArray[0] as string;
        }
      }
      
      if (city) {
        filters.city = city as string;
      }
      
      if (state) {
        filters.state = state as string;
      }
      
      if (cluster) {
        filters.cluster = cluster as string;
      }
      
      // Handle active filter with support for both 'active' and 'activeOnly' parameters
      // Priority: activeOnly > active > default to true
      if (activeOnly !== undefined) {
        filters.activeOnly = activeOnly === 'true';
      } else if (active !== undefined) {
        // Legacy support for 'active' parameter
        if (active === 'all') {
          filters.activeOnly = false;
        } else if (active === 'true') {
          filters.activeOnly = true;
        } else if (active === 'false') {
          filters.activeOnly = false;
        }
      } else {
        // Default to active communities only for public access
        filters.activeOnly = true;
      }
      
      const communities = await storage.getCommunities(filters);

      // getCommunities already includes careTypeIds and amenityIds from the junction tables
      // No need to re-query - this was causing N+1 query problem (1 + 2N queries instead of 3)
      res.json(communities);
    } catch (error) {
      console.error("Error fetching communities:", error);
      res.status(500).json({ message: "Failed to fetch communities" });
    }
  });

  // Lightweight endpoint: returns only id, name, slug for all active communities
  app.get("/api/communities/minimal", async (req, res) => {
    try {
      const communities = await storage.getCommunitiesMinimal(true);
      res.json(communities);
    } catch (error) {
      console.error("Error fetching minimal communities:", error);
      res.status(500).json({ message: "Failed to fetch communities" });
    }
  });

  // Lightweight endpoint: returns id, name, slug, city, imageId for homepage carousel and cards
  app.get("/api/communities/cards", async (req, res) => {
    try {
      const communities = await storage.getCommunitiesCards(true);
      res.json(communities);
    } catch (error) {
      console.error("Error fetching community cards:", error);
      res.status(500).json({ message: "Failed to fetch community cards" });
    }
  });

  // Lightweight endpoint: returns only id, name for dropdowns and simple selects
  app.get("/api/communities/dropdown", async (req, res) => {
    try {
      const communities = await storage.getCommunitiesDropdown(true);
      res.json(communities);
    } catch (error) {
      console.error("Error fetching community dropdown:", error);
      res.status(500).json({ message: "Failed to fetch community dropdown" });
    }
  });

  // Composite endpoint for community detail page - fetches all data in one request
  // IMPORTANT: This must come BEFORE /api/communities/:slug to match correctly
  app.get("/api/communities/:slug/full", async (req, res) => {
    try {
      const community = await storage.getCommunity(req.params.slug);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      // Fetch all related data in parallel for better performance
      const [
        careTypeIds,
        amenityIds,
        events,
        faqs,
        galleries,
        floorPlans,
        testimonials,
        galleryImages,
        posts,
        blogPosts,
        highlights,
        features,
        teamMembers
      ] = await Promise.all([
        storage.getCommunityCareTypes(community.id),
        storage.getCommunityAmenities(community.id),
        storage.getEvents({ communityId: community.id, upcoming: true }),
        storage.getFaqs({ communityId: community.id, active: true }),
        storage.getGalleries({ communityId: community.id, active: true }),
        storage.getFloorPlans({ communityId: community.id, active: true }),
        storage.getTestimonials({ communityId: community.id, approved: true }),
        storage.getFilteredGalleryImages({ communityId: community.id, active: true }),
        storage.getPosts({ communityId: community.id, published: true }),
        storage.getBlogPosts({ communityId: community.id, published: true }),
        storage.getCommunityHighlights(community.id),
        storage.getCommunityFeatures(community.id),
        storage.getTeamMembersByCommunity(community.id)
      ]);

      // Combine galleries with their images
      const galleriesWithImages = galleries.map(gallery => {
        const images = galleryImages
          .filter(img => img.galleryId === gallery.id)
          .map(img => ({
            id: img.imageId,
            url: img.url,
            alt: img.caption || img.alt || gallery.title,
            caption: img.caption,
            sortOrder: img.sortOrder
          }))
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        
        return {
          ...gallery,
          images
        };
      });

      // Return all data in one response with cache headers
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      res.json({
        community: {
          ...community,
          careTypeIds,
          amenityIds,
        },
        events,
        faqs,
        galleries: galleriesWithImages,
        floorPlans,
        testimonials,
        galleryImages,
        posts,
        blogPosts,
        highlights,
        features,
        teamMembers
      });
    } catch (error) {
      console.error("Error fetching community full data:", error);
      res.status(500).json({ message: "Failed to fetch community data" });
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
      console.log('PUT /api/communities/:id - Received data:', JSON.stringify(req.body, null, 2));
      const { careTypeIds, amenityIds, ...communityData } = req.body;
      const validatedData = insertCommunitySchema.partial().parse(communityData);
      console.log('PUT /api/communities/:id - Validated data:', JSON.stringify(validatedData, null, 2));
      const community = await storage.updateCommunity(req.params.id, validatedData);
      console.log('PUT /api/communities/:id - Updated community:', JSON.stringify(community, null, 2));
      
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
      
      // Delete from object storage if we have a file URL
      // Note: postAttachments doesn't have objectKey, only fileUrl
      // For now, we skip object storage deletion for post attachments
      
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

      // Find the latest post with "newsletter" tag and matching community
      // NOTE: Using Posts table (not BlogPosts) because newsletters are stored there
      const posts = await storage.getPosts({
        published: true,
        communityId: communityId,
        tags: ["newsletter"],
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

      // Get post attachments
      const attachments = await storage.getPostAttachments(latestPost.id);

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

      // Sanitize HTML content to prevent XSS attacks
      if (validatedData.content) {
        validatedData.content = sanitizeBlogContent(validatedData.content);
      }

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

      // Sanitize HTML content to prevent XSS attacks
      if (validatedData.content) {
        validatedData.content = sanitizeBlogContent(validatedData.content);
      }

      const post = await storage.updateBlogPost(req.params.id, validatedData);

      // Handle attachment update
      if (req.body.attachmentId !== undefined) {
        // First, remove any existing attachment for this post
        const existingAttachments = await storage.getPostAttachments(req.params.id);
        for (const attachment of existingAttachments) {
          if (attachment.id !== req.body.attachmentId) {
            // Delete the old attachment from storage
            // Note: postAttachments doesn't have objectKey, only fileUrl
            // For now, we skip object storage deletion for post attachments
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

  // Reset FAQs endpoint (admin only)
  app.post("/api/faqs/reset", async (req, res) => {
    try {
      const { resetFAQs } = await import("./reset-faqs");
      const result = await resetFAQs();
      res.json(result);
    } catch (error) {
      console.error("Error resetting FAQs:", error);
      res.status(500).json({ message: "Failed to reset FAQs" });
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
      
      // Fetch images for each gallery and attach them
      const galleriesWithImages = await Promise.all(
        galleries.map(async (gallery) => {
          const images = await storage.getGalleryImagesByGalleryId(gallery.id);
          return {
            ...gallery,
            images: images
          };
        })
      );
      
      res.json(galleriesWithImages);
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

  app.post("/api/tour-requests", tourRequestLimiter, async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    try {
      const validatedData = insertTourRequestSchema.parse(req.body);
      
      // Extract bot protection fields (not stored in database)
      const { captchaToken, honeypot, formLoadTime, ...tourRequestData } = validatedData;
      
      // Security Check 1: Honeypot detection
      if (detectHoneypot(honeypot)) {
        logSecurityEvent({
          type: 'honeypot',
          ip,
          userAgent,
          details: { honeypot },
        });
        return res.status(400).json({ message: 'Invalid submission' });
      }
      
      // Security Check 2: Speed check
      if (detectSpeedAnomaly(formLoadTime)) {
        const timeDiff = formLoadTime ? (Date.now() - formLoadTime) / 1000 : 'unknown';
        logSecurityEvent({
          type: 'speed_check',
          ip,
          userAgent,
          details: { timeDiff },
        });
        return res.status(400).json({ message: 'Please fill out the form completely' });
      }
      
      // Security Check 3: CAPTCHA verification (optional - log warning but allow submission)
      const captchaConfigured = !!process.env.TURNSTILE_SECRET_KEY;
      
      if (captchaConfigured && !captchaToken) {
        logSecurityEvent({
          type: 'captcha_fail',
          ip,
          userAgent,
          details: { error: 'missing-captcha-token', note: 'Allowed to proceed - CAPTCHA optional' },
        });
        console.warn(`[CAPTCHA] Missing token from IP ${ip} - CAPTCHA configured but frontend may not have site key - allowing submission`);
        // Continue processing - don't block submission
      }
      
      if (captchaToken) {
        const captchaResult = await verifyCaptcha(captchaToken, ip);
        
        if (!captchaResult.success) {
          logSecurityEvent({
            type: 'captcha_fail',
            ip,
            userAgent,
            details: { errors: captchaResult['error-codes'] },
          });
          return res.status(403).json({ 
            message: 'Security verification failed. Please try again.',
            errors: captchaResult['error-codes']
          });
        }
        
        // Log successful CAPTCHA verification
        console.log(`[CAPTCHA] Verified token from IP: ${ip}`);
      }
      
      // Generate transaction ID if not provided
      const transactionId = tourRequestData.transactionId || generateTransactionId();
      
      // Add UTM tracking data from session and click IDs
      const enrichedTourRequestData = {
        ...tourRequestData,
        transactionId,
        utmSource: req.session.utm?.utm_source,
        utmMedium: req.session.utm?.utm_medium,
        utmCampaign: req.session.utm?.utm_campaign,
        utmTerm: req.session.utm?.utm_term,
        utmContent: req.session.utm?.utm_content,
        landingPageUrl: req.session.utm?.landing_page_url,
        // Add click IDs from session
        gclid: req.session.clickIds?.gclid || tourRequestData.gclid,
        gbraid: req.session.clickIds?.gbraid || tourRequestData.gbraid,
        wbraid: req.session.clickIds?.wbraid || tourRequestData.wbraid,
        fbclid: req.session.clickIds?.fbclid || tourRequestData.fbclid,
        // Client info for Meta CAPI
        clientUserAgent: req.headers['user-agent'] || tourRequestData.clientUserAgent,
        clientIpAddress: req.ip || req.connection.remoteAddress || tourRequestData.clientIpAddress,
        conversionTier1SentAt: new Date(), // Mark that we're sending Tier 1 now
      };
      
      const tourRequest = await storage.createTourRequest(enrichedTourRequestData);
      
      // Send email notification to all active recipients
      try {
        await sendTourRequestNotification(tourRequest);
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the request if email fails
      }
      
      // Prepare and send ScheduleTour conversion to Google Ads and Meta
      try {
        const conversionPayload: ConversionPayload = {
          transactionId,
          leadType: 'schedule_tour',
          value: 250, // ScheduleTour = $250 per spec
          currency: 'USD',
          email: enrichedTourRequestData.email || undefined,
          phone: enrichedTourRequestData.phone,
          communityId: enrichedTourRequestData.communityId || undefined,
          communityName: undefined, // Will be looked up by conversion service if needed
          careType: undefined,
          gclid: enrichedTourRequestData.gclid || undefined,
          gbraid: enrichedTourRequestData.gbraid || undefined,
          wbraid: enrichedTourRequestData.wbraid || undefined,
          fbclid: enrichedTourRequestData.fbclid || undefined,
          fbp: enrichedTourRequestData.fbp || undefined,
          fbc: enrichedTourRequestData.fbc || undefined,
          clientUserAgent: enrichedTourRequestData.clientUserAgent || undefined,
          clientIpAddress: enrichedTourRequestData.clientIpAddress || undefined,
          eventSourceUrl: req.headers.referer || enrichedTourRequestData.landingPageUrl || undefined,
          utmSource: enrichedTourRequestData.utmSource || undefined,
          utmMedium: enrichedTourRequestData.utmMedium || undefined,
          utmCampaign: enrichedTourRequestData.utmCampaign || undefined,
          utmTerm: enrichedTourRequestData.utmTerm || undefined,
          utmContent: enrichedTourRequestData.utmContent || undefined,
        };

        // Send conversion asynchronously (don't block response)
        sendConversion(conversionPayload).catch(err => {
          console.error('[Tour Request] Failed to send Tier 1 conversion:', err);
        });
      } catch (conversionError) {
        console.error("Failed to prepare Tier 1 conversion:", conversionError);
        // Don't fail the request if conversion tracking fails
      }
      
      // Log successful submission
      logSecurityEvent({
        type: 'success',
        ip,
        userAgent,
        details: { transactionId, communityId: enrichedTourRequestData.communityId },
      });
      
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

  // Exit intent submission routes - Public endpoint for capturing exit intent emails
  app.post("/api/exit-intent-submissions", async (req, res) => {
    try {
      const validatedData = insertExitIntentSubmissionSchema.parse(req.body);
      
      // Add UTM tracking data from session
      const enrichedSubmissionData = {
        ...validatedData,
        utmSource: req.session.utm?.utm_source,
        utmMedium: req.session.utm?.utm_medium,
        utmCampaign: req.session.utm?.utm_campaign,
        utmTerm: req.session.utm?.utm_term,
        utmContent: req.session.utm?.utm_content,
      };
      
      const submission = await storage.createExitIntentSubmission(enrichedSubmissionData);
      
      // Send email notification to all active recipients
      try {
        await sendExitIntentSubmissionNotification(submission);
      } catch (emailError) {
        console.error("Failed to send exit intent submission notification:", emailError);
        // Don't fail the request if email fails
      }
      
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error creating exit intent submission:", error);
      res.status(400).json({ message: "Failed to create exit intent submission" });
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

  // Page content section routes
  app.get("/api/page-content", async (req, res) => {
    try {
      const { pagePath, active } = req.query;
      const sections = await storage.getPageContentSections(
        pagePath as string | undefined,
        active === 'true'
      );
      res.json(sections);
    } catch (error) {
      console.error("Error fetching page content sections:", error);
      res.status(500).json({ message: "Failed to fetch page content sections" });
    }
  });

  app.get("/api/page-content/:id", requireAuth, async (req, res) => {
    try {
      const section = await storage.getPageContentSection(req.params.id);
      if (!section) {
        return res.status(404).json({ message: "Page content section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Error fetching page content section:", error);
      res.status(500).json({ message: "Failed to fetch page content section" });
    }
  });

  app.post("/api/page-content", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPageContentSectionSchema.parse(req.body);
      const section = await storage.createPageContentSection(validatedData);
      res.status(201).json(section);
    } catch (error) {
      console.error("Error creating page content section:", error);
      res.status(400).json({ message: "Failed to create page content section" });
    }
  });

  app.put("/api/page-content/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPageContentSectionSchema.partial().parse(req.body);
      const section = await storage.updatePageContentSection(req.params.id, validatedData);
      res.json(section);
    } catch (error) {
      console.error("Error updating page content section:", error);
      res.status(400).json({ message: "Failed to update page content section" });
    }
  });

  app.delete("/api/page-content/:id", requireAuth, async (req, res) => {
    try {
      await storage.deletePageContentSection(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting page content section:", error);
      res.status(500).json({ message: "Failed to delete page content section" });
    }
  });

  // Landing page template routes
  app.get("/api/landing-page-templates", async (req, res) => {
    try {
      const { active, templateType, communityId } = req.query;
      const filters: any = {};
      
      if (active !== undefined) {
        filters.active = active === 'true';
      }
      if (templateType) {
        filters.templateType = templateType as string;
      }
      if (communityId) {
        filters.communityId = communityId as string;
      }
      
      const templates = await storage.getLandingPageTemplates(filters);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching landing page templates:", error);
      res.status(500).json({ message: "Failed to fetch landing page templates" });
    }
  });

  // Get all generated landing page URLs
  app.get("/api/landing-page-templates/all-urls", async (req, res) => {
    try {
      const templates = await storage.getLandingPageTemplates({ active: true });
      const urls: Array<{ url: string; title: string; templateSlug: string }> = [];
      
      templates.forEach((template) => {
        const pattern = template.urlPattern || '';
        const cities = template.cities || [];
        const title = template.title || '';
        
        // Handle templates with no dynamic parts (static landing pages)
        if (!pattern.includes(':')) {
          urls.push({
            url: pattern,
            title: title,
            templateSlug: template.slug
          });
          return;
        }
        
        // Handle city-based templates
        if (pattern.includes(':city') && cities.length > 0) {
          cities.forEach((city) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-');
            const url = pattern.replace(':city', citySlug);
            const expandedTitle = title.replace(/{city}/gi, city);
            urls.push({
              url,
              title: expandedTitle,
              templateSlug: template.slug
            });
          });
          return;
        }
        
        // Handle care level + city templates (e.g., /:careLevel/:city)
        if (pattern.includes(':careLevel') && pattern.includes(':city')) {
          const careLevels = ['assisted-living', 'memory-care', 'independent-living'];
          cities.forEach((city) => {
            careLevels.forEach((careLevel) => {
              const citySlug = city.toLowerCase().replace(/\s+/g, '-');
              const url = pattern
                .replace(':careLevel', careLevel)
                .replace(':city', citySlug);
              const expandedTitle = title
                .replace(/{city}/gi, city)
                .replace(/{careType}/gi, careLevel.replace(/-/g, ' '));
              urls.push({
                url,
                title: expandedTitle,
                templateSlug: template.slug
              });
            });
          });
          return;
        }
      });
      
      // Sort by URL
      urls.sort((a, b) => a.url.localeCompare(b.url));
      
      res.json(urls);
    } catch (error) {
      console.error("Error generating landing page URLs:", error);
      res.status(500).json({ message: "Failed to generate landing page URLs" });
    }
  });

  app.get("/api/landing-page-templates/resolve", async (req, res) => {
    try {
      const url = (req.query.url as string) || '/';
      
      if (!url) {
        return res.status(400).json({ message: "URL parameter is required" });
      }
      
      // Normalize URL: strip query params, decode URI, and remove trailing slashes
      // This ensures URLs with UTM tracking, encoded characters, and trailing slashes match correctly
      const cleanUrl = decodeURIComponent(url.split('?')[0]).replace(/\/+$/, '') || '/';
      
      // Fetch all active templates
      const templates = await storage.getLandingPageTemplates({ active: true });
      
      // Helper function to match URL against pattern and extract params
      const matchUrlPattern = (actualUrl: string, pattern: string): { match: boolean; params: Record<string, string> } => {
        const params: Record<string, string> = {};
        
        // Normalize pattern by removing trailing slashes
        const normalizedPattern = pattern.replace(/\/+$/, '') || '/';
        
        // Extract parameter names from pattern (e.g., :city, :careType)
        const paramNames: string[] = [];
        const regexPattern = normalizedPattern.replace(/:([^\/]+)/g, (_, paramName) => {
          paramNames.push(paramName);
          return '([^/]+)';
        });
        
        // Create regex from pattern
        const regex = new RegExp(`^${regexPattern}$`);
        const match = actualUrl.match(regex);
        
        if (!match) {
          return { match: false, params: {} };
        }
        
        // Extract parameter values
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        
        return { match: true, params };
      };
      
      // Try to match URL against each template's pattern using the cleaned URL
      for (const template of templates) {
        if (!template.urlPattern) continue;
        
        const { match, params } = matchUrlPattern(cleanUrl, template.urlPattern);
        
        if (match) {
          // Use the storage method to get the final template considering city matching
          const finalTemplate = await storage.getLandingPageTemplateByPattern(template.urlPattern, params);
          
          if (finalTemplate) {
            return res.json({ template: finalTemplate, params });
          }
        }
      }
      
      // No matching template found
      res.status(404).json({ message: "No matching template found for this URL" });
    } catch (error) {
      console.error("Error resolving landing page template:", error);
      res.status(500).json({ message: "Failed to resolve landing page template" });
    }
  });

  // Consolidated endpoint for landing pages - returns template + all required data in one request
  // Mirrors /api/communities/:slug/full pattern to reduce network waterfalls
  app.get("/api/landing-page-templates/resolve/full", async (req, res) => {
    try {
      const url = (req.query.url as string) || '/';

      if (!url) {
        return res.status(400).json({ message: "URL parameter is required" });
      }

      // Normalize URL: strip query params, decode URI, and remove trailing slashes
      const cleanUrl = decodeURIComponent(url.split('?')[0]).replace(/\/+$/, '') || '/';

      // Fetch all active templates
      const templates = await storage.getLandingPageTemplates({ active: true });

      // Helper function to match URL against pattern and extract params
      const matchUrlPattern = (actualUrl: string, pattern: string): { match: boolean; params: Record<string, string> } => {
        const params: Record<string, string> = {};

        // Normalize pattern by removing trailing slashes
        const normalizedPattern = pattern.replace(/\/+$/, '') || '/';

        // Extract parameter names from pattern (e.g., :city, :careType)
        const paramNames: string[] = [];
        const regexPattern = normalizedPattern.replace(/:([^\/]+)/g, (_, paramName) => {
          paramNames.push(paramName);
          return '([^/]+)';
        });

        // Create regex from pattern
        const regex = new RegExp(`^${regexPattern}$`);
        const match = actualUrl.match(regex);

        if (!match) {
          return { match: false, params: {} };
        }

        // Extract parameter values
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        return { match: true, params };
      };

      // Try to match URL against each template's pattern
      let matchedTemplate = null;
      let urlParams: Record<string, string> = {};

      for (const template of templates) {
        if (!template.urlPattern) continue;

        const { match, params } = matchUrlPattern(cleanUrl, template.urlPattern);

        if (match) {
          matchedTemplate = await storage.getLandingPageTemplateByPattern(template.urlPattern, params);
          urlParams = params;
          break;
        }
      }

      if (!matchedTemplate) {
        return res.status(404).json({ message: "No matching template found for this URL" });
      }

      // Fetch all communities
      const allCommunities = await storage.getCommunities({ activeOnly: true });

      // Determine primary community using same logic as client (DynamicLandingPage.tsx:416-467)
      let targetCommunities: any[] = [];

      if (matchedTemplate.communityId) {
        // Explicit community ID in template
        targetCommunities = allCommunities.filter(c => c.id === matchedTemplate.communityId);
      } else if (urlParams.city) {
        // Try to match by city name first
        const cityMatches = allCommunities.filter(c =>
          c.city.toLowerCase() === urlParams.city.toLowerCase()
        );

        if (cityMatches.length > 0) {
          targetCommunities = cityMatches;
        } else {
          // If no city match, try matching by slug
          const urlWords = urlParams.city.toLowerCase().split('-');
          const slugMatch = allCommunities.find(c => {
            const slugWords = c.slug.toLowerCase().split('-');
            const commonWords = ['the', 'at', 'on', 'in'];
            const significantUrlWords = urlWords.filter(w => !commonWords.includes(w));
            const significantSlugWords = slugWords.filter(w => !commonWords.includes(w));

            return significantUrlWords.some(urlWord =>
              significantSlugWords.some(slugWord =>
                urlWord.includes(slugWord) || slugWord.includes(urlWord)
              )
            );
          });

          if (slugMatch) {
            targetCommunities = [slugMatch];
          } else {
            // Fall back to template cities or all communities
            targetCommunities = matchedTemplate.cities?.length
              ? allCommunities.filter(c => matchedTemplate.cities?.includes(c.city))
              : allCommunities;
          }
        }
      } else if (matchedTemplate.cities?.length) {
        targetCommunities = allCommunities.filter(c => matchedTemplate.cities?.includes(c.city));
      } else {
        targetCommunities = allCommunities;
      }

      // For Arvada URLs without specific community, prefer Gardens on Quail
      const primaryCommunity = urlParams.city?.toLowerCase() === 'arvada' && targetCommunities.length > 1
        ? targetCommunities.find(c => c.slug === 'the-gardens-on-quail') || targetCommunities[0]
        : targetCommunities[0];

      if (!primaryCommunity) {
        return res.status(404).json({ message: "No community found for this landing page" });
      }

      // Conditionally fetch data based on template settings using Promise.all for parallel fetching
      const dataFetches: Promise<any>[] = [
        // Always fetch these
        storage.getCommunityHighlights(primaryCommunity.id),
        storage.getCommunityAmenities(primaryCommunity.id),
        storage.getCommunityCareTypes(primaryCommunity.id),
      ];

      // Conditionally fetch based on template flags
      if (matchedTemplate.showGallery) {
        dataFetches.push(storage.getGalleries({ communityId: primaryCommunity.id, active: true }));
      }
      if (matchedTemplate.showTestimonials) {
        dataFetches.push(storage.getTestimonials({ communityId: primaryCommunity.id, approved: true, featured: true }));
      }
      if (matchedTemplate.showTeamMembers) {
        dataFetches.push(storage.getAllTeamMembers());
      }
      if (matchedTemplate.showFaqs) {
        dataFetches.push(storage.getFaqs({ communityId: primaryCommunity.id, active: true }));
      }
      if (matchedTemplate.showFloorPlans) {
        dataFetches.push(storage.getFloorPlans({ communityId: primaryCommunity.id, active: true }));
      }

      const results = await Promise.all(dataFetches);

      // Map results to named properties
      let resultIndex = 0;
      const highlights = results[resultIndex++];
      const amenityIds = results[resultIndex++];
      const careTypeIds = results[resultIndex++];

      // Fetch full amenity and care type objects (same logic as /api/communities/:id/amenities)
      const [amenities, careTypes] = await Promise.all([
        Promise.all(
          amenityIds.map(async (id: string) => {
            const amenity = await storage.getAmenityById(id);
            return amenity;
          })
        ),
        Promise.all(
          careTypeIds.map(async (id: string) => {
            const careType = await storage.getCareTypeById(id);
            return careType;
          })
        ),
      ]);

      // Filter out undefined and inactive items
      const validAmenities = amenities.filter(a => a && a.active);
      const validCareTypes = careTypes.filter(ct => ct && ct.active);

      const responseData: any = {
        template: matchedTemplate,
        params: urlParams,
        primaryCommunity,
        allCommunities,
        highlights,
        amenities: validAmenities,
        careTypes: validCareTypes,
      };

      // Add optional data if it was fetched
      if (matchedTemplate.showGallery) {
        const galleries = results[resultIndex++];
        // Fetch images for each gallery and attach them (same as /api/galleries endpoint)
        const galleriesWithImages = await Promise.all(
          galleries.map(async (gallery: any) => {
            const images = await storage.getGalleryImagesByGalleryId(gallery.id);
            return {
              ...gallery,
              images: images
            };
          })
        );
        responseData.galleries = galleriesWithImages;
      }
      if (matchedTemplate.showTestimonials) {
        responseData.testimonials = results[resultIndex++];
      }
      if (matchedTemplate.showTeamMembers) {
        responseData.teamMembers = results[resultIndex++];
      }
      if (matchedTemplate.showFaqs) {
        responseData.faqs = results[resultIndex++];
      }
      if (matchedTemplate.showFloorPlans) {
        responseData.floorPlans = results[resultIndex++];
      }

      // Add cache headers for better performance
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      res.json(responseData);
    } catch (error) {
      console.error("Error fetching landing page full data:", error);
      res.status(500).json({ message: "Failed to fetch landing page data" });
    }
  });

  app.get("/api/landing-page-templates/:slug", async (req, res) => {
    try {
      const template = await storage.getLandingPageTemplate(req.params.slug);
      if (!template) {
        return res.status(404).json({ message: "Landing page template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching landing page template:", error);
      res.status(500).json({ message: "Failed to fetch landing page template" });
    }
  });

  app.post("/api/landing-page-templates", requireAuth, async (req, res) => {
    try {
      const validatedData = insertLandingPageTemplateSchema.parse(req.body);
      const template = await storage.createLandingPageTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating landing page template:", error);
      res.status(400).json({ message: "Failed to create landing page template" });
    }
  });

  app.put("/api/landing-page-templates/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertLandingPageTemplateSchema.partial().parse(req.body);
      const template = await storage.updateLandingPageTemplate(req.params.id, validatedData);
      if (!template) {
        return res.status(404).json({ message: "Landing page template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error updating landing page template:", error);
      res.status(400).json({ message: "Failed to update landing page template" });
    }
  });

  app.delete("/api/landing-page-templates/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteLandingPageTemplate(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting landing page template:", error);
      res.status(500).json({ message: "Failed to delete landing page template" });
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
  
  // Get highlights with optional filtering by communityId and active status
  app.get("/api/community-highlights", async (req, res) => {
    try {
      const { communityId, active } = req.query;
      
      if (communityId) {
        // Filter by community
        let highlights = await storage.getCommunityHighlights(communityId as string);
        
        // Further filter by active status if specified
        if (active !== undefined) {
          const isActive = active === 'true';
          highlights = highlights.filter(h => h.active === isActive);
        }
        
        res.json(highlights);
      } else {
        // Get all highlights (for admin)
        const highlights = await storage.getAllCommunityHighlights();
        res.json(highlights);
      }
    } catch (error) {
      console.error("Error fetching community highlights:", error);
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

  // Community amenities endpoint - returns full amenity objects for a community
  app.get("/api/communities/:id/amenities", async (req, res) => {
    try {
      const communityId = req.params.id;
      const amenityIds = await storage.getCommunityAmenities(communityId);
      
      // Fetch full amenity objects for each ID
      const amenities = await Promise.all(
        amenityIds.map(async (id) => {
          const amenity = await storage.getAmenityById(id);
          return amenity;
        })
      );
      
      // Filter out any undefined results and return only active amenities
      const validAmenities = amenities.filter(a => a && a.active);
      res.json(validAmenities);
    } catch (error) {
      console.error("Error fetching community amenities:", error);
      res.status(500).json({ message: "Failed to fetch community amenities" });
    }
  });

  // Community care types endpoint - returns full care type objects for a community
  app.get("/api/communities/:id/care-types", async (req, res) => {
    try {
      const communityId = req.params.id;
      const careTypeIds = await storage.getCommunityCareTypes(communityId);
      
      // Fetch full care type objects for each ID
      const careTypes = await Promise.all(
        careTypeIds.map(async (id) => {
          const careType = await storage.getCareTypeById(id);
          return careType;
        })
      );
      
      // Filter out any undefined results and return only active care types
      const validCareTypes = careTypes.filter(ct => ct && ct.active);
      res.json(validCareTypes);
    } catch (error) {
      console.error("Error fetching community care types:", error);
      res.status(500).json({ message: "Failed to fetch community care types" });
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

      // Cache for 5 minutes (public, so CDNs can cache too)
      // Use stale-while-revalidate for better performance
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');

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

      // Cache aggressively for individual page heroes (10 minutes)
      // These are static content that rarely changes
      res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=1200');

      // Add ETag based on updatedAt timestamp for conditional requests
      if (pageHero.updatedAt) {
        const etag = `"${new Date(pageHero.updatedAt).getTime()}"`;
        res.setHeader('ETag', etag);

        // Check if client has cached version
        if (req.headers['if-none-match'] === etag) {
          return res.status(304).send();
        }
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

  // Exit intent popup routes
  app.get("/api/exit-intent-popup", async (req, res) => {
    try {
      const popup = await storage.getExitIntentPopup();
      res.json(popup);
    } catch (error) {
      console.error("Error fetching exit intent popup:", error);
      res.status(500).json({ message: "Failed to fetch exit intent popup" });
    }
  });

  app.put("/api/exit-intent-popup", requireAuth, async (req, res) => {
    try {
      const validatedData = insertExitIntentPopupSchema.parse(req.body);
      const popup = await storage.updateExitIntentPopup(validatedData);
      res.json(popup);
    } catch (error) {
      console.error("Error updating exit intent popup:", error);
      res.status(400).json({ message: "Failed to update exit intent popup" });
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
      console.log(`[DELETE IMAGE] Starting deletion for image: ${imageId}`);
      const references = await storage.checkImageReferences(imageId);
      console.log(`[DELETE IMAGE] References found:`, references);
      
      if (references.length > 0) {
        // Image is in use - automatically unreference it instead of blocking deletion
        console.log(`[DELETE IMAGE] Image ${imageId} is referenced by ${references.length} entities. Unreferencing...`);
        await storage.unreferenceImage(imageId);
        console.log(`[DELETE IMAGE] Unreferencing complete. Verifying...`);
        
        // Verify references are cleared
        const remainingRefs = await storage.checkImageReferences(imageId);
        console.log(`[DELETE IMAGE] Remaining references after unreference:`, remainingRefs);
      }

      // Delete from object storage
      console.log(`[DELETE IMAGE] Deleting from object storage: ${image.objectKey}`);
      await deleteFromObjectStorage(image.objectKey);
      console.log(`[DELETE IMAGE] Object storage deletion complete`);
      
      // Delete from database
      console.log(`[DELETE IMAGE] Deleting from database: ${imageId}`);
      await storage.deleteImage(req.params.id);
      console.log(`[DELETE IMAGE] Database deletion complete`);
      
      res.status(204).send();
    } catch (error) {
      console.error("[DELETE IMAGE] Error deleting image:", error);
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

  // SQL-based Database Export (much simpler and reliable)
  app.get("/api/database/sql-export", requireAuth, async (req, res) => {
    try {
      const { generateSQLExport } = await import("./sql-export");
      const sqlContent = await generateSQLExport();
      
      // Send as SQL file
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="database-export.sql"');
      res.send(sqlContent);
      
    } catch (error) {
      console.error("Error exporting database:", error);
      res.status(500).json({ message: "Failed to export database" });
    }
  });

  // SQL Import endpoint
  app.post("/api/database/sql-import", requireAuth, async (req, res) => {
    try {
      const { sql } = req.body;
      if (!sql) {
        return res.status(400).json({ message: "No SQL provided" });
      }
      
      const { executeSQLImport } = await import("./sql-export");
      await executeSQLImport(sql);
      
      res.json({ message: "Database imported successfully" });
    } catch (error) {
      console.error("Error importing database:", error);
      res.status(500).json({ 
        message: "Failed to import database", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Database sync routes (for admin use) - Keep the old JSON ones for backwards compatibility
  app.get("/api/database/export", requireAuth, async (req, res) => {
    try {
      // Export all data from the database
      // Get all communities first to iterate through them
      const allCommunities = await storage.getCommunities();
      
      // Get all community-specific data
      let allCommunityFeatures: any[] = [];
      let allCommunityHighlights: any[] = [];
      let allFloorPlanImages: any[] = [];
      
      for (const community of allCommunities) {
        const features = await storage.getCommunityFeatures(community.id);
        const highlights = await storage.getCommunityHighlights(community.id);
        allCommunityFeatures = [...allCommunityFeatures, ...features];
        allCommunityHighlights = [...allCommunityHighlights, ...highlights];
      }

      const exportData = {
        communities: allCommunities,
        careTypes: await storage.getCareTypes(),
        amenities: await storage.getAmenities(),
        communitiesCareTypes: await storage.getAllCommunitiesCareTypes(),
        communitiesAmenities: await storage.getAllCommunitiesAmenities(),
        communityFeatures: await storage.getAllCommunityFeatures(),
        communityHighlights: await storage.getAllCommunityHighlights(),
        posts: await storage.getPosts(),
        blogPosts: await storage.getBlogPosts(),
        faqs: await storage.getFaqs(),
        events: await storage.getEvents(),
        galleries: await storage.getGalleries(),
        galleryImages: await storage.getAllGalleryImages(),
        testimonials: await storage.getTestimonials(),
        teamMembers: await storage.getAllTeamMembers(),
        emailRecipients: await storage.getEmailRecipients(),
        tourRequests: await storage.getTourRequests(),
        homepageConfig: [], // We'll handle this separately if needed
        homepageSections: await storage.getHomepageSections(),
        pageHeroes: await storage.getPageHeroes(),
        floorPlans: await storage.getFloorPlans(),
        floorPlanImages: [], // We'll handle this separately if needed  
        images: await storage.getImages(),
        exportedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      };

      res.json(exportData);
    } catch (error) {
      console.error("Error exporting database:", error);
      res.status(500).json({ message: "Failed to export database" });
    }
  });

  app.post("/api/database/import", requireAuth, async (req, res) => {
    try {
      const importData = req.body;
      const results: any = {};
      
      // Helper function to convert date strings to Date objects
      const convertDates = (obj: any): any => {
        if (!obj) return obj;
        if (obj instanceof Date) return obj;
        if (typeof obj === 'string') {
          // Check if it's a date string (ISO format)
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
            return new Date(obj);
          }
          return obj;
        }
        if (Array.isArray(obj)) {
          return obj.map(convertDates);
        }
        if (typeof obj === 'object') {
          const converted: any = {};
          for (const key in obj) {
            // Convert common date field names
            if (key === 'createdAt' || key === 'updatedAt' || key === 'created_at' || 
                key === 'updated_at' || key === 'publishedAt' || key === 'published_at' || 
                key === 'dateTime' || key === 'date' || key === 'startDate' || key === 'endDate') {
              converted[key] = obj[key] ? new Date(obj[key]) : obj[key];
            } else {
              converted[key] = convertDates(obj[key]);
            }
          }
          return converted;
        }
        return obj;
      };
      
      // STEP 1: Clear existing data (except users)
      // Delete in reverse order of dependencies to avoid foreign key conflicts
      
      // Clear dependent entities first
      // Delete blog posts and posts that reference communities
      const blogPosts = await storage.getBlogPosts();
      for (const post of blogPosts) {
        await storage.deleteBlogPost(post.id);
      }
      
      const posts = await storage.getPosts();
      for (const post of posts) {
        await storage.deletePost(post.id);
      }
      
      // Delete tour requests that reference communities
      const tourRequests = await storage.getTourRequests();
      for (const request of tourRequests) {
        await storage.deleteTourRequest(request.id);
      }
      
      const galleries = await storage.getGalleries();
      for (const gallery of galleries) {
        await storage.deleteGallery(gallery.id);
      }
      
      const events = await storage.getEvents();
      for (const event of events) {
        await storage.deleteEvent(event.id);
      }
      
      const faqs = await storage.getFaqs();
      for (const faq of faqs) {
        await storage.deleteFaq(faq.id);
      }
      
      const testimonials = await storage.getTestimonials();
      for (const testimonial of testimonials) {
        await storage.deleteTestimonial(testimonial.id);
      }
      
      const teamMembers = await storage.getAllTeamMembers();
      for (const member of teamMembers) {
        await storage.deleteTeamMember(member.id);
      }
      
      const emailRecipients = await storage.getEmailRecipients();
      for (const recipient of emailRecipients) {
        await storage.deleteEmailRecipient(recipient.id);
      }
      
      const pageHeroes = await storage.getPageHeroes();
      for (const hero of pageHeroes) {
        await storage.deletePageHero(hero.id);
      }
      
      const floorPlans = await storage.getFloorPlans();
      for (const plan of floorPlans) {
        await storage.deleteFloorPlan(plan.id);
      }
      
      const homepageSections = await storage.getHomepageSections();
      for (const section of homepageSections) {
        await storage.deleteHomepageSection(section.id);
      }
      
      // Clear community-dependent entities
      const communityFeatures = await storage.getAllCommunityFeatures();
      for (const feature of communityFeatures) {
        await storage.deleteCommunityFeature(feature.id);
      }
      
      const communityHighlights = await storage.getAllCommunityHighlights();
      for (const highlight of communityHighlights) {
        await storage.deleteCommunityHighlight(highlight.id);
      }
      
      // Clear communities and their relationships
      const communities = await storage.getCommunities();
      for (const community of communities) {
        await storage.setCommunityCareTypes(community.id, []); // Clear care type relationships
        await storage.setCommunityAmenities(community.id, []); // Clear amenity relationships
        await storage.deleteCommunity(community.id);
      }
      
      // Clear standalone entities
      const careTypes = await storage.getCareTypes();
      for (const careType of careTypes) {
        await storage.deleteCareType(careType.id);
      }
      
      const amenities = await storage.getAmenities();
      for (const amenity of amenities) {
        await storage.deleteAmenity(amenity.id);
      }
      
      // STEP 2: Import new data in order of dependencies
      // 1. First import standalone entities
      if (importData.careTypes) {
        for (const careType of importData.careTypes) {
          await storage.createCareType(convertDates(careType));
        }
        results.careTypes = importData.careTypes.length;
      }

      if (importData.amenities) {
        for (const amenity of importData.amenities) {
          await storage.createAmenity(convertDates(amenity));
        }
        results.amenities = importData.amenities.length;
      }

      if (importData.communities) {
        for (const community of importData.communities) {
          await storage.createCommunity(convertDates(community));
        }
        results.communities = importData.communities.length;
      }

      // 2. Import relationship tables
      if (importData.communitiesCareTypes) {
        // Group by community
        const careTypesByCommunity: Record<string, string[]> = {};
        for (const relation of importData.communitiesCareTypes) {
          if (!careTypesByCommunity[relation.communityId]) {
            careTypesByCommunity[relation.communityId] = [];
          }
          careTypesByCommunity[relation.communityId].push(relation.careTypeId);
        }
        // Set care types for each community
        for (const [communityId, careTypeIds] of Object.entries(careTypesByCommunity)) {
          await storage.setCommunityCareTypes(communityId, careTypeIds);
        }
        results.communitiesCareTypes = importData.communitiesCareTypes.length;
      }

      if (importData.communitiesAmenities) {
        // Group by community
        const amenitiesByCommunity: Record<string, string[]> = {};
        for (const relation of importData.communitiesAmenities) {
          if (!amenitiesByCommunity[relation.communityId]) {
            amenitiesByCommunity[relation.communityId] = [];
          }
          amenitiesByCommunity[relation.communityId].push(relation.amenityId);
        }
        // Set amenities for each community
        for (const [communityId, amenityIds] of Object.entries(amenitiesByCommunity)) {
          await storage.setCommunityAmenities(communityId, amenityIds);
        }
        results.communitiesAmenities = importData.communitiesAmenities.length;
      }

      // 3. Import dependent entities
      if (importData.communityFeatures) {
        for (const feature of importData.communityFeatures) {
          await storage.createCommunityFeature(convertDates(feature));
        }
        results.communityFeatures = importData.communityFeatures.length;
      }

      if (importData.communityHighlights) {
        for (const highlight of importData.communityHighlights) {
          await storage.createCommunityHighlight(convertDates(highlight));
        }
        results.communityHighlights = importData.communityHighlights.length;
      }

      if (importData.faqs) {
        for (const faq of importData.faqs) {
          await storage.createFaq(convertDates(faq));
        }
        results.faqs = importData.faqs.length;
      }

      if (importData.events) {
        for (const event of importData.events) {
          await storage.createEvent(convertDates(event));
        }
        results.events = importData.events.length;
      }

      if (importData.galleries) {
        for (const gallery of importData.galleries) {
          await storage.createGallery(convertDates(gallery));
        }
        results.galleries = importData.galleries.length;
      }

      if (importData.testimonials) {
        for (const testimonial of importData.testimonials) {
          await storage.createTestimonial(convertDates(testimonial));
        }
        results.testimonials = importData.testimonials.length;
      }

      if (importData.teamMembers) {
        for (const member of importData.teamMembers) {
          await storage.createTeamMember(convertDates(member));
        }
        results.teamMembers = importData.teamMembers.length;
      }

      if (importData.emailRecipients) {
        for (const recipient of importData.emailRecipients) {
          await storage.createEmailRecipient(convertDates(recipient));
        }
        results.emailRecipients = importData.emailRecipients.length;
      }

      if (importData.homepageConfig) {
        for (const config of importData.homepageConfig) {
          // Homepage config uses update method with sectionKey
          if (config.sectionKey) {
            await storage.updateHomepageConfig(config.sectionKey, convertDates(config));
          }
        }
        results.homepageConfig = importData.homepageConfig?.length || 0;
      }

      if (importData.homepageSections) {
        for (const section of importData.homepageSections) {
          await storage.createHomepageSection(convertDates(section));
        }
        results.homepageSections = importData.homepageSections.length;
      }

      if (importData.pageHeroes) {
        for (const hero of importData.pageHeroes) {
          await storage.createPageHero(convertDates(hero));
        }
        results.pageHeroes = importData.pageHeroes.length;
      }

      if (importData.floorPlans) {
        for (const plan of importData.floorPlans) {
          await storage.createFloorPlan(convertDates(plan));
        }
        results.floorPlans = importData.floorPlans.length;
      }

      if (importData.posts) {
        for (const post of importData.posts) {
          await storage.createPost(convertDates(post));
        }
        results.posts = importData.posts.length;
      }

      if (importData.blogPosts) {
        for (const post of importData.blogPosts) {
          await storage.createBlogPost(convertDates(post));
        }
        results.blogPosts = importData.blogPosts.length;
      }

      res.json({ 
        message: "Database import completed successfully", 
        results,
        importedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error importing database:", error);
      res.status(500).json({ message: "Failed to import database", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Error handler for upload middleware
  app.use(handleUploadError);

  const httpServer = createServer(app);
  return httpServer;
}
