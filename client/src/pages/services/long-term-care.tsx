import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowRight, CheckCircle, FileText, Clock, Shield, Phone, Mail, MapPin, FileCheck, ClipboardCheck, Award, Calendar } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function LongTermCare() {
  useEffect(() => {
    document.title = "Long-Term Care Insurance Services | Stage Senior";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Expert long-term care insurance services including policy review, claims processing, and monthly management. Maximize your benefits with Stage Senior\'s dedicated insurance support team.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Expert long-term care insurance services including policy review, claims processing, and monthly management. Maximize your benefits with Stage Senior\'s dedicated insurance support team.';
      document.head.appendChild(meta);
    }
  }, []);

  const benefits = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Expert Policy Review",
      description: "Thorough analysis of your policy to identify all available benefits"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Streamlined Claims Processing",
      description: "Efficient handling of all documentation and submissions"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Monthly Claims Management",
      description: "Consistent processing of required monthly documentation"
    }
  ];

  const processSteps = [
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Expert Policy Review",
      description: "We thoroughly analyze your policy to identify all available benefits and coverage options, helping you make informed decisions about your care."
    },
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "Streamlined Claims Processing",
      description: "From initial filing through ongoing management, we handle all documentation and submissions to ensure prompt, accurate processing of your claims."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Clinical Certification Support",
      description: "Our clinical team works directly with insurance providers to facilitate initial certification and maintain ongoing coverage eligibility."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Monthly Claims Management",
      description: "We process all required monthly documentation, coordinating directly with insurance companies to ensure consistent, timely payments."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        pagePath="/services/long-term-care"
        defaultTitle="Long-Term Care Insurance Services"
        defaultSubtitle="Maximizing Your Insurance Benefits"
        defaultDescription="Expert support to navigate the complexities of long-term care insurance, ensuring you receive all the benefits you're entitled to."
        defaultBackgroundImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=2000&q=80"
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/services">Services</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Long-Term Care Insurance</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Key Benefits */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <div className="text-primary">{benefit.icon}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    {benefit.description}
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Support Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Comprehensive Support Process
            </h2>
            <Button variant="link" className="text-primary font-semibold" asChild>
              <Link href="/about">
                About Us
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-primary">{step.icon}</div>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Contact Our Claims Team
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Let our experienced team help you navigate your long-term care insurance benefits.
                Contact us today to learn how we can assist you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="font-semibold mb-1">Phone</p>
                  <a href="tel:+13036473914" className="text-primary hover:underline">
                    (303) 647-3914
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="font-semibold mb-1">Fax</p>
                  <p className="text-muted-foreground">
                    (303) 648-6763
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="font-semibold mb-1">Email</p>
                  <a href="mailto:ltc@stagesenior.com" className="text-primary hover:underline">
                    ltc@stagesenior.com
                  </a>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <Phone className="w-5 h-5 mr-2" />
                  Get Started Today
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}