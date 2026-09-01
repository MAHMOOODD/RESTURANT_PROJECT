import { useTranslation } from "react-i18next";
import {
  Info,
  Calendar,
  MapPin,
  User as UserIcon,
  PackageOpen,
} from "lucide-react";
import type { GetOrderDto } from "@/types/types";
import { OrderStatus, PaymentStatus } from "@/types/types";
import { useGetUserByIdQuery } from "@/store/features/User/Auth";
import { STATUS_OPTIONS, PAYMENT_OPTIONS } from "./Orderstatusschema";

interface OrderTableProps {
  orders: GetOrderDto[];
  onViewDetails: (order: GetOrderDto) => void;
}

function StatusBadge({ status }: { status: number }) {
  const { t } = useTranslation();
  const option = STATUS_OPTIONS.find((s) => s.value === status);

  const colorClasses =
    status === OrderStatus.delivered
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      : status === OrderStatus.cancelled
        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
        : status === OrderStatus.shipped
          ? "bg-violet-500/15 text-violet-600 dark:text-violet-400"
          : status === OrderStatus.processing
            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
            : "bg-amber-500/15 text-amber-600 dark:text-amber-400";

  const dotClasses =
    status === OrderStatus.delivered
      ? "bg-emerald-500"
      : status === OrderStatus.cancelled
        ? "bg-rose-500"
        : status === OrderStatus.shipped
          ? "bg-violet-500"
          : status === OrderStatus.processing
            ? "bg-blue-500"
            : "bg-amber-500";

  return (
    <span
      className={`inline-flex items-center gap-2 font-bold py-1.5 px-3.5 rounded-full border-0 text-xs sm:text-sm shadow-sm ${colorClasses}`}
    >
      <span className={`h-2 w-2 rounded-full shrink-0 ${dotClasses}`} />
      {option ? t(option.labelKey) : t("adminOrders.statusTypes.pending")}
    </span>
  );
}

function PaymentBadge({ status }: { status: number }) {
  const { t } = useTranslation();
  const option = PAYMENT_OPTIONS.find((p) => p.value === status);

  const colorClasses =
    status === PaymentStatus.completed
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      : status === PaymentStatus.failed
        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
        : status === PaymentStatus.refunded
          ? "bg-slate-500/15 text-slate-600 dark:text-slate-400"
          : "bg-amber-500/15 text-amber-600 dark:text-amber-400";

  return (
    <span
      className={`inline-flex items-center font-bold py-1 px-3 rounded-full border-0 text-[11px] sm:text-xs ${colorClasses}`}
    >
      {option ? t(option.labelKey) : t("adminOrders.paymentTypes.pending")}
    </span>
  );
}

function CustomerCell({ appUserId }: { appUserId: string }) {
  const { t } = useTranslation();
  const { data: user, isLoading } = useGetUserByIdQuery(appUserId, {
    skip: !appUserId,
  });

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center border border-border shrink-0 overflow-hidden">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.userName || "User"}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserIcon className="h-4 w-4 text-muted-foreground" />
        )}
      </span>
      <span className="font-semibold text-foreground text-sm truncate">
        {isLoading
          ? t("adminOrders.loadingUser")
          : user?.userName ||
            user?.fullName ||
            t("adminOrders.userDetails.notProvided")}
      </span>
    </div>
  );
}

export function OrderTable({ orders, onViewDetails }: OrderTableProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  if (!orders.length) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-card">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4 border border-border shadow-inner">
          <PackageOpen className="h-8 w-8 sm:h-10 sm:w-10 stroke-[1.5]" />
        </div>
        <p className="text-base sm:text-lg font-semibold text-foreground">
          {t("adminOrders.noOrders")}
        </p>
      </div>
    );
  }

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <>
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-3 p-4 md:hidden bg-card/50">
        {orders.map((o) => (
          <div
            key={o.id}
            onClick={() => onViewDetails(o)}
            className="flex flex-col gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 space-y-1.5">
                <span className="font-mono font-black text-sm text-foreground block">
                  #{o.id}
                </span>
                <CustomerCell appUserId={o.appUserId} />
              </div>
              <StatusBadge status={o.status} />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{o?.lastModifiedBy ?? "_"}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{o.userAddress}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-foreground">
                  {o.totalPrice.toLocaleString()} {t("adminOrders.currency")}
                </span>
                <PaymentBadge status={o.paymentStatus} />
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(o);
                }}
                className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold gap-1.5 flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <Info className="h-4 w-4" />
                <span>{t("adminOrders.details")}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Native Table */}
      <div className="hidden md:block w-full h-full bg-card">
        <table className="w-full h-full border-collapse">
          <thead className="bg-muted/80 sticky top-0 z-10 backdrop-blur-md border-b border-border">
            <tr className="hover:bg-transparent border-none">
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminOrders.orderId")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminOrders.customer")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminOrders.lastModifiedBy", "آخر تعديل بواسطة")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminOrders.address")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminOrders.totalPrice")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminOrders.status")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminOrders.paymentStatus")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminOrders.createdAt")}
              </th>
              <th className="py-4 px-6 text-center font-bold text-sm text-foreground">
                {t("adminOrders.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                onClick={() => onViewDetails(o)}
                className="group hover:bg-muted/30 transition-all duration-200 border-border/40 cursor-pointer"
              >
                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <span className="font-mono font-black text-sm text-foreground">
                    #{o.id}
                  </span>
                </td>

                <td className="py-4 px-6 text-start align-middle max-w-[220px]">
                  <CustomerCell appUserId={o.appUserId} />
                </td>
                <td className="py-4 px-6 text-start align-middle max-w-[220px]">
                  <span className="text-sm text-muted-foreground truncate block"
                  title={o?.lastModifiedBy ?? "_"}
                  > 
                  {o?.lastModifiedBy ?? "_"}
                  </span>
                </td>

                <td className="py-4 px-6 text-start align-middle max-w-xs">
                  <span
                    className="text-sm text-muted-foreground truncate block"
                    title={o.userAddress}
                  >
                    {o.userAddress}
                  </span>
                </td>

                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <div className="flex items-baseline gap-1.5 font-mono font-extrabold text-base text-foreground">
                    <span>{o.totalPrice.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground font-sans font-medium">
                      {t("adminOrders.currency")}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <StatusBadge status={o.status} />
                </td>

                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <PaymentBadge status={o.paymentStatus} />
                </td>

                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted px-3.5 py-1.5 rounded-xl border border-border/60 font-semibold">
                    <Calendar className="h-4 w-4 text-primary stroke-[2]" />
                    <span>{formatDate(o.createdAt)}</span>
                  </div>
                </td>

                <td className="py-4 px-6 text-center align-middle whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(o);
                    }}
                    className="h-10 w-10 rounded-xl border border-border bg-background hover:bg-blue-500/10 hover:border-blue-500/40 hover:text-blue-600 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center outline-none"
                    title={t("adminOrders.details")}
                  >
                    <Info className="h-5 w-5 stroke-[1.8]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
