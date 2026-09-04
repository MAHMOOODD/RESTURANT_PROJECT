import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Utensils } from "lucide-react";

interface CategoryImageUploadProps {
  currentImageUrl?: string;
  onChange: (file: File | null) => void;
  errorKey?: string;
}

export const CategoryImageUpload: React.FC<CategoryImageUploadProps> = ({
  currentImageUrl,
  onChange,
  errorKey,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);

  const preview = selectedFileUrl || currentImageUrl || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSelectedFileUrl(objectUrl);
      onChange(file);
    }
  };

  const handleRemove = () => {
    setSelectedFileUrl(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative group w-32 h-32 rounded-2xl bg-[#13131a] border border-[#232330] overflow-hidden flex items-center justify-center cursor-pointer hover:border-red-600/50 transition-colors"
      >
        {preview ? (
          <img
            src={preview}
            alt="Category Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-300 transition-colors">
            <Utensils className="w-8 h-8 mb-1" />
            <span className="text-xs  p-3 ">{t("categories.uploadImage")}</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {preview && (
        <button
          type="button"
          onClick={handleRemove}
          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 font-medium transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t("categories.removeImage")}</span>
        </button>
      )}

      {errorKey && <p className="text-xs text-red-500 mt-1">{t(errorKey)}</p>}
    </div>
  );
};