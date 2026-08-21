import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  User,
  Mail,
  MapPin,
  UserCheck,
  ShieldCheck,
  Save,
  Loader2,
  Sparkles,
  Phone,
  Crown,
  Shield,
  Pencil,
  X,
} from "lucide-react";
import {
  useGetRolesQuery,
  useGetUserInfoQuery,
  useUpdateProfileMutation,
} from "@/store/features/User/Auth";
import type { UpdateProfileDto } from "@/types/types";
import type { ApiError } from "@/services/baseQuery";

export default function Account() {
  const { t } = useTranslation();

  const [editingFields, setEditingFields] = useState<{
    fullName: boolean;
    phoneNumber: boolean;
    address: boolean;
  }>({
    fullName: false,
    phoneNumber: false,
    address: false,
  });

  const { data: userInfo, isLoading: isFetching } = useGetUserInfoQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const { data: roles } = useGetRolesQuery();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileDto>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (userInfo) {
      reset({
        fullName: userInfo.fullName || "",
        address: userInfo.address || "",
        phoneNumber: userInfo.phoneNumber || "",
      });
    }
  }, [userInfo, reset]);

  // دالة التعامل مع التبديل والإلغاء وتفريغ الأخطاء وإرجاع البيانات الأصلية
  const toggleEdit = (field: keyof typeof editingFields) => {
    const isEditing = editingFields[field];

    if (isEditing) {
      // إذا كان الحقل مفتوحاً وتم الضغط على إلغاء Cancel:
      // 1. استرجاع القيمة الأصلية للحقل
      const originalValue = userInfo?.[field] || "";
      setValue(field, originalValue, { shouldDirty: true, shouldValidate: true });

      // 2. مسح الأخطاء المتعلقة بهذا الحقل فوراً
      clearErrors(field);
    }

    setEditingFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data: UpdateProfileDto) => {
    try {
      const message = await updateProfile(data).unwrap();
      toast.success(message || t("account.updateSuccess", "تم تحديث البيانات بنجاح!"));
      setEditingFields({ fullName: false, phoneNumber: false, address: false });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(
        apiError?.message || t("account.updateError", "حدث خطأ أثناء تحديث البيانات")
      );
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    const normalized = role.toLowerCase();
    if (normalized.includes("admin")) {
      return {
        icon: <Crown className="w-3 h-3 text-amber-400" />,
        style: "bg-amber-500/10 text-amber-500 border-amber-500/30",
      };
    }
    if (normalized.includes("manager")) {
      return {
        icon: <Shield className="w-3 h-3 text-purple-400" />,
        style: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      };
    }
    return {
      icon: <ShieldCheck className="w-3 h-3 text-emerald-400" />,
      style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    };
  };

  if (isFetching) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {t("account.loading", "جاري تحميل بيانات الحساب...")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-linear-to-r from-primary/10 via-card to-card p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary font-black text-3xl shadow-xl shadow-primary/10 transition-transform duration-300 group-hover:scale-105">
                {userInfo?.fullName
                  ? userInfo.fullName.charAt(0).toUpperCase()
                  : userInfo?.userName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-card">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t("account.badge", "إعدادات الحساب")}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                {userInfo?.fullName || userInfo?.userName}
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                {userInfo?.email}
              </p>
            </div>
          </div>

          {/* Roles */}
          {roles?.data && roles?.data?.length > 0 && (
            <div className="flex sm:flex-col items-center sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50 w-full sm:w-auto justify-center">
              <span className="text-[11px] font-bold text-muted-foreground">
                {t("account.rolesLabel", "الصلاحيات")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {roles?.data?.map((role) => {
                  const { icon, style } = getRoleBadgeStyle(role);
                  return (
                    <span
                      key={role}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold capitalize transition-all hover:scale-105 ${style}`}
                    >
                      {icon}
                      <span>{role}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[2.5rem] border border-border/80 bg-card p-6 sm:p-10 shadow-xl backdrop-blur-xl space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" />
                {t("account.usernameLabel", "اسم المستخدم")}
              </span>
              <span className="text-[10px] text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full">
                {t("account.readOnly", "غير قابل للتغيير")}
              </span>
            </label>
            <input
              type="text"
              value={userInfo?.userName || ""}
              disabled
              className="w-full px-4 py-3.5 rounded-2xl bg-muted/40 border border-border/50 text-foreground/70 font-medium text-sm cursor-not-allowed outline-none"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                {t("account.emailLabel", "البريد الإلكتروني")}
              </span>
              <span className="text-[10px] text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full">
                {t("account.readOnly", "غير قابل للتغيير")}
              </span>
            </label>
            <input
              type="text"
              value={userInfo?.email || ""}
              disabled
              className="w-full px-4 py-3.5 rounded-2xl bg-muted/40 border border-border/50 text-foreground/70 font-medium text-sm cursor-not-allowed outline-none"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>{t("account.fullNameLabel", "الاسم بالكامل")}</span>
              </label>
              <button
                type="button"
                onClick={() => toggleEdit("fullName")}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                {editingFields.fullName ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>{t("account.cancel", "إلغاء")}</span>
                  </>
                ) : (
                  <>
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{t("account.change", "تعديل")}</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              disabled={!editingFields.fullName}
              {...register("fullName", {
                pattern: {
                  value: /^[\p{L}\s]+$/u,
                  message: "account.errors.fullNamePattern",
                },
              })}
              placeholder={t("account.fullNamePlaceholder", "أدخل اسمك بالكامل")}
              className={`w-full px-4 py-3.5 rounded-2xl border text-foreground font-medium text-sm transition-all outline-none ${
                !editingFields.fullName
                  ? "bg-muted/40 border-border/50 text-foreground/70 cursor-not-allowed"
                  : "bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
            />
            {errors.fullName?.message && editingFields.fullName && (
              <p className="text-xs text-red-500 font-medium px-1">
                {t("account.errors.fullNamePattern", "الاسم يجب أن يحتوي على أحرف ومسافات فقط")}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>{t("account.phoneLabel", "رقم الهاتف")}</span>
              </label>
              <button
                type="button"
                onClick={() => toggleEdit("phoneNumber")}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                {editingFields.phoneNumber ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>{t("account.cancel", "إلغاء")}</span>
                  </>
                ) : (
                  <>
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{t("account.change", "تعديل")}</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="tel"
              disabled={!editingFields.phoneNumber}
              {...register("phoneNumber", {
                pattern: {
                  value: /^01[0125]\d{8}$/,
                  message: "account.errors.phonePattern",
                },
              })}
              placeholder={t("account.phonePlaceholder", "أدخل رقم هاتفك (مثال: 01012345678)")}
              className={`w-full px-4 py-3.5 rounded-2xl border text-foreground font-medium text-sm transition-all outline-none ${
                !editingFields.phoneNumber
                  ? "bg-muted/40 border-border/50 text-foreground/70 cursor-not-allowed"
                  : "bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
            />
            {errors.phoneNumber?.message && editingFields.phoneNumber && (
              <p className="text-xs text-red-500 font-medium px-1">
                {t("account.errors.phonePattern", "رقم الهاتف يجب أن يكون صحيحًا ويبدأ بـ 010، 011، 012، أو 015")}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{t("account.addressLabel", "العنوان")}</span>
              </label>
              <button
                type="button"
                onClick={() => toggleEdit("address")}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                {editingFields.address ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>{t("account.cancel", "إلغاء")}</span>
                  </>
                ) : (
                  <>
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{t("account.change", "تعديل")}</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              disabled={!editingFields.address}
              {...register("address")}
              placeholder={t("account.addressPlaceholder", "أدخل عنوان التوصيل المفصل")}
              className={`w-full px-4 py-3.5 rounded-2xl border text-foreground font-medium text-sm transition-all outline-none ${
                !editingFields.address
                  ? "bg-muted/40 border-border/50 text-foreground/70 cursor-not-allowed"
                  : "bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end pt-4 border-t border-border/60">
          <button
            type="submit"
            disabled={!isDirty || isUpdating}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:bg-accent active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t("account.saving", "جاري الحفظ...")}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t("account.saveBtn", "حفظ التغييرات")}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}