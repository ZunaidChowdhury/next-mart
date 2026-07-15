import { serverFetch, serverMutation } from "../core/server";

export interface MonthlyRevenue {
  year: number;
  month: number;
  revenue: number;
  orders: number;
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
}

export interface AdminStatsResponse {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  monthlyRevenue: MonthlyRevenue[];
  orderStatusDistribution: OrderStatusDistribution[];
}

export interface AdminOrder
  extends Record<string, any> {
  _id: string;
  transactionId: string;
  user: { _id: string; name: string; email: string };
  items: Array<{
    product: string;
    title: string;
    quantity: number;
    price: number;
    variation?: string;
  }>;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: {
    line1: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function fetchAdminStats(): Promise<AdminStatsResponse> {
  return serverFetch<AdminStatsResponse>("/admin/stats");
}

export async function fetchAllOrders(
  page = 1,
  limit = 20,
  status?: string,
  search?: string
): Promise<AdminOrdersResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  return serverFetch<AdminOrdersResponse>(`/admin/orders?${params.toString()}`);
}

export async function updateOrderStatus(
  orderId: string,
  orderStatus: string
): Promise<{ transaction: AdminOrder }> {
  return serverMutation<{ transaction: AdminOrder }, { orderStatus: string }>(
    `/admin/orders/${orderId}/status`,
    "PATCH",
    { orderStatus }
  );
}
