"use client";

import React from "react";

export default function ProductLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-1 flex flex-col gap-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-48 bg-foreground/10 rounded-lg" />

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Area */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="aspect-square w-full rounded-2xl bg-foreground/10 border border-border-accent/40" />
          <div className="flex gap-3">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-foreground/10" />
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-foreground/10" />
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-foreground/10" />
          </div>
        </div>

        {/* Right Column: Text Information */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          <div className="h-4 w-24 bg-foreground/10 rounded-lg mb-4" />
          <div className="h-10 w-3/4 bg-foreground/10 rounded-xl mb-4" />
          <div className="h-5 w-40 bg-foreground/10 rounded-lg mb-6" />
          <div className="h-8 w-32 bg-foreground/10 rounded-lg mb-6" />
          
          <div className="space-y-2 mb-8">
            <div className="h-4 w-full bg-foreground/10 rounded-lg" />
            <div className="h-4 w-full bg-foreground/10 rounded-lg" />
            <div className="h-4 w-5/6 bg-foreground/10 rounded-lg" />
          </div>

          <div className="h-6 w-28 bg-foreground/10 rounded-lg mb-3" />
          <div className="flex gap-2.5 mb-8">
            <div className="h-9 w-20 bg-foreground/10 rounded-xl" />
            <div className="h-9 w-20 bg-foreground/10 rounded-xl" />
            <div className="h-9 w-20 bg-foreground/10 rounded-xl" />
          </div>

          <div className="flex gap-4">
            <div className="h-12 w-32 bg-foreground/10 rounded-xl" />
            <div className="h-12 flex-1 bg-foreground/10 rounded-xl" />
            <div className="h-12 w-12 bg-foreground/10 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton Section */}
      <div className="mt-8 border-t border-border-accent/40 pt-8 space-y-6">
        <div className="flex gap-4 border-b border-border-accent/30 pb-px">
          <div className="h-8 w-24 bg-foreground/10 rounded-lg" />
          <div className="h-8 w-24 bg-foreground/10 rounded-lg" />
          <div className="h-8 w-24 bg-foreground/10 rounded-lg" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-foreground/10 rounded-lg" />
          <div className="h-4 w-full bg-foreground/10 rounded-lg" />
          <div className="h-4 w-2/3 bg-foreground/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
