import { serverMutation } from "../core/server";

export interface CreateProductPayload {
  title: string;
  overview: string;
  description: string;
  images: string[];
  originalPrice: number;
  salePrice: number;
  brandName: string;
  categories: string[];
  variation?: string[];
  model?: string;
  coreFeatures?: Array<{ name: string; value: string }>;
  specification?: Array<{ name: string; value: string }>;
  stockCount: number;
  isPrivate?: boolean;
}

export interface CreateProductResponse {
  message: string;
  product: any;
}

export async function createProduct(payload: CreateProductPayload): Promise<CreateProductResponse> {
  return serverMutation<CreateProductResponse, CreateProductPayload>(
    "/products",
    "POST",
    payload
  );
}

// ── Admin manage mutations ──

export interface UpdateProductPayload {
  title?: string;
  overview?: string;
  description?: string;
  originalPrice?: number;
  salePrice?: number;
  brandName?: string;
  categories?: string[];
  variation?: string[];
  model?: string;
  coreFeatures?: Array<{ name: string; value: string }>;
  specification?: Array<{ name: string; value: string }>;
  stockCount?: number;
  isPrivate?: boolean;
}

export interface UpdateProductResponse {
  message: string;
  product: any;
}

export interface ToggleVisibilityResponse {
  message: string;
  product: any;
}

export interface DeleteProductResponse {
  message: string;
}

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload
): Promise<UpdateProductResponse> {
  return serverMutation<UpdateProductResponse, UpdateProductPayload>(
    `/products/${id}`,
    "PUT",
    payload
  );
}

export async function toggleProductVisibility(
  id: string,
  isPrivate: boolean
): Promise<ToggleVisibilityResponse> {
  return serverMutation<ToggleVisibilityResponse, { isPrivate: boolean }>(
    `/products/${id}`,
    "PATCH",
    { isPrivate }
  );
}

export async function deleteProduct(id: string): Promise<DeleteProductResponse> {
  return serverMutation<DeleteProductResponse, undefined>(
    `/products/${id}`,
    "DELETE"
  );
}
