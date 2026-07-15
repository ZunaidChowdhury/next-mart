import { serverFetch } from "../core/server";

export interface GetProductsParams {
  page?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: string;
  featured?: boolean;
}

export interface IFeature {
  name: string;
  value: string;
}

export interface ISpecification {
  name: string;
  value: string;
}

export interface IReview {
  user: string;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface IProductItem {
  _id: string;
  title: string;
  overview: string;
  description: string;
  images: string[];
  originalPrice: number;
  salePrice: number;
  rating: number;
  ratedBy: number;
  brandName: string;
  availableStatus: "in-stock" | "out-of-stock";
  soldQuantity: number;
  variation: string[];
  model?: string;
  categories: string[];
  isPrivate: boolean;
  stockCount: number;
  featuredPosition: number | null;
  coreFeatures: IFeature[];
  specification: ISpecification[];
  reviews: IReview[];
}

export interface ProductsResponse {
  products: IProductItem[];
  page: number;
  totalPages: number;
  totalProducts: number;
}

export async function fetchProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.search) queryParams.set("search", params.search);
  if (params.category) queryParams.set("category", params.category);
  if (params.minPrice) queryParams.set("minPrice", params.minPrice.toString());
  if (params.maxPrice) queryParams.set("maxPrice", params.maxPrice.toString());
  if (params.rating) queryParams.set("rating", params.rating.toString());
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.featured) queryParams.set("featured", "true");

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ""}`;
  return serverFetch<ProductsResponse>(endpoint);
}

export async function fetchFeaturedProducts(): Promise<{ products: IProductItem[] }> {
  return serverFetch<{ products: IProductItem[] }>("/products/featured");
}

export async function fetchProductById(id: string): Promise<{ product: IProductItem }> {
  return serverFetch<{ product: IProductItem }>(`/products/${id}`);
}

// ── Admin-only: fetch all products including isPrivate:true with no pagination ──
export interface AdminProductsResponse {
  products: IProductItem[];
  totalProducts: number;
}

export async function fetchAllProducts(): Promise<AdminProductsResponse> {
  return serverFetch<AdminProductsResponse>(`/products/admin/all`);
}
