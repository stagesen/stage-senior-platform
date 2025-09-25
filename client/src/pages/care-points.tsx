import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DollarSign, Shield, Clock, Users, CheckCircle, AlertCircle, Phone, Calendar, MapPin, FileText, Sparkles, Quote } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function CarePoints() {
  // Fetch care types from API
  const { data: careTypes = [], isLoading: careTypesLoading } = useQuery({
    queryKey: ["/api/care-types"],
  });
  useEffect(() => {
    document.title = "Care Points - Transparent Pricing | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover Stage Senior\'s Care Points system - a transparent, point-based pricing model for additional services that eliminates surprise charges and ensures families are consulted before any care plan changes.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover Stage Senior\'s Care Points system - a transparent, point-based pricing model for additional services that eliminates surprise charges and ensures families are consulted before any care plan changes.';
      document.head.appendChild(meta);
    }
  }, []);

  const carePointsPrinciples = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "No Surprise Charges",
      description: "Every additional service has a clear, published point value. You'll know exactly what costs what before any service is provided.",
      features: [
        "Published pricing for all services",
        "Transparent point values",
        "No hidden fees or charges",
        "Clear billing statements"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Family Consultation",
      description: "Changes to care plans only happen when care needs genuinely change, and families are always consulted in advance.",
      features: [
        "Advance notice of any changes",
        "Family involvement in decisions",
        "Care plan review meetings",
        "Open communication channels"
      ]
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Needs-Based Adjustments",
      description: "Care Points only change when actual care needs change, ensuring fair and appropriate pricing for the care level required.",
      features: [
        "Regular care assessments",
        "Evidence-based adjustments",
        "Periodic care plan reviews",
        "Justified pricing changes only"
      ]
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Clear Documentation",
      description: "Every Care Points adjustment is thoroughly documented with clear explanations and justifications provided to families.",
      features: [
        "Detailed care assessments",
        "Written justifications",
        "Progress documentation",
        "Regular reporting to families"
      ]
    }
  ];

  const serviceCategories = [
    {
      category: "Personal Care Assistance",
      description: "Support with activities of daily living",
      services: [
        { service: "Medication reminders", points: "1-2 points", frequency: "Per reminder" },
        { service: "Assistance with bathing", points: "3-5 points", frequency: "Per assistance" },
        { service: "Dressing assistance", points: "2-3 points", frequency: "Per assistance" },
        { service: "Mobility assistance", points: "2-4 points", frequency: "As needed" }
      ]
    },
    {
      category: "Health & Wellness Services",
      description: "Medical and wellness support services",
      services: [
        { service: "Blood pressure monitoring", points: "1 point", frequency: "Per check" },
        { service: "Diabetes management", points: "2-3 points", frequency: "Daily support" },
        { service: "Wound care assistance", points: "3-4 points", frequency: "Per treatment" },
        { service: "Physical therapy coordination", points: "2 points", frequency: "Per session" }
      ]
    },
    {
      category: "Specialized Memory Care",
      description: "Additional support for memory-related needs",
      services: [
        { service: "Enhanced supervision", points: "4-6 points", frequency: "Daily" },
        { service: "Behavioral management", points: "3-5 points", frequency: "As needed" },
        { service: "Memory care activities", points: "2-3 points", frequency: "Per program" },
        { service: "Family consultation", points: "No charge", frequency: "Always included" }
      ]
    },
    {
      category: "Lifestyle Enhancement",
      description: "Services to enrich daily living",
      services: [
        { service: "Laundry assistance", points: "1-2 points", frequency: "Per load" },
        { service: "Shopping assistance", points: "2-3 points", frequency: "Per trip" },
        { service: "Transportation coordination", points: "2-4 points", frequency: "Per appointment" },
        { service: "Social engagement support", points: "1-2 points", frequency: "Per activity" }
      ]
    }
  ];

  const benefitStats = [
    {
      stat: "100%",
      description: "Transparent Pricing",
      detail: "Every service has a published point value"
    },
    {
      stat: "30 Days",
      description: "Advance Notice",
      detail: "Minimum notice for any care plan changes"
    },
    {
      stat: "Zero",
      description: "Hidden Fees",
      detail: "No surprise charges or undisclosed costs"
    },
    {
      stat: "24/7",
      description: "Family Access",
      detail: "Open communication about care and pricing"
    }
  ];

  const testimonials = [
    {
      quote: "The Care Points system gave us complete transparency about Mom's care costs. No surprises, just clear pricing that made sense with her needs.",
      author: "Jennifer K.",
      community: "Golden Pond",
      relationship: "Daughter of resident"
    },
    {
      quote: "When Dad needed additional assistance, they explained exactly what it would cost and why. We were involved in every decision about his care plan.",
      author: "Robert M.",
      community: "The Gardens at Columbine",
      relationship: "Son of resident"
    },
    {
      quote: "I appreciate how they only charge for services Mom actually uses. The point system is fair and transparent - no nickel and diming.",
      author: "Patricia L.",
      community: "Stonebridge Senior",
      relationship: "Daughter of resident"
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
                <BreadcrumbPage data-testid="breadcrumb-current">Care Points</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <PageHero
        pagePath="/care-points"
        defaultTitle="Care Points"
        defaultSubtitle="Our revolutionary transparent pricing system for additional services"
        defaultBackgroundImage="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=2000&q=80"
      />

      {/* What is Care Points Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="what-is-care-points-title">
              What is the Care Points System?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Care Points is our transparent, point-based pricing system that eliminates surprise charges 
              and ensures families are always informed about additional care services and their costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefitStats.map((stat, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow" data-testid={`benefit-stat-${index}`}>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2" data-testid={`stat-number-${index}`}>
                    {stat.stat}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2" data-testid={`stat-title-${index}`}>
                    {stat.description}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`stat-detail-${index}`}>
                    {stat.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-primary/5 rounded-xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="how-it-works-title">
                  How Care Points Work
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Assessment & Planning</h4>
                      <p className="text-muted-foreground text-sm">We assess each resident's individual care needs and create a personalized care plan.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Transparent Pricing</h4>
                      <p className="text-muted-foreground text-sm">Each additional service has a published point value that translates to clear pricing.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Family Involvement</h4>
                      <p className="text-muted-foreground text-sm">Any changes to care needs require family consultation and approval before implementation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Clear Billing</h4>
                      <p className="text-muted-foreground text-sm">Monthly statements show exactly which services were provided and their point values.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">No Surprise Promise</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  We guarantee that no additional charges will appear on your statement without prior family discussion and approval.
                </p>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Family Protection Guarantee
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Care Points Principles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="principles-title">
              Care Points Core Principles
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our Care Points system is built on four fundamental principles that ensure transparency, 
              fairness, and family involvement in all care decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {carePointsPrinciples.map((principle, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`principle-card-${index}`}>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {principle.icon}
                    </div>
                    <CardTitle className="text-xl" data-testid={`principle-title-${index}`}>
                      {principle.title}
                    </CardTitle>
                  </div>
                  <p className="text-muted-foreground" data-testid={`principle-description-${index}`}>
                    {principle.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {principle.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2" data-testid={`principle-feature-${index}-${featureIndex}`}>
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories & Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="service-categories-title">
              Service Categories & Point Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Below are examples of our service categories and their typical point values. 
              Actual point values are determined based on individual assessments and care needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`service-category-${index}`}>
                <CardHeader>
                  <CardTitle className="text-xl text-primary" data-testid={`category-title-${index}`}>
                    {category.category}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm" data-testid={`category-description-${index}`}>
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid={`service-item-${index}-${serviceIndex}`}>
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm" data-testid={`service-name-${index}-${serviceIndex}`}>
                            {service.service}
                          </p>
                          <p className="text-xs text-muted-foreground" data-testid={`service-frequency-${index}-${serviceIndex}`}>
                            {service.frequency}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs" data-testid={`service-points-${index}-${serviceIndex}`}>
                          {service.points}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Note About Pricing</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  These are example point values for illustration purposes. Actual care needs and point values 
                  are determined through individual assessments with input from residents, families, and our care team. 
                  All pricing is discussed and agreed upon before any services begin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Family Testimonials */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="testimonials-title">
              What Families Say About Care Points
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Hear from families who appreciate the transparency and fairness of our Care Points system.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground" data-testid={`testimonial-${index}`}>
                <CardContent className="p-6">
                  <Quote className="w-6 h-6 text-primary-foreground/60 mb-4" />
                  <blockquote className="text-sm mb-4 italic" data-testid={`testimonial-quote-${index}`}>
                    "{testimonial.quote}"
                  </blockquote>
                  <footer className="text-xs">
                    <div className="font-semibold" data-testid={`testimonial-author-${index}`}>
                      {testimonial.author}
                    </div>
                    <div className="text-primary-foreground/80" data-testid={`testimonial-relationship-${index}`}>
                      {testimonial.relationship}
                    </div>
                    <div className="text-primary-foreground/60" data-testid={`testimonial-community-${index}`}>
                      {testimonial.community}
                    </div>
                  </footer>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="contact-cta-title">
            Learn More About Our Care Points System
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Schedule a consultation to learn how our transparent Care Points system can provide 
            peace of mind for your family while ensuring your loved one receives the exact care they need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-schedule-consultation">
              <Link href="/communities">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule a Consultation
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild data-testid="button-call-now">
              <a href="tel:+1-303-436-2300">
                <Phone className="w-5 h-5 mr-2" />
                Call (303) 436-2300
              </a>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-muted-foreground mb-4">
              <strong>Have questions about Care Points pricing?</strong><br />
              Our care coordinators can explain exactly how the system works and provide 
              personalized information about care costs for your specific situation.
            </p>
            <p className="text-sm text-muted-foreground">
              Email us at <a href="mailto:info@stagesenior.com" className="text-primary hover:underline">info@stagesenior.com</a> 
              or visit us at 8100 E Arapahoe Road, Suite 208, Centennial, CO 80112
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}