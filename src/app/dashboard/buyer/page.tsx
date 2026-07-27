"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchTransactionHistory, TransactionRecord } from "@/lib/api/transaction";

import { Button } from "@heroui/react";
import {
  FiPackage,
  FiShoppingCart,
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

function getActiveStep(orderStatus: string): number {
  switch (orderStatus) {
    case "pending":    return 1;
    case "processing": return 1;
    case "shipped":    return 2;
    case "delivered":  return 3;
    case "complete":
    case "completed":  return 4;
    default:           return 1;
  }
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

// ─── Order Status Badge ──────────────────────────────────────────────────────

const orderStatusConfig: Record<string, { label: string; classes: string }> = {
  pending:    { label: "Pending",    classes: "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800" },
  processing: { label: "Processing", classes: "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800" },
  shipped:    { label: "Shipped",    classes: "text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800" },
  delivered:  { label: "Delivered", classes: "text-teal-700 bg-teal-100 dark:text-teal-300 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800" },
  complete:   { label: "Complete",  classes: "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800" },
  completed:  { label: "Complete",  classes: "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800" },
  cancelled:  { label: "Cancelled", classes: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30 border border-red-200 dark:border-red-800" },
  canceled:   { label: "Cancelled", classes: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30 border border-red-200 dark:border-red-800" },
};

function OrderStatusChip({ status }: { status: string }) {
  const cfg = orderStatusConfig[status] ?? {
    label: status,
    classes: "text-foreground/70 bg-foreground/10 border border-border-accent",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, index }: { order: TransactionRecord; index: number }) {
  const activeStep = getActiveStep(order.orderStatus);

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
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <OrderStatusChip status={order.orderStatus} />
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

type Tab = "orders" | "purchased";

export default function BuyerDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isAuthenticated, role, email, name } = useSelector(
    (state: RootState) => state.user
  );
  const initialTab = (searchParams.get("tab") as Tab) || "orders";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [orders, setOrders] = useState<TransactionRecord[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const pollingRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const activeOrders = useMemo(() => {
    return orders.filter(
      (order) => order.orderStatus !== "complete" && order.orderStatus !== "completed"
    );
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter(
      (order) => order.orderStatus === "complete" || order.orderStatus === "completed"
    );
  }, [orders]);

  // ── Auth guard ──
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("Authentication required. Redirecting to login...");
      router.push("/login?redirect=/dashboard/buyer");
      return;
    }
    if (role === "admin") {
      router.push("/dashboard/admin");
      return;
    }
    setAuthChecked(true);
  }, [isAuthenticated, role, router]);

  // ── Fetch order history + poll every 30s ──
  useEffect(() => {
    if (!authChecked) return;

    const loadOrders = async (silent = false) => {
      try {
        if (!silent) setIsLoadingOrders(true);
        const data = await fetchTransactionHistory();
        setOrders(data.transactions);
        setOrdersError(null);
      } catch (err: any) {
        console.error("Failed to load order history:", err);
        if (!silent) {
          setOrdersError("Placeholder [DataLoadFailed]");
          toast.error("Failed to load order history.");
        }
      } finally {
        if (!silent) setIsLoadingOrders(false);
      }
    };

    loadOrders();

    // Poll silently every 30 seconds to pick up admin status changes
    pollingRef.current = setInterval(() => loadOrders(true), 30000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [authChecked]);


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
              { key: "purchased", label: "Purchase History", icon: FiArchive },
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
              {key === "orders" && !isLoadingOrders && activeOrders.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary-100 dark:bg-brand-primary-900/40 text-[10px] font-bold text-brand-primary-600 dark:text-brand-primary-400">
                  {activeOrders.length}
                </span>
              )}
              {key === "purchased" && !isLoadingOrders && completedOrders.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary-100 dark:bg-brand-primary-900/40 text-[10px] font-bold text-brand-primary-600 dark:text-brand-primary-400">
                  {completedOrders.reduce((sum, o) => sum + o.items.length, 0)}
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
              ) : ordersError || activeOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl border border-dashed border-border-accent">
                  <div className="h-16 w-16 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/30">
                    <FiPackage size={30} />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-lg font-bold text-foreground/60">
                      No Active Orders
                    </p>
                    <p className="font-sans text-sm text-foreground/40 mt-1">
                      {ordersError === "Placeholder [DataLoadFailed]"
                        ? "Could not load your order history. Please try again later."
                        : "Your active orders will appear here."}
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
                  {activeOrders.map((order, index) => (
                    <OrderCard key={order._id} order={order} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Purchase History Tab */}
          {activeTab === "purchased" && (
            <motion.div
              key="purchased"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {isLoadingOrders ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-foreground/10 border-t-brand-primary-500" />
                  <p className="font-sans text-sm text-foreground/50 animate-pulse">
                    Loading purchase history...
                  </p>
                </div>
              ) : ordersError || completedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl border border-dashed border-border-accent">
                  <div className="h-16 w-16 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/30">
                    <FiArchive size={30} />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-lg font-bold text-foreground/60">
                      No Purchase History
                    </p>
                    <p className="font-sans text-sm text-foreground/40 mt-1">
                      Completed items you buy will show up here.
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
                <div className="flex flex-col gap-2">
                  {completedOrders.flatMap((order) =>
                    order.items.map((item) => ({
                      ...item,
                      transactionId: order.transactionId,
                      paymentStatus: order.paymentStatus,
                      orderDate: order.createdAt,
                    }))
                  ).map((entry, index) => (
                    <motion.div
                      key={`${entry.transactionId}-${entry.product}-${index}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                      className="flex items-center gap-4 rounded-2xl bg-card-bg border border-border-accent shadow-sm p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-primary-500/10 text-brand-primary-500">
                        <FiPackage size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/shop/${entry.product}`}
                          className="font-display text-base font-bold text-foreground truncate hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors"
                        >
                          {entry.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs font-sans text-foreground/50">
                          <span className="flex items-center gap-1">
                            <FiDollarSign size={11} />
                            ${entry.price.toFixed(2)}
                          </span>
                          <span>x{entry.quantity}</span>
                          <span className="flex items-center gap-1">
                            <FiCalendar size={11} />
                            {new Date(entry.orderDate).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusChip status={entry.paymentStatus} />
                        <span className="font-mono text-[10px] text-foreground/40 max-w-[80px] truncate hidden sm:inline" title={entry.transactionId}>
                          {entry.transactionId.slice(0, 12)}...
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
