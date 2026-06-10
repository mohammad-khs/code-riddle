import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500 hover:shadow-blue-900/40",
        destructive: "bg-rose-600 text-white shadow-sm hover:bg-rose-500",
        outline:
          "border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white",
        secondary: "bg-slate-800 text-slate-100 shadow-sm hover:bg-slate-700",
        ghost: "text-slate-300 hover:bg-slate-800/50 hover:text-slate-100",
        link: "text-blue-500 underline-offset-4 hover:underline",
        green: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-500",
        icon: "rounded-lg flex justify-center items-center",
        approved:
          "border border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
        lightGray:
          "border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
        upload:
          "bg-blue-900/30 text-blue-400 hover:bg-blue-800/50 border border-blue-800/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
        resizble: "h-9 rounded-md px-3 text-xs lg:text-sm lg:h-11",
        resizbleIcon: "h-9 w-9 lg:h-10 lg:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
