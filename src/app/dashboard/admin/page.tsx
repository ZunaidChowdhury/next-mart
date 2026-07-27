"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fetchAdminStats, AdminStatsResponse, fetchAllOrders, updateOrderStatus, AdminOrder } from "@/lib/api/admin";
import {
  FiDollarSign,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiTrendingUp,
  FiRefreshCw,
  FiPackage,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#7C3AED",
  delivered: "#10b981",
  cancelled: "#ef4444",
  complete: "#059669",
  completed: "#059669",
};

const DEFAULT_COLOR = "#6b7280";

function StatCard({
  label,
  value,
  icon: Icon,
  prefix,
  isLoading,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  prefix?: string;
  isLoading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card-bg border border-border-accent shadow-sm p-5 flex items-start gap-4"
    >
      <div className="h-12 w-12 rounded-xl bg-brand-primary-500/10 flex items-center justify-center shrink-0">
        <Icon size={22} className="text-brand-primary-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-xs font-medium text-foreground/50 uppercase tracking-wide">
          {label}
        </p>
        {isLoading ? (
          <div className="h-7 w-24 mt-1 rounded-lg bg-foreground/10 animate-pulse" />
        ) : (
          <p className="font-display text-2xl font-extrabold text-foreground mt-0.5 tracking-tight">
            {prefix}{typeof value === "number" ? value.toLocaleString() : value}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err: any) {
      console.error("Failed to load admin stats:", err);
      toast.error("Failed to load dashboard stats.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPendingOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const data = await fetchAllOrders(1, 10, "pending");
      setPendingOrders(data.orders);
    } catch (err: any) {
      console.error("Failed to load pending orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const loadData = useCallback(() => {
    loadStats();
    loadPendingOrders();
  }, [loadStats, loadPendingOrders]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to "${newStatus}".`);
      loadData();
    } catch (err: any) {
      toast.error("Failed to update order status.");
    }
  };

  const chartData =
    stats?.monthlyRevenue.map((m) => ({
      name: MONTH_NAMES[m.month - 1] ?? `M${m.month}`,
      revenue: m.revenue,
      orders: m.orders,
    })) ?? [];

  const pieData =
    stats?.orderStatusDistribution.map((d) => ({
      name: d.status.charAt(0).toUpperCase() + d.status.slice(1),
      value: d.count,
      color: STATUS_COLORS[d.status] ?? DEFAULT_COLOR,
    })) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="mt-1 font-sans text-sm text-foreground/55">
            Key metrics and insights for your store.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/[0.04] border border-border-accent transition-all cursor-pointer disabled:opacity-50"
        >
          <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Revenue"
          value={stats?.totalRevenue ?? 0}
          icon={FiDollarSign}
          prefix="$"
          isLoading={isLoading}
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          icon={FiShoppingBag}
          isLoading={isLoading}
        />
        <StatCard
          label="Products"
          value={stats?.totalProducts ?? 0}
          icon={FiBox}
          isLoading={isLoading}
        />
        <StatCard
          label="Users"
          value={stats?.totalUsers ?? 0}
          icon={FiUsers}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-2xl bg-card-bg border border-border-accent shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <FiTrendingUp size={16} className="text-brand-primary-500" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Revenue Overview
            </h2>
          </div>
          {isLoading ? (
            <div className="h-64 rounded-xl bg-foreground/5 animate-pulse" />
          ) : chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-foreground/40 font-sans text-sm">
              No revenue data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "var(--foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                  opacity={0.5}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  dx={-4}
                  opacity={0.5}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(100,116,139,0.2)",
                    background: "var(--card-bg)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#2563EB" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl bg-card-bg border border-border-accent shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <FiShoppingBag size={16} className="text-brand-primary-500" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Order Status
            </h2>
          </div>
          {isLoading ? (
            <div className="h-64 rounded-xl bg-foreground/5 animate-pulse" />
          ) : pieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-foreground/40 font-sans text-sm">
              No orders yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(100,116,139,0.2)",
                    background: "var(--card-bg)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span className="font-sans text-xs text-foreground/70">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Pending Orders */}
      <div className="rounded-2xl bg-card-bg border border-border-accent shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FiPackage size={18} className="text-brand-primary-500" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Recent Pending Orders
            </h2>
          </div>
          <span className="text-xs font-sans text-foreground/50">
            {pendingOrders.length} pending order{pendingOrders.length !== 1 ? "s" : ""}
          </span>
        </div>

        {ordersLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground/10 border-t-brand-primary-500" />
            <p className="font-sans text-xs text-foreground/50">Loading pending orders...</p>
          </div>
        ) : pendingOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 border border-dashed border-border-accent/40 rounded-xl bg-foreground/[0.01]">
            <div className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/30">
              <FiCheckCircle size={18} />
            </div>
            <p className="font-sans text-xs text-foreground/50">No pending orders to process.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead>
                <tr className="border-b border-border-accent/50 text-foreground/40 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 pl-4">Transaction ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Items</th>
                  <th className="py-3">Total Amount</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => (
                  <tr key={order._id} className="border-b border-border-accent/30 hover:bg-foreground/[0.01] transition-colors">
                    <td className="py-4 pl-4 font-mono text-xs text-foreground/60">
                      {order.transactionId.slice(0, 14)}...
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-semibold text-foreground">{order.user?.name ?? "Unknown"}</p>
                        <p className="text-xs text-foreground/40">{order.user?.email ?? ""}</p>
                      </div>
                    </td>
                    <td className="py-4 text-foreground/75">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="py-4 font-bold text-foreground">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { label: "Processing", value: "processing", color: "hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500" },
                          { label: "Shipped", value: "shipped", color: "hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500" },
                          { label: "Delivered", value: "delivered", color: "hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500" },
                          { label: "Canceled", value: "cancelled", color: "hover:bg-red-500/10 hover:text-red-500 hover:border-red-500" },
                          { label: "Complete", value: "complete", color: "hover:bg-teal-500/10 hover:text-teal-500 hover:border-teal-500" },
                        ].map((btn) => (
                          <button
                            key={btn.value}
                            onClick={() => handleStatusChange(order._id, btn.value)}
                            className={`text-[10px] font-semibold px-2 py-1 rounded-lg border border-border-accent text-foreground/60 transition-all cursor-pointer ${btn.color}`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
