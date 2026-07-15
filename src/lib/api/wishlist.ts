import { serverMutation } from "../core/server";
import { serverFetch } from "../core/server";
import type { WishlistItem } from "@/lib/store/slices/wishlistSlice";

export async function syncAddToWishlist(productId: string): Promise<void> {
  await serverMutation("/wishlist", "POST", { productId });
}

export async function syncRemoveFromWishlist(productId: string): Promise<void> {
  await serverMutation(`/wishlist/${productId}`, "DELETE");
}

interface WishlistProduct {
  _id: string;
  title: string;
  salePrice: number;
  images: string[];
}

export async function fetchWishlistItems(): Promise<WishlistItem[]> {
  const data = await serverFetch<{ wishlist: WishlistProduct[] }>("/wishlist");
  return data.wishlist.map((p) => ({
    product: p._id,
    title: p.title,
    price: p.salePrice,
    image: p.images?.[0] || "",
  }));
}

export async function syncLocalWishlistToBackend(localItems: WishlistItem[]): Promise<void> {
  for (const item of localItems) {
    try {
      await syncAddToWishlist(item.product);
    } catch {
      // Ignore duplicates / errors
    }
  }
}
