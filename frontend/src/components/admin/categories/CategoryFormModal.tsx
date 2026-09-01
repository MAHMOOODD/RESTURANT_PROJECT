import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { X, Loader2 } from "lucide-react";
import type { GetCategoriesDto } from "@/types/types";
import {
  addCategorySchema,
  editCategorySchema,
  type AddCategoryFormValues,
  type EditCategoryFormValues,
} from "./categoryValidation";
import { CategoryImageUpload } from "./CategoryImageUpload";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddCategoryFormValues | EditCategoryFormValues) => Promise<void>;
  categoryToEdit?: GetCategoriesDto | null;
  isLoading: boolean;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categoryToEdit,
  isLoading,
}) => {
  const { t, i18n } = useTranslation();
  const isEditing = Boolean(categoryToEdit);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddCategoryFormValues | EditCategoryFormValues>({
    resolver: zodResolver(isEditing ? editCategorySchema : addCategorySchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        reset({
          name: categoryToEdit.name || "",
          nameAr: categoryToEdit.nameAr || "",
          imageUrl: undefined, // Reset to undefined to allow re-uploading the image
        });
      } else {
        reset({
          name: "",
          nameAr: "",
          imageUrl: undefined,
        });
      }
    }
  }, [isOpen, categoryToEdit, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-[#0e0d12] border border-[#1e1c26] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1b1924]">
          <div>
            <h3 className="text-xl font-bold text-white">
              {isEditing ? t("categories.editCategory") : t("categories.addCategory")}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {isEditing ? t("categories.editSubtitle") : t("categories.addSubtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-[#171520] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto">
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <CategoryImageUpload
                currentImageUrl={categoryToEdit?.imageUrl}
                onChange={field.onChange}
                errorKey={errors.imageUrl?.message as string | undefined}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                {t("categories.categoryNameAr")}
              </label>
              <input
                {...register("nameAr")}
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-[#08070a] border border-[#1f1d2b] text-white focus:outline-none focus:border-red-600/60 text-sm transition-colors"
              />
              {errors.nameAr?.message && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.nameAr.message as string)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                {t("categories.categoryNameEn")}
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-[#08070a] border border-[#1f1d2b] text-white focus:outline-none focus:border-red-600/60 text-sm transition-colors"
              />
              {errors.name?.message && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.name.message as string)}
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#1b1924]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-gray-300 bg-[#121019] hover:bg-[#1a1824] transition-colors text-sm font-medium border border-[#211f2e]"
            >
              {t("categories.cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#7a0c0c] hover:bg-[#911010] disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-red-900/20"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{t("categories.saveChanges")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};