import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import ImageUploader from "@/components/ImageUploader";
import DocumentUploader from "@/components/DocumentUploader";
import RichTextEditor from "@/components/RichTextEditor";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Loader2,
  Star,
  Settings,
  Download,
  Filter,
  Search,
  FileText,
  ArrowRight,
  User
} from "lucide-react";
import { format } from "date-fns";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import {
  insertCommunitySchema,
  insertPostSchema,
  insertBlogPostSchema,
  insertEventSchema,
  insertFaqSchema,
  insertGallerySchema,
  insertTestimonialSchema,
  insertPageHeroSchema,
  insertFloorPlanSchema,
  insertCareTypeSchema,
  insertAmenitySchema,
  insertTourRequestSchema,
  insertCommunityHighlightSchema,
  insertCommunityFeatureSchema,
  insertTeamMemberSchema,
  type Community,
  type CommunityHighlight,
  type InsertCommunityHighlight,
  type CommunityFeature,
  type InsertCommunityFeature,
  type TeamMember,
  type InsertTeamMember,
  type Post,
  type BlogPost,
  type Event,
  type TourRequest,
  type InsertTourRequest,
  type Faq,
  type Gallery,
  type Testimonial,
  type PageHero,
  type FloorPlan,
  type CareType,
  type Amenity,
  type InsertCommunity,
  type InsertPost,
  type InsertBlogPost,
  type InsertEvent,
  type InsertFaq,
  type InsertGallery,
  type InsertTestimonial,
  type InsertPageHero,
  type InsertFloorPlan,
  type InsertCareType,
  type InsertAmenity,
} from "@shared/schema";

interface AdminDashboardProps {
  type: "communities" | "posts" | "blog-posts" | "team" | "events" | "tours" | "faqs" | "galleries" | "testimonials" | "page-heroes" | "floor-plans" | "care-types" | "amenities" | "community-highlights";
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Predefined authors list (fallback when no team members exist)
const FALLBACK_AUTHORS = [
  "Stage Senior Team",
  "Community Director",
  "Healthcare Team",
  "Activities Coordinator",
  "Guest Contributor"
];

// Blog categories
const BLOG_CATEGORIES = [
  "news",
  "events",
  "health",
  "lifestyle",
  "community-spotlight"
];

// Predefined blog tags
const PREDEFINED_BLOG_TAGS = [
  "Newsletter",
  "Community Update",
  "Events",
  "Health & Wellness",
  "Activities",
  "Announcements"
];

// Amenity categories
const AMENITY_CATEGORIES = [
  "wellness",
  "dining",
  "social",
  "services",
  "safety",
  "comfort"
];

// Common Lucide icon names
const COMMON_ICONS = [
  "Home",
  "Heart",
  "Users",
  "Coffee",
  "Wifi",
  "Car",
  "Activity",
  "BookOpen",
  "Shield",
  "Sparkles",
  "Utensils",
  "Music",
  "Palette",
  "Sun",
  "Moon",
  "Star",
  "Dumbbell",
  "Trees",
  "Phone",
  "MapPin"
];

// Predefined tags for team members
const PREDEFINED_TAGS = {
  communities: [
    "The Gardens at Columbine",
    "The Gardens on Quail",
    "Golden Pond",
    "Stonebridge Senior"
  ],
  departments: [
    "Stage Management",
    "Medical Care",
    "Administration",
    "Activities",
    "Dining",
    "Maintenance",
    "Housekeeping"
  ]
};

import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, X } from "lucide-react";

// BlogPostTagInput component for managing blog post tags with predefined tags
const BlogPostTagInput = ({ value, onChange, dataTestId }: {
  value: string[];
  onChange: (tags: string[]) => void;
  dataTestId?: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue("");
  };
  
  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };
  
  return (
    <div className="space-y-3">
      {/* Predefined tags as clickable buttons */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Quick add tags:</p>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_BLOG_TAGS.map((tag) => (
            <Button
              key={tag}
              type="button"
              variant={value.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (value.includes(tag)) {
                  removeTag(tag);
                } else {
                  addTag(tag);
                }
              }}
              className={tag === "Newsletter" && value.includes(tag) ? "bg-destructive hover:bg-destructive/90" : ""}
              data-testid={`button-tag-preset-${tag.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {value.includes(tag) && <Check className="w-3 h-3 mr-1" />}
              {tag}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Selected tags display */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Selected tags:</p>
        <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border rounded-md bg-muted/10">
          {value.length === 0 ? (
            <span className="text-sm text-muted-foreground">No tags selected</span>
          ) : (
            value.map((tag, index) => (
              <Badge 
                key={index} 
                variant={tag === "Newsletter" ? "destructive" : "secondary"}
                className="flex items-center gap-1 px-2 py-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-secondary-foreground/20 rounded-full p-0.5 ml-1"
                  data-testid={`button-remove-tag-${index}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>
      
      {/* Custom tag input */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Add custom tag:</p>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a custom tag and press Enter"
            className="flex-1"
            data-testid={dataTestId || "input-custom-tag"}
          />
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => {
              if (inputValue.trim()) {
                addTag(inputValue);
              }
            }}
            disabled={!inputValue.trim()}
            data-testid="button-add-custom-tag"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

// TagInput component for managing tags with suggestions
const TagInput = ({ value, onChange, placeholder, dataTestId }: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  dataTestId?: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const allSuggestions = [
    ...PREDEFINED_TAGS.communities,
    ...PREDEFINED_TAGS.departments
  ];
  
  const filteredSuggestions = allSuggestions.filter(suggestion => 
    !value.includes(suggestion) &&
    suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );
  
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue("");
    setIsOpen(false);
  };
  
  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md">
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2 py-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-secondary-foreground/20 rounded-full p-0.5"
              data-testid={`button-remove-tag-${index}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || "Type to add tags..."}
              className="flex-1 min-w-[200px] border-0 px-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              data-testid={dataTestId}
            />
          </PopoverTrigger>
          {isOpen && filteredSuggestions.length > 0 && (
            <PopoverContent className="p-0" align="start" side="bottom">
              <Command>
                <CommandGroup heading="Suggestions">
                  {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => addTag(suggestion)}
                    >
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          )}
        </Popover>
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <div>Communities: {PREDEFINED_TAGS.communities.join(", ")}</div>
        <div>Departments: {PREDEFINED_TAGS.departments.join(", ")}</div>
      </div>
    </div>
  );
};

// Sub-component for gallery images to use the image resolution hook
const GalleryImageItem = ({ image, index, onMoveUp, onMoveDown, onDelete, showControls = true, totalImages = 0 }: {
  image: any;
  index: number;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onDelete?: () => void;
  showControls?: boolean;
  totalImages?: number;
}) => {
  const resolvedImageUrl = useResolveImageUrl(image.imageUrl || image.url);
  
  return (
    <div className="relative group">
      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
        {resolvedImageUrl && (
          <img
            src={resolvedImageUrl}
            alt={image.caption || image.alt || `Gallery image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      {showControls && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {index > 0 && onMoveUp && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onMoveUp(index)}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
          {index < totalImages - 1 && onMoveDown && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onMoveDown(index)}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={onDelete}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      {image.caption && (
        <p className="mt-2 text-sm text-muted-foreground truncate">{image.caption}</p>
      )}
    </div>
  );
};

// Sub-component for existing gallery images in form
const ExistingGalleryImage = ({ image, index, onDelete }: {
  image: any;
  index: number;
  onDelete: () => void;
}) => {
  const resolvedImageUrl = useResolveImageUrl(image.imageUrl || image.url);
  
  return (
    <div className="relative group">
      {resolvedImageUrl && (
        <img 
          src={resolvedImageUrl} 
          alt={image.alt || `Gallery image ${index + 1}`}
          className="w-full h-24 object-cover rounded-md border"
        />
      )}
      <Button
        type="button"
        size="sm"
        variant="destructive"
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
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
  );
};

// TourRequestsTable Component for managing tour requests with lead management features
function TourRequestsTable({ items, communities }: { items: TourRequest[]; communities: Community[] }) {
  const [selectedRequest, setSelectedRequest] = useState<TourRequest | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [communityFilter, setCommunityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Mutation for updating tour request
  const updateTourRequest = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertTourRequest> }) => {
      return apiRequest("PUT", `/api/tour-requests/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tour-requests"] });
      toast({
        title: "Success",
        description: "Tour request updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update tour request",
        variant: "destructive",
      });
    },
  });

  // Mutation for deleting tour request
  const deleteTourRequest = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/tour-requests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tour-requests"] });
      toast({
        title: "Success",
        description: "Tour request deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete tour request",
        variant: "destructive",
      });
    },
  });

  // Get status color for badges
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-500 text-white",
      contacted: "bg-yellow-500 text-white",
      scheduled: "bg-purple-500 text-white",
      toured: "bg-cyan-500 text-white",
      "follow-up": "bg-orange-500 text-white",
      converted: "bg-green-500 text-white",
      "not-interested": "bg-gray-500 text-white",
    };
    return colors[status] || "bg-gray-400 text-white";
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCommunity = communityFilter === "all" || item.communityId === communityFilter;
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.phone.includes(searchQuery);
    
    return matchesStatus && matchesCommunity && matchesSearch;
  });

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Community", "Status", "Notes", "Preferred Date", "Scheduled Date", "Last Contacted", "Submitted Date"];
    const rows = filteredItems.map(item => {
      const community = communities.find(c => c.id === item.communityId);
      return [
        item.name,
        item.email || "",
        item.phone,
        community?.name || "General",
        item.status || "new",
        item.notes || "",
        item.preferredDate ? new Date(item.preferredDate).toLocaleDateString() : "",
        item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : "",
        item.lastContactedAt ? new Date(item.lastContactedAt).toLocaleDateString() : "",
        new Date(item.createdAt).toLocaleDateString(),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tour-requests-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: `Exported ${filteredItems.length} tour requests to CSV`,
    });
  };

  // Handle quick status update
  const handleQuickStatusUpdate = async (id: string, status: string) => {
    const updates: Partial<InsertTourRequest> = { status };
    
    // Update lastContactedAt when status changes to contacted
    if (status === "contacted") {
      updates.lastContactedAt = new Date();
    }

    updateTourRequest.mutate({ id, data: updates });
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tour request?")) {
      deleteTourRequest.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
              data-testid="input-search-tours"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48" data-testid="select-status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="toured">Toured</SelectItem>
              <SelectItem value="follow-up">Follow Up</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="not-interested">Not Interested</SelectItem>
            </SelectContent>
          </Select>
          <Select value={communityFilter} onValueChange={setCommunityFilter}>
            <SelectTrigger className="w-48" data-testid="select-community-filter">
              <SelectValue placeholder="Filter by community" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Communities</SelectItem>
              {communities.map(community => (
                <SelectItem key={community.id} value={community.id}>
                  {community.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={exportToCSV} variant="outline" data-testid="button-export-csv">
          <Download className="w-4 h-4 mr-2" />
          Export to CSV
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Community</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => {
            const community = communities.find(c => c.id === item.communityId);
            return (
              <TableRow key={item.id} data-testid={`tour-row-${item.id}`}>
                <TableCell className="font-medium">
                  <div>
                    <div>{item.name}</div>
                    {item.email && (
                      <div className="text-sm text-muted-foreground">{item.email}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{community?.name || "General"}</TableCell>
                <TableCell>
                  <Select
                    value={item.status || "new"}
                    onValueChange={(value) => handleQuickStatusUpdate(item.id, value)}
                  >
                    <SelectTrigger className="w-32 border-0" data-testid={`select-status-${item.id}`}>
                      <Badge className={cn("w-full justify-center", getStatusColor(item.status || "new"))}>
                        {item.status || "new"}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="toured">Toured</SelectItem>
                      <SelectItem value="follow-up">Follow Up</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="not-interested">Not Interested</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div>Submitted: {new Date(item.createdAt).toLocaleDateString()}</div>
                    {item.preferredDate && (
                      <div>Preferred: {new Date(item.preferredDate).toLocaleDateString()}</div>
                    )}
                    {item.scheduledDate && (
                      <div className="font-medium">Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}</div>
                    )}
                    {item.lastContactedAt && (
                      <div className="text-muted-foreground">Last Contact: {new Date(item.lastContactedAt).toLocaleDateString()}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(item);
                        setIsEditModalOpen(true);
                      }}
                      data-testid={`button-edit-${item.id}`}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tour Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <TourRequestEditForm
              request={selectedRequest}
              communities={communities}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedRequest(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Tour Request Edit Form Component
function TourRequestEditForm({ 
  request, 
  communities, 
  onClose 
}: { 
  request: TourRequest; 
  communities: Community[]; 
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Partial<InsertTourRequest>>({
    resolver: zodResolver(insertTourRequestSchema.partial()),
    defaultValues: {
      status: request.status || "new",
      notes: request.notes || "",
      scheduledDate: request.scheduledDate ? new Date(request.scheduledDate) : undefined,
    },
  });

  const onSubmit = async (data: Partial<InsertTourRequest>) => {
    setIsSubmitting(true);
    try {
      // Update lastContactedAt if status changes to contacted
      if (data.status === "contacted" && request.status !== "contacted") {
        data.lastContactedAt = new Date();
      }

      await apiRequest("PUT", `/api/tour-requests/${request.id}`, data);

      await queryClient.invalidateQueries({ queryKey: ["/api/tour-requests"] });
      
      toast({
        title: "Success",
        description: "Tour request updated successfully",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tour request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const community = communities.find(c => c.id === request.communityId);

  return (
    <div className="space-y-6">
      {/* Read-only Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <div className="font-medium">{request.name}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Phone</label>
            <div className="font-medium">{request.phone}</div>
          </div>
          {request.email && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="font-medium">{request.email}</div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Community</label>
            <div className="font-medium">{community?.name || "General"}</div>
          </div>
          {request.preferredDate && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Preferred Date</label>
              <div className="font-medium">{new Date(request.preferredDate).toLocaleDateString()}</div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Submitted</label>
            <div className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        {request.message && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Message</label>
            <div className="mt-1 p-3 bg-muted rounded-md">{request.message}</div>
          </div>
        )}
      </div>

      <Separator />

      {/* Editable Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="toured">Toured</SelectItem>
                    <SelectItem value="follow-up">Follow Up</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="not-interested">Not Interested</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Scheduled Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select the scheduled tour date
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Internal Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add internal notes about this lead..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  These notes are for internal tracking only
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Tour Request"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
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
          <GalleryImageItem
            key={image.id}
            image={image}
            index={index}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onDelete={() => deleteImageMutation.mutate(image.imageId)}
            totalImages={images.length}
          />
        ))}
      </div>
    </div>
  );
}

// Component to show download button for blog post attachments
function BlogPostAttachmentButton({ postId }: { postId: string }) {
  const [attachment, setAttachment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch attachment data when component mounts
  useEffect(() => {
    setLoading(true);
    fetch(`/api/post-attachments?postId=${postId}`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then(attachments => {
        if (attachments && attachments.length > 0) {
          setAttachment(attachments[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);
  
  if (loading) {
    return null;
  }
  
  if (!attachment) {
    return null;
  }
  
  const handleDownload = () => {
    // Create a download link
    const link = document.createElement('a');
    link.href = attachment.fileUrl;
    link.download = attachment.fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleDownload}
      title={`Download ${attachment.fileName}`}
      data-testid={`button-download-${postId}`}
    >
      <FileText className="w-4 h-4" />
    </Button>
  );
}

export default function AdminDashboard({ type }: AdminDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isFetchingImages, setIsFetchingImages] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isLoadingGalleryImages, setIsLoadingGalleryImages] = useState(false);
  const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCommunityForHighlights, setSelectedCommunityForHighlights] = useState<string | null>(null);
  const [selectedCommunityForFeatures, setSelectedCommunityForFeatures] = useState<string | null>(null);
  const [isFeaturesDialogOpen, setIsFeaturesDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<CommunityFeature | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Map type to API endpoint (handle special cases)
  const getApiEndpoint = (type: string) => {
    if (type === "tours") return "tour-requests";
    if (type === "team") return "team-members";
    if (type === "community-highlights") {
      // For community highlights, we need to select a community first
      return selectedCommunityForHighlights ? `communities/${selectedCommunityForHighlights}/highlights` : "community-highlights";
    }
    return type;
  };

  const apiEndpoint = getApiEndpoint(type);

  // Fetch data based on type
  const { data: items = [], isLoading } = useQuery({
    queryKey: [`/api/${apiEndpoint}`],
  });

  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    enabled: type !== "communities" || type === "community-highlights",
  });

  // Fetch care types and amenities for multi-select
  const { data: allCareTypes = [] } = useQuery<CareType[]>({
    queryKey: ["/api/care-types"],
    enabled: type === "communities",
  });

  const { data: allAmenities = [] } = useQuery<Amenity[]>({
    queryKey: ["/api/amenities"],
    enabled: type === "communities",
  });

  // Fetch team members for author selection in blog posts
  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
    enabled: type === "blog-posts" || type === "team",
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
      logoImageId: "",
      contactImageId: "",
      brochureImageId: "",
      experienceImageId: "",
      fitnessImageId: "",
      privateDiningImageId: "",
      calendarFile1Id: "",
      calendarFile1ButtonText: "",
      calendarFile2Id: "",
      calendarFile2ButtonText: "",
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

  const communityHighlightForm = useForm<InsertCommunityHighlight>({
    resolver: zodResolver(insertCommunityHighlightSchema),
    defaultValues: {
      title: "",
      description: "",
      imageId: undefined,
      ctaLabel: "",
      ctaHref: "",
      communityId: selectedCommunityForHighlights || undefined,
      sortOrder: 0,
      active: true,
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

  const blogPostForm = useForm<InsertBlogPost & { attachmentId?: string }>({
    resolver: zodResolver(insertBlogPostSchema.extend({
      attachmentId: z.string().optional(),
    })),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      summary: "",
      author: "Stage Senior Team",
      category: "news",
      tags: [],
      featured: false,
      published: false,
      publishedAt: new Date(),
      mainImage: undefined,
      thumbnailImage: undefined,
      galleryImages: [],
      communityId: undefined,
      attachmentId: undefined,
    },
  });

  const careTypeForm = useForm<InsertCareType>({
    resolver: zodResolver(insertCareTypeSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      sortOrder: 0,
      active: true,
    },
  });

  const amenityForm = useForm<InsertAmenity>({
    resolver: zodResolver(insertAmenitySchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      description: "",
      icon: "",
      imageUrl: "",
      sortOrder: 0,
      active: true,
    },
  });

  const teamMemberForm = useForm<InsertTeamMember>({
    resolver: zodResolver(insertTeamMemberSchema),
    defaultValues: {
      name: "",
      slug: "",
      role: "",
      department: "",
      bio: "",
      avatarImageId: undefined,
      email: "",
      phone: "",
      linkedinUrl: "",
      twitterUrl: "",
      tags: [],
      sortOrder: 0,
      featured: false,
      active: true,
    },
  });

  // Get current form based on type
  const getCurrentForm = () => {
    switch (type) {
      case "communities": return communityForm;
      case "posts": return postForm;
      case "blog-posts": return blogPostForm;
      case "team": return teamMemberForm;
      case "events": return eventForm;
      case "faqs": return faqForm;
      case "galleries": return galleryForm;
      case "testimonials": return testimonialForm;
      case "page-heroes": return pageHeroForm;
      case "floor-plans": return floorPlanForm;
      case "care-types": return careTypeForm;
      case "amenities": return amenityForm;
      case "community-highlights": return communityHighlightForm;
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
    onError: async (error: any) => {
      // Check if the error response has a 409 status (conflict)
      if (error.message && error.message.includes('409')) {
        toast({
          title: "Already Exists",
          description: type === 'page-heroes' 
            ? "A hero section already exists for this page. Please edit the existing hero instead."
            : `This ${type.slice(0, -1)} already exists. Please edit the existing item instead.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to create ${type.slice(0, -1)}.`,
          variant: "destructive",
        });
      }
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
    onError: async (error: any) => {
      // Check if the error response has a 409 status (conflict)
      if (error.message && error.message.includes('409')) {
        toast({
          title: "Already Exists",
          description: type === 'page-heroes'
            ? "A hero section already exists for this page. Please choose a different page."
            : `This ${type.slice(0, -1)} already exists with these values.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to update ${type.slice(0, -1)}.`,
          variant: "destructive",
        });
      }
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
    // For care types, generate slug if not provided
    if (type === "care-types") {
      if (!data.slug && data.name) {
        data.slug = generateSlug(data.name);
      }
    }
    // For amenities, generate slug if not provided
    if (type === "amenities") {
      if (!data.slug && data.name) {
        data.slug = generateSlug(data.name);
      }
    }
    // For communities, normalize lat/lng fields and add relationships
    if (type === "communities") {
      // Add care type and amenity relationships
      data.careTypeIds = selectedCareTypes;
      data.amenityIds = selectedAmenities;
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
    // For blog posts, generate slug if not provided
    if (type === "blog-posts") {
      if (!data.slug && data.title) {
        data.slug = generateSlug(data.title);
      }
      // Tags are already an array from the BlogPostTagInput component
      // Ensure it's an array (defensive programming)
      if (!Array.isArray(data.tags)) {
        data.tags = [];
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
      
      // Set selected care types and amenities
      setSelectedCareTypes(item.careTypeIds || []);
      setSelectedAmenities(item.amenityIds || []);
    }
    
    // For blog posts, ensure tags remain as array and fetch attachment if exists
    if (type === "blog-posts") {
      const blogPostData = {
        ...item,
        tags: Array.isArray(item.tags) ? item.tags : [],
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
        attachmentId: undefined, // Will be set if attachment exists
      };
      
      // Fetch attachment ID if post has an attachment
      if (item.id) {
        fetch(`/api/post-attachments?postId=${item.id}`, {
          credentials: 'include'
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            return [];
          })
          .then(attachments => {
            if (attachments && attachments.length > 0) {
              blogPostData.attachmentId = attachments[0].id;
              blogPostForm.setValue('attachmentId', attachments[0].id);
            }
          })
          .catch(error => {
            console.error('Error fetching attachments:', error);
          });
      }
      
      setEditingItem(item);
      blogPostForm.reset(blogPostData);
      setIsDialogOpen(true);
      return;
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
    setSelectedCareTypes([]);
    setSelectedAmenities([]);
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
              <FormField
                control={communityForm.control}
                name="logoImageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community Logo</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Upload logo image for the community"
                        maxSize={10 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={communityForm.control}
                name="contactImageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Card Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Upload image for the contact card section"
                        maxSize={10 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={communityForm.control}
                name="brochureImageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brochure Card Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Upload image for the brochure card section"
                        maxSize={10 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={communityForm.control}
                name="experienceImageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Our Community Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Upload image for the Experience our Community section"
                        maxSize={10 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={communityForm.control}
                name="fitnessImageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitness Center Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Upload image for the Fitness & Therapy Center page"
                        maxSize={10 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={communityForm.control}
                name="privateDiningImageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Private Dining Room Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Upload image for the Private Dining Room section"
                        maxSize={10 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Calendar Downloads Section */}
              <div className="space-y-4 border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold">Newsletter Calendar Downloads</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={communityForm.control}
                    name="calendarFile1ButtonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calendar 1 Button Text</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} placeholder="e.g. Download Activities Calendar" data-testid="input-calendar1-button-text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={communityForm.control}
                    name="calendarFile1Id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calendar 1 File</FormLabel>
                        <FormControl>
                          <ImageUploader
                            value={field.value || undefined}
                            onChange={field.onChange}
                            label="Upload first calendar file (PDF recommended)"
                            maxSize={10 * 1024 * 1024}
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={communityForm.control}
                    name="calendarFile2ButtonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calendar 2 Button Text</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} placeholder="e.g. Download Events Calendar" data-testid="input-calendar2-button-text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={communityForm.control}
                    name="calendarFile2Id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calendar 2 File</FormLabel>
                        <FormControl>
                          <ImageUploader
                            value={field.value || undefined}
                            onChange={field.onChange}
                            label="Upload second calendar file (PDF recommended)"
                            maxSize={10 * 1024 * 1024}
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
              {/* Care Types Multi-Select */}
              <div className="space-y-2">
                <FormLabel>Care Types *</FormLabel>
                <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                  {allCareTypes.filter(ct => ct.active).map((careType) => (
                    <label key={careType.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded" data-testid={`checkbox-care-type-${careType.slug}`}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedCareTypes.includes(careType.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCareTypes([...selectedCareTypes, careType.id]);
                          } else {
                            setSelectedCareTypes(selectedCareTypes.filter(id => id !== careType.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <span className="font-medium">{careType.name}</span>
                        {careType.description && (
                          <p className="text-sm text-gray-500">{careType.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{selectedCareTypes.length} care type(s) selected</span>
                  <div className="space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCareTypes(allCareTypes.filter(ct => ct.active).map(ct => ct.id))}
                      data-testid="button-select-all-care-types"
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCareTypes([])}
                      data-testid="button-clear-all-care-types"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
                {selectedCareTypes.length === 0 && (
                  <p className="text-sm text-red-500">At least one care type must be selected</p>
                )}
              </div>
              
              {/* Amenities Multi-Select */}
              <div className="space-y-2">
                <FormLabel>Amenities</FormLabel>
                <div className="border rounded-md p-3 space-y-4 max-h-96 overflow-y-auto">
                  {/* Group amenities by category */}
                  {Object.entries(
                    allAmenities.filter(a => a.active).reduce((acc, amenity) => {
                      const category = amenity.category || 'Other';
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(amenity);
                      return acc;
                    }, {} as Record<string, typeof allAmenities>)
                  ).map(([category, categoryAmenities]) => (
                    <div key={category}>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2 capitalize">
                        {category.replace(/_/g, ' ')}
                      </h4>
                      <div className="space-y-2 ml-4">
                        {categoryAmenities.map((amenity) => (
                          <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded" data-testid={`checkbox-amenity-${amenity.slug}`}>
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedAmenities.includes(amenity.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAmenities([...selectedAmenities, amenity.id]);
                                } else {
                                  setSelectedAmenities(selectedAmenities.filter(id => id !== amenity.id));
                                }
                              }}
                            />
                            <div className="flex-1 flex items-center space-x-2">
                              {amenity.icon && (
                                <span className="text-gray-500">
                                  {/* You could render an icon component here based on amenity.icon */}
                                  {amenity.icon}
                                </span>
                              )}
                              <span className="font-medium">{amenity.name}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{selectedAmenities.length} amenity(ies) selected</span>
                  <div className="space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAmenities(allAmenities.filter(a => a.active).map(a => a.id))}
                      data-testid="button-select-all-amenities"
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAmenities([])}
                      data-testid="button-clear-all-amenities"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </div>
              
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

      case "blog-posts":
        return (
          <Form {...blogPostForm}>
            <form onSubmit={blogPostForm.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={blogPostForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter blog post title"
                          onChange={(e) => {
                            field.onChange(e);
                            // Auto-generate slug from title if slug is empty
                            const slugField = blogPostForm.getValues("slug");
                            if (!slugField || slugField === generateSlug(blogPostForm.getValues("title"))) {
                              blogPostForm.setValue("slug", generateSlug(e.target.value));
                            }
                          }}
                          data-testid="input-blog-title" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={blogPostForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="url-friendly-slug"
                          data-testid="input-blog-slug" 
                        />
                      </FormControl>
                      <FormDescription>URL-friendly version of the title</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={blogPostForm.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // If a team member is selected, also set the authorId
                          const teamMember = teamMembers.find(m => m.name === value);
                          if (teamMember) {
                            blogPostForm.setValue("authorId", teamMember.id);
                          } else {
                            blogPostForm.setValue("authorId", undefined);
                          }
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-blog-author">
                            <SelectValue placeholder="Select an author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teamMembers.filter(m => m.active).length > 0 && (
                            <>
                              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                Team Members
                              </div>
                              {teamMembers
                                .filter(m => m.active)
                                .sort((a, b) => a.sortOrder - b.sortOrder)
                                .map((member) => (
                                  <SelectItem key={member.id} value={member.name}>
                                    {member.name} - {member.role}
                                  </SelectItem>
                                ))}
                              <Separator className="my-1" />
                            </>
                          )}
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Default Authors
                          </div>
                          {FALLBACK_AUTHORS.map((author) => (
                            <SelectItem key={author} value={author}>
                              {author}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select a team member or a default author
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={blogPostForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-blog-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BLOG_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')}
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
                control={blogPostForm.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        value={field.value || ""}
                        placeholder="Brief summary of the blog post"
                        rows={3}
                        data-testid="textarea-blog-summary" 
                      />
                    </FormControl>
                    <FormDescription>A short description that appears in blog listings</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={blogPostForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content *</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Start writing your blog post..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={blogPostForm.control}
                  name="mainImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Image</FormLabel>
                      <FormControl>
                        <ImageUploader
                          value={field.value || undefined}
                          onChange={field.onChange}
                          label="Upload main image for the blog post"
                          maxSize={10 * 1024 * 1024}
                        />
                      </FormControl>
                      <FormDescription>The primary image shown with the blog post</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={blogPostForm.control}
                  name="thumbnailImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail Image</FormLabel>
                      <FormControl>
                        <ImageUploader
                          value={field.value || undefined}
                          onChange={field.onChange}
                          label="Upload thumbnail image"
                          maxSize={5 * 1024 * 1024}
                        />
                      </FormControl>
                      <FormDescription>Smaller image for listings and previews</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={blogPostForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <BlogPostTagInput
                        value={Array.isArray(field.value) ? field.value : []}
                        onChange={(tags) => {
                          field.onChange(tags);
                        }}
                        dataTestId="input-blog-tags"
                      />
                    </FormControl>
                    <FormDescription>Add predefined or custom tags to categorize your blog post</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={blogPostForm.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community (Optional)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} value={field.value || "none"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-blog-community">
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
                    <FormDescription>Associate this post with a specific community</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={blogPostForm.control}
                name="attachmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Attachment (Optional)</FormLabel>
                    <FormControl>
                      <DocumentUploader
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Upload a document attachment (PDF, DOC, DOCX)"
                        accept=".pdf,.doc,.docx"
                        maxSize={25 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormDescription>
                      Attach a downloadable document like a newsletter or report
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={blogPostForm.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publish Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field} 
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""} 
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          data-testid="input-blog-publish-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={blogPostForm.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>
                          Show in featured section
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          data-testid="switch-blog-featured" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={blogPostForm.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Published</FormLabel>
                        <FormDescription>
                          Make post visible
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          data-testid="switch-blog-published" 
                        />
                      </FormControl>
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

      case "team":
        return (
          <Form {...teamMemberForm}>
            <form onSubmit={teamMemberForm.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={teamMemberForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter team member name"
                          onChange={(e) => {
                            field.onChange(e);
                            // Auto-generate slug from name if slug is empty
                            const slugField = teamMemberForm.getValues("slug");
                            if (!slugField || slugField === generateSlug(teamMemberForm.getValues("name"))) {
                              teamMemberForm.setValue("slug", generateSlug(e.target.value));
                            }
                          }}
                          data-testid="input-team-name" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={teamMemberForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="url-friendly-name" 
                          data-testid="input-team-slug" 
                        />
                      </FormControl>
                      <FormDescription>
                        URL-friendly identifier (auto-generated from name)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={teamMemberForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., Executive Director"
                          data-testid="input-team-role" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={teamMemberForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          placeholder="e.g., Management, Healthcare"
                          data-testid="input-team-department" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={teamMemberForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value || ""} 
                        rows={4}
                        placeholder="Brief biography of the team member"
                        data-testid="textarea-team-bio" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={teamMemberForm.control}
                name="avatarImageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={(value) => field.onChange(value || null)}
                        multiple={false}
                        label="Upload avatar image"
                        accept="image/*"
                        showDelete={true}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a professional photo for this team member
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={teamMemberForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          type="email"
                          placeholder="email@example.com"
                          data-testid="input-team-email" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={teamMemberForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          type="tel"
                          placeholder="(555) 123-4567"
                          data-testid="input-team-phone" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={teamMemberForm.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          placeholder="https://linkedin.com/in/username"
                          data-testid="input-team-linkedin" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={teamMemberForm.control}
                  name="twitterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          placeholder="https://twitter.com/username"
                          data-testid="input-team-twitter" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={teamMemberForm.control}
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
                          data-testid="input-team-sort" 
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={teamMemberForm.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 mt-8">
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          data-testid="switch-team-featured" 
                        />
                      </FormControl>
                      <FormLabel>Featured</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={teamMemberForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 mt-8">
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          data-testid="switch-team-active" 
                        />
                      </FormControl>
                      <FormLabel>Active</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={teamMemberForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Type to add tags..."
                        dataTestId="input-team-tags"
                      />
                    </FormControl>
                    <FormDescription>
                      Add tags to associate this team member with communities and departments
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit">
                  {editingItem ? "Update" : "Create"} Team Member
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

      case "community-highlights":
        return (
          <Form {...communityHighlightForm}>
            <form onSubmit={communityHighlightForm.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={communityHighlightForm.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-highlight-community">
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
                control={communityHighlightForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-highlight-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={communityHighlightForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} data-testid="textarea-highlight-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={communityHighlightForm.control}
                name="imageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image (Optional)</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={(value) => field.onChange(value || null)}
                        multiple={false}
                        label=""
                        accept="image/*"
                        showDelete={true}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an image or select from existing uploads
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={communityHighlightForm.control}
                name="ctaLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Button Text (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value || ""} 
                        placeholder="e.g. Learn More" 
                        data-testid="input-highlight-cta-label" 
                      />
                    </FormControl>
                    <FormDescription>
                      Text for the call-to-action button
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={communityHighlightForm.control}
                name="ctaHref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Link (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value || ""} 
                        placeholder="e.g. /contact or https://example.com" 
                        data-testid="input-highlight-cta-href" 
                      />
                    </FormControl>
                    <FormDescription>
                      Link for the call-to-action button
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={communityHighlightForm.control}
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
                          data-testid="input-highlight-sort" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={communityHighlightForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 mt-8">
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          data-testid="switch-highlight-active" 
                        />
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
                        <SelectItem value="/dining">Dining</SelectItem>
                        <SelectItem value="/beauty-salon">Beauty Salon & Barber</SelectItem>
                        <SelectItem value="/fitness-therapy">Fitness & Therapy Center</SelectItem>
                        <SelectItem value="/courtyards-patios">Courtyards & Patios</SelectItem>
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
                            <ExistingGalleryImage
                              key={image.id}
                              image={image}
                              index={index}
                              onDelete={async () => {
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
                            />
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
                    value={undefined}
                    onChange={async (imageIds) => {
                      // When images are uploaded, imageIds will be an array of image IDs
                      if (imageIds && Array.isArray(imageIds)) {
                        // Add each uploaded image to the floor plan
                        for (const imageId of imageIds) {
                          try {
                            await apiRequest("POST", `/api/floor-plans/${editingItem.id}/images`, {
                              imageId: imageId,
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
                          description: `Successfully added ${imageIds.length} image(s) to the floor plan.`,
                        });
                      }
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

      case "care-types":
        return (
          <Form {...careTypeForm}>
            <form onSubmit={careTypeForm.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={careTypeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Independent Living" data-testid="input-care-type-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={careTypeForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Auto-generated from name" data-testid="input-care-type-slug" />
                      </FormControl>
                      <FormDescription>URL-safe identifier (auto-generated if empty)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={careTypeForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value || ""}
                        placeholder="Describe this care type"
                        data-testid="textarea-care-type-description" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={careTypeForm.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || 0} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-care-type-sort-order" 
                        />
                      </FormControl>
                      <FormDescription>Lower numbers appear first</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={careTypeForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 mt-8">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-care-type-active" />
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

      case "amenities":
        return (
          <Form {...amenityForm}>
            <form onSubmit={amenityForm.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={amenityForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Fitness Center" data-testid="input-amenity-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={amenityForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Auto-generated from name" data-testid="input-amenity-slug" />
                      </FormControl>
                      <FormDescription>URL-safe identifier (auto-generated if empty)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={amenityForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger data-testid="select-amenity-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AMENITY_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={amenityForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value || ""}
                        placeholder="Describe this amenity"
                        data-testid="textarea-amenity-description" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={amenityForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value || ""}
                        placeholder="e.g., Home, Heart, Users, Coffee, Wifi"
                        data-testid="input-amenity-icon" 
                      />
                    </FormControl>
                    <FormDescription>
                      Common icons: {COMMON_ICONS.slice(0, 10).join(", ")}...
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={amenityForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenity Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value || undefined}
                        onChange={field.onChange}
                        label="Upload amenity image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={amenityForm.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || 0} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-amenity-sort-order" 
                        />
                      </FormControl>
                      <FormDescription>Lower numbers appear first</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={amenityForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 mt-8">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-amenity-active" />
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
                      variant="outline"
                      onClick={() => {
                        setSelectedCommunityForFeatures(item.id);
                        setIsFeaturesDialogOpen(true);
                      }}
                      data-testid={`button-manage-features-${item.id}`}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Features
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
      return <TourRequestsTable items={items} communities={communities} />;
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

    // Blog Posts table (using blog-posts API)
    if (type === "blog-posts") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: BlogPost) => {
              const community = communities.find(c => c.id === item.communityId);
              return (
                <TableRow key={item.id} data-testid={`blog-post-row-${item.id}`}>
                  <TableCell className="font-medium max-w-[250px]">
                    <div className="space-y-1">
                      <div className="font-semibold truncate">{item.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {item.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.author || "Unknown"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1).replace(/-/g, ' ') : "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {item.tags && Array.isArray(item.tags) && item.tags.length > 0 ? (
                        item.tags.slice(0, 3).map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant={tag === "Newsletter" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No tags</span>
                      )}
                      {item.tags && item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{community?.name || "General"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={item.published ? "default" : "secondary"}>
                        {item.published ? "Published" : "Draft"}
                      </Badge>
                      {item.featured && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.publishedAt ? format(new Date(item.publishedAt), "MMM d, yyyy") : "Not set"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <BlogPostAttachmentButton postId={item.id} />
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

    // Team Members table
    if (type === "team") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: TeamMember) => {
              // Component to handle avatar display with image resolution
              const TeamAvatar = () => {
                const avatarUrl = useResolveImageUrl(item.avatarImageId);
                return (
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt={`${item.name} avatar`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                );
              };

              return (
                <TableRow key={item.id} data-testid={`team-row-${item.id}`}>
                  <TableCell>
                    <TeamAvatar />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.department || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(item.tags || []).slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(item.tags || []).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(item.tags || []).length - 3} more
                        </Badge>
                      )}
                      {(!item.tags || item.tags.length === 0) && (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.email ? (
                      <a href={`mailto:${item.email}`} className="text-blue-600 hover:underline">
                        {item.email}
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {item.featured && (
                      <Badge variant="outline" className="bg-yellow-50">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
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
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                            deleteMutation.mutate(item.id);
                          }
                        }}
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
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

    // Community Highlights table
    if (type === "community-highlights") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: CommunityHighlight) => {
              const community = communities.find(c => c.id === item.communityId);
              return (
                <TableRow key={item.id} data-testid={`highlight-row-${item.id}`}>
                  <TableCell className="font-medium">
                    <div className="font-semibold">{item.title}</div>
                  </TableCell>
                  <TableCell>
                    {community?.name || "Unknown"}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="truncate">
                      {item.description.substring(0, 100)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.imageId ? (
                      <Badge variant="outline">Has Image</Badge>
                    ) : (
                      <Badge variant="secondary">No Image</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.sortOrder}</Badge>
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
    
    // Care Types table
    if (type === "care-types") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Display Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: CareType) => (
              <TableRow key={item.id} data-testid={`care-type-row-${item.id}`}>
                <TableCell className="font-medium">
                  {item.name}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.slug}
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <div className="truncate">
                    {item.description || "No description"}
                  </div>
                </TableCell>
                <TableCell>
                  {item.sortOrder || 0}
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
    
    // Amenities table
    if (type === "amenities") {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Display Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: Amenity) => (
              <TableRow key={item.id} data-testid={`amenity-row-${item.id}`}>
                <TableCell className="font-medium">
                  {item.name}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.slug}
                </TableCell>
                <TableCell>
                  {item.category ? (
                    <Badge variant="outline">
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </Badge>
                  ) : (
                    "Uncategorized"
                  )}
                </TableCell>
                <TableCell>
                  {item.icon || "No icon"}
                </TableCell>
                <TableCell>
                  {item.sortOrder || 0}
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
  };

  const getTitle = () => {
    switch (type) {
      case "communities": return "Communities";
      case "posts": return "Blog Posts";
      case "team": return "Team Members";
      case "events": return "Events";
      case "tours": return "Tour Requests";
      case "faqs": return "FAQs";
      case "galleries": return "Galleries";
      case "testimonials": return "Testimonials";
      case "page-heroes": return "Page Heroes";
      case "floor-plans": return "Floor Plans";
      case "care-types": return "Care Types";
      case "amenities": return "Amenities";
      case "blog-posts": return "Blog Posts";
      case "community-highlights": return "Community Highlights";
      default: return type;
    }
  };

  return (
    <>
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

      {/* Community Features Management Dialog */}
      {type === "communities" && (
        <CommunityFeaturesDialog
          isOpen={isFeaturesDialogOpen}
          onClose={() => {
            setIsFeaturesDialogOpen(false);
            setEditingFeature(null);
          }}
          communityId={selectedCommunityForFeatures}
          communities={communities}
        />
      )}
    </>
  );
}

// Community Features Management Dialog Component
function CommunityFeaturesDialog({ isOpen, onClose, communityId, communities }: {
  isOpen: boolean;
  onClose: () => void;
  communityId: string | null;
  communities: Community[];
}) {
  const [editingFeature, setEditingFeature] = useState<CommunityFeature | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const community = communities.find(c => c.id === communityId);
  
  // Fetch features for the selected community
  const { data: features = [], isLoading } = useQuery<CommunityFeature[]>({
    queryKey: [`/api/communities/${communityId}/features`],
    enabled: !!communityId && isOpen,
  });
  
  // Form for creating/editing features
  const featureForm = useForm<InsertCommunityFeature>({
    resolver: zodResolver(insertCommunityFeatureSchema),
    defaultValues: {
      communityId: communityId || "",
      eyebrow: "",
      title: "",
      body: "",
      imageId: null,
      imageAlt: "",
      ctaLabel: "",
      ctaHref: "",
      imageLeft: false,
      sortOrder: 0,
      active: true,
    },
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertCommunityFeature) => {
      const response = await apiRequest("POST", `/api/community-features`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/features`] });
      setIsFormOpen(false);
      featureForm.reset();
      toast({
        title: "Success",
        description: "Feature created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create feature",
        variant: "destructive",
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertCommunityFeature> }) => {
      const response = await apiRequest("PUT", `/api/community-features/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/features`] });
      setIsFormOpen(false);
      setEditingFeature(null);
      featureForm.reset();
      toast({
        title: "Success",
        description: "Feature updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update feature",
        variant: "destructive",
      });
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/community-features/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/features`] });
      toast({
        title: "Success",
        description: "Feature deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete feature",
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (data: InsertCommunityFeature) => {
    if (editingFeature) {
      updateMutation.mutate({ id: editingFeature.id, data });
    } else {
      createMutation.mutate(data);
    }
  };
  
  const handleEdit = (feature: CommunityFeature) => {
    setEditingFeature(feature);
    featureForm.reset({
      communityId: feature.communityId,
      eyebrow: feature.eyebrow || "",
      title: feature.title,
      body: feature.body,
      imageId: feature.imageId,
      imageAlt: feature.imageAlt || "",
      ctaLabel: feature.ctaLabel || "",
      ctaHref: feature.ctaHref || "",
      imageLeft: feature.imageLeft,
      sortOrder: feature.sortOrder,
      active: feature.active,
    });
    setIsFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this feature?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const moveFeature = async (index: number, direction: 'up' | 'down') => {
    const newFeatures = [...features];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < features.length) {
      // Swap features
      [newFeatures[index], newFeatures[targetIndex]] = [newFeatures[targetIndex], newFeatures[index]];
      
      // Update sort orders
      const updates = newFeatures.map((feature, idx) => 
        updateMutation.mutateAsync({ id: feature.id, data: { sortOrder: idx } })
      );
      
      await Promise.all(updates);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Manage Experience Features - {community?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add/Edit Feature Form */}
          {isFormOpen ? (
            <Card>
              <CardHeader>
                <CardTitle>{editingFeature ? "Edit" : "Add"} Feature</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...featureForm}>
                  <form onSubmit={featureForm.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={featureForm.control}
                        name="eyebrow"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eyebrow (Category)</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} placeholder="e.g., Fine Dining" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={featureForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Feature title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={featureForm.control}
                      name="body"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={4} placeholder="Feature description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={featureForm.control}
                        name="imageId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Feature Image</FormLabel>
                            <FormControl>
                              <ImageUploader
                                value={field.value || ""}
                                onChange={(imageId) => field.onChange(imageId)}
                                onRemove={() => field.onChange(null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={featureForm.control}
                        name="imageAlt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image Alt Text</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} placeholder="Description for accessibility" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={featureForm.control}
                        name="ctaLabel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CTA Button Label</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} placeholder="e.g., Learn More" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={featureForm.control}
                        name="ctaHref"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CTA Button Link</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} placeholder="e.g., /events" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={featureForm.control}
                        name="imageLeft"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Image on Left</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={featureForm.control}
                        name="sortOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sort Order</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" onChange={(e) => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={featureForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Active</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsFormOpen(false);
                          setEditingFeature(null);
                          featureForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {createMutation.isPending || updateMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          editingFeature ? "Update Feature" : "Create Feature"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Feature
            </Button>
          )}
          
          {/* Features List */}
          {isLoading ? (
            <div className="text-center py-8">Loading features...</div>
          ) : features.length > 0 ? (
            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card key={feature.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        {feature.eyebrow && (
                          <Badge variant="outline">{feature.eyebrow}</Badge>
                        )}
                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{feature.body}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Order: {feature.sortOrder}</span>
                          <span>Image: {feature.imageLeft ? "Left" : "Right"}</span>
                          {feature.ctaLabel && <span>CTA: {feature.ctaLabel}</span>}
                          <Badge variant={feature.active ? "default" : "secondary"}>
                            {feature.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-4">
                        {index > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveFeature(index, 'up')}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                        )}
                        {index < features.length - 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveFeature(index, 'down')}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(feature)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(feature.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No features yet. Add your first feature to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
