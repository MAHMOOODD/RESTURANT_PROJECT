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
      <div className="flex items-center gap-6 overflow-x-auto py-3 scrollbar-none w-full h-full animate-pulse justify-start sm:justify-center">
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
    <div className="w-full h-full relative group px-2 sm:px-8">
      <button
        onClick={() => scroll("left")}
        className="hidden sm:flex absolute left-0 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-xl cursor-pointer active:scale-95 opacity-0 group-hover:opacity-100"
        aria-label="Scroll left"
        hidden={categoriesWithAll.length < 8}
      >
        <ChevronLeft className="w-5 h-5 " />
      </button>

      <button
        onClick={() => scroll("right")}
        className="hidden sm:flex absolute right-0 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-xl cursor-pointer active:scale-95 opacity-0 group-hover:opacity-100"
        aria-label="Scroll right"
        hidden={categoriesWithAll.length < 8}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex mx-2 min-h-50 items-center gap-5 sm:gap-7 overflow-x-auto scroll-smooth py-2 px-2 justify-start sm:justify-start [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
              className="group/item flex flex-col items-center gap-2 shrink-0 focus:outline-none cursor-pointer"
            >
              <div
                className={`relative min-h-30 min-w-30 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? "ring-2 ring-primary scale-105 shadow-md shadow-primary/20"
                    : "ring-1 ring-border hover:ring-primary/50 group-hover/item:scale-105"
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
                className={`text-xs  sm:text-sm font-semibold tracking-tight transition-colors max-w-[200px] truncate ${
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