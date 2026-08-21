import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Flame } from "lucide-react";
import {
  useForgetPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
} from "@/store/features/User/Auth";
import { useNavigate } from "react-router-dom";

import { BrandBanner } from "@/components/my/Auth/BrandBanner";
import { LoginForm } from "@/components/my/Auth/LoginForm";
import { RegisterForm } from "@/components/my/Auth/RegisterForm";
import { ForgotPasswordModal } from "@/components/my/Auth/ForgotPasswordModal";
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
} from "@/components/my/Auth/useAuthSchemas";
import type { ApiError } from "@/services/baseQuery";
import type { ResponseLogin, ResponseRegister } from "@/types/types";
import { setCredentials } from "@/store/features/User/authSlice";
import { useAppDispatch } from "@/store/hooks";

export const Auth: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [Login, { isLoading: isLoginLoading, error: isLoginError }] =
    useLoginMutation();
  const [Register, { isLoading: isRegisterLoading, error: isRegisterError }] =
    useRegisterMutation();
  const [
    ForgetPassword,
    { isLoading: isForgetPasswordLoading, error: isForgetPasswordError },
  ] = useForgetPasswordMutation();

  const navigate = useNavigate();
  const RegisterApiError = isRegisterError as
    | ApiError<ResponseRegister>
    | undefined;
  const LoginApiError = isLoginError as ApiError<ResponseLogin> | undefined;
  const ForgetPasswordApiError = isForgetPasswordError as ApiError | undefined;

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const response = await Login(data).unwrap();
      console.log("Login response:", response);

      //  التأكد من وجود التوكن وحفظه في localStorage
      if (response?.data?.token) {
        dispatch(setCredentials({ token: response.data.token }));
        navigate("/");
      } else {
        console.warn("No token received in response!");
      }

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      const response = await Register(data).unwrap();
      console.log("Register response:", response);
    } catch (error) {
      console.error("Register error:", error);
      throw error; // Rethrow the error to be handled in the modal
    }
  };

  const onForgotSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await ForgetPassword(data).unwrap();
      console.log("Forgot Password response:", response);
    } catch (error) {
      console.error("Forgot Password error:", error);
      throw error; // Rethrow the error to be handled in the modal
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground p-4 lg:p-8 selection:bg-primary selection:text-primary-foreground transition-colors duration-300 relative">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-card rounded-3xl border border-border shadow-2xl overflow-hidden min-h-[680px] relative transition-colors duration-300">
        {/* Left Side Banner */}
        <BrandBanner />

        {/* Right Side Auth Container */}
        <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center bg-card text-foreground relative transition-colors duration-300">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="p-2.5 bg-primary text-primary-foreground rounded-xl shadow-md">
              <Flame className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-widest text-primary">
              {t("brand")}
            </span>
          </div>

          {/* Toggle Tabs */}
          <div className="w-full bg-muted p-1.5 rounded-2xl flex items-center mb-6 border border-border shadow-inner">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
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
              onClick={() => setIsLogin(false)}
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

          {/* Active Form */}
          {isLogin ? (
            <LoginForm
              onSubmit={onLoginSubmit}
              isLoading={isLoginLoading}
              apiError={LoginApiError}
              onOpenForgotModal={() => setIsForgotModalOpen(true)}
            />
          ) : (
            <RegisterForm
              onSubmit={onRegisterSubmit}
              isLoading={isRegisterLoading}
              apiError={RegisterApiError}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onSubmit={onForgotSubmit}
        isLoading={isForgetPasswordLoading}
        apiError={ForgetPasswordApiError}
      />
    </div>
  );
};
