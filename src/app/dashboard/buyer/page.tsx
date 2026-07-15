"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchTransactionHistory, TransactionRecord } from "@/lib/api/transaction";
import { addToCart } from "@/lib/store/slices/cartSlice";
import { removeFromWishlist } from "@/lib/store/slices/wishlistSlice";
import { Button } from "@heroui/react";
import {
  FiPackage,
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiAlertTriangle,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiCheck,
  FiTruck,
  FiArchive,
  FiHome,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Link from "next/link";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDaysSince(isoDate: string): number {
  const orderDate = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - orderDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getActiveStep(paymentStatus: string, createdAt: string): number {
  if (paymentStatus !== "completed") return 0;
  const days = getDaysSince(createdAt);
  if (days >= 5) return 4;
  if (days >= 4) return 3;
  if (days >= 2) return 2;
  return 1;
}

// ─── Payment Status Chip ──────────────────────────────────────────────────────

const statusConfig: Record<
  string,
  { label: string; classes: string }
> = {
  completed: {
    label: "Completed",
    classes:
      "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800",
  },
  pending: {
    label: "Pending",
    classes:
      "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800",
  },
  failed: {
    label: "Failed",
    classes:
      "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30 border border-red-200 dark:border-red-800",
  },
  refunded: {
    label: "Refunded",
    classes:
      "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800",
  },
};

function StatusChip({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? {
    label: status,
    classes: "text-foreground/70 bg-foreground/10 border border-border-accent",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Delivery Stepper ─────────────────────────────────────────────────────────

const STEPS = [
  { label: "Order Confirmed", icon: FiCheck },
  { label: "Dispatched", icon: FiArchive },
  { label: "In Transit", icon: FiTruck },
  { label: "Delivered", icon: FiHome },
];

function DeliveryStepper({
  activeStep,
}: {
  activeStep: number;
}) {
  return (
    <div className="flex items-center w-full mt-3 overflow-x-auto pb-1">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = activeStep > stepNumber;
        const isActive = activeStep === stepNumber;
        const isPending = activeStep < stepNumber;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.label}>
            {/* Step Node */}
            <div className="flex flex-col items-center shrink-0 min-w-[64px]">
              <div className="relative">
                {/* Pulse ring for active step */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-brand-primary-400/30" />
                )}
                <div
                  className={`relative h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isComplete
                      ? "bg-brand-primary-500 border-brand-primary-500 text-white"
                      : isActive
                      ? "bg-brand-primary-500 border-brand-primary-500 text-white shadow-md shadow-brand-primary-500/30"
                      : "bg-card-bg border-border-accent text-foreground/30"
                  }`}
                >
                  <Icon size={13} />
                </div>
              </div>
              <p
                className={`mt-1.5 text-[10px] font-sans font-medium text-center leading-tight max-w-[60px] ${
                  isComplete || isActive
                    ? "text-brand-primary-600 dark:text-brand-primary-400"
                    : "text-foreground/40"
                }`}
              >
                {step.label}
              </p>
            </div>

            {/* Connector line between steps */}
            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 shrink transition-all duration-500 ${
                  activeStep > stepNumber
                    ? "bg-brand-primary-500"
                    : "bg-border-accent"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, index }: { order: TransactionRecord; index: number }) {
  const activeStep = getActiveStep(order.paymentStatus, order.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="rounded-2xl bg-card-bg border border-border-accent shadow-sm p-5 flex flex-col gap-4"
    >
      {/* Order header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="font-sans text-xs text-foreground/45 font-medium tracking-wide uppercase">
            Order Reference
          </p>
          <p className="font-mono text-xs text-foreground/70 break-all">
            {order.transactionId}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusChip status={order.paymentStatus} />
          <span className="font-display text-base font-bold text-brand-primary-600 dark:text-brand-primary-400">
            ${order.totalAmount.toFixed(2)}{" "}
            <span className="text-xs font-sans font-normal text-foreground/50 uppercase">
              {order.currency}
            </span>
          </span>
        </div>
      </div>

      {/* Delivery stepper */}
      <DeliveryStepper activeStep={activeStep} />

      {/* Items list */}
      <div className="flex flex-col gap-2">
        <p className="font-sans text-xs font-semibold text-foreground/50 uppercase tracking-wide">
          Items ({order.items.length})
        </p>
        <div className="flex flex-col gap-1.5">
          {order.items.map((item, i) => (
            <div
              key={`${item.product}-${i}`}
              className="flex items-center justify-between gap-2 rounded-xl bg-foreground/[0.03] border border-border-accent/40 px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-semibold text-foreground truncate">
                  {item.title}
                </p>
                {item.variation && (
                  <p className="font-sans text-xs text-foreground/50 mt-0.5">
                    Variation: {item.variation}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-right shrink-0">
                <span className="font-sans text-xs text-foreground/50">
                  x{item.quantity}
                </span>
                <span className="font-sans text-sm font-bold text-foreground">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer meta */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border-accent/30 text-xs font-sans text-foreground/50">
        {/* Date placed */}
        <div className="flex items-center gap-1.5">
          <FiCalendar size={11} />
          <span>Placed: {formatDate(order.createdAt)}</span>
        </div>

        {/* Shipping address */}
        {order.shippingAddress && (
          <div className="flex items-center gap-1.5">
            <FiMapPin size={11} />
            <span className="truncate max-w-[200px]">
              {order.shippingAddress.line1}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.country}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = "orders" | "wishlist";

export default function BuyerDashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isAuthenticated, role, email, name } = useSelector(
    (state: RootState) => state.user
  );
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.items || []
  );

  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<TransactionRecord[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // ── Auth guard ──
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("Authentication required. Redirecting to login...");
      router.push("/login?redirect=/dashboard/buyer");
      return;
    }
    if (role === "admin") {
      router.push("/items/manage");
      return;
    }
    setAuthChecked(true);
  }, [isAuthenticated, role, router]);

  // ── Fetch order history ──
  useEffect(() => {
    if (!authChecked) return;

    const loadOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const data = await fetchTransactionHistory();
        setOrders(data.transactions);
      } catch (err: any) {
        console.error("Failed to load order history:", err);
        setOrdersError("Placeholder [DataLoadFailed]");
        toast.error("Failed to load order history.");
      } finally {
        setIsLoadingOrders(false);
      }
    };

    loadOrders();
  }, [authChecked]);

  // ── Wishlist actions ──
  const handleAddToCart = (item: (typeof wishlistItems)[0]) => {
    dispatch(
      addToCart({
        product: item.product,
        title: item.title,
        quantity: 1,
        price: item.price,
        image: item.image,
      })
    );
    toast.success(`"${item.title}" added to cart!`);
  };

  const handleRemoveFromWishlist = (productId: string, title: string) => {
    dispatch(removeFromWishlist(productId));
    toast.info(`"${title}" removed from wishlist.`);
  };

  // ── Display guard while auth is resolving ──
  if (!authChecked) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-foreground/10 border-t-brand-primary-500" />
          <p className="font-sans text-sm font-medium text-foreground/70 animate-pulse">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            My Dashboard
          </h1>
          <p className="mt-1 font-sans text-sm text-foreground/55">
            Welcome back,{" "}
            <span className="font-semibold text-foreground/80">
              {name ?? email ?? "Customer"}
            </span>
            . Here's a summary of your orders and wishlist.
          </p>
        </motion.div>

        {/* ── Tab Switcher ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-2 mb-6 border-b border-border-accent"
        >
          {(
            [
              { key: "orders", label: "Orders", icon: FiPackage },
              { key: "wishlist", label: "Wishlist", icon: FiHeart },
            ] as { key: Tab; label: string; icon: React.ElementType }[]
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              id={`tab-${key}`}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-sans font-semibold border-b-2 -mb-px transition-all duration-200 cursor-pointer ${
                activeTab === key
                  ? "border-brand-primary-500 text-brand-primary-600 dark:text-brand-primary-400"
                  : "border-transparent text-foreground/50 hover:text-foreground/80 hover:border-border-accent"
              }`}
            >
              <Icon size={15} />
              {label}
              {key === "wishlist" && wishlistItems.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary-100 dark:bg-brand-primary-900/40 text-[10px] font-bold text-brand-primary-600 dark:text-brand-primary-400">
                  {wishlistItems.length}
                </span>
              )}
              {key === "orders" && !isLoadingOrders && orders.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary-100 dark:bg-brand-primary-900/40 text-[10px] font-bold text-brand-primary-600 dark:text-brand-primary-400">
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* ── Tab Panels ── */}
        <AnimatePresence mode="wait">

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {isLoadingOrders ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-foreground/10 border-t-brand-primary-500" />
                  <p className="font-sans text-sm text-foreground/50 animate-pulse">
                    Loading your orders...
                  </p>
                </div>
              ) : ordersError || orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl border border-dashed border-border-accent">
                  <div className="h-16 w-16 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/30">
                    <FiPackage size={30} />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-lg font-bold text-foreground/60">
                      No Orders Yet
                    </p>
                    <p className="font-sans text-sm text-foreground/40 mt-1">
                      {ordersError === "Placeholder [DataLoadFailed]"
                        ? "Placeholder [DataLoadFailed]"
                        : "Your completed orders will appear here."}
                    </p>
                  </div>
                  <Link href="/shop">
                    <Button
                      variant="primary"
                      className="font-sans font-semibold rounded-xl cursor-pointer mt-2 flex items-center gap-2"
                    >
                      <FiShoppingCart size={15} />
                      Browse the Shop
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {orders.map((order, index) => (
                    <OrderCard key={order._id} order={order} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <motion.div
              key="wishlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl border border-dashed border-border-accent">
                  <div className="h-16 w-16 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/30">
                    <FiHeart size={30} />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-lg font-bold text-foreground/60">
                      Wishlist is Empty
                    </p>
                    <p className="font-sans text-sm text-foreground/40 mt-1">
                      Placeholder [DataLoadFailed]
                    </p>
                  </div>
                  <Link href="/shop">
                    <Button
                      variant="primary"
                      className="font-sans font-semibold rounded-xl cursor-pointer mt-2 flex items-center gap-2"
                    >
                      <FiShoppingCart size={15} />
                      Discover Products
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {wishlistItems.map((item, index) => (
                      <motion.div
                        key={item.product}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.28, delay: index * 0.05 }}
                        className="flex items-center gap-4 rounded-2xl bg-card-bg border border-border-accent shadow-sm p-4"
                      >
                        {/* Product image */}
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-16 w-16 rounded-xl object-cover border border-border-accent/40 shrink-0"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-xl bg-foreground/5 border border-border-accent/40 flex items-center justify-center shrink-0 text-foreground/30">
                            <FiPackage size={22} />
                          </div>
                        )}

                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-base font-bold text-foreground truncate">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <FiDollarSign size={12} className="text-brand-primary-500" />
                            <span className="font-sans text-sm font-semibold text-brand-primary-600 dark:text-brand-primary-400">
                              {item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            id={`wishlist-add-${item.product}`}
                            variant="primary"
                            onPress={() => handleAddToCart(item)}
                            className="font-sans font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 text-sm h-9 px-3"
                          >
                            <FiShoppingCart size={13} />
                            <span className="hidden sm:inline">Add to Cart</span>
                          </Button>
                          <button
                            id={`wishlist-remove-${item.product}`}
                            onClick={() =>
                              handleRemoveFromWishlist(item.product, item.title)
                            }
                            className="h-9 w-9 rounded-xl border border-border-accent bg-foreground/[0.03] text-foreground/50 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all flex items-center justify-center cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
