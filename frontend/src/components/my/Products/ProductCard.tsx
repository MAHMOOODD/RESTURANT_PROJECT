import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart, Clock, Sparkles, Check, Plus, Info } from "lucide-react";
import type { GetAllProductDto } from "@/types/types";
import burger from "@/assets/bb.jpg";
import ProductDetailsModal from "./ProductDetailsModal";

interface ProductCardProps {
  product: GetAllProductDto;
  onAddToCart?: (product: GetAllProductDto) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAr = i18n.language === "ar";
  const productName = isAr && product.nameAr ? product.nameAr : product.name;

  const displayImage =
    product.imageUrl && product.imageUrl.trim() !== ""
      ? product.imageUrl
      : burger;

  const handleAdd = () => {
    setIsAdded(!isAdded);
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <>
      <div className="bg-card text-card-foreground border border-border/60 rounded-[32px] p-3 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
        {/* صورة المنتج والبادجات */}
        <div className="relative h-52 w-full overflow-hidden rounded-[24px] bg-muted shrink-0">
          <img
            src={displayImage}
            alt={productName}
            onError={(e) => {
              e.currentTarget.src = burger;
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* البادج العلوي */}
          <div className="absolute top-3 right-3 ltr:right-auto ltr:left-3 z-10">
            {product.sellCount > 50 ? (
              <span className="bg-background/80 text-foreground text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md border border-border/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                {t("products.chefPick")}
              </span>
            ) : (
              <span className="bg-background/80 text-foreground text-[11px] font-bold px-3.5 py-1.5 rounded-full backdrop-blur-md border border-border/40 shadow-sm">
                {t("products.featured")}
              </span>
            )}
          </div>

          {/* أزرار التفاصيل والتفضيل */}
          <div className="absolute top-3 left-3 ltr:left-auto ltr:right-3 z-10 flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-9 h-9 bg-background/60 hover:bg-background/90 text-foreground rounded-full flex items-center justify-center backdrop-blur-md border border-border/40 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              title={t("products.details")}
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-9 h-9 bg-background/60 hover:bg-background/90 backdrop-blur-md rounded-full flex items-center justify-center border border-border/40 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-foreground"
                }`}
              />
            </button>
          </div>
        </div>

        {/* تفاصيل الوجبة والسعر في مكانه الأصلي */}
        <div className="pt-3.5 pb-1 px-1 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-black text-base text-foreground leading-snug line-clamp-1">
                {productName}
              </h3>
              
              {/* السعر رجع لمكانه بنفس لون الـ primary للمودال */}
              <div className="text-right ltr:text-left shrink-0">
                <span className="text-base font-black text-primary">
                  {product.price}
                </span>
                <span className="text-xs font-bold text-primary mx-1">
                  {t("products.currency")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2.5 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 text-secondary-foreground font-medium border border-border/40">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>
                  {product.preparingTime} {t("products.minutes")}
                </span>
              </div>
            </div>
          </div>

          {/* زر الإضافة للسلة */}
          <div className="border-t border-border/40 pt-3">
            <button
              disabled={!product.isAvailable}
              onClick={handleAdd}
              className={`w-full py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-md active:scale-[0.99] cursor-pointer ${
                !product.isAvailable
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : isAdded
                    ? "bg-emerald-600 text-white shadow-emerald-600/20"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25 hover:shadow-lg"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t("products.addedToCart")}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{t("products.addToCart")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* المكون المنفصل للتفاصيل والتقييمات */}
      <ProductDetailsModal
        productId={product.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAdd}
        addedToCart={isAdded}
        fallbackImage={burger}
      />
    </>
  );
}