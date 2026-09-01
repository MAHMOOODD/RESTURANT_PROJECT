import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import {
  useGetAllProductsQuery,
  useGetProductByCategoryIdQuery,
  useGetAllCategoriesQuery,
  useDeleteProductMutation,
} from "@/store/features/productApi";
import type { GetAllProductDto, Filter } from "@/types/types";
import { ProductFormDialog } from "@/components/admin/products/ProductFormDialog";
import { ProductTable } from "@/components/admin/products/ProductTable";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 8;
const SEARCH_DEBOUNCE_MS = 400;

interface SortOption {
  id: string;
  labelKey: string;
  sortByPrice?: boolean;
  sortBySelling?: boolean;
  ascending?: boolean;
}

const SORT_OPTIONS: SortOption[] = [
  { id: "default", labelKey: "adminProducts.sort.default" },
  {
    id: "priceAsc",
    labelKey: "adminProducts.sort.priceAsc",
    sortByPrice: true,
    ascending: true,
  },
  {
    id: "priceDesc",
    labelKey: "adminProducts.sort.priceDesc",
    sortByPrice: true,
    ascending: false,
  },
  {
    id: "bestSelling",
    labelKey: "adminProducts.sort.bestSelling",
    sortBySelling: true,
    ascending: false,
  },
  {
    id: "leastSelling",
    labelKey: "adminProducts.sort.leastSelling",
    sortBySelling: true,
    ascending: true,
  },
];

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<GetAllProductDto | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedSortId, setSelectedSortId] = useState<string>("default");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedSort =
    SORT_OPTIONS.find((s) => s.id === selectedSortId) ?? SORT_OPTIONS[0];

  // Debounce السيرش عشان منبعتش ريكوست مع كل حرف
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // رجوع لأول صفحة كل ما السيرش/التصنيف/الترتيب يتغير
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 1000);
  }, [debouncedSearch, selectedCategory, selectedSortId]);

  const filter: Filter = useMemo(
    () => ({
      pagination: { pageNumber: currentPage, pageSize: ITEMS_PER_PAGE },
      searchTerm: debouncedSearch || undefined,
      sortByPrice: selectedSort.sortByPrice,
      sortBySelling: selectedSort.sortBySelling,
      ascending: selectedSort.ascending,
    }),
    [currentPage, debouncedSearch, selectedSort],
  );

  const isCategorySelected = selectedCategory !== "all";

  const allProductsResult = useGetAllProductsQuery(filter, {
    skip: isCategorySelected,
  });

  const categoryProductsResult = useGetProductByCategoryIdQuery(
    { categoryId: Number(selectedCategory), filter },
    { skip: !isCategorySelected },
  );

  const { data: categories = [] } = useGetAllCategoriesQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const activeResult = isCategorySelected
    ? categoryProductsResult
    : allProductsResult;

  const products = activeResult.data?.data ?? [];
  const totalPages = activeResult.data?.totalPages || 1;
  const totalRecords = activeResult.data?.totalRecords ?? 0;
  const isProductsLoading = activeResult.isLoading || activeResult.isFetching;

  const refetchProducts = () => {
    activeResult.refetch();
  };

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (product: GetAllProductDto) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success(t("adminProducts.deleteSuccess"));
    } catch {
      toast.error(t("adminProducts.deleteError"));
    }
  };

  const selectedCategoryObj = categories.find(
    (c) => String(c.id) === selectedCategory,
  );

  return (
    <div className="w-full flex flex-col space-y-5 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300 pb-16">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {t("adminProducts.title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            {t("adminProducts.subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-2xl font-bold text-sm sm:text-base gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all cursor-pointer active:scale-95 shrink-0 hover:bg-primary/90 flex items-center justify-center outline-none"
        >
          <Plus className="h-5 w-5 stroke-[2.5]" />
          <span>{t("adminProducts.addNewProduct")}</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("adminProducts.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-3 bg-card backdrop-blur-md border border-border rounded-2xl h-11 focus:outline-none focus:ring-2 focus:ring-ring/50 shadow-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex w-full sm:w-auto gap-3">
          {/* Category Dropdown */}
          <div className="relative w-full sm:w-56">
            <button
              type="button"
              onClick={() => {
                setIsCategoryOpen((prev) => !prev);
                setIsSortOpen(false);
              }}
              className="w-full h-11 px-4 bg-card hover:bg-secondary/80 backdrop-blur-md border border-border rounded-2xl text-foreground font-medium flex items-center justify-between shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <span className="truncate">
                {selectedCategory === "all"
                  ? t("adminProducts.allCategories")
                  : selectedCategoryObj
                    ? isArabic
                      ? selectedCategoryObj.nameAr
                      : selectedCategoryObj.name
                    : t("adminProducts.form.selectCategory")}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCategoryOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsCategoryOpen(false)}
              />
            )}

            {isCategoryOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-1.5 animate-in fade-in-50 zoom-in-95 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {t("adminProducts.allCategories")}
                </button>

                {categories.map((c) => {
                  const categoryName = isArabic ? c.nameAr : c.name;
                  const isSelected = String(c.id) === selectedCategory;

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(String(c.id));
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer my-0.5 ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {categoryName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-56">
            <button
              type="button"
              onClick={() => {
                setIsSortOpen((prev) => !prev);
                setIsCategoryOpen(false);
              }}
              className="w-full h-11 px-4 bg-card hover:bg-secondary/80 backdrop-blur-md border border-border rounded-2xl text-foreground font-medium flex items-center justify-between gap-2 shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <span className="flex items-center gap-2 truncate">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">{t(selectedSort.labelKey)}</span>
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSortOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsSortOpen(false)}
              />
            )}

            {isSortOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-1.5 animate-in fade-in-50 zoom-in-95 backdrop-blur-xl">
                {SORT_OPTIONS.map((s) => {
                  const isSelected = s.id === selectedSortId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedSortId(s.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer my-0.5 ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {t(s.labelKey)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full flex flex-col border border-border rounded-3xl shadow-sm overflow-hidden bg-card backdrop-blur-md">
        {isProductsLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-base sm:text-lg font-medium">
            {t("adminProducts.loading")}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <ProductTable
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProduct}
            />
          </div>
        )}

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-border bg-secondary/50 shrink-0 flex items-center justify-between gap-4">
          <span className="text-xs sm:text-sm text-muted-foreground font-semibold">
            {t("adminProducts.pageInfo", {
              current: currentPage,
              total: totalPages,
              count: totalRecords,
            })}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-9 px-3 rounded-xl border border-border bg-card hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-foreground flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-9 px-3 rounded-xl border border-border bg-card hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-foreground flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Form Dialog */}
      <ProductFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        categories={categories}
        refetchProducts={refetchProducts}
      />
    </div>
  );
}
