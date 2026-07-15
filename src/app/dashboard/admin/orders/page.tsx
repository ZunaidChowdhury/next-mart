"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  fetchAllOrders,
  updateOrderStatus,
  AdminOrder,
} from "@/lib/api/admin";
import {
  FiSearch,
  FiPackage,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiDollarSign,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
  { value: "processing", label: "Processing", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { value: "shipped", label: "Shipped", color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
  { value: "delivered", label: "Delivered", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
  { value: "cancelled", label: "Cancelled", color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800" },
];

const PAYMENT_COLORS: Record<string, string> = {
  completed: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  pending: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  failed: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800",
  refunded: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800",
};

function StatusBadge({ value, color }: { value: string; color?: string }) {
  const cfg = STATUS_OPTIONS.find((s) => s.value === value);
  const classes = color ?? cfg?.color ?? "text-foreground/70 bg-foreground/10 border border-border-accent";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans ${classes}`}
    >
      {cfg?.label ?? value}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function OrderRow({
  order,
  onStatusChange,
}: {
  order: AdminOrder;
  onStatusChange: (id: string, status: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  return (
    <>
      <tr
        className="border-b border-border-accent/40 hover:bg-foreground/[0.02] transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="py-3 pl-4">
          <span className="font-mono text-xs text-foreground/60 truncate max-w-[100px] block">
            {order.transactionId.slice(0, 14)}...
          </span>
        </td>
        <td className="py-3">
          <span className="font-sans text-sm font-medium text-foreground">
            {order.user?.name ?? "Unknown"}
          </span>
        </td>
        <td className="py-3">
          <span className="font-sans text-sm text-foreground/70">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </span>
        </td>
        <td className="py-3">
          <span className="font-display text-sm font-bold text-foreground">
            ${order.totalAmount.toFixed(2)}
          </span>
        </td>
        <td className="py-3">
          <StatusBadge value={order.orderStatus} />
        </td>
        <td className="py-3">
          <StatusBadge
            value={order.paymentStatus}
            color={PAYMENT_COLORS[order.paymentStatus]}
          />
        </td>
        <td className="py-3 pr-4 text-right">
          <span className="font-sans text-xs text-foreground/50">
            {formatDate(order.createdAt)}
          </span>
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <td colSpan={7} className="p-0">
              <div className="bg-foreground/[0.02] border-b border-border-accent/40 px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-sans text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-3">
                      Customer & Shipping
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-sans text-foreground/70">
                        <FiUser size={13} className="shrink-0 text-foreground/40" />
                        <span>{order.user?.name ?? "N/A"}</span>
                        <span className="text-foreground/40">·</span>
                        <span className="text-foreground/50">{order.user?.email ?? ""}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm font-sans text-foreground/70">
                        <FiMapPin size={13} className="shrink-0 mt-0.5 text-foreground/40" />
                        <span>
                          {order.shippingAddress?.line1},{" "}
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.state}{" "}
                          {order.shippingAddress?.postalCode},{" "}
                          {order.shippingAddress?.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-sans text-foreground/70">
                        <FiCalendar size={13} className="shrink-0 text-foreground/40" />
                        <span>Ordered: {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-sans text-foreground/70">
                        <FiDollarSign size={13} className="shrink-0 text-foreground/40" />
                        <span>
                          Total: <strong>${order.totalAmount.toFixed(2)}</strong>{" "}
                          <span className="uppercase text-foreground/40 text-xs">
                            {order.currency}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-3">
                      Update Status
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          disabled={updating || order.orderStatus === opt.value}
                          onClick={async (e) => {
                            e.stopPropagation();
                            setUpdating(true);
                            try {
                              await onStatusChange(order._id, opt.value);
                            } finally {
                              setUpdating(false);
                            }
                          }}
                          className={`text-xs font-sans font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                            order.orderStatus === opt.value
                              ? opt.color + " ring-2 ring-offset-1 ring-offset-transparent"
                              : "text-foreground/50 border-border-accent hover:bg-foreground/[0.04]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-border-accent/30">
                  <h4 className="font-sans text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-3">
                    Items
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-3 rounded-xl bg-foreground/[0.03] border border-border-accent/30 px-4 py-2.5"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-semibold text-foreground truncate">
                            {item.title}
                          </p>
                          {item.variation && (
                            <p className="font-sans text-xs text-foreground/50 mt-0.5">
                              {item.variation}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-right shrink-0">
                          <span className="font-sans text-xs text-foreground/50">
                            x{item.quantity}
                          </span>
                          <span className="font-sans text-sm font-bold text-foreground min-w-[60px]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const loadOrders = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const data = await fetchAllOrders(page, 20, statusFilter || undefined, search || undefined);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err: any) {
      console.error("Failed to load orders:", err);
      toast.error("Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    loadOrders(1);
  }, [loadOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      toast.success(`Order status updated to "${newStatus}".`);
    } catch (err: any) {
      toast.error("Failed to update order status.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    loadOrders(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.pages) return;
    loadOrders(page);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Orders
          </h1>
          <p className="mt-1 font-sans text-sm text-foreground/55">
            Manage and process customer orders.
          </p>
        </div>
        <button
          onClick={() => loadOrders(pagination.page)}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/[0.04] border border-border-accent transition-all cursor-pointer disabled:opacity-50 self-start"
        >
          <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by transaction ID or address..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-card-bg border border-border-accent text-sm font-sans text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-brand-primary-500/30 focus:border-brand-primary-500 transition-all"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter("")}
          className={`shrink-0 text-xs font-sans font-semibold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
            !statusFilter
              ? "bg-brand-primary-500 text-white border-brand-primary-500"
              : "text-foreground/60 border-border-accent hover:bg-foreground/[0.04]"
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`shrink-0 text-xs font-sans font-semibold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              statusFilter === opt.value
                ? opt.color + " ring-2 ring-offset-1"
                : "text-foreground/60 border-border-accent hover:bg-foreground/[0.04]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-card-bg border border-border-accent shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-foreground/10 border-t-brand-primary-500" />
            <p className="font-sans text-sm text-foreground/50 animate-pulse">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-16 w-16 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/30">
              <FiPackage size={30} />
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-bold text-foreground/60">
                No Orders Found
              </p>
              <p className="font-sans text-sm text-foreground/40 mt-1">
                {statusFilter
                  ? `No orders with status "${statusFilter}".`
                  : "No orders have been placed yet."}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-accent">
                  <th className="text-left py-3 px-4 font-sans text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                    Transaction
                  </th>
                  <th className="text-left py-3 font-sans text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="text-left py-3 font-sans text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                    Items
                  </th>
                  <th className="text-left py-3 font-sans text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="text-left py-3 font-sans text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                    Order
                  </th>
                  <th className="text-left py-3 font-sans text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                    Payment
                  </th>
                  <th className="text-right py-3 pr-4 font-sans text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <OrderRow
                    key={order._id}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="h-9 w-9 rounded-xl border border-border-accent flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-foreground/[0.04] transition-all cursor-pointer disabled:opacity-30"
          >
            <FiChevronLeft size={15} />
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - pagination.page) <= 2 || p === 1 || p === pagination.pages)
            .map((p, idx, arr) => (
              <React.Fragment key={p}>
                {idx > 0 && arr[idx - 1] !== p - 1 && (
                  <span className="text-foreground/30 text-sm px-1">...</span>
                )}
                <button
                  onClick={() => handlePageChange(p)}
                  className={`h-9 min-w-[36px] px-2 rounded-xl text-sm font-sans font-semibold transition-all cursor-pointer ${
                    p === pagination.page
                      ? "bg-brand-primary-500 text-white"
                      : "text-foreground/60 border border-border-accent hover:bg-foreground/[0.04]"
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="h-9 w-9 rounded-xl border border-border-accent flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-foreground/[0.04] transition-all cursor-pointer disabled:opacity-30"
          >
            <FiChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
