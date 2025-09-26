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
  const overlayOpacity = hero?.overlayOpacity || 0.5;
  const textAlignment = hero?.textAlignment || "center";
  const isActive = hero?.active !== false; // Default to true if no hero or not specified
  
  // Resolve background image URL
  const backgroundImage = useResolveImageUrl(backgroundImageRaw) || backgroundImageRaw;

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
      {/* Background Image */}
      {backgroundImage && (
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
          {/* Overlay */}
          <div
            className="absolute inset-0 z-10 bg-black"
            style={{ opacity: overlayOpacity }}
            data-testid={`hero-overlay-${pagePath.replace(/\//g, "-") || "home"}`}
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
              className="text-5xl md:text-6xl font-bold text-white"
              data-testid={`hero-title-${pagePath.replace(/\//g, "-") || "home"}`}
            >
              {title}
            </h1>
          )}
          
          {subtitle && (
            <h2
              className="text-2xl md:text-3xl text-white/90"
              data-testid={`hero-subtitle-${pagePath.replace(/\//g, "-") || "home"}`}
            >
              {subtitle}
            </h2>
          )}
          
          {description && (
            <p
              className="text-lg md:text-xl text-white/80 max-w-2xl"
              data-testid={`hero-description-${pagePath.replace(/\//g, "-") || "home"}`}
            >
              {description}
            </p>
          )}

          {ctaText && ctaLink && (
            <div className="mt-4">
              <Link href={ctaLink}>
                <Button
                  size="lg"
                  className="gap-2"
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