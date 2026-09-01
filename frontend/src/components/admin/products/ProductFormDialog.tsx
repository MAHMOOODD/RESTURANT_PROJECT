import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddProductMutation,
  useEditProductMutation,
} from "@/store/features/productApi";
import type {
  GetAllProductDto,
  GetCategoriesDto,
  AddProductDto,
  EditProductDto,
} from "@/types/types";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { ProductFormFields, type FormState } from "./ProductFormFields";
import { ProductImageUpload } from "./ProductImageUpload";
import { createProductSchema, type ProductFormValues } from "./productSchema";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: GetAllProductDto | null;
  categories: GetCategoriesDto[];
  refetchProducts: () => void; // Add this line to accept the refetch function
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  refetchProducts,
}: ProductFormDialogProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const isEditMode = !!product;

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [editProduct, { isLoading: isEditing }] = useEditProductMutation();
  const isSubmitting = isAdding || isEditing;

  // الـ Schema ثابتة الآن ولا تعتمد على دالة t مباشرة
  const productSchema = useMemo(() => createProductSchema(), []);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      price: "",
      preparingTime: "",
      categoryId: "",
      isAvailable: true,
      image: null,
    },
  });

  const watchedImage = useWatch({ control, name: "image" });
  const watchedValues = useWatch({ control });

  const formValues: FormState = {
    name: watchedValues.name ?? "",
    nameAr: watchedValues.nameAr ?? "",
    description: watchedValues.description ?? "",
    descriptionAr: watchedValues.descriptionAr ?? "",
    price: watchedValues.price ?? "",
    preparingTime: watchedValues.preparingTime ?? "",
    categoryId: watchedValues.categoryId ?? "",
    isAvailable: watchedValues.isAvailable ?? true,
    image: watchedValues.image ?? null,
  };

  // ترجمة الأخطاء القادمة من Zod ديناميكياً
  const translatedErrors = useMemo(() => {
    return Object.fromEntries(
      Object.entries(errors).map(([key, val]) => [
        key,
        val?.message ? t(val.message as string) : undefined,
      ])
    );
  }, [errors, t]);

  // إعادة ضبط النموذج عند فتح المودال أو تغيير المنتج
  useEffect(() => {
    if (open) {
      reset({
        name: product?.name ?? "",
        nameAr: product?.nameAr ?? "",
        description: product?.description ?? "",
        descriptionAr: product?.descriptionAr ?? "",
        price: product?.price !== undefined ? String(product.price) : "",
        preparingTime:
          product?.preparingTime !== undefined
            ? String(product.preparingTime)
            : "",
        categoryId: product?.categoryId ? String(product.categoryId) : "",
        isAvailable: product?.isAvailable ?? true,
        image: null,
      });
    }
  }, [open, product, reset]);

  // حساب رابط المعاينة تلقائياً
  const previewUrl = useMemo(() => {
    if (watchedImage instanceof File) {
      return URL.createObjectURL(watchedImage);
    }
    if (watchedImage === "") {
      return "";
    }
    return isEditMode && product ? product.imageUrl || "" : "";
  }, [watchedImage, isEditMode, product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setValue("image", file, { shouldValidate: true });
    }
  };

  const removeImage = () => {
    setValue("image", "" as unknown as null, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!isEditMode && !data.image) {
      setError("image", {
        type: "required",
        message: "adminProducts.form.errors.imageRequired",
      });
      return;
    }

    try {
      const isImageExplicitlyRemoved = (data.image as unknown) === "";

      if (isEditMode && product) {
        const dto: EditProductDto = {
          name: data.name.trim(),
          nameAr: data.nameAr.trim(),
          description: data.description.trim(),
          descriptionAr: data.descriptionAr.trim(),
          price: Number(data.price),
          preparingTime: Number(data.preparingTime),
          categoryId: Number(data.categoryId),
          isAvailable: data.isAvailable,
          imageUrl:
            data.image instanceof File
              ? data.image
              : isImageExplicitlyRemoved
              ? null
              : undefined,
        };
        await editProduct({ id: product.id, dto }).unwrap();
        toast.success(
          t(
            "adminProducts.form.saveSuccess",
            isArabic ? "تم تعديل المنتج بنجاح" : "Product updated successfully"
          )
        );
        refetchProducts(); // Call the refetch function after editing
      } else {
        const dto: AddProductDto = {
          name: data.name.trim(),
          nameAr: data.nameAr.trim(),
          description: data.description.trim(),
          descriptionAr: data.descriptionAr.trim(),
          price: Number(data.price),
          preparingTime: Number(data.preparingTime),
          categoryId: Number(data.categoryId),
          isAvailable: data.isAvailable,
          imageUrl: data.image as File,
        };
        await addProduct(dto).unwrap();
        toast.success(
          t(
            "adminProducts.form.addSuccess",
            isArabic ? "تم إضافة المنتج بنجاح" : "Product added successfully"
          )
        );
        refetchProducts(); // Call the refetch function after adding
      }
      onOpenChange(false);
    } catch (err) {
      const apiError = err as {
        data?: {
          message?: string;
          error?: { errors?: Record<string, string[]> };
        };
      };
      const serverMessage =
        apiError?.data?.message ??
        Object.values(apiError?.data?.error?.errors ?? {})[0]?.[0];
      toast.error(
        serverMessage ??
          t(
            "adminProducts.form.errors.saveFailed",
            isArabic ? "حدث خطأ أثناء حفظ البيانات" : "Failed to save data"
          )
      );
    }
  };

  if (!open) return null;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-card/95 border border-border/80 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 flex items-center justify-between border-b border-border/40 shrink-0 bg-card/50 backdrop-blur-sm">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {isEditMode
                ? t("adminProducts.form.editTitle", "تعديل منتج")
                : t("adminProducts.form.addTitle", "إضافة منتج جديد")}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isEditMode
                ? t("adminProducts.form.editSubtitle", "تعديل تفاصيل وعناصر المنتج الحالي")
                : t("adminProducts.form.addSubtitle", "قم بإدخال بيانات المنتج الجديد لإضافته للقائمة")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => !isSubmitting && onOpenChange(false)}
            disabled={isSubmitting}
            className="p-2 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-90 border border-border/45 cursor-pointer outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="product-form"
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          <ProductImageUpload
            previewUrl={previewUrl}
            error={translatedErrors.image}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
          />

          <ProductFormFields
            form={formValues}
            errors={translatedErrors}
            categories={categories}
            onChange={(key, value) =>
              setValue(key, value as never, { shouldValidate: true })
            }
          />
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-card/80 backdrop-blur-md shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted text-foreground font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer outline-none"
          >
            {t("adminProducts.form.cancel", "إلغاء")}
          </button>

          <button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer outline-none"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>
                {isEditMode
                  ? t("adminProducts.form.save", "حفظ التغييرات")
                  : t("adminProducts.form.add", "إضافة المنتج")}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}