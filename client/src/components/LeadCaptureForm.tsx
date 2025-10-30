import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  Star,
  Shield,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { apiRequest } from "@/lib/queryClient";
import { insertTourRequestSchema, type InsertTourRequest, type Community } from "@shared/schema";
import { 
  getMetaCookies, 
  getClickIdsFromUrl, 
  getUtmParams,
  generateEventId, 
  generateTransactionId,
  fireScheduleTour 
} from "@/lib/tracking";
import { getPrimaryPhoneDisplay } from "@/lib/communityContact";

interface LeadCaptureFormProps {
  variant?: "inline" | "modal" | "sidebar" | "hero";
  title?: string;
  description?: string;
  communityId?: string;
  communityName?: string;
  showSocialProof?: boolean;
  urgencyText?: string;
  onSuccess?: () => void;
  className?: string;
}

type FormData = InsertTourRequest;

export default function LeadCaptureForm({
  variant = "inline",
  title = "Get Your Free Information Package",
  description = "Speak with a local senior living advisor and get personalized recommendations",
  communityId,
  communityName,
  showSocialProof = true,
  urgencyText,
  onSuccess,
  className = ""
}: LeadCaptureFormProps) {
  const { companyPhoneDisplay } = useSiteSettings();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formLoadTime] = useState(Date.now());
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch community data to get phone number for error messages
  const { data: community } = useQuery<Community>({
    queryKey: [`/api/communities/${communityId}`],
    enabled: !!communityId,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(insertTourRequestSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      communityId: communityId || undefined,
      honeypot: "",
    },
    mode: "onBlur",
  });

  // Load Cloudflare Turnstile script and setup callback
  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      console.warn('[CAPTCHA] VITE_TURNSTILE_SITE_KEY not configured');
      return;
    }

    // Set up global callback for Turnstile
    (window as any).onTurnstileSuccess = (token: string) => {
      console.log('[CAPTCHA] Token received');
      setCaptchaToken(token);
    };

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete (window as any).onTurnstileSuccess;
    };
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/tour-requests", data);
    },
    onSuccess: async (response: any, variables: FormData) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tour-requests"] });
      
      // Fire ScheduleTour event to dataLayer ONLY AFTER successful submission
      // This ensures browser and server conversions are synchronized
      const eventId = response.transactionId || generateEventId();
      await fireScheduleTour({
        event_id: eventId,
        email: variables.email,
        phone: variables.phone,
        care_level: undefined,
        metro: undefined,
        community_name: communityName,
        landing_page: window.location.pathname,
      });
      
      setIsSuccess(true);
      form.reset();
      
      // Redirect to success page with transaction ID and community info
      const params = new URLSearchParams({
        txn: eventId,
        ...(communityId && { community: communityId }),
        ...(communityName && { name: form.getValues('name') }),
      });
      
      // Navigate to success page
      navigate(`/tour-scheduled?${params.toString()}`);
      
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      const phoneNumber = community ? getPrimaryPhoneDisplay(community) : companyPhoneDisplay;
      toast({
        title: "Submission Failed",
        description: `Please try again or call us directly at ${phoneNumber}`,
        variant: "destructive",
        duration: 8000,
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    // Collect tracking data
    const metaCookies = getMetaCookies();
    const clickIds = getClickIdsFromUrl();
    const utmParams = getUtmParams();
    const eventId = generateEventId();
    
    // Add tracking data and security fields to form submission
    const enrichedData = {
      ...data,
      transactionId: eventId, // Use event_id as transaction ID for deduplication
      fbp: metaCookies.fbp,
      fbc: metaCookies.fbc,
      gclid: clickIds.gclid,
      gbraid: clickIds.gbraid,
      wbraid: clickIds.wbraid,
      fbclid: clickIds.fbclid,
      utmSource: utmParams.utm_source,
      utmMedium: utmParams.utm_medium,
      utmCampaign: utmParams.utm_campaign,
      utmTerm: utmParams.utm_term,
      utmContent: utmParams.utm_content,
      landingPageUrl: window.location.pathname,
      clientUserAgent: navigator.userAgent,
      // Security fields
      captchaToken: captchaToken || undefined,
      formLoadTime,
    };
    
    // Note: fireScheduleTour() is called in onSuccess after backend confirms submission
    // This ensures browser and server conversions are synchronized for proper deduplication
    
    submitMutation.mutate(enrichedData);
  };

  const isLoading = submitMutation.isPending;
  const isStep1 = step === 1;
  const isStep2 = step === 2;

  const getCardStyle = () => {
    switch (variant) {
      case "hero":
        return "bg-white/95 backdrop-blur-sm border-0 shadow-2xl";
      case "modal":
        return "border-0 shadow-lg";
      case "sidebar":
        return "bg-primary text-white border-primary";
      default:
        return "bg-white border shadow-sm";
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case "sidebar":
        return "secondary";
      case "hero":
        return "default";
      default:
        return "default";
    }
  };

  const renderSocialProof = () => {
    return null;
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Your Name *</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Enter your full name"
                className="h-12 text-base"
                autoComplete="name"
                data-testid="input-lead-name"
              />
            </FormControl>
            <FormMessage className="text-sm" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Phone Number *</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="tel"
                inputMode="tel"
                placeholder="(303) 555-0123"
                className="h-12 text-base"
                autoComplete="tel"
                data-testid="input-lead-phone"
              />
            </FormControl>
            <FormMessage className="text-sm" />
          </FormItem>
        )}
      />

      <Button
        type="button"
        onClick={() => {
          form.trigger(["name", "phone"]).then((isValid) => {
            if (isValid) {
              setStep(2);
            }
          });
        }}
        className="w-full h-12 text-base font-semibold"
        variant={getButtonVariant()}
        data-testid="button-lead-continue"
      >
        Continue
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Email (Optional)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                inputMode="email"
                placeholder="your.email@example.com"
                className="h-12 text-base"
                autoComplete="email"
                data-testid="input-lead-email"
              />
            </FormControl>
            <FormDescription className="text-xs">
              For sending you our information packet
            </FormDescription>
            <FormMessage className="text-sm" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">What can we help you with?</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Tell us about your needs, timeline, or any specific questions..."
                className="min-h-[100px] text-base resize-none"
                data-testid="input-lead-message"
              />
            </FormControl>
            <FormMessage className="text-sm" />
          </FormItem>
        )}
      />

      {/* Honeypot field - hidden from users, catches bots */}
      <FormField
        control={form.control}
        name="honeypot"
        render={({ field }) => (
          <FormItem className="absolute -left-[9999px]" aria-hidden="true">
            <FormLabel>Leave this field blank</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                data-testid="input-honeypot"
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Cloudflare Turnstile CAPTCHA */}
      {import.meta.env.VITE_TURNSTILE_SITE_KEY && (
        <div className="flex justify-center">
          <div
            className="cf-turnstile"
            data-sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            data-callback="onTurnstileSuccess"
            data-theme="light"
            data-size="normal"
          ></div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          onClick={() => setStep(1)}
          variant="outline"
          className="w-full sm:flex-1 h-12"
          data-testid="button-lead-back"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full sm:flex-1 h-12 text-base font-semibold"
          variant={getButtonVariant()}
          data-testid="button-lead-submit"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Get My Information
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderSuccessMessage = () => (
    <div className="text-center py-8 space-y-4" data-testid="success-message">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-foreground">Request Submitted Successfully!</h3>
      <p className="text-lg text-muted-foreground max-w-md mx-auto">
        We'll contact you within 10 minutes to help with your needs.
      </p>
      <div className="pt-4">
        <Button
          onClick={() => {
            setIsSuccess(false);
            setStep(1);
            form.reset();
          }}
          variant="outline"
          data-testid="button-submit-another"
        >
          Submit Another Request
        </Button>
      </div>
    </div>
  );

  return (
    <Card className={`${getCardStyle()} ${className}`} data-testid="lead-capture-form">
      <CardHeader className="pb-4">
        <CardTitle className={`text-xl font-bold ${variant === "sidebar" ? "text-white" : ""}`}>
          {title}
        </CardTitle>
        <p className={`text-sm ${variant === "sidebar" ? "text-white/90" : "text-muted-foreground"}`}>
          {description}
        </p>
        {communityName && (
          <Badge variant="secondary" className="w-fit">
            {communityName}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {isSuccess ? (
          renderSuccessMessage()
        ) : (
          <>
            {renderSocialProof()}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className={`w-8 h-2 rounded-full transition-colors ${
                    isStep1 ? "bg-primary" : "bg-primary/30"
                  }`} />
                  <div className={`w-8 h-2 rounded-full transition-colors ${
                    isStep2 ? "bg-primary" : "bg-muted"
                  }`} />
                </div>

                {isStep1 && renderStep1()}
                {isStep2 && renderStep2()}
              </form>
            </Form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
