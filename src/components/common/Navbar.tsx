"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { clearUser } from "@/lib/store/slices/userSlice";
import { clearCart } from "@/lib/store/slices/cartSlice";
import { clearWishlist } from "@/lib/store/slices/wishlistSlice";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/app/theme-provider";
import { Button, Avatar } from "@heroui/react";
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
  FiList,
  FiGrid,
  FiX,
} from "react-icons/fi";
import { FaShieldAlt } from "react-icons/fa";
import MobileDrawer from "./MobileDrawer";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartItemsCount = useSelector((state: RootState) =>
    (state.cart.items || []).reduce((acc, item) => acc + item.quantity, 0)
  );
  const wishlistCount = useSelector((state: RootState) => (state.wishlist.items || []).length);
  const { isAuthenticated, email, image, role, name } = useSelector(
    (state: RootState) => state.user
  );

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
      dispatch(clearCart());
      dispatch(clearWishlist());
      toast.success("Signed out successfully");
      setIsDropdownOpen(false);
      router.push("/");
    } catch (error: any) {
      toast.error("Failed to sign out: " + error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const firstname = name?.split(" ")[0] ?? email?.split("@")[0] ?? "User";

  const isActiveLink = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border-accent bg-background/70 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="min-[981px]:hidden rounded-lg p-2 text-foreground/70 hover:bg-card-bg hover:text-foreground transition-colors cursor-pointer shrink-0"
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
            >
              <Image
                src="/images/NextMart.png"
                alt="NextMart"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
                priority
              />
              <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-foreground whitespace-nowrap">
                Next<span className="text-brand-primary-500">Mart</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-sans text-sm font-medium transition-colors hover:text-brand-primary-500 px-3 py-1.5 border-b-2 ${
                      (link.href === "/about" || link.href === "/refund") ? "max-[980px]:hidden" : ""
                    } ${
                      active
                        ? "text-brand-primary-600 dark:text-brand-primary-400 font-semibold border-brand-primary-500"
                        : "text-foreground/70 border-transparent hover:border-foreground/20"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {isAuthenticated && (
                <Link
                  href={role === "admin" ? "/dashboard/admin" : "/dashboard/buyer"}
                  className={`font-sans text-sm font-medium transition-colors hover:text-brand-primary-500 px-3 py-1.5 border-b-2 ${
                    pathname.startsWith("/dashboard")
                      ? "text-brand-primary-600 dark:text-brand-primary-400 font-semibold border-brand-primary-500"
                      : "text-foreground/70 border-transparent hover:border-foreground/20"
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1.5">
            <div className="hidden xl:flex items-center relative w-[180px] 2xl:w-[240px]">
              <FiSearch
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-card-bg border border-border-accent text-sm font-sans text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-brand-primary-500/50 focus:ring-2 focus:ring-brand-primary-500/10 transition-all"
              />
            </div>

            <button
              className="hidden min-[429px]:flex xl:hidden rounded-lg p-1.5 text-foreground/70 hover:bg-card-bg hover:text-foreground transition-colors cursor-pointer"
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>

            <Link
              href="/wishlist"
              className="max-[428px]:hidden relative rounded-lg p-1.5 sm:p-2 text-foreground/70 hover:bg-card-bg hover:text-foreground transition-colors"
              aria-label="Wishlist"
            >
              <FiHeart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary-500 text-[8px] font-bold text-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative rounded-lg p-1.5 sm:p-2 text-foreground/70 hover:bg-card-bg hover:text-foreground transition-colors"
              aria-label="Cart"
            >
              <FiShoppingCart size={18} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary-500 text-[8px] font-bold text-white shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleTheme}
              className="hidden sm:flex rounded-lg p-1.5 sm:p-2 text-foreground/70 hover:bg-card-bg hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>

            <div className="relative" ref={dropdownRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 pr-1 py-1 rounded-xl hover:bg-foreground/[0.04] transition-colors cursor-pointer"
                  >
                    {role === "admin" && (
                      <span className="text-emerald-500 dark:text-emerald-400 flex items-center">
                        <FaShieldAlt size={14} />
                      </span>
                    )}
                    <span className="hidden sm:inline text-sm font-sans font-medium text-foreground/80 whitespace-nowrap">
                      Hi, {firstname}
                    </span>
                    <Avatar.Root size="sm" className="shrink-0 ring-2 ring-brand-primary-500/30 rounded-full">
                      <Avatar.Image src={image ?? undefined} />
                      <Avatar.Fallback className="text-xs font-bold text-brand-primary-600 dark:text-brand-primary-400 bg-brand-primary-100 dark:bg-brand-primary-900/40">
                        {firstname[0]?.toUpperCase() ?? "U"}
                      </Avatar.Fallback>
                    </Avatar.Root>
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-card-bg border border-border-accent p-2 shadow-xl z-50 flex flex-col gap-1"
                      >
                        <div className="px-3 py-2 border-b border-border-accent mb-1">
                          <p className="text-[10px] text-foreground/55 font-sans tracking-wide uppercase font-medium">
                            Signed in as
                          </p>
                          <p className="text-sm font-semibold truncate text-foreground font-sans">
                            {email}
                          </p>
                        </div>

                        {role === "admin" && (
                          <>
                            <Link
                              href="/dashboard/admin"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground/75 hover:bg-brand-primary-500/30 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors"
                            >
                              <FiGrid size={16} />
                              <span>Dashboard</span>
                            </Link>
                            <Link
                              href="/dashboard/admin/items/add"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground/75 hover:bg-brand-primary-500/30 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors"
                            >
                              <FiPlus size={16} />
                              <span>Add Product</span>
                            </Link>
                            <Link
                              href="/dashboard/admin/items/manage"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground/75 hover:bg-brand-primary-500/30 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors"
                            >
                              <FiList size={16} />
                              <span>Manage Catalog</span>
                            </Link>
                            <div className="border-t border-border-accent my-1" />
                          </>
                        )}

                        {role !== "admin" && (
                          <>
                            <Link
                              href="/dashboard/buyer"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground/75 hover:bg-brand-primary-500/30 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors"
                            >
                              <FiSettings size={16} />
                              <span>Dashboard</span>
                            </Link>
                            <Link
                              href="/dashboard/buyer?tab=orders"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground/75 hover:bg-brand-primary-500/30 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors"
                            >
                              <FiList size={16} />
                              <span>My Orders</span>
                            </Link>
                          </>
                        )}

                        <Link
                          href="/wishlist"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground/75 hover:bg-brand-primary-500/30 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors"
                        >
                          <FiHeart size={16} />
                          <span>Wishlist</span>
                        </Link>

                        <div className="border-t border-border-accent my-1" />

                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm text-danger hover:bg-danger/30 transition-colors text-left cursor-pointer font-sans font-medium"
                        >
                          <FiLogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href="/login">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="font-sans font-medium rounded-xl shadow-md cursor-pointer text-xs sm:text-sm"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
