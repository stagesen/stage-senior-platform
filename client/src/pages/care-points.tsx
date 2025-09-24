import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  HeartHandshake,
  Lightbulb,
  Phone,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const heroHighlights = [
  "Personalize support to match your loved one's evolving needs",
  "Budget confidently with transparent, easy-to-understand pricing",
  "Adjust month-to-month without worrying about hidden fees",
];

const carePointBenefits = [
  {
    title: "Personalized care mix",
    description:
      "Care points translate daily living support, medication management, and specialized services into one flexible plan.",
  },
  {
    title: "True month-to-month flexibility",
    description:
      "Increase or decrease services as needs change—your monthly investment adjusts automatically without penalties.",
  },
  {
    title: "Coordinated expertise",
    description:
      "Care teams use points to align nursing, lifestyle, and hospitality services so every visit delivers meaningful value.",
  },
];

const carePointScenarios = [
  {
    title: "Just the right start",
    points: "125 Care Points",
    badge: "Independent Living +",
    accent: "bg-emerald-50 border-emerald-200",
    description:
      "Perfect for residents who primarily need standby support and medication reminders to stay on track each day.",
    services: [
      "Morning and evening check-ins",
      "Weekly medication set-up",
      "Help getting to favorite programs",
    ],
    investment: "$1,050 / month",
  },
  {
    title: "Everyday confidence",
    points: "215 Care Points",
    badge: "Most Popular",
    accent: "bg-amber-50 border-amber-200",
    description:
      "Designed for residents who benefit from hands-on assistance with daily routines and health coordination.",
    services: [
      "Daily bathing & dressing support",
      "Mealtime reminders & escorting",
      "Nurse coordination with physicians",
    ],
    investment: "$1,720 / month",
  },
  {
    title: "All-around support",
    points: "320 Care Points",
    badge: "Memory Care",
    accent: "bg-sky-50 border-sky-200",
    description:
      "Comprehensive plan that combines dementia expertise, mobility care, and social engagement every single day.",
    services: [
      "Two-person transfers & mobility care",
      "Specialized dementia programming",
      "Family communication every week",
    ],
    investment: "$2,560 / month",
  },
];

const nickelAndDimeSteps = [
  {
    title: "Transparent discovery",
    description:
      "We map real daily routines and collaborate with families so your first care plan reflects what matters most.",
    icon: <Lightbulb className="w-5 h-5" />,
  },
  {
    title: "Collaborative adjustments",
    description:
      "Monthly wellness reviews keep everyone aligned—care points shift up or down only when support actually changes.",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "One simple invoice",
    description:
      "Hospitality, programming, and care are rolled into a single statement so surprises never show up on your bill.",
    icon: <CircleDollarSign className="w-5 h-5" />,
  },
];

const faqs = [
  {
    question: "How do care points relate to actual services?",
    answer:
      "Every service—like medication administration, mobility assistance, or cognitive support—is assigned a care point value based on time and expertise. Your monthly total reflects only the services you receive.",
  },
  {
    question: "What if my loved one's needs change mid-month?",
    answer:
      "Simply talk with our care team. We can add short-term support right away and true-up points on your next statement so you always pay for the actual care delivered.",
  },
  {
    question: "Is there a long-term contract?",
    answer:
      "Never. Care points operate month-to-month, giving you the flexibility to increase or decrease support at any time without enrollment fees or penalties.",
  },
  {
    question: "Can families track care point usage?",
    answer:
      "Yes. Families receive a clear breakdown of services and points, plus ongoing check-ins with our wellness director to review progress and future recommendations.",
  },
];

const testimonials = [
  {
    quote:
      "The care point system helped us plan confidently. When Dad needed more help after a hospital stay, Stage adjusted services immediately and the billing stayed crystal clear.",
    author: "Karen L.",
    role: "Daughter of Stage Senior resident",
  },
  {
    quote:
      "We appreciate seeing exactly how support translates into points. It gives our family peace of mind that Mom is receiving the right level of care and nothing extra.",
    author: "Samuel R.",
    role: "Family partner",
  },
];

export default function CarePoints() {
  useEffect(() => {
    document.title = "Care Points | Stage Senior";

    const description =
      "Discover how Stage Senior's Care Points deliver flexible, personalized support that matches your loved one's needs without hidden fees.";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="bg-background">
      <div className="bg-muted/40 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Care Points</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="inline-flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                Flexible senior care pricing
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Only pay for the care your loved one needs—nothing more
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Care Points make it effortless to match personalized support with transparent pricing. Build a care plan that grows with your loved one and keeps your family in control.
              </p>
              <ul className="grid gap-3">
                {heroHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-muted-foreground">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button size="lg" asChild>
                  <Link href="/communities">
                    Explore communities
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+1-303-436-2300">
                    <Phone className="mr-2 h-5 w-5" />
                    Talk with a care expert
                  </a>
                </Button>
              </div>
            </div>

            <Card className="border-emerald-100 shadow-xl shadow-primary/10">
              <CardHeader className="space-y-1">
                <Badge className="w-fit" variant="outline">
                  Snapshot in real numbers
                </Badge>
                <CardTitle className="text-2xl font-semibold">
                  A transparent month with Care Points
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track the support your loved one receives in a single, easy-to-read view.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <BarChart3 className="h-4 w-4 text-primary" /> Daily living support
                    </div>
                    <span className="text-sm font-semibold">65 pts</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <span className="block h-full w-[45%] rounded-full bg-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <HeartHandshake className="h-4 w-4 text-emerald-500" /> Medication & wellness
                    </div>
                    <span className="text-sm font-semibold">45 pts</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <span className="block h-full w-[30%] rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Users className="h-4 w-4 text-sky-500" /> Social connection
                    </div>
                    <span className="text-sm font-semibold">30 pts</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <span className="block h-full w-[20%] rounded-full bg-sky-500" />
                  </div>
                </div>

                <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wide">Monthly total</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-foreground">$1,720</p>
                      <p className="text-sm text-muted-foreground">Covering 215 Care Points</p>
                    </div>
                    <div className="flex flex-col items-end text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" /> No hidden fees
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" /> Adjust anytime
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-[1.05fr,0.95fr] items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What are Care Points?
            </h2>
            <p className="text-lg text-muted-foreground">
              Care Points are Stage Senior's transparent way to bundle individualized support. Instead of rigid levels of care, we translate every service into flexible points so you always know what you're receiving and why.
            </p>
            <div className="space-y-4">
              {carePointBenefits.map((benefit) => (
                <div key={benefit.title} className="rounded-xl border border-border/60 bg-card/80 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild size="lg" variant="outline" className="mt-2">
              <Link href="/stage-cares">
                Explore the Stage Cares philosophy
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <Card className="overflow-hidden border-none shadow-2xl shadow-primary/20">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=900&auto=format&fit=crop"
              alt="Caregiver smiling with senior resident"
              className="h-72 w-full object-cover"
            />
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Star className="h-4 w-4" /> Families rate transparency 4.9/5
              </div>
              <p className="text-muted-foreground">
                "From the first assessment, we felt involved and informed. The care team translated everything into Care Points, so there were zero surprises when we reviewed the plan."
              </p>
              <p className="text-sm font-medium text-foreground">— Stage Senior family partner</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted/30 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">What monthly care looks like</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Simple, real examples of Care Points in action
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              These sample plans show how support scales without complicated pricing tiers. Every point connects to hands-on assistance your loved one receives.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {carePointScenarios.map((scenario) => (
              <div
                key={scenario.title}
                className={`relative flex h-full flex-col gap-5 rounded-3xl border p-6 shadow-lg ${scenario.accent}`}
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="uppercase tracking-wide text-xs">
                    {scenario.badge}
                  </Badge>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {scenario.points}
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-foreground">{scenario.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{scenario.description}</p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {scenario.services.map((service) => (
                    <li key={service} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto rounded-2xl bg-background/70 p-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Estimated monthly investment</p>
                  <p className="text-2xl font-bold text-foreground">{scenario.investment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr,1fr] items-start">
            <div className="space-y-6">
              <Badge variant="outline" className="w-fit">No nickel-and-diming</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Straightforward pricing that respects families
              </h2>
              <p className="text-lg text-muted-foreground">
                We believe peace of mind starts with clarity. Our Care Point process keeps costs predictable and conversations collaborative.
              </p>
              <div className="space-y-5">
                {nickelAndDimeSteps.map((step) => (
                  <div key={step.title} className="flex gap-4 rounded-xl border border-border/60 bg-card/80 p-5 shadow-sm">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="border-none bg-primary text-primary-foreground shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">Your personal care navigator</CardTitle>
                <p className="text-sm text-primary-foreground/90">
                  Every Stage Senior community has a dedicated team member to help you review care point usage, plan ahead, and adjust services any time.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-primary-foreground/10 p-4 text-sm">
                  <p className="font-semibold">Included in every community:</p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4" />
                      <span>Monthly wellness touchpoints with our nurse team</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <PiggyBank className="mt-0.5 h-4 w-4" />
                      <span>Clear statements that outline services line-by-line</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HeartHandshake className="mt-0.5 h-4 w-4" />
                      <span>Family collaboration with updates the way you prefer</span>
                    </li>
                  </ul>
                </div>
                <Button size="lg" variant="secondary" asChild className="w-full">
                  <a href="tel:+1-303-436-2300">Schedule a care conversation</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-muted/20 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Care Points FAQs</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Have questions? Families often ask us these when exploring the Stage Senior approach to personalized pricing.
            </p>
          </div>
          <div className="mt-10">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border border-border rounded-xl bg-background">
                  <AccordionTrigger className="px-6 text-left text-lg font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.quote} className="h-full border border-primary/20 bg-card/90 shadow-lg">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3 text-primary">
                    <Star className="h-5 w-5" />
                    <p className="text-sm font-semibold uppercase tracking-wide">
                      Families love the clarity
                    </p>
                  </div>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    “{testimonial.quote}”
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-primary/30 bg-background/80 p-10 shadow-2xl backdrop-blur">
            <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] items-center">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Ready to personalize care with confidence?
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Our team will walk you through a complimentary assessment and show exactly how Care Points create the right-fit plan for your loved one.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link href="/communities">Tour a Stage Senior community</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="tel:+1-303-436-2300">Call 303-436-2300</a>
                  </Button>
                </div>
              </div>
              <Card className="border-none bg-primary text-primary-foreground shadow-xl">
                <CardContent className="space-y-3 p-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5" />
                    <p className="text-sm font-semibold uppercase tracking-wide">
                      Complimentary care assessment
                    </p>
                  </div>
                  <p className="text-sm text-primary-foreground/80">
                    Share your loved one's story, routines, and goals. We'll build a sample Care Point plan so you can see the value before making any decisions.
                  </p>
                  <Button variant="secondary" size="lg" asChild className="w-full">
                    <a href="tel:+1-303-436-2300">Connect with us</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

