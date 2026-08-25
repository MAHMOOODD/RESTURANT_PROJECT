import { Ticket, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GetCouponDto } from "@/types/types";

interface CouponSectionProps {
  couponInput: string;
  setCouponInput: (val: string) => void;
  appliedCoupon: GetCouponDto | null;
  handleApplyCoupon: () => void;
  handleRemoveCoupon: () => void;
}

export function CouponSection({
  couponInput,
  setCouponInput,
  appliedCoupon,
  handleApplyCoupon,
  handleRemoveCoupon,
}: CouponSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="p-8 rounded-3xl bg-card/70 backdrop-blur-xl border border-border/80 shadow-md space-y-6">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <Ticket className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground">
            {t("checkout.coupon.title")}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {t("checkout.coupon.desc")}
          </p>
        </div>
      </div>

      {!appliedCoupon ? (
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            placeholder={t("checkout.coupon.placeholder")}
            className="flex-1 px-5 py-4 rounded-2xl bg-background/80 border border-border/80 text-foreground text-base font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-amber-500 transition-all placeholder:text-muted-foreground/40"
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={!couponInput.trim()}
            className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 shrink-0"
          >
            {t("checkout.coupon.apply")}
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block font-mono">
                {t("checkout.coupon.applied_success", { code: appliedCoupon.code })}
              </span>
              <span className="text-xs font-bold text-emerald-600/80">
                {t("checkout.coupon.discount_percentage", { discount: appliedCoupon.discount })}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemoveCoupon}
            className="p-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title={t("checkout.coupon.remove")}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}