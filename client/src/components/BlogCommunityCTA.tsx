import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { Community } from "@shared/schema";

interface BlogCommunityCTAProps {
  community: Community;
}

export default function BlogCommunityCTA({ community }: BlogCommunityCTAProps) {
  const logoUrl = useResolveImageUrl(community.logoImageId);

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

  // Create gradient background using mainColorHex
  const mainColorLight = community.mainColorHex ? hexToRgba(community.mainColorHex, 0.15) : null;
  const mainColorLighter = community.mainColorHex ? hexToRgba(community.mainColorHex, 0.05) : null;
  const borderColor = community.mainColorHex ? hexToRgba(community.mainColorHex, 0.3) : null;
  
  const gradientStyle = mainColorLight && mainColorLighter && borderColor
    ? {
        background: `linear-gradient(135deg, ${mainColorLight} 0%, ${mainColorLighter} 100%)`,
        borderColor: borderColor,
      }
    : {};

  // CTA button style using ctaColorHex
  const buttonStyle = community.ctaColorHex
    ? {
        backgroundColor: community.ctaColorHex,
        color: "#000",
      }
    : {};

  return (
    <Card 
      className="border-2 overflow-hidden mt-12" 
      style={gradientStyle}
      data-testid="blog-community-cta"
    >
      <CardContent className="p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Community Logo */}
          {logoUrl && (
            <div className="flex-shrink-0">
              <img
                src={logoUrl}
                alt={`${community.name} logo`}
                className="w-24 h-24 md:w-28 md:h-28 object-contain"
                data-testid="community-logo"
              />
            </div>
          )}

          {/* CTA Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 
              className="text-2xl md:text-3xl font-bold text-foreground mb-3"
              data-testid="cta-heading"
            >
              Interested in {community.name}?
            </h3>
            <p 
              className="text-lg text-muted-foreground mb-6"
              data-testid="cta-subheading"
            >
              Discover what makes {community.name} special and see why families choose us for their loved ones.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                asChild
                size="lg"
                className="group hover:opacity-90 transition-opacity"
                style={buttonStyle}
                data-testid="button-schedule-tour"
              >
                <Link href={`/communities/${community.slug}`}>
                  Schedule Your Personal Tour
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                data-testid="button-learn-more"
              >
                <Link href={`/communities/${community.slug}`}>
                  Learn More About {community.name}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {community.phoneDisplay && (
          <div className="mt-8 pt-8 border-t border-border text-center md:text-left">
            <p className="text-sm text-muted-foreground" data-testid="cta-contact-info">
              Questions? Call us at{" "}
              <a 
                href={`tel:${community.phoneDial || community.phoneDisplay}`}
                className="font-semibold text-foreground hover:text-primary transition-colors"
                data-testid="link-phone"
              >
                {community.phoneDisplay}
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
