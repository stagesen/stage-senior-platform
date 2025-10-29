import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EmphasizedHeadingProps {
  children?: ReactNode;
  text?: string;
  accentWords?: string[];
  splitText?: {
    primary: string;
    accent: string;
  };
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  accentClassName?: string;
  "data-testid"?: string;
}

export function EmphasizedHeading({
  children,
  text,
  accentWords = [],
  splitText,
  as: Component = "h2",
  className = "",
  accentClassName = "text-primary font-bold",
  "data-testid": testId,
}: EmphasizedHeadingProps) {
  const renderContent = () => {
    if (splitText) {
      return (
        <>
          <span className="block">{splitText.primary}</span>
          <span className={cn("block", accentClassName)}>{splitText.accent}</span>
        </>
      );
    }

    if (text && accentWords.length > 0) {
      const parts: ReactNode[] = [];
      let remainingText = text;

      accentWords.forEach((word, index) => {
        const wordIndex = remainingText.indexOf(word);
        if (wordIndex !== -1) {
          if (wordIndex > 0) {
            parts.push(remainingText.substring(0, wordIndex));
          }
          parts.push(
            <span key={`accent-${index}`} className={accentClassName}>
              {word}
            </span>
          );
          remainingText = remainingText.substring(wordIndex + word.length);
        }
      });

      if (remainingText) {
        parts.push(remainingText);
      }

      return <>{parts}</>;
    }

    if (text) {
      return text;
    }

    return children;
  };

  return (
    <Component className={className} data-testid={testId}>
      {renderContent()}
    </Component>
  );
}

export default EmphasizedHeading;
