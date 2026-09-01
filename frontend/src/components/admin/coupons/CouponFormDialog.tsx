// المسار المقترح: src/components/admin/coupons/CouponFormDialog.tsx
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, TicketPercent } from "lucide-react";
import { toast } from "sonner";
import {
  useAddCouponMutation,
  useEditCouponMutation,
} from "@/store/features/couponApi";
import type { GetCouponDto } from "@/types/types";
import { CouponForm } from "./CouponForm";
import {
  createCouponSchema,
  getInitialCouponValues,
  type CouponFormValues,
} from "./Couponschema";

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: GetCouponDto | null;
}

export function CouponFormDialog({
  open,
  onOpenChange,
  coupon,
}: CouponFormDialogProps) {
  const { t } = useTranslation();
  const isEditMode = Boolean(coupon);

  const [addCoupon, { isLoading: isAdding }] = useAddCouponMutation();
  const [editCoupon, { isLoading: isEditing }] = useEditCouponMutation();
  const isSubmitting = isAdding || isEditing;

  // الـ Schema ثابتة ولا تعتمد على دالة t مباشرة، نفس نمط orderStatusSchema
  const couponSchema = useMemo(() => createCouponSchema(), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: getInitialCouponValues(coupon),
  });

  // ترجمة الأخطاء القادمة من Zod ديناميكياً عند الرندرة (نفس نمط OrderDetailsDialog)
  const translatedErrors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(errors).map(([key, val]) => [
          key,
          val?.message ? t(val.message as string) : undefined,
        ]),
      ) as Partial<Record<keyof CouponFormValues, string>>,
    [errors, t],
  );

  // إعادة ضبط الفورم عند فتح المودال أو تغيير الكوبون المحدد (إضافة أو تعديل)
  useEffect(() => {
    if (open) {
      reset(getInitialCouponValues(coupon));
    }
  }, [open, coupon, reset]);

  const onSubmit = async (data: CouponFormValues) => {
    try {
      if (isEditMode && coupon) {
        await editCoupon({ id: coupon.id, dto: data }).unwrap();
        toast.success(t("adminCoupons.form.saveSuccess"));
      } else {
        await addCoupon(data).unwrap();
        toast.success(t("adminCoupons.form.addSuccess"));
      }
      onOpenChange(false);
    } catch {
      toast.error(t("adminCoupons.form.errors.saveFailed"));
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg max-h-[88vh] flex flex-col rounded-3xl bg-card/95 border border-border/80 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 flex items-start justify-between gap-3 border-b border-border/40 shrink-0 bg-card/50 backdrop-blur-sm">
          <div className="flex items-start gap-2.5 min-w-0">
            <span className="h-9 w-9 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 mt-0.5">
              <TicketPercent className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isEditMode
                  ? t("adminCoupons.form.editTitle")
                  : t("adminCoupons.form.addTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isEditMode
                  ? t("adminCoupons.form.editSubtitle")
                  : t("adminCoupons.form.addSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => !isSubmitting && onOpenChange(false)}
            disabled={isSubmitting}
            className="p-2 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-90 border border-border/45 cursor-pointer outline-none shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="coupon-form"
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          <CouponForm register={register} errors={translatedErrors} />
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-card/80 backdrop-blur-md shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted text-foreground font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer outline-none"
          >
            {t("adminCoupons.form.cancelBtn")}
          </button>

          <button
            type="submit"
            form="coupon-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer outline-none min-w-[110px]"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>
                {isEditMode
                  ? t("adminCoupons.form.saveBtn")
                  : t("adminCoupons.form.addBtn")}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
