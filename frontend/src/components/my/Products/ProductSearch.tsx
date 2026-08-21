import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, X, SlidersHorizontal, ArrowUpDown, DollarSign, Check } from "lucide-react";

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

  const hasActiveFilters = minPrice !== "" || maxPrice !== "" || sortBy !== "popular";

  const clearPriceFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSortBy("popular");
  };

  return (
    <div className="relative w-full z-20">
      <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-1.5 shadow-lg transition-all focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
        
        <div className="px-3 text-muted-foreground flex items-center justify-center">
          <Search className="w-5 h-5 text-primary/80" />
        </div>

        <input
          type="text"
          placeholder={t("products.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none px-2 py-2"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors mx-1"
            aria-label={t("products.clearSearch")}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="h-6 w-[1px] bg-border mx-1" />

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            hasActiveFilters || isFilterOpen
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t("products.filterAndSort")}</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
          )}
        </button>
      </div>

      {isFilterOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsFilterOpen(false)} 
          />

          <div className="absolute ltr:right-0 rtl:left-0 top-full mt-2 w-full sm:w-80 bg-card/95 backdrop-blur-2xl border border-border rounded-2xl p-4 shadow-2xl z-20 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-primary" /> {t("products.filterPriceAndSort")}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearPriceFilters}
                  className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  {t("products.reset")}
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">
                {t("products.priceRange")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder={t("products.minPrice")}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="number"
                  placeholder={t("products.maxPrice")}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" /> {t("products.sortBy")}
              </label>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { id: "popular", label: t("products.sortPopular") },
                  { id: "price-asc", label: t("products.sortPriceAsc") },
                  { id: "price-desc", label: t("products.sortPriceDesc") },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      sortBy === option.id
                        ? "bg-accent text-accent-foreground border border-primary/20"
                        : "text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{option.label}</span>
                    {sortBy === option.id && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
            >
              {t("products.applyFilter")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}