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
} from "lucide-react";
import { useGetProductByIdQuery } from "@/store/features/items/Items";

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
          productDetails?.reviews?.reduce((acc, rev) => acc + rev.rating, 0) ??
          0 / reviewsCount
        ).toFixed(1)
      : "0.0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-card text-card-foreground border border-border/60 rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl space-y-0 max-h-[90vh] flex flex-col relative transition-all">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 ltr:right-auto ltr:left-4 z-20 w-10 h-10 bg-background/60 hover:bg-background/90 text-foreground rounded-full flex items-center justify-center backdrop-blur-md border border-border/40 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
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
            <span className="text-xs text-muted-foreground font-semibold">
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
            <div className="relative h-full w-full shrink-0 overflow-hidden bg-muted">
              <img
                src={displayImage}
                alt={productName}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

              <div className="absolute bottom-4 right-4 ltr:right-auto ltr:left-4 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-black shadow-lg shadow-primary/20 backdrop-blur-md flex items-center gap-1">
                <span>{productDetails.price}</span>
                <span className="text-xs font-semibold">
                  {t("products.currency")}
                </span>
              </div>
            </div>

            {/* الحاوية القابلة للتمرير مع كلاسات Tailwind 4 المباشرة للسكرول بار */}
            <div className="px-6 pb-6 pt-2 overflow-y-auto space-y-6 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 ltr:pr-2 rtl:pl-2">
              {/* العنوان والوصف */}
              <div className="space-y-3">
                <h2 className="text-2xl font-black tracking-tight text-foreground leading-snug">
                  {productName}
                </h2>

                <div className="flex items-center  gap-3 text-xs">
                  <div className="flex items-center gap-1.5 px-3  py-1 rounded-full bg-secondary/50 text-secondary-foreground font-medium  ">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {productDetails.preparingTime} {t("products.minutes")}
                    </span>
                  </div>

                  {reviewsCount > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{averageRating}</span>
                      <span className="text-muted-foreground font-normal">
                        ({reviewsCount})
                      </span>
                    </div>
                  )}
                </div>

                {productDesc && (
                  <div className="p-4 rounded-2xl bg-muted/40  text-xs text-muted-foreground leading-relaxed">
                    <p className="font-bold text-foreground/90">
                      {productDesc}
                    </p>
                  </div>
                )}
              </div>

              {/* التقييمات */}
              <div className="space-y-4 pt-2 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {t("products.reviews", "تقييمات العملاء")}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {reviewsCount}
                  </span>
                </div>

                {reviewsCount > 0 ? (
                  <div className="space-y-3">
                    {productDetails?.reviews?.map((rev) => {
                      const userName = rev.userName || "عميل مميز";
                    //   const firstLetter = userName.charAt(0).toUpperCase();

                      return (
                        <div
                          key={rev.id}
                          className="p-4 rounded-2xl bg-muted/5 border border-border/40 space-y-2.5 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black text-xs">
                                {rev.userImage ? (
                                  <img
                                    src={rev.userImage}
                                    alt={rev.userName}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <User className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-foreground leading-none">
                                  {userName}
                                </h4>
                                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                  {t(
                                    "products.verifiedPurchase",
                                    "مشتري مأكولات",
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-0.5 bg-background/90 px-2 py-1 rounded-lg border border-border/30">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < rev.rating
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <p className="text-xs text-foreground/80 leading-relaxed font-normal ltr:pl-10 rtl:pr-10">
                            {rev.comment}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center rounded-2xl bg-muted/20 border border-dashed border-border/50 flex flex-col items-center justify-center space-y-2">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground font-medium">
                      {t(
                        "products.noReviews",
                        "لا توجد تقييمات لهذه الوجبة بعد. كن أول من يشارك رأيه!",
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* زِر الإضافة للسلة */}
            {addedToCart ? (
              <div className="p-4 border-t border-border/40 bg-card/80 backdrop-blur-md shrink-0">
                <button
                  disabled
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-emerald-600 text-white flex items-center justify-between transition-all duration-200 shadow-lg shadow-emerald-600/25"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>{t("products.addedToCart")}</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="p-4 border-t border-border/40 bg-card/80 backdrop-blur-md shrink-0">
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
                    <span>{t("products.addToCart")}</span>
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
