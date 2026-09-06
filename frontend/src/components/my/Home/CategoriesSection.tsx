import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Utensils, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/store/features/productApi";
import { useTranslation } from "react-i18next";

const DEFAULT_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600";

export default function CategoriesSection() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useGetAllCategoriesQuery();

  const { t , i18n } = useTranslation();

  const isAr = i18n.language === "ar";
  const handleCategoryClick = (categoryId: number) => {
    navigate(`/products?category=${categoryId}`);
    scrollTo({ top: 0, behavior: "smooth" });
  };

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
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 w-full h-full space-y-6 px-4 relative group">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-black text-foreground flex items-center gap-3">
          <Utensils className="w-7 h-7 text-primary" />
          <span>{t("categories.available")}</span>
        </h2>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-lg cursor-pointer active:scale-95"
            aria-label="Scroll left"
          >
            {isAr ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-lg cursor-pointer active:scale-95"
            aria-label="Scroll right"
          >
            {isAr ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-6 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((cat) => {
            const categoryImage = cat.imageUrl || DEFAULT_CATEGORY_IMAGE;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group/item flex flex-col items-center gap-3 cursor-pointer shrink-0"
              >
                <div className="relative min-w-60 min-h-60 sm:w-28 sm:h-28 rounded-full p-1 border-2 border-transparent group-hover/item:border-primary transition-all duration-300 shadow-md">
                  <div
                    className="w-full h-full rounded-full bg-cover bg-center transition-transform duration-500 group-hover/item:scale-105"
                    style={{ backgroundImage: `url(${categoryImage})` }}
                  />
                </div>

                <span className="font-bold text-sm min-w-[250px] sm:text-base text-white group-hover/item:text-primary transition-colors text-center max-w-[100px] truncate">
                  {isAr ? cat.nameAr : cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
