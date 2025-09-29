import { useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PageHero } from "@/components/PageHero";
import { 
  Briefcase, 
  Heart, 
  Users, 
  Award, 
  Building2, 
  Mail, 
  MapPin, 
  Clock,
  DollarSign,
  GraduationCap,
  Shield
} from "lucide-react";

export default function Careers() {
  useEffect(() => {
    document.title = "Careers | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Join Stage Senior and build a career that makes a difference. Explore opportunities at our four Colorado communities with competitive benefits and supportive culture.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Join Stage Senior and build a career that makes a difference. Explore opportunities at our four Colorado communities with competitive benefits and supportive culture.';
      document.head.appendChild(meta);
    }
  }, []);
  const openPositions = [
    {
      title: "Registered Nurse (RN)",
      location: "Multiple Locations",
      type: "Full-Time",
      department: "Healthcare",
      description: "Join our caring team to provide exceptional healthcare services to our residents."
    },
    {
      title: "Certified Nursing Assistant (CNA)",
      location: "Golden Pond - Golden, CO",
      type: "Full-Time / Part-Time",
      department: "Healthcare",
      description: "Help residents with daily activities while building meaningful relationships."
    },
    {
      title: "Activities Coordinator",
      location: "The Gardens at Columbine - Littleton, CO",
      type: "Full-Time",
      department: "Recreation",
      description: "Create and lead engaging programs that enrich our residents' lives."
    },
    {
      title: "Dining Services Manager",
      location: "The Gardens on Quail - Arvada, CO",
      type: "Full-Time",
      department: "Hospitality",
      description: "Oversee dining operations and ensure exceptional culinary experiences."
    },
    {
      title: "Memory Care Specialist",
      location: "Stonebridge Senior - Arvada, CO",
      type: "Full-Time",
      department: "Memory Care",
      description: "Provide specialized care for residents with memory-related conditions."
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive medical, dental, and vision coverage for you and your family"
    },
    {
      icon: DollarSign,
      title: "Competitive Pay",
      description: "Above-market wages with regular performance reviews and raises"
    },
    {
      icon: GraduationCap,
      title: "Education Support",
      description: "Tuition reimbursement and professional development opportunities"
    },
    {
      icon: Clock,
      title: "Work-Life Balance",
      description: "Flexible scheduling, PTO, and paid holidays"
    },
    {
      icon: Shield,
      title: "Retirement Planning",
      description: "401(k) with company match to secure your future"
    },
    {
      icon: Users,
      title: "Team Culture",
      description: "Join a supportive team that values your contributions"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        pagePath="/careers"
        defaultTitle="Build a Career That Makes a Difference"
        defaultSubtitle="Join Our Team"
        defaultBackgroundImage="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=2000&q=80"
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
                <BreadcrumbPage data-testid="breadcrumb-current">Careers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Why Work Here */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Stage Senior?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're not just another senior living company. We're a Colorado family that 
              treats our team members as well as they treat our residents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Locally Owned Since 2016</h3>
                <p className="text-muted-foreground">
                  Work for a company with Colorado values and true community connections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Staff-First Culture</h3>
                <p className="text-muted-foreground">
                  We invest in our team because we know great care starts with supported caregivers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">4 Beautiful Communities</h3>
                <p className="text-muted-foreground">
                  Work in modern, well-maintained facilities across the Front Range
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Benefits That Support You
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We offer comprehensive benefits that show we value you as much as you value our residents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <benefit.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Current Openings
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore career opportunities at our four Colorado communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">The Gardens on Quail</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" />
                  Arvada, CO
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Join our upscale community offering independent living, assisted living, and memory care in a beautiful setting.
                </p>
                <Button className="w-full" asChild>
                  <a href="https://www.gardensonquail.com/employment" target="_blank" rel="noopener noreferrer">
                    View Open Positions
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Golden Pond</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" />
                  Golden, CO
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Be part of a community with 20+ years of excellence in senior care, offering IL, AL, and memory care.
                </p>
                <Button className="w-full" asChild>
                  <a href="https://www.goldenpond.com/employment" target="_blank" rel="noopener noreferrer">
                    View Open Positions
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">The Gardens at Columbine</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" />
                  Littleton, CO
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Work in our serene community known for expansive gardens and thoughtful memory care design.
                </p>
                <Button className="w-full" asChild>
                  <a href="https://www.gardensatcolumbine.com/employment" target="_blank" rel="noopener noreferrer">
                    View Open Positions
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Stonebridge Senior</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" />
                  Arvada, CO
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Join a team committed to our 'Your Story First' philosophy of personalized care.
                </p>
                <Button className="w-full" asChild>
                  <a href="https://www.stonebridgesenior.com/careers" target="_blank" rel="noopener noreferrer">
                    View Open Positions
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Have questions about careers at Stage Senior? We're here to help.
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:careers@stagesenior.com">
                Contact Our HR Team
              </a>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}