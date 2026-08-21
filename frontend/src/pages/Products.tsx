import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // 👈 استيراد searchParams
import { useTranslation } from "react-i18next";
import { UtensilsCrossed } from "lucide-react";

import ProductSearch from "@/components/my/Products/ProductSearch";
import CategoryFilter from "@/components/my/Products/CategoryFilter";
import ProductGrid from "@/components/my/Products/ProductGrid";
import ProductSkeleton from "@/components/my/Products/ProductSkeleton";
import Pagination from "@/components/my/Products/Pagination";

import {
  useGetAllProductsQuery,
  useGetProductByNameQuery,
  useGetProductByCategoryIdQuery,
  useGetAllCategoriesQuery,
} from "@/store/features/productApi";
import type { Filter, GetProductDto } from "@/types/types";

const ITEMS_PER_PAGE = 8;

export default function Products() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams(); // 👈 جلب وتحديث الـ Query Parameters

 
  const [searchQuery, setSearchQuery] = useState("");
  // قراءة رقم الكاتيجوري من الـ URL إن وجد
  const categoryParam = searchParams.get("category");
  const initialCatId = categoryParam ? Number(categoryParam) : 0;

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(initialCatId);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [currentPage, setCurrentPage] = useState(1);

  // مزامنة الـ state لو تغير الـ URL
  useEffect(() => {
    if (categoryParam) {
      setTimeout(() => {
        setSelectedCategoryId(Number(categoryParam));
      }, 0);
    }
  }, [categoryParam]);

  const { data: categories = [] } = useGetAllCategoriesQuery();
  const isAr = i18n.language === "ar";

  const activeCategoryName = useMemo(() => {
    if (selectedCategoryId === 0) return t("products.all", "الكل");
    const activeCat = categories.find((c) => c.id === selectedCategoryId);
    return activeCat
      ? isAr && activeCat.nameAr
        ? activeCat.nameAr
        : activeCat.name
      : "";
  }, [selectedCategoryId, categories, isAr, t]);

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



  const isSearchingByName = searchQuery.trim().length > 0;
  const isFilteringByCategory = selectedCategoryId !== 0 && !isSearchingByName;
  const isGetAll = !isSearchingByName && !isFilteringByCategory;

  const { data: allRes, isLoading: isAllLoading } = useGetAllProductsQuery(
    filterParams,
    { skip: !isGetAll },
  );
  const { data: searchRes, isLoading: isSearchLoading } =
    useGetProductByNameQuery(
      { name: searchQuery, filter: filterParams },
      { skip: !isSearchingByName },
    );
  const { data: categoryRes, isLoading: isCategoryLoading } =
    useGetProductByCategoryIdQuery(
      { categoryId: selectedCategoryId, filter: filterParams },
      { skip: !isFilteringByCategory },
    );

  const isLoading = isAllLoading || isSearchLoading || isCategoryLoading;

  const activeData = isSearchingByName
    ? searchRes
    : isFilteringByCategory
      ? categoryRes
      : allRes;

  const products: GetProductDto[] = activeData?.data || [];
  const totalCount = activeData?.totalRecords || 0;
  const totalPages = activeData?.totalPages || 1;

  // عند تغيير الكاتيجوري نحدث الـ State والـ URL بنفس الوقت
  const handleSelectCategory = useCallback((id: number) => {
    setSelectedCategoryId(id);
    setCurrentPage(1);
    if (id === 0) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", id.toString());
    }
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-10 transition-colors duration-300 relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="sticky top-4 z-30 bg-background/80 backdrop-blur-2xl p-2 rounded-3xl border border-border/50 shadow-2xl">
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

        <div className="backdrop-blur-xl px-3 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-sm">
          <CategoryFilter
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        <div className="flex items-center justify-between px-2 text-xs sm:text-sm font-bold text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
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

          <span className="text-[11px] bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 font-semibold flex items-center gap-1.5">
            <UtensilsCrossed className="w-3 h-3" />
            {activeCategoryName}
          </span>
        </div>

        {isLoading ? (
          <ProductSkeleton count={ITEMS_PER_PAGE} />
        ) : (
          <ProductGrid
           products={products} />
        )}

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