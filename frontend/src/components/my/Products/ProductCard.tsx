import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Check,
  ShoppingBag,
  Info,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { AddToCartDto, GetAllProductDto } from "@/types/types";
import burger from "@/assets/bb.jpg";
import { useGetProductByIdQuery } from "@/store/features/productApi";
import {
  useAddToCartMutation,
  useGetCartQuery,
  useDeleteCartItemMutation,
} from "@/store/features/cartApi";
import { toast } from "sonner";
import type { ApiError } from "@/services/baseQuery";

interface ProductCardProps {
  product: GetAllProductDto;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [addToCart] = useAddToCartMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();

  const cartItem = cartData?.find(
    (item) => Number(item.productId) === Number(product.id),
  );
  const isAdded = cartItem !== undefined;

  const { data: fullProduct } = useGetProductByIdQuery(product.id);

  const isAr = i18n.language === "ar";
  const productName = isAr && product.nameAr ? product.nameAr : product.name;

  const displayImage =
    product.imageUrl && product.imageUrl.trim() !== ""
      ? product.imageUrl
      : burger;

  const reviewsCount = fullProduct?.reviews?.length || 0;
  const averageRating =
    reviewsCount > 0
      ? (
          (fullProduct?.reviews?.reduce((acc, rev) => acc + rev.rating, 0) ??
            0) / reviewsCount
        ).toFixed(1)
      : "0.0";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    async function executeAction() {
      setIsLoading(true);
      try {
        if (isAdded && cartItem) {
          await deleteCartItem(cartItem.id).unwrap();
          toast.success(
            t("products.removedFromCart", "تمت إزالة المنتج من السلة"),
          );
        } else {
          await addToCart({
            productId: product.id,
            dto: { quantity: 1 },
          }).unwrap();
          toast.success(
            t("products.addedToCart", "تمت إضافة المنتج إلى السلة"),
          );
        }
      } catch (error) {
        const apiErr = error as ApiError<AddToCartDto>;
        console.error("Error managing cart:", apiErr);
        toast.error(
          isAdded
            ? t(
                "products.removeFromCartError",
                "حدث خطأ أثناء إزالة المنتج من السلة",
              )
            : t(
                "products.addToCartError",
                "يجب تسجيل الدخول لإضافة المنتجات للسلة",
              ),
        );
      } finally {
        setIsLoading(false);
      }
    }
    executeAction();
  };

  const goToDetails = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div
      onClick={goToDetails}
      className="group relative w-full bg-card/60 backdrop-blur-xl border border-border/60 hover:border-primary/50 rounded-[2.5rem] p-4 sm:p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* الصورة العلوية */}
      <div className="relative h-64 sm:h-72 w-full rounded-[2rem] overflow-hidden bg-muted">
        <img
          src={displayImage}
          alt={productName}
          onError={(e) => {
            e.currentTarget.src = burger;
          }}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          {reviewsCount > 0 ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs font-black shadow-lg">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{averageRating}</span>
              <span className="text-[11px] text-white/70 font-semibold dir-ltr inline-block">
                ({reviewsCount})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 text-primary-foreground text-xs font-black shadow-lg">
              <Sparkles className="w-4 h-4 animate-pulse text-primary" />
              <span>{t("products.noRating", "جديد 🚀")}</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToDetails();
            }}
            className="w-9 h-9 bg-black/50 hover:bg-primary text-white hover:text-primary-foreground rounded-full flex items-center justify-center backdrop-blur-md border border-white/15 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg cursor-pointer"
            title={t("products.details", "التفاصيل")}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* التفاصيل والسعر */}
      <div className="p-2 pt-5 space-y-4">
        <h3 className="font-black text-xl sm:text-2xl text-foreground tracking-tight leading-snug line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {productName}
        </h3>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {t("products.price", "السعر")}
            </span>
            <div className="flex items-baseline gap-1 text-foreground">
              <span className="text-2xl sm:text-3xl font-black">
                {product.price}
              </span>
              <span className="text-sm font-bold text-primary">
                {t("products.currency", "ج.م")}
              </span>
            </div>
          </div>

          <button
            disabled={!product.isAvailable || isLoading || isCartLoading}
            onClick={handleAddToCart}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 shadow-md cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              !product.isAvailable
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : isAdded
                  ? "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 border border-emerald-500/30 shadow-emerald-500/10"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 hover:shadow-primary/40 hover:scale-105"
            }`}
          >
            {isLoading || isCartLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t("products.addedToCart", "في السلة")}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{t("products.addToCart", "إضافة")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
