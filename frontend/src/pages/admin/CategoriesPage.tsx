import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Loader2 } from "lucide-react";
import {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} from "@/store/features/productApi";
import type { GetCategoriesDto } from "@/types/types";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { CategoryFormModal } from "@/components/admin/categories/CategoryFormModal";
import type {
  AddCategoryFormValues,
  EditCategoryFormValues,
} from "@/components/admin/categories/categoryValidation";
import { toast } from "sonner";

export const CategoriesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    GetCategoriesDto | undefined
  >(undefined);

  const {
    data: categories = [],
    isLoading,
    refetch: refetchCategories,
  } = useGetAllCategoriesQuery();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [editCategory, { isLoading: isEditing }] = useEditCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const handleOpenAddModal = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: GetCategoriesDto) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(undefined);
  };

  const handleSubmit = async (
    data: AddCategoryFormValues | EditCategoryFormValues,
  ) => {
    try {
      if (editingCategory) {
        await editCategory({
          id: editingCategory.id,
          dto: {
            name: data.name,
            nameAr: data.nameAr,
            imageUrl: data.imageUrl,
          },
        }).unwrap();
        toast.success(t("categories.editSuccess"));
        refetchCategories();
      } else {
        await addCategory({
          name: data.name,
          nameAr: data.nameAr,
          imageUrl: data.imageUrl as File,
        }).unwrap();
        toast.success(t("categories.addSuccess"));
        refetchCategories();
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save category:", err);
      toast.error(t("categories.errors.saveError"));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success(t("categories.deleteSuccess"));
      refetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
      toast.error(t("categories.errors.deleteError"));
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();
    return categories.filter(
      (c : GetCategoriesDto) =>
        c.name.toLowerCase().includes(term) ||
        c.nameAr.toLowerCase().includes(term),
    );
  }, [categories, searchTerm]);

  return (
    <div
      className="w-full flex flex-col space-y-5 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300 pb-16"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {t("categories.title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            {t("categories.subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-2xl font-bold text-sm sm:text-base gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all cursor-pointer active:scale-95 shrink-0 hover:bg-primary/90 flex items-center justify-center outline-none"
        >
          <Plus className="h-5 w-5 stroke-[2.5]" />
          <span>{t("categories.addCategory")}</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("categories.searchPlaceholder")}
            className="w-full pl-10 rtl:pr-10 rtl:pl-3 bg-card backdrop-blur-md border border-border rounded-2xl h-11 focus:outline-none focus:ring-2 focus:ring-ring/50 shadow-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full flex flex-col border border-border rounded-3xl shadow-sm overflow-hidden bg-card backdrop-blur-md">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-base sm:text-lg font-medium">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <CategoryTable
              categories={filteredCategories}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        categoryToEdit={editingCategory}
        isLoading={isAdding || isEditing}
      />
    </div>
  );
};
