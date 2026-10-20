"use client";

import React from "react";

export function BrandLogo({ className = "h-5 w-5 text-peach-200" }: { className?: string }) {
  return (
    <div
      suppressHydrationWarning
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-burgundy-600 text-white shadow-md shadow-burgundy-600/20 group-hover:scale-105 transition-transform"
    >
      <svg
        suppressHydrationWarning
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path
          suppressHydrationWarning
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        />
        <path
          suppressHydrationWarning
          d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9"
        />
        <path
          suppressHydrationWarning
          d="m14 13-1.5-1.5"
        />
        <path
          suppressHydrationWarning
          d="m16 11-2-2"
        />
      </svg>
    </div>
  );
}
