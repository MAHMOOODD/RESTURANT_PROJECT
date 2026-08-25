import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: GetAllProductDto | null;
  categories: GetCategoriesDto[];
}

const EMPTY_FORM: FormState = {
  name: "",
  nameAr: "",
  description: "",
  descriptionAr: "",
  price: "",
  preparingTime: "",
  categoryId: "",
  isAvailable: true,
  image: null,
};


export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
}: ProductFormDialogProps) {
  const { t  } = useTranslation();
  const isEditMode = !!product;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [filePreview, setFilePreview] = useState<string>("");
  const [isImageRemoved, setIsImageRemoved] = useState<boolean>(false);

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [editProduct, { isLoading: isEditing }] = useEditProductMutation();
  const isSubmitting = isAdding || isEditing;

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevProduct, setPrevProduct] = useState(product);

  if (open !== prevOpen || product !== prevProduct) {
    setPrevOpen(open);
    setPrevProduct(product);
    if (open) {
      if (product) {
        setForm({
          name: product.name ?? "",
          nameAr: product.nameAr ?? "",
          description: product.description ?? "",
          descriptionAr: product.descriptionAr ?? "",
          price: product.price !== undefined ? String(product.price) : "",
          preparingTime:
            product.preparingTime !== undefined
              ? String(product.preparingTime)
              : "",
          categoryId: product.categoryId ? String(product.categoryId) : "",
          isAvailable: product.isAvailable ?? true,
          image: null,
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
      setFilePreview("");
      setIsImageRemoved(false);
    }
  }

  useEffect(() => {
    if (!form.image) return;
    const url = URL.createObjectURL(form.image);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const previewUrl = useMemo(() => {
    if (form.image) return filePreview;
    if (isImageRemoved) return "";
    return isEditMode && product ? product.imageUrl : "";
  }, [form.image, filePreview, isEditMode, product, isImageRemoved]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) next.name = t("adminProducts.form.errors.required");
    if (!form.nameAr.trim())
      next.nameAr = t("adminProducts.form.errors.required");
    if (!form.description.trim())
      next.description = t("adminProducts.form.errors.required");
    if (!form.descriptionAr.trim())
      next.descriptionAr = t("adminProducts.form.errors.required");

    const priceNum = Number(form.price);
    if (!form.price || Number.isNaN(priceNum) || priceNum <= 0)
      next.price = t("adminProducts.form.errors.invalidPrice");

    const prepNum = Number(form.preparingTime);
    if (form.preparingTime === "" || Number.isNaN(prepNum) || prepNum < 0)
      next.preparingTime = t("adminProducts.form.errors.invalidPrepTime");

    if (!form.categoryId)
      next.categoryId = t("adminProducts.form.errors.selectCategory");

    if (!isEditMode && !form.image) {
      next.image = t("adminProducts.form.errors.imageRequired");
    }
    

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setFilePreview(URL.createObjectURL(file));
      setIsImageRemoved(false);
    } else {
      setFilePreview("");
    }
    set("image", file);
  };

  const removeImage = () => {
    set("image", null);
    setFilePreview("");
    setIsImageRemoved(true);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (isEditMode && product) {
        const dto: EditProductDto = {
          name: form.name.trim(),
          nameAr: form.nameAr.trim(),
          description: form.description.trim(),
          descriptionAr: form.descriptionAr.trim(),
          price: Number(form.price),
          preparingTime: Number(form.preparingTime),
          categoryId: Number(form.categoryId),
          isAvailable: form.isAvailable,
          imageUrl: form.image ? form.image : isImageRemoved ? null : undefined,
        };
        await editProduct({ id: product.id, dto }).unwrap();
        toast.success(t("adminProducts.form.saveSuccess"));
      } else {
        const dto: AddProductDto = {
          name: form.name.trim(),
          nameAr: form.nameAr.trim(),
          description: form.description.trim(),
          descriptionAr: form.descriptionAr.trim(),
          price: Number(form.price),
          preparingTime: Number(form.preparingTime),
          categoryId: Number(form.categoryId),
          isAvailable: form.isAvailable,
          imageUrl: form.image as File,
        };
        await addProduct(dto).unwrap();
        toast.success(t("adminProducts.form.addSuccess"));
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
      toast.error(serverMessage ?? t("adminProducts.form.errors.saveFailed"));
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-card/95 border border-border/80 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Glow Effects (Trendy 2026 Accent) */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 flex items-center justify-between border-b border-border/40 shrink-0 bg-card/50 backdrop-blur-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isEditMode
                  ? t("adminProducts.form.editTitle")
                  : t("adminProducts.form.addTitle")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isEditMode
                ? t("adminProducts.form.editSubtitle")
                : t("adminProducts.form.addSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => !isSubmitting && onOpenChange(false)}
            disabled={isSubmitting}
            className="p-2 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-90 border border-border/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60 [&::-webkit-scrollbar-track]:bg-transparent">
          <ProductImageUpload
            previewUrl={previewUrl}
            error={errors.image}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
          />

          <ProductFormFields
            form={form}
            errors={errors}
            categories={categories}
            onChange={set}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-card/80 backdrop-blur-md shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted text-foreground font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            {t("adminProducts.form.cancel")}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>
                {isEditMode
                  ? t("adminProducts.form.save")
                  : t("adminProducts.form.add")}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
