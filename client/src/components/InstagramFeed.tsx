import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface InstagramFeedProps {
  instagramUrl: string;
  communityName: string;
  className?: string;
}

export default function InstagramFeed({ instagramUrl, communityName, className }: InstagramFeedProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Extract Instagram username from URL
  const extractUsername = (url: string): string => {
    try {
      // Handle various Instagram URL formats
      const patterns = [
        /instagram\.com\/([^/?]+)/,
        /instagram\.com\/profile\/([^/?]+)/,
        /instagr\.am\/([^/?]+)/
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1].replace(/\/$/, ''); // Remove trailing slash
        }
      }

      return url;
    } catch {
      return url;
    }
  };

  const username = extractUsername(instagramUrl);

  // Placeholder data for Instagram-style posts
  // In production, this would be replaced with actual Instagram posts from a service
  const placeholderPosts = [
    {
      id: 1,
      image: `https://source.unsplash.com/800x800/?senior-living,community,${communityName}`,
      caption: `Life at ${communityName} 🏡✨`,
      likes: 124,
      comments: 12,
    },
    {
      id: 2,
      image: `https://source.unsplash.com/800x800/?seniors,activities,${communityName}`,
      caption: `Making memories together 💙`,
      likes: 156,
      comments: 18,
    },
    {
      id: 3,
      image: `https://source.unsplash.com/800x800/?elderly,happy,${communityName}`,
      caption: `Every day is special here ☀️`,
      likes: 189,
      comments: 24,
    },
    {
      id: 4,
      image: `https://source.unsplash.com/800x800/?retirement,lifestyle,${communityName}`,
      caption: `Community events and fun! 🎉`,
      likes: 143,
      comments: 15,
    },
    {
      id: 5,
      image: `https://source.unsplash.com/800x800/?senior,dining,${communityName}`,
      caption: `Delicious dining experiences 🍽️`,
      likes: 167,
      comments: 21,
    },
  ];

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!instagramUrl) {
    return null;
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
          Follow us for daily updates and community moments
        </p>
      </div>

      {/* Instagram Feed Carousel */}
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {placeholderPosts.map((post, index) => (
              <CarouselItem 
                key={post.id} 
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                data-testid={`instagram-post-${post.id}`}
              >
                <Card className="group overflow-hidden border-gray-200 hover:shadow-2xl transition-all duration-300 bg-white">
                  {/* Instagram Post Header */}
                  <CardContent className="p-0">
                    <div className="p-4 flex items-center gap-3 border-b">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <Instagram className="w-4 h-4 text-pink-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">@{username}</p>
                        <p className="text-xs text-gray-500">{communityName}</p>
                      </div>
                    </div>

                    {/* Instagram Post Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={post.image}
                        alt={post.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        data-testid={`instagram-image-${post.id}`}
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex gap-6 text-white">
                          <div className="flex items-center gap-2">
                            <Heart className="w-6 h-6 fill-white" />
                            <span className="font-semibold">{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-6 h-6 fill-white" />
                            <span className="font-semibold">{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instagram Post Footer */}
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
                      <p className="text-sm">
                        <span className="font-semibold">@{username}</span>{' '}
                        <span className="text-gray-700">{post.caption}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation buttons */}
          <CarouselPrevious 
            className="hidden md:flex -left-4 lg:-left-12" 
            data-testid="instagram-carousel-prev"
          />
          <CarouselNext 
            className="hidden md:flex -right-4 lg:-right-12"
            data-testid="instagram-carousel-next"
          />
        </Carousel>

        {/* Carousel dots for mobile */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {placeholderPosts.map((_, index) => (
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
      </div>

      {/* Call to Action */}
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

      {/* Note: For live Instagram posts, integrate with services like EmbedSocial or Juicer */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-1">🔧 Development Note:</p>
          <p>
            This component displays placeholder Instagram-style posts. To show live Instagram posts, 
            integrate with{' '}
            <a 
              href="https://embedsocial.com/products/embedfeed/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-blue-900"
            >
              EmbedSocial
            </a>
            {' '}or{' '}
            <a 
              href="https://www.juicer.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-blue-900"
            >
              Juicer.io
            </a>.
          </p>
        </div>
      )}
    </div>
  );
}
