"use client";

import React, { useEffect } from "react";
import { Button } from "@heroui/react";
import { FiAlertTriangle, FiRotateCw } from "react-icons/fi";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error report to console/trace backend
    console.error("NextMart rendering error trapped:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-background transition-colors duration-300 min-h-[60vh]">
      <div className="text-center max-w-md p-8 rounded-2xl bg-card-bg border border-border-accent shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger mb-6">
          <FiAlertTriangle size={32} />
        </div>
        
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-2">
          Something went wrong
        </h2>
        
        <p className="font-sans text-sm text-foreground/60 mb-6 max-w-sm mx-auto">
          An unexpected error occurred while loading this page section. Please attempt to reset the session.
        </p>
        
        <Button
          variant="secondary"
          onPress={reset}
          className="font-sans font-medium rounded-xl shadow-md cursor-pointer mx-auto flex items-center justify-center gap-2"
        >
          <FiRotateCw size={16} />
          <span>Retry Session</span>
        </Button>
      </div>
    </div>
  );
}
