import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, Heart, MessageCircle, Share2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { SocialPost } from "@shared/schema";

interface InstagramFeedProps {
  communityId: string;
  communityName: string;
  instagramUrl?: string;
  className?: string;
}

// Sub-component for social post image to properly use the image resolution hook
const SocialPostImage = ({ imageId, caption, postId }: { imageId?: string; caption?: string; postId: string }) => {
  const imageUrl = useResolveImageUrl(imageId);
  
  if (!imageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <ImageIcon className="w-24 h-24 text-gray-400" />
      </div>
    );
  }
  
  return (
    <img
      src={imageUrl}
      alt={caption || "Social post"}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
      data-testid={`social-post-image-${postId}`}
    />
  );
};

export default function InstagramFeed({ communityId, communityName, instagramUrl, className }: InstagramFeedProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Fetch social posts for this community
  const { data: socialPosts = [], isLoading } = useQuery<SocialPost[]>({
    queryKey: ['/api/social-posts/community', communityId],
  });

  // Filter active posts, sort by sortOrder then postDate, limit to 6
  const activePosts = socialPosts
    .filter(post => post.active)
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      }
      const aDate = a.postDate ? new Date(a.postDate).getTime() : 0;
      const bDate = b.postDate ? new Date(b.postDate).getTime() : 0;
      return bDate - aDate;
    })
    .slice(0, 6);

  // Extract Instagram username from URL (if provided)
  const extractUsername = (url: string): string => {
    try {
      const patterns = [
        /instagram\.com\/([^/?]+)/,
        /instagram\.com\/profile\/([^/?]+)/,
        /instagr\.am\/([^/?]+)/
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1].replace(/\/$/, '');
        }
      }

      return url;
    } catch {
      return url;
    }
  };

  const username = instagramUrl ? extractUsername(instagramUrl) : communityName.toLowerCase().replace(/\s+/g, '');

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Don't render if no Instagram URL and no posts
  if (!instagramUrl && activePosts.length === 0) {
    return null;
  }

  // Empty state when there are no posts but Instagram URL exists
  if (activePosts.length === 0 && instagramUrl) {
    return (
      <div className={cn("relative", className)} data-testid="instagram-feed">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Instagram className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-lg mb-6">
            Follow us for daily updates and community moments
          </p>
          <Button
            size="lg"
            className="group bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
            asChild
            data-testid="button-follow-instagram"
          >
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5 mr-2" />
              Follow @{username} on Instagram
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} data-testid="instagram-feed">
      {/* Heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <Instagram className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-lg">
          See what's happening at {communityName}
        </p>
      </div>

      {/* Social Posts Carousel */}
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: activePosts.length > 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {activePosts.map((post) => {
              const postContent = (
                <Card className="group overflow-hidden border-gray-200 hover:shadow-2xl transition-all duration-300 bg-white">
                  <CardContent className="p-0">
                    {/* Post Header */}
                    <div className="p-4 flex items-center gap-3 border-b">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <Instagram className="w-4 h-4 text-pink-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{post.author || `@${username}`}</p>
                        <p className="text-xs text-gray-500">{communityName}</p>
                      </div>
                    </div>

                    {/* Post Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <SocialPostImage 
                        imageId={post.imageId} 
                        caption={post.caption} 
                        postId={post.id} 
                      />
                      {post.linkUrl && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-white text-center">
                            <ExternalLink className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm font-semibold">View Post</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Post Footer */}
                    <div className="p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button className="hover:text-gray-600 transition-colors" aria-label="Like post">
                          <Heart className="w-6 h-6" />
                        </button>
                        <button className="hover:text-gray-600 transition-colors" aria-label="Comment on post">
                          <MessageCircle className="w-6 h-6" />
                        </button>
                        <button className="hover:text-gray-600 transition-colors" aria-label="Share post">
                          <Share2 className="w-6 h-6" />
                        </button>
                      </div>
                      {post.caption && (
                        <p className="text-sm">
                          <span className="font-semibold">{post.author || `@${username}`}</span>{' '}
                          <span className="text-gray-700">{post.caption}</span>
                        </p>
                      )}
                      {post.postDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(post.postDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );

              return (
                <CarouselItem 
                  key={post.id} 
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  data-testid={`social-post-${post.id}`}
                >
                  {post.linkUrl ? (
                    <a
                      href={post.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {postContent}
                    </a>
                  ) : (
                    postContent
                  )}
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Navigation buttons - only show if more than 1 post */}
          {activePosts.length > 1 && (
            <>
              <CarouselPrevious 
                className="hidden md:flex -left-4 lg:-left-12" 
                data-testid="social-posts-carousel-prev"
              />
              <CarouselNext 
                className="hidden md:flex -right-4 lg:-right-12"
                data-testid="social-posts-carousel-next"
              />
            </>
          )}
        </Carousel>

        {/* Carousel dots for mobile - only show if more than 1 post */}
        {activePosts.length > 1 && (
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            {activePosts.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === current ? "bg-pink-600 w-6" : "bg-gray-300"
                )}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action - only show if Instagram URL is provided */}
      {instagramUrl && (
        <div className="text-center mt-10">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
            asChild
            data-testid="button-follow-instagram"
          >
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5 mr-2" />
              Follow @{username} on Instagram
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            See daily updates, resident stories, and community events
          </p>
        </div>
      )}
    </div>
  );
}
