import { Star, ShoppingBag, Info, Check, Loader2 } from "lucide-react";
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
  onOpenModal: (id: number) => void;
}

export default function BentoItem({
  product,
  spanClass,
  onOpenModal,
}: BentoItemProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAr = i18n.language === "ar";

  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [deleteCartItem, { isLoading: isDeleting }] = useDeleteCartItemMutation();

  const { data: cartData } = useGetCartQuery();

  // البحث عن العنصر في السلة واستخراج الـ CartItem ID
  const cartItem = cartData?.find((item) => item.productId === product.id);
  const isAdded = cartItem !== undefined;

  const isPending = isAdding || isDeleting;

  // جلب تفاصيل المنتج المفصلة لتعيين التقييمات
  const { data: fullProduct } = useGetProductByIdQuery(product.id);

  const productName = isAr && product.nameAr ? product.nameAr : product.name;
  const productDesc =
    isAr && product.descriptionAr ? product.descriptionAr : product.description;

  const displayImage =
 burgerFallback;

  // حساب التقييم
  const reviewsCount = fullProduct?.reviews?.length || 0;
  const averageRating =
    reviewsCount > 0
      ? (
          (fullProduct?.reviews?.reduce((acc, rev) => acc + rev.rating, 0) ??
            0) / reviewsCount
        ).toFixed(1)
      : "0.0";

  const handleAddToCart = (productId: number) => async (e: React.MouseEvent) => {
    e.stopPropagation(); // منع الـ Card من تنفيذ حدث التنقل عند الضغط على زر السلة

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
          apiErr?.message ||
            t(
              "products.removeFromCartError",
              "حدث خطأ أثناء إزالة المنتج من السلة",
            ),
        );
      }
    } else {
      try {
        await addToCart({ productId, dto: { quantity: 1 } }).unwrap();
        toast.success(t("products.addedToCart", "تمت إضافة المنتج إلى السلة"));
      } catch (error) {
        const apiErr = error as ApiError<AddToCartDto>;
        console.error("Error adding product to cart:", apiErr);
        toast.error(apiErr?.message);
      }
    }
  };

  return (
    <div
      onClick={() => {
        navigate(`/products?category%2F1=&category=${product.categoryId}`);
        scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 transition-all duration-500 hover:border-primary/80 hover:shadow-2xl flex flex-col justify-between min-h-[320px] cursor-pointer ${spanClass}`}
    >
      {/* الصورة الخلفية والـ Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${displayImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />

      {/* الجزء العلوي: التقييم + زر الـ Info */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        {reviewsCount > 0 ? (
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/10 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{averageRating}</span>
            <span className="text-gray-400 text-[10px]">({reviewsCount})</span>
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 text-[11px] font-bold">
            {t("products.noRating", "وجبة مميزة")}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(product.id);
          }}
          className="w-9 h-9 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          title={t("products.details", "التفاصيل")}
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* الجزء السفلي: تفاصيل الوجبة والشراء */}
      <div className="relative z-10 space-y-4 mt-16">
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-primary transition-colors line-clamp-1">
            {productName}
          </h3>
          {productDesc && (
            <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed font-medium">
              {productDesc}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/15">
          <div>
            <span className="text-[10px] text-gray-400 block font-semibold">
              {t("products.priceLabel", "السعر")}
            </span>
            <span className="text-lg font-black text-white">
              {product.price}{" "}
              <span className="text-xs font-normal">
                {t("products.currency", "EGP")}
              </span>
            </span>
          </div>

          <button
            disabled={!product.isAvailable || isPending}
            onClick={handleAddToCart(product.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${
              !product.isAvailable
                ? "bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50"
                : isAdded
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
                  : "bg-primary text-white shadow-primary/30 hover:bg-primary/90"
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
  );
}