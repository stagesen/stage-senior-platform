import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Home, 
  Users, 
  Car, 
  Clock,
  Shield,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Calendar,
  HandHeart,
  ShieldCheck,
  Award,
  Sparkles,
  UserCheck,
  HeartHandshake
} from "lucide-react";

export default function InHomeCare() {
  useEffect(() => {
    document.title = "Denver Metro In-Home Caregiving | Healthy at Home - Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Trusted in-home care services in Denver Metro. Non-medical homecare support from bathing assistance to grocery shopping. Locally owned, background checked caregivers. Same-day starts available.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Trusted in-home care services in Denver Metro. Non-medical homecare support from bathing assistance to grocery shopping. Locally owned, background checked caregivers. Same-day starts available.';
      document.head.appendChild(meta);
    }
  }, []);

  const services = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Personal Care & Hygiene",
      description: "Compassionate assistance with daily personal care needs while maintaining dignity and independence"
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Homemaking & Meal Prep",
      description: "Keep your home comfortable and enjoy nutritious meals prepared with care"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Mobility & Safety Support",
      description: "Safe movement assistance and fall prevention to maintain your active lifestyle"
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Errands, Appointments & Companionship",
      description: "Stay connected with errands, medical appointments, and meaningful companionship"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Family-Caregiver Respite",
      description: "Give family caregivers the break they need while ensuring continuous quality care"
    }
  ];

  const features = [
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: "Background-checked caregivers",
      description: "Never contractors—all employees are thoroughly vetted"
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Not a franchise & Locally Owned",
      description: "Colorado-based and operated with local leadership"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Same-day starts available",
      description: "Serving Denver, Aurora, Littleton, Golden & Westminster"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Flexible Schedules",
      description: "Care plans that adapt to your needs and lifestyle"
    }
  ];

  const blogPosts = [
    {
      title: "Free & Low-Cost In-Home Care on Colorado's Front Range: Your Step-by-Step Guide",
      description: "Unlock DRCOG vouchers and free programs to reduce your in-home care costs.",
      link: "#"
    },
    {
      title: "2025 Front-Range Cost Check: In-Home Care vs. Assisted Living",
      description: "Compare 2025 Front Range home-care hours to assisted-living prices before deciding.",
      link: "#"
    },
    {
      title: "Respite Grants for Front-Range Caregivers: Fund Your Next Break",
      description: "Learn practical tips & modifications to create a safe & accessible home.",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4" data-testid="page-title">
              Denver Metro In-Home Caregiving
            </h1>
            <p className="text-xl md:text-2xl text-primary font-semibold mb-6" data-testid="hero-subtitle">
              In-Home Care You Can Trust—Right here in Colorado
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="hero-description">
              Providing non-medical homecare support—from bathing assistance to grocery shopping—so you can live well in the place you love.
            </p>
            
            {/* Highlight Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium" data-testid="badge-locally-owned">
                <Shield className="w-4 h-4 mr-2" />
                Locally Owned
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium" data-testid="badge-background-checked">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Background Checked
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium" data-testid="badge-rigorous-training">
                <Award className="w-4 h-4 mr-2" />
                Rigorous Training
              </Badge>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg"
                data-testid="button-schedule-assessment"
                asChild
              >
                <Link href="tel:3032909000">
                  Schedule a Care Assessment
                  <Phone className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-6 text-lg"
                data-testid="button-care-plan"
                asChild
              >
                <Link href="mailto:info@healthyathomeco.com">
                  Get My 24-Hr Care Plan
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="services-title">
              How We Help at Home—At-a-Glance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We handle the tasks that keep life comfortable and safe at home, partnering with licensed clinicians when skilled nursing is required.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group" data-testid={`service-card-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <div className="text-primary">
                        {service.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" data-testid={`service-title-${index}`}>
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground" data-testid={`service-description-${index}`}>
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              size="lg"
              variant="outline"
              data-testid="button-view-all-services"
              asChild
            >
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="about-title">
                The Healthy at Home Difference
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                As a Stage Senior affiliated service, we bring the same commitment to quality and local expertise that families across Colorado have trusted for years.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start" data-testid={`feature-item-${index}`}>
                    <div className="p-2 bg-primary/10 rounded-lg mr-4 mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1" data-testid={`feature-title-${index}`}>
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button 
                  size="lg"
                  data-testid="button-more-about-us"
                  asChild
                >
                  <Link href="/about-us">
                    More About Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8 lg:p-12">
                <div className="text-center">
                  <HeartHandshake className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Trusted Care, Local Roots</h3>
                  <p className="text-muted-foreground">
                    More hours of care for you with our locally-owned, non-franchise model. 
                    We're your neighbors, invested in our Colorado communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="testimonial-title">
              See How Families Like Yours Finally Found Relief
            </h2>
            <p className="text-lg text-muted-foreground">
              Real stories of adult children who trusted Healthy at Home
            </p>
          </div>
          
          <Card className="shadow-xl" data-testid="testimonial-card">
            <CardContent className="p-8 lg:p-12">
              <div className="flex justify-center mb-6">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <blockquote className="text-center">
                <p className="text-xl italic text-muted-foreground mb-6" data-testid="testimonial-quote">
                  "Their caregivers know exactly what they can do—and when to bring in a nurse. 
                  That clarity keeps Mom and our whole family at ease."
                </p>
                <footer>
                  <div className="font-semibold text-lg" data-testid="testimonial-author">Emily Thompson</div>
                  <div className="text-muted-foreground" data-testid="testimonial-role">Daughter of Client</div>
                </footer>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Blog/Resources Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="blog-title">
              Senior-Care Insights & Free Guides
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Practical tips, evidence-backed research, and printable checklists to help your loved one thrive safely at home.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group" data-testid={`blog-card-${index}`}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors" data-testid={`blog-title-${index}`}>
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4" data-testid={`blog-description-${index}`}>
                    {post.description}
                  </p>
                  <Link 
                    href={post.link}
                    className="inline-flex items-center text-primary font-medium hover:underline"
                    data-testid={`blog-link-${index}`}
                  >
                    Read More
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              size="lg"
              variant="outline"
              data-testid="button-view-resources"
              asChild
            >
              <Link href="/blog">
                View Our Resources
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="contact-title">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to discuss your family's care needs? We're here to help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card data-testid="contact-card-email">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <a 
                  href="mailto:info@healthyathomeco.com"
                  className="text-primary hover:underline"
                  data-testid="contact-email"
                >
                  info@healthyathomeco.com
                </a>
              </CardContent>
            </Card>
            
            <Card data-testid="contact-card-phone">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <a 
                  href="tel:3032909000"
                  className="text-primary hover:underline"
                  data-testid="contact-phone"
                >
                  (303) 290-9000
                </a>
              </CardContent>
            </Card>
            
            <Card data-testid="contact-card-address">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-sm text-muted-foreground" data-testid="contact-address">
                  1270 N Ford Street<br />
                  Golden, CO 80403
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="cta-title">
            Get Your Free In-Home Assessment
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto" data-testid="cta-subtitle">
            We'll build a custom care plan in 24hrs
          </p>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Takes just 30 seconds to get started. Our care coordinators will reach out to schedule your free assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 py-6 text-lg"
              data-testid="button-cta-assessment"
              asChild
            >
              <Link href="tel:3032909000">
                Call Now: (303) 290-9000
                <Phone className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border-white/20"
              data-testid="button-cta-email"
              asChild
            >
              <Link href="mailto:info@healthyathomeco.com">
                Email Us
                <Mail className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}