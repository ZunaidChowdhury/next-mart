"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/store/slices/userSlice";
import { serverMutation } from "@/lib/core/server";
import { authClient } from "@/lib/auth-client";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@heroui/react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiCamera,
  FiX,
  FiShoppingBag,
  FiUserPlus,
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

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /**
   * After BetterAuth registers the user, sync with our Express backend
   * to receive a custom JOSE JWT that encodes user role for protected routes.
   * All newly registered users receive the 'buyer' role.
   */
  async function syncWithBackend(
    name: string,
    email: string,
    image?: string
  ): Promise<void> {
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
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signUp.email({
        name: name.trim(),
        email,
        password,
        image: avatarUrl || undefined,
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
        return;
      }

      if (!data?.user) {
        toast.error("Registration failed. Please try again.");
        return;
      }

      await syncWithBackend(
        data.user.name,
        data.user.email,
        data.user.image ?? avatarUrl
      );

      toast.success(`Welcome to NextMart, ${data.user.name}! 🎉`);
      router.push("/");
    } catch (err: any) {
      toast.error(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/auth/callback`,
      });
      // Redirect handled by BetterAuth OAuth flow
    } catch (err: any) {
      toast.error(err?.message || "Google sign-up failed.");
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
        <div className="relative p-8 rounded-3xl bg-card-bg border border-border-accent shadow-2xl flex flex-col gap-6 overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-primary-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-brand-primary-400/8 blur-3xl" />

          {/* Header */}
          <div className="relative text-center flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-primary-500/15 ring-1 ring-brand-primary-500/30">
              <FiUserPlus size={24} className="text-brand-primary-500" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Create your account
              </h1>
              <p className="font-sans text-sm text-foreground/50 mt-1">
                Join NextMart and start shopping
              </p>
            </div>
          </div>

          {/* Google Sign-Up */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={handleGoogleRegister}
            disabled={googleLoading || loading || uploading}
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
              or register with email
            </span>
            <div className="flex-1 h-px bg-border-accent/60" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {/* Optional Avatar Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground/70 font-sans">
                Profile Photo{" "}
                <span className="font-normal text-foreground/40">
                  (optional)
                </span>
              </label>
              <div className="flex items-center gap-4">
                {/* Avatar Preview */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-foreground/8 border border-border-accent flex items-center justify-center">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Profile preview"
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <FiCamera size={22} className="text-foreground/30" />
                    )}
                  </div>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl("")}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                      aria-label="Remove photo"
                    >
                      <FiX size={11} />
                    </button>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <UploadButton
                    endpoint="imageUploader"
                    onUploadBegin={() => setUploading(true)}
                    onClientUploadComplete={(res) => {
                      setUploading(false);
                      if (res?.[0]?.ufsUrl) {
                        setAvatarUrl(res[0].ufsUrl);
                        toast.success("Photo uploaded!");
                      }
                    }}
                    onUploadError={(err) => {
                      setUploading(false);
                      toast.error(`Upload failed: ${err.message}`);
                    }}
                    appearance={{
                      button:
                        "h-9 px-4 text-xs font-sans font-semibold rounded-xl border border-border-accent bg-card-bg text-foreground hover:bg-foreground/8 transition-all duration-200 ut-uploading:opacity-60 ut-uploading:cursor-not-allowed",
                      allowedContent: "text-foreground/40 text-[10px] mt-1",
                    }}
                    content={{
                      button({ ready, isUploading }) {
                        if (isUploading) return "Uploading...";
                        if (ready) return "Upload Photo";
                        return "Loading...";
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground/70 font-sans">
                Full Name
              </label>
              <div className="relative flex items-center">
                <FiUser
                  size={16}
                  className="absolute left-3.5 text-foreground/40 flex-shrink-0 pointer-events-none"
                />
                <input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="h-11 w-full pl-10 pr-4 text-sm font-sans rounded-xl border border-border-accent bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/20 transition-all duration-200"
                />
              </div>
            </div>

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
                  id="register-email"
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
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
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
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        password.length >= (i + 1) * 3
                          ? password.length >= 12
                            ? "bg-green-500"
                            : password.length >= 8
                            ? "bg-yellow-500"
                            : "bg-red-500"
                          : "bg-foreground/10"
                      }`}
                    />
                  ))}
                  <span className="text-[10px] text-foreground/40 font-sans ml-1 self-center">
                    {password.length >= 12
                      ? "Strong"
                      : password.length >= 8
                      ? "Good"
                      : "Weak"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground/70 font-sans">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <FiLock
                  size={16}
                  className="absolute left-3.5 text-foreground/40 flex-shrink-0 pointer-events-none"
                />
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className={`h-11 w-full pl-10 pr-11 text-sm font-sans rounded-xl border bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/20"
                      : confirmPassword && password === confirmPassword
                      ? "border-green-500/70 focus:border-green-500 focus:ring-green-500/20"
                      : "border-border-accent focus:border-brand-primary-500 focus:ring-brand-primary-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3.5 text-foreground/40 hover:text-foreground/70 transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={showConfirmPassword ? "hide" : "show"}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={16} />
                      ) : (
                        <FiEye size={16} />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[11px] text-red-500 font-sans mt-0.5">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Role notice */}
            <div className="flex items-center gap-2 p-3 bg-brand-primary-500/8 rounded-xl border border-brand-primary-500/20 text-[11px] text-foreground/60 font-sans">
              <FiShoppingBag size={13} className="text-brand-primary-500 flex-shrink-0" />
              <span>
                New accounts are registered with{" "}
                <strong className="text-foreground/80">Customer</strong> role
                access.
              </span>
            </div>

            {/* Submit */}
            <Button
              id="register-submit-btn"
              type="submit"
              variant="primary"
              isDisabled={loading || googleLoading || uploading}
              className="h-12 w-full font-sans font-bold rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-2 transition-all duration-200"
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
                  <span>Creating account...</span>
                </span>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm font-sans text-foreground/50">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-primary-500 font-semibold hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
