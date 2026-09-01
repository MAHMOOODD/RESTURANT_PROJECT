import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Loader2,
  Package,
  Calendar,
  MapPin,
  Percent,
  
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useUpdateOrderStatusMutation } from "@/store/features/orderApi";
import type { GetOrderDto } from "@/types/types";
import { UserInfoCard } from "./Userinfocard";
import { OrderStatusForm } from "./Orderstatusform";
import {
  createOrderStatusSchema,
  type OrderStatusFormValues,
} from "./Orderstatusschema";
import { PaymentStatus, OrderStatus } from "@/types/types";
interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: GetOrderDto | null;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailsDialogProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  // الـ Schema ثابتة ولا تعتمد على دالة t مباشرة، نفس نمط ProductFormDialog
  const orderStatusSchema = useMemo(() => createOrderStatusSchema(), []);

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<OrderStatusFormValues>({
    resolver: zodResolver(orderStatusSchema),
    defaultValues: {
      status: order?.status ?? 0,
      paymentStatus: order?.paymentStatus ?? 0,
    },
  });

  const watchedStatus = useWatch({ control, name: "status" });
  const watchedPaymentStatus = useWatch({ control, name: "paymentStatus" });

  const formValues: OrderStatusFormValues = {
    status: watchedStatus,
    paymentStatus: watchedPaymentStatus,
  };

  // ترجمة الأخطاء القادمة من Zod ديناميكياً
  const translatedErrors = useMemo(() => {
    return Object.fromEntries(
      Object.entries(errors).map(([key, val]) => [
        key,
        val?.message ? t(val.message as string) : undefined,
      ]),
    );
  }, [errors, t]);

  // إعادة ضبط الفورم عند فتح المودال أو تغيير الطلب
  useEffect(() => {
    if (open && order) {
      reset({ status: order.status, paymentStatus: order.paymentStatus });
    }
  }, [open, order, reset]);

  const onSubmit = async (data: OrderStatusFormValues) => {
    if (!order) return;

    try {
      await updateOrderStatus({
        id: order.id,
        dto: {
          status: data.status as OrderStatus,
          paymentStatus: data.paymentStatus as PaymentStatus,
        },
      }).unwrap();

      toast.success(t("adminOrders.updateSuccess"));
      onOpenChange(false);
    } catch {
      toast.error(t("adminOrders.updateError"));
    }
  };

  if (!open || !order) return null;

  const createdAtLabel = new Date(order.createdAt).toLocaleDateString(
    isArabic ? "ar-EG" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  const finalPrice = order.discount
    ? order.totalPrice - (order.discount / 100) * order.totalPrice
    : order.totalPrice;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-card/95 border border-border/80 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 flex items-center justify-between border-b border-border/40 shrink-0 bg-card/50 backdrop-blur-sm">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t("adminOrders.modalTitle")}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-mono font-bold text-foreground">
                #{order.id}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {createdAtLabel}
              </span>
            </p>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
              <Clock className="h-3.5 w-3.5 shrink-0 text-yellow-300 inline" />
              <span>
                {t("adminOrders.lastModifiedBy")}:{" "}
                <strong className="  font-semibold">
                  {order.lastModifiedBy}
                </strong>
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => !isUpdating && onOpenChange(false)}
            disabled={isUpdating}
            className="p-2 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-90 border border-border/45 cursor-pointer outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="order-status-form"
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted/40 border border-border/50">
            <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground font-medium">
                {t("adminOrders.address")}
              </p>
              <p className="text-sm font-bold text-foreground">
                {order.userAddress}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground">
                {t("adminOrders.items")}
              </h4>
            </div>
            <div className="rounded-2xl border border-border/60 overflow-hidden">
              {order.orderDetails.map((item, idx) => (
                <div
                  key={item.id}
                  className={
                    "flex items-center justify-between px-4 py-3 text-sm" +
                    (idx !== order.orderDetails.length - 1
                      ? " border-b border-border/40"
                      : "")
                  }
                >
                  <span className="font-semibold text-foreground">
                    {t("adminOrders.defaultMealName", { id: item.productId })}
                  </span>
                  <span className="text-muted-foreground font-medium">
                    {item.quantity} × {item.price.toLocaleString()}{" "}
                    {t("adminOrders.currency")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 text-center">
              <p className="text-[11px] text-muted-foreground font-medium mb-1">
                {t("adminOrders.totalPrice")}
              </p>
              <p className="text-sm font-black text-foreground font-mono">
                {order.totalPrice.toLocaleString()} {t("adminOrders.currency")}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 text-center">
              <p className="text-[11px] text-muted-foreground font-medium mb-1 flex items-center justify-center gap-1">
                <Percent className="h-3 w-3" />
                {t("adminOrders.discount")}
              </p>
              <p className="text-sm font-black text-foreground font-mono">
                {order.discount ? `${order.discount}%` : "—"}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/30 text-center col-span-2 sm:col-span-1">
              <p className="text-[11px] text-muted-foreground font-medium mb-1">
                {t("adminOrders.finalPrice")}
              </p>
              <p className="text-sm font-black text-primary font-mono">
                {finalPrice.toLocaleString()} {t("adminOrders.currency")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-foreground">
              {t("adminOrders.editStatus")}
            </h4>
            <OrderStatusForm
              form={formValues}
              errors={translatedErrors}
              onChange={(key, value) =>
                setValue(key, value as never, { shouldValidate: true })
              }
            />
          </div>
          <UserInfoCard appUserId={order.appUserId} />
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-card/80 backdrop-blur-md shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted text-foreground font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer outline-none"
          >
            {t("adminOrders.close")}
          </button>

          <button
            type="submit"
            form="order-status-form"
            disabled={isUpdating}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer outline-none"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{t("adminOrders.updateBtn")}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
