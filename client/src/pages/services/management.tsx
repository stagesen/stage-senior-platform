import { useEffect } from "react";
import { CheckCircle, Building2, TrendingUp, Heart, Users, BarChart3, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import CommunitiesCarousel from "@/components/CommunitiesCarousel";
import { PageHero } from "@/components/PageHero";
import type { Community, PageContentSection } from "@shared/schema";

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

  // Fetch page content sections
  const { data: pageSections = [] } = useQuery<PageContentSection[]>({
    queryKey: ["/api/page-content"],
  });

  // Get hero section content
  const heroSection = pageSections.find(
    (section) => section.pagePath === "/services/management" && section.sectionType === "hero_section" && section.active
  );
  const heroContent = heroSection?.content as { heading?: string; description?: string; imageUrl?: string } | undefined;

  const serviceAreas = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Financial Management & Optimization",
      description: "We drive success through strategic budgeting and revenue optimization. Our transparent reporting and risk management protect your investment while maximizing operational efficiency."
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Operational Excellence",
      description: "We maintain exceptional standards through proactive quality assurance and regulatory compliance. Our integrated technology and maintenance programs ensure smooth, efficient operations."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Clinical Care Management",
      description: "Our comprehensive care protocols adapt to each resident's evolving needs. Through healthcare partnerships and staff training, we deliver consistent, high-quality care."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Resident Experience Enhancement",
      description: "We create engaging activities and premium dining experiences that residents love. Our life enrichment programs and family communication systems ensure active, connected communities."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Marketing & Occupancy Growth",
      description: "We build strong occupancy through targeted marketing and community outreach. Our sales training and referral networks help communities thrive and grow."
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Staffing & Human Resources",
      description: "We attract and retain exceptional teams through strategic recruitment and development. Our engagement initiatives create positive cultures where staff excel."
    }
  ];

  // Operational Excellence section now uses three pillars structure

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        pagePath="/services/management"
        defaultTitle="Professional Management Services"
        defaultSubtitle="Local Leadership, Proven Excellence"
        defaultDescription="Expert operational excellence, personalized care, and proven results across Colorado"
      />

      {/* Main Content Sections */}
      <div className="py-16">
        {/* Our Management Philosophy */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="philosophy-title">
                  {heroContent?.heading || "Our Management Philosophy"}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed" data-testid="philosophy-description">
                  {heroContent?.description || "We believe that senior living should be a chapter of life marked by dignity, purpose, and joy. Our management approach focuses on creating environments where residents thrive, families find peace of mind, and staff members grow professionally."}
                </p>
              </div>
              <div className="relative rounded-2xl shadow-xl h-80 overflow-hidden">
                <img
                  src={heroContent?.imageUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"}
                  alt="Professional management services"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Operational Excellence */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center" data-testid="excellence-title">
              Operational Excellence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Comprehensive Operating Systems */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-foreground mb-4" data-testid="pillar-systems">
                  Comprehensive Operating Systems
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Sophisticated management protocols that ensure consistency and quality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Performance tracking and transparent reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Proactive maintenance and property management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Integrated technology solutions for enhanced care delivery</span>
                  </li>
                </ul>
              </div>
              
              {/* Service Excellence */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-foreground mb-4" data-testid="pillar-service">
                  Service Excellence
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Premium dining experiences with chef-crafted menus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Engaging activity programs that promote social connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Professional housekeeping and maintenance services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Personalized care plans that adapt to changing needs</span>
                  </li>
                </ul>
              </div>
              
              {/* Team Development */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-foreground mb-4" data-testid="pillar-team">
                  Team Development
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Ongoing professional training and advancement opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Competitive compensation and benefits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Supportive work environment that promotes retention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Regular team recognition and appreciation programs</span>
                  </li>
                </ul>
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
                  Our hands-on management approach has created a portfolio of successful communities throughout the Denver metro area. 
                  We maintain direct accessibility to both our on-site staff and investors, ensuring alignment with our high standards 
                  of care and service.
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
        <CommunitiesCarousel
          communities={communities || []}
          isLoading={isLoading}
          title="Communities We Manage"
          subtitle="Discover our expertly managed senior living communities"
        />
      </section>

    </div>
  );
}