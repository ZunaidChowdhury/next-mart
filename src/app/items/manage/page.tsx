"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchAllProducts, IProductItem } from "@/lib/api/product";
import {
  updateProduct,
  toggleProductVisibility,
  deleteProduct,
  UpdateProductPayload,
} from "@/lib/actions/product";
import {
  Button,
  Input,
  Textarea,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  CheckboxGroup,
  Checkbox,
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
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
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

export default function ManageProductsPage() {
  const router = useRouter();
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );

  // Auth guard state
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Product data state
  const [products, setProducts] = useState<IProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Delete modal state
  const deleteModal = useDisclosure();
  const [deletingProduct, setDeletingProduct] = useState<IProductItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit modal state
  const editModal = useDisclosure();
  const [editingProduct, setEditingProduct] = useState<IProductItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit form field states (pre-populated on edit open)
  const [editTitle, setEditTitle] = useState("");
  const [editBrandName, setEditBrandName] = useState("");
  const [editModel, setEditModel] = useState("");
  const [editOverview, setEditOverview] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editOriginalPrice, setEditOriginalPrice] = useState("");
  const [editSalePrice, setEditSalePrice] = useState("");
  const [editStockCount, setEditStockCount] = useState("");
  const [editIsPrivate, setEditIsPrivate] = useState(false);
  const [editCategories, setEditCategories] = useState<string[]>([]);
  const [editVariationInput, setEditVariationInput] = useState("");
  const [editVariations, setEditVariations] = useState<string[]>([]);
  const [editCoreFeatures, setEditCoreFeatures] = useState<
    Array<{ name: string; value: string }>
  >([]);
  const [editSpecifications, setEditSpecifications] = useState<
    Array<{ name: string; value: string }>
  >([]);

  // --- Auth Guard ---
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("Authentication required. Redirecting to login...");
      router.push("/login?redirect=/items/manage");
      return;
    }
    if (role !== "admin") {
      setCheckingAuth(false);
      return;
    }
    setCheckingAuth(false);
  }, [isAuthenticated, role, router]);

  // --- Data Fetch ---
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

  // --- Client-side Search Filter ---
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  // --- Visibility Toggle (Optimistic) ---
  const handleToggleVisibility = async (product: IProductItem) => {
    const newPrivate = !product.isPrivate;
    // Optimistic update
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
      // Revert on failure
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isPrivate: product.isPrivate } : p
        )
      );
      toast.error(err.message || "Failed to update visibility.");
    }
  };

  // --- Delete Modal ---
  const handleOpenDelete = (product: IProductItem) => {
    setDeletingProduct(product);
    deleteModal.onOpen();
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct._id);
      setProducts((prev) => prev.filter((p) => p._id !== deletingProduct._id));
      toast.success(`"${deletingProduct.title}" has been permanently deleted.`);
      deleteModal.onClose();
      setDeletingProduct(null);
    } catch (err: any) {
      toast.error(err.message || "Delete failed. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Edit Modal ---
  const handleOpenEdit = (product: IProductItem) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditBrandName(product.brandName);
    setEditModel(product.model || "");
    setEditOverview(product.overview);
    setEditDescription(product.description);
    setEditOriginalPrice(product.originalPrice.toString());
    setEditSalePrice(product.salePrice.toString());
    setEditStockCount(product.stockCount.toString());
    setEditIsPrivate(product.isPrivate);
    setEditCategories(product.categories);
    setEditVariations(product.variation || []);
    setEditCoreFeatures(
      product.coreFeatures.length > 0
        ? product.coreFeatures
        : [{ name: "", value: "" }]
    );
    setEditSpecifications(
      product.specification.length > 0
        ? product.specification
        : [{ name: "", value: "" }]
    );
    editModal.onOpen();
  };

  const handleEditAddVariation = () => {
    const clean = editVariationInput.trim();
    if (!clean || editVariations.includes(clean)) return;
    setEditVariations([...editVariations, clean]);
    setEditVariationInput("");
  };

  const handleEditRemoveVariation = (idx: number) => {
    setEditVariations(editVariations.filter((_, i) => i !== idx));
  };

  const handleEditFeatureChange = (
    idx: number,
    key: "name" | "value",
    val: string
  ) => {
    const updated = [...editCoreFeatures];
    updated[idx][key] = val;
    setEditCoreFeatures(updated);
  };

  const handleEditSpecChange = (
    idx: number,
    key: "name" | "value",
    val: string
  ) => {
    const updated = [...editSpecifications];
    updated[idx][key] = val;
    setEditSpecifications(updated);
  };

  const handleSubmitEdit = async () => {
    if (!editingProduct) return;

    if (!editTitle.trim()) return toast.error("Product Title is required.");
    if (!editBrandName.trim()) return toast.error("Brand Name is required.");
    if (!editOverview.trim()) return toast.error("Overview is required.");
    if (!editDescription.trim()) return toast.error("Description is required.");
    if (editCategories.length === 0)
      return toast.error("Select at least one category.");

    const oPriceNum = parseFloat(editOriginalPrice);
    const sPriceNum = parseFloat(editSalePrice);
    const stockNum = parseInt(editStockCount);

    if (isNaN(oPriceNum) || oPriceNum < 0)
      return toast.error("Enter a valid original price.");
    if (isNaN(sPriceNum) || sPriceNum < 0)
      return toast.error("Enter a valid sale price.");
    if (isNaN(stockNum) || stockNum < 0)
      return toast.error("Enter a valid stock count.");

    const cleanFeatures = editCoreFeatures.filter(
      (f) => f.name.trim() !== "" && f.value.trim() !== ""
    );
    const cleanSpecs = editSpecifications.filter(
      (s) => s.name.trim() !== "" && s.value.trim() !== ""
    );

    const payload: UpdateProductPayload = {
      title: editTitle.trim(),
      brandName: editBrandName.trim(),
      model: editModel.trim() || undefined,
      overview: editOverview.trim(),
      description: editDescription.trim(),
      originalPrice: oPriceNum,
      salePrice: sPriceNum,
      stockCount: stockNum,
      isPrivate: editIsPrivate,
      categories: editCategories,
      variation: editVariations,
      coreFeatures: cleanFeatures,
      specification: cleanSpecs,
    };

    setIsUpdating(true);
    try {
      const res = await updateProduct(editingProduct._id, payload);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editingProduct._id ? { ...p, ...payload } : p
        )
      );
      toast.success(res.message || "Product updated successfully!");
      editModal.onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update product.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Auth Guard Screens ---
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

      {/* Page Header */}
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
          color="secondary"
          onPress={() => router.push("/items/add")}
          className="font-sans font-semibold rounded-xl shadow-md cursor-pointer flex items-center gap-2"
        >
          <FiPlus size={16} />
          Add Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search by title or brand name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="bordered"
          radius="md"
          startContent={<FiSearch className="text-foreground/40" size={16} />}
          classNames={{ input: "font-sans text-sm" }}
        />
      </div>

      {/* Table / States */}
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
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-foreground/40">
          <FiPackage size={48} />
          <p className="font-sans text-sm font-medium">Placeholder [DataLoadFailed]</p>
        </div>
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
                        variant="flat"
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
                          onValueChange={() => handleToggleVisibility(product)}
                          size="sm"
                          color="secondary"
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
                          variant="light"
                          onPress={() => handleOpenEdit(product)}
                          className="text-foreground/60 hover:text-brand-primary-500 rounded-lg cursor-pointer"
                        >
                          <FiEdit2 size={15} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => handleOpenDelete(product)}
                          className="cursor-pointer rounded-lg"
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

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        size="sm"
        placement="center"
        classNames={{ base: "bg-card-bg border border-border-accent" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-display text-foreground">
                Confirm Deletion
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
                    <FiAlertTriangle size={28} />
                  </div>
                  <div className="text-center">
                    <p className="font-sans text-sm text-foreground/70">
                      This action is permanent and cannot be reversed. You are
                      about to delete:
                    </p>
                    <p className="font-sans text-base font-bold text-foreground mt-2">
                      &quot;{deletingProduct?.title}&quot;
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  onPress={onClose}
                  className="font-sans font-medium rounded-xl border-border-accent cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirmDelete}
                  isLoading={isDeleting}
                  className="font-sans font-bold rounded-xl cursor-pointer"
                >
                  Confirm Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ── Edit Product Modal ── */}
      <Modal
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        size="3xl"
        placement="center"
        scrollBehavior="inside"
        classNames={{ base: "bg-card-bg border border-border-accent" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-display text-foreground text-xl">
                Edit Product
                {editingProduct && (
                  <span className="ml-2 text-sm font-sans font-normal text-foreground/50">
                    — {editingProduct.title}
                  </span>
                )}
              </ModalHeader>
              <ModalBody className="flex flex-col gap-5 py-4">

                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Product Title" value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    variant="bordered" radius="md" required />
                  <Input label="Brand Name" value={editBrandName}
                    onChange={(e) => setEditBrandName(e.target.value)}
                    variant="bordered" radius="md" required />
                  <div className="sm:col-span-2">
                    <Input label="Model Number (Optional)" value={editModel}
                      onChange={(e) => setEditModel(e.target.value)}
                      variant="bordered" radius="md" />
                  </div>
                </div>

                <Textarea label="Brief Overview" value={editOverview}
                  onChange={(e) => setEditOverview(e.target.value)}
                  variant="bordered" radius="md" minRows={2} required />

                <Textarea label="Detailed Description" value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  variant="bordered" radius="md" minRows={4} required />

                {/* Pricing & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input type="number" label="Original Price ($)" value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(e.target.value)}
                    variant="bordered" radius="md" required />
                  <Input type="number" label="Sale Price ($)" value={editSalePrice}
                    onChange={(e) => setEditSalePrice(e.target.value)}
                    variant="bordered" radius="md" required />
                  <Input type="number" label="Stock Units" value={editStockCount}
                    onChange={(e) => setEditStockCount(e.target.value)}
                    variant="bordered" radius="md" required />
                </div>

                {/* Images — Read Only */}
                {editingProduct && editingProduct.images.length > 0 && (
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground mb-2">
                      Product Images{" "}
                      <span className="text-foreground/40 font-normal text-xs">
                        (read-only in this release)
                      </span>
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {editingProduct.images.map((url, idx) => (
                        <div
                          key={idx}
                          className="aspect-square rounded-xl overflow-hidden border border-border-accent bg-background"
                        >
                          <img
                            src={url}
                            alt={`img-${idx}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div>
                  <p className="font-sans text-sm font-semibold text-foreground mb-2">
                    Categories
                  </p>
                  <CheckboxGroup
                    value={editCategories}
                    onValueChange={setEditCategories}
                    orientation="horizontal"
                    className="gap-2 font-sans"
                  >
                    {AVAILABLE_CATEGORIES.map((cat) => (
                      <Checkbox
                        key={cat.value}
                        value={cat.value}
                        classNames={{ label: "text-xs font-medium text-foreground/75" }}
                      >
                        {cat.label}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </div>

                {/* Variations */}
                <div>
                  <p className="font-sans text-sm font-semibold text-foreground mb-2">
                    Variations
                  </p>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="E.g. Polarized Black"
                      value={editVariationInput}
                      onChange={(e) => setEditVariationInput(e.target.value)}
                      variant="bordered"
                      radius="md"
                      size="sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleEditAddVariation();
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onPress={handleEditAddVariation}
                      className="rounded-xl font-sans cursor-pointer font-medium"
                    >
                      Add
                    </Button>
                  </div>
                  {editVariations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {editVariations.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary-500/10 text-brand-primary-600 dark:text-brand-primary-400 font-sans text-xs font-semibold rounded-xl border border-brand-primary-500/20"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleEditRemoveVariation(idx)}
                            className="text-foreground/40 hover:text-danger cursor-pointer transition-colors"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Core Features */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-sans text-sm font-semibold text-foreground">
                      Core Features
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onPress={() =>
                        setEditCoreFeatures([
                          ...editCoreFeatures,
                          { name: "", value: "" },
                        ])
                      }
                      className="rounded-xl flex items-center gap-1.5 font-sans font-medium cursor-pointer"
                    >
                      <FiPlus size={13} /> Add
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {editCoreFeatures.map((feat, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          placeholder="Feature Name"
                          value={feat.name}
                          onChange={(e) =>
                            handleEditFeatureChange(idx, "name", e.target.value)
                          }
                          variant="bordered"
                          radius="md"
                          size="sm"
                          className="flex-1"
                        />
                        <Input
                          placeholder="Feature Value"
                          value={feat.value}
                          onChange={(e) =>
                            handleEditFeatureChange(idx, "value", e.target.value)
                          }
                          variant="bordered"
                          radius="md"
                          size="sm"
                          className="flex-1"
                        />
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => {
                            if (editCoreFeatures.length === 1) {
                              setEditCoreFeatures([{ name: "", value: "" }]);
                            } else {
                              setEditCoreFeatures(
                                editCoreFeatures.filter((_, i) => i !== idx)
                              );
                            }
                          }}
                          className="cursor-pointer rounded-xl"
                        >
                          <FiTrash size={15} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Specifications */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-sans text-sm font-semibold text-foreground">
                      Technical Specifications
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onPress={() =>
                        setEditSpecifications([
                          ...editSpecifications,
                          { name: "", value: "" },
                        ])
                      }
                      className="rounded-xl flex items-center gap-1.5 font-sans font-medium cursor-pointer"
                    >
                      <FiPlus size={13} /> Add
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {editSpecifications.map((spec, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          placeholder="Spec Label"
                          value={spec.name}
                          onChange={(e) =>
                            handleEditSpecChange(idx, "name", e.target.value)
                          }
                          variant="bordered"
                          radius="md"
                          size="sm"
                          className="flex-1"
                        />
                        <Input
                          placeholder="Spec Info"
                          value={spec.value}
                          onChange={(e) =>
                            handleEditSpecChange(idx, "value", e.target.value)
                          }
                          variant="bordered"
                          radius="md"
                          size="sm"
                          className="flex-1"
                        />
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => {
                            if (editSpecifications.length === 1) {
                              setEditSpecifications([{ name: "", value: "" }]);
                            } else {
                              setEditSpecifications(
                                editSpecifications.filter((_, i) => i !== idx)
                              );
                            }
                          }}
                          className="cursor-pointer rounded-xl"
                        >
                          <FiTrash size={15} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visibility */}
                <div className="flex justify-between items-center p-4 rounded-xl bg-background border border-border-accent/30">
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">
                      Private Listing
                    </p>
                    <p className="font-sans text-xs text-foreground/50">
                      Hide product from public search queries
                    </p>
                  </div>
                  <Switch
                    isSelected={editIsPrivate}
                    onValueChange={setEditIsPrivate}
                    color="secondary"
                  />
                </div>

              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  onPress={onClose}
                  className="font-sans font-medium rounded-xl border-border-accent cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  onPress={handleSubmitEdit}
                  isLoading={isUpdating}
                  className="font-sans font-bold rounded-xl cursor-pointer"
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </main>
  );
}
