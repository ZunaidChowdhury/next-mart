"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/store/slices/cartSlice";
import { toggleWishlist } from "@/lib/store/slices/wishlistSlice";
import { RootState } from "@/lib/store";
import { Button } from "@heroui/react";
import { 
  FiShoppingCart, 
  FiStar, 
  FiHeart, 
  FiCheck, 
  FiAlertCircle,
  FiFileText,
  FiSettings,
  FiMessageSquare,
  FiChevronRight
} from "react-icons/fi";
import { toast } from "react-toastify";
import { IProductItem } from "@/lib/api/product";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailsProps {
  product: IProductItem;
}

type TabType = "description" | "features" | "specifications" | "reviews";

export default function ProductDetails({ product }: ProductDetailsProps) {
  const dispatch = useDispatch();
  const [activeImage, setActiveImage] = useState(product.images[0] || "");
  const [selectedVariation, setSelectedVariation] = useState(product.variation[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("description");

  // Fetch wishlist state from store
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items || []);
  const isWishlisted = wishlistItems.some((item) => item.product === product._id);

  const isOutOfStock = product.stockCount <= 0 || product.availableStatus === "out-of-stock";

  const discountPercent = Math.round(
    ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
  );

  const handleIncrement = () => {
    if (quantity < product.stockCount) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.warning(`Cannot exceed available stock limit (${product.stockCount} items)`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch(
      addToCart({
        product: product._id,
        title: product.title,
        quantity: quantity,
        price: product.salePrice,
        image: product.images[0] || "",
        variation: selectedVariation || undefined,
      })
    );
    toast.success(`${product.title} (${quantity} units) added to cart`);
  };

  const handleToggleWishlist = () => {
    dispatch(
      toggleWishlist({
        product: product._id,
        title: product.title,
        price: product.salePrice,
        image: product.images[0] || "",
      })
    );
    if (isWishlisted) {
      toast.info(`Removed ${product.title} from wishlist`);
    } else {
      toast.success(`Added ${product.title} to wishlist`);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ComponentType<any> }[] = [
    { id: "description", label: "Description", icon: FiFileText },
    { id: "features", label: "Key Features", icon: FiSettings },
    { id: "specifications", label: "Specifications", icon: FiSettings },
    { id: "reviews", label: `Reviews (${product.reviews?.length || 0})`, icon: FiMessageSquare },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Breadcrumbs Row */}
      <nav className="flex items-center gap-2 text-xs text-foreground/50 font-sans">
        <Link href="/" className="hover:text-brand-primary-500 transition-colors">
          Home
        </Link>
        <FiChevronRight size={12} className="text-foreground/30" />
        <Link href="/shop" className="hover:text-brand-primary-500 transition-colors">
          Shop
        </Link>
        <FiChevronRight size={12} className="text-foreground/30" />
        <span className="text-foreground/80 font-medium truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      {/* Main product page grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery Viewer */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-2xl border border-border-accent bg-zinc-50 dark:bg-zinc-900/40 overflow-hidden flex items-center justify-center">
            {activeImage ? (
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={product.title}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full object-contain p-4 sm:p-6"
              />
            ) : (
              <span className="text-foreground/30 text-sm">No Image Available</span>
            )}
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-brand-primary-500 text-white font-sans text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-zinc-50 dark:bg-zinc-900/40 ${
                    activeImage === img
                      ? "border-brand-primary-500 shadow-md ring-2 ring-brand-primary-500/20"
                      : "border-border-accent hover:border-foreground/35"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} gallery thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Configuration */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="font-sans text-xs sm:text-sm text-brand-primary-500 font-extrabold uppercase tracking-wider">
              {product.brandName}
            </span>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isOutOfStock
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {isOutOfStock ? (
                <>
                  <FiAlertCircle size={14} />
                  <span>Out of stock</span>
                </>
              ) : (
                <>
                  <FiCheck size={14} />
                  <span>In Stock ({product.stockCount} left)</span>
                </>
              )}
            </div>
          </div>

          {/* Title & Model */}
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight mb-2">
            {product.title}
          </h1>
          {product.model && (
            <p className="font-sans text-xs text-foreground/50 mb-3">
              Model: <span className="font-semibold text-foreground/80">{product.model}</span>
            </p>
          )}

          {/* Rating Summary */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating) ? "fill-amber-500 text-amber-500" : "text-zinc-300 dark:text-zinc-700"
                  }`}
                />
              ))}
            </div>
            <span className="font-sans text-xs text-foreground/60">
              {product.rating.toFixed(1)} rating ({product.ratedBy} reviews)
            </span>
          </div>

          <hr className="my-2 border-t border-border-accent/40" />

          {/* Price Comparisons */}
          <div className="my-4">
            <div className="flex items-baseline gap-3">
              <span className="font-sans text-3xl font-extrabold text-foreground">
                ${product.salePrice.toFixed(2)}
              </span>
              {product.originalPrice > product.salePrice && (
                <>
                  <span className="font-sans text-lg text-foreground/45 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="font-sans text-xs font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Save ${(product.originalPrice - product.salePrice).toFixed(2)}
                  </span>
                </>
              )}
            </div>
            <p className="font-sans text-xs text-foreground/45 mt-1">Local taxes included if applicable</p>
          </div>

          {/* Overview text */}
          <p className="font-sans text-sm text-foreground/75 leading-relaxed mb-6">
            {product.overview}
          </p>

          {/* Variations Selection */}
          {product.variation && product.variation.length > 0 && (
            <div className="mb-6">
              <span className="block font-sans text-xs font-bold uppercase text-foreground/70 mb-3 tracking-wider">
                Select Variation
              </span>
              <div className="flex flex-wrap gap-2.5">
                {product.variation.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariation(v)}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      selectedVariation === v
                        ? "border-brand-primary-500 bg-brand-primary-500/10 text-brand-primary-600 dark:text-brand-primary-400 font-bold shadow-sm"
                        : "border-border-accent bg-card-bg text-foreground/80 hover:bg-background hover:text-foreground"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2 mb-8">
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center justify-between border border-border-accent bg-card-bg rounded-xl p-1 h-12 w-full sm:w-32 flex-shrink-0">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-10 h-full flex items-center justify-center text-foreground/60 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  -
                </button>
                <span className="font-sans font-semibold text-sm text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.stockCount}
                  className="w-10 h-full flex items-center justify-center text-foreground/60 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>
            )}

            {/* Action Buttons: Cart and Wishlist */}
            <div className="flex items-center gap-3 flex-1">
              <Button
                variant="primary"
                onClick={handleAddToCart}
                isDisabled={isOutOfStock}
                className={`h-12 flex-1 font-sans font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all ${
                  isOutOfStock
                    ? "bg-zinc-200 dark:bg-zinc-800 text-foreground/45 cursor-not-allowed"
                    : "bg-brand-primary-500 text-white hover:bg-brand-primary-600 active:scale-98"
                }`}
              >
                <FiShoppingCart size={18} />
                <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
              </Button>

              <button
                onClick={handleToggleWishlist}
                className={`h-12 w-12 flex-shrink-0 rounded-xl border flex items-center justify-center cursor-pointer transition-all hover:bg-foreground/5 shadow-sm ${
                  isWishlisted
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
                    : "border-border-accent bg-card-bg text-foreground/60 hover:text-foreground"
                }`}
                title="Add to Wishlist"
              >
                <FiHeart size={18} className={isWishlisted ? "fill-rose-500" : ""} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs segment */}
      <div className="mt-8 border-t border-border-accent/40 pt-8">
        <div className="flex border-b border-border-accent/30 overflow-x-auto pb-px scrollbar-none gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-brand-primary-500 text-brand-primary-600 dark:text-brand-primary-400 font-bold"
                    : "border-transparent text-foreground/60 hover:text-foreground/90"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="py-6 min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "description" && (
                <div className="font-sans text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap max-w-4xl">
                  {product.description}
                </div>
              )}

              {activeTab === "features" && (
                <div className="max-w-3xl">
                  {product.coreFeatures && product.coreFeatures.length > 0 ? (
                    <div className="border border-border-accent rounded-2xl overflow-hidden bg-card-bg">
                      <table className="w-full text-left font-sans text-xs sm:text-sm">
                        <tbody>
                          {product.coreFeatures.map((feat, idx) => (
                            <tr
                              key={idx}
                              className="border-b border-border-accent/30 last:border-b-0 hover:bg-background/20 transition-colors"
                            >
                              <td className="w-1/3 py-3.5 px-4 font-bold text-foreground/75 bg-foreground/3 whitespace-nowrap">
                                {feat.name}
                              </td>
                              <td className="py-3.5 px-4 text-foreground/80">
                                {feat.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-foreground/50 text-xs sm:text-sm italic py-4">
                      No core features listed for this product.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="max-w-3xl">
                  {product.specification && product.specification.length > 0 ? (
                    <div className="border border-border-accent rounded-2xl overflow-hidden bg-card-bg">
                      <table className="w-full text-left font-sans text-xs sm:text-sm">
                        <tbody>
                          {product.specification.map((spec, idx) => (
                            <tr
                              key={idx}
                              className="border-b border-border-accent/30 last:border-b-0 hover:bg-background/20 transition-colors"
                            >
                              <td className="w-1/3 py-3.5 px-4 font-bold text-foreground/75 bg-foreground/3 whitespace-nowrap">
                                {spec.name}
                              </td>
                              <td className="py-3.5 px-4 text-foreground/80">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-foreground/50 text-xs sm:text-sm italic py-4">
                      No technical specifications listed.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="flex flex-col gap-6 max-w-4xl">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Customer Experience Logs
                  </h3>
                  
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {product.reviews.map((rev, idx) => (
                        <div
                          key={idx}
                          className="border border-border-accent rounded-2xl bg-card-bg p-4 sm:p-5 flex flex-col gap-2.5 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-display text-sm font-bold text-foreground">
                              {rev.userName}
                            </span>
                            <span className="font-sans text-[10px] sm:text-xs text-foreground/40">
                              {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          
                          <p className="font-sans text-xs sm:text-sm text-foreground/75 leading-relaxed">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-border-accent rounded-2xl bg-card-bg text-foreground/50 font-sans text-sm">
                      No reviews yet. Be the first to share your thoughts!
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
