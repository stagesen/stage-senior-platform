import { Switch, Route, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, RequireAuth } from "@/lib/auth";
import Home from "@/pages/home";
import Communities from "@/pages/communities";
import CommunityDetail from "@/pages/community-detail";
import Events from "@/pages/events";
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
import ProfessionalManagement from "@/pages/services/management";
import LongTermCare from "@/pages/services/long-term-care";
import Chaplaincy from "@/pages/services/chaplaincy";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollRestoration from "@/components/ScrollRestoration";
import ScrollToTop from "@/components/ScrollToTop";

function Router() {
  // Check if we're on a community detail page
  const [isCommunityDetail] = useRoute("/communities/:slug");
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ScrollRestoration />
      {/* Don't show main header on community detail pages */}
      {!isCommunityDetail && <Header />}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/communities" component={Communities} />
          <Route path="/communities/:slug" component={CommunityDetail} />
          <Route path="/events" component={Events} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={Blog} />
          <Route path="/faqs" component={FAQs} />
          <Route path="/about-us" component={AboutUs} />
          <Route path="/services" component={Services} />
          <Route path="/stage-cares" component={StageCares} />
          <Route path="/care-points" component={CarePoints} />
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
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
