import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Building,
  MapPin,
} from "lucide-react";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { TeamMember } from "@shared/schema";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

export default function TeamMemberProfile() {
  const { slug } = useParams();

  // Fetch team member data
  const { data: teamMember, isLoading } = useQuery<TeamMember>({
    queryKey: [`/api/team-members/slug/${slug}`],
    enabled: !!slug,
  });

  // Resolve avatar image URL
  const avatarUrl = useResolveImageUrl(teamMember?.avatarImageId);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Get community tags for display
  const communityTags = teamMember?.tags?.filter(tag =>
    ["The Gardens at Columbine", "The Gardens on Quail", "Golden Pond", "Stonebridge Senior"].includes(tag)
  ) || [];

  const otherTags = teamMember?.tags?.filter(tag =>
    !["The Gardens at Columbine", "The Gardens on Quail", "Golden Pond", "Stonebridge Senior"].includes(tag)
  ) || [];

  // Get community color
  const communityColor = getCommunityColor(teamMember?.tags as string[]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <Card>
            <CardHeader className="text-center pb-8">
              <Skeleton className="w-32 h-32 rounded-full mx-auto mb-6" />
              <Skeleton className="h-8 w-64 mx-auto mb-2" />
              <Skeleton className="h-6 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!teamMember) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Team Member Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The team member you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/team">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Team Directory
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" data-testid="breadcrumb-home">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/team" data-testid="breadcrumb-team">Team</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-muted-foreground">{teamMember.name}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Card className="overflow-hidden bg-white shadow-xl" style={{ borderTop: `8px solid ${communityColor || '#6366f1'}` }}>
          <CardHeader
            className="text-center pb-10 pt-16 relative"
            style={{
              background: communityColor
                ? `linear-gradient(to bottom, ${communityColor}08, white 70%)`
                : 'linear-gradient(to bottom, rgb(99 102 241 / 0.03), white 70%)'
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: `${communityColor || '#6366f1'}20` }} />

            <Avatar
              className="w-40 h-40 mx-auto mb-6 ring-4 shadow-2xl"
              style={{ borderColor: communityColor || '#6366f1' }}
              data-testid={`profile-avatar-${teamMember.id}`}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${teamMember.name} portrait`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <AvatarFallback
                  className="text-4xl font-semibold"
                  style={{
                    backgroundColor: communityColor ? `${communityColor}15` : 'rgb(99 102 241 / 0.1)',
                    color: communityColor || '#6366f1'
                  }}
                >
                  {getInitials(teamMember.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <CardTitle className="text-4xl font-bold mb-3" data-testid="profile-name">{teamMember.name}</CardTitle>
            <CardDescription
              className="text-xl font-semibold mb-3"
              style={{ color: communityColor || '#6366f1' }}
              data-testid="profile-role"
            >
              {teamMember.role}
            </CardDescription>
            {teamMember.department && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-700">
                <Building className="w-4 h-4" />
                <span className="font-medium" data-testid="profile-department">{teamMember.department}</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-8 p-10">
            {/* Bio Section */}
            {teamMember.bio && (
              <div className="space-y-4 bg-gray-50 p-6 rounded-lg border-l-4" style={{ borderColor: communityColor || '#6366f1' }}>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: communityColor || '#6366f1' }} />
                  About {teamMember.name.split(' ')[0]}
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line italic" data-testid="profile-bio">
                    "{teamMember.bio}"
                  </p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {(teamMember.email || teamMember.phone) && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: communityColor || '#6366f1' }} />
                  Get in Touch
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMember.email && (
                    <a
                      href={`mailto:${teamMember.email}`}
                      className="flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-lg hover:-translate-y-1"
                      style={{
                        borderColor: `${communityColor || '#6366f1'}40`,
                        backgroundColor: `${communityColor || '#6366f1'}05`
                      }}
                      data-testid="profile-email"
                    >
                      <div
                        className="flex items-center justify-center w-12 h-12 rounded-full"
                        style={{ backgroundColor: communityColor || '#6366f1' }}
                      >
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-500 uppercase">Email</div>
                        <div className="font-medium text-gray-900 truncate">{teamMember.email}</div>
                      </div>
                    </a>
                  )}
                  {teamMember.phone && (
                    <a
                      href={`tel:${teamMember.phone}`}
                      className="flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-lg hover:-translate-y-1"
                      style={{
                        borderColor: `${communityColor || '#6366f1'}40`,
                        backgroundColor: `${communityColor || '#6366f1'}05`
                      }}
                      data-testid="profile-phone"
                    >
                      <div
                        className="flex items-center justify-center w-12 h-12 rounded-full"
                        style={{ backgroundColor: communityColor || '#6366f1' }}
                      >
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase">Phone</div>
                        <div className="font-medium text-gray-900">{teamMember.phone}</div>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(teamMember.linkedinUrl || teamMember.twitterUrl) && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: communityColor || '#6366f1' }} />
                  Connect on Social Media
                </h2>
                <div className="flex gap-4">
                  {teamMember.linkedinUrl && (
                    <a
                      href={teamMember.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-1"
                      style={{ backgroundColor: communityColor || '#6366f1' }}
                      data-testid="profile-linkedin"
                    >
                      <Linkedin className="w-5 h-5" />
                      LinkedIn
                    </a>
                  )}
                  {teamMember.twitterUrl && (
                    <a
                      href={teamMember.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-1"
                      style={{ backgroundColor: communityColor || '#6366f1' }}
                      data-testid="profile-twitter"
                    >
                      <Twitter className="w-5 h-5" />
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Community Associations */}
            {communityTags.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: communityColor || '#6366f1' }} />
                  {communityTags.length === 1 ? 'Community' : 'Communities'}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {communityTags.map((tag) => {
                    const tagColor = COMMUNITY_COLORS[tag];
                    return (
                      <div
                        key={tag}
                        className="inline-flex items-center gap-3 px-5 py-3 rounded-lg text-base font-semibold text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                        style={{ backgroundColor: tagColor || communityColor || '#6366f1' }}
                        data-testid={`profile-community-${tag}`}
                      >
                        <MapPin className="w-5 h-5" />
                        {tag}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Other Tags */}
            {otherTags.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: communityColor || '#6366f1' }} />
                  Areas of Expertise
                </h2>
                <div className="flex flex-wrap gap-3">
                  {otherTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white border-2 shadow-sm hover:shadow-md transition-all"
                      style={{
                        borderColor: communityColor || '#6366f1',
                        color: communityColor || '#6366f1'
                      }}
                      data-testid={`profile-tag-${tag}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to Team Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href="/team">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Team Directory
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}