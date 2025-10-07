import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  Shield, 
  CheckCircle, 
  Phone, 
  Calendar, 
  FileText, 
  Quote,
  ArrowRight,
  Bell,
  TrendingDown,
  Eye,
  Calculator
} from "lucide-react";

export default function CarePoints() {
  const [selectedSuiteType, setSelectedSuiteType] = useState<"private" | "companion">("private");
  
  useEffect(() => {
    document.title = "Care Points vs Tiered Pricing | Stage Senior";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Only pay for the care your loved one needs—nothing more. Our Care Points approach replaces one-size-fits-all tiers with transparent, personalized plans you can understand at a glance.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Only pay for the care your loved one needs—nothing more. Our Care Points approach replaces one-size-fits-all tiers with transparent, personalized plans you can understand at a glance.';
      document.head.appendChild(meta);
    }
  }, []);

  const baseRents = {
    private: 5770,
    companion: 4890
  };

  const careExamples = [
    {
      title: "Light Support",
      subtitle: "A little help, most days",
      points: 33,
      services: [
        "Bathing / showering — standby / safety supervision (1–2×/week) (~30 pts)",
        "Dressing — buttons, zippers, compression stockings (~3 pts)"
      ],
      tierComparison: 'Many communities: billed as "Level 1" / "service tier," often $1,000+/mo.'
    },
    {
      title: "Moderate Support",
      subtitle: "Hands-on help with the morning routine",
      points: 80,
      services: [
        "Hands-on dressing",
        "Bathing setup & safety",
        "Escorts to meals/activities"
      ]
    },
    {
      title: "Enhanced Support",
      subtitle: "Daily help plus continence & transfers",
      points: 120,
      services: [
        "Bathing + dressing (hands-on)",
        "Incontinence care",
        "Assistance with transfers"
      ]
    },
    {
      title: "Comprehensive Support",
      subtitle: "Full-coverage help, day and night",
      points: 160,
      services: [
        "Incontinence care + transfers",
        "Night safety checks",
        "Memory cues & redirection"
      ]
    }
  ];

  const comparisonBenefits = [
    {
      benefit: "Fairness & Transparency",
      pointsBased: "You pay only for care actually provided.",
      tieredLevels: "You often pay for bundled services you don't need."
    },
    {
      benefit: "Flexibility as Needs Change",
      pointsBased: "Plans adjust up or down as needs change.",
      tieredLevels: "Small changes can jump you into a higher tier with a big price hike."
    },
    {
      benefit: "Personalized Care",
      pointsBased: "Every plan is custom-built.",
      tieredLevels: "Broad categories feel cookie-cutter."
    },
    {
      benefit: "Easier Family Conversations",
      pointsBased: "Clear menu of services and points.",
      tieredLevels: "Feels like pressure to accept unnecessary services."
    },
    {
      benefit: "Predictability",
      pointsBased: "Any increase is tied to a specific, visible change.",
      tieredLevels: "Minor changes can cause large, unexpected increases."
    },
    {
      benefit: "Competitive Differentiator",
      pointsBased: "Transparent, fair, resident-centered.",
      tieredLevels: "Tiers feel less flexible and less personal."
    }
  ];

  const preventionPrinciples = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Published Menu",
      description: "You'll see every service and its point value in writing."
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Clear Triggers",
      description: "Changes only happen when care truly changes (e.g., new daily assistance), not one-off favors."
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      title: "Right-Sizing",
      description: "We aim to round down small fluctuations to avoid back-and-forth."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Advance Notice",
      description: "We discuss any change before it shows up on your bill."
    }
  ];

  const faqs = [
    {
      question: "How do you determine the initial care points?",
      answer: "A nurse-led assessment measures the exact supports your loved one needs. We build the plan with you."
    },
    {
      question: "How often do points change?",
      answer: "We reassess as needs change or at regular check-ins. You'll review and approve any adjustments first."
    },
    {
      question: "What if my loved one improves—or has a temporary setback?",
      answer: "Points go down when needs decrease. For short-term changes (e.g., post-hospital), we can set temporary plans and revisit."
    },
    {
      question: "Is medication management billed separately?",
      answer: "It's included as points like any other support. We'll show the exact point value and frequency."
    },
    {
      question: "Will I be surprised by increases?",
      answer: "No. We only change pricing when the plan changes, and we discuss it with you first."
    },
    {
      question: "Can we get a written menu of services and points?",
      answer: "Yes. We publish our menu and walk you through every line."
    },
    {
      question: "Do you offer both Assisted Living and Memory Care?",
      answer: "Yes—both use Care Points so your plan is always right-sized and transparent."
    },
    {
      question: "What's my next step?",
      answer: "Use the estimator for a ballpark, then book a Pricing Consult to get your precise plan."
    }
  ];

  const testimonials = [
    {
      quote: "My grandma is so comfortable and loves it here",
      author: "Austin D",
      source: "From Google Review"
    },
    {
      quote: "Every step of the way, the staff were attentive to his needs. Most all his requests were fulfilled, making it very clear his safety and wellbeing were their foremost concern.",
      author: "Sarah C",
      source: "From Google Review"
    },
    {
      quote: "I'm a home health nurse with Envision and I have to say this is one of the best communities I get to visit.",
      author: "Amanda J",
      source: "From Google Review"
    }
  ];

  const calculateTotal = (points: number) => {
    const careAmount = points * 20;
    const baseRent = baseRents[selectedSuiteType];
    return {
      careAmount,
      baseRent,
      total: careAmount + baseRent
    };
  };

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
                <BreadcrumbPage data-testid="breadcrumb-current">Care Points</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" data-testid="badge-care-points">Care Points vs Tiered Pricing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="hero-title">
              Only Pay for the Care Your Loved One Needs—Nothing More
            </h1>
            <p className="text-xl text-muted-foreground mb-8" data-testid="hero-description">
              Our Care Points approach replaces one-size-fits-all tiers with transparent, personalized plans you can understand at a glance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" data-testid="button-use-calculator">
                <Calculator className="w-5 h-5 mr-2" />
                Use our Estimate Calculator
              </Button>
              <Button size="lg" variant="outline" data-testid="button-schedule-consult">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule a Pricing Consult
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What Are Care Points */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12" data-testid="what-are-care-points-title">
            What Are Care Points?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Plain-English definition</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Care Points are a simple way to price only the services your loved one actually receives. Each service (like medication management, bathing, or mobility support) is assigned a small point value. Points add up to a daily total, which translates into your monthly care cost.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Why this matters</h3>
              <p className="text-muted-foreground leading-relaxed">
                You're never pushed into a broad "tier" that includes services you don't need. Your plan can move up or down with your loved one's needs—and you'll always see exactly why.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="p-4 text-left font-semibold">Benefit</th>
                  <th className="p-4 text-left font-semibold">Points-Based System (Us)</th>
                  <th className="p-4 text-left font-semibold">Tiered Levels (Many Communities)</th>
                </tr>
              </thead>
              <tbody>
                {comparisonBenefits.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"} data-testid={`comparison-row-${index}`}>
                    <td className="p-4 font-semibold text-foreground">{item.benefit}</td>
                    <td className="p-4 text-muted-foreground">{item.pointsBased}</td>
                    <td className="p-4 text-muted-foreground">{item.tieredLevels}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Examples */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4" data-testid="pricing-examples-title">
            What monthly care looks like—simple, real examples
          </h2>
          <p className="text-center text-muted-foreground mb-12">Scroll to see examples</p>

          <Tabs defaultValue="assisted-living" className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2" data-testid="care-type-tabs">
              <TabsTrigger value="assisted-living" data-testid="tab-assisted-living">Assisted Living</TabsTrigger>
              <TabsTrigger value="memory-care" data-testid="tab-memory-care">Memory Care</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Suite Type</h3>
            <div className="flex gap-4">
              <Button
                variant={selectedSuiteType === "private" ? "default" : "outline"}
                onClick={() => setSelectedSuiteType("private")}
                data-testid="button-private-suite"
              >
                Private Suite
              </Button>
              <Button
                variant={selectedSuiteType === "companion" ? "default" : "outline"}
                onClick={() => setSelectedSuiteType("companion")}
                data-testid="button-companion-suite"
              >
                Companion Suite
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Base Rent (Assisted Living, {selectedSuiteType === "private" ? "Private" : "Companion"} Suite): ${baseRents[selectedSuiteType].toLocaleString()} / month
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careExamples.map((example, index) => {
              const pricing = calculateTotal(example.points);
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`care-example-${index}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-xl mb-1" data-testid={`example-title-${index}`}>
                          {example.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground italic" data-testid={`example-subtitle-${index}`}>
                          "{example.subtitle}"
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-3 py-1" data-testid={`example-points-${index}`}>
                        ~{example.points} pts
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {example.services.map((service, serviceIndex) => (
                        <li key={serviceIndex} className="flex items-start gap-2" data-testid={`example-service-${index}-${serviceIndex}`}>
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                          <span className="text-sm text-muted-foreground">{service}</span>
                        </li>
                      ))}
                    </ul>

                    {example.tierComparison && (
                      <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded" data-testid={`example-comparison-${index}`}>
                        {example.tierComparison}
                      </p>
                    )}

                    <div className="pt-4 border-t space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Care (~{example.points} pts × $20)</span>
                        <span className="font-semibold">${pricing.careAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base Rent (Assisted Living, {selectedSuiteType === "private" ? "Private" : "Companion"} Suite)</span>
                        <span className="font-semibold">${pricing.baseRent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total</span>
                        <span className="text-primary" data-testid={`example-total-${index}`}>
                          ${pricing.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-sm text-blue-900">
              <strong>Figures shown are examples.</strong> Costs may change and are general estimates when published. Your exact plan is confirmed after a professional assessment.
            </p>
          </div>
        </div>
      </section>

      {/* Why Points Beat Tiers */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="why-points-beat-tiers-title">
            Why points beat tiers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="beat-tiers-0">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-2">No cliff pricing</h3>
              <p className="text-primary-foreground/90">
                Care changes in $20 steps, not $500–$1,000 tier jumps.
              </p>
            </div>
            
            <div className="text-center" data-testid="beat-tiers-1">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-2">Resident-centered</h3>
              <p className="text-primary-foreground/90">
                Points follow recurring needs and can adjust up or down.
              </p>
            </div>
            
            <div className="text-center" data-testid="beat-tiers-2">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-2">Transparent math</h3>
              <p className="text-primary-foreground/90">
                Total = Base Rent + (Points × $20). That's it.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button size="lg" variant="secondary" data-testid="button-schedule-visit">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule a Visit
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" data-testid="button-pricing-guide">
              <FileText className="w-5 h-5 mr-2" />
              Open Pricing Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Not Nickel-and-Diming */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4" data-testid="prevention-title">
            Not Nickel-and-Diming—Here's How We Prevent It
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {preventionPrinciples.map((principle, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow" data-testid={`prevention-principle-${index}`}>
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                    {principle.icon}
                  </div>
                  <h3 className="font-bold text-foreground mb-2" data-testid={`prevention-title-${index}`}>
                    {principle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`prevention-description-${index}`}>
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12" data-testid="faq-title">
            Frequently asked questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border px-6" data-testid={`faq-item-${index}`}>
                <AccordionTrigger className="text-left font-semibold hover:no-underline" data-testid={`faq-question-${index}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${index}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="testimonials-title">
              Don't just take our word for it
            </h2>
            <p className="text-xl text-muted-foreground">Real reviews from our community members</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`testimonial-${index}`}>
                <CardContent className="pt-6">
                  <Quote className="w-8 h-8 text-primary/40 mb-4" />
                  <blockquote className="text-muted-foreground mb-4" data-testid={`testimonial-quote-${index}`}>
                    {testimonial.quote}
                  </blockquote>
                  <footer className="text-sm">
                    <div className="font-semibold text-foreground" data-testid={`testimonial-author-${index}`}>
                      {testimonial.author}
                    </div>
                    <div className="text-muted-foreground text-xs" data-testid={`testimonial-source-${index}`}>
                      {testimonial.source}
                    </div>
                  </footer>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="final-cta-title">
            Schedule a Pricing Consult
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            You have found a safe and secure place to call home. Take the next steps to make it yours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-schedule-your-visit">
              <Link href="/communities">
                Schedule Your Visit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-virtual-tour">
              <Link href="/communities">
                Virtual Tour
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-8">
            <Button variant="link" size="lg" asChild data-testid="button-call-now">
              <a href="tel:+1-970-444-4689" className="text-xl">
                <Phone className="w-5 h-5 mr-2" />
                (970) 444-4689
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
