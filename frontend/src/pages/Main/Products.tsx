import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const categoryParam = searchParams.get("category");
  const initialCatId = categoryParam ? Number(categoryParam) : 0;

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number>(initialCatId);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleSelectCategory = useCallback(
    (id: number) => {
      setSelectedCategoryId(id);
      setCurrentPage(1);
      if (id === 0) {
        searchParams.delete("category");
      } else {
        searchParams.set("category", id.toString());
      }
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams],
  );

  return (
    <div className="min-h-screen bg-transparent text-foreground p-4 sm:p-8 lg:p-12 relative overflow-hidden">
      {/* 🌟 Subtle Red Glowing Orbs (خلفية ضوئية ناعمة لتبريز المحتوى) */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-8">
      {/* 🔍 Search Bar - بدون خلفية أو حدود خروجية */}
<div className="sticky top-4 z-30 w-full">
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

{/* 🏷️ Category Filter - بدون خلفية */}
<div className="w-full">
  <CategoryFilter
    selectedCategoryId={selectedCategoryId}
    onSelectCategory={handleSelectCategory}
  />
</div>

        {/* 📊 Counter & Category Badge */}
        <div className="flex items-center justify-between px-2 text-sm sm:text-base font-medium text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span>
              {t("products.showing") || "عرض"}{" "}
              <strong className="text-foreground text-base sm:text-lg font-black">
                {products.length}
              </strong>{" "}
              {t("products.ofTotal") || "من إجمالي"}{" "}
              <strong className="text-foreground text-base sm:text-lg font-black">
                {totalCount}
              </strong>{" "}
              {t("products.itemsCount") || "وجبة"}
            </span>
          </div>

          <span className="text-xs sm:text-sm bg-primary/15 text-primary backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/25 font-bold flex items-center gap-2 shadow-sm">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            {activeCategoryName}
          </span>
        </div>

        {/* 🍔 Products Grid / Skeleton */}
        {isLoading ? (
          <ProductSkeleton count={ITEMS_PER_PAGE} />
        ) : (
          <ProductGrid products={products} />
        )}

        {/* 📄 Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="pt-6">
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
