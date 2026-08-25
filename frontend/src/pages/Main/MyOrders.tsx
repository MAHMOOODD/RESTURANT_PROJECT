import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ChefHat,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Receipt,
  Sparkles,
  Search,
  
} from "lucide-react";

import { useGetMyOrdersQuery } from "@/store/features/orderApi";
import { OrderStatus } from "@/types/types";

export default function MyOrders() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const { data: orders = [], isLoading } = useGetMyOrdersQuery();
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusConfig = (status: number) => {
    switch (status) {
      case OrderStatus.pending:
        return { label: t("orderDetails.statuses.pending"), icon: Clock, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
      case OrderStatus.processing:
        return { label: t("orderDetails.statuses.processing"), icon: ChefHat, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
      case OrderStatus.shipped:
        return { label: t("orderDetails.statuses.shipped"), icon: Truck, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" };
      case OrderStatus.delivered:
        return { label: t("orderDetails.statuses.delivered"), icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
      case OrderStatus.cancelled:
        return { label: t("orderDetails.statuses.cancelled"), icon: XCircle, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
      default:
        return { label: t("orderDetails.statuses.unknown"), icon: Clock, color: "text-muted-foreground bg-muted" };
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = order.id.toString().includes(searchQuery) || order.userAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <p className="text-xl font-bold text-muted-foreground animate-pulse">{t("orderDetails.loading", "جاري تحميل الطلبات...")}</p>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-12 animate-in fade-in duration-500 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-linear-to-r from-primary/10 via-card to-card p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -z-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-3">
              <Sparkles className="w-4 h-4" />
              <span>{t("myOrders.badge", "سجل الطلبات")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {t("myOrders.title", "طلباتي السابقة")}
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              {t("myOrders.subtitle", "تتبع حالة طلباتك الحالية والسابقة بكل سهولة")}
            </p>
          </div>

          <Link
            to="/profile"
            className="flex items-center gap-2.5 text-sm font-bold text-muted-foreground hover:text-primary transition-colors bg-card/80 px-6 py-3 rounded-2xl border border-border/60 shadow-sm"
          >
            {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            <span>{t("myOrders.backToProfile", "حسابي الشخصي")}</span>
          </Link>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card/60 p-4 rounded-3xl border border-border/80 shadow-md backdrop-blur-xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("myOrders.searchPlaceholder", "ابحث برقم الطلب أو العنوان...")}
            className="w-full pl-5 pr-12 py-3 rounded-2xl bg-muted/40 border border-border/60 text-foreground text-sm font-medium outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
              statusFilter === "all" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {t("myOrders.filters.all", "الكل")}
          </button>
          <button
            onClick={() => setStatusFilter(OrderStatus.pending)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
              statusFilter === OrderStatus.pending ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25" : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {t("orderDetails.statuses.pending", "قيد الانتظار")}
          </button>
          <button
            onClick={() => setStatusFilter(OrderStatus.processing)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
              statusFilter === OrderStatus.processing ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {t("orderDetails.statuses.processing", "قيد التحضير")}
          </button>
          <button
            onClick={() => setStatusFilter(OrderStatus.delivered)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
              statusFilter === OrderStatus.delivered ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {t("orderDetails.statuses.delivered", "تم التوصيل")}
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="group block p-6 sm:p-8 rounded-[2rem] bg-card border border-border/80 shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black group-hover:scale-105 transition-transform">
                      <Receipt className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-foreground">#{order.id}</span>
                        <span className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 border ${statusConfig.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span>{statusConfig.label}</span>
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-semibold mt-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground font-bold block">{t("myOrders.totalPrice", "الإجمالي")}</span>
                      <span className="text-xl font-black text-primary">{order.totalPrice} {t("orderDetails.currency", "ج.م")}</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-muted/60 border border-border/60 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                      {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 bg-card rounded-[2.5rem] border border-border">
            <Package className="w-20 h-20 text-muted-foreground/40 mb-4" />
            <h3 className="text-2xl font-black text-foreground mb-2">{t("myOrders.emptyTitle", "لا توجد طلبات مطابقة")}</h3>
            <p className="text-sm text-muted-foreground">{t("myOrders.emptyDesc", "لم تقم بإنشاء أي طلبات تتطابق مع بحثك الحالي")}</p>
          </div>
        )}
      </div>
    </main>
  );
}