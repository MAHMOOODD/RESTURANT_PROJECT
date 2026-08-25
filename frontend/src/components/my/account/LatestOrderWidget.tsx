import {
  ShoppingCart,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  ChefHat,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetMyOrdersQuery } from "@/store/features/orderApi";
import { OrderStatus } from "@/types/types";

export function LatestOrderWidget() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const navigate = useNavigate();

  const { data: myOrders = [] } = useGetMyOrdersQuery();
  const OrdersLength = myOrders.length;
  const latestOrder = OrdersLength > 0 ? myOrders[OrdersLength - 1] : null;

  return (
    <div className="rounded-[2.5rem] border border-border/80 bg-card p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground">
              {t("account.latestOrderTitle", "أحدث طلباتك")}
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              {t("account.latestOrderSub", "تابع حالة طلبك الأخير لحظة بلحظة")}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            navigate("/orders");

            scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-5 py-2.5 cursor-pointer rounded-2xl bg-muted/60 hover:bg-primary/10 text-foreground hover:text-primary font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border border-border/50"
        >
          <span>{t("account.viewAllOrders", "عرض كل الطلبات")}</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {latestOrder ? (
        <div
          onClick={() => {
            navigate(`/orders/${latestOrder.id}`);
            scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group p-6 rounded-3xl bg-muted/30 hover:bg-primary/5 border border-border/60 hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-primary">
                #{latestOrder.id}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(latestOrder.createdAt).toLocaleDateString(
                  isAr ? "ar-EG" : "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {latestOrder.orderDetails?.length || 0}{" "}
              {t("account.mealsCount", "وجبات")} •{" "}
              <span className="text-primary">
                {latestOrder.totalPrice} {t("orderDetails.currency", "ج.م")}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border ${
                latestOrder.status === OrderStatus.delivered
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : latestOrder.status === OrderStatus.cancelled
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              }`}
            >
              {latestOrder.status === OrderStatus.delivered && (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {latestOrder.status === OrderStatus.pending && (
                <Clock className="w-4 h-4" />
              )}
              {latestOrder.status === OrderStatus.processing && (
                <ChefHat className="w-4 h-4" />
              )}
              {latestOrder.status === OrderStatus.shipped && (
                <Truck className="w-4 h-4" />
              )}
              {latestOrder.status === OrderStatus.cancelled && (
                <XCircle className="w-4 h-4" />
              )}
              <span>
                {latestOrder.status === OrderStatus.delivered
                  ? t("orderDetails.statuses.delivered")
                  : latestOrder.status === OrderStatus.processing
                    ? t("orderDetails.statuses.processing")
                    : latestOrder.status === OrderStatus.shipped
                      ? t("orderDetails.statuses.shipped")
                      : latestOrder.status === OrderStatus.cancelled
                        ? t("orderDetails.statuses.cancelled")
                        : t("orderDetails.statuses.pending")}
              </span>
            </span>
            <div className="w-10 h-10 rounded-xl bg-background border border-border/80 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-sm">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center rounded-3xl bg-muted/20 border border-dashed border-border">
          <p className="text-sm font-bold text-muted-foreground">
            {t("account.noOrdersYet", "لا توجد طلبات سابقة حتى الآن")}
          </p>
        </div>
      )}
    </div>
  );
}
