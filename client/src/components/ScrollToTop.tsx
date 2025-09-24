import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface ScrollToTopProps {
  /**
   * The scroll threshold in pixels before the button appears
   * @default 300
   */
  threshold?: number;
  /**
   * Additional CSS classes to apply to the button
   */
  className?: string;
  /**
   * Whether to use smooth scrolling animation
   * @default true
   */
  smooth?: boolean;
}

export default function ScrollToTop({ 
  threshold = 300, 
  className = "", 
  smooth = true 
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled up to given threshold
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add event listener for scroll
    window.addEventListener("scroll", toggleVisibility);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [threshold]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${className}`}
          size="icon"
          data-testid="scroll-to-top-button"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}