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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch exit intent popup configuration
  const { data: config, isLoading } = useQuery<ExitIntentPopupType>({
    queryKey: ["/api/exit-intent-popup"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Resolve image URL if configured
  const popupImageUrl = useResolveImageUrl(config?.imageId);

  // Handle form submission or CTA click
  const handleCta = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // If there's a CTA link, navigate to it
      if (config?.ctaLink) {
        window.location.href = config.ctaLink;
        onOpenChange(false);
        return;
      }

      // Otherwise, handle as form submission
      if (!name.trim() || !email.trim()) {
        return;
      }

      setIsSubmitting(true);

      try {
        // TODO: Replace with actual API call
        // For now, just simulate a successful submission
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("[Exit Intent] Form submitted:", { name, email });

        // Show success state
        setIsSuccess(true);

        // Close popup after showing success message
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
      } catch (error) {
        console.error("[Exit Intent] Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, email, onOpenChange, config?.ctaLink]
  );

  // Handle close
  const handleClose = useCallback(() => {
    console.log("[Exit Intent] Popup dismissed by user");
    onOpenChange(false);
  }, [onOpenChange]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      // Reset after animation completes
      setTimeout(() => {
        setName("");
        setEmail("");
        setIsSuccess(false);
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
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={popupImageUrl} 
                    alt={config.title} 
                    className="w-full h-full object-cover"
                    data-testid="popup-image"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-white" />
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
          {!isSuccess ? (
            <>
              {/* Value proposition */}
              <Card className="mb-6 border-[var(--bright-blue)]/20 bg-[var(--aspen-cream)]">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-[var(--deep-blue)] mb-3 flex items-center gap-2">
                    <Download className="w-5 h-5 text-[var(--bright-blue)]" />
                    What You'll Get:
                  </h3>
                  <ul className="space-y-2 text-sm text-[var(--midnight-slate)]">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--bright-blue)] mt-0.5">✓</span>
                      <span>Complete guide to choosing the right senior living community</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--bright-blue)] mt-0.5">✓</span>
                      <span>Pricing comparisons and what to expect</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--bright-blue)] mt-0.5">✓</span>
                      <span>Questions to ask during tours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--bright-blue)] mt-0.5">✓</span>
                      <span>Expert tips from senior living professionals</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Form - only show if no CTA link is configured */}
              {!config.ctaLink ? (
                <form onSubmit={handleCta} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exit-popup-name" className="text-[var(--deep-blue)]">
                    Your Name
                  </Label>
                  <Input
                    id="exit-popup-name"
                    type="text"
                    placeholder="John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="min-h-[44px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exit-popup-email" className="text-[var(--deep-blue)]">
                    Email Address
                  </Label>
                  <Input
                    id="exit-popup-email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="min-h-[44px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full min-h-[48px] text-lg"
                  disabled={isSubmitting || !name.trim() || !email.trim()}
                  data-testid="button-submit-popup"
                >
                  {isSubmitting ? (
                    "Sending..."
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
              </form>
              ) : (
                // Show CTA button if link is configured
                <Button
                  onClick={handleCta}
                  className="w-full min-h-[48px] text-lg"
                  data-testid="button-cta-popup"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {config.ctaText}
                </Button>
              )}
            </>
          ) : (
            // Success state
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--deep-blue)] mb-2">
                Success!
              </h3>
              <p className="text-[var(--midnight-slate)] mb-4">
                Check your email for your free Senior Living Guide.
              </p>
              <p className="text-sm text-muted-foreground">
                We'll also send you helpful tips and resources.
              </p>
            </div>
          )}

          {/* Dismissal text */}
          {!isSuccess && (
            <button
              onClick={handleClose}
              className="text-sm text-muted-foreground hover:text-[var(--deep-blue)] transition-colors mx-auto block mt-4 underline"
            >
              No thanks, I'll figure it out myself
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
