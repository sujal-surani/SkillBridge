import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "burgundy" | "peach" | "outline" | "success" | "match";
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";

  const variants = {
    default: "bg-cream-200 text-slate-heading border border-cream-300",
    burgundy: "bg-burgundy-50 text-burgundy-700 border border-burgundy-200 font-bold",
    peach: "bg-peach-100 text-burgundy-800 border border-peach-200 font-semibold",
    outline: "text-slate-muted border border-slate-200 bg-white",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold",
    match: "bg-gradient-to-r from-peach-100 to-amber-50 text-burgundy-700 border border-peach-300 font-bold shadow-xs",
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props} />
  );
}

export { Badge };
