import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";

interface PageHeroProps {
  pagePath: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  defaultBackgroundImage?: string;
  className?: string;
}

export function PageHero({
  pagePath,
  defaultTitle,
  defaultSubtitle,
  defaultBackgroundImage,
  className,
}: PageHeroProps) {
  const { data: hero, isLoading } = useQuery({
    queryKey: ["/api/page-heroes", pagePath],
    queryFn: async () => {
      const response = await fetch(`/api/page-heroes/${encodeURIComponent(pagePath)}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No hero configured for this page
        }
        throw new Error("Failed to fetch page hero");
      }
      return response.json();
    },
  });

  // Use hero data if available, otherwise fall back to defaults
  const title = hero?.title || defaultTitle || "";
  const subtitle = hero?.subtitle || defaultSubtitle || "";
  const description = hero?.description || "";
  const backgroundImageRaw = hero?.backgroundImageUrl || defaultBackgroundImage || "";
  const ctaText = hero?.ctaText || "";
  const ctaLink = hero?.ctaLink || "";
  const overlayOpacity = hero?.overlayOpacity || 0.3; // Reduced for better gradient visibility
  const textAlignment = hero?.textAlignment || "center";
  const isActive = hero?.active !== false; // Default to true if no hero or not specified
  
  // Resolve background image URL
  const backgroundImage = useResolveImageUrl(backgroundImageRaw) || backgroundImageRaw;
  
  // Determine gradient background based on page
  const getGradientBackground = () => {
    if (pagePath === "/" || pagePath.includes("home")) {
      return "var(--gradient-deepblue-azure)";
    } else if (pagePath.includes("services") || pagePath.includes("contact")) {
      return "var(--gradient-deepblue-azure)";
    } else if (pagePath.includes("communities")) {
      return "var(--gradient-copper-sage)";
    }
    return "var(--gradient-deepblue-azure)";
  };

  // Don't render if hero exists but is inactive
  if (hero && !isActive) {
    return null;
  }

  // Don't render if loading and no defaults
  if (isLoading && !defaultTitle && !defaultBackgroundImage) {
    return null;
  }

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <section
      className={cn(
        "relative h-[500px] flex items-center justify-center overflow-hidden",
        className
      )}
      data-testid={`hero-${pagePath.replace(/\//g, "-") || "home"}`}
    >
      {/* Background - Image or Gradient */}
      {backgroundImage ? (
        <>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            data-testid={`hero-background-${pagePath.replace(/\//g, "-") || "home"}`}
          />
          {/* Blue Overlay */}
          <div
            className="absolute inset-0 z-10 bg-gradient-to-t from-blue-900/70 to-blue-600/30"
            data-testid={`hero-overlay-${pagePath.replace(/\//g, "-") || "home"}`}
          />
        </>
      ) : (
        <>
          {/* Gradient Background when no image */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: getGradientBackground(),
            }}
            data-testid={`hero-gradient-${pagePath.replace(/\//g, "-") || "home"}`}
          />
          {/* Subtle blue overlay effect for gradient */}
          <div
            className="absolute inset-0 z-10 bg-gradient-to-t from-blue-800/30 to-blue-500/10"
            data-testid={`hero-gradient-overlay-${pagePath.replace(/\//g, "-") || "home"}`}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4">
        <div
          className={cn(
            "max-w-4xl mx-auto flex flex-col gap-4",
            alignmentClasses[textAlignment as keyof typeof alignmentClasses] ||
              alignmentClasses.center
          )}
        >
          {title && (
            <h1
              className="text-white font-bold"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "3rem",
                lineHeight: "1.2",
              }}
              data-testid={`hero-title-${pagePath.replace(/\//g, "-") || "home"}`}
            >
              {title}
            </h1>
          )}
          
          {subtitle && (
            <h2
              className="text-xl md:text-2xl text-white/95 font-medium"
              style={{
                fontFamily: "var(--font-body)",
              }}
              data-testid={`hero-subtitle-${pagePath.replace(/\//g, "-") || "home"}`}
            >
              {subtitle}
            </h2>
          )}
          
          {description && (
            <p
              className="text-lg md:text-xl text-white/90 max-w-2xl"
              style={{
                fontFamily: "var(--font-body)",
                lineHeight: "1.6",
              }}
              data-testid={`hero-description-${pagePath.replace(/\//g, "-") || "home"}`}
            >
              {description}
            </p>
          )}

          {ctaText && ctaLink && (
            <div className="mt-6">
              <Link href={ctaLink}>
                <Button
                  size="lg"
                  className="gap-2 px-8 py-6 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  style={{
                    backgroundColor: "var(--bright-blue)",
                    borderRadius: "16px",
                  }}
                  data-testid={`hero-cta-${pagePath.replace(/\//g, "-") || "home"}`}
                >
                  {ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}