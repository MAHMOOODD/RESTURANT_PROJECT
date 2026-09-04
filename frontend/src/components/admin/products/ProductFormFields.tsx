import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GetCategoriesDto } from "@/types/types";

export interface FormState {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: string;
  preparingTime: string;
  categoryId: string;
  isAvailable: boolean;
  image: File | null;
}

interface ProductFormFieldsProps {
  form: FormState;
  errors: Partial<Record<keyof FormState, string>>;
  categories: GetCategoriesDto[];
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export function ProductFormFields({
  form,
  errors,
  categories,
  onChange,
}: ProductFormFieldsProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) =>
      isArabic
        ? (a.nameAr || "").localeCompare(b.nameAr || "", "ar")
        : (a.name || "").localeCompare(b.name || "", "en")
    );
  }, [categories, isArabic]);

  const selectedCategoryObj = useMemo(
    () => categories.find((c) => String(c.id) === form.categoryId),
    [categories, form.categoryId]
  );

  return (
    <div className="grid gap-5 py-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-1.5 text-start">
          <label
            htmlFor="nameAr"
            className="text-xs font-bold text-foreground/90 select-none"
          >
            {t("adminProducts.form.nameAr")}
          </label>
          <input
            id="nameAr"
            type="text"
            dir="rtl"
            value={form.nameAr}
            onChange={(e) => onChange("nameAr", e.target.value)}
            className={cn(
              "w-full h-11 px-3.5 bg-card/60 backdrop-blur-md border border-border rounded-xl font-medium text-sm text-foreground placeholder:text-muted-foreground shadow-inner transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
              errors.nameAr &&
                "border-rose-500 focus:border-rose-500 focus:ring-rose-500/50"
            )}
          />
          {errors.nameAr && (
            <p className="text-xs font-semibold text-rose-500 mt-0.5">
              {errors.nameAr}
            </p>
          )}
        </div>

        <div className="grid gap-1.5 text-start">
          <label
            htmlFor="name"
            className="text-xs font-bold text-foreground/90 select-none"
          >
            {t("adminProducts.form.nameEn")}
          </label>
          <input
            id="name"
            type="text"
            dir="ltr"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={cn(
              "w-full h-11 px-3.5 bg-card/60 backdrop-blur-md border border-border rounded-xl font-medium text-sm text-foreground placeholder:text-muted-foreground shadow-inner transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
              errors.name &&
                "border-rose-500 focus:border-rose-500 focus:ring-rose-500/50"
            )}
          />
          {errors.name && (
            <p className="text-xs font-semibold text-rose-500 mt-0.5">
              {errors.name}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-1.5 text-start">
          <label
            htmlFor="descriptionAr"
            className="text-xs font-bold text-foreground/90 select-none"
          >
            {t("adminProducts.form.descAr")}
          </label>
          <textarea
            id="descriptionAr"
            dir="rtl"
            rows={3}
            value={form.descriptionAr}
            onChange={(e) => onChange("descriptionAr", e.target.value)}
            className={cn(
              "w-full p-3.5 bg-card/60 backdrop-blur-md border border-border rounded-xl font-medium text-sm text-foreground placeholder:text-muted-foreground shadow-inner transition-all duration-200 outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary/50",
              errors.descriptionAr &&
                "border-rose-500 focus:border-rose-500 focus:ring-rose-500/50"
            )}
          />
          {errors.descriptionAr && (
            <p className="text-xs font-semibold text-rose-500 mt-0.5">
              {errors.descriptionAr}
            </p>
          )}
        </div>

        <div className="grid gap-1.5 text-start">
          <label
            htmlFor="description"
            className="text-xs font-bold text-foreground/90 select-none"
          >
            {t("adminProducts.form.descEn")}
          </label>
          <textarea
            id="description"
            dir="ltr"
            rows={3}
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            className={cn(
              "w-full p-3.5 bg-card/60 backdrop-blur-md border border-border rounded-xl font-medium text-sm text-foreground placeholder:text-muted-foreground shadow-inner transition-all duration-200 outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary/50",
              errors.description &&
                "border-rose-500 focus:border-rose-500 focus:ring-rose-500/50"
            )}
          />
          {errors.description && (
            <p className="text-xs font-semibold text-rose-500 mt-0.5">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="grid gap-1.5 text-start">
          <label
            htmlFor="price"
            className="text-xs font-bold text-foreground/90 select-none"
          >
            {t("adminProducts.form.price")}
          </label>
          <input
            id="price"
            type="number"
            min={0}
            step="0.01"
            dir="ltr"
            value={form.price}
            onChange={(e) => onChange("price", e.target.value)}
            className={cn(
              "w-full h-11 px-3.5 bg-card/60 backdrop-blur-md border border-border rounded-xl font-mono font-bold text-sm text-foreground placeholder:text-muted-foreground shadow-inner transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
              errors.price &&
                "border-rose-500 focus:border-rose-500 focus:ring-rose-500/50"
            )}
          />
          {errors.price && (
            <p className="text-xs font-semibold text-rose-500 mt-0.5">
              {errors.price}
            </p>
          )}
        </div>

        <div className="grid gap-1.5 text-start">
          <label
            htmlFor="preparingTime"
            className="text-xs font-bold text-foreground/90 select-none"
          >
            {t("adminProducts.form.prepTime")}
          </label>
          <input
            id="preparingTime"
            type="number"
            min={0}
            dir="ltr"
            value={form.preparingTime}
            onChange={(e) => onChange("preparingTime", e.target.value)}
            className={cn(
              "w-full h-11 px-3.5 bg-card/60 backdrop-blur-md border border-border rounded-xl font-mono font-bold text-sm text-foreground placeholder:text-muted-foreground shadow-inner transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
              errors.preparingTime &&
                "border-rose-500 focus:border-rose-500 focus:ring-rose-500/50"
            )}
          />
          {errors.preparingTime && (
            <p className="text-xs font-semibold text-rose-500 mt-0.5">
              {errors.preparingTime}
            </p>
          )}
        </div>

        <div className="grid gap-1.5 text-start relative">
          <label className="text-xs font-bold text-foreground/90 select-none">
            {t("adminProducts.form.category")}
          </label>

          {/* Custom Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setIsCategoryOpen((prev) => !prev)}
            className={cn(
              "w-full h-11 px-3.5 bg-card/60 backdrop-blur-md border border-border rounded-xl font-medium text-sm text-foreground flex items-center justify-between shadow-sm transition-all duration-200 cursor-pointer outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
              errors.categoryId &&
                "border-rose-500 focus:border-rose-500 focus:ring-rose-500/50"
            )}
          >
            <span className="truncate">
              {selectedCategoryObj
                ? isArabic
                  ? selectedCategoryObj.nameAr
                  : selectedCategoryObj.name
                : t("adminProducts.form.selectCategory", "اختر التصنيف")}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                isCategoryOpen && "rotate-180"
              )}
            />
          </button>

          {/* Backdrop for closing dropdown */}
          {isCategoryOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsCategoryOpen(false)}
            />
          )}

          {/* Dropdown Menu Container */}
          {isCategoryOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#13111a]/95 border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl overflow-hidden p-1.5 animate-in fade-in-50 zoom-in-95 backdrop-blur-xl max-h-56 overflow-y-auto">
              {sortedCategories.map((c) => {
                const categoryName = isArabic ? c.nameAr : c.name;
                const isSelected = String(c.id) === form.categoryId;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onChange("categoryId", String(c.id));
                      setIsCategoryOpen(false);
                    }}
                    className={cn(
                      "w-full text-start px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer my-0.5",
                      isSelected
                        ? "bg-[#ff2a4b] text-white font-bold shadow-md shadow-[#ff2a4b]/20"
                        : "text-foreground hover:bg-[rgba(255,42,75,0.18)] hover:text-[#ff5270]"
                    )}
                  >
                    {categoryName}
                  </button>
                );
              })}
            </div>
          )}

          {errors.categoryId && (
            <p className="text-xs font-semibold text-rose-500 mt-0.5">
              {errors.categoryId}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/50 hover:border-border/80 transition-all duration-200 mt-2">
        <div className="space-y-0.5 text-start">
          <label
            htmlFor="isAvailable"
            className="text-sm font-bold text-foreground cursor-pointer select-none"
          >
            {t("adminProducts.form.isAvailableLabel") || "متوفر حالياً"}
          </label>
          <p className="text-xs text-muted-foreground font-medium">
            {t("adminProducts.form.isAvailableSub") ||
              "تحديد ما إذا كان هذا المنتج متاحاً للطلب أم لا"}
          </p>
        </div>

        <button
          id="isAvailable"
          type="button"
          role="switch"
          aria-checked={form.isAvailable}
          onClick={() => onChange("isAvailable", !form.isAvailable)}
          className={cn(
            "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50",
            form.isAvailable
              ? "bg-primary shadow-sm shadow-primary/30"
              : "bg-muted-foreground/30"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out",
              form.isAvailable
                ? "translate-x-5 rtl:-translate-x-5"
                : "translate-x-0"
            )}
          />
        </button>
      </div>
    </div>
  );
}