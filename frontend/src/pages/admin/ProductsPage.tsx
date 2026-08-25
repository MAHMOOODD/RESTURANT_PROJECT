import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import {
  useGetAllProductsQuery,
  useGetAllCategoriesQuery,
  useDeleteProductMutation,
} from "@/store/features/productApi";
import type { GetAllProductDto } from "@/types/types";
import { ProductFormDialog } from "@/components/admin/products/ProductFormDialog";
import { ProductTable } from "@/components/admin/products/ProductTable";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<GetAllProductDto | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: productsData, isLoading: isProductsLoading } =
    useGetAllProductsQuery();
  const { data: categories = [] } = useGetAllCategoriesQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const products = productsData?.data ?? [];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const nameMatch =
        (product.name?.toLowerCase() || "").includes(
          searchQuery.toLowerCase(),
        ) || (product.nameAr || "").includes(searchQuery);

      const categoryMatch =
        selectedCategory === "all" ||
        String(product.categoryId) === selectedCategory;

      return nameMatch && categoryMatch;
    });
  }, [products, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

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
      toast.success(
        t(
          "adminProducts.deleteSuccess",
          isArabic ? "تم حذف المنتج بنجاح" : "Product deleted successfully",
        ),
      );
    } catch {
      toast.error(
        t(
          "adminProducts.deleteError",
          isArabic ? "حدث خطأ أثناء الحذف" : "Error deleting product",
        ),
      );
    }
  };

  const searchPlaceholderText =
    t("adminProducts.searchPlaceholder") === "adminProducts.searchPlaceholder"
      ? isArabic
        ? "بحث عن منتج..."
        : "Search product..."
      : t("adminProducts.searchPlaceholder");

  const allCategoriesText =
    t("adminProducts.allCategories") === "adminProducts.allCategories"
      ? isArabic
        ? "كل التصنيفات"
        : "All Categories"
      : t("adminProducts.allCategories");

  const selectedCategoryObj = categories.find(
    (c) => String(c.id) === selectedCategory,
  );

  return (
    <div className="w-full flex-1 flex flex-col space-y-5 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300 min-h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {t("adminProducts.title", "إدارة المنتجات")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            {t(
              "adminProducts.subtitle",
              "إضافة، تعديل أو التحكم في ظهور عناصر القائمة",
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-2xl font-bold text-sm sm:text-base gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all cursor-pointer active:scale-95 shrink-0 hover:bg-primary/90 flex items-center justify-center outline-none"
        >
          <Plus className="h-5 w-5 stroke-[2.5]" />
          <span>{t("adminProducts.addNewProduct", "إضافة منتج جديد")}</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholderText}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 rtl:pr-10 rtl:pl-3 bg-card backdrop-blur-md border border-border rounded-2xl h-11 focus:outline-none focus:ring-2 focus:ring-ring/50 shadow-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Custom Theme Dropdown */}
        <div className="relative w-full sm:w-56">
          <button
            type="button"
            onClick={() => setIsCategoryOpen((prev) => !prev)}
            className="w-full h-11 px-4 bg-card hover:bg-secondary/80 backdrop-blur-md border border-border rounded-2xl text-foreground font-medium flex items-center justify-between shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <span className="truncate">
              {selectedCategory === "all"
                ? allCategoriesText
                : selectedCategoryObj
                  ? isArabic
                    ? selectedCategoryObj.nameAr
                    : selectedCategoryObj.name
                  : t("adminProducts.form.selectCategory", "اختر التصنيف")}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                isCategoryOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Backdrop for closing dropdown */}
          {isCategoryOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsCategoryOpen(false)}
            />
          )}

          {/* Dropdown Menu Container */}
          {isCategoryOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#13111a]/95 border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl overflow-hidden p-1.5 animate-in fade-in-50 zoom-in-95 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setCurrentPage(1);
                  setIsCategoryOpen(false);
                }}
                className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-[#ff2a4b] text-white shadow-md shadow-[#ff2a4b]/20"
                    : "text-foreground hover:bg-[rgba(255,42,75,0.18)] hover:text-[#ff5270]"
                }`}
              >
                {allCategoriesText}
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
                      setCurrentPage(1);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer my-0.5 ${
                      isSelected
                        ? "bg-[#ff2a4b] text-white shadow-md shadow-[#ff2a4b]/20"
                        : "text-foreground hover:bg-[rgba(255,42,75,0.18)] hover:text-[#ff5270]"
                    }`}
                  >
                    {categoryName}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full flex-1 flex flex-col border border-border rounded-3xl shadow-sm overflow-hidden bg-card backdrop-blur-md">
        {isProductsLoading ? (
          <div className="flex-1 flex items-center justify-center py-20 text-muted-foreground text-base sm:text-lg font-medium">
            {t("adminProducts.loading", "جاري التحميل...")}
          </div>
        ) : (
          <div className="w-full flex-1 overflow-auto">
            <ProductTable
              products={paginatedProducts}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProduct}
            />
          </div>
        )}

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-border bg-secondary/50 shrink-0 flex items-center justify-between gap-4">
          <span className="text-xs sm:text-sm text-muted-foreground font-semibold">
            {isArabic
              ? `صفحة ${currentPage} من ${totalPages} (${filteredProducts.length} منتج)`
              : `Page ${currentPage} of ${totalPages} (${filteredProducts.length} items)`}
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
      />
    </div>
  );
}
