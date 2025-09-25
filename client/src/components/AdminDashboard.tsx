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
  type Community,
  type Post,
  type Event,
  type TourRequest,
  type Faq,
  type Gallery,
  type Testimonial,
  type InsertCommunity,
  type InsertPost,
  type InsertEvent,
  type InsertFaq,
  type InsertGallery,
  type InsertTestimonial,
} from "@shared/schema";

interface AdminDashboardProps {
  type: "communities" | "posts" | "events" | "tours" | "faqs" | "galleries" | "testimonials";
}

export default function AdminDashboard({ type }: AdminDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
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
      latitude: null,
      longitude: null,
      phoneDisplay: "",
      phoneDial: "",
      secondaryPhoneDisplay: "",
      secondaryPhoneDial: "",
      email: "",
      heroImageUrl: "",
      overview: "",
      description: "",
      shortDescription: "",
      startingRateDisplay: "",
      startingPrice: null,
      mainColorHex: "",
      ctaColorHex: "",
      seoTitle: "",
      seoDescription: "",
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
      tags: [],
      published: false,
    },
  });

  const eventForm = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      description: "",
      startsAt: new Date(),
      isPublic: true,
    },
  });

  const faqForm = useForm<InsertFaq>({
    resolver: zodResolver(insertFaqSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "",
      sortOrder: 0,
      active: true,
    },
  });

  const galleryForm = useForm<InsertGallery>({
    resolver: zodResolver(insertGallerySchema),
    defaultValues: {
      title: "",
      description: "",
      images: [],
      category: "",
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
      featured: false,
      approved: true,
      sortOrder: 0,
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
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
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
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={communityForm.control}
                  name="phoneDisplay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Display</FormLabel>
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
                      <FormLabel>Phone Dial</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="3035550100" data-testid="input-community-phone-dial" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={communityForm.control}
                  name="startingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} data-testid="input-community-price" />
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
                    <FormLabel>Hero Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="https://..." data-testid="input-community-hero-image" />
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
                    <FormLabel>Community (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger data-testid="select-post-community">
                          <SelectValue placeholder="Select a community" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">No specific community</SelectItem>
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
                    <FormLabel>Community</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger data-testid="select-event-community">
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
                      <Textarea {...field} data-testid="textarea-event-summary" />
                    </FormControl>
                    <FormMessage />
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
                      <Textarea {...field} rows={6} data-testid="textarea-faq-answer" />
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
                      <FormLabel>Community (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger data-testid="select-faq-community">
                            <SelectValue placeholder="All communities" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">All Communities</SelectItem>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger data-testid="select-testimonial-community">
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

      default:
        return <div>Form not implemented for {type}</div>;
    }
  };

  // Render table based on type
  const renderTable = () => {
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
