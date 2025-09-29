import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/PageHero";
import {
  User,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Star,
  Building,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { TeamMember } from "@shared/schema";

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

// Team member card component
const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const [expanded, setExpanded] = useState(false);
  const avatarUrl = useResolveImageUrl(
    member.avatarImageId ? `/api/images/${member.avatarImageId}` : null
  );

  const bioPreview = member.bio && member.bio.length > 150 
    ? member.bio.substring(0, 150) + "..." 
    : member.bio;

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${
        member.featured ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      data-testid={`team-member-${member.id}`}
    >
      {member.featured && (
        <div className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          <span>Featured Team Member</span>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${member.name} avatar`}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                data-testid={`team-member-avatar-${member.id}`}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-500" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <Link href={`/team/${member.slug}`}>
              <h3 className="text-lg font-bold text-gray-900 truncate hover:text-primary transition-colors cursor-pointer" data-testid={`team-member-name-${member.id}`}>
                {member.name}
              </h3>
            </Link>
            <p className="text-sm font-medium text-primary" data-testid={`team-member-role-${member.id}`}>
              {member.role}
            </p>
            {member.department && (
              <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                <Building className="w-3 h-3" />
                {member.department}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {member.bio && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              {expanded ? member.bio : bioPreview}
            </p>
            {member.bio.length > 150 && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto font-medium text-primary"
                onClick={() => setExpanded(!expanded)}
                data-testid={`team-member-bio-toggle-${member.id}`}
              >
                {expanded ? (
                  <>Show less <ChevronUp className="w-4 h-4 ml-1" /></>
                ) : (
                  <>Read more <ChevronDown className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            )}
          </div>
        )}

        <div className="space-y-2">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              data-testid={`team-member-email-${member.id}`}
            >
              <Mail className="w-4 h-4" />
              <span className="truncate">{member.email}</span>
            </a>
          )}
          
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              data-testid={`team-member-phone-${member.id}`}
            >
              <Phone className="w-4 h-4" />
              <span>{member.phone}</span>
            </a>
          )}
        </div>

        <div className="mt-4">
          <Link href={`/team/${member.slug}`}>
            <Button variant="outline" className="w-full" data-testid={`view-profile-${member.id}`}>
              View Full Profile
            </Button>
          </Link>
        </div>

        {(member.linkedinUrl || member.twitterUrl) && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                aria-label={`${member.name}'s LinkedIn profile`}
                data-testid={`team-member-linkedin-${member.id}`}
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {member.twitterUrl && (
              <a
                href={member.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                aria-label={`${member.name}'s Twitter profile`}
                data-testid={`team-member-twitter-${member.id}`}
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
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

export default function Team() {
  useEffect(() => {
    document.title = "Our Team | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Meet the dedicated professionals at Stage Senior who provide exceptional care and support across our Colorado senior living communities.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Meet the dedicated professionals at Stage Senior who provide exceptional care and support across our Colorado senior living communities.';
      document.head.appendChild(meta);
    }
  }, []);

  // Fetch team members
  const { data: teamMembers = [], isLoading, error } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  // Group team members by tags and sort by priority
  const groupedMembers = useMemo(() => {
    // Filter only active team members
    const activeMembers = teamMembers.filter(member => member.active);
    
    // Create a map of tag to members
    const tagMap = new Map<string, TeamMember[]>();
    
    activeMembers.forEach(member => {
      if (member.tags && Array.isArray(member.tags)) {
        member.tags.forEach(tag => {
          if (!tagMap.has(tag)) {
            tagMap.set(tag, []);
          }
          tagMap.get(tag)!.push(member);
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
  }, [teamMembers]);


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
              <BreadcrumbItem>
                <BreadcrumbPage data-testid="breadcrumb-current">Our Team</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

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
              <p className="text-gray-600 text-lg">No team members found.</p>
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