// المسار المقترح: src/components/admin/coupons/CouponForm.tsx
import { useTranslation } from "react-i18next";
import type { UseFormRegister } from "react-hook-form";
import { Tag, Percent, Wallet } from "lucide-react";
import type { CouponFormValues } from "./Couponschema";

interface CouponFormProps {
  register: UseFormRegister<CouponFormValues>;
  errors: Partial<Record<keyof CouponFormValues, string>>;
}

export function CouponForm({ register, errors }: CouponFormProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-5">
      {/* Coupon Code */}
      <div className="grid gap-2 text-start">
        <label
          htmlFor="coupon-code"
          className="text-xs font-bold text-foreground/90 select-none flex items-center gap-1.5"
        >
          <Tag className="h-3.5 w-3.5 text-primary" />
          {t("adminCoupons.form.codeLabel")}
        </label>
        <input
          id="coupon-code"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder={t("adminCoupons.form.codePlaceholder")}
          {...register("code")}
          className="w-full h-11 px-4 bg-background/60 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground font-mono font-bold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
        />
        {errors.code && (
          <p className="text-xs font-semibold text-rose-500 mt-0.5">
            {errors.code}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Discount */}
        <div className="grid gap-2 text-start">
          <label
            htmlFor="coupon-discount"
            className="text-xs font-bold text-foreground/90 select-none flex items-center gap-1.5"
          >
            <Percent className="h-3.5 w-3.5 text-primary" />
            {t("adminCoupons.form.discountLabel")}
          </label>
          <input
            id="coupon-discount"
            type="number"
            step={1}
            min={0}
            max={99}
            placeholder={t("adminCoupons.form.discountPlaceholder")}
            {...register("discount", { valueAsNumber: true })}
            className="w-full h-11 px-4 bg-background/60 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground font-mono font-bold focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
          />
          {errors.discount && (
            <p className="text-xs font-semibold text-rose-500 mt-0.5">
              {errors.discount}
            </p>
          )}
        </div>

        {/* Minimum Amount */}
        <div className="grid gap-2 text-start">
          <label
            htmlFor="coupon-minimum-amount"
            className="text-xs font-bold text-foreground/90 select-none flex items-center gap-1.5"
          >
            <Wallet className="h-3.5 w-3.5 text-primary" />
            {t("adminCoupons.form.minimumAmountLabel")}
          </label>
          <input
            id="coupon-minimum-amount"
            type="number"
            step={1}
            min={1}
            placeholder={t("adminCoupons.form.minimumAmountPlaceholder")}
            {...register("minimumAmount", { valueAsNumber: true })}
            className="w-full h-11 px-4 bg-background/60 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground font-mono font-bold focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
          />
          {errors.minimumAmount && (
            <p className="text-xs font-semibold text-rose-500 mt-0.5">
              {errors.minimumAmount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
