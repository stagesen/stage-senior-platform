import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  Scissors,
  Sparkles,
  Heart,
  Users,
  Palette,
  Clock,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
  User,
  Smile,
  Phone,
  MapPin,
  DollarSign,
  Brush,
  Crown,
  Waves
} from "lucide-react";

export default function BeautySalon() {
  const { openScheduleTour } = useScheduleTour();
  
  useEffect(() => {
    document.title = "Beauty Salon & Barber Services | Senior Living Communities";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Enjoy convenient on-site beauty salon and barber services at our senior living communities. Professional haircuts, styling, color treatments, and grooming services that help residents look and feel their best.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Enjoy convenient on-site beauty salon and barber services at our senior living communities. Professional haircuts, styling, color treatments, and grooming services that help residents look and feel their best.';
      document.head.appendChild(meta);
    }
  }, []);

  const beautySalonServices = [
    { icon: Scissors, name: "Haircuts & Styling", description: "Professional cuts and styles tailored to your preferences" },
    { icon: Palette, name: "Hair Color", description: "Full color, highlights, and touch-ups with quality products" },
    { icon: Waves, name: "Perms & Waves", description: "Beautiful curls and waves that last" },
    { icon: Sparkles, name: "Special Occasion Styling", description: "Updos and formal styles for events and celebrations" },
    { icon: Brush, name: "Blow Dry & Set", description: "Classic styling with rollers and professional finishing" },
    { icon: Crown, name: "Hair Treatments", description: "Deep conditioning and scalp treatments for healthy hair" }
  ];

  const barberServices = [
    { icon: Scissors, name: "Classic Haircuts", description: "Traditional and modern men's haircut styles" },
    { icon: User, name: "Beard Trimming", description: "Professional beard shaping and maintenance" },
    { icon: Sparkles, name: "Hot Towel Shaves", description: "Luxurious straight razor shaves with hot towel service" },
    { icon: Brush, name: "Mustache Grooming", description: "Precise mustache trimming and styling" },
    { icon: Star, name: "Gray Blending", description: "Natural-looking color treatments for men" },
    { icon: Heart, name: "Scalp Treatments", description: "Rejuvenating treatments for scalp health" }
  ];

  const benefits = [
    {
      icon: MapPin,
      title: "Convenient Location",
      description: "No need to travel - our salon is right here in your community, making regular appointments easy and stress-free."
    },
    {
      icon: Users,
      title: "Social Connection",
      description: "The salon is a wonderful place to socialize with friends and neighbors while being pampered."
    },
    {
      icon: Heart,
      title: "Boost Self-Esteem",
      description: "Looking your best helps you feel confident and maintains your sense of identity and personal style."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Appointments available throughout the week with options for walk-ins when possible."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        pagePath="/beauty-salon"
        defaultTitle="Beauty Salon & Barber Services"
        defaultSubtitle="Look Your Best, Feel Your Best"
        defaultBackgroundImage="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=2000&q=80"
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
                <BreadcrumbPage data-testid="breadcrumb-current">Beauty Salon & Barber</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Professional Beauty Services On-Site
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Maintain your personal style and enjoy the confidence that comes with looking your best. 
              Our on-site salon and barber shop offers a full range of professional services in the 
              comfort and convenience of your own community.
            </p>
          </div>
        </div>
      </section>

      {/* Beauty Salon Services Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-500/10 rounded-lg">
                  <Sparkles className="w-6 h-6 text-pink-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Beauty Salon Services</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our experienced stylists provide personalized beauty services designed to help you 
                look and feel fabulous. From classic styles to modern trends, we cater to your 
                individual preferences and needs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {beautySalonServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      data-testid={`salon-service-${index}`}
                    >
                      <div className="p-2 bg-pink-100 rounded-lg flex-shrink-0">
                        <Icon className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{service.name}</h4>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80" 
                alt="Professional beauty salon with modern styling stations"
                className="w-full h-full object-cover"
                data-testid="salon-services-image"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-pink-600 text-white px-4 py-2 text-sm font-semibold">
                  <Sparkles className="w-4 h-4 mr-1" />
                  For Her
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barber Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80" 
                alt="Traditional barber shop with vintage chairs and professional equipment"
                className="w-full h-full object-cover"
                data-testid="barber-services-image"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold">
                  <User className="w-4 h-4 mr-1" />
                  For Him
                </Badge>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Scissors className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Barber Shop Services</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Experience traditional barbering at its finest. Our skilled barbers provide classic 
                grooming services with attention to detail, ensuring you always look sharp and 
                well-groomed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {barberServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      data-testid={`barber-service-${index}`}
                    >
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{service.name}</h4>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Benefits of On-Site Beauty Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Having professional beauty and grooming services right in your community offers 
              numerous advantages for your well-being and quality of life.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                  data-testid={`benefit-card-${index}`}
                >
                  <CardHeader>
                    <div className="p-3 bg-primary/10 rounded-full w-fit mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Appointment & Pricing Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Appointment Information */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Booking Appointments</CardTitle>
                </div>
                <CardDescription className="text-base mt-2">
                  Convenient scheduling options for all residents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Regular Appointments</h4>
                    <p className="text-sm text-muted-foreground">
                      Schedule weekly, bi-weekly, or monthly standing appointments for consistent care
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Walk-In Welcome</h4>
                    <p className="text-sm text-muted-foreground">
                      Available for quick touch-ups and when appointments are available
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Special Events</h4>
                    <p className="text-sm text-muted-foreground">
                      Book ahead for holidays, family visits, and community celebrations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Flexible Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      Tuesday through Saturday, with extended hours on Thursdays
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Service Pricing</CardTitle>
                </div>
                <CardDescription className="text-base mt-2">
                  Affordable à la carte pricing for all services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/70 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Sample Pricing</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Women's Haircut & Style</span>
                      <span className="text-sm font-semibold">$35-45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Men's Haircut</span>
                      <span className="text-sm font-semibold">$20-25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hair Color</span>
                      <span className="text-sm font-semibold">$50-75</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Perms</span>
                      <span className="text-sm font-semibold">$60-80</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Beard Trim</span>
                      <span className="text-sm font-semibold">$15-20</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Services are billed directly to residents or can be added to monthly statements
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Package deals available for multiple services
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social & Wellness Impact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Smile className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">More Than Just a Haircut</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our salon and barber shop is a vibrant social hub where residents gather, share stories, 
                and build friendships. It's a place where personal care meets community connection.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Boosts Confidence & Self-Esteem</h4>
                    <p className="text-muted-foreground">
                      Looking good helps residents feel their best, maintaining dignity and personal identity
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Encourages Social Interaction</h4>
                    <p className="text-muted-foreground">
                      The salon provides natural opportunities for conversation and companionship
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Therapeutic Benefits</h4>
                    <p className="text-muted-foreground">
                      The pampering experience provides relaxation and stress relief
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" 
                alt="Happy seniors enjoying salon services and socializing"
                className="w-full h-full object-cover"
                data-testid="social-wellness-image"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    "The salon is my favorite place to catch up with friends!"
                  </p>
                  <p className="text-xs text-muted-foreground">- Mary, Resident</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience Our Beauty & Barber Services
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Schedule a tour today to see our beautiful salon and barber facilities, meet our 
            professional stylists, and learn how we help residents look and feel their absolute best.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="group"
              onClick={() => openScheduleTour()}
              data-testid="button-schedule-tour"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule a Tour
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              data-testid="button-call-us"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Us Today
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/70">
            Our beauty professionals are available Tuesday through Saturday
          </p>
        </div>
      </section>
    </div>
  );
}