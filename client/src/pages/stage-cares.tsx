import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Heart, Globe, Users, HandHeart, Target, DollarSign, Calendar, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { useQuery } from "@tanstack/react-query";
import CommunitiesCarousel from "@/components/CommunitiesCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import type { Community, PageContentSection } from "@shared/schema";

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

  // Fetch page content sections from database
  const { data: pageSections = [], isLoading: sectionsLoading } = useQuery<PageContentSection[]>({
    queryKey: ['/api/page-content', { pagePath: '/stage-cares', active: true }],
  });

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
                  <a href="mailto:info@stagesenior.com">
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

      {/* Keep this section for navigation anchor */}
      <div id="how-it-works" className="py-0"></div>

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
              <a href="mailto:info@stagesenior.com">
                <Heart className="w-5 h-5 mr-2" />
                Get Involved
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-16 bg-white">
        <CommunitiesCarousel
          communities={communities || []}
          isLoading={communitiesLoading}
          title="Our Communities"
          subtitle="Experience the Stage Cares difference at our locations"
        />
        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild data-testid="button-view-communities">
            <Link href="/communities">
              View All Communities
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
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
            <Button size="lg" className="bg-white hover:bg-gray-100 text-blue-600 hover:text-blue-700 font-semibold" asChild data-testid="button-email-foundation">
              <a href="mailto:info@stagesenior.com">
                <Mail className="w-5 h-5 mr-2" />
                Email Foundation
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white" asChild data-testid="button-call-office">
              <a href="tel:+1-970-444-4689">
                <Phone className="w-5 h-5 mr-2" />
                Call (970) 444-4689
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