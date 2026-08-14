import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuthSchemas,type LoginFormData } from "./useAuthSchemas";
import type { ApiError } from "@/services/baseQuery";
import type { ResponseLogin } from "@/store/types/types";

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
    defaultValues: { Email: "", Password: "", remember: false },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
      {apiError?.errors && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-500 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{t("auth.login_error")}</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-foreground">
          {t("auth.email_address")}
        </label>
        <div className="relative">
          <Mail className={`w-4 h-4 absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground`} />
          <input
            type="email"
            {...form.register("Email")}
            placeholder={t("auth.email_placeholder")}
            className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 rounded-xl bg-muted/50 border ${
              form.formState.errors.Email ? "border-rose-500" : "border-input"
            } text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
          />
        </div>
        {form.formState.errors.Email && (
          <p className="text-[11px] text-rose-500 font-medium">
            {form.formState.errors.Email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-foreground">
            {t("auth.password")}
          </label>
          <button
            type="button"
            onClick={onOpenForgotModal}
            className="text-xs text-primary hover:underline font-semibold cursor-pointer"
          >
            {t("auth.forgot_password")}
          </button>
        </div>
        <div className="relative">
          <Lock className={`w-4 h-4 absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground`} />
          <input
            type={showPassword ? "text" : "password"}
            {...form.register("Password")}
            placeholder="••••••••"
            className={`w-full ${isRtl ? "pr-10 pl-10" : "pl-10 pr-10"} py-2.5 rounded-xl bg-muted/50 border ${
              form.formState.errors.Password ? "border-rose-500" : "border-input"
            } text-foreground text-sm focus:outline-none focus:border-primary`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute ${isRtl ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer`}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {form.formState.errors.Password && (
          <p className="text-[11px] text-rose-500 font-medium">
            {form.formState.errors.Password.message}
          </p>
        )}
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-500/20 hover:shadow-rose-500/35 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>{t("auth.sign_in")}</span>
        {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
};