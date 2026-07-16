"use client";

import React from "react";
import { FiPackage } from "react-icons/fi";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "Nothing here yet",
  description = "Items will appear here once they are added.",
  icon = <FiPackage size={48} />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card-bg border border-border-accent text-foreground/30 shadow-sm">
        {icon}
      </div>
      <div className="text-center max-w-xs">
        <h3 className="font-display text-lg font-bold text-foreground mb-1">
          {title}
        </h3>
        <p className="font-sans text-sm text-foreground/50 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
