import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ChefHat,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Receipt,
  Package,
} from "lucide-react";

// API Redux Hooks
import { useGetMyOrdersQuery } from "@/store/features/orderApi";

import type { GetOrderDto } from "@/types/types";
import { OrderStatus, PaymentStatus } from "@/types/types";

// Sub-components
import OrderTimeline from "@/components/my/order-details/OrderTimeline";
import OrderItemsList from "@/components/my/order-details/OrderItemsList";
import { useEffect } from "react";

export default function OrderDetails() {
  useEffect(() => {
    scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const orderId = Number(id);

  const {
    data: myOrders = [],
    isLoading: isOrdersLoading,
    isError,
  } = useGetMyOrdersQuery();

  const order: GetOrderDto | undefined = myOrders.find((o) => o.id === orderId);

  // (OrderStatus Enum)
  const getStatusConfig = (status: number) => {
    switch (status) {
      case OrderStatus.pending:
        return {
          label: t("orderDetails.statuses.pending"),
          icon: Clock,
          color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
          step: 1,
        };
      case OrderStatus.processing:
        return {
          label: t("orderDetails.statuses.processing"),
          icon: ChefHat,
          color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
          step: 2,
        };
      case OrderStatus.shipped:
        return {
          label: t("orderDetails.statuses.shipped"),
          icon: Truck,
          color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
          step: 3,
        };
      case OrderStatus.delivered:
        return {
          label: t("orderDetails.statuses.delivered"),
          icon: CheckCircle2,
          color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          step: 4,
        };
      case OrderStatus.cancelled:
        return {
          label: t("orderDetails.statuses.cancelled"),
          icon: XCircle,
          color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
          step: 0,
        };
      default:
        return {
          label: t("orderDetails.statuses.unknown"),
          icon: Clock,
          color: "text-muted-foreground bg-muted",
          step: 0,
        };
    }
  };

  // (PaymentStatus Enum)
  const getPaymentStatusConfig = (paymentStatus: number) => {
    switch (paymentStatus) {
      case PaymentStatus.pending:
        return {
          label: t("orderDetails.payment.pending"),
          color: "text-amber-500",
        };
      case PaymentStatus.completed:
        return {
          label: t("orderDetails.payment.completed"),
          color: "text-emerald-500",
        };
      case PaymentStatus.failed:
        return {
          label: t("orderDetails.payment.failed"),
          color: "text-rose-500",
        };
      case PaymentStatus.refunded:
        return {
          label: t("orderDetails.payment.refunded"),
          color: "text-purple-500",
        };
      default:
        return {
          label: t("orderDetails.payment.unknown"),
          color: "text-muted-foreground",
        };
    }
  };

  if (isOrdersLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <p className="text-xl font-bold text-muted-foreground animate-pulse">
          {t("orderDetails.loading")}
        </p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-foreground mb-4">
          {t("orderDetails.notFoundTitle")}
        </h2>
        <p className="text-base text-muted-foreground mb-8">
          {t("orderDetails.notFoundDesc")}
        </p>
        <Link
          to="/profile"
          className="px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-xl hover:bg-primary/90 transition-all"
        >
          {t("orderDetails.backToProfile")}
        </Link>
      </div>
    );
  }

  const currentStatus = getStatusConfig(order.status);
  const StatusIcon = currentStatus.icon;
  const paymentInfo = getPaymentStatusConfig(order.paymentStatus);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Receipt className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-3">
              <span>{t("orderDetails.title")}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(order.createdAt).toLocaleDateString(
                  isAr ? "ar-EG" : "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </span>
            </p>
          </div>
        </div>

        <Link
          to="/orders"
          className="flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-primary transition-colors bg-card/60 px-6 py-3 rounded-2xl border border-border/60 shadow-sm"
        >
          {isAr ? (
            <ArrowRight className="w-5 h-5" />
          ) : (
            <ArrowLeft className="w-5 h-5" />
          )}
          <span>{t("orderDetails.backToOrders")}</span>
        </Link>
      </div>

      <div className="space-y-8">
        <div className="p-8 rounded-3xl bg-card/80 backdrop-blur-xl border border-border/80 shadow-md">
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-bold text-muted-foreground">
              {t("orderDetails.currentStatus")}
            </span>
            <div
              className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border text-sm font-black ${currentStatus.color}`}
            >
              <StatusIcon className="w-5 h-5" />
              <span>{currentStatus.label}</span>
            </div>
          </div>

          <OrderTimeline status={order.status} step={currentStatus.step} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-7 rounded-3xl bg-card/80 border border-border/80 shadow-md flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-bold block mb-1">
                {t("orderDetails.deliveryAddress")}
              </span>
              <p className="text-base font-black text-foreground">
                {order.userAddress}
              </p>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-card/80 border border-border/80 shadow-md flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-bold block mb-1">
                {t("orderDetails.paymentStatus")}
              </span>
              <p className={`text-base font-black ${paymentInfo.color}`}>
                {paymentInfo.label}
              </p>
            </div>
          </div>
        </div>

        <OrderItemsList order={order} />
      </div>
    </main>
  );
}