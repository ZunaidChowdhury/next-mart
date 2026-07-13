"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProducts, IProductItem } from "@/lib/api/product";
import ProductCard from "@/components/product/ProductCard";
import SkeletonLoader from "@/components/product/SkeletonLoader";

export default function ShopCatalog() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        setError(null);

        // Fetch using the parsed URL query parameters
        const category = searchParams.get("category") || undefined;
        const search = searchParams.get("search") || undefined;
        
        const response = await fetchProducts({ category, search });
        setProducts(response.products);
      } catch (err: any) {
        console.error("Catalog fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center py-12">
        <SkeletonLoader />
      </div>
    );
  }

  // Exact boundary check: if error or no products render the boundary string exactly
  if (error || products.length === 0) {
    return (
      <div className="w-full text-center py-24 font-sans text-foreground/50">
        Placeholder [DataLoadFailed]
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
