import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import AdminDashboard from "@/components/AdminDashboard";
import PageGalleryAdmin from "@/components/PageGalleryAdmin";
import PageContentManager from "@/components/PageContentManager";
import GoogleAdsManager from "@/components/GoogleAdsManager";
import ExitIntentPopupManager from "@/components/ExitIntentPopupManager";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUploader from "@/components/ImageUploader";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
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
  Image,
  Target,
  ExternalLink,
  Globe,
  ClipboardList,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Upload,
  Download,
  FileType,
  Check,
  X
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Community, Post, Event, TourRequest, Faq, Gallery, Testimonial, PageHero, FloorPlan, TeamMember, LandingPageTemplate, Quiz, QuizQuestion, QuizAnswerOption, QuizResponse, InsertQuiz, InsertQuizQuestion, InsertQuizAnswerOption, ContentAsset, InsertContentAsset, AssetDownload, SiteSettings, InsertSiteSettings } from "@shared/schema";
import { insertQuizSchema, insertContentAssetSchema, insertSiteSettingsSchema } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

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
    // Shorter cache for admin dashboard to see updates more quickly
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: floorPlans = [] } = useQuery<FloorPlan[]>({
    queryKey: ["/api/floor-plans"],
  });

  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  const { data: landingPages = [] } = useQuery<LandingPageTemplate[]>({
    queryKey: ["/api/landing-pages"],
  });

  // Fetch all expanded landing page URLs
  const { data: allLandingPageUrls = [] } = useQuery<Array<{ url: string; title: string; templateSlug: string }>>({
    queryKey: ["/api/landing-page-templates/all-urls"],
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
            <TabsTrigger value="social-posts" data-testid="tab-social-posts">Social Posts</TabsTrigger>
            <TabsTrigger value="page-heroes" data-testid="tab-page-heroes" className="bg-primary text-primary-foreground hover:bg-primary/90">Page Heroes</TabsTrigger>
            <TabsTrigger value="care-types" data-testid="tab-care-types">Care Types</TabsTrigger>
            <TabsTrigger value="amenities" data-testid="tab-amenities">Amenities</TabsTrigger>
            <TabsTrigger value="page-content" data-testid="tab-page-content" className="bg-primary text-primary-foreground hover:bg-primary/90">Page Content</TabsTrigger>
            <TabsTrigger value="homepage" data-testid="tab-homepage">Homepage</TabsTrigger>
            <TabsTrigger value="email-recipients" data-testid="tab-email-recipients">Email Recipients</TabsTrigger>
            <TabsTrigger value="landing-pages" data-testid="tab-landing-pages" className="bg-primary text-primary-foreground hover:bg-primary/90">Landing Pages</TabsTrigger>
            <TabsTrigger value="google-ads" data-testid="tab-google-ads">
              <Target className="h-4 w-4 mr-1" />
              Google Ads
            </TabsTrigger>
            <TabsTrigger value="exit-intent-popup" data-testid="tab-exit-intent-popup" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Exit Intent Popup
            </TabsTrigger>
            <TabsTrigger value="quizzes" data-testid="tab-quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="resources" data-testid="tab-resources">Resources</TabsTrigger>
            <TabsTrigger value="image-gallery" data-testid="tab-image-gallery">
              <Image className="h-4 w-4 mr-1" />
              Image Gallery
            </TabsTrigger>
            <TabsTrigger value="database-sync" data-testid="tab-database-sync" className="bg-amber-500 text-white hover:bg-amber-600">
              Database Sync
            </TabsTrigger>
            <TabsTrigger value="site-settings" data-testid="tab-site-settings" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Site Settings
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

          <TabsContent value="social-posts">
            <AdminDashboard type="social-posts" />
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

          <TabsContent value="landing-pages" className="space-y-6">
            {/* Site URLs Accordion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center" data-testid="site-urls-title">
                  <Globe className="w-5 h-5 mr-2" />
                  All Live Site URLs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  
                  {/* Static Pages */}
                  <AccordionItem value="static-pages">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        Static Pages 
                        <Badge variant="secondary">27</Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {[
                          { label: "Home", url: "/" },
                          { label: "About Us", url: "/about-us" },
                          { label: "Communities", url: "/communities" },
                          { label: "Contact", url: "/contact" },
                          { label: "FAQs", url: "/faqs" },
                          { label: "Events", url: "/events" },
                          { label: "Team", url: "/team" },
                          { label: "Care Points", url: "/care-points" },
                          { label: "Stage Cares", url: "/stage-cares" },
                          { label: "For Professionals", url: "/for-professionals" },
                          { label: "Pricing & Availability", url: "/pricing-availability" },
                          { label: "Assisted Living", url: "/assisted-living" },
                          { label: "Memory Care", url: "/memory-care" },
                          { label: "Independent Living", url: "/independent-living" },
                          { label: "Respite Care", url: "/respite-care" },
                          { label: "In-Home Care", url: "/in-home-care" },
                          { label: "Long-Term Care", url: "/services/long-term-care" },
                          { label: "Dining", url: "/dining" },
                          { label: "Beauty Salon & Barber", url: "/beauty-salon-barber" },
                          { label: "Fitness & Therapy Center", url: "/fitness-therapy-center" },
                          { label: "Courtyards & Patios", url: "/courtyards-patios" },
                          { label: "Careers", url: "/careers" },
                          { label: "Tour Scheduled Success", url: "/tour-scheduled" },
                          { label: "Privacy Policy", url: "/privacy" },
                          { label: "Terms of Service", url: "/terms" },
                          { label: "Accessibility", url: "/accessibility" },
                          { label: "Admin", url: "/admin" },
                        ].map(({ label, url }) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors group"
                            data-testid={`link-static-${url.replace(/\//g, '-')}`}
                          >
                            <span className="text-sm">{label}</span>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Community Pages */}
                  <AccordionItem value="communities">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        Community Pages 
                        <Badge variant="secondary">{communities.length}</Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {communities.map((community) => (
                          <a
                            key={community.id}
                            href={`/communities/${community.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors group"
                            data-testid={`link-community-${community.slug}`}
                          >
                            <span className="text-sm">{community.name}</span>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Team Member Pages */}
                  <AccordionItem value="team-members">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        Team Member Pages 
                        <Badge variant="secondary">{teamMembers.length}</Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {teamMembers.map((member) => (
                          <a
                            key={member.id}
                            href={`/team/${member.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors group"
                            data-testid={`link-team-${member.slug}`}
                          >
                            <span className="text-sm">{member.name}</span>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Landing Pages */}
                  <AccordionItem value="landing-pages">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        Google Ads Landing Pages 
                        <Badge variant="secondary">{allLandingPageUrls.length} URLs</Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {allLandingPageUrls.map((page, index) => (
                          <a
                            key={`${page.templateSlug}-${index}`}
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors group"
                            data-testid={`link-landing-${page.url.replace(/\//g, '-')}`}
                          >
                            <span className="text-sm">{page.title}</span>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>
              </CardContent>
            </Card>

            {/* Landing Pages Management */}
            <AdminDashboard type="landing-pages" />
          </TabsContent>

          <TabsContent value="google-ads">
            <GoogleAdsManager />
          </TabsContent>

          <TabsContent value="exit-intent-popup">
            <ExitIntentPopupManager />
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <QuizManagement />
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <ResourceManagement />
          </TabsContent>

          <TabsContent value="image-gallery">
            <PageGalleryAdmin />
          </TabsContent>

          <TabsContent value="database-sync">
            <AdminDashboard type="database-sync" />
          </TabsContent>

          <TabsContent value="site-settings" className="space-y-6">
            <SiteSettingsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

interface QuizWithRelations extends Quiz {
  questions?: (QuizQuestion & { answerOptions?: QuizAnswerOption[] })[];
}

function QuizManagement() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"list" | "editor" | "responses">("list");
  const [selectedQuiz, setSelectedQuiz] = useState<QuizWithRelations | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Partial<InsertQuiz> | null>(null);
  const [questions, setQuestions] = useState<(Partial<InsertQuizQuestion> & { id?: string; answerOptions?: (Partial<InsertQuizAnswerOption> & { id?: string })[] })[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());

  const { data: quizzes = [], isLoading: quizzesLoading } = useQuery<Quiz[]>({
    queryKey: ["/api/quizzes"],
  });

  const { data: responses = [] } = useQuery<QuizResponse[]>({
    queryKey: ["/api/quizzes", selectedQuiz?.id, "responses"],
    enabled: viewMode === "responses" && !!selectedQuiz?.id,
  });

  const { data: quizWithQuestions, isLoading: quizDataLoading } = useQuery<QuizWithRelations>({
    queryKey: ["/api/quizzes", selectedQuiz?.id],
    enabled: viewMode === "editor" && !!selectedQuiz?.id,
  });

  // Load quiz data into form when fetched
  useEffect(() => {
    if (quizWithQuestions && selectedQuiz?.id) {
      setQuestions(quizWithQuestions.questions?.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType as "multiple_choice" | "text" | "scale",
        sortOrder: q.sortOrder ?? 0,
        required: q.required ?? true,
        answerOptions: q.answerOptions?.map((a) => ({
          id: a.id,
          answerText: a.answerText,
          resultCategory: a.resultCategory || "",
          sortOrder: a.sortOrder ?? 0,
        })) || [],
      })) || []);
    }
  }, [quizWithQuestions, selectedQuiz?.id]);

  const createQuizMutation = useMutation({
    mutationFn: async (data: InsertQuiz) => {
      const res = await apiRequest("POST", "/api/quizzes", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Quiz created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
      setViewMode("list");
      setEditingQuiz(null);
      setQuestions([]);
    },
    onError: () => {
      toast({ title: "Failed to create quiz", variant: "destructive" });
    },
  });

  const updateQuizMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertQuiz> }) => {
      const res = await apiRequest("PATCH", `/api/quizzes/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Quiz updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
      setViewMode("list");
      setSelectedQuiz(null);
      setEditingQuiz(null);
      setQuestions([]);
    },
    onError: () => {
      toast({ title: "Failed to update quiz", variant: "destructive" });
    },
  });

  const deleteQuizMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/quizzes/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Quiz deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
      setDeleteDialogOpen(false);
      setQuizToDelete(null);
    },
    onError: () => {
      toast({ title: "Failed to delete quiz", variant: "destructive" });
    },
  });

  const toggleActiveQMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await apiRequest("PATCH", `/api/quizzes/${id}`, { active });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Quiz status updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
    },
    onError: () => {
      toast({ title: "Failed to update quiz status", variant: "destructive" });
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: async ({ quizId, data }: { quizId: string; data: InsertQuizQuestion }) => {
      const res = await apiRequest("POST", `/api/quizzes/${quizId}/questions`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ quizId, questionId, data }: { quizId: string; questionId: string; data: Partial<InsertQuizQuestion> }) => {
      const res = await apiRequest("PATCH", `/api/quizzes/${quizId}/questions/${questionId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async ({ quizId, questionId }: { quizId: string; questionId: string }) => {
      await apiRequest("DELETE", `/api/quizzes/${quizId}/questions/${questionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
    },
  });

  const createAnswerMutation = useMutation({
    mutationFn: async ({ quizId, questionId, data }: { quizId: string; questionId: string; data: InsertQuizAnswerOption }) => {
      const res = await apiRequest("POST", `/api/quizzes/${quizId}/questions/${questionId}/answers`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
    },
  });

  const updateAnswerMutation = useMutation({
    mutationFn: async ({ quizId, questionId, answerId, data }: { quizId: string; questionId: string; answerId: string; data: Partial<InsertQuizAnswerOption> }) => {
      const res = await apiRequest("PATCH", `/api/quizzes/${quizId}/questions/${questionId}/answers/${answerId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
    },
  });

  const deleteAnswerMutation = useMutation({
    mutationFn: async ({ quizId, questionId, answerId }: { quizId: string; questionId: string; answerId: string }) => {
      await apiRequest("DELETE", `/api/quizzes/${quizId}/questions/${questionId}/answers/${answerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleCreateNew = () => {
    setEditingQuiz({
      title: "",
      slug: "",
      description: "",
      resultTitle: "",
      resultMessage: "",
      active: true,
      sortOrder: 0,
    });
    setQuestions([]);
    setSelectedQuiz(null);
    setViewMode("editor");
  };

  const handleEdit = (quiz: Quiz) => {
    setSelectedQuiz(quiz as QuizWithRelations);
    setEditingQuiz({
      title: quiz.title,
      slug: quiz.slug,
      description: quiz.description || "",
      resultTitle: quiz.resultTitle || "",
      resultMessage: quiz.resultMessage || "",
      active: quiz.active ?? true,
      sortOrder: quiz.sortOrder ?? 0,
    });
    // Don't reset questions here - they will be loaded via useEffect when quizWithQuestions is fetched
    setViewMode("editor");
  };

  const handleSaveQuiz = async () => {
    if (!editingQuiz?.title || !editingQuiz?.slug) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    try {
      const validatedData = insertQuizSchema.parse(editingQuiz);

      if (selectedQuiz?.id) {
        // UPDATE MODE: Update the quiz
        await updateQuizMutation.mutateAsync({ id: selectedQuiz.id, data: validatedData });
        
        // Process each question
        for (const question of questions) {
          if (question.id) {
            // UPDATE existing question
            if (question.questionText) {
              await updateQuestionMutation.mutateAsync({
                quizId: selectedQuiz.id,
                questionId: question.id,
                data: {
                  questionText: question.questionText,
                  questionType: question.questionType || "multiple_choice",
                  sortOrder: question.sortOrder || 0,
                  required: question.required ?? true,
                },
              });

              // Process answer options for this question
              if (question.answerOptions) {
                for (const answer of question.answerOptions) {
                  if (answer.id) {
                    // UPDATE existing answer
                    if (answer.answerText) {
                      await updateAnswerMutation.mutateAsync({
                        quizId: selectedQuiz.id,
                        questionId: question.id,
                        answerId: answer.id,
                        data: {
                          answerText: answer.answerText,
                          resultCategory: answer.resultCategory || "",
                          sortOrder: answer.sortOrder || 0,
                        },
                      });
                    }
                  } else {
                    // CREATE new answer
                    if (answer.answerText) {
                      await createAnswerMutation.mutateAsync({
                        quizId: selectedQuiz.id,
                        questionId: question.id,
                        data: {
                          answerText: answer.answerText,
                          resultCategory: answer.resultCategory || "",
                          sortOrder: answer.sortOrder || 0,
                        } as InsertQuizAnswerOption,
                      });
                    }
                  }
                }
              }
            }
          } else {
            // CREATE new question
            if (question.questionText) {
              const createdQ = await createQuestionMutation.mutateAsync({
                quizId: selectedQuiz.id,
                data: {
                  questionText: question.questionText,
                  questionType: question.questionType || "multiple_choice",
                  sortOrder: question.sortOrder || 0,
                  required: question.required ?? true,
                } as InsertQuizQuestion,
              });

              // Create answer options for new question
              if (question.answerOptions) {
                for (const answer of question.answerOptions) {
                  if (answer.answerText) {
                    await createAnswerMutation.mutateAsync({
                      quizId: selectedQuiz.id,
                      questionId: createdQ.id,
                      data: {
                        answerText: answer.answerText,
                        resultCategory: answer.resultCategory || "",
                        sortOrder: answer.sortOrder || 0,
                      } as InsertQuizAnswerOption,
                    });
                  }
                }
              }
            }
          }
        }
      } else {
        // CREATE MODE: Create new quiz and all questions/answers
        const createdQuiz = await createQuizMutation.mutateAsync(validatedData);
        
        for (const question of questions) {
          if (question.questionText) {
            const createdQ = await createQuestionMutation.mutateAsync({
              quizId: createdQuiz.id,
              data: {
                questionText: question.questionText,
                questionType: question.questionType || "multiple_choice",
                sortOrder: question.sortOrder || 0,
                required: question.required ?? true,
              } as InsertQuizQuestion,
            });

            if (question.answerOptions) {
              for (const answer of question.answerOptions) {
                if (answer.answerText) {
                  await createAnswerMutation.mutateAsync({
                    quizId: createdQuiz.id,
                    questionId: createdQ.id,
                    data: {
                      answerText: answer.answerText,
                      resultCategory: answer.resultCategory || "",
                      sortOrder: answer.sortOrder || 0,
                    } as InsertQuizAnswerOption,
                  });
                }
              }
            }
          }
        }
      }

      // Invalidate queries and show success message
      await queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
      toast({ title: selectedQuiz ? "Quiz updated successfully" : "Quiz created successfully" });
      
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast({ title: "Failed to save quiz", variant: "destructive" });
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "multiple_choice",
        sortOrder: questions.length,
        required: true,
        answerOptions: [],
      },
    ]);
  };

  const handleAddAnswer = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (!newQuestions[questionIndex].answerOptions) {
      newQuestions[questionIndex].answerOptions = [];
    }
    newQuestions[questionIndex].answerOptions!.push({
      answerText: "",
      resultCategory: "",
      sortOrder: newQuestions[questionIndex].answerOptions!.length,
    });
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = async (questionIndex: number, questionId?: string) => {
    if (questionId && selectedQuiz?.id) {
      await deleteQuestionMutation.mutateAsync({ quizId: selectedQuiz.id, questionId });
    }
    setQuestions(questions.filter((_, i) => i !== questionIndex));
  };

  const handleDeleteAnswer = async (questionIndex: number, answerIndex: number, answerId?: string, questionId?: string) => {
    if (answerId && questionId && selectedQuiz?.id) {
      await deleteAnswerMutation.mutateAsync({ quizId: selectedQuiz.id, questionId, answerId });
    }
    const newQuestions = [...questions];
    newQuestions[questionIndex].answerOptions = newQuestions[questionIndex].answerOptions?.filter((_, i) => i !== answerIndex);
    setQuestions(newQuestions);
  };

  const toggleResponseExpanded = (responseId: string) => {
    const newExpanded = new Set(expandedResponses);
    if (newExpanded.has(responseId)) {
      newExpanded.delete(responseId);
    } else {
      newExpanded.add(responseId);
    }
    setExpandedResponses(newExpanded);
  };

  if (viewMode === "editor") {
    // Show loading skeleton while fetching quiz data in edit mode
    if (selectedQuiz?.id && quizDataLoading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle data-testid="quiz-editor-title">Loading Quiz Data...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle data-testid="quiz-editor-title">
            {selectedQuiz ? "Edit Quiz" : "Create New Quiz"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Title *</Label>
              <Input
                id="quiz-title"
                value={editingQuiz?.title || ""}
                onChange={(e) => {
                  const title = e.target.value;
                  setEditingQuiz({
                    ...editingQuiz,
                    title,
                    slug: generateSlug(title),
                  });
                }}
                placeholder="e.g., Senior Care Navigator"
                data-testid="input-quiz-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quiz-slug">Slug *</Label>
              <Input
                id="quiz-slug"
                value={editingQuiz?.slug || ""}
                onChange={(e) => setEditingQuiz({ ...editingQuiz, slug: e.target.value })}
                placeholder="e.g., senior-care-navigator"
                data-testid="input-quiz-slug"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-description">Description</Label>
            <Textarea
              id="quiz-description"
              value={editingQuiz?.description || ""}
              onChange={(e) => setEditingQuiz({ ...editingQuiz, description: e.target.value })}
              placeholder="Quiz description"
              rows={3}
              data-testid="input-quiz-description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-result-title">Result Title</Label>
              <Input
                id="quiz-result-title"
                value={editingQuiz?.resultTitle || ""}
                onChange={(e) => setEditingQuiz({ ...editingQuiz, resultTitle: e.target.value })}
                placeholder="Title shown on results page"
                data-testid="input-quiz-result-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quiz-sort-order">Sort Order</Label>
              <Input
                id="quiz-sort-order"
                type="number"
                value={editingQuiz?.sortOrder || 0}
                onChange={(e) => setEditingQuiz({ ...editingQuiz, sortOrder: parseInt(e.target.value) || 0 })}
                data-testid="input-quiz-sort-order"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-result-message">Result Message</Label>
            <Textarea
              id="quiz-result-message"
              value={editingQuiz?.resultMessage || ""}
              onChange={(e) => setEditingQuiz({ ...editingQuiz, resultMessage: e.target.value })}
              placeholder="General message shown with results"
              rows={3}
              data-testid="input-quiz-result-message"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="quiz-active"
              checked={editingQuiz?.active ?? true}
              onCheckedChange={(checked) => setEditingQuiz({ ...editingQuiz, active: checked })}
              data-testid="switch-quiz-active"
            />
            <Label htmlFor="quiz-active">Active</Label>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Questions</h3>
              <Button onClick={handleAddQuestion} size="sm" data-testid="button-add-question">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <Card key={qIndex} data-testid={`question-${qIndex}`}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <Label>Question Text *</Label>
                          <Input
                            value={question.questionText || ""}
                            onChange={(e) => {
                              const newQuestions = [...questions];
                              newQuestions[qIndex].questionText = e.target.value;
                              setQuestions(newQuestions);
                            }}
                            placeholder="Enter question"
                            data-testid={`input-question-text-${qIndex}`}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Question Type</Label>
                            <Select
                              value={question.questionType || "multiple_choice"}
                              onValueChange={(value) => {
                                const newQuestions = [...questions];
                                newQuestions[qIndex].questionType = value as "multiple_choice" | "text" | "scale";
                                setQuestions(newQuestions);
                              }}
                            >
                              <SelectTrigger data-testid={`select-question-type-${qIndex}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="scale">Scale</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Sort Order</Label>
                            <Input
                              type="number"
                              value={question.sortOrder || 0}
                              onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[qIndex].sortOrder = parseInt(e.target.value) || 0;
                                setQuestions(newQuestions);
                              }}
                              data-testid={`input-question-sort-${qIndex}`}
                            />
                          </div>

                          <div className="flex items-center space-x-2 pt-6">
                            <Switch
                              checked={question.required ?? true}
                              onCheckedChange={(checked) => {
                                const newQuestions = [...questions];
                                newQuestions[qIndex].required = checked;
                                setQuestions(newQuestions);
                              }}
                              data-testid={`switch-question-required-${qIndex}`}
                            />
                            <Label>Required</Label>
                          </div>
                        </div>

                        {question.questionType === "multiple_choice" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Answer Options</Label>
                              <Button
                                onClick={() => handleAddAnswer(qIndex)}
                                size="sm"
                                variant="outline"
                                data-testid={`button-add-answer-${qIndex}`}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Answer
                              </Button>
                            </div>

                            <div className="space-y-2 pl-4 border-l-2">
                              {question.answerOptions?.map((answer, aIndex) => (
                                <div key={aIndex} className="flex items-center gap-2" data-testid={`answer-${qIndex}-${aIndex}`}>
                                  <Input
                                    value={answer.answerText || ""}
                                    onChange={(e) => {
                                      const newQuestions = [...questions];
                                      newQuestions[qIndex].answerOptions![aIndex].answerText = e.target.value;
                                      setQuestions(newQuestions);
                                    }}
                                    placeholder="Answer text"
                                    data-testid={`input-answer-text-${qIndex}-${aIndex}`}
                                  />
                                  <Input
                                    value={answer.resultCategory || ""}
                                    onChange={(e) => {
                                      const newQuestions = [...questions];
                                      newQuestions[qIndex].answerOptions![aIndex].resultCategory = e.target.value;
                                      setQuestions(newQuestions);
                                    }}
                                    placeholder="Result category"
                                    className="w-48"
                                    data-testid={`input-answer-category-${qIndex}-${aIndex}`}
                                  />
                                  <Input
                                    type="number"
                                    value={answer.sortOrder || 0}
                                    onChange={(e) => {
                                      const newQuestions = [...questions];
                                      newQuestions[qIndex].answerOptions![aIndex].sortOrder = parseInt(e.target.value) || 0;
                                      setQuestions(newQuestions);
                                    }}
                                    className="w-20"
                                    data-testid={`input-answer-sort-${qIndex}-${aIndex}`}
                                  />
                                  <Button
                                    onClick={() => handleDeleteAnswer(qIndex, aIndex, answer.id, question.id)}
                                    size="sm"
                                    variant="ghost"
                                    data-testid={`button-delete-answer-${qIndex}-${aIndex}`}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => handleDeleteQuestion(qIndex, question.id)}
                        size="sm"
                        variant="ghost"
                        data-testid={`button-delete-question-${qIndex}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              onClick={() => {
                setViewMode("list");
                setEditingQuiz(null);
                setSelectedQuiz(null);
                setQuestions([]);
              }}
              variant="outline"
              data-testid="button-cancel-quiz"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveQuiz}
              disabled={createQuizMutation.isPending || updateQuizMutation.isPending}
              data-testid="button-save-quiz"
            >
              {selectedQuiz ? "Update Quiz" : "Create Quiz"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === "responses") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle data-testid="quiz-responses-title">
              Quiz Responses: {selectedQuiz?.title}
            </CardTitle>
            <Button
              onClick={() => {
                setViewMode("list");
                setSelectedQuiz(null);
              }}
              variant="outline"
              size="sm"
              data-testid="button-back-to-list"
            >
              Back to List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {responses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="no-responses">
              No responses yet.
            </p>
          ) : (
            <div className="space-y-2">
              {responses.map((response) => (
                <Card key={response.id} data-testid={`response-${response.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleResponseExpanded(response.id)}>
                      <div className="grid grid-cols-5 gap-4 flex-1">
                        <div>
                          <span className="text-sm font-medium" data-testid={`response-name-${response.id}`}>
                            {response.name || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm" data-testid={`response-email-${response.id}`}>
                            {response.email}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm" data-testid={`response-phone-${response.id}`}>
                            {response.phone || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(response.createdAt || new Date()).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <Badge variant="secondary" data-testid={`response-category-${response.id}`}>
                            {response.resultCategory || "N/A"}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        {expandedResponses.has(response.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    {expandedResponses.has(response.id) && (
                      <div className="mt-4 pt-4 border-t space-y-2">
                        <h4 className="font-medium mb-2">Answers:</h4>
                        {response.answers && Array.isArray(response.answers) && response.answers.map((answer: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            <span className="font-medium">Q{idx + 1}: </span>
                            {answer.textAnswer || answer.answerOptionId || "N/A"}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center" data-testid="quiz-list-title">
            <ClipboardList className="w-5 h-5 mr-2" />
            Quizzes
          </CardTitle>
          <Button onClick={handleCreateNew} data-testid="button-create-quiz">
            <Plus className="h-4 w-4 mr-2" />
            Create New Quiz
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {quizzesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : quizzes.length === 0 ? (
          <p className="text-muted-foreground text-center py-8" data-testid="no-quizzes">
            No quizzes yet. Create one to get started.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow key={quiz.id} data-testid={`quiz-row-${quiz.id}`}>
                  <TableCell className="font-medium" data-testid={`quiz-title-${quiz.id}`}>
                    {quiz.title}
                  </TableCell>
                  <TableCell data-testid={`quiz-slug-${quiz.id}`}>{quiz.slug}</TableCell>
                  <TableCell>
                    <Badge variant={quiz.active ? "default" : "secondary"} data-testid={`quiz-status-${quiz.id}`}>
                      {quiz.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell data-testid={`quiz-questions-count-${quiz.id}`}>
                    {(quiz as QuizWithRelations).questions?.length || 0}
                  </TableCell>
                  <TableCell data-testid={`quiz-responses-count-${quiz.id}`}>0</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleEdit(quiz)}
                        size="sm"
                        variant="ghost"
                        data-testid={`button-edit-quiz-${quiz.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedQuiz(quiz as QuizWithRelations);
                          setViewMode("responses");
                        }}
                        size="sm"
                        variant="ghost"
                        data-testid={`button-view-responses-${quiz.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={quiz.active ?? false}
                        onCheckedChange={(checked) => toggleActiveQMutation.mutate({ id: quiz.id, active: checked })}
                        data-testid={`switch-quiz-active-${quiz.id}`}
                      />
                      <Button
                        onClick={() => {
                          setQuizToDelete(quiz);
                          setDeleteDialogOpen(true);
                        }}
                        size="sm"
                        variant="ghost"
                        data-testid={`button-delete-quiz-${quiz.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the quiz "{quizToDelete?.title}" and all its questions, answers, and responses. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => quizToDelete && deleteQuizMutation.mutate(quizToDelete.id)}
              className="bg-destructive hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function ResourceManagement() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"list" | "editor" | "downloads">("list");
  const [selectedResource, setSelectedResource] = useState<ContentAsset | null>(null);
  const [editingResource, setEditingResource] = useState<Partial<InsertContentAsset>>({
    title: "",
    slug: "",
    description: "",
    category: undefined,
    fileUrl: "",
    objectKey: "",
    thumbnailImageId: undefined,
    fileSize: 0,
    mimeType: "",
    requiredFields: [],
    articleContent: "",
    featuredImageId: undefined,
    authorId: undefined,
    active: true,
    sortOrder: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<ContentAsset | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const { data: contentAssets = [], isLoading: assetsLoading } = useQuery<ContentAsset[]>({
    queryKey: ["/api/content-assets"],
  });

  const { data: downloads = [] } = useQuery<AssetDownload[]>({
    queryKey: ["/api/content-assets", selectedResource?.id, "downloads"],
    enabled: viewMode === "downloads" && !!selectedResource?.id,
  });

  const { data: images = [] } = useQuery<any[]>({
    queryKey: ["/api/images"],
  });

  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  const createResourceMutation = useMutation({
    mutationFn: async (data: InsertContentAsset) => {
      const res = await apiRequest("POST", "/api/content-assets", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Resource created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/content-assets"] });
      setViewMode("list");
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create resource", variant: "destructive" });
    },
  });

  const updateResourceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertContentAsset> }) => {
      const res = await apiRequest("PATCH", `/api/content-assets/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Resource updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/content-assets"] });
      setViewMode("list");
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update resource", variant: "destructive" });
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/content-assets/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Resource deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/content-assets"] });
      setDeleteDialogOpen(false);
      setResourceToDelete(null);
    },
    onError: () => {
      toast({ title: "Failed to delete resource", variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await apiRequest("PATCH", `/api/content-assets/${id}`, { active });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Resource status updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/content-assets"] });
    },
    onError: () => {
      toast({ title: "Failed to update resource status", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setEditingResource({
      title: "",
      slug: "",
      description: "",
      category: undefined,
      fileUrl: "",
      objectKey: "",
      thumbnailImageId: undefined,
      fileSize: 0,
      mimeType: "",
      requiredFields: [],
      articleContent: "",
      featuredImageId: undefined,
      authorId: undefined,
      active: true,
      sortOrder: 0,
    });
    setSelectedResource(null);
    setUploadedFileName("");
    setUploadProgress(0);
  };

  const handleCreateNew = () => {
    resetForm();
    setViewMode("editor");
  };

  const handleEdit = (resource: ContentAsset) => {
    setSelectedResource(resource);
    setEditingResource({
      title: resource.title,
      slug: resource.slug,
      description: resource.description || "",
      category: resource.category || undefined,
      fileUrl: resource.fileUrl || "",
      objectKey: resource.objectKey || "",
      thumbnailImageId: resource.thumbnailImageId || undefined,
      fileSize: resource.fileSize || 0,
      mimeType: resource.mimeType || "",
      requiredFields: resource.requiredFields || [],
      articleContent: resource.articleContent || "",
      featuredImageId: resource.featuredImageId || undefined,
      authorId: resource.authorId || undefined,
      active: resource.active ?? true,
      sortOrder: resource.sortOrder ?? 0,
    });
    setUploadedFileName(resource.fileUrl?.split("/").pop() || "");
    setViewMode("editor");
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setEditingResource({
      ...editingResource,
      title,
      slug: generateSlug(title),
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({ title: "Only PDF files are allowed", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setEditingResource({
            ...editingResource,
            objectKey: response.objectKey,
            fileUrl: response.uploadUrl,
            fileSize: response.fileSize,
            mimeType: response.mimeType,
          });
          setUploadedFileName(response.filename);
          setIsUploading(false);
          setUploadProgress(100);
          toast({ title: "File uploaded successfully" });
        } else {
          throw new Error("Upload failed");
        }
      });

      xhr.addEventListener("error", () => {
        throw new Error("Upload failed");
      });

      xhr.open("POST", "/api/object-storage/upload");
      xhr.send(formData);

    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Failed to upload file", variant: "destructive" });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSave = () => {
    try {
      const validatedData = insertContentAssetSchema.parse(editingResource);
      
      if (selectedResource) {
        updateResourceMutation.mutate({ id: selectedResource.id, data: validatedData });
      } else {
        createResourceMutation.mutate(validatedData);
      }
    } catch (error: any) {
      toast({ 
        title: "Validation error", 
        description: error.errors?.[0]?.message || "Please check all required fields",
        variant: "destructive" 
      });
    }
  };

  const toggleRequiredField = (field: string) => {
    const currentFields = editingResource.requiredFields || [];
    const newFields = currentFields.includes(field)
      ? currentFields.filter(f => f !== field)
      : [...currentFields, field];
    setEditingResource({ ...editingResource, requiredFields: newFields });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  if (viewMode === "editor") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle data-testid="resource-editor-title">
              {selectedResource ? "Edit Resource" : "Upload New Resource"}
            </CardTitle>
            <Button
              onClick={() => {
                setViewMode("list");
                resetForm();
              }}
              variant="outline"
              size="sm"
              data-testid="button-back-to-list"
            >
              Back to List
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={editingResource.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Resource title"
                data-testid="input-resource-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={editingResource.slug}
                onChange={(e) => setEditingResource({ ...editingResource, slug: e.target.value })}
                placeholder="resource-slug"
                data-testid="input-resource-slug"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingResource.description}
                onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                placeholder="Resource description"
                rows={3}
                data-testid="input-resource-description"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="articleContent">Article Content (Optional)</Label>
              <RichTextEditor
                value={editingResource.articleContent || ""}
                onChange={(value) => setEditingResource({ ...editingResource, articleContent: value })}
                placeholder="Write your article content here..."
                data-testid="editor-article-content"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <ImageUploader
                label="Thumbnail Image (Optional)"
                value={editingResource.thumbnailImageId || undefined}
                onChange={(value) => setEditingResource({ ...editingResource, thumbnailImageId: value as string | undefined })}
                multiple={false}
                accept="image/*"
                maxSize={10 * 1024 * 1024}
                disabled={isUploading}
              />
              <p className="text-xs text-muted-foreground">
                Displayed on resource cards and listings
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <ImageUploader
                label="Featured Image (Optional)"
                value={editingResource.featuredImageId || undefined}
                onChange={(value) => setEditingResource({ ...editingResource, featuredImageId: value as string | undefined })}
                multiple={false}
                accept="image/*"
                maxSize={10 * 1024 * 1024}
                disabled={isUploading}
              />
              <p className="text-xs text-muted-foreground">
                Displayed at the top of the resource article page
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="author">Author (Optional)</Label>
              <Select
                value={editingResource.authorId || ""}
                onValueChange={(value) => setEditingResource({ ...editingResource, authorId: value || undefined })}
              >
                <SelectTrigger id="author" data-testid="select-author">
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={editingResource.category}
                onValueChange={(value) => setEditingResource({ ...editingResource, category: value })}
              >
                <SelectTrigger id="category" data-testid="select-resource-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financial Planning">Financial Planning</SelectItem>
                  <SelectItem value="Safety & Security">Safety & Security</SelectItem>
                  <SelectItem value="Care Planning">Care Planning</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaText">CTA Button Text</Label>
              <Input
                id="ctaText"
                value={editingResource.ctaText || "Download Full Guide"}
                onChange={(e) => setEditingResource({ ...editingResource, ctaText: e.target.value })}
                placeholder="Download Full Guide"
                data-testid="input-resource-cta-text"
              />
              <p className="text-xs text-muted-foreground">
                Customize the download button text (default: "Download Full Guide")
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={editingResource.sortOrder}
                onChange={(e) => setEditingResource({ ...editingResource, sortOrder: parseInt(e.target.value) || 0 })}
                data-testid="input-resource-sort"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="file">PDF File *</Label>
              <div className="space-y-2">
                <Input
                  id="file"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  data-testid="input-resource-file"
                />
                {isUploading && (
                  <div className="space-y-1">
                    <Progress value={uploadProgress} data-testid="upload-progress" />
                    <p className="text-sm text-muted-foreground">Uploading... {Math.round(uploadProgress)}%</p>
                  </div>
                )}
                {uploadedFileName && !isUploading && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <FileType className="h-4 w-4" />
                    <span className="text-sm flex-1" data-testid="uploaded-file-name">{uploadedFileName}</span>
                    <span className="text-sm text-muted-foreground" data-testid="uploaded-file-size">
                      {formatFileSize(editingResource.fileSize || 0)}
                    </span>
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Required Fields</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {["email", "name", "phone", "zipCode", "timeline"].map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={`field-${field}`}
                      checked={editingResource.requiredFields?.includes(field)}
                      onCheckedChange={() => toggleRequiredField(field)}
                      data-testid={`checkbox-field-${field}`}
                    />
                    <Label htmlFor={`field-${field}`} className="text-sm capitalize cursor-pointer">
                      {field === "zipCode" ? "Zip Code" : field}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={editingResource.active ?? true}
                onCheckedChange={(checked) => setEditingResource({ ...editingResource, active: checked })}
                data-testid="switch-resource-active"
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              onClick={() => {
                setViewMode("list");
                resetForm();
              }}
              variant="outline"
              data-testid="button-cancel-resource"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createResourceMutation.isPending || updateResourceMutation.isPending || isUploading}
              data-testid="button-save-resource"
            >
              {selectedResource ? "Update Resource" : "Save Resource"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === "downloads") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle data-testid="downloads-title">
              Downloads: {selectedResource?.title}
            </CardTitle>
            <Button
              onClick={() => {
                setViewMode("list");
                setSelectedResource(null);
              }}
              variant="outline"
              size="sm"
              data-testid="button-back-to-list"
            >
              Back to List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {downloads.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="no-downloads">
              No downloads yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Zip Code</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downloads.map((download) => (
                  <TableRow key={download.id} data-testid={`download-row-${download.id}`}>
                    <TableCell data-testid={`download-name-${download.id}`}>
                      {download.name || "N/A"}
                    </TableCell>
                    <TableCell data-testid={`download-email-${download.id}`}>
                      {download.email}
                    </TableCell>
                    <TableCell data-testid={`download-phone-${download.id}`}>
                      {download.phone || "N/A"}
                    </TableCell>
                    <TableCell data-testid={`download-zipcode-${download.id}`}>
                      {download.zipCode || "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(download.createdAt || new Date()).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center" data-testid="resource-list-title">
            <FileType className="w-5 h-5 mr-2" />
            Resource Library
          </CardTitle>
          <Button onClick={handleCreateNew} data-testid="button-create-resource">
            <Upload className="h-4 w-4 mr-2" />
            Upload New Resource
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {assetsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : contentAssets.length === 0 ? (
          <p className="text-muted-foreground text-center py-8" data-testid="no-resources">
            No resources yet. Upload one to get started.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentAssets.map((resource) => (
                <TableRow key={resource.id} data-testid={`resource-row-${resource.id}`}>
                  <TableCell className="font-medium" data-testid={`resource-title-${resource.id}`}>
                    {resource.title}
                  </TableCell>
                  <TableCell data-testid={`resource-slug-${resource.id}`}>
                    {resource.slug}
                  </TableCell>
                  <TableCell data-testid={`resource-category-${resource.id}`}>
                    {resource.category || "N/A"}
                  </TableCell>
                  <TableCell data-testid={`resource-size-${resource.id}`}>
                    {formatFileSize(resource.fileSize || 0)}
                  </TableCell>
                  <TableCell data-testid={`resource-downloads-${resource.id}`}>
                    {resource.downloadCount || 0}
                  </TableCell>
                  <TableCell>
                    <Badge variant={resource.active ? "default" : "secondary"} data-testid={`resource-status-${resource.id}`}>
                      {resource.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleEdit(resource)}
                        size="sm"
                        variant="ghost"
                        data-testid={`button-edit-resource-${resource.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedResource(resource);
                          setViewMode("downloads");
                        }}
                        size="sm"
                        variant="ghost"
                        data-testid={`button-view-downloads-${resource.id}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={resource.active ?? false}
                        onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: resource.id, active: checked })}
                        data-testid={`switch-resource-active-${resource.id}`}
                      />
                      <Button
                        onClick={() => {
                          setResourceToDelete(resource);
                          setDeleteDialogOpen(true);
                        }}
                        size="sm"
                        variant="ghost"
                        data-testid={`button-delete-resource-${resource.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the resource "{resourceToDelete?.title}" and all its download records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resourceToDelete && deleteResourceMutation.mutate(resourceToDelete.id)}
              className="bg-destructive hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function SiteSettingsManager() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: siteSettings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  const form = useForm<Partial<InsertSiteSettings>>({
    resolver: zodResolver(insertSiteSettingsSchema.partial()),
    defaultValues: {
      companyPhoneDisplay: "",
      companyPhoneDial: "",
      companyEmail: "",
      supportEmail: "",
    },
  });

  useEffect(() => {
    if (siteSettings) {
      form.reset({
        companyPhoneDisplay: siteSettings.companyPhoneDisplay ?? "",
        companyPhoneDial: siteSettings.companyPhoneDial ?? "",
        companyEmail: siteSettings.companyEmail ?? "",
        supportEmail: siteSettings.supportEmail ?? "",
      });
    }
  }, [siteSettings, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<InsertSiteSettings>) => {
      const res = await apiRequest("PATCH", "/api/site-settings", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Site settings updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      setIsEditing(false);
    },
    onError: () => {
      toast({ title: "Failed to update site settings", variant: "destructive" });
    },
  });

  const onSubmit = (data: Partial<InsertSiteSettings>) => {
    updateSettingsMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>Loading site settings...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Site Settings</CardTitle>
            <CardDescription>
              Manage company-wide contact information that displays across the entire website
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              data-testid="button-edit-settings"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Display Phone Number</label>
                <p className="text-lg font-semibold" data-testid="text-phone-display">
                  {siteSettings?.companyPhoneDisplay || "Not set"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Dial Phone Number</label>
                <p className="text-lg font-semibold" data-testid="text-phone-dial">
                  {siteSettings?.companyPhoneDial || "Not set"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company Email</label>
                <p className="text-lg font-semibold" data-testid="text-email">
                  {siteSettings?.companyEmail || "Not set"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Support Email</label>
                <p className="text-lg font-semibold" data-testid="text-support-email">
                  {siteSettings?.supportEmail || "Not set"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="companyPhoneDisplay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="(970) 444-4689"
                          data-testid="input-phone-display"
                        />
                      </FormControl>
                      <FormDescription>
                        Phone number as it should appear to users (with formatting)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyPhoneDial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dial Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="9704444689"
                          data-testid="input-phone-dial"
                        />
                      </FormControl>
                      <FormDescription>
                        Phone number for tel: links (digits only, no formatting)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="email"
                          placeholder="info@stagesenior.com"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormDescription>
                        Primary company email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="email"
                          placeholder="support@stagesenior.com"
                          data-testid="input-support-email"
                        />
                      </FormControl>
                      <FormDescription>
                        Customer support email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={updateSettingsMutation.isPending}
                  data-testid="button-save-settings"
                >
                  {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
