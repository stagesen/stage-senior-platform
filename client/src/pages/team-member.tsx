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

export default function TeamMemberProfile() {
  const { slug } = useParams();

  // Fetch team member data
  const { data: teamMember, isLoading } = useQuery<TeamMember>({
    queryKey: [`/api/team-members/slug/${slug}`],
    enabled: !!slug,
  });

  // Resolve avatar image URL
  const avatarUrl = useResolveImageUrl(
    teamMember?.avatarImageId ? `/api/images/${teamMember.avatarImageId}` : null
  );

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

        <Card className="overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-b from-primary/5 to-background pb-8 pt-12">
            <Avatar className="w-32 h-32 mx-auto mb-6 ring-4 ring-background shadow-xl" data-testid={`profile-avatar-${teamMember.id}`}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${teamMember.name} portrait`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
                  {getInitials(teamMember.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <CardTitle className="text-3xl mb-2" data-testid="profile-name">{teamMember.name}</CardTitle>
            <CardDescription className="text-lg font-medium" data-testid="profile-role">{teamMember.role}</CardDescription>
            {teamMember.department && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground mt-2">
                <Building className="w-4 h-4" />
                <span data-testid="profile-department">{teamMember.department}</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6 p-8">
            {/* Bio Section */}
            {teamMember.bio && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line" data-testid="profile-bio">
                    {teamMember.bio}
                  </p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {(teamMember.email || teamMember.phone) && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <div className="space-y-3">
                  {teamMember.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${teamMember.email}`} className="text-primary hover:underline" data-testid="profile-email">
                        {teamMember.email}
                      </a>
                    </div>
                  )}
                  {teamMember.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${teamMember.phone}`} className="text-primary hover:underline" data-testid="profile-phone">
                        {teamMember.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(teamMember.linkedinUrl || teamMember.twitterUrl) && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Connect</h2>
                <div className="flex gap-4">
                  {teamMember.linkedinUrl && (
                    <a
                      href={teamMember.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
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
                      className="flex items-center gap-2 text-primary hover:underline"
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
                <h2 className="text-xl font-semibold">Communities</h2>
                <div className="flex flex-wrap gap-3">
                  {communityTags.map((tag) => (
                    <div
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      data-testid={`profile-community-${tag}`}
                    >
                      <MapPin className="w-3 h-3" />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Tags */}
            {otherTags.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Areas of Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {otherTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
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