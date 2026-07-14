import { serverFetch } from "../core/server";

export interface CheckoutSessionDetails {
  sessionId: string;
  paymentIntentId: string | null;
  paymentStatus: "pending" | "completed" | "failed" | "refunded" | string;
  totalAmount: number;
  currency: string;
  customer: {
    email: string;
    name: string;
  };
  shippingAddress: {
    line1: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  } | null;
  deliveryEstimation: string;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
    variation?: string;
  }>;
}

export async function fetchCheckoutSessionDetails(sessionId: string): Promise<CheckoutSessionDetails> {
  return serverFetch<CheckoutSessionDetails>(`/checkout/session/${sessionId}`);
}
