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
import { ArrowLeft, Download, User, FileText, BookOpen, Calendar, Phone } from "lucide-react";
import { useScheduleTour } from "@/hooks/useScheduleTour";
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
  const { openScheduleTour } = useScheduleTour();

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
                loading="lazy"
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

      {/* CTA Section - Download or Contact */}
      {featuredImageUrl && (
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden shadow-lg border border-gray-200">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left side - Image with gradient overlay and icon */}
                <div className="relative h-64 md:h-auto min-h-[400px]">
                  <img
                    src={featuredImageUrl}
                    alt={resource.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60" />

                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30">
                      {resource.fileUrl ? (
                        <BookOpen className="w-20 h-20 text-white" strokeWidth={1.5} />
                      ) : (
                        <Calendar className="w-20 h-20 text-white" strokeWidth={1.5} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                  {resource.fileUrl ? (
                    <>
                      <p className="text-primary font-semibold mb-2 uppercase tracking-wide text-sm">
                        Need More Information?
                      </p>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3" data-testid="download-cta-title">
                        Get the Complete Guide
                      </h2>
                      <p className="text-base text-gray-600 mb-6" data-testid="download-cta-description">
                        Access the full PDF with detailed checklists, worksheets, and step-by-step planning tools you can use right away.
                      </p>
                      <Button
                        size="lg"
                        onClick={() => setShowDownloadDialog(true)}
                        className="w-full md:w-auto text-lg px-8 py-6 h-auto"
                        data-testid="button-download-pdf"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        {resource.ctaText || "Download Full Guide"}
                      </Button>
                      {resource.downloadCount && resource.downloadCount > 0 && (
                        <p className="mt-4 text-sm text-gray-500" data-testid="download-count">
                          Downloaded by {resource.downloadCount.toLocaleString()}+ families
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-primary font-semibold mb-2 uppercase tracking-wide text-sm">
                        Ready to Learn More?
                      </p>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3" data-testid="contact-cta-title">
                        Let's Find the Right Community for You
                      </h2>
                      <p className="text-base text-gray-600 mb-6" data-testid="contact-cta-description">
                        Our senior living experts are here to answer your questions and help you explore your options.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          size="lg"
                          onClick={() => openScheduleTour()}
                          className="text-base px-6 py-5 h-auto talkfurther-schedule-tour"
                          data-testid="button-schedule-tour"
                        >
                          <Calendar className="w-5 h-5 mr-2" />
                          Schedule a Tour
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          asChild
                          className="text-base px-6 py-5 h-auto border-2"
                          data-testid="button-call-now"
                        >
                          <a href="tel:+17202184663">
                            <Phone className="w-5 h-5 mr-2" />
                            (720) 218-4663
                          </a>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

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
                      loading="lazy"
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

      {/* Download Modal */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-download">
          {/* Featured Image with PDF Icon */}
          {featuredImageUrl && (
            <div className="relative h-32 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg">
              <img 
                src={featuredImageUrl} 
                alt={resource?.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/60 to-primary/50" />
              
              {/* PDF Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                  <BookOpen className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          )}
          
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
