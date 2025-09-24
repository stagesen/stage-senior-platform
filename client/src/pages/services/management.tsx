import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Shield, 
  Award, 
  CheckCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  BarChart3, 
  Settings, 
  Heart,
  Target,
  Star,
  Clipboard,
  DollarSign,
  Stethoscope,
  UserCheck
} from "lucide-react";

export default function ProfessionalManagement() {
  useEffect(() => {
    document.title = "Professional Management Services | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stage Senior Professional Management Services - LOCAL LEADERSHIP, PROVEN EXCELLENCE. Expert senior living management with comprehensive operating systems, service excellence, and team development.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Stage Senior Professional Management Services - LOCAL LEADERSHIP, PROVEN EXCELLENCE. Expert senior living management with comprehensive operating systems, service excellence, and team development.';
      document.head.appendChild(meta);
    }
  }, []);

  const operationalPillars = [
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Comprehensive Operating Systems",
      features: [
        "Sophisticated management protocols that ensure consistency and quality",
        "Performance tracking and transparent reporting",
        "Proactive maintenance and property management",
        "Integrated technology solutions for enhanced care delivery"
      ]
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Service Excellence",
      features: [
        "Premium dining experiences with chef-crafted menus",
        "Engaging activity programs that promote social connection",
        "Professional housekeeping and maintenance services",
        "Personalized care plans that adapt to changing needs"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Development",
      features: [
        "Ongoing professional training and advancement opportunities",
        "Competitive compensation and benefits",
        "Supportive work environment that promotes retention",
        "Regular team recognition and appreciation programs"
      ]
    }
  ];

  const businessOperations = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Financial Management & Optimization"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Operational Excellence"
    },
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Clinical Care Management"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Resident Experience Enhancement"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Marketing & Occupancy Growth"
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Staffing & Human Resources"
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
                Professional Services
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4" data-testid="page-title">
                Professional Management Services
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-primary mb-8" data-testid="hero-subtitle">
                LOCAL LEADERSHIP, PROVEN EXCELLENCE
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

      {/* Our Management Philosophy Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="philosophy-title">
              Our Management Philosophy
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-muted-foreground leading-relaxed" data-testid="philosophy-content">
                We believe that senior living should be a chapter of life marked by dignity, purpose, and joy. 
                Our management approach focuses on creating environments where residents thrive, families find 
                peace of mind, and staff members grow professionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Excellence - 3 Core Pillars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="pillars-title">
              Operational Excellence
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our approach is built on three core pillars that ensure consistent, high-quality operations 
              and exceptional resident experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {operationalPillars.map((pillar, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow h-full" data-testid={`pillar-card-${index}`}>
                <CardHeader className="text-center">
                  <div className="p-4 rounded-lg bg-primary/10 text-primary mx-auto mb-4 w-fit">
                    {pillar.icon}
                  </div>
                  <CardTitle className="text-xl mb-4" data-testid={`pillar-title-${index}`}>
                    {pillar.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pillar.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3" data-testid={`pillar-feature-${index}-${featureIndex}`}>
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Proven Track Record */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="track-record-title">
              Proven Track Record
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-muted-foreground leading-relaxed" data-testid="track-record-content">
                Our hands-on management approach has created a portfolio of successful communities throughout 
                the Denver metro area. We maintain direct accessibility to both our on-site staff and investors, 
                ensuring alignment with our high standards of care and service.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <p className="text-muted-foreground">Communities Successfully Managed</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">Denver Metro</div>
                <p className="text-muted-foreground">Area Coverage</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">Direct</div>
                <p className="text-muted-foreground">Accessibility to Leadership</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Operations Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="operations-title">
              Comprehensive Business Operations
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our full-service approach covers all aspects of senior living operations, ensuring 
              seamless management across every business function.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessOperations.map((operation, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow text-center p-6" data-testid={`operation-card-${index}`}>
                <CardContent className="pt-6">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary mx-auto mb-4 w-fit">
                    {operation.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground" data-testid={`operation-title-${index}`}>
                    {operation.title}
                  </h3>
                </CardContent>
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
              <h3 className="text-xl font-semibold mb-4">Local Leadership</h3>
              <p className="text-primary-foreground/90">
                Colorado-based leadership team with deep understanding of local markets and community needs.
              </p>
            </div>
            
            <div className="text-center">
              <Heart className="w-12 h-12 mx-auto mb-6 text-primary-foreground" />
              <h3 className="text-xl font-semibold mb-4">Resident-Focused</h3>
              <p className="text-primary-foreground/90">
                Every decision prioritizes resident wellbeing, family satisfaction, and quality of life.
              </p>
            </div>
            
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-6 text-primary-foreground" />
              <h3 className="text-xl font-semibold mb-4">Proven Results</h3>
              <p className="text-primary-foreground/90">
                Transparent reporting and measurable improvements in operational performance and resident satisfaction.
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