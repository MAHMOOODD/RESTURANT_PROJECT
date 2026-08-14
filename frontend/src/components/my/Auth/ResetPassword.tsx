import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "@/store/features/User/Auth";
import type { ApiError } from "@/services/baseQuery";
import { Eye, EyeOff, KeyRoundIcon } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  // 👁️ حالة التحكم في إظهار وإخفاء كلمة السر
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

  const resetPasswordSchema = z
    .object({
     

      NewPassword: z
        .string()
        .min(6, { message: "auth.password_min" })
        .regex(/[0-9]/, { message: "auth.password_digit" })
        .regex(/[a-z]/, { message: "auth.password_lowercase" })
        .regex(/[A-Z]/, { message: "auth.password_uppercase" })
        .regex(/[^a-zA-Z0-9]/, { message: "auth.password_special" }),

      ConfirmPassword: z.string().min(1, {
        message: "auth.confirmPasswordRequired",
      }),
    })
    .refine((data) => data.NewPassword === data.ConfirmPassword, {
      message: "auth.passwordsDoNotMatch",
      path: ["ConfirmPassword"],
    });

  // استخراج البيانات من الـ URL
  const Email = searchParams.get("email") ;
  const Token = searchParams.get("token");

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const APiError = error as ApiError | undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      NewPassword: "",
      ConfirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {

    const response = await resetPassword({
      Email: Email??"",
      Token: Token??"",
      NewPassword: data.NewPassword,
    });
    console.log("Reset Password Response:", response);
   
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border border-border shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2">
            <KeyRoundIcon />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            {t("auth.resetPasswordTitle", "تعيين كلمة سر جديدة")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t(
              "auth.resetPasswordSubtitle",
              "أدخل كلمة السر الجديدة لحسابك في أكلني",
            )}
          </p>
        </div>

        {APiError?.status && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl text-center">
            {t(
              "auth.resetPasswordError",
              "حدث خطأ أثناء إعادة تعيين كلمة المرور، أعد المحاولة.",
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* حقل كلمة السر الجديدة */}
          <div className="space-y-2 text-start">
            <label className="text-sm font-semibold text-foreground">
              {t("auth.newPassword", "كلمة السر الجديدة")}
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                {...register("NewPassword")}
                className="w-full px-4 py-3 bg-secondary/50 border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ltr:pr-11 rtl:pl-11"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.NewPassword && (
              <p className="text-xs text-destructive mt-1">
                {t(errors.NewPassword.message as string)}
              </p>
            )}
          </div>

          {/* حقل تأكيد كلمة السر */}
          <div className="space-y-2 text-start">
            <label className="text-sm font-semibold text-foreground">
              {t("auth.confirmPassword", "تأكيد كلمة السر")}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("ConfirmPassword")}
                className="w-full px-4 py-3 bg-secondary/50 border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ltr:pr-11 rtl:pl-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.ConfirmPassword && (
              <p className="text-xs text-destructive mt-1">
                {t(errors.ConfirmPassword.message as string)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-50"
          >
            {isLoading ? (
              <i className="fa-solid fa-circle-notch animate-spin"></i>
            ) : (
              t("auth.updatePasswordBtn", "حفظ كلمة السر الجديدة")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
