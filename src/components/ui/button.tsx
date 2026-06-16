import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        auth:
          "bg-sd-blue text-sd-white hover:bg-[oklch(0.4_0.14_250)] font-sans font-normal tracking-[-0.28px]",
        "app-primary":
          "bg-sd-blue text-white hover:bg-sd-blue/90 font-sans",
        "app-secondary":
          "bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90 font-sans",
        "app-outline":
          "border-sd-blue bg-white text-sd-blue hover:bg-sd-blue/10 font-sans",
        apple:
          "bg-[#202020] text-white hover:bg-[#202020]/90 font-sans",
        google:
          "bg-[#F2F2F2] text-[#1F1F1F] border border-[#D9D9D9] hover:bg-[#F2F2F2]/90 font-sans",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        app: "h-[44px] px-[24px] py-[12px] text-base",
        auth: "h-[44px] gap-2 px-6",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
      isSelected: {
        true: "",
        false: "",
      },
      isGhost: {
        true: "bg-transparent border-transparent",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "app-outline",
        isSelected: true,
        className: "bg-[#F5F9FF] border-[1.5px] border-sd-blue",
      },
      {
        variant: "app-primary",
        isSelected: true,
        className: "bg-sd-blue/80 ring-2 ring-sd-blue/20",
      },
      {
        variant: "app-outline",
        isGhost: true,
        className: "border-transparent bg-transparent hover:bg-sd-blue/5",
      },
      {
        variant: "app-primary",
        isGhost: true,
        className: "bg-transparent text-sd-blue hover:bg-sd-blue/5",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      isSelected: false,
      isGhost: false,
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isSelected,
  isGhost,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, isSelected, isGhost, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
