import {
  User,
  Mail,
  MapPin,
  UserCheck,
  Save,
  Loader2,
  Phone,
  Pencil,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { UseFormRegister, FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import type { UpdateProfileDto } from "@/types/types";
import type { UserInfo } from "@/types/types";

interface AccountFormProps {
  userInfo: UserInfo | undefined;
  register: UseFormRegister<UpdateProfileDto>;
  handleSubmit: UseFormHandleSubmit<UpdateProfileDto>;
  errors: FieldErrors<UpdateProfileDto>;
  isDirty: boolean;
  isUpdating: boolean;
  editingFields: { fullName: boolean; phoneNumber: boolean; address: boolean };
  toggleEdit: (field: "fullName" | "phoneNumber" | "address") => void;
  onSubmit: (data: UpdateProfileDto) => void;
}

export function AccountForm({
  userInfo,
  register,
  handleSubmit,
  errors,
  isDirty,
  isUpdating,
  editingFields,
  toggleEdit,
  onSubmit,
}: AccountFormProps) {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[2.5rem] border border-border/80 bg-card p-8 sm:p-12 shadow-2xl backdrop-blur-xl space-y-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Username */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-primary" />
              {t("account.usernameLabel", "اسم المستخدم")}
            </span>
            <span className="text-xs text-muted-foreground/60 bg-muted px-3 py-1 rounded-full font-semibold">
              {t("account.readOnly", "غير قابل للتغيير")}
            </span>
          </label>
          <input
            type="text"
            value={userInfo?.userName || ""}
            disabled
            className="w-full px-5 py-4 rounded-2xl bg-muted/40 border border-border/50 text-foreground/70 font-medium text-base cursor-not-allowed outline-none"
          />
        </div>

        {/* Email */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-primary" />
              {t("account.emailLabel", "البريد الإلكتروني")}
            </span>
            <span className="text-xs text-muted-foreground/60 bg-muted px-3 py-1 rounded-full font-semibold">
              {t("account.readOnly", "غير قابل للتغيير")}
            </span>
          </label>
          <input
            type="text"
            value={userInfo?.email || ""}
            disabled
            className="w-full px-5 py-4 rounded-2xl bg-muted/40 border border-border/50 text-foreground/70 font-medium text-base cursor-not-allowed outline-none"
          />
        </div>

        {/* Full Name */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-foreground flex items-center gap-2.5">
              <User className="w-5 h-5 text-primary" />
              <span>{t("account.fullNameLabel", "الاسم بالكامل")}</span>
            </label>
            <button
              type="button"
              onClick={() => toggleEdit("fullName")}
              className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
            >
              {editingFields.fullName ? (
                <>
                  <X className="w-4 h-4" />
                  <span>{t("account.cancel", "إلغاء")}</span>
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" />
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
            className={`w-full px-5 py-4 rounded-2xl border text-foreground font-medium text-base transition-all outline-none ${
              !editingFields.fullName
                ? "bg-muted/40 border-border/50 text-foreground/70 cursor-not-allowed"
                : "bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
            }`}
          />
          {errors.fullName?.message && editingFields.fullName && (
            <p className="text-xs sm:text-sm text-red-500 font-medium px-1">
              {t(
                "account.errors.fullNamePattern",
                "الاسم يجب أن يحتوي على أحرف ومسافات فقط"
              )}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-foreground flex items-center gap-2.5">
              <Phone className="w-5 h-5 text-primary" />
              <span>{t("account.phoneLabel", "رقم الهاتف")}</span>
            </label>
            <button
              type="button"
              onClick={() => toggleEdit("phoneNumber")}
              className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
            >
              {editingFields.phoneNumber ? (
                <>
                  <X className="w-4 h-4" />
                  <span>{t("account.cancel", "إلغاء")}</span>
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" />
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
            placeholder={t("account.phonePlaceholder", "أدخل رقم هاتفك")}
            className={`w-full px-5 py-4 rounded-2xl border text-foreground font-medium text-base transition-all outline-none ${
              !editingFields.phoneNumber
                ? "bg-muted/40 border-border/50 text-foreground/70 cursor-not-allowed"
                : "bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
            }`}
          />
          {errors.phoneNumber?.message && editingFields.phoneNumber && (
            <p className="text-xs sm:text-sm text-red-500 font-medium px-1">
              {t(
                "account.errors.phonePattern",
                "رقم الهاتف يجب أن يكون صحيحًا ويبدأ بـ 010، 011، 012، أو 015"
              )}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-foreground flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{t("account.addressLabel", "العنوان")}</span>
            </label>
            <button
              type="button"
              onClick={() => toggleEdit("address")}
              className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
            >
              {editingFields.address ? (
                <>
                  <X className="w-4 h-4" />
                  <span>{t("account.cancel", "إلغاء")}</span>
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" />
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
            className={`w-full px-5 py-4 rounded-2xl border text-foreground font-medium text-base transition-all outline-none ${
              !editingFields.address
                ? "bg-muted/40 border-border/50 text-foreground/70 cursor-not-allowed"
                : "bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
            }`}
          />
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex items-center justify-end pt-6 border-t border-border/60">
        <button
          type="submit"
          disabled={!isDirty || isUpdating}
          className="flex items-center gap-2.5 px-9 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-base shadow-xl shadow-primary/20 hover:bg-accent active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t("account.saving", "جاري الحفظ...")}</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{t("account.saveBtn", "حفظ التغييرات")}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}