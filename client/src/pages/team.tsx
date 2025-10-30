import { useMemo, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/PageHero";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Star,
  Building,
  X,
  MapPin,
} from "lucide-react";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { setMetaTags, getCanonicalUrl } from "@/lib/metaTags";
import type { TeamMember, Community } from "@shared/schema";

// Tag priority configuration
const TAG_PRIORITY = {
  // Primary management
  "Stage Management": 1,
  
  // Communities (in order)
  "The Gardens at Columbine": 10,
  "The Gardens on Quail": 11,
  "Golden Pond": 12,
  "Stonebridge Senior": 13,
  
  // Departments
  "Medical Care": 20,
  "Administration": 21,
  "Activities": 22,
  "Dining": 23,
  "Maintenance": 24,
};

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

// Team member card component
const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const avatarUrl = useResolveImageUrl(member.avatarImageId);
  const communityColor = getCommunityColor(member.tags as string[]);

  const bioPreview = member.bio && member.bio.length > 120
    ? member.bio.substring(0, 120) + "..."
    : member.bio;

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white ${
        member.featured ? 'ring-2 shadow-lg' : ''
      }`}
      style={{
        borderTop: `6px solid ${communityColor || '#2B334B'}`,
        ...(member.featured && { borderColor: communityColor || '#2B334B' })
      }}
      data-testid={`team-member-${member.id}`}
    >
      {member.featured && (
        <div
          className="text-white px-4 py-2 text-xs font-semibold flex items-center gap-2"
          style={{ backgroundColor: communityColor || '#2B334B' }}
        >
          <Star className="w-4 h-4 fill-current" />
          <span>Featured Team Member</span>
        </div>
      )}

      <CardHeader className="pb-3 pt-6 text-center">
        <Link href={`/team/${member.slug}`} className="inline-block">
          <div className="relative mx-auto w-28 h-28 mb-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${member.name}`}
                className="w-full h-full rounded-full object-cover border-4 shadow-lg transition-transform duration-300 group-hover:scale-105"
                style={{ borderColor: communityColor || '#e5e7eb' }}
                loading="lazy"
                data-testid={`team-member-avatar-${member.id}`}
              />
            ) : (
              <div
                className="w-full h-full rounded-full flex items-center justify-center border-4 shadow-lg transition-transform duration-300 group-hover:scale-105"
                style={{
                  borderColor: communityColor || '#e5e7eb',
                  backgroundColor: communityColor ? `${communityColor}15` : '#f3f4f6'
                }}
              >
                <User className="w-12 h-12" style={{ color: communityColor || '#2B334B' }} />
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-1 hover:underline decoration-2"
              style={{ textDecorationColor: communityColor || '#2B334B' }}
              data-testid={`team-member-name-${member.id}`}>
            {member.name}
          </h3>
        </Link>
        <p className="text-sm font-semibold mb-1"
           style={{ color: communityColor || '#2B334B' }}
           data-testid={`team-member-role-${member.id}`}>
          {member.role}
        </p>
        {member.department && (
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Building className="w-3 h-3" />
            {member.department}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {member.bio && (
          <div className="text-center px-2">
            <p className="text-sm text-gray-600 leading-relaxed italic">
              "{bioPreview}"
            </p>
          </div>
        )}

        <div className="space-y-2 px-2">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:font-medium transition-all"
              style={{ color: communityColor || '#2B334B' }}
              data-testid={`team-member-email-${member.id}`}
            >
              <Mail className="w-4 h-4" />
              <span className="truncate">Email Me</span>
            </a>
          )}

          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:font-medium transition-all"
              style={{ color: communityColor || '#2B334B' }}
              data-testid={`team-member-phone-${member.id}`}
            >
              <Phone className="w-4 h-4" />
              <span>{member.phone}</span>
            </a>
          )}
        </div>

        {(member.linkedinUrl || member.twitterUrl) && (
          <div className="flex gap-3 justify-center pt-2">
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:text-white transition-all hover:shadow-md"
                style={{
                  ['--hover-bg' as string]: communityColor || '#2B334B'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = communityColor || '#2B334B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                aria-label={`${member.name}'s LinkedIn profile`}
                data-testid={`team-member-linkedin-${member.id}`}
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {member.twitterUrl && (
              <a
                href={member.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:text-white transition-all hover:shadow-md"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = communityColor || '#2B334B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                aria-label={`${member.name}'s Twitter profile`}
                data-testid={`team-member-twitter-${member.id}`}
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>
        )}

        <div className="pt-2">
          <Link href={`/team/${member.slug}`}>
            <Button
              className="w-full font-semibold transition-all hover:shadow-md"
              style={{ backgroundColor: communityColor || '#2B334B' }}
              data-testid={`view-profile-${member.id}`}
            >
              View Full Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

// Team section component
const TeamSection = ({ 
  tag, 
  members 
}: { 
  tag: string; 
  members: TeamMember[] 
}) => {
  // Sort members by sortOrder, then by featured status, then by name
  const sortedMembers = [...members].sort((a, b) => {
    if ((a.sortOrder ?? 0) !== (b.sortOrder ?? 0)) {
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    }
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <section className="mb-12" data-testid={`team-section-${tag.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{tag}</h2>
        <Separator className="w-24 h-1 bg-primary" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedMembers.map((member) => (
          <TeamMemberCard key={`${tag}-${member.id}`} member={member} />
        ))}
      </div>
    </section>
  );
};

// Helper function to convert slug to community name
function slugToCommunityName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Team() {
  // Get query parameters
  const searchParams = useSearch();
  const urlParams = new URLSearchParams(searchParams);
  const communitySlug = urlParams.get('community');
  const communityName = communitySlug ? slugToCommunityName(communitySlug) : null;

  useEffect(() => {
    const title = communityName 
      ? `${communityName} Team | Stage Senior` 
      : "Our Team | Stage Senior";
    const description = communityName
      ? `Meet the dedicated professionals at ${communityName} who provide exceptional care and support to our residents.`
      : 'Meet the dedicated professionals at Stage Senior who provide exceptional care and support across our Colorado senior living communities.';
    const path = communitySlug ? `/team?community=${communitySlug}` : '/team';
    
    setMetaTags({
      title,
      description,
      canonicalUrl: getCanonicalUrl(path),
      ogType: "website",
    });
  }, [communityName, communitySlug]);

  // Fetch team members
  const { data: teamMembers = [], isLoading, error } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  // Fetch community data to get proper name
  const { data: communityData } = useQuery<Community>({
    queryKey: [`/api/communities/${communitySlug}`],
    enabled: !!communitySlug,
  });

  // Use actual community name if available, otherwise use converted slug
  const displayCommunityName = communityData?.name || communityName;

  // Group team members by tags and sort by priority
  const groupedMembers = useMemo(() => {
    // Filter only active team members
    let activeMembers = teamMembers.filter(member => member.active);
    
    // If community filter is active, filter members by community tag
    if (displayCommunityName) {
      activeMembers = activeMembers.filter(member => 
        member.tags && member.tags.some(tag => {
          // Exact match
          if (tag.toLowerCase() === displayCommunityName.toLowerCase()) {
            return true;
          }
          
          // Match with or without "The" prefix for community names
          const normalizedTag = tag.toLowerCase().replace(/^the\s+/, '');
          const normalizedDisplayName = displayCommunityName.toLowerCase().replace(/^the\s+/, '');
          
          return normalizedTag === normalizedDisplayName;
        })
      );
    }
    
    // Create a map of tag to members
    const tagMap = new Map<string, TeamMember[]>();
    
    activeMembers.forEach(member => {
      if (member.tags && Array.isArray(member.tags)) {
        member.tags.forEach(tag => {
          // Skip "Community Leadership" tag
          if (tag.toLowerCase() === 'community leadership') {
            return;
          }
          
          // If filtering by community, only show that community's tag
          if (displayCommunityName) {
            // Exact match or match without "The" prefix
            const normalizedTag = tag.toLowerCase().replace(/^the\s+/, '');
            const normalizedDisplayName = displayCommunityName.toLowerCase().replace(/^the\s+/, '');
            
            if (tag.toLowerCase() === displayCommunityName.toLowerCase() || normalizedTag === normalizedDisplayName) {
              if (!tagMap.has(tag)) {
                tagMap.set(tag, []);
              }
              tagMap.get(tag)!.push(member);
            }
          } else {
            // Normal grouping when not filtered
            if (!tagMap.has(tag)) {
              tagMap.set(tag, []);
            }
            tagMap.get(tag)!.push(member);
          }
        });
      }
    });

    // Sort tags by priority
    const sortedTags = Array.from(tagMap.keys()).sort((a, b) => {
      const priorityA = TAG_PRIORITY[a as keyof typeof TAG_PRIORITY] ?? 999;
      const priorityB = TAG_PRIORITY[b as keyof typeof TAG_PRIORITY] ?? 999;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return a.localeCompare(b);
    });

    return sortedTags.map(tag => ({
      tag,
      members: tagMap.get(tag) || []
    }));
  }, [teamMembers, displayCommunityName, communityName]);


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading team members. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        pagePath="/team"
        defaultTitle="Our Team"
        defaultSubtitle="Dedicated Professionals Committed to Care"
        defaultBackgroundImage="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=2000&q=80"
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb data-testid="breadcrumb-navigation">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" data-testid="breadcrumb-home">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {displayCommunityName ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/communities" data-testid="breadcrumb-communities">Communities</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/communities/${communitySlug}`} data-testid="breadcrumb-community">
                        {displayCommunityName}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage data-testid="breadcrumb-current">Team</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage data-testid="breadcrumb-current">Our Team</BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Community Filter Alert */}
      {displayCommunityName && (
        <div className="bg-primary/5 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Alert className="border-primary/20 bg-white">
              <MapPin className="h-4 w-4 text-primary" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Showing team members from </span>
                  <span className="font-bold text-primary">{displayCommunityName}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild 
                  className="ml-4"
                  data-testid="clear-filter-button"
                >
                  <Link href="/team">
                    <X className="w-4 h-4 mr-1" />
                    Clear Filter
                  </Link>
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* Team Members Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-12">
              {[1, 2, 3].map((section) => (
                <div key={section}>
                  <Skeleton className="h-8 w-48 mb-6" />
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <Skeleton className="w-20 h-20 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="h-6 w-32 mb-2" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-20 w-full mb-4" />
                          <Skeleton className="h-4 w-40" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : groupedMembers.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {displayCommunityName 
                  ? `No team members found for ${displayCommunityName}.` 
                  : "No team members found."}
              </p>
              {displayCommunityName && (
                <Button 
                  variant="outline" 
                  asChild 
                  className="mt-4"
                  data-testid="view-all-team-button"
                >
                  <Link href="/team">
                    View All Team Members
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {groupedMembers.map(({ tag, members }) => (
                <TeamSection key={tag} tag={tag} members={members} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}