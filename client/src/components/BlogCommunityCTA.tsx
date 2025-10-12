import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Phone } from "lucide-react";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import type { Community } from "@shared/schema";

interface BlogCommunityCTAProps {
  community: Community;
}

export default function BlogCommunityCTA({ community }: BlogCommunityCTAProps) {
  const logoUrl = useResolveImageUrl(community.logoImageId);
  const { openScheduleTour } = useScheduleTour();

  // Helper function to convert hex to rgba (handles both #rrggbb and rrggbb formats)
  const hexToRgba = (hex: string, alpha: number): string | null => {
    if (!hex) return null;
    
    // Remove '#' if present
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    
    // Validate hex format (must be 6 characters)
    if (cleanHex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      return null;
    }
    
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    
    // Check for NaN values
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return null;
    }
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Create stronger gradient background using mainColorHex with better visibility
  const mainColorMedium = community.mainColorHex ? hexToRgba(community.mainColorHex, 0.12) : null;
  const mainColorLight = community.mainColorHex ? hexToRgba(community.mainColorHex, 0.03) : null;
  const borderColor = community.mainColorHex ? hexToRgba(community.mainColorHex, 0.4) : null;
  
  // Fallback to default gradient if no community colors
  const gradientStyle = mainColorMedium && mainColorLight && borderColor
    ? {
        background: `linear-gradient(135deg, ${mainColorMedium} 0%, ${mainColorLight} 100%)`,
        borderColor: borderColor,
      }
    : {
        background: 'linear-gradient(135deg, hsl(220, 53%, 53%, 0.12) 0%, hsl(220, 53%, 53%, 0.03) 100%)',
        borderColor: 'hsl(220, 53%, 53%, 0.4)',
      };

  // CTA button style using ctaColorHex with white text for maximum impact
  const buttonStyle = community.ctaColorHex
    ? {
        backgroundColor: community.ctaColorHex,
        color: '#FFFFFF',
        borderColor: community.ctaColorHex,
      }
    : {}; // Will use default button styling

  // Card border style using community color
  const cardBorderStyle = community.ctaColorHex
    ? { borderColor: community.ctaColorHex }
    : {};

  return (
    <Card 
      className="border-2 overflow-hidden mt-8 md:mt-12 shadow-xl bg-white" 
      style={cardBorderStyle}
      data-testid="blog-community-cta"
    >
      <CardContent className="p-6 sm:p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10">
          {/* Community Logo */}
          {logoUrl && (
            <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-start">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <img
                  src={logoUrl}
                  alt={`${community.name} logo`}
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-contain"
                  data-testid="community-logo"
                />
              </div>
            </div>
          )}

          {/* CTA Content */}
          <div className="flex-1 text-center lg:text-left w-full">
            <h3 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4"
              data-testid="cta-heading"
            >
              Interested in {community.name}?
            </h3>
            <p 
              className="text-base sm:text-lg text-muted-foreground mb-6 lg:mb-8 max-w-2xl mx-auto lg:mx-0"
              data-testid="cta-subheading"
            >
              Discover what makes {community.name} special and see why families trust us with their loved ones' care.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 lg:mb-0">
              <Button
                size="lg"
                className="group hover:brightness-110 transition-all text-base sm:text-lg font-semibold shadow-md hover:shadow-xl w-full sm:w-auto"
                style={buttonStyle}
                onClick={() => openScheduleTour({
                  communityId: community.id,
                  communityName: community.name,
                  title: `Schedule a Tour at ${community.name}`,
                  description: `Visit ${community.name} in ${community.city} to see our beautiful community and amenities in person.`
                })}
                data-testid="button-schedule-tour"
              >
                Schedule Your Tour
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 hover:bg-accent text-base sm:text-lg font-semibold w-full sm:w-auto"
                data-testid="button-contact"
              >
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        {community.phoneDisplay && (
          <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t-2 border-border">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-4">
              <p className="text-sm sm:text-base text-muted-foreground text-center lg:text-left" data-testid="cta-contact-info">
                Have questions? We're here to help!
              </p>
              <a 
                href={`tel:${community.phoneDial || community.phoneDisplay}`}
                className="flex items-center gap-2 px-6 py-3 bg-accent/20 hover:bg-accent/30 rounded-lg transition-colors group border border-accent/40"
                data-testid="link-phone"
              >
                <Phone className="w-5 h-5 text-foreground" />
                <span className="font-bold text-foreground text-base sm:text-lg">
                  {community.phoneDisplay}
                </span>
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
