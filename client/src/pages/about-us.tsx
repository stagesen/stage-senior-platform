import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Shield, Heart, Users, Award, Phone, Mail, MapPin, Calendar, Star } from "lucide-react";

export default function AboutUs() {
  useEffect(() => {
    document.title = "About Us | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about Stage Senior Management - a locally owned, Colorado-based senior living management company founded in 2016. Discover our mission, values, leadership, and commitment to exceptional resident care.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn about Stage Senior Management - a locally owned, Colorado-based senior living management company founded in 2016. Discover our mission, values, leadership, and commitment to exceptional resident care.';
      document.head.appendChild(meta);
    }
  }, []);

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Residents First",
      description: "Personalized care plans that honor each individual's needs and highest potential in a homelike environment."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Family Partnership",
      description: "Transparent communication, proactive updates, and treating families as partners in care for complete peace of mind."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Team Excellence",
      description: "Exceptional resident care starts with exceptional staff care through development, recognition, and values-aligned culture."
    }
  ];

  const stats = [
    { number: "2016", label: "Founded in Colorado" },
    { number: "4", label: "Premier Communities" },
    { number: "98%", label: "Resident Satisfaction" },
    { number: "100+", label: "Years of Combined Leadership Experience" }
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
                <BreadcrumbPage data-testid="breadcrumb-current">About Us</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6" data-testid="page-title">
                About Stage Senior
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="hero-description">
                Since 2016, we've been transforming senior living communities into vibrant homes where dignity, 
                comfort, and joy come first. As a locally owned Colorado company, we bring authentic hometown 
                values to sophisticated senior care.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" data-testid="button-tour-communities">
                  <Link href="/communities">
                    <MapPin className="w-5 h-5 mr-2" />
                    Tour Our Communities
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-call-us">
                  <a href="tel:+1-303-436-2300">
                    <Phone className="w-5 h-5 mr-2" />
                    (303) 436-2300
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559628233-0fb74da9d96b?q=80&w=800&auto=format&fit=crop"
                alt="Stage Senior team providing compassionate care to residents"
                className="rounded-lg shadow-xl w-full"
                data-testid="hero-image"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold text-lg">4.8/5</span>
                </div>
                <p className="text-sm">Resident Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="mission-title">
              Our Mission: Locally Owned, Resident-Focused
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We combine a personal, local touch with sophisticated operating systems to ensure high-quality 
              care and consistency across all our properties. Our mission centers on personalized care and 
              community connection in every aspect of our operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow" data-testid={`value-card-${index}`}>
                <CardContent className="pt-6">
                  <div className="text-primary mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4" data-testid={`value-title-${index}`}>
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground" data-testid={`value-description-${index}`}>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-primary/5 rounded-xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} data-testid={`stat-${index}`}>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2" data-testid={`stat-number-${index}`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`stat-label-${index}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="story-title">
                Our Colorado Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p data-testid="story-paragraph-1">
                  Founded in 2016, Stage Senior Management emerged from a vision to transform senior living 
                  across Colorado's Front Range. We saw an opportunity to combine the warmth and authenticity 
                  of local ownership with the sophistication and consistency of professional management systems.
                </p>
                <p data-testid="story-paragraph-2">
                  Today, we proudly manage four premier communities from the foothills of Golden to the 
                  suburbs of Littleton and Arvada. Each location reflects our commitment to creating true 
                  homes where seniors can thrive with dignity, surrounded by caring staff who know their 
                  stories and honor their preferences.
                </p>
                <p data-testid="story-paragraph-3">
                  Our approach is different because we believe exceptional resident care starts with 
                  exceptional staff care. By investing in our team through development, transparent 
                  communication, and recognition, we create stable, long-tenured staff who build 
                  meaningful relationships with residents and families.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="p-6">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-4">
                    <Award className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2" data-testid="leadership-title">
                        Experienced Leadership
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Our executive team brings over 100 years of combined experience in senior living, 
                        healthcare administration, and community management across Colorado.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-4">
                    <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2" data-testid="community-focus-title">
                        Community Integration
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        We actively participate in local chambers of commerce, sponsor community events, 
                        and create intergenerational programs that keep our residents connected to Colorado life.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="contact-cta-title">
            Ready to Experience the Stage Senior Difference?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Schedule a personal tour of our communities and discover why families choose Stage Senior 
            for their loved ones' care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 py-6 text-lg"
              asChild
              data-testid="button-schedule-tour"
            >
              <Link href="/communities">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule a Tour
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-6 text-lg"
              asChild
              data-testid="button-call-now"
            >
              <a href="tel:+1-303-436-2300">
                <Phone className="w-5 h-5 mr-2" />
                Call (303) 436-2300
              </a>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-primary-foreground/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div data-testid="contact-phone">
                <Phone className="w-6 h-6 mx-auto mb-2" />
                <p className="font-semibold">Call Us</p>
                <p className="text-primary-foreground/90">(303) 436-2300</p>
              </div>
              <div data-testid="contact-email">
                <Mail className="w-6 h-6 mx-auto mb-2" />
                <p className="font-semibold">Email Us</p>
                <p className="text-primary-foreground/90">info@stagesenior.com</p>
              </div>
              <div data-testid="contact-address">
                <MapPin className="w-6 h-6 mx-auto mb-2" />
                <p className="font-semibold">Visit Us</p>
                <p className="text-primary-foreground/90">
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