import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useAuthSchemas, type LoginFormData } from "./useAuthSchemas";
import type { ApiError } from "@/services/baseQuery";
import type { ResponseLogin } from "@/types/types";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  apiError?: ApiError<ResponseLogin>;
  onOpenForgotModal: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  apiError,
  onOpenForgotModal,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [showPassword, setShowPassword] = useState(false);
  const { loginSchema } = useAuthSchemas();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "", remember: false },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {apiError?.errors && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center gap-3 text-rose-500 text-sm sm:text-base font-bold">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <span>{t("auth.login_error")}</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm sm:text-base font-extrabold text-foreground">
          {t("auth.email_address")}
        </label>
        <div className="relative">
          <Mail
            className={`w-5 h-5 absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-muted-foreground`}
          />
          <input
            type="email"
            {...form.register("email")}
            placeholder={t("auth.email_placeholder")}
            className={`w-full ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} py-3.5 rounded-2xl bg-muted/50 border-2 ${
              form.formState.errors.email ? "border-rose-500" : "border-input"
            } text-foreground text-base sm:text-lg font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20`}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-xs sm:text-sm text-rose-500 font-bold">
            {t(form.formState.errors.email.message as string)}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm sm:text-base font-extrabold text-foreground">
            {t("auth.password")}
          </label>
          <button
            type="button"
            onClick={onOpenForgotModal}
            className="text-xs sm:text-sm text-primary hover:underline font-bold cursor-pointer"
          >
            {t("auth.forgot_password")}
          </button>
        </div>
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
            } text-foreground text-base sm:text-lg font-medium focus:outline-none focus:border-primary`}
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
        disabled={isLoading}
        type="submit"
        className="w-full mt-4 py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-rose-500/20 hover:shadow-rose-500/35 disabled:opacity-50 transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98]"
      >
        <span>{t("auth.sign_in")}</span>
        {isRtl ? (
          <ArrowLeft className="w-5 h-5" />
        ) : (
          <ArrowRight className="w-5 h-5" />
        )}
      </button>
    </form>
  );
};
