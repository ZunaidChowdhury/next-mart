"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-background transition-colors duration-300 min-h-[60vh]">
      <div className="text-center max-w-md p-8 rounded-2xl bg-card-bg border border-border-accent shadow-xl">
        <h1 className="font-display text-7xl font-extrabold text-brand-primary-500 mb-4 tracking-tight">
          404
        </h1>
        
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-2">
          Page Not Found
        </h2>
        
        <p className="font-sans text-sm text-foreground/60 mb-6 max-w-sm mx-auto">
          The page or specialized catalog item you are looking for does not exist, has been archived, or requires admin clearance.
        </p>
        
        <Link href="/" className="block w-fit mx-auto">
          <Button
            variant="secondary"
            className="font-sans font-medium rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <FiHome size={16} />
            <span>Go Back Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
