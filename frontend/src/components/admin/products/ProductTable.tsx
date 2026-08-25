import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SquarePen,
  Trash,
  Clock,
  Utensils,
  UtensilsCrossed,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GetAllProductDto } from "@/types/types";

interface ProductTableProps {
  products: GetAllProductDto[];
  onEdit: (product: GetAllProductDto) => void;
  onDelete: (id: number) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      onDelete(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  if (!products.length) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-card">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4 border border-border shadow-inner">
          <UtensilsCrossed className="h-8 w-8 sm:h-10 sm:w-10 stroke-[1.5]" />
        </div>
        <p className="text-base sm:text-lg font-semibold text-foreground">
          {t("adminProducts.emptyState")}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-3 p-4 md:hidden bg-card/50">
        {products.map((p) => {
          const displayName = isArabic
            ? p.nameAr || p.name
            : p.name || p.nameAr;
          const displayDescription = isArabic
            ? p.descriptionAr || p.description
            : p.description || p.descriptionAr;

          return (
            <div
              key={p.id}
              className="flex flex-col gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden",
                        );
                      }}
                    />
                  ) : null}
                  <div
                    className={cn(
                      "flex items-center justify-center text-muted-foreground/60",
                      p.imageUrl && "hidden",
                    )}
                  >
                    <Utensils className="h-6 w-6" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-foreground text-base truncate">
                      {displayName}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1.5 font-bold py-0.5 px-2.5 rounded-full border-0 text-[11px] shrink-0 ${
                        p.isAvailable
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          p.isAvailable ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                      {p.isAvailable
                        ? t("adminProducts.table.available")
                        : t("adminProducts.table.unavailable")}
                    </span>
                  </div>

                  {displayDescription && (
                    <p className="text-xs text-muted-foreground line-clamp-1 overflow-x-clip wrap-break-word w-35 mt-0.5">
                      {displayDescription}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-mono font-black text-sm text-foreground">
                      {p.price.toLocaleString()}{" "}
                      {t("adminProducts.table.currency")}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md font-medium">
                      <Clock className="h-3 w-3 text-primary" />
                      {p.preparingTime} {t("adminProducts.table.min")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => onEdit(p)}
                  className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold gap-1.5 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <SquarePen className="h-4 w-4" />
                  <span>{t("adminProducts.table.edit")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(p.id)}
                  className="h-9 px-3 rounded-xl border border-border bg-background text-rose-600 hover:bg-rose-500/10 hover:border-rose-500/30 text-xs font-semibold gap-1.5 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <Trash className="h-4 w-4" />
                  <span>{t("adminProducts.table.delete")}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View: Native Table */}
      <div className="hidden md:block w-full h-full bg-card">
        <table className="w-full h-full border-collapse">
          <thead className="bg-muted/80 sticky top-0 z-10 backdrop-blur-md border-b border-border">
            <tr className="hover:bg-transparent border-none">
              <th className="w-[100px] py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminProducts.table.image")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminProducts.table.product")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminProducts.table.price")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminProducts.table.prepTime")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminProducts.table.status")}
              </th>
              <th className="text-center w-[160px] py-4 px-6 font-bold text-sm text-foreground">
                {t("adminProducts.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {products.map((p) => {
              const displayName = isArabic
                ? p.nameAr || p.name
                : p.name || p.nameAr;
              const displayDescription = isArabic
                ? p.descriptionAr || p.description
                : p.description || p.descriptionAr;

              return (
                <tr
                  key={p.id}
                  className="group hover:bg-muted/30 transition-all duration-200 border-border/40"
                >
                  <td className="py-4 px-6 text-start align-middle">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden border border-border bg-muted shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm flex items-center justify-center">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={displayName}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove(
                              "hidden",
                            );
                          }}
                        />
                      ) : null}

                      <div
                        className={cn(
                          "flex items-center justify-center text-muted-foreground/60",
                          p.imageUrl && "hidden",
                        )}
                      >
                        <Utensils className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-start align-middle">
                    <div className="flex flex-col gap-1 max-w-md">
                      <span className="font-bold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">
                        {displayName}
                      </span>
                      {displayDescription && (
                        <span
                          className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed line-clamp-2 max-w-50 wrap-break-word overflow-clip"
                          title={displayDescription}
                        >
                          {displayDescription}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                    <div className="flex items-baseline gap-1.5 font-mono font-extrabold text-base sm:text-lg text-foreground">
                      <span>{p.price.toLocaleString()}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground font-sans font-medium">
                        {t("adminProducts.table.currency")}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted px-3.5 py-1.5 rounded-xl border border-border/60 font-semibold">
                      <Clock className="h-4 w-4 text-primary stroke-[2]" />
                      <span>
                        {p.preparingTime} {t("adminProducts.table.min")}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-2 font-bold py-1.5 px-3.5 rounded-full border-0 text-xs sm:text-sm shadow-sm ${
                        p.isAvailable
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          p.isAvailable
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-rose-500"
                        }`}
                      />
                      {p.isAvailable
                        ? t("adminProducts.table.available")
                        : t("adminProducts.table.unavailable")}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center align-middle whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(p)}
                        className="h-10 w-10 rounded-xl border border-border bg-background hover:bg-blue-500/10 hover:border-blue-500/40 hover:text-blue-600 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center outline-none"
                        title={t("adminProducts.form.editTitle")}
                      >
                        <SquarePen className="h-5 w-5 stroke-[1.8]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(p.id)}
                        className="h-10 w-10 rounded-xl border border-border bg-background hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-600 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center outline-none"
                        title={t("adminProducts.deleteDialog.confirmBtn")}
                      >
                        <Trash className="h-5 w-5 stroke-[1.8]" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {deleteTargetId !== null && (
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setDeleteTargetId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border/80 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200"
          >
            {/* أيقونة التحذير */}
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            {/* النصوص */}
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-foreground">
                {t("adminProducts.deleteDialog.title")}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("adminProducts.deleteDialog.description")}
              </p>
            </div>

            {/* أزرار التحكم */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-3.5 px-4 rounded-2xl border border-border bg-muted/50 hover:bg-muted text-foreground font-bold text-sm transition-all cursor-pointer active:scale-95 outline-none"
              >
                {t("adminProducts.form.cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-lg shadow-rose-600/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 outline-none"
              >
                <span>{t("adminProducts.deleteDialog.confirmBtn")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
