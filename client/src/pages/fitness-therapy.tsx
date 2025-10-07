import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { Community } from "@shared/schema";
import { 
  Dumbbell,
  Heart,
  Activity,
  Users,
  Target,
  Brain,
  Clock,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
  Sparkles,
  Trophy,
  Zap,
  Waves,
  User,
  Phone,
  MapPin
} from "lucide-react";

export default function FitnessTherapy() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const fromCommunity = searchParams.get('from');
  
  // Fetch community data if we have a 'from' parameter
  const { data: community } = useQuery({
    queryKey: ['/api/communities', fromCommunity],
    enabled: !!fromCommunity,
    queryFn: async () => {
      const response = await fetch(`/api/communities/${fromCommunity}`);
      if (!response.ok) return null;
      return response.json() as Promise<Community>;
    }
  });
  
  // Resolve the fitness image URL if community has one
  const communityFitnessImage = useResolveImageUrl(community?.fitnessImageId || '');
  const fitnessImage = communityFitnessImage || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80";
  useEffect(() => {
    document.title = "Fitness & Therapy Center | Senior Living Communities";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover our comprehensive fitness and therapy center offering personalized exercise programs, physical therapy, occupational therapy, and group fitness classes designed specifically for senior wellness and independence.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover our comprehensive fitness and therapy center offering personalized exercise programs, physical therapy, occupational therapy, and group fitness classes designed specifically for senior wellness and independence.';
      document.head.appendChild(meta);
    }
  }, []);

  const fitnessPrograms = [
    { icon: Dumbbell, name: "Strength Training", description: "Build and maintain muscle mass with guided resistance exercises" },
    { icon: Heart, name: "Cardiovascular Health", description: "Heart-healthy cardio equipment including recumbent bikes and treadmills" },
    { icon: Target, name: "Balance Programs", description: "Specialized equipment and exercises to prevent falls and improve stability" },
    { icon: Activity, name: "Flexibility Training", description: "Stretching and range-of-motion exercises for improved mobility" },
    { icon: Brain, name: "Cognitive Fitness", description: "Exercise programs that combine physical and mental challenges" },
    { icon: Zap, name: "Functional Fitness", description: "Practical exercises for daily living activities and independence" }
  ];

  const physicalTherapyServices = [
    { icon: Shield, name: "Rehabilitation Services", description: "Post-surgery and injury recovery with licensed therapists" },
    { icon: Activity, name: "Fall Prevention", description: "Comprehensive assessment and training to reduce fall risk" },
    { icon: Target, name: "Pain Management", description: "Therapeutic techniques to manage chronic pain conditions" },
    { icon: Sparkles, name: "Mobility Improvement", description: "Gait training and mobility enhancement programs" },
    { icon: Heart, name: "Orthopedic Therapy", description: "Specialized care for joint replacements and orthopedic conditions" },
    { icon: Brain, name: "Neurological Rehabilitation", description: "Therapy for stroke recovery and neurological conditions" }
  ];

  const occupationalTherapyServices = [
    { icon: User, name: "Daily Living Skills", description: "Retraining for dressing, bathing, and personal care activities" },
    { icon: Sparkles, name: "Adaptive Techniques", description: "Learning new ways to perform familiar tasks safely" },
    { icon: Brain, name: "Cognitive Rehabilitation", description: "Memory strategies and cognitive skill development" },
    { icon: Target, name: "Fine Motor Skills", description: "Exercises to improve hand strength and coordination" },
    { icon: Shield, name: "Home Safety Assessment", description: "Evaluation and recommendations for safe living spaces" },
    { icon: Activity, name: "Energy Conservation", description: "Techniques to manage fatigue and maximize independence" }
  ];

  const fitnessClasses = [
    {
      name: "Chair Yoga",
      time: "Mon, Wed, Fri - 9:00 AM",
      description: "Gentle yoga poses adapted for chair support",
      level: "All Levels",
      icon: Waves
    },
    {
      name: "Water Aerobics",
      time: "Tue, Thu - 10:00 AM",
      description: "Low-impact exercises in our heated therapy pool",
      level: "Beginner",
      icon: Activity
    },
    {
      name: "Tai Chi for Balance",
      time: "Mon, Wed - 2:00 PM",
      description: "Ancient practice for improved balance and mindfulness",
      level: "All Levels",
      icon: Target
    },
    {
      name: "Walking Club",
      time: "Daily - 8:00 AM",
      description: "Social walking groups through scenic community paths",
      level: "All Levels",
      icon: Users
    },
    {
      name: "Strength & Stretch",
      time: "Tue, Thu - 3:00 PM",
      description: "Combination of light weights and flexibility work",
      level: "Intermediate",
      icon: Dumbbell
    },
    {
      name: "Dance Fitness",
      time: "Fridays - 11:00 AM",
      description: "Fun, music-based movement for all abilities",
      level: "All Levels",
      icon: Sparkles
    }
  ];

  const benefits = [
    {
      icon: Trophy,
      title: "Maintain Independence",
      description: "Build strength and skills needed for daily activities, helping you stay independent longer."
    },
    {
      icon: Users,
      title: "Social Engagement",
      description: "Group classes and therapy sessions provide opportunities to connect with neighbors and build friendships."
    },
    {
      icon: Heart,
      title: "Improved Health",
      description: "Regular exercise reduces risk of chronic conditions and improves overall physical and mental health."
    },
    {
      icon: Shield,
      title: "Fall Prevention",
      description: "Targeted programs significantly reduce fall risk through strength, balance, and coordination training."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        pagePath="/fitness-therapy"
        defaultTitle="Fitness & Therapy Center"
        defaultSubtitle="Your Journey to Wellness Starts Here"
        defaultBackgroundImage="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=2000&q=80"
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
                <BreadcrumbPage data-testid="breadcrumb-current">Fitness & Therapy</BreadcrumbPage>
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
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Wellness for Body and Mind
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our state-of-the-art fitness and therapy center is designed specifically for senior wellness. 
              With professional staff, specialized equipment, and evidence-based programs, we help you maintain 
              your independence, improve your quality of life, and achieve your personal health goals.
            </p>
          </div>
        </div>
      </section>

      {/* Fitness Center Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Dumbbell className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">State-of-the-Art Fitness Center</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our fitness center features senior-friendly equipment and programs designed to help you stay 
                active, strong, and independent. Every piece of equipment is carefully selected for safety, 
                accessibility, and effectiveness.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fitnessPrograms.map((program, index) => {
                  const Icon = program.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      data-testid={`fitness-program-${index}`}
                    >
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{program.name}</h4>
                        <p className="text-xs text-muted-foreground">{program.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <Button 
                  size="lg" 
                  className="gap-2"
                  data-testid="button-fitness-tour"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule a Fitness Center Tour
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={fitnessImage} 
                alt={community ? `${community.name} fitness center` : "Modern fitness center with senior-friendly exercise equipment"}
                className="w-full h-full object-cover"
                data-testid="fitness-center-image"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold">
                  <Dumbbell className="w-4 h-4 mr-1" />
                  {community ? community.name : "Fitness Center"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Physical Therapy Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80" 
                alt="Physical therapist working with senior patient on mobility exercises"
                className="w-full h-full object-cover"
                data-testid="physical-therapy-image"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-600 text-white px-4 py-2 text-sm font-semibold">
                  <Shield className="w-4 h-4 mr-1" />
                  Physical Therapy
                </Badge>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Physical Therapy Services</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our licensed physical therapists provide personalized treatment plans to help you recover from 
                injuries, manage chronic conditions, and maintain your highest level of physical function.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {physicalTherapyServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      data-testid={`pt-service-${index}`}
                    >
                      <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                        <Icon className="w-5 h-5 text-green-600" />
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

      {/* Occupational Therapy Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Occupational Therapy Services</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our occupational therapists help you maintain independence in daily activities through 
                adaptive techniques, cognitive training, and personalized strategies for living your best life.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {occupationalTherapyServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      data-testid={`ot-service-${index}`}
                    >
                      <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                        <Icon className="w-5 h-5 text-purple-600" />
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
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80" 
                alt="Occupational therapist helping senior with daily living activities"
                className="w-full h-full object-cover"
                data-testid="occupational-therapy-image"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-purple-600 text-white px-4 py-2 text-sm font-semibold">
                  <Brain className="w-4 h-4 mr-1" />
                  Occupational Therapy
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitness Classes Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Group Fitness Classes & Activities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our variety of group classes designed for all fitness levels. 
              Stay active, have fun, and make friends in our welcoming community atmosphere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fitnessClasses.map((fitnessClass, index) => {
              const Icon = fitnessClass.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-shadow"
                  data-testid={`fitness-class-${index}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {fitnessClass.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{fitnessClass.name}</CardTitle>
                    <CardDescription>{fitnessClass.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{fitnessClass.time}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              All classes are included in your wellness program and adapted to various ability levels.
            </p>
            <Button 
              variant="outline" 
              size="lg"
              data-testid="button-view-schedule"
            >
              View Full Class Schedule
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Benefits of Our Fitness & Therapy Programs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive wellness approach delivers real results that enhance every aspect of your life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
                  data-testid={`benefit-${index}`}
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Professional Staff Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80" 
                alt="Professional therapy staff working with seniors in wellness center"
                className="w-full h-full object-cover"
                data-testid="professional-staff-image"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-white px-4 py-2 text-sm font-semibold">
                  <Star className="w-4 h-4 mr-1" />
                  Expert Team
                </Badge>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Professional Staff & Personalized Plans</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our team of certified fitness instructors, licensed physical therapists, and occupational 
                therapists work together to create personalized wellness plans tailored to your specific 
                needs, goals, and abilities.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Initial Assessment</h4>
                    <p className="text-muted-foreground">Comprehensive evaluation to understand your needs and goals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Customized Programs</h4>
                    <p className="text-muted-foreground">Personalized exercise and therapy plans designed just for you</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Ongoing Support</h4>
                    <p className="text-muted-foreground">Regular progress monitoring and plan adjustments as needed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Collaborative Care</h4>
                    <p className="text-muted-foreground">Our team works with your healthcare providers for comprehensive care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Activity className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Experience Our Fitness & Therapy Center
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Schedule a tour today to see our state-of-the-art facilities, meet our professional staff, 
            and learn how our comprehensive wellness programs can help you live your best life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="gap-2"
              data-testid="button-schedule-tour"
              asChild
            >
              <Link href={community ? `/properties/${community.slug}#tour` : "#"}>
                <Calendar className="w-5 h-5" />
                Schedule a Tour {community && `at ${community.name}`}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2"
              data-testid="button-contact-us"
              asChild
            >
              <a href={`tel:${community?.phoneDial || community?.phoneDisplay || '+19704444689'}`}>
                <Phone className="w-5 h-5" />
                {community ? `Call ${community.name}` : 'Contact Us for More Information'}
              </a>
            </Button>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>On-site at all our communities</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Open 7 days a week</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>All levels welcome</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}