"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/store/slices/userSlice";
import { serverMutation } from "@/lib/core/server";
import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiShoppingBag,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

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

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /**
   * After BetterAuth authenticates the user, sync with our Express backend
   * to receive a custom JOSE JWT that encodes user role for protected routes.
   */
  async function syncWithBackend(
    name: string,
    email: string,
    image?: string
  ): Promise<SyncResponse> {
    const response = await serverMutation<
      SyncResponse,
      { name: string; email: string; image?: string }
    >("/auth/sync", "POST", { name, email, image: image || "" });

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

    return response;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      if (!data?.user) {
        toast.error("Authentication failed. Please try again.");
        return;
      }

      const syncResponse = await syncWithBackend(
        data.user.name,
        data.user.email,
        data.user.image ?? ""
      );

      toast.success(`Welcome back, ${data.user.name}! 🎉`);

      if (syncResponse.user.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/buyer");
      }
    } catch (err: any) {
      toast.error(err?.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/auth/callback`,
      });
      // Redirect handled by BetterAuth OAuth flow
    } catch (err: any) {
      toast.error(err?.message || "Google sign-in failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-background transition-colors duration-300 min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="relative p-8 rounded-3xl bg-card-bg border border-border-accent shadow-2xl flex flex-col gap-7 overflow-hidden">
          {/* Decorative gradient orb */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-primary-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-brand-primary-400/8 blur-3xl" />

          {/* Header */}
          <div className="relative text-center flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-primary-500/15 ring-1 ring-brand-primary-500/30">
              <FiShoppingBag size={26} className="text-brand-primary-500" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Welcome back
              </h1>
              <p className="font-sans text-sm text-foreground/50 mt-1">
                Sign in to your NextMart account
              </p>
            </div>
          </div>

          {/* Google Sign-In */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="relative w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-border-accent bg-card-bg hover:bg-foreground/5 font-sans text-sm font-semibold text-foreground transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-foreground/60"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <FcGoogle size={20} />
            )}
            <span>Continue with Google</span>
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border-accent/60" />
            <span className="text-xs font-sans text-foreground/40 font-medium">
              or sign in with email
            </span>
            <div className="flex-1 h-px bg-border-accent/60" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground/70 font-sans">
                Email Address
              </label>
              <div className="relative flex items-center">
                <FiMail
                  size={16}
                  className="absolute left-3.5 text-foreground/40 flex-shrink-0 pointer-events-none"
                />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="h-11 w-full pl-10 pr-4 text-sm font-sans rounded-xl border border-border-accent bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground/70 font-sans">
                Password
              </label>
              <div className="relative flex items-center">
                <FiLock
                  size={16}
                  className="absolute left-3.5 text-foreground/40 flex-shrink-0 pointer-events-none"
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="h-11 w-full pl-10 pr-11 text-sm font-sans rounded-xl border border-border-accent bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 text-foreground/40 hover:text-foreground/70 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={showPassword ? "hide" : "show"}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {showPassword ? (
                        <FiEyeOff size={16} />
                      ) : (
                        <FiEye size={16} />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              id="login-submit-btn"
              type="submit"
              variant="primary"
              isDisabled={loading || googleLoading}
              className="h-12 w-full font-sans font-bold rounded-xl mt-1 cursor-pointer shadow-md flex items-center justify-center gap-2 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-current"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm font-sans text-foreground/50">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-brand-primary-500 font-semibold hover:underline transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
