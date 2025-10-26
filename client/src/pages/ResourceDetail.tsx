import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import DOMPurify from "isomorphic-dompurify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { setMetaTags, getCanonicalUrl, sanitizeMetaText } from "@/lib/metaTags";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getUtmParams, getClickIdsFromUrl, generateEventId } from "@/lib/tracking";
import { ArrowLeft, Download, User, FileText, CheckCircle, Lock, Mail, TrendingUp, Clock, Star } from "lucide-react";
import type { ContentAsset, TeamMember } from "@shared/schema";

interface DownloadFormData {
  email: string;
  name?: string;
  phone?: string;
  zipCode?: string;
  timeline?: string;
}

export default function ResourceDetail() {
  const params = useParams();
  const slug = params.slug;
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [formData, setFormData] = useState<DownloadFormData>({ email: "" });
  const { toast } = useToast();

  // Fetch resource by slug
  const { data: resource, isLoading: resourceLoading } = useQuery<ContentAsset>({
    queryKey: [`/api/public/content-assets/${slug}`],
    enabled: !!slug,
  });

  // Fetch featured image
  const featuredImageUrl = useResolveImageUrl(resource?.featuredImageId);

  // Fetch author (team member) if authorId exists
  const { data: author } = useQuery<TeamMember>({
    queryKey: [`/api/team-members/${resource?.authorId}`],
    enabled: !!resource?.authorId,
  });

  const authorAvatarUrl = useResolveImageUrl(author?.avatarImageId);

  // Set meta tags
  useEffect(() => {
    if (resource) {
      const description = resource.description || sanitizeMetaText(resource.articleContent || '', 155);
      
      setMetaTags({
        title: `${resource.title} | Stage Senior Resources`,
        description,
        canonicalUrl: getCanonicalUrl(`/resources/${slug}`),
        ogType: "article",
        ogImage: featuredImageUrl || `${window.location.origin}/assets/stage-logo.webp`,
      });
    }
  }, [resource, slug, featuredImageUrl]);

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
      if (resource?.fileUrl) {
        window.location.href = resource.fileUrl;
      }
      
      toast({
        title: "Download started!",
        description: "Your resource is being downloaded. Check your downloads folder.",
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/public/content-assets/${slug}`] });
      
      setShowDownloadDialog(false);
      setFormData({ email: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Download failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resource) return;
    
    if (!formData.email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to download this resource.",
        variant: "destructive",
      });
      return;
    }

    downloadMutation.mutate({
      assetId: resource.id,
      ...formData,
    });
  };

  // Loading state
  if (resourceLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground mb-4" data-testid="resource-not-found-title">
              Resource Not Found
            </h1>
            <p className="text-muted-foreground mb-6" data-testid="resource-not-found-description">
              The resource you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild data-testid="button-back-resources">
              <Link href="/resources">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resources
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sanitize HTML content
  const sanitizedContent = resource.articleContent 
    ? DOMPurify.sanitize(resource.articleContent, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre',
          'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel']
      })
    : null;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/10 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="mb-6" 
            asChild
            data-testid="button-back-to-resources"
          >
            <Link href="/resources">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Link>
          </Button>
          
          {/* Category badge */}
          {resource.category && (
            <div className="mb-4">
              <span 
                className="inline-block px-3 py-1 text-sm font-medium bg-white/80 text-primary rounded-full border border-primary/20"
                data-testid="resource-category"
              >
                {resource.category}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="resource-title">
            {resource.title}
          </h1>
          
          {resource.description && (
            <p className="text-xl text-muted-foreground mb-8" data-testid="resource-description">
              {resource.description}
            </p>
          )}

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="rounded-lg overflow-hidden mb-8 shadow-lg">
              <img 
                src={featuredImageUrl} 
                alt={resource.title}
                className="w-full h-auto object-cover max-h-[500px]"
                data-testid="resource-featured-image"
              />
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {sanitizedContent ? (
            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              data-testid="resource-article-content"
            />
          ) : (
            <p className="text-muted-foreground text-center py-12" data-testid="no-article-content">
              No article content available for this resource.
            </p>
          )}
        </div>
      </section>

      {/* Author Section */}
      {author && (
        <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6" data-testid="author-section-title">About the Author</h2>
                <div className="flex items-start gap-6">
                  {authorAvatarUrl ? (
                    <img 
                      src={authorAvatarUrl} 
                      alt={author.name}
                      className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                      data-testid="author-avatar"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0" data-testid="author-avatar-placeholder">
                      <User className="w-10 h-10 text-primary/50" />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-1" data-testid="author-name">{author.name}</h3>
                    {author.role && (
                      <p className="text-muted-foreground mb-3" data-testid="author-role">{author.role}</p>
                    )}
                    {author.bio && (
                      <p className="text-foreground" data-testid="author-bio">{author.bio}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Download CTA Section */}
      {resource.fileUrl && (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main CTA Card */}
            <Card className="overflow-hidden shadow-2xl border-2 border-primary/20 mb-8">
              <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 lg:p-12">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-bold mb-4" data-testid="download-cta-title">
                    Get Your Free Complete Guide
                  </h2>
                  <p className="text-xl lg:text-2xl mb-8 opacity-95" data-testid="download-cta-description">
                    Download the full PDF with actionable checklists, worksheets, and expert insights
                  </p>
                  <Button 
                    size="lg"
                    variant="secondary"
                    onClick={() => setShowDownloadDialog(true)}
                    className="text-lg px-10 py-7 h-auto text-primary hover:scale-105 transition-transform shadow-lg"
                    data-testid="button-download-pdf"
                  >
                    <Download className="w-6 h-6 mr-3" />
                    Download Full PDF Guide
                  </Button>
                  {resource.downloadCount && resource.downloadCount > 0 && (
                    <p className="mt-6 text-sm opacity-90 flex items-center justify-center gap-2" data-testid="download-count">
                      <TrendingUp className="w-4 h-4" />
                      Trusted by {resource.downloadCount.toLocaleString()}+ families
                    </p>
                  )}
                </div>
              </div>
              
              {/* Benefits Grid */}
              <div className="bg-white p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">What You'll Get in the Full Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-gray-900">Actionable Checklists</h4>
                    <p className="text-gray-600 text-sm">Step-by-step guides you can use right away</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-gray-900">Expert Insights</h4>
                    <p className="text-gray-600 text-sm">Professional advice from senior care specialists</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-gray-900">Time-Saving Tools</h4>
                    <p className="text-gray-600 text-sm">Worksheets that simplify complex decisions</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="text-center p-6 bg-white border-2 border-gray-100 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-1 text-gray-900">100% Free</h4>
                <p className="text-sm text-gray-600">No credit card required</p>
              </Card>
              
              <Card className="text-center p-6 bg-white border-2 border-gray-100 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-1 text-gray-900">No Spam</h4>
                <p className="text-sm text-gray-600">Only helpful resources</p>
              </Card>
              
              <Card className="text-center p-6 bg-white border-2 border-gray-100 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-1 text-gray-900">Instant Access</h4>
                <p className="text-sm text-gray-600">Download immediately</p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Download Modal */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-download">
          <DialogHeader>
            <DialogTitle data-testid="dialog-title">Download Resource</DialogTitle>
            <DialogDescription data-testid="dialog-description">
              Please provide your email to download this resource. We'll also send you helpful tips and updates about senior living.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleDownloadSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" data-testid="label-email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
                data-testid="input-email"
              />
            </div>
            
            <div>
              <Label htmlFor="name" data-testid="label-name">Full Name (Optional)</Label>
              <Input
                id="name"
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                data-testid="input-name"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" data-testid="label-phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                data-testid="input-phone"
              />
            </div>
            
            <div>
              <Label htmlFor="zipCode" data-testid="label-zipcode">ZIP Code (Optional)</Label>
              <Input
                id="zipCode"
                type="text"
                value={formData.zipCode || ""}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="80202"
                maxLength={10}
                data-testid="input-zipcode"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDownloadDialog(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={downloadMutation.isPending}
                data-testid="button-submit-download"
              >
                {downloadMutation.isPending ? "Downloading..." : "Download Now"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
