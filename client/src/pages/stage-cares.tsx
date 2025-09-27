import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Heart, Globe, Users, HandHeart, Target, DollarSign, Calendar, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { useQuery } from "@tanstack/react-query";
import CommunityCard from "@/components/CommunityCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Community } from "@shared/schema";

export default function StageCares() {
  useEffect(() => {
    document.title = "Stage Cares Foundation - Charitable Giving | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stage Cares Foundation - Our charitable giving program creating positive change through employee participation, company matching, and community support for those in need.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Stage Cares Foundation - Our charitable giving program creating positive change through employee participation, company matching, and community support for those in need.';
      document.head.appendChild(meta);
    }
  }, []);

  // Fetch communities for the bottom section
  const { data: communities, isLoading: communitiesLoading } = useQuery<Community[]>({
    queryKey: ['/api/communities'],
  });

  const projectCards = [
    {
      title: "Yorkin, Costa Rica",
      description: "Our goal for 2022 is to purchase 3,000 organic cocoa plants for the village of Yorkin and deliver these plants on a mission trip from July 1-9, 2022.",
      goal: "$5,000",
      icon: <MapPin className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1598662779094-110c2bad80b5?w=800&q=80",
      status: "Active"
    },
    {
      title: "Kaimosi, Kenya",
      description: "Deanna's Kids School currently utilizes a small and antiquated kitchen to serve meals to their students and staff daily. Hugo and his mission team have designed and priced a new kitchen for the school.",
      goal: "$15,000 ($7,000 has already been raised)",
      icon: <MapPin className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
      status: "In Progress"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <PageHero
        pagePath="/stage-cares"
        defaultTitle="Stage Cares Foundation"
        defaultSubtitle="Charitable Giving"
        defaultBackgroundImage="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=2000&q=80"
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
                <BreadcrumbPage data-testid="breadcrumb-current">Stage Cares Foundation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800" variant="secondary" data-testid="hero-badge">
                <Heart className="w-4 h-4 mr-1" />
                Foundation for Good
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6" data-testid="page-title">
                Stage Cares Foundation
              </h1>
              <h2 className="text-2xl text-muted-foreground mb-6" data-testid="page-subtitle">
                Charitable Giving
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="hero-description">
                Making a difference in communities near and far through employee generosity, 
                corporate matching, and purposeful charitable initiatives.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild data-testid="button-learn-more">
                  <a href="#how-it-works">
                    <Heart className="w-5 h-5 mr-2" />
                    Learn How We Give
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-contact">
                  <a href="mailto:stagecares@stagesenior.com">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Foundation
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop"
                alt="Hands holding together representing community support and charitable giving"
                className="rounded-lg shadow-xl w-full"
                data-testid="hero-image"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5" />
                  <span className="font-bold text-lg">Global Impact</span>
                </div>
                <p className="text-sm">Supporting communities worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Making a Global Impact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8" data-testid="global-impact-title">
              Making a Global Impact
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 md:p-12">
              <Globe className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <p className="text-lg text-gray-700 leading-relaxed" data-testid="global-impact-text">
                Stage Cares embodies our commitment to creating positive change both within our communities and around the world. 
                Through employee participation and company matching, we build a powerful foundation for supporting those in need 
                and making meaningful impacts in diverse communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Stage Cares Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="how-it-works-title">
              How Stage Cares Works
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Employee Contribution</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-blue-600 mb-2">$5.00</p>
                <p className="text-muted-foreground">per paycheck</p>
                <p className="text-sm text-muted-foreground mt-2">($10 monthly)</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-100 hover:border-indigo-200 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HandHeart className="w-8 h-8 text-indigo-600" />
                </div>
                <CardTitle>Company Matching</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-indigo-600 mb-2">100%</p>
                <p className="text-muted-foreground">Dollar-for-dollar match</p>
                <p className="text-sm text-muted-foreground mt-2">Doubling the impact</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Total Impact</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-purple-600 mb-2">2X</p>
                <p className="text-muted-foreground">The giving power</p>
                <p className="text-sm text-muted-foreground mt-2">Supporting vital causes</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <p className="text-lg text-gray-700 text-center" data-testid="how-it-works-text">
              Our innovative giving program unites the power of employee generosity with corporate commitment. 
              Employees contribute $5.00 per paycheck ($10 monthly), and Stage Management matches every dollar, 
              creating a sustainable fund for supporting vital causes and responding to urgent needs.
            </p>
          </div>
        </div>
      </section>

      {/* Our Community - Helping Hands Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <HandHeart className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-2xl" data-testid="helping-hands-title">
                    Our Community - Helping Hands
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 leading-relaxed" data-testid="helping-hands-text">
                  Helping Hands is a non-profit organization formed to help individuals with unexpected life challenges. 
                  Stage Cares will have resources available for our own staff to apply for support via Helping Hands 
                  when unexpected circumstances arise.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
                    Employee Support
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-800 px-3 py-1">
                    Emergency Assistance
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
                    Community Care
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Projects Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="projects-title">
              Current Charitable Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We're actively supporting communities around the world through targeted initiatives 
              that create lasting positive change.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projectCards.map((project, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow" data-testid={`project-card-${index}`}>
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className="absolute top-4 right-4 bg-white/90 text-gray-800"
                    data-testid={`project-status-${index}`}
                  >
                    {project.status}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2" data-testid={`project-title-${index}`}>
                        {project.icon}
                        {project.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4" data-testid={`project-description-${index}`}>
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-lg" data-testid={`project-goal-${index}`}>
                        Goal: {project.goal}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              Want to learn more about our charitable initiatives or how you can contribute?
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild data-testid="button-get-involved">
              <a href="mailto:stagecares@stagesenior.com">
                <Heart className="w-5 h-5 mr-2" />
                Get Involved
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="communities-title">
              Our Communities
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Stage Cares Foundation is supported by our network of senior living communities 
              across Colorado, each contributing to our charitable mission.
            </p>
          </div>

          {communitiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="communities-loading">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="communities-grid">
              {communities?.slice(0, 6).map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild data-testid="button-view-communities">
              <Link href="/communities">
                View All Communities
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="contact-cta-title">
            Join Us in Making a Difference
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Together, we can create positive change in communities near and far. 
            Contact Stage Cares Foundation to learn how you can be part of our charitable mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild data-testid="button-email-foundation">
              <a href="mailto:stagecares@stagesenior.com">
                <Mail className="w-5 h-5 mr-2" />
                Email Foundation
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white" asChild data-testid="button-call-office">
              <a href="tel:+1-303-436-2300">
                <Phone className="w-5 h-5 mr-2" />
                Call (303) 436-2300
              </a>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/90 mb-4">
              <strong>Stage Cares Foundation</strong><br />
              A charitable initiative of Stage Senior Management
            </p>
            <p className="text-sm text-white/80">
              8100 E Arapahoe Road, Suite 208, Centennial, CO 80112<br />
              Tax-deductible contributions support communities locally and globally
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}