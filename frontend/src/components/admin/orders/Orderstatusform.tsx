import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { OrderStatus, PaymentStatus } from "@/types/types";
import { STATUS_OPTIONS, PAYMENT_OPTIONS, type OrderStatusFormValues } from "./Orderstatusschema";
import {
  Clock,
  ChefHat,
  Bike,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

interface OrderStatusFormProps {
  form: OrderStatusFormValues;
  errors: Partial<Record<keyof OrderStatusFormValues, string>>;
  onChange: <K extends keyof OrderStatusFormValues>(
    key: K,
    value: OrderStatusFormValues[K]
  ) => void;
}

// إعدادات الشكل (أيقونة + لون) لكل قيمة من قيم الـ Enum
const STATUS_VISUALS: Record<number, { icon: LucideIcon; activeColor: string }> = {
  [OrderStatus.pending]: {
    icon: Clock,
    activeColor: "bg-blue-500/20 border-blue-500 text-blue-500 shadow-blue-500/20",
  },
  [OrderStatus.processing]: {
    icon: ChefHat,
    activeColor: "bg-amber-500/20 border-amber-500 text-amber-500 shadow-amber-500/20",
  },
  [OrderStatus.shipped]: {
    icon: Bike,
    activeColor: "bg-purple-500/20 border-purple-500 text-purple-500 shadow-purple-500/20",
  },
  [OrderStatus.delivered]: {
    icon: CheckCircle2,
    activeColor: "bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-emerald-500/20",
  },
  [OrderStatus.cancelled]: {
    icon: XCircle,
    activeColor: "bg-rose-500/20 border-rose-500 text-rose-500 shadow-rose-500/20",
  },
};

const PAYMENT_VISUALS: Record<number, { icon: LucideIcon; activeColor: string }> = {
  [PaymentStatus.pending]: {
    icon: Clock,
    activeColor: "bg-amber-500/20 border-amber-500 text-amber-500 shadow-amber-500/20",
  },
  [PaymentStatus.completed]: {
    icon: CheckCircle2,
    activeColor: "bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-emerald-500/20",
  },
  [PaymentStatus.failed]: {
    icon: XCircle,
    activeColor: "bg-rose-500/20 border-rose-500 text-rose-500 shadow-rose-500/20",
  },
  [PaymentStatus.refunded]: {
    icon: RotateCcw,
    activeColor: "bg-sky-500/20 border-sky-500 text-sky-500 shadow-sky-500/20",
  },
};

export function OrderStatusForm({ form, errors, onChange }: OrderStatusFormProps) {
  const { t } = useTranslation();

  const showCancelWarning =
    form.status === OrderStatus.cancelled || form.paymentStatus === PaymentStatus.failed;

  return (
    <div className="grid gap-5">
      {/* Order Status Pills */}
      <div className="grid gap-2 text-start">
        <label className="text-xs font-bold text-foreground/90 select-none">
          {t("adminOrders.status")}
        </label>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          {STATUS_OPTIONS.map((s) => {
            const isActive = s.value === form.status;
            const visual = STATUS_VISUALS[s.value];
            const IconComponent = visual.icon;

            return (
              <button
                key={s.value}
                type="button"
                onClick={() => onChange("status", s.value)}
                className="flex flex-col items-center gap-2 group cursor-pointer outline-none"
              >
                <div
                  className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 border",
                    isActive
                      ? `${visual.activeColor} border-2 shadow-lg scale-105`
                      : "bg-card/40 border-border/40 text-muted-foreground/40 opacity-50 group-hover:opacity-80 group-hover:scale-105"
                  )}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] font-bold leading-tight text-center",
                    isActive ? "text-foreground" : "text-muted-foreground/50"
                  )}
                >
                  {t(s.labelKey)}
                </span>
              </button>
            );
          })}
        </div>

        {errors.status && (
          <p className="text-xs font-semibold text-rose-500 mt-0.5">{errors.status}</p>
        )}
      </div>

      {/* Payment Status Pills */}
      <div className="grid gap-2 text-start">
        <label className="text-xs font-bold text-foreground/90 select-none">
          {t("adminOrders.paymentStatus")}
        </label>

        <div className="grid grid-cols-4 gap-2.5">
          {PAYMENT_OPTIONS.map((p) => {
            const isActive = p.value === form.paymentStatus;
            const visual = PAYMENT_VISUALS[p.value];
            const IconComponent = visual.icon;

            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onChange("paymentStatus", p.value)}
                className="flex flex-col items-center gap-2 group cursor-pointer outline-none"
              >
                <div
                  className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 border",
                    isActive
                      ? `${visual.activeColor} border-2 shadow-lg scale-105`
                      : "bg-card/40 border-border/40 text-muted-foreground/40 opacity-50 group-hover:opacity-80 group-hover:scale-105"
                  )}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] font-bold leading-tight text-center",
                    isActive ? "text-foreground" : "text-muted-foreground/50"
                  )}
                >
                  {t(p.labelKey)}
                </span>
              </button>
            );
          })}
        </div>

        {errors.paymentStatus && (
          <p className="text-xs font-semibold text-rose-500 mt-0.5">{errors.paymentStatus}</p>
        )}
      </div>

      {showCancelWarning && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">
            {t("adminOrders.cancelWarning")}
          </p>
        </div>
      )}
    </div>
  );
}