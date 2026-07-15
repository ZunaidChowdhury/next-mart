"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/store/slices/userSlice";
import { serverMutation } from "@/lib/core/server";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface SyncResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    image: string;
    role: "buyer" | "admin";
  };
  token: string;
}

/**
 * OAuth Callback Handler
 *
 * BetterAuth redirects here after Google OAuth completes.
 * We retrieve the active BetterAuth session, sync it with
 * the Express backend to issue a custom JOSE JWT, and store
 * the full user profile in Redux for authenticated API access.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    async function handleCallback() {
      try {
        const session = await authClient.getSession();

        if (!session?.data?.user) {
          toast.error("Authentication failed. Please try signing in again.");
          router.replace("/login");
          return;
        }

        const { user } = session.data;

        const response = await serverMutation<
          SyncResponse,
          { name: string; email: string; image?: string }
        >("/auth/sync", "POST", {
          name: user.name,
          email: user.email,
          image: user.image ?? "",
        });

        dispatch(
          setUser({
            id: response.user._id,
            name: response.user.name,
            email: response.user.email,
            image: response.user.image,
            role: response.user.role,
            token: response.token,
          })
        );

        toast.success(`Welcome, ${response.user.name}! 🎉`);

        if (response.user.role === "admin") {
          router.replace("/dashboard/admin");
        } else {
          router.replace("/dashboard/buyer");
        }
      } catch (err: any) {
        console.error("OAuth callback sync error:", err);
        toast.error(err?.message || "Sign-in sync failed. Please try again.");
        router.replace("/login");
      }
    }

    handleCallback();
  }, [dispatch, router]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-5 p-10 rounded-3xl bg-card-bg border border-border-accent shadow-xl"
      >
        {/* Spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-brand-primary-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-primary-500 animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-display text-lg font-bold text-foreground">
            Completing Sign-In
          </p>
          <p className="font-sans text-sm text-foreground/50 mt-1">
            Syncing your session, please wait…
          </p>
        </div>
      </motion.div>
    </div>
  );
}
