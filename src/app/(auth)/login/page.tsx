"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/store/slices/userSlice";
import { serverMutation } from "@/lib/core/server";
import { Button } from "@heroui/react";
import { FiMail, FiUser, FiArrowRight, FiLock } from "react-icons/fi";
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

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("Please fill in both name and email fields");
      return;
    }

    try {
      setLoading(true);
      
      // Perform database synchronization mutation
      const response = await serverMutation<SyncResponse, { name: string; email: string }>(
        "/auth/sync",
        "POST",
        { name, email }
      );

      // Dispatch details to persistent Redux store
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

      toast.success(`Welcome back, ${response.user.name}!`);
      router.push("/shop");
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Failed to authenticate session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-background transition-colors duration-300 min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-8 rounded-2xl bg-card-bg border border-border-accent shadow-xl flex flex-col gap-6"
      >
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-foreground tracking-tight">
            Welcome to NextMart
          </h1>
          <p className="font-sans text-xs sm:text-sm text-foreground/50 mt-2">
            Securely sign in or register your customer account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-foreground/75 font-sans mb-1">Full Name</label>
            <div className="relative flex items-center">
              <FiUser className="absolute left-3 text-foreground/45 flex-shrink-0" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full pl-9 pr-3 text-sm font-sans rounded-xl border border-border-accent bg-card-bg text-foreground focus:outline-none focus:border-brand-primary-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-foreground/75 font-sans mb-1">Email Address</label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3 text-foreground/45 flex-shrink-0" />
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full pl-9 pr-3 text-sm font-sans rounded-xl border border-border-accent bg-card-bg text-foreground focus:outline-none focus:border-brand-primary-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-foreground/3 rounded-xl border border-border-accent/30 text-[10px] text-foreground/50">
            <FiLock className="flex-shrink-0" />
            <span>First login registers automatically. Password-free token sync.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            isDisabled={loading}
            className="h-12 w-full font-sans font-bold rounded-xl mt-2 cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span>Continue</span>
                <FiArrowRight size={16} />
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
