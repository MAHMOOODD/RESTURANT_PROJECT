// src/components/cashier/CashierCartItemRow.tsx
import { memo } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CartLine } from "./CashierCartPanel";

interface Props {
  item: CartLine;
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
  onRemove: (productId: number) => void;
}

function CashierCartItemRowComponent({ item, onIncrement, onDecrement, onRemove }: Props) {
  const { t , i18n } = useTranslation();
 const isArabic = i18n.language.startsWith("ar");
  return (
    <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 border border-border/60">
      <img src={item.imageUrl} alt={item.name} loading="lazy" className="w-10 h-10 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground truncate">{isArabic ? item.nameAr : item.name}</p>
        <p className="text-[11px] text-muted-foreground">
          {item.price.toLocaleString()} {t("cashierPos.currency")}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onDecrement(item.productId)}
          className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 active:scale-90"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
        <button
          type="button"
          onClick={() => onIncrement(item.productId)}
          className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 active:scale-90"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <button type="button" onClick={() => onRemove(item.productId)} className="text-rose-500 hover:text-rose-600 shrink-0">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export const CashierCartItemRow = memo(CashierCartItemRowComponent);