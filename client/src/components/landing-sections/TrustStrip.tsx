import { Home, Shield, Calendar, CheckCircle } from "lucide-react";
import type { PageContentSection } from "@shared/schema";

const iconMap: Record<string, any> = {
  home: Home,
  shield: Shield,
  calendar: Calendar,
  check: CheckCircle,
};

interface TrustStripProps {
  section: PageContentSection;
}

export default function TrustStrip({ section }: TrustStripProps) {
  const content = section.content as any;
  const badges = content.badges || [];

  return (
    <section className="py-8 bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {section.title && (
          <h3 className="text-center text-lg font-semibold text-foreground mb-6" data-testid={`${section.sectionKey}-title`}>
            {section.title}
          </h3>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge: any, index: number) => {
            const IconComponent = badge.icon ? iconMap[badge.icon] : Shield;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-2"
                data-testid={`${section.sectionKey}-badge-${index}`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <IconComponent className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {badge.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
