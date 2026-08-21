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
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // فلترة الكوبونات الفعالة فقط
  const activeCoupons = coupons.filter((c) => c.isActive);

  if (isError || activeCoupons.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className="relative overflow-hidden rounded-3xl border border-primary/30 bg-linear-to-r from-primary/10 via-card to-card p-6 flex items-center justify-between gap-4 shadow-xl backdrop-blur-2xl"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                <Ticket className="w-4 h-4" />
                <span>{t("coupons.exclusiveDiscount", "خصم حصري")}</span>
              </div>
              <h4 className="text-xl font-black text-foreground">
                {t("coupons.discountTitle", "خصم {{discount}} ج.م عند الطلب بـ {{min}} ج.م", {
                  discount: coupon.discount,
                  min: coupon.minimumAmount,
                })}
              </h4>
              <p className="text-[11px] text-muted-foreground font-medium">
                {t("coupons.usedCount", "تم استخدامه {{count}} مرة", {
                  count: coupon.orders?.length || 0,
                })}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">
                {t("coupons.validUntil", "صالح حتى {{date}}", {
                  date: new Date(coupon.expiryDate).toLocaleDateString(
                    isAr ? "ar-EG" : "en-US",
                    { year: "numeric", month: "short", day: "numeric" }
                  ),
                })}
              </p>
            </div>

            <button
              onClick={() => handleCopy(coupon.code)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-card border border-dashed border-primary text-primary font-mono font-black text-sm hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shrink-0"
            >
              {copiedCode === coupon.code ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{t("coupons.copied", "تم النسخ")}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
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