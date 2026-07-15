"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, role } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("Authentication required. Redirecting to login...");
      router.push("/login?redirect=/dashboard");
      return;
    }

    if (role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/buyer");
    }
  }, [isAuthenticated, role, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-foreground/10 border-t-brand-primary-500" />
        <p className="font-sans text-sm font-medium text-foreground/70 animate-pulse">
          Routing to dashboard workspace...
        </p>
      </div>
    </div>
  );
}
