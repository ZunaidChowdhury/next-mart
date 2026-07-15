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

// ─── Order History Types & Fetcher ──────────────────────────────────────────

export interface ITransactionHistoryItem {
  product: string;       // MongoDB ObjectId as string
  title: string;
  quantity: number;
  price: number;         // Historical unit price locked at checkout
  variation?: string;
}

export interface TransactionRecord {
  _id: string;
  transactionId: string; // Stripe PaymentIntent ID
  items: ITransactionHistoryItem[];
  totalAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  shippingAddress: {
    line1: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;     // ISO 8601 date string
  updatedAt: string;
}

export interface TransactionHistoryResponse {
  transactions: TransactionRecord[];
}

export async function fetchTransactionHistory(): Promise<TransactionHistoryResponse> {
  return serverFetch<TransactionHistoryResponse>('/checkout/history');
}
