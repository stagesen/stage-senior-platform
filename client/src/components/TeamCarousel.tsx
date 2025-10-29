import { useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Building } from "lucide-react";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { Link } from "wouter";
import type { TeamMember } from "@shared/schema";

interface TeamCarouselProps {
  filterTag?: string;
  title?: string;
  subtitle?: string;
}

// Community color mapping
const COMMUNITY_COLORS: Record<string, string> = {
  "The Gardens on Quail": "#1a464c",
  "Gardens on Quail": "#1a464c",
  "Golden Pond": "#2c417f",
  "Gardens at Columbine": "#43238b",
  "The Gardens at Columbine": "#43238b",
  "Stonebridge Senior": "#0e1824",
};

// Helper function to get community color from tags
const getCommunityColor = (tags?: string[]): string | null => {
  if (!tags) return null;

  for (const tag of tags) {
    const color = COMMUNITY_COLORS[tag];
    if (color) return color;
  }
  return null;
};

// Single team member card with avatar image
const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const avatarUrl = useResolveImageUrl(member.avatarImageId);
  const communityColor = getCommunityColor(member.tags as string[]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Link href={`/team/${member.slug}`}>
      <Card
        className="group text-center p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full cursor-pointer bg-white"
        style={{ borderTop: `5px solid ${communityColor || '#6366f1'}` }}
        data-testid={`carousel-member-${member.id}`}
      >
        <CardContent className="pt-6">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Avatar
              className="w-full h-full border-4 shadow-lg transition-transform duration-300 group-hover:scale-110"
              style={{ borderColor: communityColor || '#e5e7eb' }}
              data-testid={`carousel-avatar-${member.id}`}
              aria-label={`Portrait of ${member.name}`}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${member.name} portrait`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <AvatarFallback
                  className="text-xl font-semibold"
                  style={{
                    backgroundColor: communityColor ? `${communityColor}15` : '#f3f4f6',
                    color: communityColor || '#6366f1'
                  }}
                >
                  {getInitials(member.name)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <h3 className="font-bold text-xl mb-2 group-hover:underline decoration-2"
              style={{ textDecorationColor: communityColor || '#6366f1' }}
              data-testid={`carousel-member-name-${member.id}`}>
            {member.name}
          </h3>
          <p className="text-base font-semibold mb-3"
             style={{ color: communityColor || '#6366f1' }}
             data-testid={`carousel-member-role-${member.id}`}>
            {member.role}
          </p>
          {member.department && (
            <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
              <Building className="w-4 h-4" />
              {member.department}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export function TeamCarousel({ 
  filterTag = "Stage Management",
  title = "Our Leadership Team",
  subtitle = "Elevating Senior Care Across Colorado"
}: TeamCarouselProps) {
  // Fetch team members
  const { data: allMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });
  
  // Filter team members by tag and sort them
  const teamMembers = allMembers
    .filter(member => member.active && member.tags && member.tags.includes(filterTag))
    .sort((a, b) => {
      // Sort by sortOrder first, then by featured status, then by name
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  
  // Embla carousel setup with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: false,
    }
  );
  
  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi || teamMembers.length === 0) return;
    
    let autoplayTimer: NodeJS.Timeout;
    let isPaused = false;
    
    const startAutoplay = () => {
      if (!isPaused) {
        autoplayTimer = setTimeout(() => {
          emblaApi.scrollNext();
          startAutoplay();
        }, 4000); // Change slide every 4 seconds
      }
    };
    
    const stopAutoplay = () => {
      clearTimeout(autoplayTimer);
    };
    
    const handleMouseEnter = () => {
      isPaused = true;
      stopAutoplay();
    };
    
    const handleMouseLeave = () => {
      isPaused = false;
      startAutoplay();
    };
    
    // Add event listeners for hover
    const container = emblaRef.current;
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }
    
    // Start autoplay
    startAutoplay();
    
    // Cleanup
    return () => {
      stopAutoplay();
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [emblaApi, teamMembers.length]);
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  
  if (isLoading) {
    return (
      <div>
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="text-center p-8">
              <CardContent className="pt-6">
                <Skeleton className="w-32 h-32 rounded-full mx-auto mb-6" />
                <Skeleton className="h-7 w-36 mx-auto mb-3" />
                <Skeleton className="h-5 w-32 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (teamMembers.length === 0) {
    return null;
  }
  
  return (
    <div>
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="team-title">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground" data-testid="team-subtitle">
          {subtitle}
        </p>
      </div>
      
      {/* Carousel Container */}
      <div className="relative mb-8">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 bg-background shadow-lg hover:shadow-xl"
          onClick={scrollPrev}
          aria-label="Previous team member"
          data-testid="carousel-prev-button"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Next Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 bg-background shadow-lg hover:shadow-xl"
          onClick={scrollNext}
          aria-label="Next team member"
          data-testid="carousel-next-button"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.333%] px-3"
              >
                <TeamMemberCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* View All Button */}
      <div className="text-center">
        <Button asChild size="lg" variant="outline" data-testid="button-view-all-team">
          <Link href="/team">
            View All Team Members
          </Link>
        </Button>
      </div>
    </div>
  );
}