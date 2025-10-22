import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import type { PageContentSection } from "@shared/schema";

interface PricingRangeEstimatorProps {
  section: PageContentSection;
}

export default function PricingRangeEstimator({ section }: PricingRangeEstimatorProps) {
  const { openScheduleTour } = useScheduleTour();
  const [unitType, setUnitType] = useState("studio");
  const [careLevel, setCareLevel] = useState([2]);

  // Default base rates - used as fallback when content doesn't provide them
  const defaultBaseRates = {
    studio: 4500,
    "one-bedroom": 5200,
    "two-bedroom": 6000,
  };

  // Default care level multipliers - used as fallback when content doesn't provide them
  const defaultCareLevelMultipliers = [1.0, 1.1, 1.25, 1.4, 1.6];

  // Merge content-provided values with defaults (defensive programming)
  const baseRates = {
    ...defaultBaseRates,
    ...((section.content as any)?.baseRates || {}),
  };

  // Pad care level multipliers array to ensure we have 5 entries
  const contentMultipliers = (section.content as any)?.careLevelMultipliers;
  const careLevelMultipliers = Array.isArray(contentMultipliers)
    ? [...contentMultipliers, ...defaultCareLevelMultipliers].slice(0, 5)
    : defaultCareLevelMultipliers;

  const careLevelLabels = ["Minimal", "Low", "Moderate", "High", "Intensive"];

  // Calculate estimated cost with runtime guards to prevent NaN
  const baseRate = baseRates[unitType as keyof typeof baseRates] || defaultBaseRates.studio;
  const multiplier = careLevelMultipliers[careLevel[0]] || 1.0;
  const estimatedCost = Math.round(baseRate * multiplier);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {section.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-3" data-testid={`${section.sectionKey}-title`}>
            {section.title}
          </h2>
        )}
        {section.subtitle && (
          <p className="text-lg text-muted-foreground text-center mb-10" data-testid={`${section.sectionKey}-subtitle`}>
            {section.subtitle}
          </p>
        )}

        <Card className="shadow-xl">
          <CardContent className="p-8">
            <div className="space-y-8">
              <div>
                <Label className="text-base font-semibold mb-4 block">Unit Type</Label>
                <RadioGroup value={unitType} onValueChange={setUnitType}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="studio" id="studio" data-testid={`${section.sectionKey}-unit-studio`} />
                      <Label htmlFor="studio" className="cursor-pointer flex-1">
                        <div className="font-medium">Studio</div>
                        <div className="text-sm text-muted-foreground">~400-500 sq ft</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="one-bedroom" id="one-bedroom" data-testid={`${section.sectionKey}-unit-one-bedroom`} />
                      <Label htmlFor="one-bedroom" className="cursor-pointer flex-1">
                        <div className="font-medium">1 Bedroom</div>
                        <div className="text-sm text-muted-foreground">~550-700 sq ft</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="two-bedroom" id="two-bedroom" data-testid={`${section.sectionKey}-unit-two-bedroom`} />
                      <Label htmlFor="two-bedroom" className="cursor-pointer flex-1">
                        <div className="font-medium">2 Bedroom</div>
                        <div className="text-sm text-muted-foreground">~800-1000 sq ft</div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">
                  Care Level Needed: <span className="text-primary">{careLevelLabels[careLevel[0]]}</span>
                </Label>
                <Slider
                  value={careLevel}
                  onValueChange={setCareLevel}
                  max={4}
                  step={1}
                  className="mb-2"
                  data-testid={`${section.sectionKey}-care-slider`}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Minimal</span>
                  <span>Moderate</span>
                  <span>Intensive</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-blue-100 rounded-xl p-8 text-center">
                <div className="text-sm text-muted-foreground mb-2">Estimated Monthly Cost</div>
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-1" data-testid={`${section.sectionKey}-estimate`}>
                  ${estimatedCost.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mt-3">
                  * This is an estimate. Actual pricing varies by community and individual needs.
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full talkfurther-schedule-tour"
                  onClick={() => openScheduleTour()}
                  data-testid={`${section.sectionKey}-button-quote`}
                >
                  Get Your Personalized Quote
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Speak with our team for accurate pricing based on your specific needs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
