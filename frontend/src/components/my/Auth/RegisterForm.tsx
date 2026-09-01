import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Lock,
  User,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  MailCheck,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useAuthSchemas, type RegisterFormData } from "./useAuthSchemas";
import type { ApiError } from "@/services/baseQuery";
import type { ResponseRegister } from "@/types/types";

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  apiError?: ApiError<ResponseRegister>;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
  apiError,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { registerSchema } = useAuthSchemas();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      address: "",
      userName: "",
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      await onSubmit(data);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  // شاشة النجاح بعد التسجيل
  if (isSuccess) {
    return (
      <div className="py-8 px-6 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 rounded-3xl blur-xl opacity-40 animate-pulse" />
          <div className="relative w-28 h-28 bg-card border-2 border-rose-500/30 rounded-3xl flex items-center justify-center shadow-2xl">
            <MailCheck className="w-14 h-14 text-rose-500 animate-bounce" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4" />
            <span>{t("auth.almost_there", "خطوة واحدة أخيرة!")}</span>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-foreground">
            {t("auth.check_your_inbox", "تفقد بريدك الإلكتروني 📩")}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-sm mx-auto">
            {t(
              "auth.verification_sent_desc",
              "أرسلنا رابط التأكيد إلى البريد التالي:",
            )}
          </p>
          <div className="inline-block px-4 py-2 rounded-2xl bg-muted border border-border text-sm sm:text-base font-mono font-bold text-foreground">
            {submittedEmail || "your@email.com"}
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="text-sm sm:text-base text-muted-foreground hover:text-foreground font-bold flex items-center justify-center gap-2 mx-auto transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>
              {t("auth.wrong_email", "تعديل البيانات أو إعادة الإرسال")}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Full Name */}
      <div className="space-y-2">
        <label className="text-sm sm:text-base font-extrabold text-foreground">
          {t("auth.full_name")}{" "}
          <span className="text-xs text-muted-foreground font-normal">
            ({t("auth.optional")})
          </span>
        </label>
        <div className="relative">
          <User
            className={`w-5 h-5 absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground`}
          />
          <input
            type="text"
            {...form.register("fullName")}
            placeholder={t("auth.full_name_placeholder")}
            className={`w-full ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} py-3.5 rounded-2xl bg-muted/50 border-2 ${
              form.formState.errors.fullName
                ? "border-rose-500"
                : "border-input"
            } text-foreground text-base sm:text-lg font-medium focus:outline-none focus:border-primary`}
          />
        </div>
      </div>

      {/* User Name */}
      <div className="space-y-2">
        <label className="text-sm sm:text-base font-extrabold text-foreground">
          {t("auth.username")} *
        </label>
        <div className="relative">
          <User
            className={`w-5 h-5 absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground`}
          />
          <input
            type="text"
            {...form.register("userName")}
            placeholder="e.g. user_99"
            className={`w-full ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} py-3.5 rounded-2xl bg-muted/50 border-2 ${
              form.formState.errors.userName
                ? "border-rose-500"
                : "border-input"
            } text-foreground text-base sm:text-lg font-medium focus:outline-none focus:border-primary`}
          />
        </div>
        {form.formState.errors.userName && (
          <p className="text-xs sm:text-sm text-rose-500 font-bold">
            {t(form.formState.errors.userName.message as string)}
          </p>
        )}
        {apiError?.errors?.userName && (
          <p className="text-xs sm:text-sm text-rose-500 font-bold">
            {t("auth.username_exists")}
          </p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <label className="text-sm sm:text-base font-extrabold text-foreground">
          {t("auth.address")}{" "}
          <span className="text-xs text-muted-foreground font-normal">
            ({t("auth.optional")})
          </span>
        </label>
        <div className="relative">
          <MapPin
            className={`w-5 h-5 absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground`}
          />
          <input
            type="text"
            {...form.register("address")}
            placeholder={t("auth.address_placeholder")}
            className={`w-full ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} py-3.5 rounded-2xl bg-muted/50 border-2 ${
              form.formState.errors.address ? "border-rose-500" : "border-input"
            } text-foreground text-base sm:text-lg font-medium`}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm sm:text-base font-extrabold text-foreground">
          {t("auth.email_address")} *
        </label>
        <div className="relative">
          <Mail
            className={`w-5 h-5 absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground`}
          />
          <input
            type="email"
            {...form.register("email")}
            placeholder="name@example.com"
            className={`w-full ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} py-3.5 rounded-2xl bg-muted/50 border-2 ${
              form.formState.errors.email ? "border-rose-500" : "border-input"
            } text-foreground text-base sm:text-lg font-medium`}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-xs sm:text-sm text-rose-500 font-bold">
            {t(form.formState.errors.email.message as string)}
          </p>
        )}
        {apiError?.errors?.email && (
          <p className="text-xs sm:text-sm text-rose-500 font-bold">
            {t("auth.email_exists")}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm sm:text-base font-extrabold text-foreground">
          {t("auth.password")} *
        </label>
        <div className="relative">
          <Lock
            className={`w-5 h-5 absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground`}
          />
          <input
            type={showPassword ? "text" : "password"}
            {...form.register("password")}
            placeholder="••••••••"
            className={`w-full ${isRtl ? "pr-12 pl-12" : "pl-12 pr-12"} py-3.5 rounded-2xl bg-muted/50 border-2 ${
              form.formState.errors.password
                ? "border-rose-500"
                : "border-input"
            } text-foreground text-base sm:text-lg font-medium`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute ${isRtl ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer`}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-xs sm:text-sm text-rose-500 font-bold">
            {t(form.formState.errors.password.message as string)}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white font-extrabold text-base sm:text-lg shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-3 cursor-pointer hover:shadow-rose-500/25 active:scale-[0.98]"
      >
        <span>{t("auth.sign_up")}</span>
        {isRtl ? (
          <ArrowLeft className="w-5 h-5" />
        ) : (
          <ArrowRight className="w-5 h-5" />
        )}
      </button>
    </form>
  );
};