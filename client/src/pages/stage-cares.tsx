import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Heart, BookOpen, Users, Shield, Star, Sparkles, Phone, Calendar, MapPin, CheckCircle, Quote } from "lucide-react";
import { useBookingFlow } from "@/components/booking-flow";

export default function StageCares() {
  const { openBooking, trackCall } = useBookingFlow();
  useEffect(() => {
    document.title = "Stage Cares | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover Stage Cares - our signature "Your Story First" care philosophy that creates personalized, meaningful experiences for seniors through story-sharing, family traditions, and individualized care plans.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover Stage Cares - our signature "Your Story First" care philosophy that creates personalized, meaningful experiences for seniors through story-sharing, family traditions, and individualized care plans.';
      document.head.appendChild(meta);
    }
  }, []);

  const corePrograms = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Your Story First",
      description: "We learn each resident's life story, preferences, and history before anything else. Care plans are built around who you are, not just what you need.",
      features: [
        "Personal story-sharing sessions with family",
        "Care plans based on life history and preferences",
        "Celebration of family traditions and important dates",
        "Daily routines that honor personal habits",
        "Memory care enhanced by personal storytelling"
      ]
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Holistic Wellness",
      description: "We care for the whole person - mind, body, and spirit - through comprehensive programming and specialized support services.",
      features: [
        "Physical therapy and wellness programs",
        "Spiritual care through our chaplaincy program",
        "Mental stimulation and cognitive activities",
        "Emotional support and counseling",
        "Social engagement and community building"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Family Partnership",
      description: "We treat families as partners in care, maintaining open communication and involving loved ones in important decisions and celebrations.",
      features: [
        "Regular family care plan meetings",
        "Transparent communication about resident progress",
        "Family education and support groups",
        "Involvement in activities and special events",
        "24/7 access to care team updates"
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Staff Excellence",
      description: "Exceptional resident care starts with exceptional staff care. We invest in our team to create stable, caring relationships.",
      features: [
        "Comprehensive training and development",
        "Long-tenure staff who know residents personally",
        "Values-aligned hiring and culture",
        "Regular professional development opportunities",
        "Recognition and advancement programs"
      ]
    }
  ];

  const specialtyPrograms = [
    {
      title: "Memory Care Excellence",
      description: "Our memory care programming combines evidence-based approaches with personalized storytelling to create meaningful connections.",
      highlights: ["Secure, thoughtfully designed environments", "Specialized staff training", "Family education programs"]
    },
    {
      title: "Intergenerational Programming",
      description: "We connect residents with local schools and community groups to foster meaningful relationships across generations.",
      highlights: ["School partnerships", "Mentorship programs", "Community events"]
    },
    {
      title: "Spiritual Care Program",
      description: "Through our partnership with Senior Living Chaplains, we provide 24/7 emotional and spiritual support for all faiths.",
      highlights: ["Professional chaplains on-site", "Weekly faith services", "Crisis support available"]
    },
    {
      title: "Therapy & Wellness",
      description: "Comprehensive wellness programs designed to maintain and improve physical, cognitive, and emotional health.",
      highlights: ["Physical and occupational therapy", "Fitness programs", "Wellness assessments"]
    }
  ];

  const testimonials = [
    {
      quote: "The Stonebridge staff are an extremely professional care team and has the best management a family could ask for (which is almost unheard of in this industry)!!",
      author: "Resident Family Member",
      community: "Stonebridge Senior"
    },
    {
      quote: "What sets Stage Senior apart is how they truly know my mother. They remember her stories, celebrate her birthday the way she always did, and treat her like family.",
      author: "Sarah M.",
      community: "The Gardens at Columbine"
    },
    {
      quote: "The Your Story First approach made all the difference for my father with dementia. The staff knew his background and could connect with him in ways that brought him joy.",
      author: "Michael R.",
      community: "Golden Pond"
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
                <BreadcrumbPage data-testid="breadcrumb-current">Stage Cares</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="secondary" data-testid="hero-badge">
                <Sparkles className="w-4 h-4 mr-1" />
                Signature Care Philosophy
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6" data-testid="page-title">
                Stage Cares
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="hero-description">
                Our "Your Story First" approach to senior care honors each resident's unique life journey, 
                creating personalized experiences that celebrate who they are and support where they're going.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild data-testid="button-explore-communities">
                  <Link href="/communities">
                    <MapPin className="w-5 h-5 mr-2" />
                    Experience Our Communities
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-learn-more">
                  <a href="tel:+1-303-436-2300">
                    <Phone className="w-5 h-5 mr-2" />
                    Learn More
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop"
                alt="Caregiver reading with senior resident, showcasing personal storytelling approach"
                className="rounded-lg shadow-xl w-full"
                data-testid="hero-image"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="font-bold text-lg">98%</span>
                </div>
                <p className="text-sm">Resident Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Story First Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="story-first-title">
              Your Story First: The Heart of Everything We Do
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Before we create a care plan, before we schedule activities, before anything else - we learn your story. 
              Because exceptional care starts with understanding who you are as a person.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Story Collection</h3>
                <p className="text-muted-foreground">
                  We conduct detailed story-sharing sessions with residents and families to understand 
                  life history, preferences, traditions, and what brings joy.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Personalized Care</h3>
                <p className="text-muted-foreground">
                  Care plans are built around personal stories - honoring daily routines, favorite foods, 
                  cherished memories, and family traditions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Living Celebrations</h3>
                <p className="text-muted-foreground">
                  We celebrate what matters most - birthdays the way you always did, family traditions, 
                  career achievements, and personal milestones.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/5 rounded-xl p-8">
            <blockquote className="text-center">
              <Quote className="w-8 h-8 text-primary mx-auto mb-4" />
              <p className="text-lg italic text-foreground mb-4" data-testid="philosophy-quote">
                "We believe that knowing someone's story is the foundation of exceptional care. 
                When we understand who you are, we can better support who you're becoming."
              </p>
              <footer className="text-muted-foreground">- Stage Senior Care Philosophy</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Core Programs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="core-programs-title">
              Stage Cares Core Programs
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive approach to senior care encompasses four foundational programs that work together 
              to create exceptional experiences for residents and families.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {corePrograms.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`core-program-${index}`}>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {program.icon}
                    </div>
                    <CardTitle className="text-xl" data-testid={`program-title-${index}`}>
                      {program.title}
                    </CardTitle>
                  </div>
                  <p className="text-muted-foreground" data-testid={`program-description-${index}`}>
                    {program.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2" data-testid={`program-feature-${index}-${featureIndex}`}>
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty Programs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="specialty-programs-title">
              Specialty Programs & Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Beyond our core programs, we offer specialized services designed to enrich daily life 
              and provide comprehensive support for residents and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specialtyPrograms.map((program, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow" data-testid={`specialty-program-${index}`}>
                <CardContent className="pt-0">
                  <h3 className="text-xl font-semibold mb-3" data-testid={`specialty-title-${index}`}>
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground mb-4" data-testid={`specialty-description-${index}`}>
                    {program.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {program.highlights.map((highlight, highlightIndex) => (
                      <Badge key={highlightIndex} variant="secondary" className="text-xs" data-testid={`specialty-highlight-${index}-${highlightIndex}`}>
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="testimonials-title">
              What Families Are Saying
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              The Stage Cares difference is evident in the relationships we build and the trust families place in us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground" data-testid={`testimonial-${index}`}>
                <CardContent className="p-6">
                  <Quote className="w-6 h-6 text-primary-foreground/60 mb-4" />
                  <blockquote className="text-sm mb-4 italic" data-testid={`testimonial-quote-${index}`}>
                    "{testimonial.quote}"
                  </blockquote>
                  <footer className="text-xs">
                    <div className="font-semibold" data-testid={`testimonial-author-${index}`}>
                      {testimonial.author}
                    </div>
                    <div className="text-primary-foreground/80" data-testid={`testimonial-community-${index}`}>
                      {testimonial.community}
                    </div>
                  </footer>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="contact-cta-title">
            Experience Stage Cares for Yourself
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Schedule a personal consultation to learn how our Your Story First approach can create 
            a meaningful, personalized care experience for your loved one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              data-testid="button-schedule-consultation"
              onClick={() => openBooking({ source: "stage-cares-cta" })}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule a Consultation
            </Button>
            <Button
              variant="outline"
              size="lg"
              data-testid="button-call-now"
              onClick={() => trackCall({ source: "stage-cares-cta-call" })}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call (303) 436-2300
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-muted-foreground mb-4">
              <strong>Ready to share your story?</strong><br />
              Our care coordinators are available to discuss how Stage Cares can be tailored 
              to your family's unique needs and preferences.
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