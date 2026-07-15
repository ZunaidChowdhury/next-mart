import React from "react";
import Link from "next/link";
import { FaShieldAlt, FaEye, FaLock, FaCookieBite } from "react-icons/fa";

export const dynamic = "error";
export const revalidate = false;

const policies = [
  {
    icon: <FaShieldAlt className="text-xl text-brand-primary-500" />,
    title: "Information We Collect",
    description:
      "We collect only the data necessary for order processing and account management — name, email address, shipping address, and payment method token. No sensitive financial data is stored on our servers; all payments are handled by Stripe's secure infrastructure.",
  },
  {
    icon: <FaEye className="text-xl text-brand-primary-500" />,
    title: "How We Use Your Data",
    description:
      "Your information is used exclusively for order fulfillment, customer support, and occasional service announcements. We do not sell, rent, or share your personal data with third parties for marketing purposes.",
  },
  {
    icon: <FaLock className="text-xl text-brand-primary-500" />,
    title: "Data Security",
    description:
      "All connections are encrypted via TLS 1.3. Account passwords are hashed using industry-standard bcrypt. We perform regular security audits and maintain strict access controls to protect your information from unauthorized access.",
  },
  {
    icon: <FaCookieBite className="text-xl text-brand-primary-500" />,
    title: "Cookies & Tracking",
    description:
      "We use essential cookies for session authentication and cart persistence. Analytics cookies help us improve the shopping experience. You can control cookie preferences through your browser settings at any time.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="w-full font-sans bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-extrabold mb-3">Privacy Policy</h1>
          <p className="text-sm text-foreground/60">
            Last updated: July 2026 — NextMart is committed to protecting your privacy.
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-foreground/80 mb-12">
          <p>
            This Privacy Policy outlines how NextMart (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
            collects, uses, and safeguards your personal information when you visit our website or
            make a purchase. By using NextMart, you consent to the practices described in this policy.
          </p>
        </div>

        <div className="grid gap-8">
          {policies.map((item) => (
            <div
              key={item.title}
              className="flex gap-5 p-6 rounded-2xl border border-border-accent bg-card-bg"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary-500/10">
                {item.icon}
              </div>
              <div>
                <h2 className="font-display text-lg font-bold mb-2">{item.title}</h2>
                <p className="text-sm text-foreground/60 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-brand-primary-500/5 border border-brand-primary-500/20 text-sm text-foreground/70">
          <p className="font-semibold text-foreground mb-1">Contact</p>
          <p>
            For privacy-related inquiries, reach out to{" "}
            <a href="mailto:privacy@nextmart.com" className="text-brand-primary-500 hover:underline">
              privacy@nextmart.com
            </a>
            . We respond to all requests within 48 hours.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm text-brand-primary-500 hover:underline font-medium"
          >
            &larr; Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
