import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  useGetRolesQuery,
  useGetUserInfoQuery,
  useUpdateProfileMutation,
} from "@/store/features/User/Auth";

import { AccountHeader } from "@/components/my/account/AccountHeader";
import { AccountForm } from "@/components/my/account/AccountForm";
import { LatestOrderWidget } from "@/components/my/account/LatestOrderWidget";

import type { UpdateProfileDto } from "@/types/types";
import type { ApiError } from "@/services/baseQuery";

type EditableFields = "fullName" | "phoneNumber" | "address";

export default function Account() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [editingFields, setEditingFields] = useState<Record<EditableFields, boolean>>({
    fullName: false,
    phoneNumber: false,
    address: false,
  });

  const { data: userInfo, isLoading: isFetching } = useGetUserInfoQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const { data: roles } = useGetRolesQuery();

  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileDto>({
    mode: "onChange",
    reValidateMode: "onChange",
    values: {
      fullName: userInfo?.fullName || "",
      address: userInfo?.address || "",
      phoneNumber: userInfo?.phoneNumber || "",
    },
  });

  const currentImagePreview = localImagePreview || userInfo?.imageUrl || null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("imageUrl", file, { shouldDirty: true });
      const previewUrl = URL.createObjectURL(file);
      setLocalImagePreview(previewUrl);
    }
  };

  const toggleEdit = (field: EditableFields) => {
    const isEditing = editingFields[field];

    if (isEditing) {
      const originalValue = userInfo?.[field] || "";
      setValue(field, originalValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearErrors(field);
    }

    setEditingFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data: UpdateProfileDto) => {
    try {
      const formData = new FormData();
      if (data.fullName) formData.append("FullName", data.fullName);
      if (data.address) formData.append("Address", data.address);
      if (data.phoneNumber) formData.append("PhoneNumber", data.phoneNumber);
      
      if (data.imageUrl instanceof File) {
        formData.append("ImageUrl", data.imageUrl);
      }

      // إرسال الـ FormData للـ Mutation (مع عمل Cast للـ type المتوقع)
      const response = await updateProfile(formData as unknown as UpdateProfileDto).unwrap();
      
      const successMessage =
        typeof response === "string"
          ? response
          : t("account.updateSuccess", "تم تحديث البيانات بنجاح!");

      toast.success(successMessage);
      setEditingFields({ fullName: false, phoneNumber: false, address: false });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(
        apiError?.message ||
          t("account.updateError", "حدث خطأ أثناء تحديث البيانات")
      );
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-base font-medium text-muted-foreground animate-pulse">
          {t("account.loading", "جاري تحميل بيانات الحساب...")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* رأس الصفحة والصلاحيات والصورة */}
      <AccountHeader
        userInfo={userInfo}
        roles={roles}
        currentImagePreview={currentImagePreview}
        fileInputRef={fileInputRef}
        handleImageChange={handleImageChange}
      />

      {/* ويدجت آخر طلب للمستخدم */}

      {/* نموذج تعديل البيانات الشخصية */}
      <AccountForm
        userInfo={userInfo}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isDirty={isDirty}
        isUpdating={isUpdating}
        editingFields={editingFields}
        toggleEdit={toggleEdit}
        onSubmit={onSubmit}
      />
      <LatestOrderWidget />
    </div>
  );
}