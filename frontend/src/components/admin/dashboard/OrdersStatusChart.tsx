// src/components/admin/dashboard/OrdersStatusChart.tsx
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import type { OrdersSummaryDto } from "@/types/types";

interface OrdersStatusChartProps {
  orders: OrdersSummaryDto;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#f43f5e",
};

export function OrdersStatusChart({ orders }: OrdersStatusChartProps) {
  const { t } = useTranslation();

  const data = [
    { key: "pending", value: orders.pending, label: t("adminDashboard.orderStatus.pending") },
    { key: "processing", value: orders.processing, label: t("adminDashboard.orderStatus.processing") },
    { key: "shipped", value: orders.shipped, label: t("adminDashboard.orderStatus.shipped") },
    { key: "delivered", value: orders.delivered, label: t("adminDashboard.orderStatus.delivered") },
    { key: "cancelled", value: orders.cancelled, label: t("adminDashboard.orderStatus.cancelled") },
  ].filter((d) => d.value > 0);

  const hasData = data.length > 0;

  return (
    <div className="rounded-3xl border border-border bg-card shadow-sm p-5 sm:p-6 h-full">
      <div className="flex items-center gap-2.5 mb-4">
        <PieChartIcon className="h-5 w-5 text-primary" />
        <h3 className="text-base sm:text-lg font-black text-foreground">
          {t("adminDashboard.charts.ordersStatusTitle")}
        </h3>
      </div>

      {hasData ? (
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "1rem",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={44}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", fontWeight: 700 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 sm:h-80 flex items-center justify-center text-sm text-muted-foreground font-medium">
          {t("adminDashboard.charts.noOrdersYet")}
        </div>
      )}
    </div>
  );
}
