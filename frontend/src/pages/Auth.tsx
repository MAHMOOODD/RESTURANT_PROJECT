import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForgetPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
} from "@/store/features/User/Auth";

import * as z from "zod";
import {
  Utensils,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Flame,
  ChefHat,
  Eye,
  EyeOff,
  MapPin,
  KeyRound,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";
import type { ApiError } from "@/services/baseQuery";
import type { ResponseLogin, ResponseRegister } from "@/store/types/types";

export const Auth: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [Login, { isLoading: isLoginLoading, error: isLoginError }] =
    useLoginMutation();
  const [Register, { isLoading: isRegisterLoading, error: isRegisterError }] =
    useRegisterMutation();
  const [
    ForgetPassword,
    { isLoading: isForgetPasswordLoading, error: isForgetPasswordError },
  ] = useForgetPasswordMutation();

  const RegisterApiError = isRegisterError as
    | ApiError<ResponseRegister>
    | undefined;
  const LoginApiError = isLoginError as ApiError<ResponseLogin> | undefined;
  const ForgetPasswordApiError = isForgetPasswordError as ApiError | undefined;

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [forgotSubmitted, setForgotSubmitted] = useState<boolean>(false);

  // Zod Schemas مرتبطة بلغة التطبيق لضمان تحديث رسائل الخطأ فورياً عند تبديل اللغة
  const loginSchema = useMemo(
    () =>
      z.object({
        Email: z
          .string()
          .min(1, t("auth.email_required"))
          .email(t("auth.email_invalid")),
        Password: z.string().min(1, t("auth.password_required")),
        remember: z.boolean().optional(),
      }),
    [i18n.language, t],
  );

  const registerSchema = useMemo(
    () =>
      z.object({
        FullName: z.string().optional(),
        Address: z.string().optional(),
        UserName: z.string().min(1, t("auth.username_required")),
        Email: z
          .string()
          .min(1, t("auth.email_required"))
          .email(t("auth.email_invalid")),
        Password: z
          .string()
          .min(6, t("auth.password_min"))
          .regex(/[0-9]/, t("auth.password_digit"))
          .regex(/[a-z]/, t("auth.password_lowercase"))
          .regex(/[A-Z]/, t("auth.password_uppercase"))
          .regex(/[^a-zA-Z0-9]/, t("auth.password_special")),
      }),
    [i18n.language, t]
  );

  const forgotPasswordSchema = useMemo(
    () =>
      z.object({
        Email: z
          .string()
          .min(1, t("auth.email_required"))
          .email(t("auth.email_invalid")),
      }),
    [i18n.language, t],
  );

  type LoginFormData = z.infer<typeof loginSchema>;
  type RegisterFormData = z.infer<typeof registerSchema>;
  type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

  // React Hook Form Setup
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { Email: "", Password: "", remember: false },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      FullName: "",
      Address: "",
      UserName: "",
      Email: "",
      Password: "",
    },
  });

  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: { Email: "" },
  });

  // Handlers
  const onLoginSubmit = async (data: LoginFormData) => {
    const response = await Login({
      Email: data.Email,
      Password: data.Password,
    });
    console.log("response:", response);
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    const response = await Register(data);
    console.log("response:", response);
  };

  const onForgotSubmit = async (data: ForgotPasswordFormData) => {
    const response = await ForgetPassword(data);
    console.log("response:", response);
    if (!response.error) {
      setForgotSubmitted(true);
    }
  };

  const toggleAuthMode = (loginState: boolean) => {
    setIsLogin(loginState);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground p-4 lg:p-8 selection:bg-rose-500 selection:text-white transition-colors duration-300 relative">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-card rounded-3xl border border-border shadow-2xl overflow-hidden min-h-[680px] relative transition-colors duration-300">
        {/* Left Side: Branding Banner */}
        <div
          className="lg:col-span-6 relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-rose-950 via-zinc-900 to-black text-white"
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3.5">
            <div className="relative p-3 bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 rounded-2xl shadow-lg shadow-rose-600/30">
              <Flame className="w-7 h-7 text-white fill-white/20 animate-bounce" />
            </div>
            <div className="flex gap-1 flex-col">
              <span className="text-3xl font-black tracking-widest bg-gradient-to-r from-orange-400 via-rose-500 to-amber-300 bg-clip-text text-transparent font-sans">
                {t("brand")}
              </span>
              <span className="text-[10px] text-zinc-400 tracking-[0.25em] font-semibold uppercase">
                {t("brandSub")}
              </span>
            </div>
          </div>

          <div className="relative z-10 my-auto py-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t("auth.brand_tagline")}</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-black leading-tight text-white">
              {t("auth.hero_title")}
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
                {t("auth.hero_subtitle")}
              </span>
              😋
            </h2>

            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm font-medium">
              {t("auth.hero_description")}
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-semibold">
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-amber-400" />
              <span>{t("auth.fresh_ingredients")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-rose-400" />
              <span>{t("auth.food_lovers")}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div
          className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center bg-card text-foreground relative transition-colors duration-300"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-tr from-rose-600 to-orange-500 rounded-xl shadow-md">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-orange-400 via-rose-500 to-amber-300 bg-clip-text text-transparent">
              {t("brand")}
            </span>
          </div>

          {/* Toggle Tabs */}
          <div className="w-full bg-muted p-1.5 rounded-2xl flex items-center mb-6 border border-border shadow-inner">
            <button
              type="button"
              onClick={() => toggleAuthMode(true)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                isLogin
                  ? "bg-card text-foreground shadow-md border border-border scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("auth.sign_in")}
            </button>
            <button
              type="button"
              onClick={() => toggleAuthMode(false)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                !isLogin
                  ? "bg-card text-foreground shadow-md border border-border scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("auth.sign_up")}
            </button>
          </div>

          {/* Dynamic Form Header */}
          <div className="mb-5">
            <h3 className="text-2xl font-black text-foreground mb-1 tracking-tight">
              {isLogin ? t("auth.welcome_back") : t("auth.create_account")}
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              {isLogin
                ? t("auth.sign_in_subtitle")
                : t("auth.sign_up_subtitle")}
            </p>
          </div>

          {/* LOGIN FORM */}
          {isLogin ? (
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-3.5"
            >
              {LoginApiError?.errors && (
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
                  <Mail
                    className={`w-4 h-4 absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground`}
                  />
                  <input
                    type="email"
                    {...loginForm.register("Email")}
                    placeholder={t("auth.email_placeholder")}
                    className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 rounded-xl bg-muted/50 border ${
                      loginForm.formState.errors.Email
                        ? "border-rose-500"
                        : "border-input"
                    } text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                  />
                </div>
                {loginForm.formState.errors.Email && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {loginForm.formState.errors.Email.message}
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
                    onClick={() => {
                      setIsForgotModalOpen(true);
                      setForgotSubmitted(false);
                      forgotForm.reset();
                    }}
                    className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                  >
                    {t("auth.forgot_password")}
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className={`w-4 h-4 absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...loginForm.register("Password")}
                    placeholder="••••••••"
                    className={`w-full ${isRtl ? "pr-10 pl-10" : "pl-10 pr-10"} py-2.5 rounded-xl bg-muted/50 border ${
                      loginForm.formState.errors.Password
                        ? "border-rose-500"
                        : "border-input"
                    } text-foreground text-sm focus:outline-none focus:border-primary`}
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
                {loginForm.formState.errors.Password && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {loginForm.formState.errors.Password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                disabled={isLoginLoading}
                type="submit"
                className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-500/20 hover:shadow-rose-500/35 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t("auth.sign_in")}</span>
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="space-y-3"
            >
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
                    {...registerForm.register("FullName")}
                    placeholder={t("auth.full_name_placeholder")}
                    className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-xl bg-muted/50 border ${
                      registerForm.formState.errors.FullName
                        ? "border-rose-500"
                        : "border-input"
                    } text-foreground text-sm focus:outline-none focus:border-primary`}
                  />
                </div>
                {registerForm.formState.errors.FullName && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {registerForm.formState.errors.FullName.message}
                  </p>
                )}
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
                    {...registerForm.register("UserName")}
                    placeholder="e.g. user_99"
                    className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-xl bg-muted/50 border ${
                      registerForm.formState.errors.UserName
                        ? "border-rose-500"
                        : "border-input"
                    } text-foreground text-sm focus:outline-none focus:border-primary`}
                  />
                </div>
                {registerForm.formState.errors.UserName && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {registerForm.formState.errors.UserName.message}
                  </p>
                )}
                {RegisterApiError?.errors?.UserName && (
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
                    {...registerForm.register("Address")}
                    placeholder={t("auth.address_placeholder")}
                    className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-xl bg-muted/50 border ${
                      registerForm.formState.errors.Address
                        ? "border-rose-500"
                        : "border-input"
                    } text-foreground text-sm`}
                  />
                </div>
                {registerForm.formState.errors.Address && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {registerForm.formState.errors.Address.message}
                  </p>
                )}
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
                    {...registerForm.register("Email")}
                    placeholder="name@example.com"
                    className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-xl bg-muted/50 border ${
                      registerForm.formState.errors.Email
                        ? "border-rose-500"
                        : "border-input"
                    } text-foreground text-sm`}
                  />
                </div>
                {registerForm.formState.errors.Email && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {registerForm.formState.errors.Email.message}
                  </p>
                )}
                {RegisterApiError?.errors?.Email && (
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
                    {...registerForm.register("Password")}
                    placeholder="••••••••"
                    className={`w-full ${isRtl ? "pr-10 pl-10" : "pl-10 pr-10"} py-2 rounded-xl bg-muted/50 border ${
                      registerForm.formState.errors.Password
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
                {registerForm.formState.errors.Password && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {registerForm.formState.errors.Password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isRegisterLoading}
                className="w-full mt-3 py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t("auth.sign_up")}</span>
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {isForgotModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 left-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!forgotSubmitted ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {t("auth.reset_password_title")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t("auth.reset_password_desc")}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={forgotForm.handleSubmit(onForgotSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">
                      {t("auth.email_address")}
                    </label>
                    <div className="relative">
                      <Mail
                        className={`w-4 h-4 absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground`}
                      />
                      <input
                        type="email"
                        {...forgotForm.register("Email")}
                        placeholder="name@example.com"
                        className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 rounded-xl bg-muted/50 border ${
                          forgotForm.formState.errors.Email
                            ? "border-rose-500"
                            : "border-input"
                        } text-foreground text-sm`}
                      />
                    </div>
                    {forgotForm.formState.errors.Email && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        {forgotForm.formState.errors.Email.message}
                      </p>
                    )}
                    {ForgetPasswordApiError?.message && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        {t("auth.forget_password_error")}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isForgetPasswordLoading}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 text-white font-bold text-sm shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {t("auth.send_reset_link")}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-foreground">
                  {t("auth.reset_sent_title")}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("auth.reset_sent_desc")}
                </p>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full mt-2 py-2.5 rounded-xl bg-muted text-foreground text-xs font-bold hover:bg-muted/80 cursor-pointer"
                >
                  {t("auth.close")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
