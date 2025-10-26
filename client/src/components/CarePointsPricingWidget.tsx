import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Home, Bed, DollarSign, TrendingDown } from "lucide-react";
import { useScheduleTour } from "@/hooks/useScheduleTour";

export default function CarePointsPricingWidget() {
  const { openScheduleTour } = useScheduleTour();
  const [selectedCareType, setSelectedCareType] = useState<"assisted-living" | "memory-care">("assisted-living");
  const [selectedSuiteType, setSelectedSuiteType] = useState<"private" | "one-bedroom" | "two-bedroom">("private");

  const baseRents = {
    "assisted-living": {
      private: 5770,
      "one-bedroom": 7000,
      "two-bedroom": 8640
    },
    "memory-care": {
      private: 8800,
      "one-bedroom": 9450,
      "two-bedroom": 9900
    }
  };

  const careExamples = [
    {
      title: "Light Support",
      subtitle: "A little help, most days",
      points: 33,
      isRecommended: false,
      services: [
        "Bathing / showering — standby assistance (1–2×/week)",
        "Dressing — buttons, zippers, compression stockings"
      ],
      tierComparison: 'Typical "Level 1" at other communities: $1,000+/mo'
    },
    {
      title: "Moderate Support",
      subtitle: "Hands-on help with morning routine",
      points: 80,
      isRecommended: true,
      services: [
        "Hands-on dressing assistance",
        "Bathing setup & safety supervision",
        "Escorts to meals & activities"
      ]
    },
    {
      title: "Enhanced Support",
      subtitle: "Daily help plus continence & transfers",
      points: 120,
      isRecommended: false,
      services: [
        "Bathing + dressing (hands-on)",
        "Incontinence care support",
        "Assistance with transfers"
      ]
    },
    {
      title: "Comprehensive Support",
      subtitle: "Full-coverage help, day and night",
      points: 160,
      isRecommended: false,
      services: [
        "Incontinence care + transfer assistance",
        "Night safety checks",
        "Memory cues & behavioral redirection"
      ]
    }
  ];

  const getCareTypeLabel = (type: string) => {
    if (type === "assisted-living") return "Assisted Living";
    if (type === "memory-care") return "Memory Care";
    return type;
  };

  const getSuiteTypeLabel = (type: string) => {
    if (type === "private") return "Private";
    if (type === "one-bedroom") return "1 Bedroom";
    if (type === "two-bedroom") return "2 Bedroom";
    return type;
  };

  const calculateTotal = (points: number) => {
    const careAmount = points * 20;
    const baseRent = baseRents[selectedCareType][selectedSuiteType];
    return {
      careAmount,
      baseRent,
      total: careAmount + baseRent
    };
  };

  const currentBaseRent = baseRents[selectedCareType][selectedSuiteType];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white" data-testid="care-points-pricing-widget">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="pricing-examples-title">
            Transparent Pricing—Real Examples
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your care type and suite size to see how Care Points pricing works in real scenarios
          </p>
        </div>

        {/* Selection Panel */}
        <Card className="mb-10 shadow-lg border-2 border-primary/20">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Care Type Selection */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Home className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Care Type</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={selectedCareType === "assisted-living" ? "default" : "outline"}
                    onClick={() => setSelectedCareType("assisted-living")}
                    className="justify-start h-auto py-3"
                    data-testid="button-assisted-living"
                  >
                    <div className="text-left">
                      <div className="font-semibold">Assisted Living</div>
                      <div className="text-xs opacity-80">Help with daily activities</div>
                    </div>
                  </Button>
                  <Button
                    variant={selectedCareType === "memory-care" ? "default" : "outline"}
                    onClick={() => setSelectedCareType("memory-care")}
                    className="justify-start h-auto py-3"
                    data-testid="button-memory-care"
                  >
                    <div className="text-left">
                      <div className="font-semibold">Memory Care</div>
                      <div className="text-xs opacity-80">Specialized dementia support</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Suite Type Selection */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bed className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Suite Size</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { value: "private", label: "Private Suite", size: "~400-500 sq ft" },
                    { value: "one-bedroom", label: "1 Bedroom", size: "~550-700 sq ft" },
                    { value: "two-bedroom", label: "2 Bedroom", size: "~800-1000 sq ft" }
                  ].map((suite) => (
                    <Button
                      key={suite.value}
                      variant={selectedSuiteType === suite.value ? "default" : "outline"}
                      onClick={() => setSelectedSuiteType(suite.value as any)}
                      className="justify-start h-auto py-3"
                      data-testid={`button-${suite.value}-suite`}
                    >
                      <div className="text-left">
                        <div className="font-semibold">{suite.label}</div>
                        <div className="text-xs opacity-80">{suite.size}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Current Selection Summary */}
              <div className="bg-primary/5 rounded-lg p-6 border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Your Base Rent</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Selected:</div>
                    <div className="font-medium text-foreground">
                      {getCareTypeLabel(selectedCareType)}, {getSuiteTypeLabel(selectedSuiteType)} Suite
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="text-sm text-muted-foreground mb-1">Monthly Base Rent:</div>
                    <div className="text-3xl font-bold text-primary">
                      ${currentBaseRent.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      + Care Points based on needs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Examples - Accordion Format */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-center text-foreground mb-3">
            Example Care Scenarios
          </h3>
          <p className="text-center text-muted-foreground mb-8">
            See how different levels of care translate to monthly costs with your selections
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4 max-w-4xl mx-auto">
          {careExamples.map((example, index) => {
            const pricing = calculateTotal(example.points);
            return (
              <AccordionItem 
                key={index} 
                value={`example-${index}`}
                className={`bg-white border rounded-lg px-6 ${example.isRecommended ? 'border-2 border-primary' : ''}`}
                data-testid={`care-example-${index}`}
              >
                <AccordionTrigger 
                  className="hover:no-underline"
                  data-testid={`button-care-example-${index}`}
                >
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold" data-testid={`example-title-${index}`}>
                          {example.title}
                        </span>
                        {example.isRecommended && (
                          <Badge variant="default" className="bg-green-600">Most Common</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground italic" data-testid={`example-subtitle-${index}`}>
                        "{example.subtitle}"
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-base px-3 py-1.5" data-testid={`example-points-${index}`}>
                        {example.points} pts
                      </Badge>
                      <span className="text-xl font-bold text-primary" data-testid={`example-total-${index}`}>
                        ${pricing.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2">
                  <div className="space-y-4">
                    {/* Services */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        Included Services
                      </div>
                      <ul className="space-y-2">
                        {example.services.map((service, serviceIndex) => (
                          <li key={serviceIndex} className="flex items-start gap-2" data-testid={`example-service-${index}-${serviceIndex}`}>
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Value Comparison */}
                    {example.tierComparison && (
                      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <TrendingDown className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-900">
                          <strong>Savings:</strong> {example.tierComparison}
                        </p>
                      </div>
                    )}

                    {/* Pricing Breakdown */}
                    <div className="pt-4 border-t-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base Rent</span>
                        <span className="font-semibold">${pricing.baseRent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Care Points ({example.points} × $20)</span>
                        <span className="font-semibold">${pricing.careAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold pt-3 border-t-2">
                        <span>Monthly Total</span>
                        <span className="text-primary">
                          ${pricing.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Get Your Personalized Quote
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Every resident is unique. Schedule a tour to discuss your specific needs and get an exact monthly rate with no hidden fees.
            </p>
            <Button 
              size="lg" 
              onClick={() => openScheduleTour()}
              className="text-lg px-8 py-6"
              data-testid="button-schedule-tour"
            >
              Schedule Your Free Tour
            </Button>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-900 text-center">
            <strong>Note:</strong> Figures shown are examples for illustration purposes. Actual costs may vary and are confirmed after a professional care assessment. All pricing is month-to-month with no long-term contracts.
          </p>
        </div>
      </div>
    </section>
  );
}
