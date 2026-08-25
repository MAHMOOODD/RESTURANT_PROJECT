import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LayoutGrid } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/store/features/productApi";
import defaultCategoryImg from "@/assets/bb.jpg";
import type { GetCategoriesDto } from "@/types/types";

interface CategoryFilterProps {
  selectedCategoryId: number;
  onSelectCategory: (categoryId: number) => void;
}

const CategoryFilter = memo(function CategoryFilter({
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  const { t, i18n } = useTranslation();
  const { data: categories = [], isLoading } = useGetAllCategoriesQuery();

  const isAr = i18n.language === "ar";

  const categoriesWithAll = useMemo<GetCategoriesDto[]>(() => {
    return [
      {
        id: 0,
        name: "All",
        nameAr: "الكل",
        imageUrl: "",
      },
      ...categories,
    ];
  }, [categories]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-6 overflow-x-auto py-3 scrollbar-none w-full animate-pulse justify-start sm:justify-center">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card/60 border border-border/40" />
            <div className="h-3 w-12 bg-card/60 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto scrollbar-none py-2 px-2 justify-start sm:justify-center">
        {categoriesWithAll.map((cat) => {
          const isAll = cat.id === 0;
          const isActive = selectedCategoryId === cat.id;

          const displayName = isAll
            ? t("products.all", "الكل")
            : isAr && cat.nameAr
              ? cat.nameAr
              : cat.name;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="group flex flex-col items-center gap-2 shrink-0 focus:outline-none cursor-pointer"
            >
              <div
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? "ring-2 ring-primary scale-105 shadow-md shadow-primary/20"
                    : "ring-1 ring-border hover:ring-primary/50 group-hover:scale-105"
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-muted flex items-center justify-center shadow-inner">
                  {isAll ? (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <LayoutGrid
                        className={`w-7 h-7 sm:w-8 sm:h-8 ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  ) : cat.imageUrl && cat.imageUrl.trim() !== "" ? (
                    <img
                      src={cat.imageUrl}
                      alt={displayName}
                      onError={(e) => {
                        e.currentTarget.src = defaultCategoryImg;
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <img
                      src={defaultCategoryImg}
                      alt={displayName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                </div>
              </div>

              <span
                className={`text-xs sm:text-sm font-semibold tracking-tight transition-colors ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {displayName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default CategoryFilter;
