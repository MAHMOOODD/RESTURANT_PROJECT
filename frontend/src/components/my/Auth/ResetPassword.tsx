import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "@/store/features/User/Auth";
import type { ApiError } from "@/services/baseQuery";
import { CheckCircle2, Eye, EyeOff, KeyRoundIcon } from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

  const navigate = useNavigate();

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
  const Email = searchParams.get("email");

  const tokenFromUrl = searchParams.get("token");

  const cleanToken = tokenFromUrl?.replace(/ /g, "+");

  const [resetPassword, { isLoading, error, isSuccess }] =
    useResetPasswordMutation();
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
    await resetPassword({
      email: Email ?? "",
      token: cleanToken ?? "",
      newPassword: data.NewPassword,
    })
      .unwrap()
      .then(() => {

        setTimeout(() => {
          navigate("/auth"); // Redirect to login page after 3 seconds
        }, 3000); // Redirect after 3 seconds
      })
      .catch((err) => {
        console.error("Reset Password Error:", err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-xl space-y-8 bg-card p-10 sm:p-12 rounded-3xl border-2 border-border shadow-2xl">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
            <KeyRoundIcon className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {t("auth.resetPasswordTitle", "تعيين كلمة سر جديدة")}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            {t(
              "auth.resetPasswordSubtitle",
              "أدخل كلمة السر الجديدة لحسابك في أكلني",
            )}
          </p>
        </div>

        {isSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-lg p-8 bg-white dark:bg-zinc-900 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-3xl flex flex-col items-center justify-center gap-4 text-center font-bold shadow-2xl animate-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 shrink-0 animate-bounce" />
              <span className="text-lg sm:text-xl leading-relaxed">
                {t(
                  "auth.resetPasswordSuccess",
                  "تم إعادة تعيين كلمة المرور بنجاح! سيتم توجيهك إلى صفحة تسجيل الدخول خلال 3 ثوانٍ.",
                )}
              </span>
            </div>
          </div>
        )}

        {APiError?.status && (
          <div className="p-4 bg-destructive/10 text-destructive text-base font-bold rounded-2xl text-center border-2 border-destructive/20">
            {t(
              "auth.resetPasswordError",
              "حدث خطأ أثناء إعادة تعيين كلمة المرور، أعد المحاولة.",
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* new password */}
          <div className="space-y-2 text-start">
            <label className="text-sm sm:text-base font-extrabold text-foreground">
              {t("auth.newPassword", "كلمة السر الجديدة")}
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                {...register("NewPassword")}
                className="w-full px-5 py-3.5 bg-secondary/50 border-2 border-input rounded-2xl text-foreground text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-all ltr:pr-12 rtl:pl-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
              >
                {showNewPassword ? (
                  <EyeOff className="w-6 h-6" />
                ) : (
                  <Eye className="w-6 h-6" />
                )}
              </button>
            </div>
            {errors.NewPassword && (
              <p className="text-xs sm:text-sm text-destructive font-bold mt-1">
                {t(errors.NewPassword.message as string)}
              </p>
            )}
          </div>

          {/* confirm password */}
          <div className="space-y-2 text-start">
            <label className="text-sm sm:text-base font-extrabold text-foreground">
              {t("auth.confirmPassword", "تأكيد كلمة السر")}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("ConfirmPassword")}
                className="w-full px-5 py-3.5 bg-secondary/50 border-2 border-input rounded-2xl text-foreground text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-all ltr:pr-12 rtl:pl-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-6 h-6" />
                ) : (
                  <Eye className="w-6 h-6" />
                )}
              </button>
            </div>
            {errors.ConfirmPassword && (
              <p className="text-xs sm:text-sm text-destructive font-bold mt-1">
                {t(errors.ConfirmPassword.message as string)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-primary text-primary-foreground font-extrabold text-base sm:text-lg rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-xl hover:shadow-primary/25 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <i className="fa-solid fa-circle-notch animate-spin text-xl"></i>
            ) : (
              t("auth.updatePasswordBtn", "حفظ كلمة السر الجديدة")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
