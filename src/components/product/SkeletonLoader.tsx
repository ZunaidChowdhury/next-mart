"use client";

import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div 
          key={idx} 
          className="flex flex-col rounded-2xl border border-border-accent bg-card-bg overflow-hidden p-5 animate-pulse"
        >
          <div className="h-48 bg-foreground/10 rounded-xl mb-4" />
          <div className="h-3 w-1/4 bg-foreground/10 rounded mb-2" />
          <div className="h-5 w-3/4 bg-foreground/10 rounded mb-3" />
          <div className="h-4 w-1/2 bg-foreground/10 rounded mb-4" />
          <div className="h-10 w-full bg-foreground/10 rounded-xl mt-auto" />
        </div>
      ))}
    </div>
  );
}
