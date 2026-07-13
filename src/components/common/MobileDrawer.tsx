"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser } from "react-icons/fi";
import { Button } from "@heroui/react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { isAuthenticated, email, image } = useSelector((state: RootState) => state.user);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Refund Policy", href: "/refund" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          />

          {/* Slide-In Drawer Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-card-bg border-r border-border-accent p-6 shadow-2xl flex flex-col justify-between md:hidden"
          >
            {/* Header Block */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <Link 
                  href="/" 
                  onClick={onClose}
                  className="font-display text-2xl font-bold tracking-tight text-brand-primary-600 dark:text-brand-primary-400"
                >
                  NextMart
                </Link>
                <button 
                  onClick={onClose}
                  className="rounded-lg p-2 text-foreground/70 hover:bg-background hover:text-foreground transition-colors cursor-pointer"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Vertical Navigation Links */}
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={`font-sans text-lg font-medium transition-colors hover:text-brand-primary-500 py-1 ${
                        isActive 
                          ? "text-brand-primary-600 dark:text-brand-primary-400 font-semibold" 
                          : "text-foreground/70"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer Session Block */}
            <div className="border-t border-border-accent pt-6">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {image ? (
                      <img 
                        src={image} 
                        alt="Profile" 
                        className="h-10 w-10 rounded-full border border-brand-primary-500 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-100 text-brand-primary-700 font-bold border border-brand-primary-500">
                        <FiUser size={18} />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-sans text-sm font-semibold truncate max-w-[130px]">{email}</span>
                      <span className="font-sans text-xs text-foreground/60">Customer</span>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={onClose} className="text-brand-primary-600 dark:text-brand-primary-400 text-xs font-semibold hover:underline">
                    Dashboard
                  </Link>
                </div>
              ) : (
                <Link href="/login" onClick={onClose} className="w-full block">
                  <Button 
                    variant="secondary" 
                    className="w-full font-sans font-medium rounded-xl shadow-md cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
