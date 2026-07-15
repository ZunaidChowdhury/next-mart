"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { createProduct } from "@/lib/actions/product";
import { UploadDropzone } from "@/lib/uploadthing";
import { Button } from "@heroui/react";
import { FiPlus, FiTrash, FiUploadCloud, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
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
const cardCls =
  "p-6 bg-card-bg border border-border-accent/40 rounded-2xl shadow-sm flex flex-col gap-6";

export default function AddProductForm() {
  const router = useRouter();
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [model, setModel] = useState("");
  const [brandName, setBrandName] = useState("");
  const [overview, setOverview] = useState("");
  const [description, setDescription] = useState("");

  const [originalPrice, setOriginalPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stockCount, setStockCount] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [variationInput, setVariationInput] = useState("");
  const [variations, setVariations] = useState<string[]>([]);

  const [coreFeatures, setCoreFeatures] = useState<
    Array<{ name: string; value: string }>
  >([{ name: "", value: "" }]);
  const [specifications, setSpecifications] = useState<
    Array<{ name: string; value: string }>
  >([{ name: "", value: "" }]);

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [featuredPosition, setFeaturedPosition] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("Authentication required. Redirecting to login...");
      router.push("/login?redirect=/dashboard/admin/items/add");
      return;
    }
    setCheckingAuth(false);
  }, [isAuthenticated, role, router]);

  const toggleCategory = (val: string) => {
    setSelectedCategories((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );
  };

  const handleAddVariation = () => {
    const cleanTag = variationInput.trim();
    if (!cleanTag) return;
    if (variations.includes(cleanTag)) {
      toast.info("Variation tag already exists");
      return;
    }
    setVariations([...variations, cleanTag]);
    setVariationInput("");
  };

  const handleRemoveVariation = (idx: number) => {
    setVariations(variations.filter((_, i) => i !== idx));
  };

  const handleFeatureChange = (
    index: number,
    key: "name" | "value",
    val: string
  ) => {
    const updated = [...coreFeatures];
    updated[index][key] = val;
    setCoreFeatures(updated);
  };

  const handleAddFeature = () =>
    setCoreFeatures([...coreFeatures, { name: "", value: "" }]);

  const handleRemoveFeature = (index: number) => {
    if (coreFeatures.length === 1) {
      setCoreFeatures([{ name: "", value: "" }]);
    } else {
      setCoreFeatures(coreFeatures.filter((_, i) => i !== index));
    }
  };

  const handleSpecChange = (
    index: number,
    key: "name" | "value",
    val: string
  ) => {
    const updated = [...specifications];
    updated[index][key] = val;
    setSpecifications(updated);
  };

  const handleAddSpec = () =>
    setSpecifications([...specifications, { name: "", value: "" }]);

  const handleRemoveSpec = (index: number) => {
    if (specifications.length === 1) {
      setSpecifications([{ name: "", value: "" }]);
    } else {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  const handleRemoveImage = (imageIndex: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== imageIndex));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Product Title is required.");
    if (!brandName.trim()) return toast.error("Brand Name is required.");
    if (!overview.trim()) return toast.error("Product Overview is required.");
    if (!description.trim())
      return toast.error("Product Description is required.");
    if (uploadedImages.length === 0)
      return toast.error("Upload at least one image.");
    if (selectedCategories.length === 0)
      return toast.error("Select at least one product category.");

    const oPriceNum = parseFloat(originalPrice);
    const sPriceNum = parseFloat(salePrice);
    const stockNum = parseInt(stockCount);

    if (isNaN(oPriceNum) || oPriceNum < 0)
      return toast.error("Please enter a valid original price.");
    if (isNaN(sPriceNum) || sPriceNum < 0)
      return toast.error("Please enter a valid sale price.");
    if (isNaN(stockNum) || stockNum < 0)
      return toast.error("Please enter a valid stock count.");

    const cleanFeatures = coreFeatures.filter(
      (f) => f.name.trim() !== "" && f.value.trim() !== ""
    );
    const cleanSpecs = specifications.filter(
      (s) => s.name.trim() !== "" && s.value.trim() !== ""
    );

    const payload = {
      title: title.trim(),
      model: model.trim() || undefined,
      brandName: brandName.trim(),
      overview: overview.trim(),
      description: description.trim(),
      originalPrice: oPriceNum,
      salePrice: sPriceNum,
      stockCount: stockNum,
      isPrivate,
      categories: selectedCategories,
      variation: variations,
      coreFeatures: cleanFeatures,
      specification: cleanSpecs,
      images: uploadedImages,
      featuredPosition: featuredPosition ?? undefined,
    };

    try {
      setIsSubmitting(true);
      const response = await createProduct(payload);
      toast.success(response.message || "Product published successfully!");
      router.push("/dashboard/admin/items/manage");
    } catch (err: any) {
      console.error("Failed to create product:", err);
      toast.error(
        err.message ||
          "Failed to create product. Content moderation check may have failed."
      );
    } finally {
      setIsSubmitting(false);
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
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md p-8 rounded-2xl bg-card-bg border border-border-accent shadow-xl flex flex-col items-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger mb-6">
            <FiLock size={32} />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-2">
            Access Denied
          </h2>
          <p className="font-sans text-sm text-foreground/60 mb-6">
            You do not have permissions to access the catalog management
            console. This area is restricted to store administrators only.
          </p>
          <Button
            variant="secondary"
            onPress={() => router.push("/")}
            className="font-sans font-medium rounded-xl shadow-md cursor-pointer"
          >
            Go Back Home
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-1 bg-background">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Add New Product
        </h1>
        <p className="font-sans text-sm text-foreground/60 mt-1">
          Publish products to the catalog database. All uploads undergo
          automated keyword moderation checks.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className={cardCls}>
            <h3 className="font-display text-lg font-bold text-foreground">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Product Title *</label>
                <input
                  type="text"
                  placeholder="E.g. Aviator Classic Sunglasses"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Brand Name *</label>
                <input
                  type="text"
                  placeholder="E.g. Ray-Ban"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  Model Number / Tag{" "}
                  <span className="font-normal opacity-60">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="E.g. RB3025"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Brief Overview *</label>
              <textarea
                rows={2}
                placeholder="Provide a concise one-line summary of the item."
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                className={textareaCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>Detailed Description *</label>
              <textarea
                rows={6}
                placeholder="Describe product highlights, durability characteristics, package specs, and materials..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={textareaCls}
                required
              />
            </div>
          </div>

          <div className={cardCls}>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Product Images
              </h3>
              <p className="font-sans text-xs text-foreground/50 mt-0.5">
                Upload up to 4 demonstration images. (Max 4MB each)
              </p>
            </div>

            <div className="border-2 border-dashed border-border-accent rounded-2xl p-4 bg-background/50 hover:bg-background/80 transition-colors">
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    const urls = res.map((f) => f.url);
                    setUploadedImages((prev) =>
                      [...prev, ...urls].slice(0, 4)
                    );
                    toast.success("Images uploaded successfully!");
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Upload error: ${error.message}`);
                }}
                appearance={{
                  container:
                    "border-0 p-4 min-h-[160px] flex items-center justify-center cursor-pointer",
                  button:
                    "bg-brand-primary-600 hover:bg-brand-primary-700 text-white font-sans font-medium text-xs rounded-xl shadow-md py-2 px-4 cursor-pointer mt-3",
                  label: "text-foreground font-sans font-semibold text-sm",
                  allowedContent: "text-foreground/50 text-[10px] mt-1",
                }}
              />
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {uploadedImages.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden aspect-square border border-border-accent bg-background"
                  >
                    <img
                      src={url}
                      alt={`Product Upload ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 bg-danger text-white rounded-lg p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <FiTrash size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Image {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={cardCls}>
            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Core Features
                  </h3>
                  <p className="font-sans text-xs text-foreground/50">
                    Key highlighted product properties.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-sans rounded-xl border border-border-accent bg-card-bg hover:bg-brand-primary-500/10 hover:border-brand-primary-500/30 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors cursor-pointer"
                >
                  <FiPlus size={13} /> Add Feature
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {coreFeatures.map((feat, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Feature Name (e.g. Lens Width)"
                      value={feat.name}
                      onChange={(e) =>
                        handleFeatureChange(idx, "name", e.target.value)
                      }
                      className={`${inputSmCls} flex-1`}
                    />
                    <input
                      type="text"
                      placeholder="Feature Value (e.g. 58mm)"
                      value={feat.value}
                      onChange={(e) =>
                        handleFeatureChange(idx, "value", e.target.value)
                      }
                      className={`${inputSmCls} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors cursor-pointer"
                    >
                      <FiTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border-accent/20" />

            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Technical Specifications
                  </h3>
                  <p className="font-sans text-xs text-foreground/50">
                    Detailed performance variables.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-sans rounded-xl border border-border-accent bg-card-bg hover:bg-brand-primary-500/10 hover:border-brand-primary-500/30 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors cursor-pointer"
                >
                  <FiPlus size={13} /> Add Spec
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {specifications.map((spec, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Spec Label (e.g. UV Protection)"
                      value={spec.name}
                      onChange={(e) =>
                        handleSpecChange(idx, "name", e.target.value)
                      }
                      className={`${inputSmCls} flex-1`}
                    />
                    <input
                      type="text"
                      placeholder="Spec Value (e.g. 100% UVA & UVB)"
                      value={spec.value}
                      onChange={(e) =>
                        handleSpecChange(idx, "value", e.target.value)
                      }
                      className={`${inputSmCls} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors cursor-pointer"
                    >
                      <FiTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className={cardCls}>
            <h3 className="font-display text-lg font-bold text-foreground">
              Pricing & Inventory
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Original Price ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Sale Price ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>In-Stock Units *</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-display text-lg font-bold text-foreground">
              Taxonomy & Customizations
            </h3>

            <div>
              <label className={labelCls}>Categories *</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {AVAILABLE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggleCategory(cat.value)}
                      className={`px-3 py-1.5 text-xs font-semibold font-sans rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-brand-primary-500 border-brand-primary-500 text-white"
                          : "bg-card-bg border-border-accent text-foreground/70 hover:border-brand-primary-500/50 hover:text-brand-primary-600 dark:hover:text-brand-primary-400"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-border-accent/20" />

            <div>
              <label className={labelCls}>Variations (Sizes / Colors)</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="E.g. Polarized Black"
                  value={variationInput}
                  onChange={(e) => setVariationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddVariation();
                    }
                  }}
                  className={`${inputSmCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={handleAddVariation}
                  className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold font-sans rounded-xl border border-border-accent bg-card-bg hover:bg-brand-primary-500/10 hover:border-brand-primary-500/30 hover:text-brand-primary-600 dark:hover:text-brand-primary-400 transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
              {variations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {variations.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary-500/10 text-brand-primary-600 dark:text-brand-primary-400 font-sans text-xs font-semibold rounded-xl border border-brand-primary-500/20"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveVariation(idx)}
                        className="text-foreground/40 hover:text-danger cursor-pointer transition-colors leading-none"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-xs text-foreground/40 italic">
                  No variations added. (e.g. Standard Model)
                </p>
              )}
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-display text-lg font-bold text-foreground">
              Catalog Visibility
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-foreground font-sans">
                  Private Listing
                </p>
                <p className="text-xs text-foreground/50 font-sans">
                  Hide product from public catalog queries
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isPrivate}
                onClick={() => setIsPrivate((v) => !v)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPrivate ? "bg-brand-primary-500" : "bg-foreground/20"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isPrivate ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className={cardCls}>
            <h3 className="font-display text-lg font-bold text-foreground">
              Featured Position
            </h3>
            <div>
              <label className={labelCls}>Slot (1–8)</label>
              <select
                value={featuredPosition ?? ""}
                onChange={(e) =>
                  setFeaturedPosition(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className={inputCls}
              >
                <option value="">Not featured</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    Position {n}
                  </option>
                ))}
              </select>
              <p className="font-sans text-xs text-foreground/50 mt-1.5">
                Assign a slot to feature this product in the Seasonal Highlights
                section on the homepage.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              isDisabled={isSubmitting}
              className="w-full h-12 font-sans font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-current"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Publishing...</span>
                </span>
              ) : (
                <>
                  <FiUploadCloud size={16} />
                  <span>Publish Product</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onPress={() => router.push("/")}
              className="w-full h-12 font-sans font-semibold rounded-xl border border-border-accent cursor-pointer"
            >
              Cancel & Return
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
