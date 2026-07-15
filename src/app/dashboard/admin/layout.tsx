"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Link from "next/link";
import {
  FiGrid,
  FiPackage,
  FiPlus,
  FiList,
  FiArrowLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const sidebarLinks = [
  { label: "Overview", href: "/dashboard/admin", icon: FiGrid },
  { label: "Orders", href: "/dashboard/admin/orders", icon: FiPackage },
  { label: "Add Product", href: "/dashboard/admin/items/add", icon: FiPlus },
  { label: "Manage Catalog", href: "/dashboard/admin/items/manage", icon: FiList },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, role, name, email } = useSelector(
    (state: RootState) => state.user
  );
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("Authentication required. Redirecting to login...");
      router.push("/login?redirect=/dashboard/admin");
      return;
    }
    if (role !== "admin") {
      toast.error("Admin access required.");
      router.push("/dashboard");
      return;
    }
    setAuthChecked(true);
  }, [isAuthenticated, role, router]);

  if (!authChecked) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-foreground/10 border-t-brand-primary-500" />
          <p className="font-sans text-sm font-medium text-foreground/70 animate-pulse">
            Verifying admin session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-background">
      <aside className="hidden lg:flex flex-col w-64 border-r border-border-accent bg-card-bg/50 shrink-0">
        <div className="px-5 py-6 border-b border-border-accent">
          <p className="font-display text-lg font-bold text-foreground tracking-tight">
            Admin Panel
          </p>
          <p className="font-sans text-xs text-foreground/45 mt-0.5 truncate">
            {name ?? email}
          </p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/dashboard/admin"
                ? pathname === "/dashboard/admin"
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-primary-500/10 text-brand-primary-600 dark:text-brand-primary-400 shadow-sm"
                    : "text-foreground/60 hover:bg-foreground/[0.04] hover:text-foreground/80"
                }`}
              >
                <Icon size={17} />
                <span>{link.label}</span>
                {isActive && (
                  <FiChevronRight
                    size={14}
                    className="ml-auto text-brand-primary-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-border-accent">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-sans font-medium text-foreground/50 hover:text-foreground/80 hover:bg-foreground/[0.04] transition-all"
          >
            <FiArrowLeft size={15} />
            <span>Back to Portal</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
