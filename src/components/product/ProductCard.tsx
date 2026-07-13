"use client";

import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/store/slices/cartSlice";
import { Button } from "@heroui/react";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { toast } from "react-toastify";
import { IProductItem } from "@/lib/api/product";

interface ProductCardProps {
  product: IProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card link navigation
    
    dispatch(
      addToCart({
        product: product._id,
        title: product.title,
        quantity: 1,
        price: product.salePrice,
        image: product.images[0] || "",
        variation: product.variation[0] || ""
      })
    );
    toast.success(`${product.title} added to cart`);
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
  );

  return (
    <Link 
      href={`/shop/${product._id}`}
      className="group flex flex-col rounded-2xl bg-card-bg border border-border-accent overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Product Image Cover */}
      <div className="relative h-48 sm:h-52 w-full bg-zinc-100 overflow-hidden">
        {product.images[0] ? (
          <img 
            src={product.images[0]} 
            alt={product.title}
            className="h-full w-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-foreground/30">
            No Image
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-brand-primary-500 text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1">
        <span className="font-sans text-[10px] text-brand-primary-500 font-bold uppercase tracking-wider mb-1">
          {product.brandName}
        </span>
        
        <h3 className="font-display text-base font-bold text-foreground mb-1 group-hover:text-brand-primary-600 dark:group-hover:text-brand-primary-400 transition-colors line-clamp-1">
          {product.title}
        </h3>

        {/* Product Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar 
                key={i} 
                className={`h-3 w-3 ${i < Math.round(product.rating) ? "fill-amber-500" : "text-zinc-300"}`} 
              />
            ))}
          </div>
          <span className="font-sans text-[10px] text-foreground/50">({product.ratedBy})</span>
        </div>

        {/* Pricing Comparison */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-sans text-lg font-bold text-foreground">
            ${product.salePrice.toFixed(2)}
          </span>
          {product.originalPrice > product.salePrice && (
            <span className="font-sans text-xs text-foreground/45 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <Button
          variant="secondary"
          onClick={handleAddToCart}
          className="w-full mt-auto font-sans font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <FiShoppingCart size={16} />
          <span>Add to Cart</span>
        </Button>
      </div>
    </Link>
  );
}
