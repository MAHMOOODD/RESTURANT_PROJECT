import { Star, ShoppingBag, Check, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useGetProductByIdQuery } from "@/store/features/productApi";
import {
  useAddToCartMutation,
  useGetCartQuery,
  useDeleteCartItemMutation,
} from "@/store/features/cartApi";
import type { AddToCartDto, GetAllProductDto } from "@/types/types";
import burgerFallback from "@/assets/bb.jpg";
import type { ApiError } from "@/services/baseQuery";

interface BentoItemProps {
  product: GetAllProductDto;
  spanClass: string;
  onOpenModal?: (id: number) => void;
  isAdded?: boolean;
  isLoading?: boolean;
  onAddToCart?: () => void;
}

export default function BentoItem({ product, spanClass }: BentoItemProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAr = i18n.language === "ar";

  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [deleteCartItem, { isLoading: isDeleting }] =
    useDeleteCartItemMutation();

  const { data: cartData } = useGetCartQuery();

  const cartItem = cartData?.find((item) => item.productId === product.id);
  const isAdded = cartItem !== undefined;

  const isPending = isAdding || isDeleting;

  const { data: fullProduct } = useGetProductByIdQuery(product.id);

  const productName = isAr && product.nameAr ? product.nameAr : product.name;

  const displayImage =
    product.imageUrl && product.imageUrl.trim() !== ""
      ? product.imageUrl
      : burgerFallback;

  const reviewsCount = fullProduct?.reviews?.length || 0;
  const averageRating =
    reviewsCount > 0
      ? (
          (fullProduct?.reviews?.reduce((acc, rev) => acc + rev.rating, 0) ??
            0) / reviewsCount
        ).toFixed(1)
      : "0.0";

  const handleAddToCart =
    (productId: number) => async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isAdded) {
        try {
          const targetId = cartItem?.id ?? productId;
          await deleteCartItem(targetId).unwrap();
          toast.success(
            t("products.removedFromCart", "تمت إزالة المنتج من السلة"),
          );
        } catch (error) {
          const apiErr = error as ApiError<AddToCartDto>;
          console.error("Error removing product from cart:", apiErr);
          toast.error(
            t(
              "products.removeFromCartError",
              "حدث خطأ أثناء إزالة المنتج من السلة",
            ),
          );
        }
      } else {
        try {
          await addToCart({ productId, dto: { quantity: 1 } }).unwrap();
          toast.success(
            t("products.addedToCart", "تمت إضافة المنتج إلى السلة"),
          );
        } catch (error) {
          const apiErr = error as ApiError<AddToCartDto>;
          console.error("Error adding product to cart:", apiErr);
          toast.error(
            t(
              "products.addToCartError",
              "حدث خطأ أثناء إضافة المنتج إلى السلة",
            ),
          );
        }
      }
    };

  return (
    <div
      onClick={() => {
        navigate(`/products/${product.id}`);
        scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`group relative w-full bg-card/70 backdrop-blur-2xl border border-border/80 hover:border-primary/60 rounded-[2.5rem] p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/15 flex flex-col justify-between overflow-hidden cursor-pointer ${spanClass}`}
    >
      <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden bg-muted shadow-inner">
        <img
          src={displayImage}
          alt={productName}
          onError={(e) => {
            e.currentTarget.src = burgerFallback;
          }}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          {reviewsCount > 0 ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs font-black shadow-xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{averageRating}</span>
              <span className="text-[11px] text-white/70 font-semibold dir-ltr inline-block">
                ({reviewsCount})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/30 backdrop-blur-md border border-primary/40 text-primary-foreground text-xs font-black shadow-xl">
              <Sparkles className="w-4 h-4 animate-pulse text-primary" />
              <span>{t("products.noRating", "جديد 🚀")}</span>
            </div>
          )}
        </div>
      </div>

      {/* معلومات الوجبة والسعر والأزرار */}
      <div className="p-2 pt-5 space-y-5">
        <h3 className="font-black text-xl sm:text-2xl text-foreground tracking-tight leading-snug line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {productName}
        </h3>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {t("products.price", "السعر")}
            </span>
            <div className="flex items-baseline gap-1 text-foreground">
              <span className="text-2xl font-black">{product.price}</span>
              <span className="text-xs font-bold text-primary">
                {t("products.currency", "EGP")}
              </span>
            </div>
          </div>

          <button
            disabled={!product.isAvailable || isPending}
            onClick={handleAddToCart(product.id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 shadow-md cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              !product.isAvailable
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : isAdded
                  ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 border border-emerald-500/40 shadow-emerald-500/10"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25 hover:shadow-primary/40 hover:scale-105"
            }`}
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>{t("products.addedToCart", "في السلة")}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>{t("products.addToCart", "إضافة")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}