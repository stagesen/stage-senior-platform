import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export default function CarePointsPricingWidget() {
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
      services: [
        "Bathing / showering — standby / safety supervision (1–2×/week) (~30 pts)",
        "Dressing — buttons, zippers, compression stockings (~3 pts)"
      ],
      tierComparison: 'Many communities: billed as "Level 1" / "service tier," often $1,000+/mo.'
    },
    {
      title: "Moderate Support",
      subtitle: "Hands-on help with the morning routine",
      points: 80,
      services: [
        "Hands-on dressing",
        "Bathing setup & safety",
        "Escorts to meals/activities"
      ]
    },
    {
      title: "Enhanced Support",
      subtitle: "Daily help plus continence & transfers",
      points: 120,
      services: [
        "Bathing + dressing (hands-on)",
        "Incontinence care",
        "Assistance with transfers"
      ]
    },
    {
      title: "Comprehensive Support",
      subtitle: "Full-coverage help, day and night",
      points: 160,
      services: [
        "Incontinence care + transfers",
        "Night safety checks",
        "Memory cues & redirection"
      ]
    }
  ];

  const getCareTypeLabel = (type: string) => {
    if (type === "assisted-living") return "Assisted Living";
    if (type === "memory-care") return "Memory Care";
    return type;
  };

  const getSuiteTypeLabel = (type: string) => {
    if (type === "private") return "Private Suite";
    if (type === "one-bedroom") return "One Bedroom Suite";
    if (type === "two-bedroom") return "Two Bedroom Suite";
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

  return (
    <section className="py-16 bg-white" data-testid="care-points-pricing-widget">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4" data-testid="pricing-examples-title">
          What monthly care looks like—simple, real examples
        </h2>
        <p className="text-center text-muted-foreground mb-12">Select your care type and suite to see pricing</p>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Care Type</h3>
          <div className="flex gap-4 flex-wrap">
            <Button
              variant={selectedCareType === "assisted-living" ? "default" : "outline"}
              onClick={() => setSelectedCareType("assisted-living")}
              data-testid="button-assisted-living"
            >
              Assisted Living
            </Button>
            <Button
              variant={selectedCareType === "memory-care" ? "default" : "outline"}
              onClick={() => setSelectedCareType("memory-care")}
              data-testid="button-memory-care"
            >
              Memory Care
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Suite Type</h3>
          <div className="flex gap-4 flex-wrap">
            <Button
              variant={selectedSuiteType === "private" ? "default" : "outline"}
              onClick={() => setSelectedSuiteType("private")}
              data-testid="button-private-suite"
            >
              Private Suite
            </Button>
            <Button
              variant={selectedSuiteType === "one-bedroom" ? "default" : "outline"}
              onClick={() => setSelectedSuiteType("one-bedroom")}
              data-testid="button-one-bedroom-suite"
            >
              One Bedroom Suite
            </Button>
            <Button
              variant={selectedSuiteType === "two-bedroom" ? "default" : "outline"}
              onClick={() => setSelectedSuiteType("two-bedroom")}
              data-testid="button-two-bedroom-suite"
            >
              Two Bedroom Suite
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Base Rent ({getCareTypeLabel(selectedCareType)}, {getSuiteTypeLabel(selectedSuiteType)}): ${baseRents[selectedCareType][selectedSuiteType].toLocaleString()} / month
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careExamples.map((example, index) => {
            const pricing = calculateTotal(example.points);
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`care-example-${index}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-xl mb-1" data-testid={`example-title-${index}`}>
                        {example.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground italic" data-testid={`example-subtitle-${index}`}>
                        "{example.subtitle}"
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1" data-testid={`example-points-${index}`}>
                      ~{example.points} pts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {example.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-start gap-2" data-testid={`example-service-${index}-${serviceIndex}`}>
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <span className="text-sm text-muted-foreground">{service}</span>
                      </li>
                    ))}
                  </ul>

                  {example.tierComparison && (
                    <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded" data-testid={`example-comparison-${index}`}>
                      {example.tierComparison}
                    </p>
                  )}

                  <div className="pt-4 border-t space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Care (~{example.points} pts × $20)</span>
                      <span className="font-semibold">${pricing.careAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Rent ({getCareTypeLabel(selectedCareType)}, {getSuiteTypeLabel(selectedSuiteType)})</span>
                      <span className="font-semibold">${pricing.baseRent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary" data-testid={`example-total-${index}`}>
                        ${pricing.total.toLocaleString()}/mo
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-900">
            <strong>Figures shown are examples.</strong> Costs may change and are general estimates when published. Your exact plan is confirmed after a professional assessment.
          </p>
        </div>
      </div>
    </section>
  );
}
