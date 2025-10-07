import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from "lucide-react";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { BlogPost, Community } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
  community?: Community;
}

export default function BlogCard({ post, community }: BlogCardProps) {
  // Resolve image URLs
  const resolvedThumbnailImage = useResolveImageUrl(post.thumbnailImage);
  const resolvedMainImage = useResolveImageUrl(post.mainImage);
  
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group bg-white" data-testid={`blog-card-${post.slug}`}>
      <CardContent className="p-0">
        <Link href={`/blog/${post.slug}`} className="block">
          {/* Featured Image */}
          <div className="relative overflow-hidden">
            <img
              src={resolvedThumbnailImage || resolvedMainImage || `https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400`}
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              data-testid={`blog-image-${post.slug}`}
            />
            {post.tags && post.tags.length > 0 && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground" data-testid={`blog-primary-tag-${post.slug}`}>
                  {post.tags[0]}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Meta Information */}
            <div className="flex items-center text-sm text-muted-foreground mb-3 space-x-4">
              <div className="flex items-center" data-testid={`blog-date-${post.slug}`}>
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(post.publishedAt || post.createdAt || new Date())}
              </div>
              {community && (
                <div className="flex items-center" data-testid={`blog-community-${post.slug}`}>
                  <User className="w-4 h-4 mr-1" />
                  {community.name}
                </div>
              )}
              <div className="flex items-center" data-testid={`blog-read-time-${post.slug}`}>
                <Clock className="w-4 h-4 mr-1" />
                {estimateReadTime(post.content)} min read
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2" data-testid={`blog-title-${post.slug}`}>
              {post.title}
            </h3>

            {/* Summary */}
            {post.summary && (
              <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`blog-summary-${post.slug}`}>
                {post.summary}
              </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(1, 4).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs"
                    data-testid={`blog-tag-${tag}-${post.slug}`}
                  >
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs" data-testid={`blog-more-tags-${post.slug}`}>
                    +{post.tags.length - 4} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
