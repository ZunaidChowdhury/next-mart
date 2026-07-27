"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import {
  FiHelpCircle,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiMapPin,
  FiClock,
  FiArrowLeft,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const FAQS = [
  {
    question: "How long does shipping take?",
    answer:
      "Most orders are processed within 24 hours. Standard domestic shipping takes between 3 to 5 business days. You will receive a tracking link via email as soon as your package ships.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day evaluation window. Items must be returned in pristine, unworn factory condition with all original packaging sealed. Returns are processed directly back to your original payment card.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we collect shipping details and fulfill orders to the United States, Canada, United Kingdom, Australia, New Zealand, and Bangladesh. Shipping charges are calculated at checkout.",
  },
  {
    question: "How can I check my order status?",
    answer:
      "Log in and navigate to your Buyer Dashboard. The 'Orders' tab will display the live status of any active, uncompleted orders. Once marked as complete by our team, it will appear in your 'Purchase History'.",
  },
];

export default function SupportPage() {
  const router = useRouter();
  const [ticket, setTicket] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket.name || !ticket.email || !ticket.subject || !ticket.message) {
      toast.error("Please fill out all fields in the support ticket form.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate API submit delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success("Support ticket submitted successfully! We will get back to you shortly.");
      setTicket({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to submit support ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-background min-h-screen text-foreground font-sans py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-xl border border-border-accent bg-card-bg flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/[0.04] transition-all cursor-pointer"
            aria-label="Go back"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Support Center</h1>
            <p className="font-sans text-sm text-foreground/50 mt-1">
              Have questions? We're here to help you coordinate.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQs section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <FiHelpCircle className="text-brand-primary-500" /> Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-3">
              {FAQS.map((faq, index) => {
                const isOpen = expandedFaq === index;
                return (
                  <Card
                    key={index}
                    className="border border-border-accent/40 bg-card-bg p-4 shadow-sm hover:border-border-accent/80 transition-colors"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left font-semibold text-sm cursor-pointer focus:outline-none"
                    >
                      <span>{faq.question}</span>
                      <span className="text-foreground/40 text-xs font-mono">{isOpen ? "−" : "+"}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-border-accent/20 pt-3"
                        >
                          <p className="font-sans text-xs text-foreground/60 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                );
              })}
            </div>

            {/* Quick Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Card className="p-4 bg-card-bg border border-border-accent/30 shadow-sm flex flex-row items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-primary-500/10 flex items-center justify-center shrink-0">
                  <FiPhone className="text-brand-primary-500" size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-foreground/40">Call Support</p>
                  <p className="text-xs font-semibold text-foreground/80 mt-0.5">+1 (800) 555-MART</p>
                </div>
              </Card>
              <Card className="p-4 bg-card-bg border border-border-accent/30 shadow-sm flex flex-row items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-primary-500/10 flex items-center justify-center shrink-0">
                  <FiClock className="text-brand-primary-500" size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-foreground/40">Working Hours</p>
                  <p className="text-xs font-semibold text-foreground/80 mt-0.5">Mon - Fri, 9AM - 5PM EST</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Ticket Submission Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card-bg border border-border-accent shadow-md flex flex-col gap-4 sticky top-24">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <FiMessageSquare className="text-brand-primary-500" /> Submit a Ticket
              </h3>
              <p className="font-sans text-xs text-foreground/50">
                Can't find your answer in our FAQs? Send us a ticket and our administrator will review it.
              </p>
              <hr className="border-border-accent/20" />
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 font-sans text-xs">
                <div className="flex flex-col gap-1">
                  <label htmlFor="ticket-name" className="font-semibold text-foreground/70">Full Name</label>
                  <input
                    id="ticket-name"
                    type="text"
                    value={ticket.name}
                    onChange={(e) => setTicket({ ...ticket, name: e.target.value })}
                    placeholder="Enter your name"
                    className="h-10 px-3 rounded-xl bg-background border border-border-accent text-sm text-foreground focus:outline-none focus:border-brand-primary-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="ticket-email" className="font-semibold text-foreground/70">Email Address</label>
                  <input
                    id="ticket-email"
                    type="email"
                    value={ticket.email}
                    onChange={(e) => setTicket({ ...ticket, email: e.target.value })}
                    placeholder="Enter your email"
                    className="h-10 px-3 rounded-xl bg-background border border-border-accent text-sm text-foreground focus:outline-none focus:border-brand-primary-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="ticket-subject" className="font-semibold text-foreground/70">Subject</label>
                  <input
                    id="ticket-subject"
                    type="text"
                    value={ticket.subject}
                    onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                    placeholder="Order dispute, warranty claim, etc."
                    className="h-10 px-3 rounded-xl bg-background border border-border-accent text-sm text-foreground focus:outline-none focus:border-brand-primary-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="ticket-message" className="font-semibold text-foreground/70">Message</label>
                  <textarea
                    id="ticket-message"
                    value={ticket.message}
                    onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    className="p-3 rounded-xl bg-background border border-border-accent text-sm text-foreground focus:outline-none focus:border-brand-primary-500 transition-colors resize-none"
                  />
                </div>
                <Button
                  variant="primary"
                  type="submit"
                  isDisabled={isSubmitting}
                  className="h-11 mt-2 font-sans font-semibold rounded-xl cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend size={13} />
                      <span>Submit Ticket</span>
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
