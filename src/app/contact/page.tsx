"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiArrowLeft,
  FiSend,
  FiMessageSquare,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill out all fields in the contact form.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate API submit delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message sent successfully! We will get in touch with you shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-background min-h-screen text-foreground font-sans py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-xl border border-border-accent bg-card-bg flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/[0.04] transition-all cursor-pointer"
            aria-label="Go back"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Contact Us</h1>
            <p className="font-sans text-sm text-foreground/50 mt-1">
              Have questions or suggestions? Reach out directly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column - Contact Details */}
          <div className="flex flex-col gap-5">
            <h2 className="font-display text-xl font-bold mb-2">Connect With Us</h2>
            
            <div className="flex flex-col gap-4">
              <Card className="p-4 bg-card-bg border border-border-accent/40 shadow-sm flex flex-row gap-4 items-center">
                <div className="h-12 w-12 rounded-xl bg-brand-primary-500/10 flex items-center justify-center text-brand-primary-500 shrink-0">
                  <FiMail size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-foreground/40 font-mono tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-foreground/80 mt-0.5">support@nextmart.com</p>
                </div>
              </Card>

              <Card className="p-4 bg-card-bg border border-border-accent/40 shadow-sm flex flex-row gap-4 items-center">
                <div className="h-12 w-12 rounded-xl bg-brand-primary-500/10 flex items-center justify-center text-brand-primary-500 shrink-0">
                  <FiPhone size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-foreground/40 font-mono tracking-wider">Phone Support</p>
                  <p className="text-sm font-semibold text-foreground/80 mt-0.5">+1 (800) 555-MART</p>
                </div>
              </Card>

              <Card className="p-4 bg-card-bg border border-border-accent/40 shadow-sm flex flex-row gap-4 items-center">
                <div className="h-12 w-12 rounded-xl bg-brand-primary-500/10 flex items-center justify-center text-brand-primary-500 shrink-0">
                  <FiMapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-foreground/40 font-mono tracking-wider">Logistics Office</p>
                  <p className="text-sm font-semibold text-foreground/80 mt-0.5">100 Broadway Suite 12, New York, NY</p>
                </div>
              </Card>

              <Card className="p-4 bg-card-bg border border-border-accent/40 shadow-sm flex flex-row gap-4 items-center">
                <div className="h-12 w-12 rounded-xl bg-brand-primary-500/10 flex items-center justify-center text-brand-primary-500 shrink-0">
                  <FiClock size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-foreground/40 font-mono tracking-wider">Support Operations</p>
                  <p className="text-sm font-semibold text-foreground/80 mt-0.5">Monday to Friday: 9AM - 5PM EST</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <Card className="p-6 bg-card-bg border border-border-accent shadow-lg flex flex-col gap-4">
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <FiMessageSquare className="text-brand-primary-500" /> Send a Message
            </h3>
            <p className="font-sans text-xs text-foreground/50">
              Fill out the form below, and we will get back to you within 24 working hours.
            </p>
            <hr className="border-border-accent/20" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-xs">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-name" className="font-semibold text-foreground/75">Full Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="h-10 px-3 rounded-xl bg-background border border-border-accent text-sm text-foreground focus:outline-none focus:border-brand-primary-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-email" className="font-semibold text-foreground/75">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Your email address"
                  className="h-10 px-3 rounded-xl bg-background border border-border-accent text-sm text-foreground focus:outline-none focus:border-brand-primary-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="font-semibold text-foreground/75">Message</label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  placeholder="Write your message here..."
                  className="p-3 rounded-xl bg-background border border-border-accent text-sm text-foreground focus:outline-none focus:border-brand-primary-500 transition-colors resize-none"
                />
              </div>
              <Button
                variant="primary"
                type="submit"
                isDisabled={isSubmitting}
                className="h-11 mt-2 font-sans font-semibold rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <FiSend size={14} />
                    <span>Send Message</span>
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
