"use client";

import React from "react";
import { HeartHandshake } from "lucide-react";

export function BrandLogo({ className = "h-5 w-5 text-peach-200" }: { className?: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-burgundy-600 text-white shadow-md shadow-burgundy-600/20 group-hover:scale-105 transition-transform">
      <HeartHandshake className={className} />
    </div>
  );
}
