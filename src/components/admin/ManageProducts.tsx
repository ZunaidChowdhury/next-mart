"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchAllProducts, IProductItem } from "@/lib/api/product";
import {
  toggleProductVisibility,
  deleteProduct,
} from "@/lib/actions/product";
import {
  Button,
  Switch,
  Modal,
  Chip,
} from "@heroui/react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiTrash,
  FiLock,
  FiSearch,
  FiPackage,
  FiAlertTriangle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "@/components/common/EmptyState";
import { toast } from "react-toastify";

const AVAILABLE_CATEGORIES = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Kids", value: "kids" },
  { label: "Watches", value: "watches" },
  { label: "Sunglasses", value: "sunglasses" },
  { label: "Gadgets", value: "gadgets" },
  { label: "Electronics", value: "electronics" },
];

const inputCls =
  "h-11 w-full px-3 text-sm font-sans rounded-xl border border-border-accent bg-card-bg text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-brand-primary-500 transition-colors";
const inputSmCls =
  "h-9 w-full px-3 text-xs font-sans rounded-lg border border-border-accent bg-card-bg text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-brand-primary-500 transition-colors";
const textareaCls =
  "w-full px-3 py-2.5 text-sm font-sans rounded-xl border border-border-accent bg-card-bg text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-brand-primary-500 transition-colors resize-none";
const labelCls = "block text-xs font-bold text-foreground/75 font-sans mb-1";

export default function ManageProducts() {
  const router = useRouter();
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [products, setProducts] = useState<IProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrivate, setShowPrivate] = useState(true);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<IProductItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("Authentication required. Redirecting to login...");
      router.push("/login?redirect=/dashboard/admin/items/manage");
      return;
    }
    setCheckingAuth(false);
  }, [isAuthenticated, role, router]);

  useEffect(() => {
    if (!checkingAuth && role === "admin") {
      loadProducts();
    }
  }, [checkingAuth, role]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllProducts();
      setProducts(data.products);
    } catch (err) {
      console.error("Failed to load products:", err);
      toast.error("Failed to load inventory. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let list = products;
    if (!showPrivate) list = list.filter((p) => !p.isPrivate);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, searchQuery, showPrivate]);

  const handleToggleVisibility = async (product: IProductItem) => {
    const newPrivate = !product.isPrivate;
    setProducts((prev) =>
      prev.map((p) =>
        p._id === product._id ? { ...p, isPrivate: newPrivate } : p
      )
    );
    try {
      await toggleProductVisibility(product._id, newPrivate);
      toast.success(
        `"${product.title}" is now ${newPrivate ? "Private" : "Live"}.`
      );
    } catch (err: any) {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isPrivate: product.isPrivate } : p
        )
      );
      toast.error(err.message || "Failed to update visibility.");
    }
  };

  const handleOpenDelete = (product: IProductItem) => {
    setDeletingProduct(product);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct._id);
      setProducts((prev) => prev.filter((p) => p._id !== deletingProduct._id));
      toast.success(`"${deletingProduct.title}" has been permanently deleted.`);
      setIsDeleteOpen(false);
      setDeletingProduct(null);
    } catch (err: any) {
      toast.error(err.message || "Delete failed. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };



  if (checkingAuth) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-foreground/10 border-t-brand-primary-500" />
          <p className="font-sans text-sm font-medium text-foreground/70">
            Verifying administrative session...
          </p>
        </div>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <main className="flex-1 flex items-center justify-center p-6 bg-background min-h-[70vh]">
        <div className="text-center max-w-md p-8 rounded-2xl bg-card-bg border border-border-accent shadow-xl flex flex-col items-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger mb-6">
            <FiLock size={32} />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-2">
            Access Denied
          </h2>
          <p className="font-sans text-sm text-foreground/60 mb-6">
            You do not have permissions to access the inventory management
            console. This dashboard is restricted to store owners.
          </p>
          <Button
            variant="secondary"
            onPress={() => router.push("/")}
            className="font-sans font-medium rounded-xl shadow-md cursor-pointer"
          >
            Go Back Home
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-1 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Inventory Manager
          </h1>
          <p className="font-sans text-sm text-foreground/60 mt-1">
            {products.length} total product{products.length !== 1 ? "s" : ""} in catalog
          </p>
        </div>
        <Button
          variant="secondary"
          onPress={() => router.push("/dashboard/admin/items/add")}
          className="font-sans font-semibold rounded-xl shadow-md cursor-pointer flex items-center gap-2"
        >
          <FiPlus size={16} />
          Add Product
        </Button>
      </div>

      <div className="mb-6 relative flex items-center">
        <span className="absolute left-3.5 text-foreground/40">
          <FiSearch size={16} />
        </span>
        <input
          type="text"
          placeholder="Search by title or brand name..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="w-full bg-card-bg border border-border-accent rounded-xl text-sm py-2.5 pl-11 pr-4 text-foreground font-sans focus:outline-none focus:border-brand-primary-500 placeholder:text-foreground/40 transition-colors"
        />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Button
          size="sm"
          variant={showPrivate ? "secondary" : "outline"}
          onPress={() => setShowPrivate(!showPrivate)}
          className="font-sans text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5"
        >
          {showPrivate ? <FiEye size={14} /> : <FiEyeOff size={14} />}
          {showPrivate ? "Showing All" : "Live Only"}
        </Button>
        <span className="text-xs text-foreground/40 font-sans">
          {filteredProducts.length} of {products.length} shown
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-16 w-full animate-pulse rounded-xl bg-card-bg border border-border-accent/30"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No products match your search"
          description="Try a different search term or adjust the visibility filter above."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-accent/40 bg-card-bg shadow-sm">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border-accent/40 bg-background/60">
                <th className="px-4 py-3 text-left font-semibold text-foreground/60 w-10">#</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground/60 w-16">Image</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground/60">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground/60">Brand</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground/60">Sale Price</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground/60">Stock</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground/60">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground/60">Visibility</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-b border-border-accent/20 hover:bg-background/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-foreground/50 text-xs">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-background border border-border-accent/30 flex-shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <FiPackage size={14} className="text-foreground/30" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground truncate max-w-[200px]">{product.title}</p>
                      {product.model && (
                        <p className="text-xs text-foreground/40">{product.model}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-foreground/70">{product.brandName}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      ${product.salePrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-bold ${
                          product.stockCount === 0 ? "text-danger" : "text-foreground"
                        }`}
                      >
                        {product.stockCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Chip
                        size="sm"
                        variant="soft"
                        color={product.availableStatus === "in-stock" ? "success" : "danger"}
                        className="font-sans text-[10px] font-bold"
                      >
                        {product.availableStatus === "in-stock" ? "In-Stock" : "Out of Stock"}
                      </Chip>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          isSelected={!product.isPrivate}
                          onChange={() => handleToggleVisibility(product)}
                          size="sm"
                        />
                        <span className="text-xs text-foreground/60 w-12 text-left">
                          {product.isPrivate ? "Private" : "Live"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          onPress={() => handleToggleVisibility(product)}
                          className={`rounded-lg cursor-pointer ${
                            product.isPrivate
                              ? "text-foreground/40 hover:text-foreground/70"
                              : "text-success hover:text-success/80"
                          }`}
                        >
                          {product.isPrivate ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          onPress={() => router.push(`/dashboard/admin/items/edit/${product._id}`)}
                          className="text-foreground/60 hover:text-brand-primary-500 rounded-lg cursor-pointer"
                        >
                          <FiEdit2 size={15} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          onPress={() => handleOpenDelete(product)}
                          className="text-danger hover:bg-danger-soft/10 cursor-pointer rounded-lg"
                        >
                          <FiTrash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      >
        <Modal.Backdrop className="bg-black/40 backdrop-blur-md">
          <Modal.Container placement="center" size="md" className="bg-card-bg/95 border border-border-accent shadow-2xl rounded-2xl overflow-hidden backdrop-blur-lg">
            <Modal.Dialog>
              <Modal.CloseTrigger className="text-foreground/40 hover:text-foreground transition-colors top-4 right-4" />
              <Modal.Header className="flex flex-col items-center gap-3 pt-8 pb-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger ring-8 ring-danger/5"
                >
                  <FiAlertTriangle size={30} />
                </motion.div>
                <Modal.Heading className="font-display text-xl font-bold text-foreground text-center mt-2">
                  Delete Product
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="px-8 py-5">
                <div className="text-center">
                  <p className="font-sans text-sm text-foreground/60 leading-relaxed">
                    This action is permanent and cannot be undone. Are you sure you want to delete
                  </p>
                  <p className="font-sans text-base font-bold text-foreground mt-2 px-2 py-1.5 bg-danger/5 rounded-lg border border-danger/10 inline-block">
                    &quot;{deletingProduct?.title}&quot;
                  </p>
                </div>
              </Modal.Body>
              <Modal.Footer className="flex gap-3 px-8 pb-8 pt-2">
                <Button
                  variant="outline"
                  slot="close"
                  className="flex-1 h-11 font-sans font-semibold rounded-xl border-border-accent cursor-pointer text-sm"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onPress={handleConfirmDelete}
                  isDisabled={isDeleting}
                  className="flex-1 h-11 font-sans font-bold rounded-xl cursor-pointer text-sm shadow-lg shadow-danger/20"
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    "Delete Product"
                  )}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

    </main>
  );
}
