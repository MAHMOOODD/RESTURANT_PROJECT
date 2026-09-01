// src/pages/AdminDashboardPage.tsx
import { useTranslation } from "react-i18next";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useGetDashboardOverviewQuery } from "@/store/features/dashboardApi";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { RevenueTrendChart } from "@/components/admin/dashboard/RevenueTrendChart";
import { OrdersStatusChart } from "@/components/admin/dashboard/OrdersStatusChart";
import { TopProductsList } from "@/components/admin/dashboard/TopProductsList";

const TREND_DAYS = 14;

export default function AdminDashboardPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const { data, isLoading, isError } = useGetDashboardOverviewQuery({
    trendDays: TREND_DAYS,
  });

  const formatCurrency = (value: number) =>
    `${value.toLocaleString(isArabic ? "ar-EG" : "en-US", {
      maximumFractionDigits: 0,
    })} ${t("adminDashboard.currency")}`;

  const formatNumber = (value: number) =>
    value.toLocaleString(isArabic ? "ar-EG" : "en-US");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-center px-6">
        <AlertCircle className="h-10 w-10 text-rose-500" />
        <p className="text-base font-bold text-foreground">
          {t("adminDashboard.loadError")}
        </p>
      </div>
    );
  }

  const { revenue, orders, users, topProducts, revenueTrend } = data;

  return (
    <div className="w-full flex flex-col space-y-6 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          {t("adminDashboard.title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-medium">
          {t("adminDashboard.subtitle")}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={DollarSign}
          label={t("adminDashboard.cards.revenue")}
          value={formatCurrency(revenue.totalRevenue)}
          accentClass="bg-blue-500/10 text-blue-500"
          details={[
            {
              label: t("adminDashboard.cards.netRevenue"),
              value: formatCurrency(revenue.netRevenue),
              colorClass: "text-emerald-500",
              dotClass: "bg-emerald-500",
            },
            {
              label: t("adminDashboard.cards.averageOrderValue"),
              value: formatCurrency(revenue.averageOrderValue),
              colorClass: "text-blue-500",
              dotClass: "bg-blue-500",
            },
          ]}
        />

        <StatCard
          icon={TrendingUp}
          label={t("adminDashboard.cards.profit")}
          value={formatCurrency(revenue.netRevenue)}
          accentClass="bg-emerald-500/10 text-emerald-500"
          details={[
            {
              label: t("adminDashboard.cards.grossRevenue"),
              value: formatCurrency(revenue.totalRevenue),
              colorClass: "text-blue-500",
              dotClass: "bg-blue-500",
            },
            {
              label: t("adminDashboard.cards.discountsGiven"),
              value: formatCurrency(revenue.totalRevenue - revenue.netRevenue),
              colorClass: "text-rose-500",
              dotClass: "bg-rose-500",
            },
          ]}
        />

        <StatCard
          icon={ShoppingBag}
          label={t("adminDashboard.cards.orders")}
          value={formatNumber(orders.totalOrders)}
          accentClass="bg-amber-500/10 text-amber-500"
          details={[
            {
              label: t("adminDashboard.orderStatus.pending"),
              value: formatNumber(orders.pending),
              dotClass: "bg-amber-500",
            },
            {
              label: t("adminDashboard.orderStatus.processing"),
              value: formatNumber(orders.processing),
              dotClass: "bg-blue-500",
            },
            {
              label: t("adminDashboard.orderStatus.shipped"),
              value: formatNumber(orders.shipped),
              dotClass: "bg-purple-500",
            },
            {
              label: t("adminDashboard.orderStatus.delivered"),
              value: formatNumber(orders.delivered),
              colorClass: "text-emerald-500",
              dotClass: "bg-emerald-500",
            },
            {
              label: t("adminDashboard.orderStatus.cancelled"),
              value: formatNumber(orders.cancelled),
              colorClass: "text-rose-500",
              dotClass: "bg-rose-500",
            },
          ]}
        />

        <StatCard
          icon={Users}
          label={t("adminDashboard.cards.users")}
          value={formatNumber(users.totalUsers)}
          accentClass="bg-purple-500/10 text-purple-500"
          details={[
            {
              label: t("adminDashboard.cards.admins"),
              value: formatNumber(users.admins),
              colorClass: "text-rose-500",
              dotClass: "bg-rose-500",
            },
            {
              label: t("adminDashboard.cards.managers"),
              value: formatNumber(users.managers),
              colorClass: "text-amber-500",
              dotClass: "bg-amber-500",
            },
            {
              label: t("adminDashboard.cards.regularUsers"),
              value: formatNumber(users.regularUsers),
              colorClass: "text-blue-500",
              dotClass: "bg-blue-500",
            },
          ]}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <div className="lg:col-span-2">
          <RevenueTrendChart data={revenueTrend} />
        </div>
        <OrdersStatusChart orders={orders} />
      </div>

      {/* Top Products */}
      <TopProductsList products={topProducts} />
    </div>
  );
}