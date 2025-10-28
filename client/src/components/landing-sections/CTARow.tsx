import { Calendar, DollarSign, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import type { PageContentSection } from "@shared/schema";

interface CTARowProps {
  section: PageContentSection;
}

export default function CTARow({ section }: CTARowProps) {
  const { openScheduleTour } = useScheduleTour();
  const content = section.content as any;

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-y border-blue-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          {section.title && (
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3" data-testid={`${section.sectionKey}-title`}>
              {section.title}
            </h2>
          )}
          {section.subtitle && (
            <p className="text-lg text-muted-foreground" data-testid={`${section.sectionKey}-subtitle`}>
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-4 max-w-4xl mx-auto justify-center">
          <Button
            size="lg"
            className="w-full sm:min-w-[200px] sm:flex-1 lg:flex-[1_1_0%] bg-primary hover:bg-primary/90 text-white font-semibold talkfurther-schedule-tour"
            onClick={() => openScheduleTour()}
            data-testid={`${section.sectionKey}-button-schedule`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule a Tour
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full sm:min-w-[240px] sm:flex-1 lg:flex-[1_1_0%] border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold whitespace-nowrap"
            asChild
            data-testid={`${section.sectionKey}-button-call`}
          >
            <a href="tel:+17202184663" className="flex items-center justify-center">
              <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>(720) 218-4663</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
