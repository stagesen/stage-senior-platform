import { 
  Clock, Shield, Calendar, Heart, Users, FileText, ClipboardCheck, 
  TrendingUp, Building2, BarChart3, Briefcase, CheckCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import type { PageContentSection } from "@shared/schema";

const iconMap: Record<string, any> = {
  Clock,
  Shield,
  Calendar,
  Heart,
  Users,
  FileText,
  ClipboardCheck,
  TrendingUp,
  Building2,
  BarChart3,
  Briefcase,
  CheckCircle,
};

interface PageSectionRendererProps {
  section: PageContentSection;
}

export default function PageSectionRenderer({ section }: PageSectionRendererProps) {
  const content = section.content as any;
  const { openScheduleTour } = useScheduleTour();
  
  // Resolve image URLs (converts UUIDs to actual URLs)
  const heroImageUrl = useResolveImageUrl(content.imageId || content.imageUrl);

  // Text Block
  if (section.sectionType === "text_block") {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content.text || "" }}
            data-testid={`section-${section.sectionKey}`}
          />
        </div>
      </section>
    );
  }

  // Hero Section (with image on right, supports buttons and alternating layout)
  if (section.sectionType === "hero_section") {
    // Check if this should alternate (based on sort order being even/odd)
    const shouldAlternate = (section.sortOrder || 0) % 2 === 0;
    
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className={shouldAlternate ? 'lg:order-2' : ''}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid={`${section.sectionKey}-title`}>
                {content.heading}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6" data-testid={`${section.sectionKey}-description`}>
                {content.description}
              </p>
              {content.buttonText && content.buttonLink && (
                <Button
                  size="lg"
                  asChild
                  className="group"
                  data-testid={`${section.sectionKey}-button`}
                >
                  <Link href={content.buttonLink}>
                    {content.buttonText}
                  </Link>
                </Button>
              )}
            </div>
            
            {/* Image */}
            <div className={shouldAlternate ? 'lg:order-1' : ''}>
              {heroImageUrl ? (
                <div className="relative rounded-2xl shadow-xl h-80 lg:h-96 overflow-hidden">
                  <img
                    src={heroImageUrl}
                    alt={content.heading}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl shadow-xl h-80 lg:h-96 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <div className="text-white/20 text-6xl font-bold">{section.sortOrder || 0}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Section Header
  if (section.sectionType === "section_header") {
    return (
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid={`${section.sectionKey}-title`}>
          {content.heading}
        </h2>
        {content.subheading && (
          <p className="text-lg text-muted-foreground" data-testid={`${section.sectionKey}-subtitle`}>
            {content.subheading}
          </p>
        )}
      </div>
    );
  }

  // Benefit Cards
  if (section.sectionType === "benefit_cards") {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {content.cards?.map((card: any, index: number) => {
              const IconComponent = card.icon ? iconMap[card.icon] : null;
              return (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  data-testid={`${section.sectionKey}-card-${index}`}
                >
                  <div className="flex items-start space-x-4">
                    {IconComponent && (
                      <div className="text-primary flex-shrink-0">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      {card.title && <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>}
                      <p className="text-foreground">{card.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Feature List
  if (section.sectionType === "feature_list") {
    return (
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.items?.map((item: any, index: number) => (
              <div 
                key={index}
                className="bg-white px-4 py-3 rounded-lg shadow-sm text-center"
                data-testid={`${section.sectionKey}-item-${index}`}
              >
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Feature Grid
  if (section.sectionType === "feature_grid") {
    const columns = content.columns || 3;
    const gridClass = columns === 2 ? "md:grid-cols-2" : columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4";
    // Support both 'features' (correct) and 'items' (legacy) for backward compatibility
    const features = content.features || content.items || [];
    
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
            {features.map((feature: any, index: number) => {
              const IconComponent = feature.icon ? iconMap[feature.icon] : null;
              return (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  data-testid={`${section.sectionKey}-feature-${index}`}
                >
                  {IconComponent && (
                    <div className="text-primary mb-4">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Call to Action
  if (section.sectionType === "cta") {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" data-testid={`${section.sectionKey}-title`}>
              {content.heading}
            </h2>
            {content.description && (
              <div className="space-y-6 text-lg text-white/95 leading-relaxed">
                <p data-testid={`${section.sectionKey}-description`}>{content.description}</p>
              </div>
            )}
            {content.buttonText && content.buttonLink && (
              <div className="mt-8 text-center">
                {content.buttonLink === "#schedule-tour" ? (
                  <Button
                    size="lg"
                    className="bg-white hover:bg-gray-100 text-purple-600 hover:text-purple-700 font-semibold"
                    onClick={() => openScheduleTour()}
                    data-testid={`${section.sectionKey}-button`}
                  >
                    {content.buttonText}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="bg-white hover:bg-gray-100 text-purple-600 hover:text-purple-700 font-semibold"
                    asChild
                    data-testid={`${section.sectionKey}-button`}
                  >
                    <Link href={content.buttonLink}>
                      {content.buttonText}
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return null;
}
