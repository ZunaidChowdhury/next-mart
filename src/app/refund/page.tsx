import React from "react";
import Link from "next/link";
import { FaUndoAlt, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

// Enforce Static Site Generation (SSG) for static policy documentation rules
export const dynamic = "error";
export const revalidate = false;

export default function RefundPolicyPage() {
    const policySteps = [
        {
            icon: <FaClock className="text-xl text-brand-primary-500" />,
            title: "30-Day Evaluation Window",
            description: "Return request requests must be authenticated and submitted within exactly 30 calendar days from the validated courier delivery timestamp."
        },
        {
            icon: <FaCheckCircle className="text-xl text-brand-primary-500" />,
            title: "Pristine Factory Condition",
            description: "Items—including sunglasses, watches, and smart devices—must remain completely unworn, unaltered, and retained inside their original sealed retail box container packaging."
        },
        {
            icon: <FaUndoAlt className="text-xl text-brand-primary-500" />,
            title: "Direct Merchant Reversal",
            description: "Validated claims process straight through our Stripe infrastructure channel directly back to your original purchasing card asset within 5 to 10 standard banking operation business days."
        }
    ];

    return (
        <main className="w-full font-sans bg-background text-foreground">
            {/* Structural Policy Header Section */}
            <section className="bg-card-bg border-b border-border-accent">
                <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 w-full text-center">
                    <span className="font-sans text-[10px] text-brand-primary-500 font-bold uppercase tracking-widest mb-3 block">
                        Consumer Protection Standard
                    </span>
                    <h1 className="font-display text-4xl font-extrabold text-foreground mb-4 tracking-tight sm:text-5xl">
                        Refund & Return Governance
                    </h1>
                    <p className="font-sans text-sm text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                        Transparent operational blueprints governing transactions across the NextMart digital ecosystem. Review our compliance bounds below.
                    </p>
                </div>
            </section>

            {/* Core Policy Workflow Steps */}
            <section className="border-b border-border-accent">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {policySteps.map((step, idx) => (
                            <div
                                key={idx}
                                className="group flex flex-col rounded-2xl bg-card-bg border border-border-accent p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="mb-4 p-3 bg-background border border-border-accent rounded-xl w-fit group-hover:border-brand-primary-500 transition-colors duration-300">
                                    {step.icon}
                                </div>
                                <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-brand-primary-500 transition-colors duration-300">
                                    {step.title}
                                </h3>
                                <p className="font-sans text-xs text-foreground/60 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed Legal Framework Layout */}
            <section className="bg-background">
                <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 w-full">
                    <div className="space-y-10">
                        <div>
                            <h2 className="font-display text-xl font-bold text-foreground mb-3">1. Return Request Initiation Protocols</h2>
                            <p className="font-sans text-sm text-foreground/60 leading-relaxed">
                                To start a structural reverse-logistics return step, please navigate straight to your personal dynamic user profile orders area. Select the targeted transaction item cluster and upload clear image verifications showing asset tags intact. Our solo administration matrix reviews submissions within 24 working hours.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-card-bg border border-border-accent flex gap-4 items-start">
                            <FaExclamationTriangle className="text-xl text-brand-primary-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-display text-sm font-bold text-foreground mb-1">Strict Exclusion Parameters</h4>
                                <p className="font-sans text-xs text-foreground/60 leading-relaxed">
                                    Any consumable items, final clearance sales items, or premium items returned showing clear biometric wear, scratched chassis frames, or missing original warranty paperwork records will be automatically rejected.
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="font-display text-xl font-bold text-foreground mb-3">2. Processing, Verification & Stripe Reverse Settlement</h2>
                            <p className="font-sans text-sm text-foreground/60 leading-relaxed">
                                Once safe physical arrival at our logistics hub is registered, items go through standard hardware diagnostics checking original device values. Following verification clearance, order values are authorized for a complete reverse settlement action via our Stripe merchant gateway dashboard pipeline.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Policy Call To Action Support Bar */}
            <section className="bg-card-bg border-t border-border-accent">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full text-center">
                    <h2 className="font-display text-2xl font-extrabold text-foreground mb-3">
                        Need System Claim Assistance?
                    </h2>
                    <p className="font-sans text-sm text-foreground/60 mb-6 max-w-md mx-auto">
                        Our specialized single-owner help desk platform is standing by to resolve any configuration anomalies or structural transaction disputes.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link href="/support" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-brand-primary-500 text-white font-sans font-medium text-sm rounded-xl px-6 py-3 cursor-pointer hover:bg-brand-primary-500/90 hover:scale-102 transition-all duration-300 shadow-sm">
                                Open Support Ticket
                            </button>
                        </Link>
                        <Link href="/shop" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-background border border-border-accent text-foreground font-sans font-medium text-sm rounded-xl px-6 py-3 cursor-pointer hover:bg-card-bg hover:scale-102 transition-all duration-300">
                                Return to Shop Catalog
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
