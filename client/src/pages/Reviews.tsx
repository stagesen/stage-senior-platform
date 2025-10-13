import { useQuery } from '@tanstack/react-query';
import type { Testimonial, Community } from '@shared/schema';
import { Card } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useResolveImageUrl } from '@/hooks/useResolveImageUrl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { PageHero } from '@/components/PageHero';

type TestimonialWithCommunity = Testimonial & {
  communityName?: string;
};

export default function Reviews() {
  // Fetch all approved testimonials
  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  // Fetch communities to map names
  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ['/api/communities'],
  });

  // Filter for approved testimonials and add community names
  const approvedTestimonials: TestimonialWithCommunity[] = testimonials
    .filter(t => t.approved)
    .sort((a, b) => {
      // Sort by featured first, then by sortOrder
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (a.sortOrder || 999) - (b.sortOrder || 999);
    })
    .map(testimonial => ({
      ...testimonial,
      communityName: testimonial.communityId
        ? communities.find(c => c.id === testimonial.communityId)?.name
        : undefined,
    }));

  if (testimonialsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse">
            <div className="h-12 bg-muted rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-muted rounded w-96 mx-auto mb-16"></div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <PageHero
        pagePath="/reviews"
        defaultTitle="Resident & Family Reviews"
        defaultSubtitle="Hear from our community"
        defaultDescription="Read testimonials from residents and their families about life at Stage Senior communities"
      />
      <div className="container mx-auto px-4 py-20">

        {/* Statistics Bar */}
        {approvedTestimonials.length > 0 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 mb-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {approvedTestimonials.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {(approvedTestimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / approvedTestimonials.length).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Resident Satisfaction</div>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Grid */}
        {approvedTestimonials.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {approvedTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No reviews available yet.</p>
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
          <StarIcon
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
    <Card className="group h-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-xl border-primary/10">
      <div className="p-6 flex flex-col h-full">
        {/* Featured Badge */}
        {testimonial.featured && (
          <div className="mb-4">
            <Badge variant="default" className="bg-primary/90">
              Featured Review
            </Badge>
          </div>
        )}

        {/* Highlight Quote */}
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

        {/* Main Content */}
        <div className="flex-grow mb-6">
          <p className="text-gray-700 leading-relaxed">
            {testimonial.content}
          </p>
        </div>

        {/* Author Info */}
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
      </div>
    </Card>
  );
}