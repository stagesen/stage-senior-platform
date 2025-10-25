import { Shield, TrendingUp, Clock, Award, Users, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StaggerContainer from "@/components/animations/StaggerContainer";
import StaggerItem from "@/components/animations/StaggerItem";

interface CommunityCredentialsProps {
  community: {
    yearEstablished?: number;
    licensedSince?: string;
    residentCapacity?: number;
    specialCertifications?: string[];
    verifiedStats?: Record<string, number | string>;
    licenseStatus?: string;
    sameDayTours?: boolean;
    state?: string;
  };
}

export default function CommunityCredentials({ community }: CommunityCredentialsProps) {
  // Build trust badges based on actual data
  const badges: Array<{ icon: any; label: string }> = [];

  // Add license status badge (always show if available)
  if (community.licenseStatus) {
    badges.push({
      icon: Shield,
      label: community.licenseStatus,
    });
  }

  // Add year established or licensed since badge
  if (community.yearEstablished) {
    const yearsInBusiness = new Date().getFullYear() - community.yearEstablished;
    badges.push({
      icon: TrendingUp,
      label: `Established ${community.yearEstablished}`,
    });
  } else if (community.licensedSince) {
    const licensedYear = new Date(community.licensedSince).getFullYear();
    badges.push({
      icon: TrendingUp,
      label: `Licensed Since ${licensedYear}`,
    });
  }

  // Add same-day tours badge
  if (community.sameDayTours) {
    badges.push({
      icon: Clock,
      label: "Same-Day Tours Available",
    });
  }

  // Add special certifications as badges
  if (community.specialCertifications && community.specialCertifications.length > 0) {
    community.specialCertifications.forEach(cert => {
      badges.push({
        icon: Award,
        label: cert,
      });
    });
  }

  // Build stats cards based on verified data
  const stats: Array<{ value: string | number; label: string }> = [];

  // Add verified stats from the database
  if (community.verifiedStats) {
    if (community.verifiedStats.familiesServed) {
      stats.push({
        value: `${community.verifiedStats.familiesServed}+`,
        label: "Families Served",
      });
    }

    if (community.verifiedStats.staffCount) {
      stats.push({
        value: community.verifiedStats.staffCount,
        label: "Dedicated Staff Members",
      });
    }

    if (community.verifiedStats.yearsInBusiness) {
      stats.push({
        value: `${community.verifiedStats.yearsInBusiness}+`,
        label: "Years of Excellence",
      });
    }

    if (community.verifiedStats.residentsServed) {
      stats.push({
        value: `${community.verifiedStats.residentsServed}+`,
        label: "Residents Served",
      });
    }

    // Handle any custom stats
    Object.entries(community.verifiedStats).forEach(([key, value]) => {
      if (!['familiesServed', 'staffCount', 'yearsInBusiness', 'residentsServed'].includes(key)) {
        stats.push({
          value: value,
          label: key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase()),
        });
      }
    });
  }

  // Add resident capacity as a stat if available
  if (community.residentCapacity) {
    stats.push({
      value: community.residentCapacity,
      label: "Resident Capacity",
    });
  }

  // Only render the component if we have badges or stats
  if (badges.length === 0 && stats.length === 0) {
    return null;
  }

  return (
    <>
      {/* Trust Badge Bar */}
      {badges.length > 0 && (
        <section className="bg-primary/5 border-y border-primary/10 py-6 md:py-4" data-testid="trust-badge-bar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`grid gap-6 md:gap-4 text-center ${
                badges.length === 1 ? 'grid-cols-1' :
                badges.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                badges.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {badges.map((badge, index) => {
                const IconComponent = badge.icon;
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <IconComponent className="w-8 h-8 md:w-6 md:h-6 text-primary" />
                    <span className="text-sm md:text-base font-semibold">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Stats Strip */}
      {stats.length > 0 && (
        <section className="py-12 md:py-16" data-testid="stats-strip">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerContainer
              staggerDelay={0.1}
              className={`grid gap-8 md:gap-6 ${
                stats.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                stats.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                stats.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <Card className="text-center p-6 md:p-8 border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="p-0">
                      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                        {stat.value}
                      </div>
                      <p className="text-base md:text-lg text-muted-foreground">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}
    </>
  );
}
