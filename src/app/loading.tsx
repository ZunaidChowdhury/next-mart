"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] bg-background transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Custom circular spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-foreground/10 border-t-brand-primary-500" />
        
        {/* Responsive color-matched label */}
        <p className="font-sans text-sm font-medium text-foreground/70 animate-pulse">
          Loading NextMart...
        </p>
      </div>
    </div>
  );
}
