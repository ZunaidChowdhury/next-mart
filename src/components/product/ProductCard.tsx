"use client";

import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { addToCart } from "@/lib/store/slices/cartSlice";
import { toggleWishlist, WishlistItem } from "@/lib/store/slices/wishlistSlice";
import { syncAddToWishlist, syncRemoveFromWishlist } from "@/lib/api/wishlist";
import { Button } from "@heroui/react";
import { FiShoppingCart, FiStar, FiHeart, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import { IProductItem } from "@/lib/api/product";

interface ProductCardProps {
  product: IProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.product === product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItem: WishlistItem = {
      product: product._id,
      title: product.title,
      price: product.salePrice,
      image: product.images[0],
    };
    dispatch(toggleWishlist(wishlistItem));

    if (isAuthenticated) {
      if (isInWishlist) {
        syncRemoveFromWishlist(product._id).catch(() => {});
      } else {
        syncAddToWishlist(product._id).catch(() => {});
      }
    }

    toast.success(
      isInWishlist ? `${product.title} removed from wishlist` : `${product.title} added to wishlist`
    );
  };

  const discountPercent =
    product.originalPrice > product.salePrice
      ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
      : 0;

  const inStock = product.availableStatus === "in-stock";

  return (
    <div className="group flex flex-col rounded-2xl bg-card-bg border border-border-accent overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Product Image Cover */}
      <Link href={`/shop/${product._id}`} className="relative h-48 sm:h-52 w-full bg-zinc-100 overflow-hidden block">
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

        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-brand-primary-500 text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 flex items-center justify-center h-8 w-8 rounded-full transition-colors cursor-pointer ${
            isInWishlist
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-white/80 text-foreground/60 hover:bg-white hover:text-red-400"
          }`}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart size={16} className={isInWishlist ? "fill-red-500" : ""} />
        </button>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1">
        <span className="font-sans text-[10px] text-brand-primary-500 font-bold uppercase tracking-wider mb-1">
          {product.brandName}
        </span>

        <Link href={`/shop/${product._id}`}>
          <h3 className="font-display text-base font-bold text-foreground mb-1 group-hover:text-brand-primary-600 dark:group-hover:text-brand-primary-400 transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="font-sans text-xs text-foreground/60 line-clamp-2 mb-3">
          {product.overview || product.description}
        </p>

        {/* Rating + Availability */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
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
          <span
            className={`font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              inStock
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Pricing */}
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-auto">
          <Button
            variant="secondary"
            onClick={handleAddToCart}
            isDisabled={!inStock}
            className="flex-1 font-sans font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm h-10 min-w-0"
          >
            <FiShoppingCart size={15} className="shrink-0" />
            <span className="truncate">Add to Cart</span>
          </Button>
          <Link href={`/shop/${product._id}`} className="shrink-0">
            <Button
              variant="ghost"
              className="font-sans font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer h-10 w-10 min-w-0 p-0"
            >
              <FiEye size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
