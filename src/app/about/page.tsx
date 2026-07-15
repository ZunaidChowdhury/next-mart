import React from "react";
import Link from "next/link";
import { FaShieldAlt, FaWarehouse, FaUserShield } from "react-icons/fa";

// Enforce Static Site Generation (SSG) for static marketing copy
export const dynamic = "error";
export const revalidate = false;

export default function AboutPage() {
    const coreValues = [
        {
            icon: <FaShieldAlt className="text-xl text-brand-primary-500" />,
            title: "Content Guardrails",
            description: "Rigid real-time keyword moderation layers enforcing zero tolerance for prohibited or restricted stock."
        },
        {
            icon: <FaWarehouse className="text-xl text-brand-primary-500" />,
            title: "Curated Framework",
            description: "Direct-to-consumer delivery loops specialized across premium sunglasses, gadgets, watches, and smart devices."
        },
        {
            icon: <FaUserShield className="text-xl text-brand-primary-500" />,
            title: "Solo Admin Control",
            description: "Eliminating multi-vendor noise with a single-owner operation model to maximize quality assurance parameters."
        }
    ];

    return (
        <main className="w-full font-sans bg-background text-foreground">
            {/* Structural Hero Section */}
            <section className="bg-card-bg border-b border-border-accent">
                <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 w-full text-center">
                    <span className="font-sans text-[10px] text-brand-primary-500 font-bold uppercase tracking-widest mb-3 block">
                        The NextMart Project
                    </span>
                    <h1 className="font-display text-4xl font-extrabold text-foreground mb-4 tracking-tight sm:text-5xl">
                        Boutique Electronics Ecosystem
                    </h1>
                    <p className="font-sans text-sm text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                        NextMart is a highly optimized, single-owner automated digital platform delivering pristine consumer devices, premium timepieces, and curated daily essentials.
                    </p>
                </div>
            </section>

            {/* Operations & Values Section */}
            <section className="border-b border-border-accent">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-2xl font-extrabold text-foreground mb-3">
                            Architectural Core Pillars
                        </h2>
                        <p className="font-sans text-sm text-foreground/60">
                            Engineered with modern decoupled topology for fast response and checkout speeds.
                        </p>
                    </div>

                    {/* Core Values Grid Mapping */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coreValues.map((value, idx) => (
                            <div
                                key={idx}
                                className="group flex flex-col rounded-2xl bg-card-bg border border-border-accent p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="mb-4 p-3 bg-background border border-border-accent rounded-xl w-fit group-hover:border-brand-primary-500 transition-colors duration-300">
                                    {value.icon}
                                </div>
                                <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-brand-primary-500 transition-colors duration-300">
                                    {value.title}
                                </h3>
                                <p className="font-sans text-xs text-foreground/60 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call To Action Row */}
            <section className="bg-card-bg">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full text-center">
                    <h2 className="font-display text-2xl font-extrabold text-foreground mb-3">
                        Explore Curated Releases
                    </h2>
                    <p className="font-sans text-sm text-foreground/60 mb-6 max-w-md mx-auto">
                        Browse through our catalog collections filtered through absolute security and synchronization layers.
                    </p>
                    <Link href="/shop">
                        <button className="bg-brand-primary-500 text-white font-sans font-medium text-sm rounded-xl px-6 py-3 cursor-pointer hover:bg-brand-primary-500/90 hover:scale-102 transition-all duration-300 shadow-sm">
                            View Entire Shop Catalog
                        </button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
