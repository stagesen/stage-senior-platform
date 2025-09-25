import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Building2, TrendingUp, Users, Shield, Award, Star, CheckCircle, Phone, Mail, MapPin, Calendar, BarChart3, Settings, Heart } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function ProfessionalManagement() {
  useEffect(() => {
    document.title = "Professional Management Services | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stage Senior Professional Management Services - Expert senior living management solutions for community owners and operators. Proven systems, staff development, and operational excellence.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Stage Senior Professional Management Services - Expert senior living management solutions for community owners and operators. Proven systems, staff development, and operational excellence.';
      document.head.appendChild(meta);
    }
  }, []);

  const services = [
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Operations Management",
      description: "Comprehensive operational oversight to maximize efficiency, resident satisfaction, and financial performance.",
      features: [
        "Daily operations management and oversight",
        "Financial management and budgeting",
        "Quality assurance and compliance monitoring",
        "Vendor management and cost optimization",
        "Technology integration and system implementation",
        "Performance metrics and reporting"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Staff Development & Training",
      description: "Building high-performing teams through comprehensive training, development, and retention programs.",
      features: [
        "Recruitment and hiring strategies",
        "Comprehensive training programs",
        "Leadership development and mentoring",
        "Performance management systems",
        "Employee retention initiatives",
        "Values-based culture development"
      ]
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Care Program Development",
      description: "Implementing proven care models and programs that enhance resident outcomes and family satisfaction.",
      features: [
        "Care model implementation and training",
        "Memory care programming",
        "Wellness and lifestyle programs",
        "Family engagement strategies",
        "Resident satisfaction initiatives",
        "Care plan optimization"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Business Growth & Marketing",
      description: "Strategic marketing and sales support to drive census growth and community reputation.",
      features: [
        "Marketing strategy and implementation",
        "Sales training and support",
        "Community outreach programs",
        "Digital marketing and online presence",
        "Referral relationship building",
        "Brand development and positioning"
      ]
    }
  ];

  const results = [
    {
      metric: "98%",
      description: "Average resident satisfaction across managed communities"
    },
    {
      metric: "40%",
      description: "Reduction in staff turnover within first year"
    },
    {
      metric: "25%",
      description: "Average increase in census within 18 months"
    },
    {
      metric: "15%",
      description: "Improvement in operational efficiency metrics"
    }
  ];

  const testimonials = [
    {
      quote: "Stage Senior transformed our community operations. Their systematic approach and focus on staff development created lasting positive changes.",
      author: "Community Owner",
      location: "Denver Metro Area"
    },
    {
      quote: "The care quality improvements and resident satisfaction scores speak for themselves. Stage Senior delivers on their promises.",
      author: "Board Member",
      location: "Colorado Springs"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Assessment & Planning",
      description: "Comprehensive evaluation of current operations, staff, and systems to identify opportunities for improvement."
    },
    {
      step: "2",
      title: "Implementation",
      description: "Phased rollout of systems, training programs, and operational improvements with clear timelines and milestones."
    },
    {
      step: "3",
      title: "Ongoing Support",
      description: "Continuous monitoring, support, and optimization to ensure sustained success and growth."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        pagePath="/services/management"
        defaultTitle="Professional Management"
        defaultSubtitle="Expert Senior Living Operations"
        defaultDescription="Proven management solutions that elevate communities through operational excellence, staff development, and resident-first care philosophy."
        defaultBackgroundImage="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=2000&q=80"
      />
      
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
                <BreadcrumbLink asChild>
                  <Link href="/services" data-testid="breadcrumb-services">Services</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage data-testid="breadcrumb-current">Professional Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="secondary" data-testid="hero-badge">
                <Building2 className="w-4 h-4 mr-1" />
                B2B Services
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6" data-testid="page-title">
                Professional Management Services
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="hero-description">
                Partner with Stage Senior to transform your senior living community through proven management systems, 
                staff development programs, and operational excellence that drive results.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild data-testid="button-schedule-consultation">
                  <a href="tel:+1-303-436-2300">
                    <Phone className="w-5 h-5 mr-2" />
                    Schedule Consultation
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-view-portfolio">
                  <Link href="/communities">
                    <Building2 className="w-5 h-5 mr-2" />
                    View Our Portfolio
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1664475135230-a0cc8e2fce67?q=80&w=800&auto=format&fit=crop"
                alt="Professional senior living management team in meeting"
                className="rounded-lg shadow-xl w-full"
                data-testid="hero-image"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 fill-current" />
                  <span className="font-bold text-lg">Since 2016</span>
                </div>
                <p className="text-sm">Proven Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="results-title">
              Proven Results for Our Partners
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our management approach delivers measurable improvements in resident satisfaction, 
              staff retention, and operational performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {results.map((result, index) => (
              <Card key={index} className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors" data-testid={`result-card-${index}`}>
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-4" data-testid={`result-metric-${index}`}>
                    {result.metric}
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid={`result-description-${index}`}>
                    {result.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-primary/5 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 bg-white/80" data-testid={`testimonial-${index}`}>
                  <CardContent className="p-6">
                    <blockquote className="text-foreground mb-4 italic" data-testid={`testimonial-quote-${index}`}>
                      "{testimonial.quote}"
                    </blockquote>
                    <footer className="text-sm text-muted-foreground">
                      <div className="font-semibold" data-testid={`testimonial-author-${index}`}>
                        {testimonial.author}
                      </div>
                      <div data-testid={`testimonial-location-${index}`}>
                        {testimonial.location}
                      </div>
                    </footer>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="services-title">
              Comprehensive Management Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our full-service management approach addresses every aspect of senior living operations, 
              from daily care delivery to strategic business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`service-card-${index}`}>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl" data-testid={`service-title-${index}`}>
                      {service.title}
                    </CardTitle>
                  </div>
                  <p className="text-muted-foreground" data-testid={`service-description-${index}`}>
                    {service.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2" data-testid={`service-feature-${index}-${featureIndex}`}>
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

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="process-title">
              Our Partnership Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We take a systematic approach to transforming your community operations, 
              ensuring sustainable improvements and measurable results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <Card key={index} className="text-center p-6 relative" data-testid={`process-step-${index}`}>
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-4" data-testid={`process-title-${index}`}>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground" data-testid={`process-description-${index}`}>
                    {step.description}
                  </p>
                </CardContent>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Stage Senior */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="why-choose-title">
              Why Choose Stage Senior Management?
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Our locally-owned approach combined with sophisticated systems creates sustainable success 
              for communities and exceptional experiences for residents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-6 text-primary-foreground" />
              <h3 className="text-xl font-semibold mb-4">Proven Track Record</h3>
              <p className="text-primary-foreground/90">
                Since 2016, we've successfully managed and transformed senior living communities 
                across Colorado with consistently strong results.
              </p>
            </div>
            
            <div className="text-center">
              <Heart className="w-12 h-12 mx-auto mb-6 text-primary-foreground" />
              <h3 className="text-xl font-semibold mb-4">Values-Driven Approach</h3>
              <p className="text-primary-foreground/90">
                Our "Locally Owned, Resident-Focused" philosophy ensures that every decision 
                prioritizes resident wellbeing and family satisfaction.
              </p>
            </div>
            
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-6 text-primary-foreground" />
              <h3 className="text-xl font-semibold mb-4">Measurable Results</h3>
              <p className="text-primary-foreground/90">
                We provide transparent reporting and measurable improvements in key performance 
                indicators that matter to your business success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="contact-cta-title">
            Ready to Transform Your Community?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Let's discuss how Stage Senior's professional management services can help your community 
            achieve operational excellence and exceptional resident satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-schedule-meeting">
              <a href="tel:+1-303-436-2300">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule a Meeting
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild data-testid="button-email-us">
              <a href="mailto:info@stagesenior.com">
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </a>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div data-testid="contact-phone">
                <Phone className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Call Us</p>
                <p className="text-muted-foreground">(303) 436-2300</p>
              </div>
              <div data-testid="contact-email">
                <Mail className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Email Us</p>
                <p className="text-muted-foreground">info@stagesenior.com</p>
              </div>
              <div data-testid="contact-address">
                <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Visit Us</p>
                <p className="text-muted-foreground">
                  8100 E Arapahoe Road, Suite 208<br />
                  Centennial, CO 80112
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}