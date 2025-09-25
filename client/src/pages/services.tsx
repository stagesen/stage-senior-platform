import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, Heart, Brain, Clock, Shield, Users, Star, Phone, Calendar, MapPin, CheckCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function Services() {
  useEffect(() => {
    document.title = "Our Services | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover Stage Senior\'s comprehensive senior living services including Independent Living, Assisted Living, Memory Care, and specialized care programs across Colorado communities.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover Stage Senior\'s comprehensive senior living services including Independent Living, Assisted Living, Memory Care, and specialized care programs across Colorado communities.';
      document.head.appendChild(meta);
    }
  }, []);

  const services = [
    {
      icon: <Home className="w-8 h-8" />,
      title: "Independent Living",
      subtitle: "Freedom with Support",
      description: "Maintenance-free living with hospitality services, social activities, and optional support services as needs change.",
      features: [
        "Spacious apartments with full kitchens",
        "Restaurant-style dining options",
        "Housekeeping and maintenance",
        "Transportation services",
        "Fitness and wellness programs",
        "Social activities and events"
      ],
      communities: ["The Gardens on Quail", "Golden Pond"],
      badge: "Most Popular",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Assisted Living",
      subtitle: "Personalized Care & Support",
      description: "24/7 assistance with daily activities while maintaining independence and dignity in a homelike environment.",
      features: [
        "Personalized care plans",
        "Medication management",
        "Assistance with daily activities",
        "24/7 trained caregivers",
        "Emergency response systems",
        "Coordinated healthcare services"
      ],
      communities: ["All Four Communities"],
      badge: "Comprehensive Care",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Memory Care",
      subtitle: "Specialized Dementia Support",
      description: "Secure, specialized environments designed for residents with Alzheimer's disease and other forms of dementia.",
      features: [
        "Secure, thoughtfully designed spaces",
        "Specialized memory care programming",
        "Higher staff-to-resident ratios",
        "Family education and support",
        "Therapeutic activities",
        "Your Story First care approach"
      ],
      communities: ["All Four Communities"],
      badge: "Expert Care",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Respite Care",
      subtitle: "Short-Term Relief & Support",
      description: "Temporary care services to give family caregivers a break while ensuring your loved one receives excellent care.",
      features: [
        "Flexible stay durations",
        "All amenities and services included",
        "Social activities and engagement",
        "Professional care assessment",
        "Trial opportunity for families",
        "Emergency placement available"
      ],
      communities: ["Available at All Communities"],
      badge: "Flexible Options",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const additionalServices = [
    "Chaplaincy and spiritual care",
    "Physical and occupational therapy",
    "Concierge physician services",
    "Beauty salon and barber services",
    "Pet therapy programs",
    "Transportation to appointments",
    "Family education and support groups",
    "Intergenerational programs"
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        pagePath="/services"
        defaultTitle="Our Services"
        defaultSubtitle="Comprehensive Senior Living Solutions"
        defaultDescription="From Independent Living to Memory Care, we provide personalized services that honor each resident's unique needs and preferences."
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
                <BreadcrumbPage data-testid="breadcrumb-current">Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>


      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="services-title">
              Tailored Care for Every Stage of Life
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our continuum of care ensures you can age in place with the right level of support, 
              maintaining your independence while receiving the assistance you need.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300" data-testid={`service-card-${index}`}>
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.color}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${service.color} text-white`}>
                        {service.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-xl" data-testid={`service-title-${index}`}>
                            {service.title}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs" data-testid={`service-badge-${index}`}>
                            {service.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium" data-testid={`service-subtitle-${index}`}>
                          {service.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6" data-testid={`service-description-${index}`}>
                    {service.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-3">Key Features:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-2" data-testid={`service-feature-${index}-${featureIndex}`}>
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Available at:</span> {service.communities.join(", ")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="additional-services-title">
              Additional Services & Amenities
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Beyond our core care services, we offer comprehensive amenities and programs to enrich daily life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow" data-testid={`additional-service-${index}`}>
                <CardContent className="pt-4">
                  <CheckCircle className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground">{service}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Programs CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="stage-cares-title">
                Discover Stage Cares
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-6">
                Our specialized care philosophy and programs that set us apart. Learn about our "Your Story First" 
                approach and how we create personalized experiences for every resident.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="mb-6"
                asChild
                data-testid="button-learn-stage-cares"
              >
                <Link href="/stage-cares">
                  <Heart className="w-5 h-5 mr-2" />
                  Learn About Stage Cares
                </Link>
              </Button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-primary-foreground/10 rounded-lg">
                <Star className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="font-semibold">98% Resident Satisfaction</p>
                  <p className="text-sm text-primary-foreground/80">Across all our communities</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-primary-foreground/10 rounded-lg">
                <Users className="w-8 h-8 text-primary-foreground" />
                <div>
                  <p className="font-semibold">Long-Tenure Staff</p>
                  <p className="text-sm text-primary-foreground/80">Building lasting relationships</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-primary-foreground/10 rounded-lg">
                <Shield className="w-8 h-8 text-primary-foreground" />
                <div>
                  <p className="font-semibold">Comprehensive Care</p>
                  <p className="text-sm text-primary-foreground/80">Mind, body, and spirit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="contact-cta-title">
            Ready to Learn More About Our Services?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Let us help you find the perfect level of care and support for your loved one. 
            Schedule a consultation or tour today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-schedule-tour-cta">
              <Link href="/communities">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule a Tour
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild data-testid="button-call-now-cta">
              <a href="tel:+1-303-436-2300">
                <Phone className="w-5 h-5 mr-2" />
                Call (303) 436-2300
              </a>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-muted-foreground mb-4">
              <strong>Have questions about care levels or services?</strong><br />
              Our care coordinators are available to discuss your specific needs and help determine 
              the best fit for your family.
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