import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import ImageUploader from "@/components/ImageUploader";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import {
  insertCommunitySchema,
  insertPostSchema,
  insertEventSchema,
  insertFaqSchema,
  insertGallerySchema,
  insertTestimonialSchema,
  insertPageHeroSchema,
  insertFloorPlanSchema,
  type Community,
  type Post,
  type Event,
  type TourRequest,
  type Faq,
  type Gallery,
  type Testimonial,
  type PageHero,
  type FloorPlan,
  type InsertCommunity,
  type InsertPost,
  type InsertEvent,
  type InsertFaq,
  type InsertGallery,
  type InsertTestimonial,
  type InsertPageHero,
  type InsertFloorPlan,
} from "@shared/schema";

interface AdminDashboardProps {
  type: "communities" | "posts" | "events" | "tours" | "faqs" | "galleries" | "testimonials" | "page-heroes" | "floor-plans";
}

// FloorPlanImageManager Component for managing floor plan gallery images
function FloorPlanImageManager({ floorPlanId }: { floorPlanId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch floor plan images
  const { data: images = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/floor-plans", floorPlanId, "images"],
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      return await apiRequest("DELETE", `/api/floor-plans/${floorPlanId}/images/${imageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/floor-plans", floorPlanId, "images"] });
      toast({
        title: "Image Removed",
        description: "The image has been removed from the floor plan.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove the image.",
        variant: "destructive",
      });
    },
  });

  // Update sort order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ imageId, sortOrder }: { imageId: string; sortOrder: number }) => {
      const updates = images.map((img) => ({
        imageId: img.imageId,
        sortOrder: img.imageId === imageId ? sortOrder : img.sortOrder,
      }));
      return await apiRequest("PUT", `/api/floor-plans/${floorPlanId}/images/order`, { updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/floor-plans", floorPlanId, "images"] });
    },
  });

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const image = images[index];
    const prevImage = images[index - 1];
    updateOrderMutation.mutate({ imageId: image.imageId, sortOrder: prevImage.sortOrder - 1 });
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const image = images[index];
    const nextImage = images[index + 1];
    updateOrderMutation.mutate({ imageId: image.imageId, sortOrder: nextImage.sortOrder + 1 });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No gallery images yet. Upload images using the uploader above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image: any, index: number) => (
          <div key={image.id} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={image.imageUrl || image.url}
                alt={image.caption || "Floor plan gallery image"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {index > 0 && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleMoveUp(index)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              )}
              {index < images.length - 1 && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleMoveDown(index)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteImageMutation.mutate(image.imageId)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {image.caption && (
              <p className="mt-2 text-sm text-muted-foreground truncate">{image.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard({ type }: AdminDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isFetchingImages, setIsFetchingImages] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isLoadingGalleryImages, setIsLoadingGalleryImages] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Map type to API endpoint (handle tour-requests special case)
  const getApiEndpoint = (type: string) => {
    return type === "tours" ? "tour-requests" : type;
  };

  const apiEndpoint = getApiEndpoint(type);

  // Fetch data based on type
  const { data: items = [], isLoading } = useQuery({
    queryKey: [`/api/${apiEndpoint}`],
  });

  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    enabled: type !== "communities",
  });

  // Forms for different types
  const communityForm = useForm<InsertCommunity>({
    resolver: zodResolver(insertCommunitySchema),
    defaultValues: {
      name: "",
      slug: "",
      street: "",
      city: "",
      state: "CO",
      zip: "",
      zipCode: "", // Backward compatibility
      latitude: null,
      longitude: null,
      lat: null, // Additional field from CSV
      lng: null, // Additional field from CSV
      phoneDisplay: "",
      phoneDial: "",
      secondaryPhoneDisplay: "",
      secondaryPhoneDial: "",
      phone: "", // Backward compatibility
      email: "",
      heroImageUrl: "",
      overview: "",
      description: "",
      shortDescription: "",
      address: "", // Backward compatibility
      startingRateDisplay: "",
      startingPrice: null,
      mainColorHex: "",
      ctaColorHex: "",
      seoTitle: "",
      seoDescription: "",
      seoDesc: "", // Additional field from CSV
      careTypes: [],
      amenities: [],
      active: true,
      featured: false,
    },
  });

  const postForm = useForm<InsertPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      heroImageUrl: "",
      tags: [],
      communityId: undefined,
      published: false,
      seoTitle: "",
      seoDescription: "",
    },
  });

  const eventForm = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      description: "",
      imageUrl: "",
      startsAt: new Date(),
      endsAt: undefined,
      locationText: "",
      rsvpUrl: "",
      communityId: undefined,
      published: false,
      maxAttendees: undefined,
      isPublic: true,
    },
  });

  const faqForm = useForm<InsertFaq>({
    resolver: zodResolver(insertFaqSchema),
    defaultValues: {
      question: "",
      answer: "",
      answerHtml: "",
      category: "",
      communityId: undefined,
      sortOrder: 0,
      active: true,
    },
  });

  const galleryForm = useForm<InsertGallery>({
    resolver: zodResolver(insertGallerySchema),
    defaultValues: {
      title: "",
      gallerySlug: "",
      description: "",
      images: [],
      tags: [],
      category: "",
      communityId: undefined,
      thumbnailIndex: undefined,
      hero: false,
      published: false,
      active: true,
    },
  });

  const testimonialForm = useForm<InsertTestimonial>({
    resolver: zodResolver(insertTestimonialSchema),
    defaultValues: {
      authorName: "",
      authorRelation: "",
      content: "",
      rating: 5,
      communityId: undefined,
      featured: false,
      approved: true,
      sortOrder: 0,
    },
  });

  const pageHeroForm = useForm<InsertPageHero>({
    resolver: zodResolver(insertPageHeroSchema),
    defaultValues: {
      pagePath: "",
      title: "",
      subtitle: "",
      description: "",
      backgroundImageUrl: "",
      ctaText: "",
      ctaLink: "",
      overlayOpacity: "0.5",
      textAlignment: "center",
      active: true,
      sortOrder: 0,
    },
  });

  const floorPlanForm = useForm<InsertFloorPlan>({
    resolver: zodResolver(insertFloorPlanSchema),
    defaultValues: {
      name: "",
      planSlug: "",
      communityId: undefined,
      bedrooms: 1,
      bathrooms: "1",
      squareFeet: null,
      description: "",
      highlights: [],
      imageUrl: "",
      planImageUrl: "",
      startingPrice: null,
      startingRateDisplay: "",
      availability: "available",
      sortOrder: 0,
      active: true,
    },
  });

  // Get current form based on type
  const getCurrentForm = () => {
    switch (type) {
      case "communities": return communityForm;
      case "posts": return postForm;
      case "events": return eventForm;
      case "faqs": return faqForm;
      case "galleries": return galleryForm;
      case "testimonials": return testimonialForm;
      case "page-heroes": return pageHeroForm;
      case "floor-plans": return floorPlanForm;
      default: return communityForm;
    }
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", `/api/${apiEndpoint}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${apiEndpoint}`] });
      setIsDialogOpen(false);
      getCurrentForm().reset();
      toast({
        title: "Success",
        description: `${type.slice(0, -1)} created successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to create ${type.slice(0, -1)}.`,
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PUT", `/api/${apiEndpoint}/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${apiEndpoint}`] });
      setIsDialogOpen(false);
      setEditingItem(null);
      getCurrentForm().reset();
      toast({
        title: "Success",
        description: `${type.slice(0, -1)} updated successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to update ${type.slice(0, -1)}.`,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/${apiEndpoint}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${apiEndpoint}`] });
      toast({
        title: "Success",
        description: `${type.slice(0, -1)} deleted successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to delete ${type.slice(0, -1)}.`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    // For communities, normalize lat/lng fields
    if (type === "communities") {
      // If lat/lng are provided but not latitude/longitude, copy them
      if (data.lat !== null && data.lat !== undefined && !data.latitude) {
        data.latitude = data.lat;
      }
      if (data.lng !== null && data.lng !== undefined && !data.longitude) {
        data.longitude = data.lng;
      }
      // If latitude/longitude are provided but not lat/lng, copy them
      if (data.latitude !== null && data.latitude !== undefined && !data.lat) {
        data.lat = data.latitude;
      }
      if (data.longitude !== null && data.longitude !== undefined && !data.lng) {
        data.lng = data.longitude;
      }
    }
    // For floor plans, ensure planSlug is set to name if not provided
    if (type === "floor-plans" && !data.planSlug && data.name) {
      data.planSlug = data.name.toLowerCase().replace(/\s+/g, '-');
    }
    // For galleries, ensure gallerySlug is set to title if not provided
    if (type === "galleries" && !data.gallerySlug && data.title) {
      data.gallerySlug = data.title.toLowerCase().replace(/\s+/g, '-');
    }
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
    // For communities, normalize lat/lng fields when editing
    if (type === "communities") {
      // If lat/lng exist but latitude/longitude don't, copy them
      if (item.lat && !item.latitude) {
        item.latitude = item.lat;
      }
      if (item.lng && !item.longitude) {
        item.longitude = item.lng;
      }
      // If latitude/longitude exist but lat/lng don't, copy them
      if (item.latitude && !item.lat) {
        item.lat = item.latitude;
      }
      if (item.longitude && !item.lng) {
        item.lng = item.longitude;
      }
    }
    
    // For galleries, ensure images field is properly set and fetch gallery images
    if (type === "galleries") {
      setEditingItem(item);
      setIsLoadingGalleryImages(true);
      
      // First, reset the form with existing data
      const galleryData = {
        title: item.title || "",
        gallerySlug: item.gallerySlug || "",
        communityId: item.communityId || undefined,
        description: item.description || "",
        // Start with empty images, will be populated from API
        images: [],
        tags: item.tags || [],
        category: item.category || "",
        hero: item.hero || false,
        published: item.published || false,
        active: item.active !== false,
        thumbnailIndex: item.thumbnailIndex || null
      };
      galleryForm.reset(galleryData);
      
      // Fetch gallery images from the gallery_images table
      if (item.id) {
        fetch(`/api/galleries/${item.id}/images`, {
          credentials: 'include'
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Failed to fetch gallery images');
          })
          .then(images => {
            setGalleryImages(images);
            // Set the images in the form
            const imageUrls = images.map((img: any) => ({
              url: img.imageUrl || img.url,
              alt: img.alt || '',
              caption: img.caption || ''
            }));
            galleryForm.setValue('images', imageUrls);
          })
          .catch(error => {
            console.error('Error fetching gallery images:', error);
            toast({
              title: "Error",
              description: "Failed to fetch gallery images",
              variant: "destructive",
            });
            // Fallback to the original images if they exist
            if (item.images) {
              galleryForm.setValue('images', item.images);
            }
          })
          .finally(() => {
            setIsLoadingGalleryImages(false);
          });
      } else {
        setIsLoadingGalleryImages(false);
      }
      
      setIsDialogOpen(true);
      return;
    }
    
    setEditingItem(item);
    getCurrentForm().reset(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    getCurrentForm().reset();
    setGalleryImages([]);
    setIsDialogOpen(true);
  };

  // Render form based on type
  const renderForm = () => {
    switch (type) {
      case "communities":
        return (
          <Form {...communityForm}>
            <form onSubmit={communityForm.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={communityForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-community-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={communityForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-community-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={communityForm.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} data-testid="input-community-street" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={communityForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-community-city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={communityForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-community-state" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={communityForm.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} data-testid="input-community-zip" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={communityForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} value={field.value || ""} data-testid="input-community-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={communityForm.control}
                  name="phoneDisplay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone (Display)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="(303) 555-0100" data-testid="input-community-phone-display" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={communityForm.control}
                  name="phoneDial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone (Dial)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="3035550100" data-testid="input-community-phone-dial" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={communityForm.control}
                  name="secondaryPhoneDisplay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Phone (Display)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="(303) 555-0200" data-testid="input-community-secondary-phone-display" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={communityForm.control}
                  name="secondaryPhoneDial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Phone (Dial)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="3035550200" data-testid="input-community-secondary-phone-dial" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={communityForm.control}
                  name="startingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} data-testid="input-community-starting-price" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={communityForm.control}
                  name="startingRateDisplay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Rate Display</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="From $3,500/month" data-testid="input-community-starting-rate-display" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={communityForm.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || ""} 
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} 
                          step="0.00000001"
                          data-testid="input-community-latitude" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={communityForm.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || ""} 
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} 
                          step="0.00000001"
                          data-testid="input-community-longitude" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={communityForm.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} data-testid="textarea-community-short-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={communityForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={6} data-testid="textarea-community-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={communityForm.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overview</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} rows={4} data-testid="textarea-community-overview" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={communityForm.control}
                name="heroImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Upload hero image for the community"
                        maxSize={10 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={communityForm.control}
                  name="mainColorHex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Color (Hex)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="#000000" data-testid="input-community-main-color" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={communityForm.control}
                  name="ctaColorHex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Color (Hex)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="#FF0000" data-testid="input-community-cta-color" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={communityForm.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} data-testid="input-community-seo-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={communityForm.control}
                name="seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} rows={3} data-testid="textarea-community-seo-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={communityForm.control}
                name="seoDesc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Description (Alternative)</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} rows={2} placeholder="Alternative SEO description from CSV import" data-testid="textarea-community-seo-desc" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-4">
                <FormField
                  control={communityForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-community-active" />
                      </FormControl>
                      <FormLabel>Active</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={communityForm.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-community-featured" />
                      </FormControl>
                      <FormLabel>Featured</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit">
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        );

      case "posts":
        return (
          <Form {...postForm}>
            <form onSubmit={postForm.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={postForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-post-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={postForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-post-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={postForm.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} value={field.value || "none"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-post-community">
                          <SelectValue placeholder="Select a community (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No specific community</SelectItem>
                        {communities.map((community) => (
                          <SelectItem key={community.id} value={community.id}>
                            {community.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={postForm.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea {...field} data-testid="textarea-post-summary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={postForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={10} data-testid="textarea-post-content" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={postForm.control}
                name="heroImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Upload hero image for the blog post"
                        maxSize={10 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={postForm.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="SEO optimized title for search engines" data-testid="input-post-seo-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={postForm.control}
                name="seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} rows={3} placeholder="Meta description for search engines (150-160 characters recommended)" data-testid="textarea-post-seo-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={postForm.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-post-published" />
                    </FormControl>
                    <FormLabel>Published</FormLabel>
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit">
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        );

      case "events":
        return (
          <Form {...eventForm}>
            <form onSubmit={eventForm.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={eventForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-event-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={eventForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-event-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={eventForm.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community (Optional)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} value={field.value || "none"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-event-community">
                          <SelectValue placeholder="Select a community" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No specific community</SelectItem>
                        {communities.map((community) => (
                          <SelectItem key={community.id} value={community.id}>
                            {community.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={eventForm.control}
                  name="startsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date & Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field} 
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""} 
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          data-testid="input-event-start"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={eventForm.control}
                  name="endsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date & Time (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field} 
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""} 
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                          data-testid="input-event-end"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={eventForm.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} data-testid="textarea-event-summary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={eventForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} rows={4} data-testid="textarea-event-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={eventForm.control}
                  name="locationText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location/Venue</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="e.g., Main Dining Room" data-testid="input-event-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={eventForm.control}
                  name="maxAttendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Attendees (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || ""} 
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          data-testid="input-event-max-attendees" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={eventForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Image</FormLabel>
                      <FormControl>
                        <ImageUploader
                          value={field.value || undefined}
                          onChange={field.onChange}
                          label="Upload image for the event"
                          maxSize={10 * 1024 * 1024}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={eventForm.control}
                  name="rsvpUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RSVP URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="https://example.com/rsvp" data-testid="input-event-rsvp" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center space-x-4">
                <FormField
                  control={eventForm.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-event-published" />
                      </FormControl>
                      <FormLabel>Published</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={eventForm.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-event-public" />
                      </FormControl>
                      <FormLabel>Public Event</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit">
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        );

      case "faqs":
        return (
          <Form {...faqForm}>
            <form onSubmit={faqForm.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={faqForm.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-faq-question" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={faqForm.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} data-testid="textarea-faq-answer" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={faqForm.control}
                name="answerHtml"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer HTML (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value || ""} 
                        rows={4} 
                        placeholder="Optional HTML formatted answer for rich text content" 
                        data-testid="textarea-faq-answer-html" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={faqForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-faq-category" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={faqForm.control}
                  name="communityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} 
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-faq-community">
                            <SelectValue placeholder="Select a community" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">General/All Communities</SelectItem>
                          {communities.map((community) => (
                            <SelectItem key={community.id} value={community.id}>
                              {community.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={faqForm.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || 0} 
                        onChange={(e) => field.onChange(Number(e.target.value))} 
                        data-testid="input-faq-sort" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={faqForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-faq-active" />
                    </FormControl>
                    <FormLabel>Active</FormLabel>
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit">
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        );

      case "testimonials":
        return (
          <Form {...testimonialForm}>
            <form onSubmit={testimonialForm.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={testimonialForm.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-testimonial-author" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={testimonialForm.control}
                  name="authorRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Relation</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Daughter, Son, Spouse" data-testid="input-testimonial-relation" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={testimonialForm.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} 
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-testimonial-community">
                          <SelectValue placeholder="Select a community" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">General/All Communities</SelectItem>
                        {communities.map((community) => (
                          <SelectItem key={community.id} value={community.id}>
                            {community.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={testimonialForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testimonial Content</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={6} data-testid="textarea-testimonial-content" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={testimonialForm.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (1-5)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || 5} 
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                          min="1" 
                          max="5"
                          data-testid="input-testimonial-rating" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={testimonialForm.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || 0} 
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                          data-testid="input-testimonial-sort" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center space-x-4">
                <FormField
                  control={testimonialForm.control}
                  name="approved"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-testimonial-approved" />
                      </FormControl>
                      <FormLabel>Approved</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={testimonialForm.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-testimonial-featured" />
                      </FormControl>
                      <FormLabel>Featured</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit">
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        );

      case "page-heroes":
        return (
          <Form {...pageHeroForm}>
            <form onSubmit={pageHeroForm.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={pageHeroForm.control}
                name="pagePath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Path</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-page-path">
                          <SelectValue placeholder="Select a page" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="/">Homepage (/)</SelectItem>
                        <SelectItem value="/about-us">About Us</SelectItem>
                        <SelectItem value="/blog">Blog</SelectItem>
                        <SelectItem value="/services">Services</SelectItem>
                        <SelectItem value="/services/management">Management Services</SelectItem>
                        <SelectItem value="/stage-cares">Stage Cares</SelectItem>
                        <SelectItem value="/communities">Communities</SelectItem>
                        <SelectItem value="/care-points">Care Points</SelectItem>
                        <SelectItem value="/events">Events</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={pageHeroForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-hero-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={pageHeroForm.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} data-testid="input-hero-subtitle" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={pageHeroForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} rows={3} data-testid="textarea-hero-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={pageHeroForm.control}
                name="backgroundImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Upload background image for the page hero"
                        maxSize={10 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={pageHeroForm.control}
                  name="ctaText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Text</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="Learn More" data-testid="input-cta-text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={pageHeroForm.control}
                  name="ctaLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Link</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="/contact" data-testid="input-cta-link" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={pageHeroForm.control}
                  name="overlayOpacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overlay Opacity</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || "0.5"} type="number" step="0.1" min="0" max="1" data-testid="input-overlay-opacity" />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Controls the darkness of the background overlay (0 = transparent, 1 = solid black)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={pageHeroForm.control}
                  name="textAlignment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Alignment</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "center"}>
                        <FormControl>
                          <SelectTrigger data-testid="select-text-alignment">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="left">Left (Content aligned to left side)</SelectItem>
                          <SelectItem value="center">Center (Content centered on page)</SelectItem>
                          <SelectItem value="right">Right (Content aligned to right side)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Aligns the hero text content horizontally on the page
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={pageHeroForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-hero-active" />
                    </FormControl>
                    <FormLabel>Active</FormLabel>
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit">
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        );

      case "galleries":
        return (
          <Form {...galleryForm}>
            <form onSubmit={galleryForm.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={galleryForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-gallery-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={galleryForm.control}
                  name="gallerySlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gallery Slug</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          placeholder="url-friendly-name" 
                          data-testid="input-gallery-slug" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={galleryForm.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} 
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-gallery-community">
                          <SelectValue placeholder="Select a community" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">General/All Communities</SelectItem>
                        {communities.map((community) => (
                          <SelectItem key={community.id} value={community.id}>
                            {community.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={galleryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value || ""} 
                        rows={3} 
                        data-testid="textarea-gallery-description" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={galleryForm.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gallery Images</FormLabel>
                    {isLoadingGalleryImages ? (
                      <p className="text-sm text-muted-foreground">Loading existing images...</p>
                    ) : editingItem && galleryImages.length > 0 ? (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Existing Gallery Images ({galleryImages.length})</h4>
                        <div className="grid grid-cols-4 gap-4">
                          {galleryImages.map((image: any, index: number) => (
                            <div key={image.id} className="relative group">
                              <img 
                                src={image.imageUrl || image.url} 
                                alt={image.alt || `Gallery image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-md border"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={async () => {
                                  if (confirm('Are you sure you want to remove this image from the gallery?')) {
                                    try {
                                      const response = await apiRequest(
                                        'DELETE',
                                        `/api/galleries/${editingItem.id}/images/${image.id}`
                                      );
                                      
                                      // Remove from local state
                                      setGalleryImages(galleryImages.filter(img => img.id !== image.id));
                                      
                                      // Update form value
                                      const currentImages = galleryForm.getValues('images') || [];
                                      const updatedImages = currentImages.filter(
                                        (img: any) => (img.url || img) !== (image.imageUrl || image.url)
                                      );
                                      galleryForm.setValue('images', updatedImages);
                                      
                                      toast({
                                        title: "Success",
                                        description: "Image removed from gallery",
                                      });
                                    } catch (error) {
                                      console.error('Error deleting gallery image:', error);
                                      toast({
                                        title: "Error",
                                        description: "Failed to remove image from gallery",
                                        variant: "destructive",
                                      });
                                    }
                                  }
                                }}
                                data-testid={`button-delete-gallery-image-${image.id}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                              {image.sortOrder !== undefined && (
                                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                                  #{image.sortOrder + 1}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <FormControl>
                      <ImageUploader
                        value={field.value ? (Array.isArray(field.value) && field.value.length > 0 && typeof field.value[0] === 'object' ? field.value.map((img: any) => img.url || img) : field.value) : []}
                        onChange={async (imageIds) => {
                          if (Array.isArray(imageIds) && imageIds.length > 0) {
                            setIsFetchingImages(true);
                            try {
                              const imagesToFetch = [];
                              const existingImages = [];
                              
                              // Separate URLs from IDs
                              for (const item of imageIds) {
                                if (typeof item === 'string' && (item.startsWith('http://') || item.startsWith('https://'))) {
                                  // Already a URL, use as-is
                                  existingImages.push({ url: item, alt: '', caption: '' });
                                } else {
                                  // It's an ID, needs fetching
                                  imagesToFetch.push(item);
                                }
                              }
                              
                              // Fetch details only for IDs
                              if (imagesToFetch.length > 0) {
                                const imagePromises = imagesToFetch.map(id => 
                                  fetch(`/api/images/${id}`, { 
                                    credentials: 'include',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    }
                                  }).then(r => {
                                    if (!r.ok) throw new Error(`Failed to fetch image ${id}`);
                                    return r.json();
                                  })
                                );
                                
                                const fetchedImages = await Promise.all(imagePromises);
                                
                                // Combine with existing URLs
                                const allImages = [
                                  ...existingImages,
                                  ...fetchedImages.map((img: any) => ({
                                    url: img.url || img.secureUrl || '',
                                    alt: img.alt || img.originalName || '',
                                    caption: '',
                                    width: img.width || undefined,
                                    height: img.height || undefined
                                  }))
                                ];
                                
                                field.onChange(allImages);
                              } else {
                                field.onChange(existingImages);
                              }
                            } catch (error) {
                              console.error('Error fetching some images:', error);
                              toast({
                                title: "Error fetching images",
                                description: "Failed to load some image details. Using URLs directly.",
                                variant: "destructive",
                              });
                              // Fallback: treat all as URLs
                              field.onChange(imageIds.map(id => ({ 
                                url: id, 
                                alt: '', 
                                caption: '' 
                              })));
                            } finally {
                              setIsFetchingImages(false);
                            }
                          } else {
                            field.onChange([]);
                          }
                        }}
                        multiple={true}
                        label="Upload images for the gallery"
                        maxSize={10 * 1024 * 1024}
                        maxFiles={20}
                        disabled={isFetchingImages}
                        // Gallery-specific props
                        showDelete={true}
                        showReorder={true}
                        showThumbnailSelector={true}
                        thumbnailIndex={galleryForm.watch('thumbnailIndex')}
                        onThumbnailChange={(index) => galleryForm.setValue('thumbnailIndex', index)}
                        onReorder={(reorderedImages) => {
                          field.onChange(reorderedImages.map(url => ({ 
                            url, 
                            alt: field.value?.find((img: any) => img.url === url)?.alt || '', 
                            caption: field.value?.find((img: any) => img.url === url)?.caption || '' 
                          })));
                        }}
                      />
                    </FormControl>
                    {isFetchingImages && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Loading image details...
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={galleryForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input 
                        value={field.value?.join(', ') || ''}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                          field.onChange(tags);
                        }}
                        placeholder="nature, landscape, community"
                        data-testid="input-gallery-tags"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={galleryForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value || ""} 
                        placeholder="e.g., Facilities, Activities, Residents"
                        data-testid="input-gallery-category" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center space-x-4">
                <FormField
                  control={galleryForm.control}
                  name="hero"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-gallery-hero" />
                      </FormControl>
                      <FormLabel>Hero Gallery</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={galleryForm.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-gallery-published" />
                      </FormControl>
                      <FormLabel>Published</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={galleryForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-gallery-active" />
                      </FormControl>
                      <FormLabel>Active</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit">
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        );

      case "floor-plans":
        return (
          <Form {...floorPlanForm}>
            <form onSubmit={floorPlanForm.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={floorPlanForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Studio Apartment" data-testid="input-floor-plan-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={floorPlanForm.control}
                  name="planSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="Auto-generated from name" data-testid="input-floor-plan-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={floorPlanForm.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger data-testid="select-floor-plan-community">
                          <SelectValue placeholder="Select a community" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {communities.map((community) => (
                          <SelectItem key={community.id} value={community.id}>
                            {community.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={floorPlanForm.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || 0} 
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                          min="0"
                          data-testid="input-floor-plan-bedrooms" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={floorPlanForm.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., 1.5"
                          data-testid="input-floor-plan-bathrooms" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={floorPlanForm.control}
                  name="squareFeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Feet</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || ""} 
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                          placeholder="e.g., 850"
                          data-testid="input-floor-plan-square-feet" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={floorPlanForm.control}
                  name="startingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Price</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || ""} 
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                          placeholder="e.g., 2500"
                          data-testid="input-floor-plan-price" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={floorPlanForm.control}
                  name="startingRateDisplay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Rate Display</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          placeholder="e.g., Starting at $2,500/mo"
                          data-testid="input-floor-plan-rate-display" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={floorPlanForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor Plan Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Upload floor plan image"
                        maxSize={10 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Floor Plan Gallery Images */}
              {editingItem && (
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Gallery Images</h3>
                    <p className="text-sm text-muted-foreground">Additional images for this floor plan</p>
                  </div>
                  
                  {/* Image Uploader for multiple gallery images */}
                  <ImageUploader
                    multiple={true}
                    label="Upload gallery images"
                    maxSize={10 * 1024 * 1024}
                    onUpload={async (images) => {
                      // Add each uploaded image to the floor plan
                      for (const imageData of images) {
                        try {
                          await apiRequest("POST", `/api/floor-plans/${editingItem.id}/images`, {
                            imageId: imageData.id,
                            caption: "",
                            sortOrder: 0
                          });
                        } catch (error) {
                          console.error("Failed to add image to floor plan:", error);
                        }
                      }
                      // Refresh the floor plan images
                      queryClient.invalidateQueries({ queryKey: ["/api/floor-plans", editingItem.id, "images"] });
                      toast({
                        title: "Images Added",
                        description: `Successfully added ${images.length} image(s) to the floor plan.`,
                      });
                    }}
                  />
                  
                  {/* Display existing floor plan images */}
                  <FloorPlanImageManager floorPlanId={editingItem.id} />
                </div>
              )}
              
              <FormField
                control={floorPlanForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value || ""} 
                        rows={4}
                        placeholder="Describe the floor plan features..."
                        data-testid="textarea-floor-plan-description" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={floorPlanForm.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "available"}>
                        <FormControl>
                          <SelectTrigger data-testid="select-floor-plan-availability">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="limited">Limited</SelectItem>
                          <SelectItem value="unavailable">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={floorPlanForm.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || 0} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-floor-plan-sort" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={floorPlanForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-floor-plan-active" />
                    </FormControl>
                    <FormLabel>Active</FormLabel>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit">
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        );

      default:
        return <div>Form not implemented for {type}</div>;
    }
  };

  // Render table based on type
  const renderTable = () => {
    // Communities table
    if (type === "communities") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Starting Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: Community) => (
              <TableRow key={item.id} data-testid={`community-row-${item.id}`}>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.slug}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start space-x-1">
                    <MapPin className="w-3 h-3 mt-0.5 text-muted-foreground" />
                    <div className="text-sm">
                      <div>{item.street || 'No street'}</div>
                      <div>{item.city}, {item.state} {item.zip || item.zipCode || ''}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {item.phoneDisplay && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{item.phoneDisplay}</span>
                      </div>
                    )}
                    {item.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{item.email}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {item.startingRateDisplay || (item.startingPrice ? `$${item.startingPrice.toLocaleString()}` : 'Not set')}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={item.active ? "default" : "secondary"}>
                      {item.active ? "Active" : "Inactive"}
                    </Badge>
                    {item.featured && (
                      <Badge variant="outline">Featured</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(item)}
                      data-testid={`button-edit-${item.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(item.id)}
                      data-testid={`button-delete-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (type === "tours") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: TourRequest) => {
              const community = communities.find(c => c.id === item.communityId);
              return (
                <TableRow key={item.id} data-testid={`tour-row-${item.id}`}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{community?.name || "General"}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "pending" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" asChild data-testid={`button-call-${item.id}`}>
                        <a href={`tel:${item.phone}`}>
                          <Phone className="w-4 h-4" />
                        </a>
                      </Button>
                      {item.email && (
                        <Button size="sm" variant="outline" asChild data-testid={`button-email-${item.id}`}>
                          <a href={`mailto:${item.email}`}>
                            <Mail className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(item.id)}
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }

    // Floor Plans table
    if (type === "floor-plans") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Beds/Baths</TableHead>
              <TableHead>Sq. Ft.</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: FloorPlan) => {
              const community = communities.find(c => c.id === item.communityId);
              return (
                <TableRow key={item.id} data-testid={`floor-plan-row-${item.id}`}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{community?.name || "N/A"}</TableCell>
                  <TableCell>
                    {item.bedrooms} BR / {item.bathrooms} BA
                  </TableCell>
                  <TableCell>{item.squareFeet ? `${item.squareFeet.toLocaleString()} sq ft` : "N/A"}</TableCell>
                  <TableCell>
                    {item.startingRateDisplay || (item.startingPrice ? `$${item.startingPrice.toLocaleString()}` : "N/A")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant={item.active ? "default" : "secondary"}>
                        {item.active ? "Active" : "Inactive"}
                      </Badge>
                      {item.availability && item.availability !== "available" && (
                        <Badge variant="outline">
                          {item.availability}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(item)}
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(item.id)}
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }

    // Events table
    if (type === "events") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Max Attendees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: Event) => {
              const community = communities.find(c => c.id === item.communityId);
              return (
                <TableRow key={item.id} data-testid={`event-row-${item.id}`}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {item.title}
                  </TableCell>
                  <TableCell>
                    {community?.name || "General"}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {item.locationText || "TBD"}
                  </TableCell>
                  <TableCell>
                    {new Date(item.startsAt).toLocaleDateString()} {new Date(item.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell>
                    {item.endsAt ? `${new Date(item.endsAt).toLocaleDateString()} ${new Date(item.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "N/A"}
                  </TableCell>
                  <TableCell>
                    {item.maxAttendees || "Unlimited"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={item.published ? "default" : "secondary"}>
                        {item.published ? "Published" : "Draft"}
                      </Badge>
                      <Badge variant={item.isPublic ? "outline" : "destructive"}>
                        {item.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(item)}
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(item.id)}
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }

    // Blog Posts table
    if (type === "posts") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: Post) => {
              const community = communities.find(c => c.id === item.communityId);
              return (
                <TableRow key={item.id} data-testid={`post-row-${item.id}`}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {item.title}
                  </TableCell>
                  <TableCell>
                    {community?.name || "General"}
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {item.summary || "No summary"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.published ? "default" : "secondary"}>
                      {item.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(item)}
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(item.id)}
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }

    // Galleries table
    if (type === "galleries") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: Gallery) => {
              const community = communities.find(c => c.id === item.communityId);
              return (
                <TableRow key={item.id} data-testid={`gallery-row-${item.id}`}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {item.title}
                  </TableCell>
                  <TableCell>
                    {community?.name || "General"}
                  </TableCell>
                  <TableCell>
                    {item.category || "Uncategorized"}
                  </TableCell>
                  <TableCell>
                    {item.images?.length || 0} images
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={item.active ? "default" : "secondary"}>
                        {item.active ? "Active" : "Inactive"}
                      </Badge>
                      {item.published && (
                        <Badge variant="outline">Published</Badge>
                      )}
                      {item.hero && (
                        <Badge variant="outline">Hero</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(item)}
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(item.id)}
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }

    // FAQs table
    if (type === "faqs") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: Faq) => {
              const community = communities.find(c => c.id === item.communityId);
              return (
                <TableRow key={item.id} data-testid={`faq-row-${item.id}`}>
                  <TableCell className="font-medium max-w-[300px]">
                    <div className="space-y-1">
                      <div className="font-semibold truncate">{item.question}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {item.answerHtml ? "Has HTML answer" : item.answer?.substring(0, 100)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {community?.name || "General"}
                  </TableCell>
                  <TableCell>
                    {item.category || "General"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.active ? "default" : "secondary"}>
                      {item.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.sortOrder || 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(item)}
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(item.id)}
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }

    // Testimonials table
    if (type === "testimonials") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: Testimonial) => {
              const community = communities.find(c => c.id === item.communityId);
              return (
                <TableRow key={item.id} data-testid={`testimonial-row-${item.id}`}>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="font-semibold">{item.authorName}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.authorRelation}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {community?.name || "General"}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="truncate">
                      {item.content.substring(0, 100)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < item.rating ? "text-yellow-500" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={item.approved ? "default" : "secondary"}>
                        {item.approved ? "Approved" : "Pending"}
                      </Badge>
                      {item.featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(item)}
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(item.id)}
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }

    // Page Heroes table
    if (type === "page-heroes") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Subtitle</TableHead>
              <TableHead>CTA</TableHead>
              <TableHead>Settings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: PageHero) => (
              <TableRow key={item.id} data-testid={`page-hero-row-${item.id}`}>
                <TableCell className="font-medium">
                  <Badge variant="outline" className="font-mono">
                    {item.pagePath}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="truncate font-semibold">{item.title}</div>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="truncate text-sm text-muted-foreground">
                    {item.subtitle || "No subtitle"}
                  </div>
                </TableCell>
                <TableCell>
                  {item.ctaText ? (
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{item.ctaText}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {item.ctaLink || "No link"}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No CTA</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Align:</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.textAlignment || "center"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Overlay:</span>
                      <span className="font-mono">{item.overlayOpacity || "0.5"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={item.active ? "default" : "secondary"}>
                    {item.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(item)}
                      data-testid={`button-edit-${item.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(item.id)}
                      data-testid={`button-delete-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    // Generic table for other types
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name/Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: any) => (
            <TableRow key={item.id} data-testid={`${type}-row-${item.id}`}>
              <TableCell className="font-medium">
                {item.name || item.title || item.question}
              </TableCell>
              <TableCell>
                {type === "communities" && (
                  <div className="flex items-center space-x-2">
                    {item.active ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                    {item.featured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                )}
                {type === "posts" && (
                  <Badge variant={item.published ? "default" : "secondary"}>
                    {item.published ? "Published" : "Draft"}
                  </Badge>
                )}
                {type === "events" && (
                  <Badge variant={item.isPublic ? "default" : "secondary"}>
                    {item.isPublic ? "Public" : "Private"}
                  </Badge>
                )}
                {type === "faqs" && (
                  <Badge variant={item.active ? "default" : "secondary"}>
                    {item.active ? "Active" : "Inactive"}
                  </Badge>
                )}
                {type === "galleries" && (
                  <Badge variant={item.active ? "default" : "secondary"}>
                    {item.active ? "Active" : "Inactive"}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {new Date(item.createdAt || item.startsAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(item)}
                    data-testid={`button-edit-${item.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(item.id)}
                    data-testid={`button-delete-${item.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const getTitle = () => {
    switch (type) {
      case "communities": return "Communities";
      case "posts": return "Blog Posts";
      case "events": return "Events";
      case "tours": return "Tour Requests";
      case "faqs": return "FAQs";
      case "galleries": return "Galleries";
      case "testimonials": return "Testimonials";
      case "page-heroes": return "Page Heroes";
      case "floor-plans": return "Floor Plans";
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid={`${type}-title`}>{getTitle()}</CardTitle>
          {type !== "tours" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} data-testid={`button-add-${type}`}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {type.slice(0, -1)}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle data-testid={`dialog-title-${type}`}>
                    {editingItem ? "Edit" : "Create"} {type.slice(0, -1)}
                  </DialogTitle>
                </DialogHeader>
                {renderForm()}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8" data-testid={`${type}-loading`}>
            Loading...
          </div>
        ) : items.length > 0 ? (
          renderTable()
        ) : (
          <div className="text-center py-8 text-muted-foreground" data-testid={`${type}-empty`}>
            No {type} found. Create your first one to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
