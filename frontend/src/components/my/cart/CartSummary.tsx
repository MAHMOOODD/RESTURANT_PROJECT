import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Receipt,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface CartSummaryProps {
  itemsCount: number;
  totalQuantity: number;
}

export function CartSummary({ itemsCount, totalQuantity }: CartSummaryProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="lg:col-span-4 sticky top-24">
      <div className="p-7 sm:p-8 rounded-3xl bg-card/80 backdrop-blur-2xl border-2 border-border/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-500 via-primary to-orange-500" />

        <h2 className="text-lg sm:text-xl font-black text-foreground mb-7 flex items-center gap-2.5">
          <Receipt className="w-6 h-6 text-primary" />
          <span>{t("cart.summary_title")}</span>
        </h2>

        <div className="space-y-5 text-sm sm:text-base font-extrabold border-b-2 border-border/60 pb-6">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>{t("cart.meal_types")}</span>
            <span className="font-black text-foreground text-base sm:text-lg">
              {itemsCount} {t("cart.types")}
            </span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>{t("cart.total_items")}</span>
            <span className="font-black text-foreground text-base sm:text-lg">
              {totalQuantity} {t("cart.pieces")}
            </span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>{t("cart.delivery_fee")}</span>
            <span className="font-black text-emerald-500 flex items-center gap-1.5 text-base sm:text-lg">
              <ShieldCheck className="w-5 h-5" />
              {t("cart.free")}
            </span>
          </div>
        </div>

        <div className="my-5 p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/20 text-amber-500 text-xs sm:text-sm font-black flex items-start gap-2.5 leading-relaxed">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{t("cart.fresh_notice")}</span>
        </div>

        <Link
          to="/checkout"
          className="w-full mt-3 flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base sm:text-lg shadow-xl shadow-primary/25 active:scale-95 transition-all cursor-pointer"
        >
          <span>{t("cart.checkout_btn")}</span>
          {isAr ? (
            <ArrowLeft className="w-5 h-5" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </Link>
      </div>
    </div>
  );
}
