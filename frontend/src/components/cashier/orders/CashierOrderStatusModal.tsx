// src/components/cashier/orders/CashierOrderStatusModal.tsx
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateOrderStatusMutation } from "@/store/features/orderApi";
import { useGetUserByIdQuery } from "@/store/features/User/Auth";
import type { GetOrderDto, OrderStatus, PaymentStatus } from "@/types/types";
import { OrderStatusForm } from "@/components/admin/orders/Orderstatusform";
import {
  createOrderStatusSchema,
  type OrderStatusFormValues,
} from "@/components/admin/orders/Orderstatusschema";

interface Props {
  order: GetOrderDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CashierOrderStatusModal({ order, open, onOpenChange }: Props) {
  const { t } = useTranslation();

  const isGuest = !order?.appUserId || !!order?.guestName;
  const { data: customer, isFetching: isLoadingCustomer } = useGetUserByIdQuery(
    order?.appUserId ?? "",
    { skip: isGuest || !order?.appUserId },
  );

  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const orderStatusSchema = useMemo(() => createOrderStatusSchema(), []);

  const {
    setValue,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderStatusFormValues>({
    resolver: zodResolver(orderStatusSchema),
    defaultValues: { status: order?.status ?? 0, paymentStatus: order?.paymentStatus ?? 0 },
  });

  const watchedStatus = useWatch({ control, name: "status" });
  const watchedPaymentStatus = useWatch({ control, name: "paymentStatus" });
  const formValues: OrderStatusFormValues = { status: watchedStatus, paymentStatus: watchedPaymentStatus };

  const translatedErrors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(errors).map(([key, val]) => [key, val?.message ? t(val.message as string) : undefined]),
      ),
    [errors, t],
  );

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
        dto: { status: data.status as OrderStatus, paymentStatus: data.paymentStatus as PaymentStatus },
      }).unwrap();
      toast.success(t("adminOrders.updateSuccess"));
      onOpenChange(false);
    } catch {
      toast.error(t("adminOrders.updateError"));
    }
  };

  if (!open || !order) return null;

  const customerLabel = isGuest
    ? order.guestName || t("adminOrders.guestCustomer")
    : isLoadingCustomer
      ? t("adminOrders.loadingUser")
      : customer?.fullName || customer?.userName || t("adminOrders.userDetails.notProvided");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-card/95 border border-border/80 shadow-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-border/40 shrink-0">
          <div className="min-w-0">
            <p className="text-sm font-mono font-black text-foreground">#{order.id}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{customerLabel}</p>
            <p className="text-xs font-bold text-primary mt-1">
              {order.totalPrice.toLocaleString()} {t("adminOrders.currency")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => !isUpdating && onOpenChange(false)}
            disabled={isUpdating}
            className="p-2 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} id="cashier-status-form" className="flex-1 overflow-y-auto px-5 py-5">
          <OrderStatusForm
            form={formValues}
            errors={translatedErrors}
            onChange={(key, value) => setValue(key, value as never, { shouldValidate: true })}
          />
        </form>

        <div className="px-5 py-4 border-t border-border/40 shrink-0 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
            className="px-4 py-2.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted text-foreground font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {t("adminOrders.close")}
          </button>
          <button
            type="submit"
            form="cashier-status-form"
            disabled={isUpdating}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : t("adminOrders.updateBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}