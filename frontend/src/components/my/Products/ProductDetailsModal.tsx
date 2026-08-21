import { useTranslation } from "react-i18next";
import {
  Star,
  X,
  ShoppingBag,
  Clock,
  AlertCircle,
  Utensils,
  User,
  MessageSquare,
  Check,
  CheckCircle2,
} from "lucide-react";
import { useGetProductByIdQuery } from "@/store/features/productApi";

interface ProductDetailsModalProps {
  productId: number;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
  fallbackImage: string;
  addedToCart: boolean;
}

export default function ProductDetailsModal({
  productId,
  addedToCart,
  isOpen,
  onClose,
  onAddToCart,
  fallbackImage,
}: ProductDetailsModalProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const {
    data: productDetails,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId, {
    skip: !isOpen,
  });

  if (!isOpen) return null;

  const productName =
    isAr && productDetails?.nameAr
      ? productDetails.nameAr
      : productDetails?.name;
  const productDesc =
    isAr && productDetails?.descriptionAr
      ? productDetails.descriptionAr
      : productDetails?.description;
  const displayImage = fallbackImage;

  const reviewsCount = productDetails?.reviews?.length || 0;
  const averageRating =
    reviewsCount > 0
      ? (
          (productDetails?.reviews?.reduce((acc, rev) => acc + rev.rating, 0) ??
            0) / reviewsCount
        ).toFixed(1)
      : "0.0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-card text-card-foreground border border-border/80 rounded-[2.5rem] max-w-lg w-full overflow-hidden shadow-2xl max-h-[90vh] flex flex-col relative transition-all">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 ltr:right-auto ltr:left-4 z-30 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* حالة التحميل */}
        {isLoading && (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Utensils className="w-5 h-5 text-primary absolute animate-pulse" />
            </div>
            <span className="text-xs text-muted-foreground font-bold">
              {t("products.loadingDetails", "جاري تحضير تفاصيل الوجبة...")}
            </span>
          </div>
        )}

        {/* حالة الخطأ */}
        {isError && (
          <div className="h-80 flex flex-col items-center justify-center space-y-3 text-destructive px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold">
              {t("products.errorLoading", "حدث خطأ أثناء جلب التفاصيل")}
            </span>
          </div>
        )}

        {/* عرض المحتوى */}
        {!isLoading && !isError && productDetails && (
          <>
            {/* صورة الوجبة */}
            <div className="relative h-72 w-full shrink-0 overflow-hidden bg-black/90">
              <img
                src={displayImage}
                alt={productName}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

              <div className="absolute bottom-4 right-4 ltr:right-auto ltr:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-2xl text-sm font-black shadow-xl shadow-primary/30 backdrop-blur-md flex items-center gap-1 z-10">
                <span>{productDetails.price}</span>
                <span className="text-xs font-bold">
                  {t("products.currency")}
                </span>
              </div>
            </div>

            {/* الحاوية القابلة للتمرير */}
            <div className="px-6 pb-6 pt-5 overflow-y-auto space-y-6 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 ltr:pr-2 rtl:pl-2">
              {/* العنوان والوصف والمعلومات */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-snug">
                  {productName}
                </h2>

                <div className="flex items-center gap-2.5 text-xs flex-wrap">
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-muted/80 text-foreground font-bold border border-border/50">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>
                      {productDetails.preparingTime} {t("products.minutes")}
                    </span>
                  </div>

                  {reviewsCount > 0 && (
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-black">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{averageRating}</span>
                      <span className="text-muted-foreground font-semibold text-[11px]">
                        ({reviewsCount})
                      </span>
                    </div>
                  )}
                </div>

                {productDesc && (
                  <div className="p-4 rounded-2xl bg-muted/50 border border-border/60 text-xs text-muted-foreground leading-relaxed shadow-sm">
                    <p className="font-semibold text-foreground/90">
                      {productDesc}
                    </p>
                  </div>
                )}
              </div>

              {/* التقييمات المطابقة للصورة تماماً */}
              <div className="space-y-4 pt-4 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                    <h3 className="text-sm font-black text-foreground">
                      {t("products.reviews", "Customer Reviews")}
                    </h3>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border/40">
                    {reviewsCount}
                  </span>
                </div>

                {reviewsCount > 0 ? (
                  <div className="space-y-4">
                    {productDetails?.reviews?.map((rev) => {
                      const userName = rev.userName || "Verified Buyer";

                      return (
                        <div
                          key={rev.id}
                          className="p-5 rounded-3xl bg-card border border-border/80 space-y-4 shadow-sm"
                        >
                          {/* الجزء العلوي: النجوم على جهة والشارة الموثقة على الجهة المقابلة */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < rev.rating
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-muted-foreground/20"
                                  }`}
                                />
                              ))}
                            </div>

                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>
                                {t("products.verifiedPurchase", "طلب موثق")}
                              </span>
                            </span>
                          </div>

                          {/* نص التعليق في المنتصف */}
                          <p className="text-sm font-semibold text-foreground leading-relaxed">
                            "{rev.comment}"
                          </p>

                          {/* الجزء السفلي: الصورة والاسم وتاريخ/تفاصيل التقييم */}
                          <div className="pt-3 border-t border-border/40 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black text-xs overflow-hidden shrink-0">
                              {rev.userImage ? (
                                <img
                                  src={rev.userImage}
                                  alt={rev.userName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-foreground">
                                {userName}
                              </h4>
                              <span className="text-[11px] font-medium text-muted-foreground block mt-0.5">
                                {rev.createdAt
                                  ? new Date(rev.createdAt).toLocaleDateString()
                                  : "منذ ساعتين"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center rounded-2xl bg-muted/20 border border-dashed border-border/60 flex flex-col items-center justify-center space-y-2">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground font-bold">
                      {t(
                        "products.noReviews",
                        "لا توجد تقييمات لهذه الوجبة بعد. كن أول من يشارك رأيه!",
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* زر الإضافة للسلة */}
            {addedToCart ? (
              <div className="p-4 border-t border-border/60 bg-card shrink-0">
                <button
                  disabled
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-emerald-600 text-white flex items-center justify-between transition-all duration-200 shadow-lg shadow-emerald-600/20"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>{t("products.addedToCart")}</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="p-4 border-t border-border/60 bg-card shrink-0">
                <button
                  disabled={!productDetails.isAvailable}
                  onClick={() => {
                    onAddToCart();
                    onClose();
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-between transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t("products.addToCart", "Add to cart")}</span>
                  </div>
                  <span className="bg-primary-foreground/20 px-3 py-1 rounded-xl text-xs font-extrabold">
                    {productDetails.price} {t("products.currency")}
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
