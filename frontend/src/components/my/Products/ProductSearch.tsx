import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  DollarSign,
  Check,
} from "lucide-react";

interface ProductSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  minPrice: number | "";
  setMinPrice: (price: number | "") => void;
  maxPrice: number | "";
  setMaxPrice: (price: number | "") => void;
}

export default function ProductSearch({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}: ProductSearchProps) {
  const { t } = useTranslation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasActiveFilters =
    minPrice !== "" || maxPrice !== "" || sortBy !== "popular";

  const clearPriceFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSortBy("popular");
  };

  return (
    <div className="relative w-full z-20">
      <div className="relative flex items-center bg-transparent  backdrop-blur-xl border border-border rounded-[1.75rem] p-2 shadow-xl transition-all focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
        <div className="px-4 text-muted-foreground flex items-center justify-center">
          <Search className="w-6 h-6 text-primary/80" />
        </div>

        <input
          type="text"
          placeholder={t("products.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base font-semibold focus:outline-none px-3 py-3"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="p-2 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors mx-1.5"
            aria-label={t("products.clearSearch")}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="h-7 w-[1px] bg-border mx-1.5" />

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2.5 px-4.5 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap cursor-pointer ${
            hasActiveFilters || isFilterOpen
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">
            {t("products.filterAndSort")}
          </span>
          {hasActiveFilters && (
            <span className="w-2.5 h-2.5 rounded-full bg-primary-foreground animate-pulse" />
          )}
        </button>
      </div>

      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsFilterOpen(false)}
          />

          <div className="absolute ltr:right-0 rtl:left-0 top-full mt-3 w-full sm:w-96 bg-card/95 backdrop-blur-2xl border border-border rounded-[2rem] p-6 shadow-2xl z-20 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <span className="text-sm font-black text-foreground flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />{" "}
                {t("products.filterPriceAndSort")}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearPriceFilters}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  {t("products.reset")}
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-muted-foreground block">
                {t("products.priceRange")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder={t("products.minPrice")}
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="number"
                  placeholder={t("products.maxPrice")}
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-muted-foreground block flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5" /> {t("products.sortBy")}
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { id: "popular", label: t("products.sortPopular") },
                  { id: "price-asc", label: t("products.sortPriceAsc") },
                  { id: "price-desc", label: t("products.sortPriceDesc") },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      sortBy === option.id
                        ? "bg-accent text-accent-foreground border border-primary/20"
                        : "text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{option.label}</span>
                    {sortBy === option.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all cursor-pointer"
            >
              {t("products.applyFilter")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
