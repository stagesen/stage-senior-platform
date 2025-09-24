import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Shield, Heart, Users, Award, Phone, Mail, MapPin, Calendar, Star, Activity, CheckCircle, Handshake, Eye } from "lucide-react";

export default function AboutUs() {
  useEffect(() => {
    document.title = "More About Us | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover Stage Senior Management - creating vibrant communities where residents thrive with compassionate care, connected community, and committed service across Colorado.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover Stage Senior Management - creating vibrant communities where residents thrive with compassionate care, connected community, and committed service across Colorado.';
      document.head.appendChild(meta);
    }
  }, []);

  const coreValues = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Health",
      description: "Promoting physical, mental, and emotional well-being for all residents and staff"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Accountability",
      description: "Taking responsibility for our actions and delivering on our commitments"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Relationships",
      description: "Building meaningful connections based on trust, respect, and genuine care"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Transparency",
      description: "Open, honest communication in all our interactions and decisions"
    }
  ];

  const corePrinciples = [
    {
      title: "Compassionate Care",
      description: "We create environments where genuine relationships flourish. Our teams go above and beyond to ensure every resident feels valued, understood, and cared for as a unique individual."
    },
    {
      title: "Connected Community",
      description: "We foster meaningful connections between residents, families, and staff. By celebrating the legacy of those who have lived with us, we strengthen the bonds that make our communities truly special."
    },
    {
      title: "Committed Service",
      description: "Our dedication extends beyond basic care to embrace life's daily moments. We empower our staff to serve with heart, creating a culture where going the extra mile isn't exceptional—it's who we are."
    }
  ];

  const teamMembers = [
    { name: "Jonathan Hachmeister", title: "Managing Partner" },
    { name: "Troy McClymonds", title: "Managing Partner" },
    { name: "Jeff Ippen", title: "Partner" },
    { name: "Ben Chandler", title: "Regional Director" },
    { name: "Colleen Emery", title: "Director of Operations" },
    { name: "Marci Gerke", title: "Director of Memory Care Services" },
    { name: "Natasha Barba", title: "Benefits Administrator" },
    { name: "Josh Kavinsky", title: "Regional Maintenance Director" },
    { name: "Bob Burden", title: "Community Chef" },
    { name: "Trevor Harwood", title: "Digital Marketing" }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
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
                More About Us
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

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="mission-title">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8" data-testid="mission-content">
              To create vibrant communities where residents thrive, families find peace of mind, and staff members are empowered to deliver exceptional care. We believe in preserving independence while providing the perfect balance of support, comfort, and engagement that makes every day meaningful.
            </p>
            <Button size="lg" asChild data-testid="button-get-in-touch">
              <a href="tel:+1-303-436-2300">
                <Phone className="w-5 h-5 mr-2" />
                GET IN TOUCH
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="vision-title">
              Our Vision
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed" data-testid="vision-content">
              We build and manage purposeful communities that honor the dignity of senior living. Our approach is founded on three core principles:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {corePrinciples.map((principle, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow" data-testid={`principle-card-${index}`}>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 text-primary" data-testid={`principle-title-${index}`}>
                    {principle.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`principle-description-${index}`}>
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="team-title">
              Our Team
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="team-subtitle">
              Elevating Senior Care Across Colorado
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow" data-testid={`team-member-${index}`}>
                <CardContent className="pt-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4" data-testid={`avatar-${index}`}>
                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-2" data-testid={`member-name-${index}`}>
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground text-sm" data-testid={`member-title-${index}`}>
                    {member.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="core-values-title">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow" data-testid={`core-value-card-${index}`}>
                <CardContent className="pt-6">
                  <div className="text-primary mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4" data-testid={`core-value-title-${index}`}>
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm" data-testid={`core-value-description-${index}`}>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
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