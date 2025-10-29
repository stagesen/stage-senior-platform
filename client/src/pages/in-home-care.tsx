import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  X,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import PageSectionRenderer from "@/components/PageSectionRenderer";
import type { PageContentSection } from "@shared/schema";

export default function InHomeCare() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Fetch page content sections from database
  const { data: pageSections = [], isLoading: sectionsLoading } = useQuery<PageContentSection[]>({
    queryKey: ['/api/page-content', { pagePath: '/in-home-care', active: true }],
  });
  
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
      description: "Compassionate assistance with daily personal care needs while maintaining dignity and independence",
      image: "https://images.unsplash.com/photo-1559234938-b60fff04894d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Homemaking & Meal Prep",
      description: "Keep your home comfortable and enjoy nutritious meals prepared with care",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070&auto=format&fit=crop"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Mobility & Safety Support",
      description: "Safe movement assistance and fall prevention to maintain your active lifestyle",
      image: "https://images.unsplash.com/photo-1576765608866-5b51046452be?q=80&w=2078&auto=format&fit=crop"
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Errands, Appointments & Companionship",
      description: "Stay connected with errands, medical appointments, and meaningful companionship",
      image: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?q=80&w=2074&auto=format&fit=crop"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Family-Caregiver Respite",
      description: "Give family caregivers the break they need while ensuring continuous quality care",
      image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=2070&auto=format&fit=crop"
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
      title: "Free & Low-Cost In-Home Care on Colorado's Front Range",
      description: "Unlock DRCOG vouchers and free programs to reduce your in-home care costs.",
      link: "/blog",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2074&auto=format&fit=crop"
    },
    {
      title: "2025 Front-Range Cost Check: In-Home Care vs. Assisted Living",
      description: "Compare 2025 Front Range home-care hours to assisted-living prices before deciding.",
      link: "/blog",
      image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Respite Grants for Front-Range Caregivers",
      description: "Learn practical tips & modifications to create a safe & accessible home.",
      link: "/blog",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Custom Healthy at Home Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Branding with External Link */}
            <a 
              href="https://www.healthyathomeco.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <h1 className="text-2xl font-bold text-green-600">Healthy at Home</h1>
                  <p className="text-xs text-gray-600">A Stage Senior Service</p>
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a 
                href="https://www.healthyathomeco.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Visit Full Website
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
              <Link href="/about-us" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                About Us
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Resources
              </Link>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <a href="mailto:info@healthyathomeco.com" target="_blank" rel="noopener noreferrer">
                  Get My 24-Hr Care Plan
                </a>
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
                <a 
                  href="https://www.healthyathomeco.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-green-600 font-medium py-2"
                >
                  Visit Full Website
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
                <Link href="/about-us" className="text-gray-700 hover:text-green-600 font-medium py-2">
                  About Us
                </Link>
                <Link href="/blog" className="text-gray-700 hover:text-green-600 font-medium py-2">
                  Resources
                </Link>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  asChild
                >
                  <a href="mailto:info@healthyathomeco.com" target="_blank" rel="noopener noreferrer">
                    Get My 24-Hr Care Plan
                  </a>
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

      <PageHero
        pagePath="/in-home-care"
        defaultTitle="Healthy at Home"
        defaultSubtitle="Denver Metro In-Home Caregiving"
      />

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

      {/* Services Section with Images - Keep original for now */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50/30" style={{display: 'none'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" data-testid="services-title">
              How We Help at Home—At-a-Glance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We handle the tasks that keep life comfortable and safe at home, partnering with licensed clinicians when skilled nursing is required.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 bg-white" data-testid={`service-card-${index}`}>
                {/* Service Image */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <div className="text-green-600">
                        {service.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3" data-testid={`service-title-${index}`}>
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed" data-testid={`service-description-${index}`}>
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="px-10 py-6 text-lg bg-green-600 hover:bg-green-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              data-testid="button-view-all-services"
              asChild
            >
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section with Professional Image */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8" data-testid="about-title">
                The Healthy at Home Difference
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                As a Stage Senior affiliated service, we bring the same commitment to quality and local expertise that families across Colorado have trusted for years.
              </p>
              
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start p-4 rounded-lg hover:bg-green-50 transition-colors" data-testid={`feature-item-${index}`}>
                    <div className="p-3 bg-green-100 rounded-lg mr-5 mt-1">
                      <div className="text-green-600">{feature.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2" data-testid={`feature-title-${index}`}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed" data-testid={`feature-description-${index}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Button 
                  size="lg"
                  className="px-10 py-6 text-lg bg-green-600 hover:bg-green-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                  data-testid="button-more-about-us"
                  asChild
                >
                  <Link href="/about-us">
                    More About Us
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Professional Team Image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1576765608622-067973a79f53?q=80&w=2078&auto=format&fit=crop"
                  alt="Professional caregiver team"
                  className="w-full h-[600px] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-green-100 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -top-8 -left-8 w-48 h-48 bg-emerald-100 rounded-full opacity-50 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Break - Pattern Section */}
      <section className="py-12 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-8">
            <Heart className="w-12 h-12 text-green-400" />
            <HeartHandshake className="w-16 h-16 text-green-500" />
            <Shield className="w-12 h-12 text-green-400" />
          </div>
        </div>
      </section>

      {/* Testimonial Section with Enhanced Design */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" data-testid="testimonial-title">
              See How Families Like Yours Finally Found Relief
            </h2>
            <p className="text-xl text-gray-600">
              Real stories of adult children who trusted Healthy at Home
            </p>
          </div>
          
          <Card className="shadow-2xl border-0 overflow-hidden" data-testid="testimonial-card">
            <CardContent className="p-12 lg:p-16 bg-gradient-to-br from-green-50 via-white to-emerald-50">
              <div className="flex justify-center mb-8">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <blockquote className="text-center">
                <p className="text-2xl italic text-gray-700 mb-8 leading-relaxed" data-testid="testimonial-quote">
                  "Their caregivers know exactly what they can do—and when to bring in a nurse. 
                  That clarity keeps Mom and our whole family at ease."
                </p>
                <footer>
                  <div className="font-bold text-xl text-gray-900" data-testid="testimonial-author">Emily Thompson</div>
                  <div className="text-gray-600 mt-1" data-testid="testimonial-role">Daughter of Client</div>
                </footer>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Blog/Resources Section with Images */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" data-testid="blog-title">
              Senior-Care Insights & Free Guides
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Practical tips, evidence-backed research, and printable checklists to help your loved one thrive safely at home.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 bg-white" data-testid={`blog-card-${index}`}>
                {/* Blog Image */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3 text-green-600">
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span className="text-sm font-semibold">Resource Guide</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors" data-testid={`blog-title-${index}`}>
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed" data-testid={`blog-description-${index}`}>
                    {post.description}
                  </p>
                  <Link 
                    href={post.link}
                    className="inline-flex items-center text-green-600 font-semibold hover:text-green-700"
                    data-testid={`blog-link-${index}`}
                  >
                    Read More
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              variant="outline"
              className="px-10 py-6 text-lg border-2 border-green-600 text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all"
              data-testid="button-view-resources"
              asChild
            >
              <Link href="/blog">
                View All Resources
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section with Enhanced Design */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" data-testid="contact-title">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to discuss your family's care needs? We're here to help with a personalized care plan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all" data-testid="contact-card-email">
              <CardContent className="p-8 text-center bg-gradient-to-br from-green-50 to-white">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-xl mb-3">Email Us</h3>
                <a 
                  href="mailto:info@healthyathomeco.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium"
                  data-testid="contact-email"
                >
                  info@healthyathomeco.com
                </a>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all" data-testid="contact-card-phone">
              <CardContent className="p-8 text-center bg-gradient-to-br from-green-50 to-white">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-xl mb-3">Call Us</h3>
                <a 
                  href="tel:3032909000"
                  className="text-green-600 hover:text-green-700 font-medium text-lg"
                  data-testid="contact-phone"
                >
                  (303) 290-9000
                </a>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all" data-testid="contact-card-address">
              <CardContent className="p-8 text-center bg-gradient-to-br from-green-50 to-white">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-xl mb-3">Visit Us</h3>
                <p className="text-gray-600" data-testid="contact-address">
                  1270 N Ford Street<br />
                  Golden, CO 80403
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section - End of Page */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="cta-title">
            Get Your Free In-Home Assessment
          </h2>
          <p className="text-2xl text-white/95 mb-8 max-w-3xl mx-auto" data-testid="cta-subtitle">
            We'll build a custom care plan in 24hrs
          </p>
          <p className="text-xl text-white/85 mb-12 max-w-2xl mx-auto">
            Takes just 30 seconds to get started. Our care coordinators will reach out to schedule your free assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="px-12 py-8 text-xl bg-white text-green-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
              data-testid="button-cta-assessment"
              asChild
            >
              <a href="tel:3032909000">
                Call Now: (303) 290-9000
                <Phone className="ml-3 w-6 h-6" />
              </a>
            </Button>
            <Button 
              size="lg" 
              className="px-12 py-8 text-xl bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all"
              data-testid="button-cta-website"
              asChild
            >
              <a href="https://www.healthyathomeco.com/" target="_blank" rel="noopener noreferrer">
                Visit Our Website
                <ExternalLink className="ml-3 w-6 h-6" />
              </a>
            </Button>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </section>
      {/* Page ends here - No footer */}
    </div>
  );
}