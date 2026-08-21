import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, Check, ShoppingBag, Info, Loader2 } from "lucide-react";
import type { AddToCartDto, GetAllProductDto } from "@/types/types";
import burger from "@/assets/bb.jpg";
import ProductDetailsModal from "./ProductDetailsModal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [deleteCartItem, { isLoading: isDeleting }] = useDeleteCartItemMutation();

  const { data: cartData } = useGetCartQuery();

  const cartItem = cartData?.find((item) => item.productId === product.id);
  const isAdded = cartItem !== undefined;

  const isPending = isAdding || isDeleting;

  // جلب بيانات المنتج التفصيلية بما فيها التقييمات
  const { data: fullProduct } = useGetProductByIdQuery(product.id);

  const isAr = i18n.language === "ar";
  const productName = isAr && product.nameAr ? product.nameAr : product.name;
  const productDesc =
    isAr && product.descriptionAr ? product.descriptionAr : product.description;

  const displayImage =
    product.imageUrl && product.imageUrl.trim() !== ""
      ? product.imageUrl
      : burger;

  // حساب التقييمات الحقيقية من بيانات المنتج المفصلة
  const reviewsCount = fullProduct?.reviews?.length || 0;
  const averageRating =
    reviewsCount > 0
      ? (
          (fullProduct?.reviews?.reduce((acc, rev) => acc + rev.rating, 0) ??
            0) / reviewsCount
        ).toFixed(1)
      : "0.0";

  const handleAddToCart = (productId: number) => async () => {
    const TargetId = cartItem?.id??productId; // Use cart item ID if available, otherwise use product ID
    if (isAdded) {
      try {
        await deleteCartItem(TargetId).unwrap();
        toast.success(
          t("products.removedFromCart", "تمت إزالة المنتج من السلة"),
        );
      } catch (error) {
        const apiErr = error as ApiError<AddToCartDto>;
        console.error("Error removing product from cart:", apiErr);
        toast.error(
          apiErr?.message ||
            t(
              "products.removeFromCartError",
              "حدث خطأ أثناء إزالة المنتج من السلة",
            ),
        );
      }
    } else {
      try {
        await addToCart({ productId: TargetId, dto: { quantity: 1 } }).unwrap();
        toast.success(t("products.addedToCart", "تمت إضافة المنتج إلى السلة"));
      } catch (error) {
        const apiErr = error as ApiError<AddToCartDto>;
        console.error("Error adding product to cart:", apiErr);
        toast.error(apiErr?.message);
      }
    }
  };

  return (
    <>
      <div className="relative h-[380px] w-full rounded-[32px] overflow-hidden border border-border/40 shadow-xl group transition-all duration-300 hover:shadow-2xl hover:border-border/80 flex flex-col justify-between p-5 bg-card">
        {/* الخلفية والصورة */}
        <div className="absolute inset-0 z-0 bg-black">
          <img
            src={displayImage}
            alt={productName}
            onError={(e) => {
              e.currentTarget.src = burger;
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30" />
        </div>

        {/* الجزء العلوي: التقييم الحقيقي (أو حالة عدم وجود تقييم) */}
        <div className="relative z-10 flex items-center justify-between w-full">
          {reviewsCount > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-black shadow-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{averageRating}</span>
              <span className="text-[10px] text-white/70 font-semibold">
                ({reviewsCount})
              </span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 text-[11px] font-bold">
              {t("products.noRating", "وجبة مميزة")}
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-9 h-9 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            title={t("products.details", "التفاصيل")}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* الجزء السفلي */}
        <div className="relative z-10 space-y-3 pt-6">
          <div className="space-y-1">
            <h3 className="font-black text-xl text-white tracking-tight leading-snug line-clamp-1">
              {productName}
            </h3>
            {productDesc && (
              <p className="text-xs font-medium text-white/80 line-clamp-2 leading-relaxed">
                {productDesc}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-white/15 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white/60 uppercase">
                {t("products.priceLabel", "السعر")}
              </span>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-xl font-black">{product.price}</span>
                <span className="text-xs font-bold text-white/80">
                  {t("products.currency", "EGP")}
                </span>
              </div>
            </div>

            <button
              disabled={!product.isAvailable || isPending}
              onClick={handleAddToCart(product.id)}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all duration-200 shadow-lg cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                !product.isAvailable
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50"
                  : isAdded
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
                    : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/30"
              }`}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t("products.addedToCart", "تمت الإضافة")}</span>
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

      <ProductDetailsModal
        productId={product.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart(product.id)}
        addedToCart={isAdded}
        fallbackImage={burger}
      />
    </>
  );
}