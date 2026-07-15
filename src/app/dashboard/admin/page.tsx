"use client";

import React, { useEffect, useState } from "react";
import { fetchAdminStats, AdminStatsResponse } from "@/lib/api/admin";
import {
  FiDollarSign,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiTrendingUp,
  FiRefreshCw,
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

  const loadStats = async () => {
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
  };

  useEffect(() => {
    loadStats();
  }, []);

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
          onClick={loadStats}
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
    </div>
  );
}
