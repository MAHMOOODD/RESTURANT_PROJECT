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
      // Handling errors handled via apiError prop
      console.error("Registration error:", err);
    }
  };

  // 🚀 2026 Trendy Success State Screen
  if (isSuccess) {
    return (
      <div className="py-6 px-4 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Glow Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 rounded-3xl blur-xl opacity-40 animate-pulse" />
          <div className="relative w-20 h-20 bg-card border border-rose-500/30 rounded-3xl flex items-center justify-center shadow-2xl">
            <MailCheck className="w-10 h-10 text-rose-500 animate-bounce" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("auth.almost_there", "خطوة واحدة أضافيه!")}</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-foreground">
            {t("auth.check_your_inbox", "تفقد بريدك الإلكتروني 📩")}
          </h3>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xs mx-auto">
            {t("auth.verification_sent_desc", "أرسلنا رابط التفعيل إلى")}
          </p>
          <div className="inline-block px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-mono font-bold text-foreground">
            {submittedEmail || "your@email.com"}
          </div>
        </div>

        {/* Helpful Tips / CTA Actions */}
        <div className="pt-2 space-y-3">
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>
              {t("auth.wrong_email", "تعديل البيانات أو إعادة إرسال")}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3">
      {/* Full Name */}

      <div className="space-y-1">
        <label className="text-xs font-bold text-foreground">
          {t("auth.full_name")}{" "}
          <span className="text-[10px] text-muted-foreground font-normal">
            ({t("auth.optional")})
          </span>
        </label>
        <div className="relative">
          <User
            className={`w-4 h-4 absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground`}
          />
          <input
            type="text"
            {...form.register("fullName")}
            placeholder={t("auth.full_name_placeholder")}
            className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-xl bg-muted/50 border ${
              form.formState.errors.fullName
                ? "border-rose-500"
                : "border-input"
            } text-foreground text-sm focus:outline-none focus:border-primary`}
          />
        </div>
      </div>

      {/* User Name */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-foreground">
          {t("auth.username")} *
        </label>
        <div className="relative">
          <User
            className={`w-4 h-4 absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground`}
          />
          <input
            type="text"
            {...form.register("userName")}
            placeholder="e.g. user_99"
            className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-xl bg-muted/50 border ${
              form.formState.errors.userName
                ? "border-rose-500"
                : "border-input"
            } text-foreground text-sm focus:outline-none focus:border-primary`}
          />
        </div>
        {form.formState.errors.userName && (
          <p className="text-[11px] text-rose-500 font-medium">
            {form.formState.errors.userName.message}
          </p>
        )}
        {apiError?.errors?.userName && (
          <p className="text-[11px] text-rose-500 font-medium">
            {t("auth.username_exists")}
          </p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-foreground">
          {t("auth.address")}{" "}
          <span className="text-[10px] text-muted-foreground font-normal">
            ({t("auth.optional")})
          </span>
        </label>
        <div className="relative">
          <MapPin
            className={`w-4 h-4 absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground`}
          />
          <input
            type="text"
            {...form.register("address")}
            placeholder={t("auth.address_placeholder")}
            className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-xl bg-muted/50 border ${
              form.formState.errors.address ? "border-rose-500" : "border-input"
            } text-foreground text-sm`}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-foreground">
          {t("auth.email_address")} *
        </label>
        <div className="relative">
          <Mail
            className={`w-4 h-4 absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground`}
          />
          <input
            type="email"
            {...form.register("email")}
            placeholder="name@example.com"
            className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-xl bg-muted/50 border ${
              form.formState.errors.email ? "border-rose-500" : "border-input"
            } text-foreground text-sm`}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-[11px] text-rose-500 font-medium">
            {form.formState.errors.email.message}
          </p>
        )}
        {apiError?.errors?.email && (
          <p className="text-[11px] text-rose-500 font-medium">
            {t("auth.email_exists")}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-foreground">
          {t("auth.password")} *
        </label>
        <div className="relative">
          <Lock
            className={`w-4 h-4 absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground`}
          />
          <input
            type={showPassword ? "text" : "password"}
            {...form.register("password")}
            placeholder="••••••••"
            className={`w-full ${isRtl ? "pr-10 pl-10" : "pl-10 pr-10"} py-2 rounded-xl bg-muted/50 border ${
              form.formState.errors.password
                ? "border-rose-500"
                : "border-input"
            } text-foreground text-sm`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute ${isRtl ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer`}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-[11px] text-rose-500 font-medium">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-3 py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-rose-500/25 active:scale-[0.99]"
      >
        <span>{t("auth.sign_up")}</span>
        {isRtl ? (
          <ArrowLeft className="w-4 h-4" />
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
      </button>
    </form>
  );
};
