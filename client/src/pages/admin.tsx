import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminDashboard from "@/components/AdminDashboard";
import PageGalleryAdmin from "@/components/PageGalleryAdmin";
import PageContentManager from "@/components/PageContentManager";
import { useAuth } from "@/lib/auth";
import { 
  Users, 
  Calendar, 
  FileText, 
  HelpCircle, 
  Camera, 
  TrendingUp,
  Phone,
  Mail,
  LogOut,
  User,
  Image
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Community, Post, Event, TourRequest, Faq, Gallery, Testimonial, PageHero, FloorPlan } from "@shared/schema";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, logout } = useAuth();

  // Fetch data for dashboard stats
  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: tourRequests = [] } = useQuery<TourRequest[]>({
    queryKey: ["/api/tour-requests"],
  });

  const { data: faqs = [] } = useQuery<Faq[]>({
    queryKey: ["/api/faqs"],
  });

  const { data: galleries = [] } = useQuery<Gallery[]>({
    queryKey: ["/api/galleries"],
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const { data: pageHeroes = [] } = useQuery<PageHero[]>({
    queryKey: ["/api/page-heroes"],
  });

  const { data: floorPlans = [] } = useQuery<FloorPlan[]>({
    queryKey: ["/api/floor-plans"],
  });

  // Calculate stats
  const stats = {
    totalCommunities: communities.length,
    activeCommunities: communities.filter(c => c.active).length,
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.published).length,
    upcomingEvents: events.filter(e => new Date(e.startsAt) > new Date()).length,
    totalEvents: events.length,
    pendingTours: tourRequests.filter(t => t.status === "pending").length,
    totalTours: tourRequests.length,
    activeFaqs: faqs.filter(f => f.active).length,
    totalFaqs: faqs.length,
    activeGalleries: galleries.filter(g => g.active).length,
    totalGalleries: galleries.length,
    approvedTestimonials: testimonials.filter(t => t.approved).length,
    totalTestimonials: testimonials.length,
    activePageHeroes: pageHeroes.filter(h => h.active).length,
    totalPageHeroes: pageHeroes.length,
    activeFloorPlans: floorPlans.filter(f => f.active).length,
    totalFloorPlans: floorPlans.length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="admin-title">
                Stage Senior Admin
              </h1>
              <p className="text-muted-foreground mt-2" data-testid="admin-description">
                Manage communities, content, and user inquiries
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground" data-testid="user-info">
                  {user?.username || 'Admin'}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 p-1" data-testid="admin-tabs">
            <TabsTrigger value="dashboard" data-testid="tab-dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="communities" data-testid="tab-communities">Communities</TabsTrigger>
            <TabsTrigger value="posts" data-testid="tab-posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="team" data-testid="tab-team">Team</TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
            <TabsTrigger value="tours" data-testid="tab-tours">Tour Requests</TabsTrigger>
            <TabsTrigger value="floor-plans" data-testid="tab-floor-plans">Floor Plans</TabsTrigger>
            <TabsTrigger value="faqs" data-testid="tab-faqs">FAQs</TabsTrigger>
            <TabsTrigger value="galleries" data-testid="tab-galleries">Galleries</TabsTrigger>
            <TabsTrigger value="testimonials" data-testid="tab-testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="page-heroes" data-testid="tab-page-heroes" className="bg-primary text-primary-foreground hover:bg-primary/90">Page Heroes</TabsTrigger>
            <TabsTrigger value="care-types" data-testid="tab-care-types">Care Types</TabsTrigger>
            <TabsTrigger value="amenities" data-testid="tab-amenities">Amenities</TabsTrigger>
            <TabsTrigger value="page-content" data-testid="tab-page-content" className="bg-primary text-primary-foreground hover:bg-primary/90">Page Content</TabsTrigger>
            <TabsTrigger value="homepage" data-testid="tab-homepage">Homepage</TabsTrigger>
            <TabsTrigger value="email-recipients" data-testid="tab-email-recipients">Email Recipients</TabsTrigger>
            <TabsTrigger value="landing-pages" data-testid="tab-landing-pages" className="bg-primary text-primary-foreground hover:bg-primary/90">Landing Pages</TabsTrigger>
            <TabsTrigger value="image-gallery" data-testid="tab-image-gallery">
              <Image className="h-4 w-4 mr-1" />
              Image Gallery
            </TabsTrigger>
            <TabsTrigger value="database-sync" data-testid="tab-database-sync" className="bg-amber-500 text-white hover:bg-amber-600">
              Database Sync
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Communities Stats */}
              <Card data-testid="stats-communities">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Communities</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeCommunities}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeCommunities} of {stats.totalCommunities} active
                  </p>
                </CardContent>
              </Card>

              {/* Blog Posts Stats */}
              <Card data-testid="stats-posts">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.publishedPosts}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.publishedPosts} of {stats.totalPosts} published
                  </p>
                </CardContent>
              </Card>

              {/* Events Stats */}
              <Card data-testid="stats-events">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.upcomingEvents} upcoming of {stats.totalEvents} total
                  </p>
                </CardContent>
              </Card>

              {/* Tour Requests Stats */}
              <Card data-testid="stats-tours">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tour Requests</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingTours}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingTours} pending of {stats.totalTours} total
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Tour Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center" data-testid="recent-tours-title">
                    <Phone className="w-5 h-5 mr-2" />
                    Recent Tour Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tourRequests.slice(0, 5).map((request) => {
                      const community = communities.find(c => c.id === request.communityId);
                      return (
                        <div key={request.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium text-foreground" data-testid={`tour-request-name-${request.id}`}>
                              {request.name}
                            </p>
                            <p className="text-sm text-muted-foreground" data-testid={`tour-request-community-${request.id}`}>
                              {community?.name || "General Inquiry"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(request.createdAt || new Date()).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge 
                            variant={request.status === "pending" ? "default" : "secondary"}
                            data-testid={`tour-request-status-${request.id}`}
                          >
                            {request.status}
                          </Badge>
                        </div>
                      );
                    })}
                    {tourRequests.length === 0 && (
                      <p className="text-muted-foreground text-center py-4" data-testid="no-tour-requests">
                        No tour requests yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle data-testid="quick-actions-title">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("communities")}
                    data-testid="button-add-community"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Add New Community
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("posts")}
                    data-testid="button-add-post"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create Blog Post
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("events")}
                    data-testid="button-add-event"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Event
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("faqs")}
                    data-testid="button-add-faq"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Add FAQ
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("galleries")}
                    data-testid="button-add-gallery"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Create Gallery
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("image-gallery")}
                    data-testid="button-manage-images"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Manage Images
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("page-content")}
                    data-testid="button-page-content"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Edit Page Content
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Management Tabs */}
          <TabsContent value="communities">
            <AdminDashboard type="communities" />
          </TabsContent>

          <TabsContent value="posts">
            <AdminDashboard type="blog-posts" />
          </TabsContent>

          <TabsContent value="team">
            <AdminDashboard type="team" />
          </TabsContent>

          <TabsContent value="events">
            <AdminDashboard type="events" />
          </TabsContent>

          <TabsContent value="tours">
            <AdminDashboard type="tours" />
          </TabsContent>

          <TabsContent value="floor-plans">
            <AdminDashboard type="floor-plans" />
          </TabsContent>

          <TabsContent value="faqs">
            <AdminDashboard type="faqs" />
          </TabsContent>

          <TabsContent value="galleries">
            <AdminDashboard type="galleries" />
          </TabsContent>

          <TabsContent value="testimonials">
            <AdminDashboard type="testimonials" />
          </TabsContent>

          <TabsContent value="page-heroes">
            <AdminDashboard type="page-heroes" />
          </TabsContent>

          <TabsContent value="care-types">
            <AdminDashboard type="care-types" />
          </TabsContent>

          <TabsContent value="amenities">
            <AdminDashboard type="amenities" />
          </TabsContent>

          <TabsContent value="homepage">
            <AdminDashboard type="homepage" />
          </TabsContent>

          <TabsContent value="page-content">
            <PageContentManager />
          </TabsContent>

          <TabsContent value="email-recipients">
            <AdminDashboard type="email-recipients" />
          </TabsContent>

          <TabsContent value="landing-pages">
            <AdminDashboard type="landing-pages" />
          </TabsContent>

          <TabsContent value="image-gallery">
            <PageGalleryAdmin />
          </TabsContent>

          <TabsContent value="database-sync">
            <AdminDashboard type="database-sync" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
