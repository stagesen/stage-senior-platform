import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] font-semibold tracking-normal ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bright-blue)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[var(--deep-blue)] text-white hover:bg-gradient-to-r hover:from-[var(--deep-blue)] hover:to-[var(--bright-blue)] hover:shadow-[var(--shadow-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[var(--shadow-soft)]",
        outline:
          "border-2 border-[var(--deep-blue)] bg-transparent text-[var(--deep-blue)] hover:bg-[var(--foothill-sage)] hover:text-white hover:border-[var(--foothill-sage)] hover:shadow-[var(--shadow-soft)]",
        secondary:
          "border-2 border-[var(--deep-blue)] bg-transparent text-[var(--deep-blue)] hover:bg-[var(--foothill-sage)] hover:text-white hover:border-[var(--foothill-sage)] hover:shadow-[var(--shadow-soft)]",
        ghost: "hover:bg-[var(--aspen-cream)] hover:text-[var(--deep-blue)]",
        link: "text-[var(--bright-blue)] underline-offset-4 hover:underline hover:text-[var(--stage-copper)]",
        copper: "bg-[var(--stage-copper)] text-[var(--midnight-slate)] hover:bg-gradient-to-r hover:from-[var(--stage-copper)] hover:to-[var(--sunset-blush)] hover:shadow-[var(--shadow-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] font-semibold",
        glassmorphism: "bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg hover:bg-white/30 hover:shadow-[var(--shadow-lift)] hover:scale-[1.02] transition-all duration-300 ease-out",
        "glassmorphism-dark": "bg-black/50 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-black/60 hover:shadow-[var(--shadow-lift)] hover:scale-[1.02] transition-all duration-300 ease-out",
      },
      size: {
        default: "px-5 py-3 text-base", // 12px 20px padding
        sm: "rounded-[8px] px-3 py-2 text-sm", // smaller radius for sm  
        lg: "rounded-[16px] px-8 py-4 text-lg", // larger radius for lg
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }