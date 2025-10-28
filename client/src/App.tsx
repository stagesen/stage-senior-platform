import { lazy, Suspense } from "react";
import { Switch, Route, useRoute, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, RequireAuth } from "@/lib/auth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Header from "@/components/Header";
import ScrollRestoration from "@/components/ScrollRestoration";
import ScrollToTop from "@/components/ScrollToTop";
import { ScheduleTourProvider } from "@/hooks/useScheduleTour";
import ScheduleTourDialog from "@/components/ScheduleTourDialog";

// Lazy load Footer for better initial page load
const Footer = lazy(() => import("@/components/Footer"));

// Lazy load all page components for code splitting
const Home = lazy(() => import("@/pages/home"));
const Communities = lazy(() => import("@/pages/communities"));
const CommunityDetail = lazy(() => import("@/pages/community-detail"));
const Events = lazy(() => import("@/pages/events"));
const Team = lazy(() => import("@/pages/team"));
const TeamMember = lazy(() => import("@/pages/team-member"));
const Blog = lazy(() => import("@/pages/blog"));
const Admin = lazy(() => import("@/pages/admin"));
const Login = lazy(() => import("@/pages/login"));
const FAQs = lazy(() => import("@/pages/faqs"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const Accessibility = lazy(() => import("@/pages/accessibility"));
const AboutUs = lazy(() => import("@/pages/about-us"));
const Services = lazy(() => import("@/pages/services"));
const StageCares = lazy(() => import("@/pages/stage-cares"));
const CarePoints = lazy(() => import("@/pages/care-points"));
const SafetyWithDignity = lazy(() => import("@/pages/safety-with-dignity"));
const InHomeCare = lazy(() => import("@/pages/in-home-care"));
const Careers = lazy(() => import("@/pages/careers"));
const Contact = lazy(() => import("@/pages/contact"));
const Dining = lazy(() => import("@/pages/dining"));
const BeautySalon = lazy(() => import("@/pages/beauty-salon"));
const FitnessTherapy = lazy(() => import("@/pages/fitness-therapy"));
const CourtyardsPatios = lazy(() => import("@/pages/courtyards-patios"));
const Reviews = lazy(() => import("@/pages/Reviews"));
const ProfessionalManagement = lazy(() => import("@/pages/services/management"));
const LongTermCare = lazy(() => import("@/pages/services/long-term-care"));
const Chaplaincy = lazy(() => import("@/pages/services/chaplaincy"));
const NotFound = lazy(() => import("@/pages/not-found"));
const DynamicLandingPage = lazy(() => import("@/pages/DynamicLandingPage"));
const TourScheduled = lazy(() => import("@/pages/tour-scheduled"));
const ForProfessionals = lazy(() => import("@/pages/ForProfessionals"));
const WhyStageSenior = lazy(() => import("@/pages/WhyStageSenior"));
const CompareCareLevels = lazy(() => import("@/pages/CompareCareLevels"));
const FamilyStories = lazy(() => import("@/pages/FamilyStories"));
const VirtualTours = lazy(() => import("@/pages/VirtualTours"));
const PricingAvailability = lazy(() => import("@/pages/PricingAvailability"));
const CareNavigator = lazy(() => import("@/pages/care-navigator"));
const Resources = lazy(() => import("@/pages/resources"));
const ResourceDetail = lazy(() => import("@/pages/ResourceDetail"));

function Router() {
  // Check if we're on a community detail page
  const [isCommunityDetail] = useRoute("/communities/:slug");
  // Check if we're on the in-home care page
  const [isInHomeCare] = useRoute("/in-home-care");
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ScrollRestoration />
      {/* Don't show main header on community detail pages or in-home care page */}
      {!isCommunityDetail && !isInHomeCare && <Header />}
      <main className="flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }>
          <Switch>
          <Route path="/" component={Home} />
          <Route path="/properties/">{() => <Redirect to="/communities/" />}</Route>
          <Route path="/properties">{() => <Redirect to="/communities/" />}</Route>
          <Route path="/communities" component={Communities} />
          <Route path="/communities/:slug" component={CommunityDetail} />
          <Route path="/events" component={Events} />
          <Route path="/team" component={Team} />
          <Route path="/team/:slug" component={TeamMember} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={Blog} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/faqs" component={FAQs} />
          <Route path="/about-us" component={AboutUs} />
          <Route path="/careers" component={Careers} />
          <Route path="/contact" component={Contact} />
          <Route path="/dining" component={Dining} />
          <Route path="/beauty-salon" component={BeautySalon} />
          <Route path="/fitness-therapy" component={FitnessTherapy} />
          <Route path="/courtyards-patios" component={CourtyardsPatios} />
          <Route path="/services" component={Services} />
          <Route path="/stage-cares" component={StageCares} />
          <Route path="/care-points" component={CarePoints} />
          <Route path="/safety-with-dignity" component={SafetyWithDignity} />
          <Route path="/in-home-care" component={InHomeCare} />
          <Route path="/services/management" component={ProfessionalManagement} />
          <Route path="/services/long-term-care" component={LongTermCare} />
          <Route path="/services/chaplaincy" component={Chaplaincy} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/accessibility" component={Accessibility} />
          <Route path="/login" component={Login} />
          <Route path="/tour-scheduled" component={TourScheduled} />
          <Route path="/for-professionals" component={ForProfessionals} />
          <Route path="/why-stage-senior" component={WhyStageSenior} />
          <Route path="/compare-care-levels" component={CompareCareLevels} />
          <Route path="/family-stories-and-reviews" component={FamilyStories} />
          <Route path="/virtual-tour-and-floorplans" component={VirtualTours} />
          <Route path="/pricing-and-availability" component={PricingAvailability} />
          <Route path="/care-navigator" component={CareNavigator} />
          <Route path="/resources/:slug" component={ResourceDetail} />
          <Route path="/resources" component={Resources} />
          <Route path="/admin">
            <RequireAuth>
              <Admin />
            </RequireAuth>
          </Route>
          
          {/* Landing page routes - specific routes first, then general patterns */}
          {/* Exact care type matches (no city) */}
          <Route path="/assisted-living" component={DynamicLandingPage} />
          <Route path="/memory-care" component={DynamicLandingPage} />
          <Route path="/independent-living" component={DynamicLandingPage} />
          <Route path="/senior-living" component={DynamicLandingPage} />
          
          {/* Care type with city routes */}
          <Route path="/assisted-living/:city" component={DynamicLandingPage} />
          <Route path="/memory-care/:city" component={DynamicLandingPage} />
          <Route path="/independent-living/:city" component={DynamicLandingPage} />
          <Route path="/senior-living/:city" component={DynamicLandingPage} />
          
          {/* Three-segment pattern for /care/:careType/:city */}
          <Route path="/care/:careType/:city" component={DynamicLandingPage} />
          
          {/* Catch-all patterns - order matters! */}
          <Route path="/:careType/:city" component={DynamicLandingPage} />
          <Route path="/:slug" component={DynamicLandingPage} />
          
          {/* NotFound must be absolute last */}
          <Route component={NotFound} />
        </Switch>
        </Suspense>
      </main>
      {/* Don't show main footer on in-home care page */}
      {!isInHomeCare && (
        <Suspense fallback={<div className="h-96" />}>
          <Footer />
        </Suspense>
      )}
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <ScheduleTourProvider>
              <Toaster />
              <Router />
              <ScheduleTourDialog />
            </ScheduleTourProvider>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
