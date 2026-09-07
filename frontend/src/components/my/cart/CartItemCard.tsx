import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Plus, Minus, Clock, Flame, Loader2 } from "lucide-react";
import type { GetCartDto } from "@/types/types";

const DEFAULT_FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop",
];

interface CartItemCardProps {
  item: GetCartDto;
  onQuantityChange: (id: number, currentQty: number, delta: number) => void;
  onDelete: (id: number) => void;
  isEditing: boolean;
  isDeleting: boolean;
}

export function CartItemCard({
  item,
  onQuantityChange,
  onDelete,
  isEditing,
  isDeleting,
}: CartItemCardProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const [imgError, setImgError] = useState(false);

  const productName = isAr
    ? item.productNameAr || item.productName
    : item.productName || item.productNameAr;

  const unitPrice = item.productPrice ?? 0;
  const itemTotalPrice = unitPrice * item.quantity;

  const fallbackImg =
    DEFAULT_FOOD_IMAGES[item.productId % DEFAULT_FOOD_IMAGES.length];
  const finalImage =
    imgError || !item.productImageUrl ? fallbackImg : item.productImageUrl;

  return (
    <div className="group relative p-5 sm:p-6 rounded-3xl bg-card/60 backdrop-blur-xl border-2 border-border/70 hover:border-primary/60 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-primary/5 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all pointer-events-none" />

      <div className="flex items-center gap-6 w-full sm:w-auto">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-muted/20 border-2 border-border/60 overflow-hidden shrink-0 relative group-hover:scale-105 transition-transform duration-500 shadow-inner">
          <img
            src={finalImage}
            alt={productName || t("cart.default_meal")}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          {item.productSellCount && item.productSellCount > 10 ? (
            <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-orange-500/90 text-white text-xs font-black backdrop-blur-md flex items-center gap-1 shadow-md">
              <Flame className="w-3.5 h-3.5 fill-white" />
              {t("cart.popular")}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg sm:text-xl font-black text-foreground group-hover:text-primary transition-colors">
              {productName || `${t("cart.meal_hash")} #${item.productId}`}
            </h3>
            {item.productPreparingTime ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-extrabold border border-amber-500/20">
                <Clock className="w-3.5 h-3.5" />
                {item.productPreparingTime} {t("cart.min")}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2.5 mt-3">
            <span className="text-base sm:text-lg font-black text-primary">
              {unitPrice} {t("cart.currency")}
            </span>
            <span className="text-xs font-bold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg">
              {t("cart.unit")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t-2 sm:border-t-0 border-border/40">
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-background/80 border-2 border-border/80 shadow-inner">
          <button
            onClick={() => onQuantityChange(item.id, item.quantity, -1)}
            disabled={item.quantity <= 1 || isEditing}
            className="w-10 h-10 rounded-xl bg-card text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground border border-border/60 disabled:opacity-30 transition-all cursor-pointer active:scale-90 shadow-sm"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="text-base sm:text-lg font-black text-foreground min-w-[28px] text-center">
            {item.quantity}
          </span>

          <button
            onClick={() => onQuantityChange(item.id, item.quantity, 1)}
            disabled={isEditing}
            className="w-10 h-10 rounded-xl bg-card text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground border border-border/60 disabled:opacity-30 transition-all cursor-pointer active:scale-90 shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="text-right min-w-[100px]">
          <span className="text-xs font-bold text-muted-foreground block">
            {t("cart.total")}
          </span>
          <span className="text-lg sm:text-xl font-black text-foreground block">
            {itemTotalPrice}{" "}
            <span className="text-xs font-bold text-muted-foreground">
              {t("cart.currency")}
            </span>
          </span>
        </div>

        <button
          onClick={() => onDelete(item.id)}
          disabled={isDeleting}
          className="p-3.5 rounded-2xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer disabled:opacity-30"
          title={t("cart.delete_item")}
        >
          {isDeleting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Trash2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}