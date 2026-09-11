import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,color,opacity] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
  {
    variants: {
      variant: {
        primary: "bg-forest text-paper-3 hover:bg-forest-2",
        ink: "bg-ink text-paper-3 hover:bg-ink-soft",
        outline:
          "bg-transparent text-ink shadow-[0_0_0_1px_rgba(26,24,20,0.18)] hover:bg-chip",
        ghost: "bg-transparent text-ink-soft hover:bg-chip hover:text-ink",
        clay: "bg-clay text-paper-3 hover:opacity-90",
      },
      size: {
        md: "h-11 rounded-md px-4 text-sm",
        sm: "h-9 rounded-sm px-3 text-sm",
        lg: "h-12 rounded-lg px-5 text-base",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
