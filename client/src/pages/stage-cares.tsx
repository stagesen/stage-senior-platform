import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Heart, Globe, HandHeart, Users, TreePine, School, Phone, Mail, MapPin, DollarSign, Target, Calendar, CheckCircle } from "lucide-react";

export default function StageCares() {
  useEffect(() => {
    document.title = "Stage Cares Foundation | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stage Cares Foundation embodies our commitment to creating positive change both within our communities and around the world through employee participation and company matching.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Stage Cares Foundation embodies our commitment to creating positive change both within our communities and around the world through employee participation and company matching.';
      document.head.appendChild(meta);
    }
  }, []);

  const initiatives = [
    {
      id: "helping-hands",
      title: "Our Community - Helping Hands",
      icon: <HandHeart className="w-8 h-8" />,
      description: "Helping Hands is a non-profit organization formed to help individuals with unexpected life challenges. Stage Cares will have resources available for our own staff to apply for support via Helping Hands when unexpected circumstances arise.",
      focus: "Staff Support",
      impact: "Community Care",
      color: "bg-blue-500"
    },
    {
      id: "yorkin-costa-rica",
      title: "Yorkin, Costa Rica",
      icon: <TreePine className="w-8 h-8" />,
      description: "Our goal for 2022 is to purchase 3,000 organic cocoa plants for the village of Yorkin and deliver these plants on a mission trip from July 1-9, 2022.",
      goal: "$5,000",
      focus: "Agricultural Development",
      impact: "Sustainable Farming",
      color: "bg-green-500",
      progress: 100,
      status: "Completed 2022"
    },
    {
      id: "kaimosi-kenya",
      title: "Kaimosi, Kenya",
      icon: <School className="w-8 h-8" />,
      description: "Deanna's Kids School currently utilizes a small and antiquated kitchen to serve meals to their students and staff daily. Hugo and his mission team have designed and priced a new kitchen for the school.",
      goal: "$15,000",
      raised: "$7,000",
      focus: "Education Infrastructure",
      impact: "Child Nutrition",
      color: "bg-orange-500",
      progress: 47,
      status: "In Progress"
    }
  ];

  const impactStats = [
    {
      number: "3,000+",
      label: "Cocoa Plants Delivered",
      icon: <TreePine className="w-6 h-6" />
    },
    {
      number: "100+",
      label: "Students Fed Daily",
      icon: <Users className="w-6 h-6" />
    },
    {
      number: "2x",
      label: "Company Matching",
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      number: "$10",
      label: "Monthly Per Employee",
      icon: <Heart className="w-6 h-6" />
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
                <Globe className="w-4 h-4 mr-1" />
                CHARITABLE GIVING
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6" data-testid="page-title">
                Stage Cares Foundation
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="hero-description">
                Creating positive change both within our communities and around the world through 
                employee participation and company matching that makes meaningful impacts in diverse communities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild data-testid="button-get-involved">
                  <a href="#initiatives">
                    <Heart className="w-5 h-5 mr-2" />
                    See Our Impact
                  </a>
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
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop"
                alt="Hands holding a heart symbolizing charitable giving and community support"
                className="rounded-lg shadow-xl w-full"
                data-testid="hero-image"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="font-bold text-lg">2:1</span>
                </div>
                <p className="text-sm">Company Match Ratio</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`impact-stat-${index}`}>
                <div className="flex justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1" data-testid={`stat-number-${index}`}>
                  {stat.number}
                </div>
                <div className="text-sm text-primary-foreground/80" data-testid={`stat-label-${index}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Making a Global Impact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="global-impact-title">
              Making a Global Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed" data-testid="global-impact-description">
              Stage Cares embodies our commitment to creating positive change both within our communities and around the world. 
              Through employee participation and company matching, we build a powerful foundation for supporting those in need 
              and making meaningful impacts in diverse communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4" data-testid="global-reach-title">Global Reach</h3>
                <p className="text-muted-foreground" data-testid="global-reach-description">
                  From Costa Rica to Kenya, our initiatives span across continents, 
                  addressing diverse needs and creating lasting change in communities worldwide.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4" data-testid="employee-driven-title">Employee Driven</h3>
                <p className="text-muted-foreground" data-testid="employee-driven-description">
                  Our team members are the heart of Stage Cares, contributing monthly to support causes 
                  they're passionate about while receiving full company matching.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4" data-testid="focused-impact-title">Focused Impact</h3>
                <p className="text-muted-foreground" data-testid="focused-impact-description">
                  We carefully select initiatives that align with our values, ensuring every dollar 
                  makes a meaningful difference in the lives of those we serve.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Stage Cares Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="how-it-works-title">
              How Stage Cares Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed" data-testid="how-it-works-description">
              Our innovative giving program unites the power of employee generosity with corporate commitment. 
              Employees contribute $5.00 per paycheck ($10 monthly), and Stage Management matches every dollar, 
              creating a sustainable fund for supporting vital causes and responding to urgent needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-testid="process-step-1">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Employee Participation</h3>
              <p className="text-muted-foreground text-sm">
                Team members contribute $5.00 per paycheck through voluntary payroll deduction
              </p>
            </div>
            
            <div className="text-center" data-testid="process-step-2">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Company Matching</h3>
              <p className="text-muted-foreground text-sm">
                Stage Management matches every employee dollar, doubling the impact of each contribution
              </p>
            </div>
            
            <div className="text-center" data-testid="process-step-3">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Initiative Selection</h3>
              <p className="text-muted-foreground text-sm">
                Funds are allocated to carefully selected initiatives that align with our mission and values
              </p>
            </div>
            
            <div className="text-center" data-testid="process-step-4">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Meaningful Impact</h3>
              <p className="text-muted-foreground text-sm">
                Resources are deployed to create lasting positive change in communities worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Initiative Cards Section */}
      <section id="initiatives" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="initiatives-title">
              Our Current Initiatives
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Through Stage Cares Foundation, we support three key initiatives that demonstrate our commitment 
              to both local community support and global humanitarian efforts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => (
              <Card key={initiative.id} className="hover:shadow-lg transition-all duration-300 group" data-testid={`initiative-card-${index}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${initiative.color} text-white group-hover:scale-110 transition-transform`}>
                      {initiative.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1" data-testid={`initiative-title-${index}`}>
                        {initiative.title}
                      </CardTitle>
                      {initiative.status && (
                        <Badge variant={initiative.status === 'Completed 2022' ? 'default' : 'secondary'} className="text-xs">
                          {initiative.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed" data-testid={`initiative-description-${index}`}>
                    {initiative.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-primary">Focus Area:</span>
                      <span className="text-muted-foreground">{initiative.focus}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-primary">Impact:</span>
                      <span className="text-muted-foreground">{initiative.impact}</span>
                    </div>
                  </div>

                  {initiative.goal && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm">Goal:</span>
                        <span className="font-bold text-primary" data-testid={`initiative-goal-${index}`}>
                          {initiative.goal}
                        </span>
                      </div>
                      
                      {initiative.progress !== undefined && (
                        <div className="space-y-2">
                          {initiative.raised && (
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Raised:</span>
                              <span data-testid={`initiative-raised-${index}`}>{initiative.raised}</span>
                            </div>
                          )}
                          <Progress 
                            value={initiative.progress} 
                            className="h-2"
                            data-testid={`initiative-progress-${index}`}
                          />
                          <div className="text-xs text-center text-muted-foreground">
                            {initiative.progress}% Complete
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="get-involved-title">
            Join Us in Making a Difference
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            While Stage Cares Foundation is primarily funded through employee participation, 
            we welcome partnerships and collaboration opportunities to expand our impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild data-testid="button-partner-with-us">
              <a href="mailto:info@stagesenior.com?subject=Stage%20Cares%20Partnership">
                <Mail className="w-5 h-5 mr-2" />
                Partner With Us
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary" asChild data-testid="button-learn-more-cta">
              <a href="tel:+1-303-436-2300">
                <Phone className="w-5 h-5 mr-2" />
                Learn More
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="contact-info-title">
            Connect with Stage Cares Foundation
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Have questions about our initiatives or interested in learning more about our charitable giving program? 
            We'd love to hear from you.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <a href="tel:+1-303-436-2300" className="text-primary hover:underline" data-testid="contact-phone">
                (303) 436-2300
              </a>
            </div>
            
            <div className="text-center">
              <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <a href="mailto:info@stagesenior.com" className="text-primary hover:underline" data-testid="contact-email">
                info@stagesenior.com
              </a>
            </div>
            
            <div className="text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-muted-foreground text-sm" data-testid="contact-address">
                8100 E Arapahoe Road, Suite 208<br />
                Centennial, CO 80112
              </p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100">
            <p className="text-muted-foreground">
              <strong>Stage Cares Foundation</strong> is a testament to our belief that together, 
              we can create meaningful change and build stronger, more supportive communities both near and far.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}