import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { apiRequest } from "@/lib/queryClient";
import { insertTourRequestSchema, type InsertTourRequest } from "@shared/schema";

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
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(insertTourRequestSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      communityId: communityId || undefined,
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/tour-requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted Successfully!",
        description: "We'll contact you within 10 minutes to help with your needs.",
        duration: 6000,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tour-requests"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or call us directly at (303) 436-2300",
        variant: "destructive",
        duration: 8000,
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    submitMutation.mutate(data);
  };

  const isLoading = submitMutation.isPending;
  const isStep1 = step === 1;
  const isStep2 = step === 2;

  // Different layouts based on variant
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
    if (!showSocialProof) return null;

    return (
      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">4.8</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>98% Satisfaction</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4 text-blue-600" />
          <span>Licensed & Insured</span>
        </div>
      </div>
    );
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
                placeholder="(303) 555-0123"
                className="h-12 text-base"
                autoComplete="tel"
                data-testid="input-lead-phone"
              />
            </FormControl>
            <FormDescription className="text-xs">
              We'll call you within 10 minutes (usually much sooner!)
            </FormDescription>
            <FormMessage className="text-sm" />
          </FormItem>
        )}
      />

      <Button
        type="button"
        onClick={() => {
          // Validate step 1 fields before proceeding
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

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={() => setStep(1)}
          variant="outline"
          className="flex-1 h-12"
          data-testid="button-lead-back"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-12 text-base font-semibold"
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
        {urgencyText && (
          <div className={`flex items-center gap-2 text-sm font-medium ${
            variant === "sidebar" ? "text-yellow-200" : "text-orange-600"
          }`}>
            <Clock className="w-4 h-4" />
            {urgencyText}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {renderSocialProof()}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Progress indicator */}
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

        {/* Trust indicators */}
        <div className={`flex items-center justify-center gap-4 text-xs ${
          variant === "sidebar" ? "text-white/70" : "text-muted-foreground"
        }`}>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>10-min response</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>No pressure</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Free consultation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}