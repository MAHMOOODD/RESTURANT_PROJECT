import { useNavigate } from "react-router-dom";
import { Utensils, Loader2 } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/store/features/productApi";
import { useTranslation } from "react-i18next";

const DEFAULT_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600";

export default function CategoriesSection() {
  const navigate = useNavigate(); // 👈 استخدام الانتقال
  const { data: categories = [], isLoading, isError } = useGetAllCategoriesQuery();

  const {t} = useTranslation();

  

  const handleCategoryClick = (categoryId: number) => {
    // الانتقال لصفحة المنتجات مع تحديد الكاتيجوري
    navigate(`/products?category=${categoryId}`);
    scrollTo({ top: 0, behavior: "smooth" }); // التمرير للأعلى بسلاسة
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
          <Utensils className="w-5 h-5 text-primary" />
          <span>{t("categories.available")}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const categoryImage =
             DEFAULT_CATEGORY_IMAGE;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative overflow-hidden rounded-3xl h-32 border border-border bg-card hover:border-primary/50 transition-all duration-300 p-4 text-start flex flex-col justify-end cursor-pointer shadow-sm hover:shadow-md"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 opacity-90"
                style={{ backgroundImage: `url(${categoryImage})` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

              <span className="relative z-10 font-black text-sm text-white drop-shadow-md group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}