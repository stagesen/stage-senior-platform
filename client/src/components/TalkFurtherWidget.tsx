import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface TalkFurtherWidgetProps {
  widgetId: string;
}

declare global {
  interface Window {
    TalkFurther?: {
      init: (config: { widgetId: string }) => void;
      destroy?: () => void;
    };
  }
}

export default function TalkFurtherWidget({ widgetId }: TalkFurtherWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!widgetId) {
      setError("No widget ID provided");
      setIsLoading(false);
      return;
    }

    const scriptId = "talkfurther-script";
    
    // Check if script is already loaded
    const existingScript = document.getElementById(scriptId);
    
    if (existingScript) {
      // Script already exists, just initialize
      if (window.TalkFurther) {
        try {
          window.TalkFurther.init({ widgetId });
          setIsLoading(false);
        } catch (err) {
          setError("Failed to initialize TalkFurther widget");
          setIsLoading(false);
        }
      }
      return;
    }

    // Create and load the script
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://widget.talkfurther.com/widget.js";
    script.async = true;

    script.onload = () => {
      // Wait a bit for the script to fully initialize
      setTimeout(() => {
        if (window.TalkFurther) {
          try {
            window.TalkFurther.init({ widgetId });
            setIsLoading(false);
          } catch (err) {
            setError("Failed to initialize TalkFurther widget");
            setIsLoading(false);
          }
        } else {
          setError("TalkFurther widget failed to load");
          setIsLoading(false);
        }
      }, 100);
    };

    script.onerror = () => {
      setError("Failed to load TalkFurther widget");
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: destroy widget if available
      if (window.TalkFurther?.destroy) {
        try {
          window.TalkFurther.destroy();
        } catch (err) {
          console.error("Error destroying TalkFurther widget:", err);
        }
      }
    };
  }, [widgetId]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8" data-testid="loading-talkfurther">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading scheduling widget...</span>
      </div>
    );
  }

  return (
    <div id="talkfurther-widget-container" className="min-h-[400px]" data-testid="talkfurther-widget">
      {/* TalkFurther widget will be injected here */}
    </div>
  );
}
