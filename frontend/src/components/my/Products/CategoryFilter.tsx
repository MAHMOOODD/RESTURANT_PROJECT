import { memo, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const categoryRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

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

  useEffect(() => {
    const selectedElement = categoryRefs.current[selectedCategoryId];
    if (selectedElement && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      
      const scrollLeft =
        selectedElement.offsetLeft -
        container.offsetWidth / 2 +
        selectedElement.offsetWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [selectedCategoryId, categories]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-3 scrollbar-none w-full animate-pulse justify-start px-2">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-card/60 border border-border/40" />
            <div className="h-3 w-12 bg-card/60 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full relative group px-2 sm:px-8">
      {/* زر التمرير لليسار (يظهر في الشاشات الكبيرة فقط) */}
      <button
        onClick={() => scroll(isAr ? "right" : "left")}
        className="hidden sm:flex absolute left-1 top-[38%] -translate-y-1/2 z-10 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-xl cursor-pointer active:scale-95 opacity-0 group-hover:opacity-100"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* زر التمرير لليمين (يظهر في الشاشات الكبيرة فقط) */}
      <button
        onClick={() => scroll(isAr ? "left" : "right")}
        className="hidden sm:flex absolute right-1 top-[38%] -translate-y-1/2 z-10 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-xl cursor-pointer active:scale-95 opacity-0 group-hover:opacity-100"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* حاوية القائمة المتجاوبة */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 sm:gap-6 overflow-x-auto scroll-smooth py-3 px-1 sm:px-2 justify-start [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
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
              ref={(el) => {
                categoryRefs.current[cat.id] = el;
              }}
              onClick={() => onSelectCategory(cat.id)}
              className="group/item flex flex-col items-center gap-1.5 sm:gap-2 shrink-0 focus:outline-none cursor-pointer"
            >
              <div
                className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full p-1 transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? "ring-2 ring-primary scale-105 shadow-md shadow-primary/20"
                    : "ring-1 ring-border hover:ring-primary/50 group-hover/item:scale-105"
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-muted flex items-center justify-center shadow-inner">
                  {isAll ? (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <LayoutGrid
                        className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${
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
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                    />
                  ) : (
                    <img
                      src={defaultCategoryImg}
                      alt={displayName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                    />
                  )}
                </div>
              </div>

              <span
                className={`text-[11px] sm:text-xs lg:text-sm font-semibold tracking-tight transition-colors max-w-[80px] sm:max-w-[100px] lg:max-w-[120px] truncate ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground group-hover/item:text-foreground"
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