import { Switch, Route, useRoute, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, RequireAuth } from "@/lib/auth";
import Home from "@/pages/home";
import Communities from "@/pages/communities";
import CommunityDetail from "@/pages/community-detail";
import Events from "@/pages/events";
import Team from "@/pages/team";
import TeamMember from "@/pages/team-member";
import Blog from "@/pages/blog";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import FAQs from "@/pages/faqs";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Accessibility from "@/pages/accessibility";
import AboutUs from "@/pages/about-us";
import Services from "@/pages/services";
import StageCares from "@/pages/stage-cares";
import CarePoints from "@/pages/care-points";
import SafetyWithDignity from "@/pages/safety-with-dignity";
import InHomeCare from "@/pages/in-home-care";
import Careers from "@/pages/careers";
import Contact from "@/pages/contact";
import Dining from "@/pages/dining";
import BeautySalon from "@/pages/beauty-salon";
import FitnessTherapy from "@/pages/fitness-therapy";
import CourtyardsPatios from "@/pages/courtyards-patios";
import Reviews from "@/pages/Reviews";
import ProfessionalManagement from "@/pages/services/management";
import LongTermCare from "@/pages/services/long-term-care";
import Chaplaincy from "@/pages/services/chaplaincy";
import NotFound from "@/pages/not-found";
import DynamicLandingPage from "@/pages/DynamicLandingPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollRestoration from "@/components/ScrollRestoration";
import ScrollToTop from "@/components/ScrollToTop";
import { ScheduleTourProvider } from "@/hooks/useScheduleTour";
import ScheduleTourDialog from "@/components/ScheduleTourDialog";

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
      </main>
      {/* Don't show main footer on in-home care page */}
      {!isInHomeCare && <Footer />}
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
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
  );
}

export default App;
