import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star, Filter } from "lucide-react";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { Testimonial, Community } from "@shared/schema";

type TestimonialWithCommunity = Testimonial & {
  communityName?: string;
};

export default function FamilyStories() {
  const [selectedCommunity, setSelectedCommunity] = useState<string>("all");

  useEffect(() => {
    document.title = "Family Stories & Reviews | Real Experiences at Stage Senior";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read authentic stories from families who have chosen Stage Senior communities. Discover real experiences, reviews, and testimonials from residents and their loved ones.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Read authentic stories from families who have chosen Stage Senior communities. Discover real experiences, reviews, and testimonials from residents and their loved ones.';
      document.head.appendChild(meta);
    }
  }, []);

  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials", { approved: true }],
    queryFn: async () => {
      const response = await fetch("/api/testimonials?approved=true");
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      return response.json();
    },
  });

  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  const enhancedTestimonials: TestimonialWithCommunity[] = testimonials
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (a.sortOrder || 999) - (b.sortOrder || 999);
    })
    .map(testimonial => ({
      ...testimonial,
      communityName: testimonial.communityId
        ? communities.find(c => c.id === testimonial.communityId)?.name
        : "Stage Senior",
    }));

  const filteredTestimonials = selectedCommunity === "all"
    ? enhancedTestimonials
    : enhancedTestimonials.filter(t => t.communityId === selectedCommunity);

  const communitiesWithTestimonials = communities.filter(c =>
    testimonials.some(t => t.communityId === c.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <PageHero
        pagePath="/family-stories-and-reviews"
        defaultTitle="Families Share Their Stories"
        defaultSubtitle="Real experiences from families who chose Stage Senior"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Filter by Community</h3>
          </div>
          <div className="flex flex-wrap gap-2" data-testid="community-filter">
            <Button
              variant={selectedCommunity === "all" ? "default" : "outline"}
              onClick={() => setSelectedCommunity("all")}
              data-testid="filter-all"
            >
              All Communities ({enhancedTestimonials.length})
            </Button>
            {communitiesWithTestimonials.map((community) => {
              const count = testimonials.filter(t => t.communityId === community.id).length;
              return (
                <Button
                  key={community.id}
                  variant={selectedCommunity === community.id ? "default" : "outline"}
                  onClick={() => setSelectedCommunity(community.id)}
                  data-testid={`filter-${community.slug}`}
                >
                  {community.name} ({count})
                </Button>
              );
            })}
          </div>
        </div>

        {testimonialsLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredTestimonials.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" data-testid="testimonials-grid">
            {filteredTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No testimonials found for this community.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialWithCommunity }) {
  const imageUrl = useResolveImageUrl(testimonial.imageId);
  const authorInitials = testimonial.authorName
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || '??';

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'fill-primary text-primary'
                : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card 
      className="group h-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-xl border-primary/10"
      data-testid={`testimonial-${testimonial.id}`}
    >
      <CardContent className="p-6 flex flex-col h-full">
        {testimonial.featured && (
          <div className="mb-4">
            <Badge variant="default" className="bg-primary/90">
              Featured Review
            </Badge>
          </div>
        )}

        {testimonial.highlight && (
          <div className="mb-4">
            <div className="relative">
              <span className="text-4xl text-primary/20 absolute -top-2 -left-2">"</span>
              <p className="text-lg font-semibold text-primary pl-6 pr-2 italic">
                {testimonial.highlight}
              </p>
            </div>
            <Separator className="mt-4" />
          </div>
        )}

        <div className="flex-grow mb-6">
          <p className="text-gray-700 leading-relaxed">
            {testimonial.content}
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              {imageUrl !== null && imageUrl !== undefined ? (
                <AvatarImage src={imageUrl} alt={testimonial.authorName || 'Author'} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-foreground">
                  {testimonial.authorName}
                </p>
                {renderStars(testimonial.rating || 5)}
              </div>
              <p className="text-sm text-muted-foreground">
                {testimonial.authorRelation}
              </p>
              {testimonial.communityName && (
                <p className="text-sm text-primary mt-1">
                  {testimonial.communityName}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
