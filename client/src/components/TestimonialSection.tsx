import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, ChevronLeft, ChevronRight, Heart, MessageCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { Link } from "wouter";
import type { Testimonial as TestimonialType, Community } from "@shared/schema";

interface EnhancedTestimonial extends TestimonialType {
  communityName?: string;
  resolvedImageUrl?: string | null;
}

// Component for individual testimonial with image resolution
function TestimonialCard({ testimonial }: { testimonial: EnhancedTestimonial }) {
  const resolvedImageUrl = useResolveImageUrl(testimonial.imageId);
  
  // Fallback to a default avatar if no image
  const imageUrl = resolvedImageUrl || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.authorName)}&background=random&size=150`;
  
  return (
    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-primary/10 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Star Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (testimonial.rating || 5)
                  ? "fill-primary text-primary"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Quote Icon */}
        <Quote className="w-10 h-10 text-primary/20 mb-3" />

        {/* Testimonial Text */}
        <p className="text-foreground leading-relaxed mb-6 flex-grow">
          {testimonial.content}
        </p>

        {/* Highlight */}
        {testimonial.highlight && (
          <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg mb-6 font-semibold text-center">
            "{testimonial.highlight}"
          </div>
        )}

        {/* Author */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <img
            src={imageUrl}
            alt={testimonial.authorName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-grow">
            <div className="font-semibold text-foreground">{testimonial.authorName}</div>
            <div className="text-sm text-muted-foreground">{testimonial.authorRelation}</div>
            <div className="text-xs text-primary">{testimonial.communityName}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TestimonialSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Fetch testimonials from API
  const { data: testimonials = [], isLoading } = useQuery<EnhancedTestimonial[]>({
    queryKey: ["/api/testimonials", { featured: true, approved: true }],
    queryFn: async () => {
      const response = await fetch("/api/testimonials?featured=true&approved=true");
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      return response.json();
    },
  });

  // Fetch communities to get names
  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  // Enhance testimonials with community names
  const enhancedTestimonials = testimonials.map(testimonial => ({
    ...testimonial,
    communityName: communities.find(c => c.id === testimonial.communityId)?.name || "Stage Senior"
  }));

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", updateCurrent);
    updateCurrent();

    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !autoPlay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, autoPlay]);

  const scrollPrev = () => {
    api?.scrollPrev();
    setAutoPlay(false);
  };

  const scrollNext = () => {
    api?.scrollNext();
    setAutoPlay(false);
  };

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
    setAutoPlay(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-white via-primary/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  // Don't show the section if no testimonials
  if (enhancedTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-white to-secondary/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-semibold">Real Stories from Real Families</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Why families choose Stage Senior
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Hear directly from residents and families
            who've experienced the Stage Senior difference.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              align: "center",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {enhancedTestimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className={`transition-all duration-500 ${
                    current === index ? 'scale-105' : 'scale-95 opacity-75'
                  }`}>
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 z-10 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 z-10 group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {enhancedTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all duration-300 ${
                current === index
                  ? 'w-8 h-2 bg-primary rounded-full'
                  : 'w-2 h-2 bg-primary/30 rounded-full hover:bg-primary/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary/10">
          <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Join hundreds of happy families
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Experience the Stage Senior difference for yourself. Schedule a tour today and see why families trust us with their loved ones.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Schedule a Tour
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Link href="/reviews">
              <Button size="lg" variant="outline">
                Read More Reviews
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}