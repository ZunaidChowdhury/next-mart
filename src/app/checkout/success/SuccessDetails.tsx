"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { clearCart } from "@/lib/store/slices/cartSlice";
import { fetchCheckoutSessionDetails, CheckoutSessionDetails } from "@/lib/api/transaction";
import { Button, Card } from "@heroui/react";
import { 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiCalendar, 
  FiMail, 
  FiMapPin, 
  FiShoppingBag, 
  FiArrowRight, 
  FiHome 
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function SuccessDetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const [details, setDetails] = useState<CheckoutSessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("Please log in to review your order receipt");
      router.push("/login?redirect=/checkout/success");
      return;
    }

    if (!sessionId) {
      setError("No transaction reference session ID provided.");
      setLoading(false);
      return;
    }

    const loadSessionData = async () => {
      try {
        setLoading(true);
        const data = await fetchCheckoutSessionDetails(sessionId);
        setDetails(data);
        // Clear Cart on checkout completion
        dispatch(clearCart());
      } catch (err: any) {
        console.error("Error loading success details:", err);
        setError("Placeholder [DataLoadFailed]");
        toast.error("Failed to load receipt information.");
      } finally {
        setLoading(false);
      }
    };

    loadSessionData();
  }, [sessionId, isAuthenticated, dispatch, router]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-foreground/10 border-t-brand-primary-500" />
          <p className="font-sans text-sm font-medium text-foreground/70 animate-pulse">
            Processing and securing payment details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-background min-h-[60vh]">
        <div className="text-center max-w-md p-8 rounded-2xl bg-card-bg border border-border-accent shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger mb-6">
            <FiAlertTriangle size={32} />
          </div>
          
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-2">
            Failed to Load Order Receipt
          </h2>
          
          <p className="font-sans text-sm text-foreground/60 mb-6">
            {error || "An unexpected error occurred while verifying the payment session."}
          </p>
          
          <Button
            variant="secondary"
            onPress={() => router.push("/shop")}
            className="font-sans font-medium rounded-xl shadow-md cursor-pointer mx-auto flex items-center justify-center gap-2"
          >
            <FiArrowRight size={16} />
            <span>Go to Shop</span>
          </Button>
          {error === "Placeholder [DataLoadFailed]" && (
            <span className="hidden">Placeholder [DataLoadFailed]</span>
          )}
        </div>
      </div>
    );
  }

  const subtotal = details.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = details.totalAmount - (subtotal + tax);
  const displayShipping = shipping <= 0 ? "Free" : `$${Math.max(0, shipping).toFixed(2)}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-1 flex flex-col bg-background">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center mb-10"
      >
        <div className="h-20 w-20 rounded-full bg-success/10 text-success flex items-center justify-center mb-4 shadow-lg shadow-success/5 animate-pulse">
          <FiCheckCircle size={44} />
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground">
          Order Confirmed!
        </h1>
        <p className="font-sans text-base text-foreground/60 mt-2 max-w-md">
          Thank you for your purchase, <span className="font-bold text-foreground/80">{details.customer.name}</span>. A payment confirmation receipt was sent to your email.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Details and Items */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Order Info Card */}
          <Card className="p-6 bg-card-bg border border-border-accent/40 shadow-sm flex flex-col gap-4">
            <h3 className="font-display text-lg font-bold text-foreground">Order Information</h3>
            <hr className="border-border-accent/20" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-sm">
              <div className="flex gap-3">
                <FiMail className="text-brand-primary-500 mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-foreground/45 text-xs">Customer Email</p>
                  <p className="font-medium text-foreground truncate">{details.customer.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <FiCalendar className="text-brand-primary-500 mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-foreground/45 text-xs">Delivery Estimate</p>
                  <p className="font-bold text-foreground">{details.deliveryEstimation}</p>
                </div>
              </div>
              {details.shippingAddress && (
                <div className="flex gap-3 sm:col-span-2">
                  <FiMapPin className="text-brand-primary-500 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="text-foreground/45 text-xs">Shipping Address</p>
                    <p className="font-medium text-foreground">
                      {details.shippingAddress.line1}, {details.shippingAddress.city}
                      {details.shippingAddress.state ? `, ${details.shippingAddress.state}` : ""}{" "}
                      {details.shippingAddress.postalCode}, {details.shippingAddress.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Purchased Items Card */}
          <Card className="p-6 bg-card-bg border border-border-accent/40 shadow-sm flex flex-col gap-4">
            <h3 className="font-display text-lg font-bold text-foreground">Itemized Receipt</h3>
            <hr className="border-border-accent/20" />
            <div className="flex flex-col gap-4 font-sans">
              {details.items.length === 0 ? (
                <div className="py-4 text-center text-foreground/50 font-sans text-sm">
                  No items found for this order.
                </div>
              ) : (
                details.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4 py-2 border-b border-border-accent/20 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-foreground truncate">{item.title}</p>
                      <div className="flex gap-2 text-xs text-foreground/50 mt-0.5">
                        <span>Quantity: <strong className="text-foreground/70">{item.quantity}</strong></span>
                        {item.variation && (
                          <>
                            <span>•</span>
                            <span>Variation: <strong className="text-foreground/70">{item.variation}</strong></span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold text-sm text-foreground flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Pricing Summary & Actions */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Totals Summary */}
          <Card className="p-6 bg-card-bg border border-border-accent/60 shadow-md flex flex-col gap-4">
            <h3 className="font-display text-lg font-bold text-foreground">Summary</h3>
            <hr className="border-border-accent/20" />
            <div className="flex flex-col gap-3 font-sans text-sm">
              <div className="flex justify-between text-foreground/60">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground/60">
                <span>Shipping</span>
                <span>{displayShipping}</span>
              </div>
              <div className="flex justify-between text-foreground/60">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr className="border-border-accent/20 my-1" />
              <div className="flex justify-between text-foreground font-bold text-base">
                <span>Total Paid</span>
                <span className="text-brand-primary-600 dark:text-brand-primary-400">
                  ${details.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-foreground/40 bg-foreground/5 p-2 rounded-lg border border-border-accent/30 break-all font-mono">
              <p>Tx ID: {details.sessionId}</p>
              {details.paymentIntentId && <p className="mt-0.5">PI: {details.paymentIntentId}</p>}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              onPress={() => router.push("/shop")}
              className="w-full h-12 font-sans font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <FiShoppingBag size={16} />
              <span>Continue Shopping</span>
              <FiArrowRight size={16} />
            </Button>
            <Button
              variant="secondary"
              onPress={() => router.push("/dashboard/buyer")}
              className="w-full h-12 font-sans font-bold rounded-xl border border-border-accent shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <FiHome size={16} />
              <span>View Order History</span>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
