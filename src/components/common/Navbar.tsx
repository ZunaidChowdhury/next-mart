"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { clearUser } from "@/lib/store/slices/userSlice";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/app/theme-provider";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { 
  FiSearch, 
  FiShoppingCart, 
  FiHeart, 
  FiSun, 
  FiMoon, 
  FiUser,
  FiMenu,
  FiLogOut,
  FiSettings,
  FiPlus,
  FiList
} from "react-icons/fi";
import MobileDrawer from "./MobileDrawer";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Retrieve cart quantities and wishlist counters from persisted Redux states
  const cartItemsCount = useSelector((state: RootState) => 
    state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
  );
  const wishlistCount = useSelector((state: RootState) => state.wishlist.items.length);
  const { isAuthenticated, email, image, role } = useSelector((state: RootState) => state.user);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Refund Policy", href: "/refund" },
  ];

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      dispatch(clearUser());
      toast.success("Signed out successfully");
      setIsDropdownOpen(false);
      router.push("/");
    } catch (error: any) {
      toast.error("Failed to sign out: " + error.message);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border-accent bg-background/70 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left Side: Brand Logo & Navigation links */}
          <div className="flex items-center gap-4 sm:gap-8">
            
            {/* Hamburger Trigger for Mobile */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden rounded-lg p-2 text-foreground/70 hover:bg-card-bg hover:text-foreground transition-colors cursor-pointer"
            >
              <FiMenu size={20} />
            </button>

            <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-brand-primary-600 dark:text-brand-primary-400">
              <span>NextMart</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-sans text-sm font-medium transition-colors hover:text-brand-primary-500 ${
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

          {/* Right Side: Action Utilities & User Avatar state */}
          <div className="flex items-center gap-1 sm:gap-4">
            
            {/* Search Trigger Icon */}
            <button className="rounded-lg p-2 text-foreground/70 hover:bg-card-bg hover:text-foreground transition-colors cursor-pointer">
              <FiSearch size={20} />
            </button>

            {/* Wishlist Icon + Dynamic Badge Indicator */}
            <Link href="/wishlist" className="relative rounded-lg p-2 text-foreground/70 hover:bg-card-bg hover:text-foreground transition-colors">
              <FiHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon + Quantity sum Badge */}
            <Link href="/cart" className="relative rounded-lg p-2 text-foreground/70 hover:bg-card-bg hover:text-foreground transition-colors">
              <FiShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Theme Switcher Toggle button */}
            <button 
              onClick={toggleTheme}
              className="rounded-lg p-2 text-foreground/70 hover:bg-card-bg hover:text-foreground transition-colors cursor-pointer"
            >
              {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>

            {/* Dynamic Login Trigger / Authenticated User Profile */}
            <div className="hidden sm:block relative">
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center focus:outline-none cursor-pointer"
                  >
                    {image ? (
                      <img 
                        src={image} 
                        alt="Profile" 
                        className="h-8 w-8 rounded-full border border-brand-primary-500 object-cover hover:opacity-85 transition-opacity"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-100 text-brand-primary-700 font-bold border border-brand-primary-500 hover:bg-brand-primary-200 transition-colors">
                        <FiUser size={16} />
                      </div>
                    )}
                  </button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        {/* Invisible Backdrop overlay to trap clicks outside */}
                        <div 
                          className="fixed inset-0 z-40 cursor-default" 
                          onClick={() => setIsDropdownOpen(false)}
                        />

                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-card-bg border border-border-accent p-2 shadow-xl z-50 flex flex-col gap-1"
                        >
                          {/* Signed In details */}
                          <div className="px-3 py-2 border-b border-border-accent mb-1">
                            <p className="text-[10px] text-foreground/55 font-sans tracking-wide uppercase font-medium">Signed in as</p>
                            <p className="text-sm font-semibold truncate text-foreground font-sans">{email}</p>
                          </div>

                          {/* Navigation actions */}
                          <Link 
                            href="/dashboard" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground/75 hover:bg-brand-primary-500/10 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors"
                          >
                            <FiSettings size={16} />
                            <span>Dashboard</span>
                          </Link>

                          <Link 
                            href="/wishlist" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground/75 hover:bg-brand-primary-500/10 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors"
                          >
                            <FiHeart size={16} />
                            <span>Wishlist</span>
                          </Link>

                          {/* Admin Portal Shortcuts */}
                          {role === "admin" && (
                            <>
                              <div className="border-t border-border-accent my-1" />
                              <Link 
                                href="/items/add" 
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground/75 hover:bg-brand-primary-500/10 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors"
                              >
                                <FiPlus size={16} />
                                <span>Add Product</span>
                              </Link>
                              <Link 
                                href="/items/manage" 
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground/75 hover:bg-brand-primary-500/10 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors"
                              >
                                <FiList size={16} />
                                <span>Manage Catalog</span>
                              </Link>
                            </>
                          )}

                          <div className="border-t border-border-accent my-1" />

                          {/* Log Out button */}
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm text-danger hover:bg-danger/10 transition-colors text-left cursor-pointer font-sans font-medium"
                          >
                            <FiLogOut size={16} />
                            <span>Sign Out</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href="/login">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="font-sans font-medium rounded-xl shadow-md cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Slide-In Side Navigation Panel */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
