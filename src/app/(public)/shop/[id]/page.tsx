import React from "react";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api/product";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const { product } = await fetchProductById(id);
    if (!product || product.isPrivate) {
      return {
        title: "Product Not Found | NextMart",
      };
    }
    return {
      title: `${product.title} - ${product.brandName} | NextMart`,
      description: product.overview || product.description.substring(0, 150),
      openGraph: {
        title: `${product.title} - ${product.brandName} | NextMart`,
        description: product.overview,
        images: product.images[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch (error) {
    return {
      title: "Product Details | NextMart",
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const { product } = await fetchProductById(id);

    // If product doesn't exist or is set to private, trigger Next.js 404 handler
    if (!product || product.isPrivate) {
      notFound();
    }

    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        <ProductDetails product={product} />
      </main>
    );
  } catch (error) {
    console.error("Failed to load product page details:", error);
    notFound();
  }
}
