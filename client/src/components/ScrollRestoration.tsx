import { useLayoutEffect } from "react";
import { useLocation } from "wouter";

interface ScrollRestorationProps {
  /**
   * Whether to use smooth scrolling animation
   * @default true
   */
  smooth?: boolean;
}

/**
 * ScrollRestoration component automatically scrolls to the top of the page
 * when navigating between routes. This provides a better user experience
 * by ensuring users start at the top when viewing new pages.
 */
export default function ScrollRestoration({ smooth = true }: ScrollRestorationProps) {
  const [location] = useLocation();

  useLayoutEffect(() => {
    // Multiple scroll methods to ensure it works across different scenarios
    const scrollToTop = () => {
      // Method 1: window.scrollTo (primary)
      if (smooth) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        window.scrollTo(0, 0);
      }

      // Method 2: Direct manipulation as fallback for instant scroll
      if (!smooth) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    // Apply scroll immediately using layout effect for proper timing
    scrollToTop();

    // For smooth scrolling, apply a slightly delayed scroll to handle potential conflicts
    if (smooth) {
      const timeoutId = setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 50);

      return () => clearTimeout(timeoutId);
    } else {
      // For instant scroll, verify and retry if necessary
      const verificationTimeoutId = setTimeout(() => {
        if (window.scrollY > 0) {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      }, 50);

      return () => clearTimeout(verificationTimeoutId);
    }
  }, [location, smooth]);

  // This component doesn't render anything
  return null;
}