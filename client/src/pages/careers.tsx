import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Heart, 
  Users, 
  Award, 
  Building2, 
  Mail, 
  MapPin, 
  Clock,
  DollarSign,
  GraduationCap,
  Shield
} from "lucide-react";

export default function Careers() {
  const openPositions = [
    {
      title: "Registered Nurse (RN)",
      location: "Multiple Locations",
      type: "Full-Time",
      department: "Healthcare",
      description: "Join our caring team to provide exceptional healthcare services to our residents."
    },
    {
      title: "Certified Nursing Assistant (CNA)",
      location: "Golden Pond - Golden, CO",
      type: "Full-Time / Part-Time",
      department: "Healthcare",
      description: "Help residents with daily activities while building meaningful relationships."
    },
    {
      title: "Activities Coordinator",
      location: "The Gardens at Columbine - Littleton, CO",
      type: "Full-Time",
      department: "Recreation",
      description: "Create and lead engaging programs that enrich our residents' lives."
    },
    {
      title: "Dining Services Manager",
      location: "The Gardens on Quail - Arvada, CO",
      type: "Full-Time",
      department: "Hospitality",
      description: "Oversee dining operations and ensure exceptional culinary experiences."
    },
    {
      title: "Memory Care Specialist",
      location: "Stonebridge Senior - Arvada, CO",
      type: "Full-Time",
      department: "Memory Care",
      description: "Provide specialized care for residents with memory-related conditions."
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive medical, dental, and vision coverage for you and your family"
    },
    {
      icon: DollarSign,
      title: "Competitive Pay",
      description: "Above-market wages with regular performance reviews and raises"
    },
    {
      icon: GraduationCap,
      title: "Education Support",
      description: "Tuition reimbursement and professional development opportunities"
    },
    {
      icon: Clock,
      title: "Work-Life Balance",
      description: "Flexible scheduling, PTO, and paid holidays"
    },
    {
      icon: Shield,
      title: "Retirement Planning",
      description: "401(k) with company match to secure your future"
    },
    {
      icon: Users,
      title: "Team Culture",
      description: "Join a supportive team that values your contributions"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 text-lg px-4 py-1" variant="outline">
              Join Our Team
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Build a Career That Makes a Difference
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              At Stage Senior, we believe exceptional care starts with exceptional people. 
              Join a team that's locally owned, resident-focused, and committed to creating 
              vibrant communities where seniors thrive.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="px-8">
                View Open Positions
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:careers@stagesenior.com">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact HR
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work Here */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Stage Senior?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're not just another senior living company. We're a Colorado family that 
              treats our team members as well as they treat our residents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Locally Owned Since 2016</h3>
                <p className="text-muted-foreground">
                  Work for a company with Colorado values and true community connections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Staff-First Culture</h3>
                <p className="text-muted-foreground">
                  We invest in our team because we know great care starts with supported caregivers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">4 Beautiful Communities</h3>
                <p className="text-muted-foreground">
                  Work in modern, well-maintained facilities across the Front Range
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Benefits That Support You
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We offer comprehensive benefits that show we value you as much as you value our residents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <benefit.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Current Openings
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find your next opportunity with Stage Senior
            </p>
          </div>

          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          <MapPin className="w-3 h-3 mr-1" />
                          {position.location}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {position.type}
                        </Badge>
                        <Badge>
                          <Briefcase className="w-3 h-3 mr-1" />
                          {position.department}
                        </Badge>
                      </div>
                    </div>
                    <Button className="mt-4 md:mt-0">Apply Now</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{position.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Don't see your perfect position? We're always looking for talented people.
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:careers@stagesenior.com">
                Send Us Your Resume
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join a team that's changing the way Colorado thinks about senior living. 
            Your career in compassionate care starts here.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="mailto:careers@stagesenior.com">
                Apply Today
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}