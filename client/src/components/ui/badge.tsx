import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--foothill-sage)] text-white hover:bg-[var(--foothill-sage)]/80",
        secondary:
          "border-transparent bg-[var(--stage-copper)] text-white hover:bg-[var(--stage-copper)]/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-[var(--deep-blue)]",
        accent:
          "border-transparent bg-[var(--bright-blue)] text-white hover:bg-[var(--bright-blue)]/80",
        info:
          "border-transparent bg-[var(--soft-clay)] text-[var(--deep-blue)] hover:bg-[var(--soft-clay)]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }