import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SquarePen,
  Trash,
  Utensils,
  UtensilsCrossed,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GetCategoriesDto } from "@/types/types";
import { createPortal } from "react-dom";
interface CategoryTableProps {
  categories: GetCategoriesDto[];
  onEdit: (category: GetCategoriesDto) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      onDelete(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  if (!categories.length) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-card">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4 border border-border shadow-inner">
          <UtensilsCrossed className="h-8 w-8 sm:h-10 sm:w-10 stroke-[1.5]" />
        </div>
        <p className="text-base sm:text-lg font-semibold text-foreground">
          {t("categories.noCategories", "لا توجد أقسام")}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-3 p-4 md:hidden bg-card/50">
        {categories.map((cat) => {
          const displayName = isArabic
            ? cat.nameAr || cat.name
            : cat.name || cat.nameAr;

          return (
            <div
              key={cat.id}
              className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
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
                      cat.imageUrl && "hidden",
                    )}
                  >
                    <Utensils className="h-6 w-6" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-foreground text-base truncate">
                    {displayName}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(cat)}
                  className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold gap-1.5 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <SquarePen className="h-4 w-4" />
                  <span>{t("categories.editCategory", "تعديل القسم")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(cat.id)}
                  className="h-9 px-3 rounded-xl border border-border bg-background text-rose-600 hover:bg-rose-500/10 hover:border-rose-500/30 text-xs font-semibold gap-1.5 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <Trash className="h-4 w-4" />
                  <span>{t("categories.deleteCategory", "حذف القسم")}</span>
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
                {t("categories.image", "الصورة")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("categories.category", "القسم")}
              </th>
              <th className="text-center w-[160px] py-4 px-6 font-bold text-sm text-foreground">
                {t("categories.actions", "الإجراءات")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {categories.map((cat) => {
              const displayName = isArabic
                ? cat.nameAr || cat.name
                : cat.name || cat.nameAr;

              return (
                <tr
                  key={cat.id}
                  className="group hover:bg-muted/30 transition-all duration-200 border-border/40"
                >
                  <td className="py-4 px-6 text-start align-middle">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden border border-border bg-muted shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm flex items-center justify-center">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
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
                          cat.imageUrl && "hidden",
                        )}
                      >
                        <Utensils className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-start align-middle">
                    <span className="font-bold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">
                      {displayName}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center align-middle whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(cat)}
                        className="h-10 w-10 rounded-xl border border-border bg-background hover:bg-blue-500/10 hover:border-blue-500/40 hover:text-blue-600 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center outline-none"
                        title={t("categories.editCategory", "تعديل القسم")}
                      >
                        <SquarePen className="h-5 w-5 stroke-[1.8]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(cat.id)}
                        className="h-10 w-10 rounded-xl border border-border bg-background hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-600 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center outline-none"
                        title={t("categories.actions", "الإجراءات")}
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

      {/* Delete Confirmation Modal */}
{deleteTargetId !== null &&
  createPortal(
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setDeleteTargetId(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border/80 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200"
      >
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black text-foreground">
            {t("categories.confirmDeleteTitle", "تأكيد حذف القسم")}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t(
              "categories.confirmDeleteMessage",
              "هل أنت متأكد من حذف هذا القسم؟ لا يمكن التراجع عن هذا الإجراء."
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setDeleteTargetId(null)}
            className="flex-1 py-3.5 px-4 rounded-2xl border border-border bg-muted/50 hover:bg-muted text-foreground font-bold text-sm transition-all cursor-pointer active:scale-95 outline-none"
          >
            {t("categories.cancel", "إلغاء")}
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-lg shadow-rose-600/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 outline-none disabled:opacity-50"
          >
            <span>{t("categories.delete", "حذف")}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}
    </>
  );
};
