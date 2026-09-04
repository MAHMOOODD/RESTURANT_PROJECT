import { useTranslation } from "react-i18next";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useDeleteCouponMutation } from "@/store/features/couponApi";
import type { GetCouponDto } from "@/types/types";

interface DeleteCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: GetCouponDto | null;
}

export function DeleteCouponDialog({
  open,
  onOpenChange,
  coupon,
}: DeleteCouponDialogProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  const handleConfirm = async () => {
    if (!coupon) return;

    try {
      await deleteCoupon(coupon.id).unwrap();
      toast.success(t("adminCoupons.deleteSuccess"));
      onOpenChange(false);
    } catch {
      toast.error(t("adminCoupons.deleteError"));
    }
  };

  if (!open || !coupon) return null;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-md flex flex-col rounded-3xl bg-card/95 border border-border/80 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Glow Effect */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 flex items-start justify-between gap-3 border-b border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="flex items-start gap-3 min-w-0">
            <span className="h-10 w-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {t("adminCoupons.deleteDialog.title")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                {t("adminCoupons.deleteDialog.description", {
                  code: coupon.code,
                })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => !isDeleting && onOpenChange(false)}
            disabled={isDeleting}
            className="p-2 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-90 border border-border/45 cursor-pointer outline-none shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end gap-3 bg-card/80 backdrop-blur-md">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted text-foreground font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer outline-none"
          >
            {t("adminCoupons.deleteDialog.cancelBtn")}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md shadow-rose-600/20 hover:shadow-lg hover:shadow-rose-600/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer outline-none min-w-[100px]"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{t("adminCoupons.deleteDialog.confirmBtn")}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
