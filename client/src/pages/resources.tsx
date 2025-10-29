import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { setMetaTags } from "@/lib/metaTags";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, TrendingDown, Eye } from "lucide-react";
import { Link } from "wouter";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer from "@/components/animations/StaggerContainer";
import StaggerItem from "@/components/animations/StaggerItem";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getUtmParams, getClickIdsFromUrl, generateEventId } from "@/lib/tracking";
import CTARow from "@/components/landing-sections/CTARow";
import type { ContentAsset, PageContentSection } from "@shared/schema";

const CATEGORIES = [
  { value: "all", label: "All Resources" },
  { value: "Financial Planning", label: "Financial Planning" },
  { value: "Safety & Security", label: "Safety & Security" },
  { value: "Care Planning", label: "Care Planning" },
  { value: "Lifestyle", label: "Lifestyle" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "downloads", label: "Most Downloaded" },
  { value: "title", label: "Title (A-Z)" },
];

interface DownloadFormData {
  email: string;
  name?: string;
  phone?: string;
  zipCode?: string;
  timeline?: string;
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return "Unknown size";
  
  const kb = bytes / 1024;
  const mb = kb / 1024;
  
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  }
  return `${kb.toFixed(0)} KB`;
}

function ResourceCard({ asset, onDownloadClick }: { asset: ContentAsset; onDownloadClick: (asset: ContentAsset) => void }) {
  const featuredImageUrl = useResolveImageUrl(asset.featuredImageId);
  
  return (
    <Card className="h-full flex flex-col hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group" data-testid={`card-resource-${asset.id}`}>
      {/* Featured image or placeholder */}
      <Link href={`/resources/${asset.slug}`} className="block">
        <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 flex items-center justify-center overflow-hidden cursor-pointer">
          {featuredImageUrl ? (
            <img 
              src={featuredImageUrl} 
              alt={asset.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              data-testid={`img-resource-featured-${asset.id}`}
            />
          ) : (
            <FileText className="w-20 h-20 text-blue-300 dark:text-blue-700 group-hover:scale-110 transition-transform duration-300" data-testid={`icon-resource-placeholder-${asset.id}`} />
          )}
        </div>
      </Link>
      
      <CardHeader className="pb-4 pt-6">
        {/* Category badge */}
        {asset.category && (
          <Badge 
            className="w-fit mb-3 bg-white text-gray-900 border border-gray-200 hover:bg-white font-medium px-3 py-1" 
            data-testid={`badge-category-${asset.id}`}
          >
            {asset.category}
          </Badge>
        )}
        
        <Link href={`/resources/${asset.slug}`}>
          <CardTitle className="text-2xl sm:text-3xl font-bold line-clamp-2 hover:text-primary transition-colors cursor-pointer leading-tight" data-testid={`text-title-${asset.id}`}>
            {asset.title}
          </CardTitle>
        </Link>
      </CardHeader>
      
      <CardContent className="flex-grow pb-4">
        {asset.description && (
          <CardDescription className="line-clamp-3 text-base leading-relaxed" data-testid={`text-description-${asset.id}`}>
            {asset.description}
          </CardDescription>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        {/* Action buttons */}
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="flex-1 text-base"
            data-testid={`button-read-more-${asset.id}`}
          >
            <Link href={`/resources/${asset.slug}`}>
              <Eye className="w-5 h-5 mr-2" />
              Read More
            </Link>
          </Button>
          {asset.fileUrl && (
            <Button
              variant="default"
              size="lg"
              onClick={() => onDownloadClick(asset)}
              className="flex-1 text-base"
              data-testid={`button-download-${asset.id}`}
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

function ResourceCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <Skeleton className="w-full h-64" />
      <CardHeader className="pb-4 pt-6">
        <Skeleton className="h-6 w-32 mb-3 rounded-full" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-2/3" />
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <div className="flex gap-3 w-full">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedAsset, setSelectedAsset] = useState<ContentAsset | null>(null);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [formData, setFormData] = useState<DownloadFormData>({ email: "" });
  const { toast } = useToast();

  // Fetch resources
  const { data: assets = [], isLoading } = useQuery<ContentAsset[]>({
    queryKey: ["/api/public/content-assets"],
  });

  // Fetch page content sections for CTAs
  const { data: pageSections = [] } = useQuery<PageContentSection[]>({
    queryKey: ["/api/public/page-content-sections", { pagePath: "/resources" }],
  });

  // Filter and sort assets
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets.filter(asset => {
      // Only show active assets
      if (!asset.active) return false;
      
      // Filter by category
      if (selectedCategory !== "all" && asset.category !== selectedCategory) {
        return false;
      }
      
      return true;
    });

    // Sort assets
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "downloads":
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        case "title":
          return a.title.localeCompare(b.title);
        case "featured":
        default:
          // Featured: sort by sortOrder, then by downloadCount
          if (a.sortOrder !== b.sortOrder) {
            return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
          }
          return (b.downloadCount || 0) - (a.downloadCount || 0);
      }
    });

    return sorted;
  }, [assets, selectedCategory, sortBy]);

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: async (data: {
      assetId: string;
      email: string;
      name?: string;
      phone?: string;
      zipCode?: string;
      timeline?: string;
    }) => {
      // Collect UTM and tracking parameters
      const utmParams = getUtmParams();
      const clickIds = getClickIdsFromUrl();
      
      const payload = {
        ...data,
        utmSource: utmParams.utm_source,
        utmMedium: utmParams.utm_medium,
        utmCampaign: utmParams.utm_campaign,
        utmTerm: utmParams.utm_term,
        utmContent: utmParams.utm_content,
        landingPageUrl: window.location.href,
        transactionId: generateEventId(),
        gclid: clickIds.gclid,
        fbclid: clickIds.fbclid,
      };

      return await fetch("/api/asset-downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(res => {
        if (!res.ok) throw new Error("Failed to download resource");
        return res.json();
      });
    },
    onSuccess: () => {
      // Trigger actual file download
      if (selectedAsset?.fileUrl) {
        window.location.href = selectedAsset.fileUrl;
      }
      
      // Show success message
      toast({
        title: "Download started!",
        description: "Your resource is being downloaded. Check your downloads folder.",
      });
      
      // Invalidate the cache to refresh download counts
      queryClient.invalidateQueries({ queryKey: ["/api/public/content-assets"] });
      
      // Close dialog and reset form
      setShowDownloadDialog(false);
      setFormData({ email: "" });
      setSelectedAsset(null);
    },
    onError: (error: any) => {
      toast({
        title: "Download failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDownloadClick = (asset: ContentAsset) => {
    setSelectedAsset(asset);
    setFormData({ email: "" });
    setShowDownloadDialog(true);
  };

  const handleSubmitDownload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAsset) return;
    
    // Email is always required
    if (!formData.email?.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    if (!formData.email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Check dynamic required fields
    const requiredFields = selectedAsset.requiredFields || [];
    for (const field of requiredFields) {
      const value = formData[field as keyof typeof formData];
      if (!value || (typeof value === 'string' && !value.trim())) {
        const fieldLabel = field === 'zipCode' ? 'Zip Code' : field.charAt(0).toUpperCase() + field.slice(1);
        toast({
          title: `${fieldLabel} required`,
          description: `Please enter your ${fieldLabel.toLowerCase()}`,
          variant: "destructive",
        });
        return;
      }
    }

    // Submit download request
    downloadMutation.mutate({
      assetId: selectedAsset.id,
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      zipCode: formData.zipCode,
      timeline: formData.timeline,
    });
  };

  const requiredFields = selectedAsset?.requiredFields || [];

  // Set meta tags
  useEffect(() => {
    setMetaTags({
      title: "Senior Care Resources & Guides | Stage Senior Living",
      description: "Download free guides on senior living, financial planning, safety, and care options",
      canonicalUrl: `${window.location.origin}/resources`,
      ogType: "website",
    });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <PageHero
          pagePath="/resources"
          defaultTitle="Senior Care Resources & Guides"
          defaultSubtitle="Download free guides on senior living, financial planning, safety, and care options"
          defaultBackgroundImage="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=2000&q=80"
        />

        {/* Filters Section */}
        <section className="bg-white py-6 sticky top-0 z-40 border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-64" data-testid="select-category" aria-label="Filter by category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Control */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48" data-testid="select-sort" aria-label="Sort resources">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FadeIn>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory === "all" 
                  ? "All Resources" 
                  : CATEGORIES.find(c => c.value === selectedCategory)?.label
                }
              </h2>
              <p className="text-muted-foreground">
                {filteredAndSortedAssets.length} {filteredAndSortedAssets.length === 1 ? "resource" : "resources"} available
              </p>
            </div>
          </FadeIn>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <ResourceCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredAndSortedAssets.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredAndSortedAssets.map((asset) => (
                <StaggerItem key={asset.id} className="h-full">
                  <ResourceCard 
                    asset={asset} 
                    onDownloadClick={handleDownloadClick}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground" data-testid="text-no-results">
                  No resources found in this category.
                </p>
              </CardContent>
            </Card>
          )}
        </main>

        {/* Page Content Sections (CTAs, etc.) */}
        {pageSections
          .filter(section => section.active)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((section) => {
            if (section.sectionType === 'cta_row') {
              return <CTARow key={section.id} section={section} />;
            }
            return null;
          })}

        {/* Gated Download Dialog */}
        <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
          <DialogContent className="sm:max-w-md" data-testid="dialog-download">
            <DialogHeader>
              <DialogTitle>Download {selectedAsset?.title}</DialogTitle>
              <DialogDescription>
                Please provide your email address to download this resource. We'll send you a copy and keep you updated on senior care resources.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmitDownload}>
              <div className="space-y-4 py-4">
                {/* Email - Always required */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    data-testid="input-email"
                  />
                </div>

                {/* Name - Conditional */}
                {requiredFields.includes("name") && (
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      data-testid="input-name"
                    />
                  </div>
                )}

                {/* Phone - Conditional */}
                {requiredFields.includes("phone") && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 555-5555"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      data-testid="input-phone"
                    />
                  </div>
                )}

                {/* Zip Code - Conditional */}
                {requiredFields.includes("zipCode") && (
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">
                      Zip Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="80000"
                      value={formData.zipCode || ""}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      required
                      data-testid="input-zipcode"
                    />
                  </div>
                )}

                {/* Timeline - Conditional */}
                {requiredFields.includes("timeline") && (
                  <div className="space-y-2">
                    <Label htmlFor="timeline">
                      Timeline <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.timeline || ""} 
                      onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                      required
                    >
                      <SelectTrigger id="timeline" data-testid="select-timeline">
                        <SelectValue placeholder="Select a timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="1-3 months">1-3 months</SelectItem>
                        <SelectItem value="3-6 months">3-6 months</SelectItem>
                        <SelectItem value="6-12 months">6-12 months</SelectItem>
                        <SelectItem value="1+ years">1+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDownloadDialog(false)}
                  disabled={downloadMutation.isPending}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={downloadMutation.isPending}
                  data-testid="button-submit-download"
                >
                  {downloadMutation.isPending ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
