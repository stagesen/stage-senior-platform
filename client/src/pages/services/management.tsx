import { useEffect } from "react";
import { CheckCircle, Building2, TrendingUp, Heart, Users, BarChart3, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import CommunityServiceCard from "@/components/CommunityServiceCard";
import type { Community } from "@shared/schema";

export default function ProfessionalManagement() {
  useEffect(() => {
    document.title = "Professional Management Services | Stage Senior";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover Stage Senior\'s professional management services for senior living communities. Expert operational excellence, personalized care, and proven results across Colorado.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover Stage Senior\'s professional management services for senior living communities. Expert operational excellence, personalized care, and proven results across Colorado.';
      document.head.appendChild(meta);
    }
  }, []);

  // Fetch communities from API
  const { data: communities, isLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
    staleTime: 5 * 60 * 1000,
  });

  const serviceAreas = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Business Operations",
      description: "Resident Care, Financial Management"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Financial Management & Optimization",
      description: "Budget planning, cost control, revenue optimization"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Clinical Care Management",
      description: "Healthcare coordination, quality assurance, compliance"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Resident Experience Enhancement",
      description: "Activity programs, satisfaction monitoring, family engagement"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Marketing & Occupancy Growth",
      description: "Strategic marketing, lead generation, conversion optimization"
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Staffing & Human Resources",
      description: "Recruitment, training, retention, performance management"
    }
  ];

  const operationalPoints = [
    "Comprehensive Operating Systems",
    "Evidence-based management for quality outcomes",
    "Transparent communication protocols",
    "Proactive maintenance and environmental management",
    "Integrated technology solutions for efficiency and reporting"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="hero-title">
            Professional Management Services
          </h1>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="py-16">
        {/* Our Management Philosophy */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="philosophy-title">
                  Our Management Philosophy
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed" data-testid="philosophy-description">
                  At Stage Management, we believe in elevating senior living through personalized, community-focused care. 
                  Our approach combines operational excellence with genuine compassion to create vibrant communities where 
                  residents thrive.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl h-80 flex items-center justify-center">
                <div className="text-white/20 text-6xl font-bold">1</div>
              </div>
            </div>
          </div>
        </section>

        {/* Operational Excellence */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="excellence-title">
                  Operational Excellence
                </h2>
                <div className="space-y-4">
                  {operationalPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3" data-testid={`excellence-point-${index}`}>
                      <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <p className="text-muted-foreground">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:order-1 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl h-80 flex items-center justify-center">
                <div className="text-white/20 text-6xl font-bold">2</div>
              </div>
            </div>
          </div>
        </section>

        {/* Proven Track Record */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="track-record-title">
                  Proven Track Record
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed" data-testid="track-record-description">
                  Our hands-on management approach has created a portfolio of successful senior communities throughout Colorado. 
                  We combine industry expertise with local market knowledge to ensure each community reaches its full potential.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl h-80 flex items-center justify-center">
                <div className="text-white/20 text-6xl font-bold">3</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Service Areas Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="service-areas-title">
              Our Service Areas
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive solutions for every aspect of senior living management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((area, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                data-testid={`service-area-${index}`}
              >
                <div className="text-primary mb-4">{area.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{area.title}</h3>
                <p className="text-sm text-muted-foreground">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="communities-title">
              Our Communities and Resources
            </h2>
            <p className="text-lg text-muted-foreground">
              Elevating Senior Care Across Colorado
            </p>
          </div>

          {/* Community Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          ) : communities && communities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communities.slice(0, 4).map((community) => (
                <CommunityServiceCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No communities available at the moment.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}