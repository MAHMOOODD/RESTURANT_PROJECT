// src/components/cashier/CashierOrderStatusBadge.tsx
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { OrderStatus, PaymentStatus } from "@/types/types";

const STATUS_STYLES: Record<number, string> = {
  [OrderStatus.pending]: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  [OrderStatus.processing]: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  [OrderStatus.shipped]: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  [OrderStatus.delivered]: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  [OrderStatus.cancelled]: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const STATUS_LABEL_KEYS: Record<number, string> = {
  [OrderStatus.pending]: "adminOrders.statusTypes.pending",
  [OrderStatus.processing]: "adminOrders.statusTypes.processing",
  [OrderStatus.shipped]: "adminOrders.statusTypes.shipped",
  [OrderStatus.delivered]: "adminOrders.statusTypes.delivered",
  [OrderStatus.cancelled]: "adminOrders.statusTypes.cancelled",
};

const PAYMENT_STYLES: Record<number, string> = {
  [PaymentStatus.pending]: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  [PaymentStatus.completed]: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  [PaymentStatus.failed]: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  [PaymentStatus.refunded]: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

const PAYMENT_LABEL_KEYS: Record<number, string> = {
  [PaymentStatus.pending]: "adminOrders.paymentTypes.pending",
  [PaymentStatus.completed]: "adminOrders.paymentTypes.completed",
  [PaymentStatus.failed]: "adminOrders.paymentTypes.failed",
  [PaymentStatus.refunded]: "adminOrders.paymentTypes.refunded",
};

interface Props {
  kind: "status" | "payment";
  value: number;
}

function CashierOrderStatusBadgeComponent({ kind, value }: Props) {
  const { t } = useTranslation();
  const styles = kind === "status" ? STATUS_STYLES : PAYMENT_STYLES;
  const labelKey = kind === "status" ? STATUS_LABEL_KEYS[value] : PAYMENT_LABEL_KEYS[value];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border",
        styles[value] ?? "bg-muted text-muted-foreground border-border",
      )}
    >
      {labelKey ? t(labelKey) : "—"}
    </span>
  );
}

export const CashierOrderStatusBadge = memo(CashierOrderStatusBadgeComponent);