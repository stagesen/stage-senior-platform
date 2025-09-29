import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { Download, FileText, Calendar, AlertCircle, CalendarDays } from "lucide-react";
import type { BlogPost, PostAttachment, Community } from "@shared/schema";

interface NewsletterResponse extends BlogPost {
  attachments: PostAttachment[];
  community: Community;
}

interface NewsletterCardProps {
  communityId: string;
}

export default function NewsletterCard({ communityId }: NewsletterCardProps) {
  const { data: newsletter, isLoading, error } = useQuery<NewsletterResponse>({
    queryKey: ['/api/posts/latest-newsletter', communityId],
    retry: 1,
  });

  // Resolve image URLs
  const resolvedThumbnailImage = useResolveImageUrl(newsletter?.thumbnailImage);
  const resolvedMainImage = useResolveImageUrl(newsletter?.mainImage);
  
  // Resolve calendar file URLs
  const resolvedCalendarFile1 = useResolveImageUrl(newsletter?.community?.calendarFile1Id);
  const resolvedCalendarFile2 = useResolveImageUrl(newsletter?.community?.calendarFile2Id);

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className="overflow-hidden" data-testid="newsletter-card-skeleton">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Error or no newsletter found
  if (error || !newsletter) {
    return (
      <Card className="overflow-hidden" data-testid="newsletter-card-empty">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Community Newsletter
          </CardTitle>
          <CardDescription>Stay updated with our latest news and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-2">
              No newsletter available yet
            </p>
            <p className="text-sm text-muted-foreground">
              Check back soon for our latest community updates
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const imageUrl = resolvedThumbnailImage || resolvedMainImage;
  const attachment = newsletter.attachments?.[0];

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-background to-muted/20 border-primary/20" 
      data-testid={`newsletter-card-${newsletter.slug}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" />
              Community Newsletter
            </CardTitle>
            <CardDescription className="mt-1">
              Latest updates from {newsletter.community.name}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Newsletter
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Featured Image */}
        {imageUrl && (
          <div className="relative overflow-hidden rounded-md group">
            <img
              src={imageUrl}
              alt={newsletter.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              data-testid={`newsletter-image-${newsletter.slug}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-base line-clamp-2" data-testid={`newsletter-title-${newsletter.slug}`}>
            {newsletter.title}
          </h3>

          {/* Summary */}
          {newsletter.summary && (
            <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`newsletter-summary-${newsletter.slug}`}>
              {newsletter.summary}
            </p>
          )}

          {/* Published Date */}
          <div className="flex items-center text-xs text-muted-foreground" data-testid={`newsletter-date-${newsletter.slug}`}>
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(newsletter.publishedAt || newsletter.createdAt)}
          </div>

          {/* Download Button */}
          {attachment ? (
            <Button 
              className="w-full group" 
              variant="default"
              asChild
              data-testid={`newsletter-download-${newsletter.slug}`}
            >
              <a 
                href={attachment.fileUrl} 
                download={attachment.fileName || 'newsletter.pdf'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Download Newsletter
                {attachment.sizeBytes && (
                  <span className="ml-2 text-xs opacity-80">
                    ({formatFileSize(attachment.sizeBytes)})
                  </span>
                )}
              </a>
            </Button>
          ) : (
            <Button 
              className="w-full" 
              variant="secondary"
              asChild
              data-testid={`newsletter-view-${newsletter.slug}`}
            >
              <a href={`/blog/${newsletter.slug}`}>
                <FileText className="w-4 h-4 mr-2" />
                Read Newsletter
              </a>
            </Button>
          )}

          {/* Calendar Download Buttons */}
          {(resolvedCalendarFile1 || resolvedCalendarFile2) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="w-3 h-3" />
                <span>Community Calendars</span>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {resolvedCalendarFile1 && newsletter.community.calendarFile1ButtonText && (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    size="sm"
                    asChild
                    data-testid={`calendar-download-1-${newsletter.slug}`}
                  >
                    <a 
                      href={resolvedCalendarFile1} 
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Calendar className="w-3 h-3 mr-2" />
                      {newsletter.community.calendarFile1ButtonText}
                    </a>
                  </Button>
                )}
                
                {resolvedCalendarFile2 && newsletter.community.calendarFile2ButtonText && (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    size="sm"
                    asChild
                    data-testid={`calendar-download-2-${newsletter.slug}`}
                  >
                    <a 
                      href={resolvedCalendarFile2} 
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Calendar className="w-3 h-3 mr-2" />
                      {newsletter.community.calendarFile2ButtonText}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}