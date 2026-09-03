// src/components/cashier/CashierCategoryCard.tsx
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { GetCategoriesDto } from "@/types/types";

interface Props {
  category: GetCategoriesDto;
  active?: boolean;
  onClick: () => void;
}

function CashierCategoryCardComponent({ category, active, onClick }: Props) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const label = isArabic ? category.nameAr : category.name;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-2xl overflow-hidden aspect-square group border-2 transition-all duration-200 active:scale-95 shrink-0 w-28 sm:w-32",
        active ? "border-primary shadow-lg shadow-primary/20" : "border-border hover:border-primary/50",
      )}
    >
      <img
        src={category.imageUrl}
        alt={label}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <span className="absolute bottom-2 inset-x-1 text-white text-xs sm:text-sm font-bold text-center truncate px-1">
        {label}
      </span>
    </button>
  );
}

export const CashierCategoryCard = memo(CashierCategoryCardComponent);