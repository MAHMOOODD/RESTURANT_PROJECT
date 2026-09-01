import { useState } from "react";
import { Ticket, Copy, Check, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetAllCouponsQuery } from "@/store/features/couponApi";

export default function CouponsSection() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // جلب الكوبونات من الـ API الحقيقي
  const { data: coupons = [], isLoading, isError } = useGetAllCouponsQuery();


  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // فلترة الكوبونات الفعالة فقط

  if (isError || coupons.length === 0) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="relative overflow-hidden rounded-[2.5rem] border border-primary/30 bg-linear-to-r from-primary/10 via-card to-card p-8 flex items-center justify-between gap-6 shadow-2xl backdrop-blur-2xl"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-wider">
                <Ticket className="w-5 h-5" />
                <span>{t("coupons.exclusiveDiscount", "خصم حصري")}</span>
              </div>
              <h4 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
                {t(
                  "coupons.discountTitle",
                  "خصم {{discount}} ج.م عند الطلب بـ {{min}} ج.م",
                  {
                    discount: coupon.discount,
                    min: coupon.minimumAmount,
                  },
                )}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
                {t("coupons.usedCount", "تم استخدامه {{count}} مرة", {
                  count: coupon.orders?.length || 0,
                })}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
                {t("coupons.validUntil", "صالح حتى {{date}}", {
                  date: new Date(coupon.expiryDate).toLocaleDateString(
                    isAr ? "ar-EG" : "en-US",
                    { year: "numeric", month: "short", day: "numeric" },
                  ),
                })}
              </p>
            </div>

            <button
              onClick={() => handleCopy(coupon.code)}
              className="flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-card border-2 border-dashed border-primary text-primary font-mono font-black text-base hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shrink-0 shadow-md active:scale-95"
            >
              {copiedCode === coupon.code ? (
                <>
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>{t("coupons.copied", "تم النسخ")}</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>{coupon.code}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
