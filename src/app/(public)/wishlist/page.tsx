"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { addToCart } from "@/lib/store/slices/cartSlice";
import { removeFromWishlist, clearWishlist } from "@/lib/store/slices/wishlistSlice";
import { syncRemoveFromWishlist } from "@/lib/api/wishlist";
import { Button } from "@heroui/react";
import { FiHeart, FiShoppingCart, FiTrash2, FiDollarSign, FiPackage, FiArrowLeft, FiTrash } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items || []);

  const handleAddToCart = (item: (typeof wishlistItems)[0]) => {
    dispatch(
      addToCart({
        product: item.product,
        title: item.title,
        quantity: 1,
        price: item.price,
        image: item.image || "",
      })
    );
    toast.success(`"${item.title}" added to cart!`);
  };

  const handleRemove = (productId: string, title: string) => {
    dispatch(removeFromWishlist(productId));
    if (isAuthenticated) {
      syncRemoveFromWishlist(productId).catch(() => {});
    }
    toast.info(`"${title}" removed from wishlist.`);
  };

  const handleClearAll = () => {
    if (wishlistItems.length === 0) return;
    const ids = wishlistItems.map((i) => i.product);
    dispatch(clearWishlist());
    if (isAuthenticated) {
      ids.forEach((id) => syncRemoveFromWishlist(id).catch(() => {}));
    }
    toast.info("Wishlist cleared.");
  };

  return (
    <main className="flex-1 bg-background min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="h-9 w-9 rounded-xl border border-border-accent flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-card-bg transition-colors cursor-pointer"
                aria-label="Go back"
              >
                <FiArrowLeft size={16} />
              </button>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                My Wishlist
              </h1>
            </div>
            <p className="mt-2 font-sans text-sm text-foreground/55 ml-12">
              {wishlistItems.length === 0
                ? "Your wishlist is empty."
                : `${wishlistItems.length} item${wishlistItems.length > 1 ? "s" : ""} saved.`}
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <Button
              variant="ghost"
              onPress={handleClearAll}
              className="font-sans text-sm font-semibold rounded-xl cursor-pointer flex items-center gap-2 text-danger shrink-0"
            >
              <FiTrash size={14} />
              Clear All
            </Button>
          )}
        </motion.div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center justify-center py-24 gap-5 rounded-2xl border border-dashed border-border-accent"
          >
            <div className="h-20 w-20 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/20">
              <FiHeart size={38} />
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-bold text-foreground/60">
                Your Wishlist is Empty
              </p>
              <p className="font-sans text-sm text-foreground/40 mt-1.5 max-w-sm">
                Start saving your favorite items by tapping the heart icon on any product.
              </p>
            </div>
            <Link href="/shop">
              <Button
                variant="primary"
                className="font-sans font-semibold rounded-xl cursor-pointer flex items-center gap-2 mt-2"
              >
                <FiShoppingCart size={15} />
                Browse Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Count badge for screen readers */}
            <p className="sr-only" role="status">
              {wishlistItems.length} item{wishlistItems.length > 1 ? "s" : ""} in wishlist
            </p>

            <AnimatePresence initial={false}>
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.product}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.28, delay: index * 0.04 }}
                  className="flex items-center gap-4 rounded-2xl bg-card-bg border border-border-accent shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  {/* Product image */}
                  <Link href={`/shop/${item.product}`} className="shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-20 rounded-xl object-cover border border-border-accent/40"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-xl bg-foreground/5 border border-border-accent/40 flex items-center justify-center text-foreground/30">
                        <FiPackage size={26} />
                      </div>
                    )}
                  </Link>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.product}`}>
                      <p className="font-display text-base font-bold text-foreground truncate hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors">
                        {item.title}
                      </p>
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <FiDollarSign size={13} className="text-brand-primary-500" />
                      <span className="font-sans text-base font-bold text-brand-primary-600 dark:text-brand-primary-400">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="primary"
                      onPress={() => handleAddToCart(item)}
                      className="font-sans font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 text-sm h-10 px-4"
                    >
                      <FiShoppingCart size={14} />
                      <span className="hidden sm:inline">Add to Cart</span>
                    </Button>
                    <button
                      onClick={() => handleRemove(item.product, item.title)}
                      className="h-10 w-10 rounded-xl border border-border-accent bg-foreground/[0.03] text-foreground/50 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all flex items-center justify-center cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Footer link back to dashboard */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 text-center"
          >
            <Link
              href="/dashboard/buyer"
              className="font-sans text-sm text-foreground/50 hover:text-brand-primary-500 transition-colors"
            >
              Go to My Dashboard
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}
