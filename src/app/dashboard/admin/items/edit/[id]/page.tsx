"use client";

import { useParams } from "next/navigation";
import AddProductForm from "@/components/admin/AddProductForm";

export default function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  return <AddProductForm productId={id} />;
}
