import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, AlertCircle, Lock, Users, CheckCircle, Clock, Eye, Bell, FileText, HeartHandshake, Play, ChevronDown, MonitorUp, UserCheck, ShieldCheck, Activity } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function SafetyWithDignity() {
  useEffect(() => {
    document.title = "Safety with Dignity - Fall Detection Program | The Gardens on Quail";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about our Safety with Dignity fall detection program at The Gardens on Quail. Privacy-focused technology that identifies falls quickly, alerts staff immediately, and helps adapt care—without live streaming or audio recording.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn about our Safety with Dignity fall detection program at The Gardens on Quail. Privacy-focused technology that identifies falls quickly, alerts staff immediately, and helps adapt care—without live streaming or audio recording.';
      document.head.appendChild(meta);
    }
  }, []);

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const processSteps = [
    {
      step: "Activate",
      description: "Consent-based enrollment",
      detail: "Families opt-in to the program with full understanding and control",
      icon: <UserCheck className="w-6 h-6" />
    },
    {
      step: "Detect",
      description: "Event-based monitoring",
      detail: "Advanced technology identifies falls in real-time, focusing only on critical events",
      icon: <Eye className="w-6 h-6" />
    },
    {
      step: "Notify",
      description: "Immediate alerts",
      detail: "Staff are notified instantly when a fall is detected for rapid response",
      icon: <Bell className="w-6 h-6" />
    },
    {
      step: "Review",
      description: "Clear video analysis",
      detail: "Secure review of events helps understand what happened and why",
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: "Adapt",
      description: "Care plan optimization",
      detail: "Insights inform better care plans and environmental adjustments",
      icon: <Activity className="w-6 h-6" />
    }
  ];

  const privacyFeatures = [
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Opt-in Only",
      description: "Participation is completely voluntary with full consent control"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bedroom Only",
      description: "Cameras only in bedrooms, never in bathrooms or common areas"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "No Live Stream",
      description: "Event-based recording only, no continuous monitoring"
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Auto-Delete",
      description: "Non-event video automatically deleted within minutes"
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "30 Minutes Faster",
      description: "Average response time improvement"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "40% Fewer Falls",
      description: "Overall reduction in fall incidents"
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "80% Fewer ER Visits",
      description: "Reduction in fall-related emergency transfers"
    }
  ];

  const faqs = [
    {
      question: "Is my loved one always being recorded?",
      answer: "No. Monitoring is event-based only. The system records a short window before and after a detected fall. If no event is detected, nothing is recorded. All non-event video is automatically deleted within minutes."
    },
    {
      question: "Does this mean cameras are on all the time?",
      answer: "No. Cameras are installed in bedrooms only (never bathrooms or common areas) and are activated only with family consent. They are not live streaming. No audio is recorded at any time."
    },
    {
      question: "How does this improve safety?",
      answer: "Most falls in senior living occur in bedrooms, often overnight and unwitnessed. By detecting these events in real time, staff are alerted immediately—allowing faster assistance, fewer unnecessary ER transfers, and better follow-up care."
    },
    {
      question: "What happens after a fall is detected?",
      answer: "Alert: Staff are notified right away.\nResponse: Caregivers arrive quickly to help.\nReview: The event is securely reviewed to understand what happened.\nAdapt: Care plans and the environment are updated to reduce future risk.\nCommunicate: Families are kept informed, with clear explanations of what occurred and what steps we're taking."
    },
    {
      question: "How does this protect privacy?",
      answer: "• Consent-based participation; you can opt out anytime.\n• Bedroom-only coverage (never bathrooms).\n• No live streaming, no audio.\n• Non-event video deleted within minutes.\n• Access limited to trained staff and clinical partners through a secure portal."
    },
    {
      question: "Can we opt in later or change our mind?",
      answer: "Yes. Participation is entirely optional. You may opt in at move-in or any time later, and you can opt out whenever you choose."
    },
    {
      question: "Does this replace caregivers?",
      answer: "Not at all. This feature is designed to support staff, not replace them. It provides additional \"eyes\" during unwitnessed times so staff can respond more quickly and accurately."
    },
    {
      question: "What benefits have other communities seen?",
      answer: "Independent studies show:\n• ~40% fewer falls overall\n• Up to 80% fewer fall-related ER visits\n• 30 minutes faster average response times\n\nThese outcomes translate to fewer disruptions for residents and greater peace of mind for families."
    },
    {
      question: "Does this cost extra?",
      answer: "No. This is part of our comprehensive safety and care program. We believe enhanced fall safety is a standard every resident deserves."
    },
    {
      question: "How is this different from wearable devices?",
      answer: "Residents don't have to wear or remember anything. Monitoring is discreet, accurate, and always on in the background—with no disruption to daily life."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
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
                <BreadcrumbPage data-testid="breadcrumb-current">Safety with Dignity</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 mb-6 bg-blue-100 rounded-full">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6" data-testid="page-title">
              Safety with Dignity
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed" data-testid="hero-subtitle">
              Our program helps identify unwitnessed falls quickly, alerts staff immediately, and adapts care—without live streaming or audio.
            </p>
            <Button 
              size="lg" 
              onClick={scrollToHowItWorks}
              className="px-8 py-6 text-lg"
              data-testid="button-see-how-it-works"
            >
              See how it works
              <ChevronDown className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="why-matters-title">
              Why this matters
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Overnight and bedroom falls are common; speed and clarity change outcomes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`benefit-card-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      {benefit.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary" data-testid={`benefit-title-${index}`}>
                        {benefit.title}
                      </div>
                      <div className="text-sm text-muted-foreground" data-testid={`benefit-description-${index}`}>
                        {benefit.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="how-it-works-title">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A simple 5-step process designed to maximize safety while preserving dignity and privacy
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="relative" data-testid={`process-step-${index}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                        {step.icon}
                      </div>
                      <div className="text-sm font-semibold text-primary mb-1">Step {index + 1}</div>
                      <h3 className="text-xl font-bold mb-2" data-testid={`step-title-${index}`}>
                        {step.step}
                      </h3>
                      <p className="text-sm font-medium text-foreground mb-2" data-testid={`step-description-${index}`}>
                        {step.description}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`step-detail-${index}`}>
                        {step.detail}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronDown className="w-6 h-6 text-muted-foreground rotate-[-90deg]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Consent Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="privacy-title">
              Privacy & Consent
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy is paramount. Our system is designed with multiple layers of protection.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {privacyFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow" data-testid={`privacy-card-${index}`}>
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" data-testid={`privacy-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`privacy-description-${index}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What Families Can Expect Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="families-expect-title">
                What families can expect
              </h2>
              <p className="text-lg text-muted-foreground">
                Peace of mind through faster assistance, fewer unnecessary disruptions, and clear post-incident communication.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow" data-testid="families-card-1">
                <CardContent className="p-6">
                  <HeartHandshake className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Transparent Communication</h3>
                  <p className="text-muted-foreground">
                    You'll receive timely updates about any incidents, with clear explanations of what happened and how we're responding. No surprises, just honest partnership in your loved one's care.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow" data-testid="families-card-2">
                <CardContent className="p-6">
                  <CheckCircle className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Proactive Care Improvements</h3>
                  <p className="text-muted-foreground">
                    Insights from the system help us continuously improve care plans and adjust the environment to prevent future incidents. Every event becomes a learning opportunity for better care.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="video-title">
              How Our Safety System Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Clear, simple, and reassuring—see for yourself how we protect residents with dignity.
            </p>
            <p className="text-muted-foreground mt-2">
              This short video walks you through the process step-by-step—so you can see exactly what families and residents can expect.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-xl" data-testid="video-container">
              <div className="relative aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/ConnW3hpK4c"
                  title="How Our Safety System Works"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  data-testid="youtube-video"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="faq-title">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our Safety with Dignity program
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
                <AccordionTrigger className="text-left" data-testid={`faq-question-${index}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent data-testid={`faq-answer-${index}`}>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="cta-title">
            Still have questions?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Our team would be happy to walk you through the program in person, show you how it works, and answer anything specific to your loved one's situation.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="px-8 py-6 text-lg"
            asChild
            data-testid="button-schedule-visit"
          >
            <Link href="/communities/the-gardens-on-quail">
              Schedule a Visit
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}