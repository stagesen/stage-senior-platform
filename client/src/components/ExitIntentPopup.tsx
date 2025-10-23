import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X, Gift } from "lucide-react";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { ExitIntentPopup as ExitIntentPopupType } from "@shared/schema";

// Storage key for tracking if popup has been shown
const STORAGE_KEY = "exitIntentPopupShown";

/**
 * Hook to manage exit intent detection and popup display
 * Returns state and controls for the exit intent popup
 */
export function useExitIntent(enabled: boolean = true) {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Don't enable exit intent if not enabled
    if (!enabled) {
      return;
    }

    // Check if popup has already been shown in this session
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY) === "true";
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    // Exit intent detection - mouse leaving viewport from the top
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if:
      // 1. Mouse is leaving from the top (clientY <= 10)
      // 2. Popup hasn't been shown yet
      // 3. Mouse is actually leaving the document
      if (
        e.clientY <= 10 &&
        !hasShown &&
        e.relatedTarget === null &&
        e.target === document.documentElement
      ) {
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem(STORAGE_KEY, "true");

        // Track popup shown
        console.log("[Exit Intent] Popup shown to user");
      }
    };

    // Add event listener
    document.addEventListener("mouseout", handleMouseLeave);

    // Cleanup
    return () => {
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [hasShown, enabled]);

  return { showPopup, setShowPopup, hasShown };
}

interface ExitIntentPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Exit Intent Popup Component
 * Displays a compelling offer to capture leads when users attempt to leave
 */
export function ExitIntentPopup({ open, onOpenChange }: ExitIntentPopupProps) {
  const [step, setStep] = useState<"initial" | "form">("initial");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch exit intent popup configuration
  const { data: config, isLoading } = useQuery<ExitIntentPopupType>({
    queryKey: ["/api/exit-intent-popup"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Resolve image URL if configured
  const popupImageUrl = useResolveImageUrl(config?.imageId);

  // Handle initial CTA click - show form
  const handleInitialClick = useCallback(() => {
    setStep("form");
  }, []);

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email.trim()) {
        return;
      }

      setIsSubmitting(true);

      try {
        // TODO: Replace with actual API call to save the email
        // For now, just log it
        console.log("[Exit Intent] Email captured:", email);

        // Small delay to show the button is working
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Redirect to the configured URL
        if (config?.ctaLink) {
          window.location.href = config.ctaLink;
        } else {
          // If no URL configured, just close the popup
          console.log("[Exit Intent] No redirect URL configured");
          onOpenChange(false);
        }
      } catch (error) {
        console.error("[Exit Intent] Submission error:", error);
        setIsSubmitting(false);
      }
    },
    [email, onOpenChange, config?.ctaLink]
  );

  // Handle close
  const handleClose = useCallback(() => {
    console.log("[Exit Intent] Popup dismissed by user");
    onOpenChange(false);
  }, [onOpenChange]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      // Reset after animation completes
      setTimeout(() => {
        setStep("initial");
        setEmail("");
      }, 300);
    }
  }, [open]);

  // Don't render if loading or config is not active
  if (isLoading || !config || !config.active) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden" data-testid="exit-intent-popup">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-[var(--deep-blue)] to-[var(--bright-blue)] text-white p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              {popupImageUrl ? (
                <div className="w-40 h-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={popupImageUrl} 
                    alt={config.title} 
                    className="w-full h-full object-cover"
                    data-testid="popup-image"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Gift className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-center text-white" data-testid="popup-title">
              {config.title}
            </DialogTitle>
            <DialogDescription className="text-white/90 text-center text-base sm:text-lg mt-2" data-testid="popup-message">
              {config.message}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {step === "initial" ? (
            // Step 1: Initial CTA button
            <>
              <Button
                onClick={handleInitialClick}
                className="w-full min-h-[48px] text-lg"
                data-testid="button-cta-popup"
              >
                <Download className="w-5 h-5 mr-2" />
                {config.ctaText}
              </Button>

              {/* Dismissal text */}
              <button
                onClick={handleClose}
                className="text-sm text-muted-foreground hover:text-[var(--deep-blue)] transition-colors mx-auto block mt-4 underline"
              >
                No thanks, I'll figure it out myself
              </button>
            </>
          ) : (
            // Step 2: Email form
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exit-popup-email" className="text-[var(--deep-blue)]">
                  Enter your email to get the resource
                </Label>
                <Input
                  id="exit-popup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="min-h-[44px]"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full min-h-[48px] text-lg"
                disabled={isSubmitting || !email.trim()}
                data-testid="button-submit-popup"
              >
                {isSubmitting ? (
                  "Processing..."
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    {config.ctaText}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-3">
                We respect your privacy. Unsubscribe anytime.
              </p>

              {/* Back button */}
              <button
                type="button"
                onClick={() => setStep("initial")}
                className="text-sm text-muted-foreground hover:text-[var(--deep-blue)] transition-colors mx-auto block underline"
                disabled={isSubmitting}
              >
                Go back
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
