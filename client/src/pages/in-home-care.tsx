import { useEffect, useState } from "react";
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
  HeartHandshake,
  Menu,
  X
} from "lucide-react";

export default function InHomeCare() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
      {/* Custom Healthy at Home Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Branding */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <h1 className="text-2xl font-bold text-green-600">Healthy at Home</h1>
                  <p className="text-xs text-gray-600">A Stage Senior Service</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about-us" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                About Us
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Resources
              </Link>
              <Link href="/team" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Team
              </Link>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
                asChild
              >
                <Link href="mailto:info@healthyathomeco.com">
                  Get My 24-Hr Care Plan
                </Link>
              </Button>
              <div className="flex items-center space-x-2 text-green-600 font-bold">
                <Phone className="w-5 h-5" />
                <a href="tel:3032909000" className="hover:underline">(303) 290-9000</a>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-3">
                <Link href="/about-us" className="text-gray-700 hover:text-green-600 font-medium py-2">
                  About Us
                </Link>
                <Link href="/blog" className="text-gray-700 hover:text-green-600 font-medium py-2">
                  Resources
                </Link>
                <Link href="/team" className="text-gray-700 hover:text-green-600 font-medium py-2">
                  Team
                </Link>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  asChild
                >
                  <Link href="mailto:info@healthyathomeco.com">
                    Get My 24-Hr Care Plan
                  </Link>
                </Button>
                <div className="flex items-center justify-center space-x-2 text-green-600 font-bold pt-2">
                  <Phone className="w-5 h-5" />
                  <a href="tel:3032909000" className="hover:underline">(303) 290-9000</a>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-emerald-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4" data-testid="page-title">
              Denver Metro In-Home Caregiving
            </h1>
            <p className="text-xl md:text-2xl text-green-600 font-semibold mb-6" data-testid="hero-subtitle">
              In-Home Care You Can Trust—Right here in Colorado
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="hero-description">
              Providing non-medical homecare support—from bathing assistance to grocery shopping—so you can live well in the place you love.
            </p>
            
            {/* Highlight Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 border-green-200" data-testid="badge-locally-owned">
                <Shield className="w-4 h-4 mr-2" />
                Locally Owned
              </Badge>
              <Badge className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 border-green-200" data-testid="badge-background-checked">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Background Checked
              </Badge>
              <Badge className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 border-green-200" data-testid="badge-rigorous-training">
                <Award className="w-4 h-4 mr-2" />
                Rigorous Training
              </Badge>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg bg-green-600 hover:bg-green-700 text-white"
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
                className="px-8 py-6 text-lg border-green-600 text-green-600 hover:bg-green-50"
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
      <section className="py-16 bg-green-50/30">
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
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group border-green-200 hover:border-green-400" data-testid={`service-card-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <div className="text-green-600">
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
              className="border-green-600 text-green-600 hover:bg-green-50"
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
                    <div className="p-2 bg-green-100 rounded-lg mr-4 mt-1">
                      <div className="text-green-600">{feature.icon}</div>
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
                  className="bg-green-600 hover:bg-green-700 text-white"
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
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 lg:p-12">
                <div className="text-center">
                  <HeartHandshake className="w-16 h-16 text-green-600 mx-auto mb-4" />
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
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="testimonial-title">
              See How Families Like Yours Finally Found Relief
            </h2>
            <p className="text-lg text-muted-foreground">
              Real stories of adult children who trusted Healthy at Home
            </p>
          </div>
          
          <Card className="shadow-xl border-green-200" data-testid="testimonial-card">
            <CardContent className="p-8 lg:p-12 bg-white/70">
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
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group border-green-200 hover:border-green-400" data-testid={`blog-card-${index}`}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-green-600 transition-colors" data-testid={`blog-title-${index}`}>
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4" data-testid={`blog-description-${index}`}>
                    {post.description}
                  </p>
                  <Link 
                    href={post.link}
                    className="inline-flex items-center text-green-600 font-medium hover:underline"
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
              className="border-green-600 text-green-600 hover:bg-green-50"
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
      <section className="py-16 bg-green-50/30">
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
            <Card className="border-green-200" data-testid="contact-card-email">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <a 
                  href="mailto:info@healthyathomeco.com"
                  className="text-green-600 hover:underline"
                  data-testid="contact-email"
                >
                  info@healthyathomeco.com
                </a>
              </CardContent>
            </Card>
            
            <Card className="border-green-200" data-testid="contact-card-phone">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <a 
                  href="tel:3032909000"
                  className="text-green-600 hover:underline"
                  data-testid="contact-phone"
                >
                  (303) 290-9000
                </a>
              </CardContent>
            </Card>
            
            <Card className="border-green-200" data-testid="contact-card-address">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <MapPin className="w-6 h-6 text-green-600" />
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
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="cta-title">
            Get Your Free In-Home Assessment
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto" data-testid="cta-subtitle">
            We'll build a custom care plan in 24hrs
          </p>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Takes just 30 seconds to get started. Our care coordinators will reach out to schedule your free assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg bg-white text-green-600 hover:bg-gray-100"
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

      {/* Custom Footer for Healthy at Home */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-green-400" />
                <h3 className="ml-3 text-2xl font-bold">Healthy at Home</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Trusted in-home care services across Denver Metro. Part of the Stage Senior family, bringing compassionate care to your doorstep.
              </p>
              <div className="flex space-x-4">
                <Badge className="bg-green-600 text-white border-green-500">
                  Locally Owned
                </Badge>
                <Badge className="bg-green-600 text-white border-green-500">
                  Background Checked
                </Badge>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/services" className="text-gray-300 hover:text-green-400 transition-colors">
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="text-gray-300 hover:text-green-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-gray-300 hover:text-green-400 transition-colors">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-green-400 transition-colors">
                    Resources & Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-gray-300 hover:text-green-400 transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-green-400 mr-3" />
                  <a href="tel:3032909000" className="text-gray-300 hover:text-green-400">
                    (303) 290-9000
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-green-400 mr-3" />
                  <a href="mailto:info@healthyathomeco.com" className="text-gray-300 hover:text-green-400">
                    info@healthyathomeco.com
                  </a>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                  <div className="text-gray-300">
                    1270 N Ford Street<br />
                    Golden, CO 80403
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Healthy at Home. All rights reserved. A Stage Senior Service.
              </p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-gray-400 hover:text-green-400 text-sm">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-green-400 text-sm">
                  Terms of Service
                </Link>
                <Link href="/accessibility" className="text-gray-400 hover:text-green-400 text-sm">
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}