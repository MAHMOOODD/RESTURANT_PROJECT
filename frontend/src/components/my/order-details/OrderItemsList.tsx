import { Package, Ticket } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GetDetailsDto, GetOrderDto } from "@/types/types";

interface OrderItemsListProps {
  order: GetOrderDto;
}

export default function OrderItemsList({ order }: OrderItemsListProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="p-8 rounded-3xl bg-card/80 border border-border/80 shadow-md">
      <h2 className="text-xl font-black text-foreground mb-6">
        {t("orderDetails.orderedMeals")}
      </h2>
      <div className="divide-y divide-border/60">
        {order.orderDetails?.map((item: GetDetailsDto) => {
          const name = isAr ? item.productNameAr : item.productName;

          return (
            <div
              key={item.id}
              className="py-5 flex items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                {item.productImageUrl ? (
                  <img
                    src={item.productImageUrl}
                    alt={name || ""}
                    className="w-16 h-16 rounded-2xl object-cover border border-border/60 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                    <Package className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h3 className="text-base font-black text-foreground">
                    {name ||
                      t("orderDetails.defaultMealName", { id: item.productId })}
                  </h3>
                  <p className="text-xs text-muted-foreground font-semibold mt-1">
                    {item.price} {t("orderDetails.currency")} × {item.quantity}
                  </p>
                </div>
              </div>
              <span className="text-lg font-black text-foreground">
                {item.price * item.quantity} {t("orderDetails.currency")}
              </span>
            </div>
          );
        })}
      </div>

      {/* Financial Summary */}
      <div className="border-t border-border/80 pt-6 mt-6 space-y-3 text-sm font-bold">
        {order.discount && order.discount > 0 ? (
          <div className="flex justify-between items-center text-emerald-500 text-base">
            <span className="flex items-center gap-2">
              <Ticket className="w-5 h-5" /> {t("orderDetails.discount")}
            </span>
            <span>{order.discount}%</span>
          </div>
        ) : null}

        <div className="flex justify-between items-center text-base font-black text-foreground border-t border-border/60 pt-4">
          <span className="text-lg">{t("orderDetails.totalPaid")}</span>
          <span className="text-2xl text-primary font-black">
            {order.totalPrice} {t("orderDetails.currency")}
          </span>
        </div>
      </div>
    </div>
  );
}
