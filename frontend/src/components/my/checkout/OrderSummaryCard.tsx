import { ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GetCartDto, GetCouponDto, GetAllProductDto } from "@/types/types";

interface OrderSummaryCardProps {
  cartItems: GetCartDto[];
  productsList: GetAllProductDto[];
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
  appliedCoupon: GetCouponDto | null;
  isSubmitting: boolean;
  hasAddress: boolean;
  onPlaceOrder: () => void;
}

export function OrderSummaryCard({
  cartItems,
  productsList,
  subtotal,
  discountAmount,
  finalTotal,
  appliedCoupon,
  isSubmitting,
  hasAddress,
  onPlaceOrder,
}: OrderSummaryCardProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const getProductDetails = (productId: number) => {
    return productsList.find((p) => p.id === productId);
  };

  return (
    <div className="p-8 rounded-3xl bg-card/90 backdrop-blur-2xl border border-border/80 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-amber-500 via-primary to-orange-500" />

      <h2 className="text-xl font-black text-foreground mb-6">
        {t("checkout.summary.title")}
      </h2>

      {/* details */}
      <div className="max-h-64 overflow-y-auto pr-2 mb-6 space-y-3 custom-scrollbar">
        {cartItems.map((item) => {
          const product = getProductDetails(item.productId);
          const itemPrice = product?.price ?? 0;
          const productName = isAr
            ? product?.nameAr || product?.name
            : product?.name || product?.nameAr;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm font-semibold py-3 border-b border-border/40 last:border-none"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {item.quantity}x
                </span>
                <span className="text-foreground font-bold line-clamp-1 max-w-[200px] text-sm">
                  {productName || `${t("checkout.summary.meal_prefix")} #${item.productId}`}
                </span>
              </div>
              <span className="font-black text-foreground shrink-0 text-base">
                {itemPrice * item.quantity} {t("checkout.currency")}
              </span>
            </div>
          );
        })}
      </div>

      {/* summary */}
      <div className="space-y-4 text-sm font-semibold border-t border-border/60 pt-6">
        <div className="flex justify-between items-center text-muted-foreground">
          <span className="text-base">{t("checkout.summary.subtotal")}</span>
          <span
            className={`font-bold text-base ${appliedCoupon ? "line-through text-muted-foreground" : "text-foreground"}`}
          >
            {subtotal} {t("checkout.currency")}
          </span>
        </div>

        <div className="flex justify-between items-center text-muted-foreground">
          <span className="text-base">{t("checkout.summary.delivery")}</span>
          <span className="font-bold text-emerald-500 flex items-center gap-1.5 text-base">
            <ShieldCheck className="w-5 h-5" /> {t("checkout.summary.free")}
          </span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between items-center text-emerald-500 font-bold text-base animate-in fade-in duration-300">
            <span>{t("checkout.summary.discount_label", { percent: appliedCoupon.discount })}</span>
            <span>- {discountAmount.toFixed(2)} {t("checkout.currency")}</span>
          </div>
        )}

        <div className="border-t border-border/80 pt-4 flex justify-between items-center text-base font-black text-foreground">
          <span className="text-lg">{t("checkout.summary.final_total")}</span>
          <div className="text-right">
            <span className="text-2xl text-primary font-black block">
              {finalTotal.toFixed(2)} {t("checkout.currency")}
            </span>
            {appliedCoupon && (
              <span className="text-xs text-emerald-500 font-medium block mt-1">
                {t("checkout.summary.you_saved", { amount: discountAmount.toFixed(2) })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* place order button */}
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={isSubmitting || !hasAddress}
        className="w-full mt-8 flex items-center justify-center gap-3 py-5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base shadow-2xl shadow-primary/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : (
          <>
            <CheckCircle2 className="w-6 h-6" />
            <span>{t("checkout.summary.confirm_btn", { total: finalTotal.toFixed(2) })}</span>
          </>
        )}
      </button>
    </div>
  );
}