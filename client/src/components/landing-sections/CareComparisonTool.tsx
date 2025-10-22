import { CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import type { PageContentSection } from "@shared/schema";

interface CareComparisonToolProps {
  section: PageContentSection;
  currentCareType?: string;
}

export default function CareComparisonTool({ section, currentCareType }: CareComparisonToolProps) {
  const careLevels = [
    {
      type: "independent-living",
      name: "Independent Living",
      description: "For active seniors who want community, amenities, and maintenance-free living",
      features: [
        "Full independence with daily activities",
        "Social activities and programs",
        "Housekeeping and maintenance",
        "Dining services available",
        "No medical care needed",
      ],
      notIncluded: [
        "Personal care assistance",
        "Medication management",
        "Memory care support",
      ],
    },
    {
      type: "assisted-living",
      name: "Assisted Living",
      description: "For seniors who need help with daily activities while maintaining independence",
      features: [
        "Assistance with bathing, dressing, grooming",
        "Medication management",
        "24/7 staff support",
        "Social activities and programs",
        "Housekeeping and laundry",
        "Chef-prepared meals",
      ],
      notIncluded: [
        "Advanced medical care",
        "Intensive memory care",
      ],
    },
    {
      type: "memory-care",
      name: "Memory Care",
      description: "Specialized care for seniors with Alzheimer's, dementia, or memory loss",
      features: [
        "Secure, monitored environment",
        "Specialized dementia training",
        "Memory-focused activities",
        "24/7 supervision",
        "Assistance with all daily activities",
        "Medication management",
        "Family support resources",
      ],
      notIncluded: [
        "Full medical/nursing care",
      ],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {section.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-3" data-testid={`${section.sectionKey}-title`}>
            {section.title}
          </h2>
        )}
        {section.subtitle && (
          <p className="text-lg text-muted-foreground text-center mb-12" data-testid={`${section.sectionKey}-subtitle`}>
            {section.subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careLevels.map((level) => {
            const isCurrentLevel = currentCareType === level.type;
            
            return (
              <Card
                key={level.type}
                className={`relative ${
                  isCurrentLevel
                    ? "border-2 border-primary shadow-xl scale-105"
                    : "border border-gray-200 shadow-md hover:shadow-lg"
                } transition-all duration-300`}
                data-testid={`${section.sectionKey}-card-${level.type}`}
              >
                {isCurrentLevel && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    You're viewing this level
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {level.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {level.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {level.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {level.notIncluded.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">Not Included:</h4>
                      <ul className="space-y-2">
                        {level.notIncluded.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Circle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!isCurrentLevel && (
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                      data-testid={`${section.sectionKey}-button-${level.type}`}
                    >
                      <Link href={`/${level.type}/littleton`}>
                        Explore {level.name}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still unsure which level is right? Our team can help you determine the best fit.
          </p>
          <Button size="lg" asChild data-testid={`${section.sectionKey}-button-contact`}>
            <Link href="/contact">
              Speak with Our Care Team
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
