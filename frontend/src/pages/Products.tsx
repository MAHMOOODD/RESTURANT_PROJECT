import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {  UtensilsCrossed } from "lucide-react";

import ProductSearch from "@/components/my/Products/ProductSearch";
import CategoryFilter from "@/components/my/Products/CategoryFilter";
import ProductGrid from "@/components/my/Products/ProductGrid";
import ProductSkeleton from "@/components/my/Products/ProductSkeleton";
import Pagination from "@/components/my/Products/Pagination";

import {
  useGetAllProductsQuery,
  useGetProductByNameQuery,
  useGetProductByCategoryQuery,
} from "@/store/features/items/Items";
import type { Filter, GetProductDto } from "@/types/types";

const ITEMS_PER_PAGE = 8;

export default function Products() {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t("products.all"));
  const [sortBy, setSortBy] = useState<string>("popular");
  const [currentPage, setCurrentPage] = useState(1);

  // إعداد كائن الفلترة
  const filterParams: Filter = useMemo(() => {
    return {
      pagination: {
        pageNumber: currentPage,
        pageSize: ITEMS_PER_PAGE,
      },
      sortByPrice: sortBy === "price-asc" || sortBy === "price-desc",
      sortBySelling: sortBy === "popular",
      ascending: sortBy === "price-asc",
    };
  }, [currentPage, sortBy]);

  // تحديد نوع الطلب
  const isSearchingByName = searchQuery.trim().length > 0;
  const isFilteringByCategory =
    selectedCategory !== t("products.all") &&
    selectedCategory !== "الكل" &&
    selectedCategory !== "All" &&
    !isSearchingByName;
  const isGetAll = !isSearchingByName && !isFilteringByCategory;

  // Requests
  const { data: allRes, isLoading: isAllLoading } = useGetAllProductsQuery(
    filterParams,
    { skip: !isGetAll }
  );
  const { data: searchRes, isLoading: isSearchLoading } =
    useGetProductByNameQuery(
      { name: searchQuery, filter: filterParams },
      { skip: !isSearchingByName }
    );
  const { data: categoryRes, isLoading: isCategoryLoading } =
    useGetProductByCategoryQuery(
      { categoryName: selectedCategory, filter: filterParams },
      { skip: !isFilteringByCategory }
    );

  const isLoading = isAllLoading || isSearchLoading || isCategoryLoading;

  // استخراج النتيجة
  const activeData = isSearchingByName
    ? searchRes
    : isFilteringByCategory
    ? categoryRes
    : allRes;

  const products: GetProductDto[] = activeData?.data || [];
  const totalCount = activeData?.totalRecords || 0;
  const totalPages = activeData?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/20 text-foreground p-4 sm:p-6 lg:p-10 transition-colors duration-300 relative overflow-hidden">
      {/* خلفية ضوئية عصرية */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-8">
        
     

        {/* شريط البحث المتميز */}
        <div className="sticky top-4 z-30 bg-transparent backdrop-blur-2xl p-2 rounded-3xl  shadow-2xl shadow-black/5">
          <ProductSearch
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            sortBy={sortBy}
            setSortBy={(s) => {
              setSortBy(s);
              setCurrentPage(1);
            }}
            minPrice={""}
            setMinPrice={() => {}}
            maxPrice={""}
            setMaxPrice={() => {}}
          />
        </div>

        {/* قسم الفئات الفاخر */}
        <div className="relative backdrop-blur-xl p-4 sm:p-6 rounded-4xl  shadow-sm">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={(c) => {
              setSelectedCategory(c);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* شريط عدد النتائج والعرض */}
        <div className="flex items-center justify-between px-2 text-xs sm:text-sm font-bold text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {t("products.showing") || "عرض"}{" "}
              <strong className="text-foreground text-sm font-black">
                {products.length}
              </strong>{" "}
              {t("products.ofTotal") || "من إجمالي"}{" "}
              <strong className="text-foreground text-sm font-black">
                {totalCount}
              </strong>{" "}
              {t("products.itemsCount") || "وجبة"}
            </span>
          </div>

          {selectedCategory !== t("products.all") && (
            <span className="text-[11px] bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 font-semibold flex items-center gap-1.5">
              <UtensilsCrossed className="w-3 h-3" />
              {selectedCategory}
            </span>
          )}
        </div>

        {/* شبكة المنتجات أو Skeleton */}
        {isLoading ? (
          <ProductSkeleton count={ITEMS_PER_PAGE} />
        ) : (
          <ProductGrid products={products} />
        )}

        {/* التنقل بين الصفحات */}
        {!isLoading && totalPages > 1 && (
          <div className="pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}