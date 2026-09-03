// src/components/admin/dashboard/RevenueTrendChart.tsx
import { useTranslation } from "react-i18next";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RevenuePointDto } from "@/types/types";
import { TrendingUp } from "lucide-react";

interface RevenueTrendChartProps {
  data: RevenuePointDto[];
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
    });

  const chartData = data.map((point) => ({
    ...point,
    label: formatDate(point.date),
  }));

  const hasRevenue = data.some((point) => point.revenue > 0);

  return (
    <div className="rounded-3xl border border-border bg-card shadow-sm p-5 sm:p-6 h-full">
      <div className="flex items-center gap-2.5 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-base sm:text-lg font-black text-foreground">
          {t("adminDashboard.charts.revenueTrendTitle")}
        </h3>
      </div>

      {hasRevenue ? (
        <div className="h-64 sm:h-80" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "1rem",
                  fontSize: "12px",
                  direction: isArabic ? "rtl" : "ltr",
                }}
                labelStyle={{
                  color: "var(--foreground)",
                  fontWeight: 700,
                  marginBottom: 4,
                }}
                formatter={(value) => {
                  const numValue =
                    typeof value === "number" ? value : Number(value) || 0;
                  return [
                    `${numValue.toLocaleString()} ${t("adminDashboard.currency")}`,
                    t("adminDashboard.charts.revenueLabel"),
                  ];
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 sm:h-80 flex items-center justify-center text-sm text-muted-foreground font-medium">
          {t("adminDashboard.charts.noRevenueYet")}
        </div>
      )}
    </div>
  );
}
