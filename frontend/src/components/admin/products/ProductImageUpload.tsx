import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Camera, ImagePlus, Trash2 } from "lucide-react";

interface ProductImageUploadProps {
  previewUrl: string;
  error?: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function ProductImageUpload({
  previewUrl,
  error,
  onImageChange,
  onRemoveImage,
}: ProductImageUploadProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemove = () => {
    onRemoveImage();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2">
      <div className="relative group h-28 w-28 rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center shadow-lg transition-all duration-300 hover:border-primary">
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt={t("adminProducts.imageUpload.previewAlt", "معاينة الصورة")}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <label
              htmlFor="product-image-input"
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-200 text-white"
            >
              <Camera className="h-6 w-6 mb-1" />
              <span className="text-[11px] font-medium">
                {t("adminProducts.imageUpload.change", "تغيير")}
              </span>
            </label>
          </>
        ) : (
          <label
            htmlFor="product-image-input"
            className="h-full w-full flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          >
            <ImagePlus className="h-8 w-8 mb-1 opacity-70" />
            <span className="text-xs font-medium">
              {t("adminProducts.imageUpload.upload", "رفع صورة")}
            </span>
          </label>
        )}

        <input
          id="product-image-input"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
      </div>

      {previewUrl && (
        <button
          type="button"
          onClick={handleRemove}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors pt-1 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{t("adminProducts.imageUpload.remove", "حذف الصورة")}</span>
        </button>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}