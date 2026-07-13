"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useTheme } from "@/app/theme-provider";
import { Button } from "@heroui/react";
import { 
  FiSearch, 
  FiShoppingCart, 
  FiHeart, 
  FiSun, 
  FiMoon, 
  FiUser,
  FiMenu
} from "react-icons/fi";
import MobileDrawer from "./MobileDrawer";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Retrieve cart quantities and wishlist counters from persisted Redux states
  const cartItemsCount = useSelector((state: RootState) => 
    state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
  );
  const wishlistCount = useSelector((state: RootState) => state.wishlist.items.length);
  const { isAuthenticated, image } = useSelector((state: RootState) => state.user);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Refund Policy", href: "/refund" },
  ];

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
            <div className="hidden sm:block">
              {isAuthenticated ? (
                <Link href="/dashboard" className="flex items-center">
                  {image ? (
                    <img 
                      src={image} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full border border-brand-primary-500 object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-100 text-brand-primary-700 font-bold border border-brand-primary-500">
                      <FiUser size={16} />
                    </div>
                  )}
                </Link>
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
