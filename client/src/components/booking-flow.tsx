import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Community, InsertTourRequest } from "@shared/schema";

const DEFAULT_PHONE_NUMBER = "+1-303-436-2300";

const VISIT_TYPES = [
  { value: "in-person-tour", label: "In-person tour" },
  { value: "virtual-tour", label: "Virtual consultation" },
  { value: "pricing-consultation", label: "Pricing consultation" },
  { value: "request-callback", label: "Request a callback" },
] as const;

type VisitTypeValue = typeof VISIT_TYPES[number]["value"];

export interface BookingOptions {
  communityId?: string;
  communityName?: string;
  visitType?: VisitTypeValue;
  source?: string;
}

interface TrackCallOptions {
  source: string;
  phoneNumber?: string;
  communityId?: string;
  metadata?: Record<string, unknown>;
}

interface BookingFlowContextValue {
  openBooking: (options?: BookingOptions) => void;
  trackCall: (options: TrackCallOptions) => void;
}

interface BookingFormState {
  name: string;
  phone: string;
  email: string;
  communityId: string;
  visitType: VisitTypeValue | "";
  preferredDate: string;
  message: string;
}

const BookingFlowContext = createContext<BookingFlowContextValue | undefined>(undefined);

function useBookingCommunities() {
  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  return communities;
}

function getVisitTypeLabel(value: VisitTypeValue | "") {
  return VISIT_TYPES.find((type) => type.value === value)?.label;
}

export function BookingFlowProvider({ children }: { children: ReactNode }) {
  const communities = useBookingCommunities();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadSource, setLeadSource] = useState<string>("website");
  const [prefill, setPrefill] = useState<BookingOptions | undefined>();
  const [formState, setFormState] = useState<BookingFormState>({
    name: "",
    phone: "",
    email: "",
    communityId: "",
    visitType: "",
    preferredDate: "",
    message: "",
  });

  const buildInitialFormState = useCallback((options?: BookingOptions): BookingFormState => ({
    name: "",
    phone: "",
    email: "",
    communityId: options?.communityId ?? "",
    visitType: options?.visitType ?? "",
    preferredDate: "",
    message: "",
  }), []);

  const resetState = useCallback(() => {
    setFormState(buildInitialFormState());
    setLeadSource("website");
    setPrefill(undefined);
    setStep(1);
    setIsSubmitting(false);
  }, [buildInitialFormState]);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    resetState();
  }, [resetState]);

  const openBooking = useCallback((options?: BookingOptions) => {
    setPrefill(options);
    setLeadSource(options?.source ?? "website");
    setFormState(buildInitialFormState(options));
    setStep(1);
    setIsOpen(true);
  }, [buildInitialFormState]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const visitTypeLabel = getVisitTypeLabel(formState.visitType);
      const messageParts: string[] = [];

      if (visitTypeLabel) {
        messageParts.push(`Preferred visit type: ${visitTypeLabel}`);
      }

      if (formState.message.trim()) {
        messageParts.push(`Notes: ${formState.message.trim()}`);
      }

      if (leadSource) {
        messageParts.push(`Lead source: ${leadSource}`);
      }

      if (!formState.communityId && prefill?.communityName) {
        messageParts.push(`Community of interest: ${prefill.communityName}`);
      }

      const preferredDateIso = formState.preferredDate
        ? new Date(formState.preferredDate).toISOString()
        : undefined;

      const payload: InsertTourRequest = {
        name: formState.name,
        phone: formState.phone,
        email: formState.email || undefined,
        communityId: formState.communityId || undefined,
        preferredDate: preferredDateIso,
        message: messageParts.length > 0 ? messageParts.join("\n") : undefined,
      };

      await apiRequest("POST", "/api/tour-requests", payload);
      await queryClient.invalidateQueries({ queryKey: ["/api/tour-requests"] });

      toast({
        title: "Request submitted",
        description: "Our team will reach out shortly to coordinate your visit.",
      });

      closeBooking();
    } catch (error) {
      console.error("Failed to submit tour request", error);
      toast({
        title: "Unable to submit request",
        description: "Please try again or call us so we can help immediately.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [closeBooking, formState, isSubmitting, leadSource, prefill, toast]);

  const trackCall = useCallback((options: TrackCallOptions) => {
    const phoneNumber = options.phoneNumber ?? DEFAULT_PHONE_NUMBER;

    void apiRequest("POST", "/api/call-events", {
      phoneNumber,
      source: options.source,
      communityId: options.communityId,
      metadata: options.metadata,
    }).catch((error) => {
      console.error("Failed to log call event", error);
    });

    if (typeof window !== "undefined") {
      window.location.href = `tel:${phoneNumber}`;
    }
  }, []);

  const contextValue = useMemo<BookingFlowContextValue>(() => ({
    openBooking,
    trackCall,
  }), [openBooking, trackCall]);

  return (
    <BookingFlowContext.Provider value={contextValue}>
      {children}
      <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : closeBooking())}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Book your visit</DialogTitle>
            <DialogDescription>
              Share your contact details and we&apos;ll coordinate the best visit option for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {step} of 2</span>
              {prefill?.communityName && (
                <span>Community: {prefill.communityName}</span>
              )}
            </div>

            {step === 1 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="booking-name">Your name</Label>
                  <Input
                    id="booking-name"
                    placeholder="Full name"
                    value={formState.name}
                    onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="booking-phone">Phone number</Label>
                  <Input
                    id="booking-phone"
                    type="tel"
                    placeholder="(303) 555-1234"
                    value={formState.phone}
                    onChange={(event) => setFormState((state) => ({ ...state, phone: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="booking-email">Email (optional)</Label>
                  <Input
                    id="booking-email"
                    type="email"
                    placeholder="you@example.com"
                    value={formState.email}
                    onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="booking-visit-type">Preferred visit type</Label>
                  <Select
                    value={formState.visitType}
                    onValueChange={(value) => setFormState((state) => ({ ...state, visitType: value as VisitTypeValue }))}
                  >
                    <SelectTrigger id="booking-visit-type">
                      <SelectValue placeholder="Choose how you want to connect" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-community">Community preference</Label>
                  <Select
                    value={formState.communityId}
                    onValueChange={(value) => setFormState((state) => ({ ...state, communityId: value }))}
                  >
                    <SelectTrigger id="booking-community">
                      <SelectValue placeholder="Select a community (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">I&apos;m still exploring options</SelectItem>
                      {communities.map((community) => (
                        <SelectItem key={community.id} value={community.id}>
                          {community.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-date">Preferred date &amp; time</Label>
                  <Input
                    id="booking-date"
                    type="datetime-local"
                    value={formState.preferredDate}
                    onChange={(event) => setFormState((state) => ({ ...state, preferredDate: event.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-notes">Anything else we should know?</Label>
                  <Textarea
                    id="booking-notes"
                    placeholder="Share care needs, timing, or questions."
                    value={formState.message}
                    onChange={(event) => setFormState((state) => ({ ...state, message: event.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center justify-between space-x-2">
            <div className="text-xs text-muted-foreground">
              Secure form. We&apos;ll reach out within 10 minutes during business hours.
            </div>
            <div className="flex gap-2">
              {step === 2 && (
                <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                  Back
                </Button>
              )}
              {step === 1 ? (
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formState.name.trim() || !formState.phone.trim()}
                >
                  Continue
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit request"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BookingFlowContext.Provider>
  );
}

export function useBookingFlow(): BookingFlowContextValue {
  const context = useContext(BookingFlowContext);
  if (!context) {
    throw new Error("useBookingFlow must be used within a BookingFlowProvider");
  }
  return context;
}
