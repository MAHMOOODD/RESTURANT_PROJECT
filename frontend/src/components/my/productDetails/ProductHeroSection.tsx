import { useTranslation } from "react-i18next";
import {
  Star,
  ShoppingBag,
  Clock,
  Check,
  FileText,
  Tag,
  Loader2,
} from "lucide-react";
import burger from "@/assets/bb.jpg";
import type { GetProductDto } from "@/types/types";

interface ProductHeroSectionProps {
  productDetails: GetProductDto;
  isAdded: boolean;
  isActionLoading: boolean;
  isCartLoading: boolean;
  onCartToggle: () => void;
}

export function ProductHeroSection({
  productDetails,
  isAdded,
  isActionLoading,
  isCartLoading,
  onCartToggle,
}: ProductHeroSectionProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const productName =
    isAr && productDetails?.nameAr
      ? productDetails.nameAr
      : productDetails?.name;
  const productDesc =
    isAr && productDetails?.descriptionAr
      ? productDetails.descriptionAr
      : productDetails?.description;
  const displayImage =
    productDetails?.imageUrl && productDetails.imageUrl.trim() !== ""
      ? productDetails.imageUrl
      : burger;

  const reviewsCount = productDetails?.reviews?.length || 0;
  const averageRating =
    reviewsCount > 0
      ? (
          (productDetails?.reviews?.reduce((acc, rev) => acc + rev.rating, 0) ??
            0) / reviewsCount
        ).toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* الصورة */}
      <div className="lg:col-span-6 relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-card to-muted border border-border/60 shadow-2xl group">
        <div className="relative h-80 sm:h-[40rem]  w-full overflow-hidden">
          <img
            src={displayImage}
            alt={productName}
            onError={(e) => {
              e.currentTarget.src = burger;
            }}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute top-5 left-5 ltr:left-auto ltr:right-5 z-10">
            <span
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-black px-4 py-2 rounded-full backdrop-blur-md border shadow-xl transition-all ${
                productDetails.isAvailable
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border-rose-500/30"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  productDetails.isAvailable
                    ? "bg-emerald-400 animate-ping"
                    : "bg-rose-400"
                }`}
              />
              {productDetails.isAvailable
                ? t("products.available", "متوفر الآن")
                : t("products.unavailable", "غير متوفر")}
            </span>
          </div>
        </div>
      </div>

      {/* تفاصيل الوجبة */}
      <div className="lg:col-span-6 space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-black tracking-wide">
            <Tag className="w-3.5 h-3.5" />
            <span>{t("products.mealDetails", "تفاصيل الوجبة")}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            {productName}
          </h1>
        </div>

        {/* السعر والوقت والتقييم */}
        <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-primary">
              {productDetails.price}
            </span>
            <span className="text-sm font-bold text-muted-foreground">
              {t("products.currency", "ج.م")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-muted text-foreground font-bold text-xs sm:text-sm border border-border/40">
              <Clock className="w-4 h-4 text-primary" />
              <span>
                {productDetails.preparingTime} {t("products.minutes", "دقيقة")}
              </span>
            </div>

            {reviewsCount > 0 && (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 font-black text-xs sm:text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{averageRating}</span>
                <span className="text-muted-foreground font-medium">
                  ({reviewsCount})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* الوصف */}
        {productDesc && (
          <div className="p-5 rounded-2xl bg-card border border-border/60 space-y-2.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black text-muted-foreground">
              <FileText className="w-4 h-4 text-primary" />
              <span>{t("products.descriptionLabel", "وصف الوجبة")}</span>
            </div>
            <p className="text-sm sm:text-base text-foreground/80 font-medium leading-relaxed">
              {productDesc}
            </p>
          </div>
        )}

        {/* زر السلة */}
        <div className="pt-2">
          <button
            disabled={
              !productDetails.isAvailable || isActionLoading || isCartLoading
            }
            onClick={onCartToggle}
            className={`w-full py-4 px-8 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-xl cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${
              isAdded
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25"
            }`}
          >
            {isActionLoading || isCartLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>
                  {t("products.addedToCart", "في السلة (اضغط للإزالة)")}
                </span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>{t("products.addToCart", "إضافة إلى السلة")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}