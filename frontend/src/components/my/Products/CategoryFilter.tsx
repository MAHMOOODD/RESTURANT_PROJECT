import { useTranslation } from "react-i18next";
import { LayoutGrid } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/store/features/items/Items";
import defaultCategoryImg from "@/assets/bb.jpg"; // صورة افتراضية

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { t } = useTranslation();
  const { data: categories = [], isLoading } = useGetAllCategoriesQuery();

  const categoriesWithAll = [
    { id: 0, name: t("products.all"), imageUrl: "" },
    ...categories,
  ];

  if (isLoading) {
    return (
      <div className="flex items-center gap-6  overflow-x-auto py-4 scrollbar-none w-full animate-pulse justify-start sm:justify-center">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-16 h-16 rounded-full bg-card/60 border border-border/40" />
            <div className="h-3 w-12 bg-card/60 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="flex items-center gap-5  sm:gap-7 overflow-x-auto scrollbar-none py-2 px-2 justify-start sm:justify-center">
        {categoriesWithAll.map((cat) => {
          const isActive = selectedCategory === cat.name;
          const isAll = cat.id === 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="group flex flex-col items-center gap-2.5 shrink-0 focus:outline-none cursor-pointer"
            >
              {/* الدائرة الخارجية مع الإطار والأبعاد */}
              <div
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? "ring-4 ring-[#123126] dark:ring-emerald-500 scale-105 shadow-lg shadow-[#123126]/20"
                    : "ring-2 ring-gray-200 dark:ring-border hover:ring-gray-400 group-hover:scale-105"
                }`}
              >
                {/* الحاوية الداخلية للصورة */}
                <div className="w-full h-full rounded-full overflow-hidden bg-muted flex items-center justify-center shadow-inner">
                  {isAll ? (
                    <div className="w-full h-full bg-[#123126]/10 dark:bg-emerald-950/40 flex items-center justify-center">
                      <LayoutGrid
                        className={`w-7 h-7 ${
                          isActive
                            ? "text-[#123126] dark:text-emerald-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  ) : cat.imageUrl && cat.imageUrl.trim() !== "" ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      onError={(e) => {
                        e.currentTarget.src = defaultCategoryImg;
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <img
                      src={defaultCategoryImg}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                </div>
              </div>

              {/* اسم الفئة أسفل الدائرة */}
              <span
                className={`text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                  isActive
                    ? "text-[#123126] dark:text-emerald-400 font-extrabold"
                    : "text-gray-600 dark:text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}