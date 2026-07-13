"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchProducts, IProductItem } from "@/lib/api/product";
import ProductCard from "@/components/product/ProductCard";
import SkeletonLoader from "@/components/product/SkeletonLoader";
import { Button } from "@heroui/react";
import { 
  FiSearch, 
  FiStar, 
  FiChevronLeft, 
  FiChevronRight, 
  FiRefreshCw 
} from "react-icons/fi";

const CATEGORIES_LIST = [
  { label: "All Products", value: "" },
  { label: "Sunglasses", value: "sunglasses" },
  { label: "Gadgets", value: "gadgets" },
  { label: "Watches", value: "watches" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Kids", value: "kids" },
];

const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "date-desc" },
  { label: "Oldest First", value: "date-asc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function ShopCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active query states (directly syncs with fetch actions)
  const [products, setProducts] = useState<IProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter input states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  // Temporary inputs (holds values before submit/apply)
  const [searchInput, setSearchInput] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  // Sync initial query values from URL on mount
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "";
    const urlSearch = searchParams.get("search") || "";
    const urlPage = parseInt(searchParams.get("page") || "1");

    setCategory(urlCategory);
    setSearch(urlSearch);
    setSearchInput(urlSearch);
    setPage(urlPage);
  }, [searchParams]);

  // Fetch catalog products from the database whenever filter states update
  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchProducts({
          page,
          search: search || undefined,
          category: category || undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          rating: rating ? parseFloat(rating) : undefined,
          sortBy
        });

        setProducts(response.products);
        setTotalProducts(response.totalProducts);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        console.error("Catalog fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, [page, search, category, minPrice, maxPrice, rating, sortBy]);

  const handleApplySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearch(searchInput);
    setPage(1); // Reset page on new query
  };

  const handleApplyPrices = (e: React.FormEvent) => {
    e.preventDefault();
    setMinPrice(minPriceInput);
    setMaxPrice(maxPriceInput);
    setPage(1);
  };

  const handleRatingSelect = (rate: string) => {
    setRating(rating === rate ? "" : rate);
    setPage(1);
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setPage(1);
    
    // Update URL query optionally to keep shareability
    const params = new URLSearchParams(window.location.search);
    if (cat) params.set("category", cat);
    else params.delete("category");
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSearchInput("");
    setCategory("");
    setMinPrice("");
    setMinPriceInput("");
    setMaxPrice("");
    setMaxPriceInput("");
    setRating("");
    setSortBy("date-desc");
    setPage(1);
    router.push("/shop");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    
    // Scroll viewport smoothly back to listing top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      
      {/* SIDEBAR FILTERS (Left Column) */}
      <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6">
        
        {/* Searchbar */}
        <form onSubmit={handleApplySearch} className="flex gap-2 w-full">
          <div className="relative flex-1 flex items-center">
            <span className="absolute left-3 text-foreground/45">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-card-bg border border-border-accent rounded-xl text-xs py-2.5 pl-10 pr-3 text-foreground font-sans focus:outline-none focus:border-brand-primary-500 placeholder:text-foreground/45"
            />
          </div>
          <Button type="submit" variant="secondary" className="rounded-xl px-4 cursor-pointer font-sans text-xs font-semibold">
            Go
          </Button>
        </form>

        {/* Categories Selector */}
        <div className="border border-border-accent bg-card-bg rounded-2xl p-4">
          <h3 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <span>Categories</span>
          </h3>
          <div className="flex flex-col gap-1">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategorySelect(cat.value)}
                className={`w-full text-left font-sans text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer ${
                  category === cat.value
                    ? "bg-brand-primary-500/10 text-brand-primary-600 dark:text-brand-primary-400 font-semibold"
                    : "text-foreground/75 hover:bg-background hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price limit filter */}
        <div className="border border-border-accent bg-card-bg rounded-2xl p-4">
          <h3 className="font-display text-sm font-bold text-foreground mb-3">Price Range</h3>
          <form onSubmit={handleApplyPrices} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ($)"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-full bg-card-bg border border-border-accent rounded-xl text-xs py-2 px-3 text-foreground font-sans focus:outline-none focus:border-brand-primary-500 placeholder:text-foreground/45"
              />
              <span className="text-foreground/45 text-xs">to</span>
              <input
                type="number"
                placeholder="Max ($)"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full bg-card-bg border border-border-accent rounded-xl text-xs py-2 px-3 text-foreground font-sans focus:outline-none focus:border-brand-primary-500 placeholder:text-foreground/45"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm" className="w-full rounded-xl cursor-pointer">
              Apply Prices
            </Button>
          </form>
        </div>

        {/* Minimum rating filter */}
        <div className="border border-border-accent bg-card-bg rounded-2xl p-4">
          <h3 className="font-display text-sm font-bold text-foreground mb-3">Customer Review</h3>
          <div className="flex flex-col gap-2">
            {["4", "3", "2"].map((stars) => {
              const isActive = rating === stars;
              return (
                <button
                  key={stars}
                  onClick={() => handleRatingSelect(stars)}
                  className={`flex items-center justify-between w-full text-left font-sans text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer ${
                    isActive
                      ? "bg-brand-primary-500/10 text-brand-primary-600 dark:text-brand-primary-400 font-semibold"
                      : "text-foreground/75 hover:bg-background hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`h-3.5 w-3.5 ${i < parseInt(stars) ? "fill-amber-500" : "text-zinc-300"}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs">& Up</span>
                  </div>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-brand-primary-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Filters */}
        <Button
          variant="secondary"
          onClick={handleClearFilters}
          className="w-full font-sans font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <FiRefreshCw size={14} />
          <span>Clear Filters</span>
        </Button>
      </aside>

      {/* CATALOG GRID & PAGINATION ROW (Right Column) */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Catalog Header Row (Sort and counts) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border-accent/40 pb-4">
          <p className="font-sans text-xs text-foreground/50">
            {loading ? "Searching..." : `Showing ${products.length} of ${totalProducts} products`}
          </p>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-sans text-xs text-foreground/50 whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-48 bg-card-bg border border-border-accent rounded-xl text-xs py-2 px-3 text-foreground font-sans focus:outline-none focus:border-brand-primary-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Product Grid */}
        {loading ? (
          <div className="w-full py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col rounded-2xl border border-border-accent bg-card-bg overflow-hidden p-5 animate-pulse"
                >
                  <div className="h-48 bg-foreground/10 rounded-xl mb-4" />
                  <div className="h-3 w-1/4 bg-foreground/10 rounded mb-2" />
                  <div className="h-5 w-3/4 bg-foreground/10 rounded mb-3" />
                  <div className="h-4 w-1/2 bg-foreground/10 rounded mb-4" />
                  <div className="h-10 w-full bg-foreground/10 rounded-xl mt-auto" />
                </div>
              ))}
            </div>
          </div>
        ) : error || products.length === 0 ? (
          <div className="w-full text-center py-24 font-sans text-foreground/50 border border-dashed border-border-accent rounded-2xl bg-card-bg">
            Placeholder [DataLoadFailed]
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-8 border-t border-border-accent/40 mt-4">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handlePageChange(page - 1)}
                  isDisabled={page === 1}
                  className="rounded-xl cursor-pointer"
                >
                  <FiChevronLeft size={16} />
                  <span>Prev</span>
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-8 w-8 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                          pageNum === page
                            ? "bg-brand-primary-500 text-white font-bold"
                            : "text-foreground hover:bg-card-bg"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handlePageChange(page + 1)}
                  isDisabled={page === totalPages}
                  className="rounded-xl cursor-pointer"
                >
                  <span>Next</span>
                  <FiChevronRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
