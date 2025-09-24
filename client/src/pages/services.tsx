import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Building, Heart, Shield, Phone, Mail, MapPin, ArrowRight } from "lucide-react";

export default function Services() {
  useEffect(() => {
    document.title = "Our Services | Stage Management";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stage Management delivers comprehensive senior living management solutions including expert management services, spiritual care support, and long-term care insurance excellence.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Stage Management delivers comprehensive senior living management solutions including expert management services, spiritual care support, and long-term care insurance excellence.';
      document.head.appendChild(meta);
    }
  }, []);

  const services = [
    {
      icon: <Building className="w-10 h-10" />,
      title: "Expert Management Services",
      description: "Transform your senior living community with our proven management expertise. From independent living to memory care, we optimize operations while maintaining the highest standards of resident care and satisfaction.",
      cta: "LEARN MORE",
      ctaLink: "/services/management",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Spiritual Care & Support",
      description: "Our dedicated chaplaincy program provides essential spiritual and emotional support throughout your community. We build meaningful relationships that enhance the well-being of residents, families, and staff alike.",
      cta: "EXPLORE",
      ctaLink: "#",
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Long-Term Care Insurance Excellence",
      description: "Navigate the complexities of long-term care insurance with confidence. Our specialized team handles everything from policy review to claims processing, ensuring maximum benefits and full compliance.",
      cta: "LEARN MORE",
      ctaLink: "#",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50"
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
                <BreadcrumbPage data-testid="breadcrumb-current">Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6" data-testid="page-title">
              Our Services
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-8" data-testid="hero-subtitle">
              Senior Living Management Solutions
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed" data-testid="hero-description">
              At Stage Management, we deliver comprehensive solutions tailored to the unique needs of senior living communities. 
              Our specialized services ensure operational excellence, compassionate care, and sustainable growth for your community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild data-testid="button-contact-us">
                <a href="tel:+1-303-436-2300">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Us Today
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild data-testid="button-learn-more">
                <a href="mailto:info@stagesenior.com">
                  <Mail className="w-5 h-5 mr-2" />
                  Get Information
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="services-title">
              Comprehensive Management Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We provide end-to-end solutions that transform senior living communities through expert management, 
              dedicated care programs, and specialized support services.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2" data-testid={`service-card-${index}`}>
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${service.color}`} />
                <div className={`absolute top-0 right-0 w-32 h-32 ${service.bgColor} rounded-full -translate-y-16 translate-x-16 opacity-20`} />
                <CardHeader className="pb-6 pt-8">
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white mb-4 shadow-lg`}>
                      {service.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold mb-4" data-testid={`service-title-${index}`}>
                      {service.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <p className="text-muted-foreground mb-8 text-center leading-relaxed" data-testid={`service-description-${index}`}>
                    {service.description}
                  </p>
                  
                  <div className="text-center">
                    <Button 
                      asChild 
                      className={`bg-gradient-to-r ${service.color} hover:shadow-lg transition-all duration-300 group`}
                      data-testid={`service-cta-${index}`}
                    >
                      <Link href={service.ctaLink}>
                        {service.cta}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="why-choose-title">
              Why Choose Stage Management?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our commitment to excellence and proven track record make us the trusted partner 
              for senior living communities across Colorado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow" data-testid="benefit-1">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Proven Excellence</h3>
              <p className="text-muted-foreground">
                Years of experience in senior living management with a track record of operational success and resident satisfaction.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow" data-testid="benefit-2">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Compassionate Care</h3>
              <p className="text-muted-foreground">
                We prioritize the well-being of residents, families, and staff through comprehensive support programs and personal attention.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow" data-testid="benefit-3">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Trusted Partnership</h3>
              <p className="text-muted-foreground">
                We build lasting relationships with communities, providing reliable support and sustainable growth strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="contact-cta-title">
            Ready to Transform Your Community?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto">
            Let's discuss how Stage Management can help your senior living community achieve operational excellence 
            and provide exceptional care for your residents.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
              asChild 
              data-testid="button-schedule-consultation-cta"
            >
              <a href="tel:+1-303-436-2300">
                <Phone className="w-5 h-5 mr-2" />
                Schedule Consultation
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              asChild 
              data-testid="button-email-us-cta"
            >
              <a href="mailto:info@stagesenior.com">
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </a>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-primary-foreground/20">
            <p className="text-primary-foreground/90 mb-4">
              <strong>Contact Information</strong>
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+1-303-436-2300" className="hover:underline">(303) 436-2300</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@stagesenior.com" className="hover:underline">info@stagesenior.com</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>8100 E Arapahoe Road, Suite 208, Centennial, CO 80112</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}