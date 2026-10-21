"use client";

import React from "react";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      theme="light"
      toastOptions={{
        className: "font-sans text-xs rounded-2xl shadow-lg border border-[#EDE7DE]",
      }}
    />
  );
}
