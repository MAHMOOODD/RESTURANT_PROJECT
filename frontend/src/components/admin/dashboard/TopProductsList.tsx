// src/components/admin/dashboard/TopProductsList.tsx
import { useTranslation } from "react-i18next";
import { Trophy, Package } from "lucide-react";
import type { TopProductDto } from "@/types/types";

interface TopProductsListProps {
  products: TopProductDto[];
}

const RANK_CLASSES = [
  "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  "bg-slate-400/15 text-slate-500 dark:text-slate-300 border-slate-400/30",
  "bg-orange-700/15 text-orange-600 dark:text-orange-400 border-orange-700/30",
];

export function TopProductsList({ products }: TopProductsListProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const maxSellCount = Math.max(...products.map((p) => p.sellCount), 1);

  return (
    <div className="rounded-3xl border border-border bg-card shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <Trophy className="h-5 w-5 text-primary" />
        <h3 className="text-base sm:text-lg font-black text-foreground">
          {t("adminDashboard.charts.topProductsTitle")}
        </h3>
      </div>

      {products.length === 0 ? (
        <div className="py-10 flex flex-col items-center justify-center text-center gap-2">
          <Package className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground font-medium">
            {t("adminDashboard.charts.noProductsYet")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, idx) => {
            const name = isArabic && product.nameAr ? product.nameAr : product.name;
            const barWidth = Math.max(6, (product.sellCount / maxSellCount) * 100);
            const rankClass = RANK_CLASSES[idx] ?? "bg-muted text-muted-foreground border-border";

            return (
              <div key={product.id} className="flex items-center gap-3">
                <span
                  className={`h-8 w-8 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${rankClass}`}
                >
                  {idx + 1}
                </span>

                <span className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center border border-border shrink-0 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-5 w-5 text-muted-foreground" />
                  )}
                </span>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-foreground truncate">{name}</span>
                    <span className="text-xs font-black text-primary shrink-0">
                      {product.sellCount.toLocaleString()} {t("adminDashboard.charts.sold")}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
