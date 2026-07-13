import React, { Suspense } from "react";
import ShopCatalog from "./ShopCatalog";
import SkeletonLoader from "@/components/product/SkeletonLoader";

export const revalidate = 300; // Enable ISR revalidation on this route segment (Server-Side compatible)

export default function Shop() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
      <div className="mb-8 border-b border-border-accent pb-6">
        <h1 className="font-display text-3xl font-extrabold text-foreground tracking-tight">
          Specialized Catalog
        </h1>
        <p className="font-sans text-sm text-foreground/60 mt-2">
          Explore our seasonal releases of sunglasses, electronics, and precision watches.
        </p>
      </div>

      {/* Wrap searchParams hook usage in a client component with Suspense to prevent build errors */}
      <Suspense fallback={<SkeletonLoader />}>
        <ShopCatalog />
      </Suspense>
    </main>
  );
}
