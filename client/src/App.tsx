import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Communities from "@/pages/communities";
import CommunityDetail from "@/pages/community-detail";
import Events from "@/pages/events";
import Blog from "@/pages/blog";
import Admin from "@/pages/admin";
import FAQs from "@/pages/faqs";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Accessibility from "@/pages/accessibility";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/communities" component={Communities} />
          <Route path="/communities/:slug" component={CommunityDetail} />
          <Route path="/events" component={Events} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={Blog} />
          <Route path="/faqs" component={FAQs} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/accessibility" component={Accessibility} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
