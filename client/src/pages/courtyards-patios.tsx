import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  Trees,
  Flower,
  Sun,
  Wind,
  Leaf,
  TreePine,
  Heart,
  Users,
  Shield,
  Clock,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
  MapPin,
  Lamp,
  Activity,
  Coffee,
  Bird,
  Cloud,
  Palette,
  Home,
  Phone
} from "lucide-react";

export default function CourtyardsPatios() {
  useEffect(() => {
    document.title = "Courtyards & Outdoor Spaces | Senior Living Communities";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Enjoy beautiful courtyards, gardens, and outdoor spaces at our senior living communities. Safe, accessible patios, walking paths, and garden areas designed for relaxation, activities, and connection with nature.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Enjoy beautiful courtyards, gardens, and outdoor spaces at our senior living communities. Safe, accessible patios, walking paths, and garden areas designed for relaxation, activities, and connection with nature.';
      document.head.appendChild(meta);
    }
  }, []);

  const outdoorSpaces = [
    {
      icon: Trees,
      name: "Secure Memory Care Courtyards",
      description: "Safe, enclosed gardens designed specifically for memory care residents to enjoy nature independently",
      features: ["Secured perimeter", "Sensory gardens", "Quiet seating areas", "Clear pathways"]
    },
    {
      icon: Leaf,
      name: "Walking Paths & Trails",
      description: "Well-maintained paths winding through scenic grounds for daily walks and exercise",
      features: ["Level surfaces", "Rest benches", "Shade trees", "Distance markers"]
    },
    {
      icon: Flower,
      name: "Garden Areas",
      description: "Beautiful flower gardens and raised beds where residents can enjoy gardening activities",
      features: ["Raised garden beds", "Seasonal flowers", "Herb gardens", "Butterfly gardens"]
    },
    {
      icon: Home,
      name: "Covered Patios",
      description: "All-weather outdoor living spaces perfect for relaxation in any season",
      features: ["Weather protection", "Ceiling fans", "Comfortable seating", "Outdoor heaters"]
    },
    {
      icon: Coffee,
      name: "Outdoor Dining Areas",
      description: "Al fresco dining spaces for meals with friends and special occasions",
      features: ["Shaded tables", "BBQ areas", "Scenic views", "Evening lighting"]
    },
    {
      icon: Activity,
      name: "Activity Spaces",
      description: "Dedicated areas for outdoor games, exercise classes, and social events",
      features: ["Game courts", "Exercise stations", "Event pavilions", "Performance areas"]
    }
  ];

  const benefits = [
    {
      icon: Sun,
      title: "Vitamin D & Fresh Air",
      description: "Natural sunlight provides essential vitamin D while fresh air improves mood and respiratory health.",
      color: "text-yellow-600"
    },
    {
      icon: Heart,
      title: "Mental Health Benefits",
      description: "Time in nature reduces stress, anxiety, and depression while promoting overall well-being.",
      color: "text-pink-600"
    },
    {
      icon: Users,
      title: "Social Connection",
      description: "Outdoor spaces provide natural gathering spots for socializing and building community.",
      color: "text-blue-600"
    },
    {
      icon: Activity,
      title: "Physical Activity",
      description: "Gardens and paths encourage gentle exercise and movement in a pleasant environment.",
      color: "text-green-600"
    }
  ];

  const seasonalActivities = [
    {
      season: "Spring",
      icon: Flower,
      activities: [
        "Garden planting parties",
        "Easter egg hunts",
        "Spring flower festivals",
        "Bird watching tours"
      ],
      color: "bg-pink-50 text-pink-700"
    },
    {
      season: "Summer",
      icon: Sun,
      activities: [
        "BBQ cookouts",
        "Outdoor concerts",
        "Ice cream socials",
        "Garden tea parties"
      ],
      color: "bg-yellow-50 text-yellow-700"
    },
    {
      season: "Fall",
      icon: Leaf,
      activities: [
        "Harvest celebrations",
        "Pumpkin decorating",
        "Nature walks",
        "Outdoor art classes"
      ],
      color: "bg-orange-50 text-orange-700"
    },
    {
      season: "Winter",
      icon: Cloud,
      activities: [
        "Holiday light displays",
        "Winter bird feeding",
        "Hot cocoa gatherings",
        "Greenhouse activities"
      ],
      color: "bg-blue-50 text-blue-700"
    }
  ];

  const safetyFeatures = [
    { icon: Shield, feature: "Non-Slip Surfaces", description: "Textured pathways and patios to prevent falls" },
    { icon: Lamp, feature: "Adequate Lighting", description: "Well-lit paths and seating areas for evening use" },
    { icon: Activity, feature: "Handrails & Support", description: "Strategic placement of rails and grab bars" },
    { icon: MapPin, feature: "Clear Wayfinding", description: "Easy-to-read signage and landmark features" },
    { icon: Heart, feature: "Comfortable Seating", description: "Ergonomic benches and chairs throughout" },
    { icon: Shield, feature: "Emergency Call Systems", description: "Accessible help buttons in all outdoor areas" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        pagePath="/courtyards-patios"
        defaultTitle="Courtyards & Outdoor Spaces"
        defaultSubtitle="Connect with Nature in Beautiful, Safe Environments"
        defaultBackgroundImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2000&q=80"
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
                <BreadcrumbPage data-testid="breadcrumb-current">Courtyards & Outdoor Spaces</BreadcrumbPage>
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
              <div className="p-3 bg-green-100 rounded-full">
                <Trees className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nature's Beauty, Right Outside Your Door
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our thoughtfully designed outdoor spaces bring the healing power of nature to your daily life. 
              From tranquil gardens to vibrant activity areas, every outdoor space is created with your 
              comfort, safety, and enjoyment in mind.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Benefits of Outdoor Living
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Spending time outdoors is essential for physical health, mental well-being, and social connection.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                  data-testid={`benefit-card-${index}`}
                >
                  <CardHeader>
                    <div className={`p-3 bg-white rounded-full inline-flex mb-2 ${benefit.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Types of Outdoor Spaces */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Diverse Outdoor Environments
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Each outdoor space is designed with specific purposes and resident needs in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {outdoorSpaces.map((space, index) => {
              const Icon = space.icon;
              return (
                <div 
                  key={index} 
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  data-testid={`outdoor-space-${index}`}
                >
                  <div className="absolute inset-0">
                    <img 
                      src={index === 0 ? "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80" :
                           index === 1 ? "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" :
                           index === 2 ? "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80" :
                           index === 3 ? "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80" :
                           index === 4 ? "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" :
                           "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80"}
                      alt={space.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>
                  
                  <div className="relative p-6 h-full flex flex-col justify-end min-h-[320px]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{space.name}</h3>
                    </div>
                    <p className="text-white/90 mb-4">{space.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {space.features.map((feature, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seasonal Activities Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Year-Round Outdoor Activities
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Every season brings new opportunities to enjoy our outdoor spaces with engaging activities and events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalActivities.map((season, index) => {
              const Icon = season.icon;
              return (
                <Card 
                  key={index} 
                  className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow"
                  data-testid={`seasonal-activity-${index}`}
                >
                  <CardHeader className={`${season.color} py-4`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">{season.season}</h3>
                      <Icon className="w-6 h-6" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      {season.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Safety with Freedom</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our outdoor spaces are designed with your safety as the top priority, while maintaining 
                the freedom to enjoy nature independently. Every detail is carefully considered to ensure 
                you can explore and relax with confidence.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {safetyFeatures.map((safety, index) => {
                  const Icon = safety.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                      data-testid={`safety-feature-${index}`}
                    >
                      <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">{safety.feature}</h4>
                        <p className="text-sm text-muted-foreground">{safety.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1559304787-945aa4341065?w=800&q=80" 
                alt="Well-lit garden pathway with handrails and comfortable seating"
                className="w-full h-full object-cover"
                data-testid="safety-features-image"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-white px-4 py-2 text-sm font-semibold">
                  <Shield className="w-4 h-4 mr-1" />
                  Safety First
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Experience Our Outdoor Spaces
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Take a visual tour of our beautiful gardens, courtyards, and outdoor amenities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&q=80" 
                alt="Residents enjoying garden activities"
                className="w-full h-full object-cover"
                data-testid="gallery-image-1"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1585637071863-3d2bc3a10225?w=600&q=80" 
                alt="Beautiful flower garden with walking path"
                className="w-full h-full object-cover"
                data-testid="gallery-image-2"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1591226632858-e0f7e3000d7c?w=600&q=80" 
                alt="Covered patio with comfortable seating"
                className="w-full h-full object-cover"
                data-testid="gallery-image-3"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&q=80" 
                alt="Outdoor dining area with scenic views"
                className="w-full h-full object-cover"
                data-testid="gallery-image-4"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1598902108854-10e335adac99?w=600&q=80" 
                alt="Residents participating in outdoor activities"
                className="w-full h-full object-cover"
                data-testid="gallery-image-5"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1584479898061-15742e14f50d?w=600&q=80" 
                alt="Secure memory care courtyard"
                className="w-full h-full object-cover"
                data-testid="gallery-image-6"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Trees className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience Our Outdoor Spaces in Person
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Schedule a tour today to explore our beautiful gardens, courtyards, and outdoor amenities. 
              See how our residents enjoy the perfect blend of nature, safety, and community.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
              data-testid="button-schedule-tour"
            >
              <Calendar className="mr-2 w-5 h-5" />
              Schedule a Tour
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              data-testid="button-call-now"
            >
              <Phone className="mr-2 w-5 h-5" />
              Call (303) 555-0100
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-white/80">
            <MapPin className="w-5 h-5" />
            <p>Visit any of our communities to see our outdoor spaces firsthand</p>
          </div>
        </div>
      </section>
    </div>
  );
}