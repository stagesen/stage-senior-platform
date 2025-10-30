import { useEffect, useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { PageHero } from "@/components/PageHero";

// Lazy load map component to reduce initial bundle size (~45 KiB savings)
const CommunityMap = lazy(() => import("@/components/CommunityMap"));
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { apiRequest } from "@/lib/queryClient";
import { getPrimaryPhoneDisplay, getPrimaryPhoneHref, getCityState } from "@/lib/communityContact";
import { insertTourRequestSchema, type InsertTourRequest, type Community, type Testimonial } from "@shared/schema";
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  FileText,
  Users,
  Clock,
  Shield,
  ArrowRight,
  Stethoscope,
  ClipboardList,
  Heart,
  Building2,
  AlertCircle,
  Briefcase,
  Star,
  Quote,
  Loader2,
} from "lucide-react";

type FormData = InsertTourRequest & {
  referrerFacility?: string;
  patientName?: string;
};

export default function ForProfessionals() {
  const { companyPhoneDisplay, companyPhoneDial } = useSiteSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.title = "Healthcare Professionals | Referral Partner Program | Stage Senior";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `Partner with Stage Senior for patient placement. Real-time bed availability, clinical acceptance criteria, and streamlined referral process. Call ${companyPhoneDisplay} for immediate placement assistance.`);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = `Partner with Stage Senior for patient placement. Real-time bed availability, clinical acceptance criteria, and streamlined referral process. Call ${companyPhoneDisplay} for immediate placement assistance.`;
      document.head.appendChild(meta);
    }
  }, [companyPhoneDisplay]);

  const { data: communities = [], isLoading: communitiesLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities", { active: true }],
    queryFn: async () => {
      const response = await fetch("/api/communities?active=true");
      if (!response.ok) throw new Error("Failed to fetch communities");
      return response.json();
    },
  });

  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials", { featured: true, approved: true }],
    queryFn: async () => {
      const response = await fetch("/api/testimonials?featured=true&approved=true");
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      return response.json();
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(
      insertTourRequestSchema.extend({
        referrerFacility: insertTourRequestSchema.shape.message,
        patientName: insertTourRequestSchema.shape.message,
      })
    ),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      referrerFacility: "",
      patientName: "",
      honeypot: "",
    },
    mode: "onBlur",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const enrichedMessage = `
Professional Referral
Referrer: ${data.name}
Facility: ${data.referrerFacility || 'Not specified'}
Patient Name: ${data.patientName || 'Not specified'}

Message:
${data.message}
      `.trim();

      return apiRequest("POST", "/api/tour-requests", {
        ...data,
        message: enrichedMessage,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tour-requests"] });
      setIsSuccess(true);
      form.reset();
      toast({
        title: "Referral Submitted Successfully",
        description: "We'll contact you within 2 hours during business hours.",
        duration: 6000,
      });
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: `Please try again or call us directly at ${companyPhoneDisplay}`,
        variant: "destructive",
        duration: 8000,
      });
    },
  });

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  const clinicalCriteria = [
    {
      title: "Assisted Living",
      icon: Heart,
      accepts: [
        "ADL assistance required",
        "Medication management",
        "Diabetes management",
        "Early-stage dementia",
        "Mobility assistance",
        "Post-hospital recovery",
      ],
      limitations: [
        "Advanced wound care requiring RN",
        "IV therapy",
        "Ventilator dependency",
      ],
    },
    {
      title: "Memory Care",
      icon: Shield,
      accepts: [
        "Alzheimer's disease (all stages)",
        "Vascular dementia",
        "Lewy body dementia",
        "Frontotemporal dementia",
        "Wandering behaviors",
        "Sundowning",
      ],
      limitations: [
        "Violent behaviors toward staff/residents",
        "24/7 skilled nursing requirement",
        "Advanced psychiatric disorders",
      ],
    },
    {
      title: "Independent Living",
      icon: Users,
      accepts: [
        "Minimal to no ADL assistance",
        "Self-medication management",
        "Active seniors seeking community",
        "Preventive wellness focus",
      ],
      limitations: [
        "Significant mobility impairment",
        "Daily ADL assistance needed",
        "Complex medical needs",
      ],
    },
  ];

  const placementProcess = [
    {
      step: 1,
      title: "Initial Assessment",
      description: "Quick review of patient needs, medical history, and care requirements",
      icon: ClipboardList,
      duration: "Same day",
    },
    {
      step: 2,
      title: "Bed Availability Check",
      description: "Real-time verification of appropriate bed availability across our communities",
      icon: Building2,
      duration: "Within 2 hours",
    },
    {
      step: 3,
      title: "Move-In Coordination",
      description: "Streamlined intake process with clinical team coordination",
      icon: FileText,
      duration: "24-72 hours",
    },
    {
      step: 4,
      title: "Ongoing Support",
      description: "Regular updates to referring provider and family communication",
      icon: Heart,
      duration: "Continuous",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <PageHero
        pagePath="/for-professionals"
        defaultTitle="Healthcare Professional Referral Program"
        defaultSubtitle="Trusted partner for patient placement in Colorado's premier senior living communities"
        defaultBackgroundImage="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=2000&q=80"
      />

      {/* Quick Action Bar */}
      <section className="bg-gradient-to-r from-[var(--deep-blue)] to-[var(--bright-blue)] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-8 h-8" />
              <div>
                <p className="font-semibold text-lg">24/7 Placement Hotline</p>
                <p className="text-sm text-white/90">Immediate response for urgent placements</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-white text-[var(--deep-blue)] hover:bg-gray-100"
                asChild
                data-testid="button-call-hotline"
              >
                <a href={`tel:${companyPhoneDial}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  {companyPhoneDisplay}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-[var(--deep-blue)]"
                asChild
                data-testid="button-email-referrals"
              >
                <a href="mailto:referrals@stagesenior.com">
                  <Mail className="w-5 h-5 mr-2" />
                  referrals@stagesenior.com
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Healthcare Professionals Choose Stage Senior
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Locally owned and operated since 2016, serving Colorado's Front Range with excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow" data-testid="card-value-prop-1">
              <CardContent className="p-8">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Rapid Response</h3>
                <p className="text-muted-foreground">
                  Same-day assessments and bed availability within 2 hours for urgent placements
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow" data-testid="card-value-prop-2">
              <CardContent className="p-8">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Clinical Excellence</h3>
                <p className="text-muted-foreground">
                  Licensed nurses on staff 24/7, specialized memory care, and comprehensive wellness programs
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow" data-testid="card-value-prop-3">
              <CardContent className="p-8">
                <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Seamless Coordination</h3>
                <p className="text-muted-foreground">
                  Dedicated placement coordinator, streamlined intake, and ongoing communication with referring providers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Real-Time Availability Table */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Real-Time Bed Availability
            </h2>
            <p className="text-lg text-muted-foreground">
              Contact any community directly or call our placement hotline for immediate assistance
            </p>
          </div>

          {communitiesLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden" data-testid="card-availability-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Community</TableHead>
                    <TableHead className="font-bold">Location</TableHead>
                    <TableHead className="font-bold">Care Types</TableHead>
                    <TableHead className="font-bold">Contact</TableHead>
                    <TableHead className="font-bold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communities.map((community) => (
                    <TableRow key={community.id} data-testid={`row-community-${community.slug}`}>
                      <TableCell className="font-semibold">
                        {community.name}
                        {community.featured && (
                          <Badge className="ml-2" variant="secondary">Featured</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                          <div className="text-sm">
                            {getCityState(community)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(community.careTypes || []).slice(0, 2).map((careType, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {careType.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {community.phoneDisplay && (
                            <a
                              href={getPrimaryPhoneHref(community)}
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                              data-testid={`link-phone-${community.slug}`}
                            >
                              <Phone className="w-3 h-3" />
                              {getPrimaryPhoneDisplay(community)}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          data-testid={`button-view-details-${community.slug}`}
                        >
                          <a href={`/communities/${community.slug}`}>
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </section>

      {/* Clinical Acceptance Criteria */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Clinical Acceptance Criteria
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Understanding our care capabilities helps ensure appropriate patient placement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clinicalCriteria.map((criteria, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow" data-testid={`card-criteria-${index}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <criteria.icon className="w-8 h-8 text-primary" />
                    <CardTitle className="text-xl">{criteria.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      We Accept:
                    </h4>
                    <ul className="space-y-2">
                      {criteria.accepts.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Limitations:
                    </h4>
                    <ul className="space-y-2">
                      {criteria.limitations.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Streamlined Placement Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From initial contact to move-in, we make the process efficient and stress-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {placementProcess.map((step, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-shadow" data-testid={`card-process-step-${step.step}`}>
                <CardContent className="p-6">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {step.step}
                  </div>
                  <step.icon className="w-10 h-10 text-primary mb-4 mt-4" />
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {step.duration}
                  </Badge>
                </CardContent>
                {index < placementProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Submit a Referral
            </h2>
            <p className="text-lg text-muted-foreground">
              Complete this form for non-urgent referrals. For immediate placement needs, call (970) 444-4689
            </p>
          </div>

          <Card className="shadow-xl" data-testid="card-referral-form">
            <CardHeader>
              <CardTitle>Professional Referral Information</CardTitle>
              <CardDescription>
                All information is confidential and HIPAA-compliant
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Referral Submitted!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you. We'll review this referral and contact you within 2 business hours.
                  </p>
                  <Button onClick={() => setIsSuccess(false)} data-testid="button-submit-another">
                    Submit Another Referral
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Dr. Jane Smith"
                                data-testid="input-referrer-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="referrerFacility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facility/Practice</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Denver Medical Center"
                                data-testid="input-facility"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                placeholder="(303) 555-0123"
                                data-testid="input-referrer-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="jsmith@hospital.com"
                                data-testid="input-referrer-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="patientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient Name (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Patient name or initials"
                              data-testid="input-patient-name"
                            />
                          </FormControl>
                          <FormDescription>
                            For initial inquiry, full patient information can be provided during follow-up
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referral Details *</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Brief overview of patient needs, care level required, timeline, and any specific considerations..."
                              className="min-h-[120px]"
                              data-testid="input-referral-details"
                            />
                          </FormControl>
                          <FormDescription>
                            Include care level needed, timeline, and any specific requirements
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Honeypot field - hidden from users */}
                    <FormField
                      control={form.control}
                      name="honeypot"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input {...field} tabIndex={-1} autoComplete="off" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        type="submit"
                        size="lg"
                        className="flex-1"
                        disabled={submitMutation.isPending}
                        data-testid="button-submit-referral"
                      >
                        {submitMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Referral
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        asChild
                        data-testid="button-call-instead"
                      >
                        <a href={`tel:${companyPhoneDial}`}>
                          <Phone className="w-5 h-5 mr-2" />
                          Call Instead
                        </a>
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Professional Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              See what families and referring providers say about our communities
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((testimonial) => (
                <Card key={testimonial.id} className="hover:shadow-lg transition-shadow" data-testid={`card-testimonial-${testimonial.id}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (testimonial.rating || 5)
                              ? "fill-primary text-primary"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-primary/20 mb-3" />
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                      {testimonial.content}
                    </p>
                    <div className="pt-4 border-t">
                      <p className="font-semibold text-sm">{testimonial.authorName}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.authorRelation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No testimonials available at this time.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Service Area Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Colorado Service Area
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Four communities serving the Denver metro area and Front Range
            </p>
          </div>

          <Card className="overflow-hidden shadow-xl" data-testid="card-service-map">
            <CardContent className="p-0">
              <div className="h-[500px] relative">
                {communitiesLoading ? (
                  <div className="h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                      <p className="text-lg text-gray-600">Loading map...</p>
                    </div>
                  </div>
                ) : (
                  <Suspense fallback={
                    <div className="h-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                        <p className="text-lg text-gray-600">Loading map...</p>
                      </div>
                    </div>
                  }>
                    <CommunityMap communities={communities} />
                  </Suspense>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[var(--deep-blue)] to-[var(--bright-blue)] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Partner with Stage Senior?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Contact our placement team for immediate assistance or schedule a tour of our communities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[var(--deep-blue)] hover:bg-gray-100"
              asChild
              data-testid="button-cta-call"
            >
              <a href={`tel:${companyPhoneDial}`}>
                <Phone className="w-5 h-5 mr-2" />
                Call {companyPhoneDisplay}
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-[var(--deep-blue)]"
              asChild
              data-testid="button-cta-email"
            >
              <a href="mailto:referrals@stagesenior.com">
                <Mail className="w-5 h-5 mr-2" />
                Email Referrals Team
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
