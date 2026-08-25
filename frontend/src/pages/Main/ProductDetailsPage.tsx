import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Utensils,
  Star,
} from "lucide-react";
import { useGetProductByIdQuery } from "@/store/features/productApi";
import {
  useAddToCartMutation,
  useGetCartQuery,
  useDeleteCartItemMutation,
} from "@/store/features/cartApi";
import {
  useAddReviewMutation,
  useEditReviewMutation,
  useDeleteReviewMutation,
} from "@/store/features/reviewApi";
import { useGetUserInfoQuery } from "@/store/features/User/Auth";
import { toast } from "sonner";
import type { ApiError } from "@/services/baseQuery";
import type { AddToCartDto, GetReviewDto } from "@/types/types";

// المكونات المقسمة
import { ProductHeroSection } from "@/components/my/productDetails/ProductHeroSection";
import { ReviewForm } from "@/components/my/productDetails/ReviewForm";
import { ReviewList } from "@/components/my/productDetails/ReviewList";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  // جلب معلومات المستخدم الحالي من الـ API المعرفة في authApi
  const { data: userInfo } = useGetUserInfoQuery();

  const [isActionLoading, setIsActionLoading] = useState(false);
  const [editingReview, setEditingReview] = useState<GetReviewDto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // API Queries & Mutations
  const {
    data: productDetails,
    isLoading,
    isError,
    refetch: refetchProductDetails,
  } = useGetProductByIdQuery(productId, { skip: !productId });
  const [addToCart] = useAddToCartMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();

  const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();
  const [editReview, { isLoading: isUpdating }] = useEditReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const cartItem = cartData?.find(
    (item) => Number(item.productId) === productId,
  );
  const isAdded = cartItem !== undefined;

  // التعامل مع السلة
  const handleCartToggle = async () => {
    if (!productId) return;
    setIsActionLoading(true);
    try {
      if (isAdded && cartItem) {
        await deleteCartItem(cartItem.id).unwrap();
        toast.success(
          t("products.removedFromCart", "تمت إزالة المنتج من السلة"),
        );
      } else {
        await addToCart({ productId, dto: { quantity: 1 } }).unwrap();
        toast.success(t("products.addedToCart", "تمت إضافة المنتج إلى السلة"));
      }
    } catch (error) {
      const apiErr = error as ApiError<AddToCartDto>;
      console.error("Cart action error:", apiErr);
      toast.error(
        isAdded
          ? t("products.removeFromCartError", "حدث خطأ أثناء إزالة المنتج")
          : t(
              "products.addToCartError",
              "يجب تسجيل الدخول لإضافة المنتجات للسلة",
            ),
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  // التعامل مع إضافة أو تعديل التقييم
  const handleReviewSubmit = async (rating: number, comment?: string) => {
    if (!productId) return;

    try {
      if (editingReview) {
        const exist = productDetails?.reviews?.find(
          (r) => r.id === editingReview.id,
        );
        if (!exist) {
          toast.error(
            t("products.reviewNotFound", "لم يتم العثور على هذا التقييم."),
          );
          setEditingReview(null);
          return;
        }

        await editReview({
          id: editingReview.id,
          dto: {
            productId,
            rating,
            comment: comment?.trim() !== "" ? comment : undefined,
          },
        }).unwrap();

        toast.success(
          t("products.reviewUpdateSuccess", "تم تعديل تقييمك بنجاح!"),
        );
        refetchProductDetails();
        setEditingReview(null);
      } else {
        await addReview({
          productId,
          rating,
          comment: comment?.trim() !== "" ? comment : undefined,
        }).unwrap();

        toast.success(
          t("products.reviewAddedSuccess", "تم إضافة تقييمك بنجاح!"),
        );
        refetchProductDetails();
      }
    } catch {
      toast.error(
        t("products.reviewError", "حدث خطأ، يرجى التأكد من تسجيل الدخول"),
      );
    }
  };

  // التعامل مع حذف التقييم
  const handleDeleteReview = async (reviewId: number) => {
    try {
      setDeletingId(reviewId);
      await deleteReview({ id: reviewId, productId }).unwrap();
      toast.success(t("products.reviewDeleted", "تم حذف التقييم بنجاح"));
      refetchProductDetails();
    } catch {
      toast.error(t("products.deleteReviewError", "حدث خطأ أثناء حذف التقييم"));
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Utensils className="w-7 h-7 text-primary absolute animate-pulse" />
        </div>
        <span className="text-base text-muted-foreground font-bold">
          {t("products.loadingDetails", "جاري تحضير تفاصيل الوجبة...")}
        </span>
      </div>
    );
  }

  if (isError || !productDetails) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-destructive px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <span className="text-lg font-bold">
          {t("products.errorLoading", "حدث خطأ أثناء جلب تفاصيل الوجبة")}
        </span>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm cursor-pointer"
        >
          {t("common.back", "الرجوع للرئيسية")}
        </button>
      </div>
    );
  }

  const reviewsCount = productDetails?.reviews?.length || 0;

  return (
    <div className="container max-w-384 mx-auto px-4 py-6 sm:py-10 space-y-10">
      {/* زر العودة */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-card border border-border/70 hover:bg-muted text-foreground text-sm font-bold transition-all shadow-sm cursor-pointer"
      >
        {isAr ? (
          <ArrowRight className="w-4 h-4" />
        ) : (
          <ArrowLeft className="w-4 h-4" />
        )}
        <span>{t("common.back", "رجوع")}</span>
      </button>

      {/* قسم الوجبة والتفاصيل */}
      <ProductHeroSection
        productDetails={productDetails}
        isAdded={isAdded}
        isActionLoading={isActionLoading}
        isCartLoading={isCartLoading}
        onCartToggle={handleCartToggle}
      />

      {/* قسم التقييمات والتعليقات */}
      <div className="pt-8 space-y-8 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {t("products.reviews", "تقييمات العملاء")}
            </h2>
          </div>
          <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-muted text-muted-foreground border border-border/50">
            {reviewsCount} {t("products.reviewsCount", "تقييم")}
          </span>
        </div>

        {/* نموذج الإضافة والتعديل */}
        <ReviewForm
          key={editingReview ? editingReview.id : "new-review"}
          isEditing={Boolean(editingReview)}
          initialRating={editingReview?.rating || 5}
          initialComment={editingReview?.comment || ""}
          isLoading={isSubmitting || isUpdating}
          onSubmit={handleReviewSubmit}
          onCancelEdit={() => setEditingReview(null)}
        />

        {/* عرض قائمة التقييمات */}
        <ReviewList
          reviews={productDetails.reviews || []}
          currentUserId={userInfo?.userName}
          onEdit={(review) => setEditingReview(review)}
          onDelete={handleDeleteReview}
          isDeletingId={deletingId}
          isEditing={Boolean(editingReview)}
        />
      </div>
    </div>
  );
}