"use client";

import React from "react";
import Link from "next/link";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaCcStripe,
    FaCcVisa,
    FaCcMastercard,
    FaShieldAlt
} from "react-icons/fa";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    // Project Brief Target Demographics Array
    const catalogLinks = [
        { label: "Men's Collection", href: "/shop?category=men" },
        { label: "Women's Collection", href: "/shop?category=women" },
        { label: "Gaming Collection", href: "/shop?category=gaming" },
        { label: "Featured Gadgets", href: "/shop?category=gadgets" },
    ];

    // Project Brief Inventory Categories Array
    const inventoryLinks = [
        { label: "Premium Sunglasses", href: "/shop?search=sunglasses" },
        { label: "Smart Watches", href: "/shop?search=watches" },
        { label: "Portable Devices", href: "/shop?search=portable" },
        { label: "Consumer Electronics", href: "/shop?search=electronics" },
    ];

    // Next.js Global Fallback & Structural SSG Pages
    const governanceLinks = [
        { label: "About NextMart", href: "/about" },
        { label: "Contact Support", href: "/support" },
        { label: "Refund Policy", href: "/refund" },
        { label: "Privacy Policy", href: "/privacy" },
    ];

    return (
        <footer className="w-full bg-card-bg border-t border-border-accent font-sans text-foreground transition-colors duration-300">

            {/* Top Secure Banner Component */}
            <div className="border-b border-border-accent bg-background/50 py-5">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-center sm:text-left">
                        <FaShieldAlt className="text-brand-primary-500 text-sm shrink-0" />
                        <p className="text-xs text-foreground/70 font-medium tracking-wide">
                            Rigid Content Filter Protocol: Zero-Tolerance Prohibited Inventory Guardrails.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-foreground/45 text-xl">
                        <FaCcStripe className="hover:text-brand-primary-500 transition-colors" title="Stripe Merchant Checkout" />
                        <FaCcVisa className="hover:text-brand-primary-500 transition-colors" title="Visa Gateway" />
                        <FaCcMastercard className="hover:text-brand-primary-500 transition-colors" title="Mastercard Gateway" />
                    </div>
                </div>
            </div>

            {/* Main Struct Grid Layer */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">

                    {/* Brand Identification Panel */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                            Next<span className="text-brand-primary-500">Mart</span>
                        </Link>
                        <p className="text-sm text-foreground/60 leading-relaxed max-w-xs">
                            Single-owner boutique e-commerce ecosystem presenting curated premium releases of sunglasses, smart watches, and portable consumer devices.
                        </p>

                        {/* Social Matrix Nodes */}
                        <div className="flex items-center gap-2.5 mt-2">
                            {[
                                { icon: <FaFacebookF size={12} />, href: "https://facebook.com", label: "Facebook" },
                                { icon: <FaTwitter size={12} />, href: "https://twitter.com", label: "Twitter" },
                                { icon: <FaInstagram size={12} />, href: "https://instagram.com", label: "Instagram" },
                                { icon: <FaLinkedinIn size={12} />, href: "https://linkedin.com", label: "LinkedIn" }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="group/icon p-2.5 rounded-xl bg-background border border-border-accent text-foreground/60 hover:text-brand-primary-500 hover:border-brand-primary-500 transition-all duration-300"
                                >
                                    <div className="group-hover/icon:scale-110 transition-transform duration-300">
                                        {social.icon}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 1: Core Catalogs */}
                    <div className="flex flex-col">
                        <h3 className="font-display text-xs font-bold uppercase tracking-widest text-foreground mb-4">
                            Core Catalogs
                        </h3>
                        <ul className="space-y-3">
                            {catalogLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-foreground/60 hover:text-brand-primary-500 transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Specific Targeted Inventory */}
                    <div className="flex flex-col">
                        <h3 className="font-display text-xs font-bold uppercase tracking-widest text-foreground mb-4">
                            Target Inventory
                        </h3>
                        <ul className="space-y-3">
                            {inventoryLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-foreground/60 hover:text-brand-primary-500 transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Corporate Governance & Support Layouts */}
                    <div className="flex flex-col">
                        <h3 className="font-display text-xs font-bold uppercase tracking-widest text-foreground mb-4">
                            Governance & Support
                        </h3>
                        <ul className="space-y-3">
                            {governanceLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-foreground/60 hover:text-brand-primary-500 transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Lower Legal & Execution Status Bar */}
                <div className="mt-16 border-t border-border-accent pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-foreground/45 text-center sm:text-left tracking-wide">
                        &copy; {currentYear} NextMart Platform. All system layout structures reserved.
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-5 text-[11px] font-bold uppercase tracking-wider text-foreground/50">
                        <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animation-pulse" />
                            Stripe Infrastructure Connected
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animation-pulse" />
                            Sync Model Online
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
