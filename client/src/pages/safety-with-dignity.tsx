import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Shield, 
  AlertCircle, 
  Lock, 
  Users, 
  CheckCircle, 
  Clock, 
  Eye, 
  Bell, 
  FileText, 
  HeartHandshake, 
  Play, 
  ChevronDown, 
  MonitorUp, 
  UserCheck, 
  ShieldCheck, 
  Activity,
  ArrowRight,
  Heart,
  Zap,
  TrendingUp,
  Home,
  Star,
  Award,
  Lightbulb,
  Phone,
  BadgeCheck,
  Info
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import { setMetaTags } from "@/lib/metaTags";
import type { PageContentSection } from "@shared/schema";

export default function SafetyWithDignity() {
  // Fetch page content sections from database
  const { data: pageSections = [], isLoading: sectionsLoading } = useQuery<PageContentSection[]>({
    queryKey: ['/api/page-content', { pagePath: '/safety-with-dignity', active: true }],
  });

  useEffect(() => {
    const baseUrl = window.location.origin;
    setMetaTags({
      title: "Safety with Dignity Program | Fall Prevention & Senior Safety",
      description: "Our Safety with Dignity program prioritizes resident safety while maintaining independence. Advanced fall detection and proactive care monitoring.",
      canonicalUrl: `${baseUrl}/safety-with-dignity`,
      ogTitle: "Safety with Dignity Program | Fall Prevention & Senior Safety",
      ogDescription: "Our Safety with Dignity program prioritizes resident safety while maintaining independence. Advanced fall detection and proactive care monitoring.",
      ogType: "website",
      ogUrl: `${baseUrl}/safety-with-dignity`,
      ogSiteName: "Stage Senior Living"
    });
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
      description: "Average response time improvement",
      stat: "30min",
      color: "text-blue-600"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "40% Fewer Falls",
      description: "Overall reduction in fall incidents",
      stat: "40%",
      color: "text-green-600"
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "80% Fewer ER Visits",
      description: "Reduction in fall-related emergency transfers",
      stat: "80%",
      color: "text-purple-600"
    }
  ];

  const comparisonData = [
    {
      feature: "Response Time",
      traditional: "Variable - depends on when found",
      withProgram: "Immediate detection & alert",
      highlight: true
    },
    {
      feature: "Privacy Protection",
      traditional: "Regular check-ins disrupt rest",
      withProgram: "Event-only recording, no live monitoring",
      highlight: false
    },
    {
      feature: "Fall Understanding",
      traditional: "Limited to witness accounts",
      withProgram: "Clear video review for better care planning",
      highlight: true
    },
    {
      feature: "Care Adaptation",
      traditional: "Based on incomplete information",
      withProgram: "Data-driven insights for prevention",
      highlight: false
    },
    {
      feature: "Family Communication",
      traditional: "Delayed or incomplete updates",
      withProgram: "Timely, accurate incident reporting",
      highlight: true
    }
  ];

  const testimonials = [
    {
      quote: "The peace of mind this program provides is invaluable. Knowing my mother has this extra layer of protection, especially at night, helps me sleep better.",
      author: "Sarah M.",
      role: "Daughter of Resident",
      rating: 5
    },
    {
      quote: "When my father had a fall at 2 AM, staff were there within minutes. The quick response prevented what could have been a serious situation.",
      author: "Robert K.",
      role: "Son of Memory Care Resident",
      rating: 5
    },
    {
      quote: "I appreciate that this is consent-based and respects our privacy. It's safety without feeling watched.",
      author: "Eleanor P.",
      role: "Current Resident",
      rating: 5
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

      {/* Hero Section - Loaded from Database */}
      <PageHero 
        pagePath="/safety-with-dignity"
        defaultTitle="Safety with Dignity"
        defaultSubtitle="Our program helps identify unwitnessed falls quickly, alerts staff immediately, and adapts care—without live streaming or audio."
        defaultBackgroundImage="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070"
      />

      {/* Render Database Content Sections */}
      {sectionsLoading ? (
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : (
        <>
          {pageSections
            .filter(section => section.active)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .map((section) => (
              <PageSectionRenderer key={section.id} section={section} />
            ))}
        </>
      )}

      {/* Comparison Section */}
      <section id="comparison" className="py-16 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Traditional Monitoring vs. Safety with Dignity
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              See how our approach transforms fall prevention and response
            </p>
          </div>
          
          <Card className="overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-left p-4 font-semibold">Traditional Approach</th>
                    <th className="text-left p-4 font-semibold">With Safety with Dignity</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className={`border-b ${row.highlight ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="p-4 text-muted-foreground">{row.traditional}</td>
                      <td className="p-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span className="font-medium text-green-900">{row.withProgram}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Privacy & Consent Section - Enhanced with Icons */}
      <section id="privacy" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">Your Privacy Matters</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="privacy-title">
              Privacy & Consent First
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy is paramount. Our system is designed with multiple layers of protection.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div 
              className="rounded-2xl overflow-hidden shadow-lg"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Complete Control</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <BadgeCheck className="w-6 h-6 shrink-0 mt-0.5" />
                    <span>Opt-in at any time, opt-out whenever you choose</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BadgeCheck className="w-6 h-6 shrink-0 mt-0.5" />
                    <span>Full transparency about how the system works</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BadgeCheck className="w-6 h-6 shrink-0 mt-0.5" />
                    <span>Regular updates and open communication</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {privacyFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1" data-testid={`privacy-card-${index}`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-primary mb-3 flex justify-center">
                      {feature.icon}
                    </div>
                    <h4 className="font-semibold mb-1" data-testid={`privacy-title-${index}`}>
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid={`privacy-description-${index}`}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gradient-to-br from-primary/5 to-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">Real Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Families Are Saying
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from families who've experienced the peace of mind our program provides
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <blockquote className="text-muted-foreground mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What Families Can Expect Section - Enhanced */}
      <section id="what-to-expect" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">Family Partnership</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="families-expect-title">
              What families can expect
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Peace of mind through faster assistance, fewer unnecessary disruptions, and clear post-incident communication.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary" data-testid="families-card-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <HeartHandshake className="w-8 h-8 text-primary shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Transparent Communication</h3>
                      <p className="text-muted-foreground">
                        You'll receive timely updates about any incidents, with clear explanations of what happened and how we're responding. No surprises, just honest partnership in your loved one's care.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-600" data-testid="families-card-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-8 h-8 text-green-600 shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Proactive Care Improvements</h3>
                      <p className="text-muted-foreground">
                        Insights from the system help us continuously improve care plans and adjust the environment to prevent future incidents. Every event becomes a learning opportunity for better care.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-600" data-testid="families-card-3">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Lightbulb className="w-8 h-8 text-blue-600 shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
                      <p className="text-muted-foreground">
                        Monthly reports show trends and improvements in your loved one's safety profile, helping you stay informed about their wellbeing and care progress.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Visual Element */}
            <div 
              className="rounded-2xl overflow-hidden shadow-xl h-full min-h-[400px] flex items-end"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent), url('https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=2070')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="p-8 text-white">
                <h3 className="text-2xl font-bold mb-3">Your Peace of Mind Matters</h3>
                <p className="text-white/90">
                  Join hundreds of families who've found comfort knowing their loved ones have an extra layer of protection, 
                  especially during those vulnerable nighttime hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - Enhanced */}
      <section id="video" className="py-16 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">See It In Action</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="video-title">
              How Our Safety System Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Clear, simple, and reassuring—see for yourself how we protect residents with dignity.
            </p>
            <p className="text-muted-foreground mt-2">
              This short video walks you through the process step-by-step.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-2xl border-0" data-testid="video-container">
              <div className="relative aspect-video bg-gray-900">
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
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Info className="w-4 h-4" />
                Video transcript and closed captions available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section id="faqs" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">Your Questions Answered</Badge>
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
                <AccordionTrigger className="text-left hover:no-underline hover:text-primary transition-colors" data-testid={`faq-question-${index}`}>
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent data-testid={`faq-answer-${index}`}>
                  <div className="text-muted-foreground whitespace-pre-line pl-8">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section - Enhanced */}
      <section id="contact" className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white relative overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="cta-title">
            Still have questions?
          </h2>
          <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto">
            Our team would be happy to walk you through the program in person, show you how it works, and answer anything specific to your loved one's situation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
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
            <Button 
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg bg-transparent text-white border-white hover:bg-white/10"
              asChild
              data-testid="button-call-now"
            >
              <a href="tel:+1-303-424-6116">
                <Phone className="mr-2 w-5 h-5" />
                Call (303) 424-6116
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Add missing import
import { HelpCircle } from "lucide-react";