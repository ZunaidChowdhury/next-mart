import { serverMutation } from "../core/server";

interface CheckoutSessionResponse {
  url: string;
}

interface CheckoutItem {
  product: string;
  quantity: number;
  variation?: string;
}

export async function createCheckoutSession(items: CheckoutItem[]): Promise<CheckoutSessionResponse> {
  return serverMutation<CheckoutSessionResponse, { items: CheckoutItem[] }>(
    "/checkout/create-session",
    "POST",
    { items }
  );
}
