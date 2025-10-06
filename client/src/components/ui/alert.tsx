import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-[var(--radius-md)] border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground shadow-[var(--shadow-soft)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--mist-white)] border-[var(--soft-clay)] text-[var(--deep-blue)]",
        destructive:
          "border-destructive/50 text-destructive bg-destructive/10 dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-[var(--foothill-sage)] bg-[var(--foothill-sage)]/10 text-[var(--deep-blue)] [&>svg]:text-[var(--foothill-sage)]",
        warning:
          "border-[var(--stage-copper)] bg-[var(--stage-copper)]/10 text-[var(--deep-blue)] [&>svg]:text-[var(--stage-copper)]",
        info:
          "border-[var(--bright-blue)] bg-[var(--bright-blue)]/10 text-[var(--deep-blue)] [&>svg]:text-[var(--bright-blue)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight text-[var(--deep-blue)]", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }