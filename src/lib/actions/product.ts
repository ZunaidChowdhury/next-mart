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
