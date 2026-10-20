import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "peach";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
      primary:
        "bg-burgundy-600 text-white hover:bg-burgundy-700 hover:-translate-y-0.5 shadow-md shadow-burgundy-600/15 focus:ring-burgundy-600",
      secondary:
        "bg-white text-slate-heading border border-slate-200 hover:bg-cream-100 hover:border-slate-300 hover:-translate-y-0.5 shadow-sm focus:ring-slate-300",
      outline:
        "border-2 border-burgundy-600 text-burgundy-600 hover:bg-burgundy-50 focus:ring-burgundy-600",
      ghost:
        "text-slate-body hover:text-burgundy-600 hover:bg-cream-200/60 focus:ring-burgundy-600",
      peach:
        "bg-peach-100 text-burgundy-800 border border-peach-200 hover:bg-peach-200 hover:-translate-y-0.5 focus:ring-peach-300",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs font-semibold gap-1.5",
      md: "h-11 px-5 text-sm font-semibold gap-2",
      lg: "h-13 px-7 text-base font-bold gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
