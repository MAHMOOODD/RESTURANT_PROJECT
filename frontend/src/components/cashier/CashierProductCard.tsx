// src/components/cashier/CashierProductCard.tsx
import { memo } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GetAllProductDto } from "@/types/types";

interface Props {
  product: GetAllProductDto;
  onAdd: (product: GetAllProductDto) => void;
}

function CashierProductCardComponent({ product, onAdd }: Props) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      disabled={!product.isAvailable}
      title={!product.isAvailable ? t("cashierPos.productUnavailable") : undefined}
      className="text-start rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-md transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed group"
    >
      <div className="aspect-square w-full relative overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={isArabic ? product.nameAr : product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-1.5 end-1.5 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
          <Plus className="w-4 h-4" />
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-xs sm:text-sm font-bold text-foreground truncate">
          {isArabic ? product.nameAr : product.name}
        </p>
        <p className="text-xs font-black text-primary mt-1">
          {product.price.toLocaleString()} {t("cashierPos.currency")}
        </p>
      </div>
    </button>
  );
}

// منع إعادة الرندر إلا لو المنتج نفسه أو الـ handler اتغيروا فعلاً
export const CashierProductCard = memo(CashierProductCardComponent);