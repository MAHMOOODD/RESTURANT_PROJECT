import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, KeyRound, CheckCircle2, XCircleIcon } from "lucide-react";
import { useAuthSchemas, type ForgotPasswordFormData } from "./useAuthSchemas";
import type { ApiError } from "@/services/baseQuery";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  isLoading: boolean;
  apiError?: ApiError;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  apiError,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPasswordSchema } = useAuthSchemas();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  if (!isOpen) return null;

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    await onSubmit(data);
    if (!apiError) {
      setIsSubmitted(true);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    form.reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 sm:p-8">
      <div className="bg-card border-2 border-border rounded-3xl p-8 sm:p-10 w-full max-w-lg shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-6 left-6 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
        >
          <XCircleIcon className="w-8 h-8" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="flex items-center mt-4 gap-4 mb-6">
              <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl">
                <KeyRound className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground">
                  {t("auth.reset_password_title")}
                </h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  {t("auth.reset_password_desc")}
                </p>
              </div>
            </div>

            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-bold text-foreground">
                  {t("auth.email_address")}
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
                      form.formState.errors.email
                        ? "border-rose-500"
                        : "border-input"
                    } text-foreground text-base sm:text-lg font-medium`}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-xs sm:text-sm text-rose-500 font-bold">
                    {form.formState.errors.email.message}
                  </p>
                )}
                {apiError?.message && (
                  <p className="text-xs sm:text-sm text-rose-500 font-bold">
                    {t("auth.forget_password_error")}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 text-white font-extrabold text-base sm:text-lg shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.98] transition-all"
              >
                {t("auth.send_reset_link")}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-foreground">
              {t("auth.reset_sent_title")}
            </h4>
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
              {t("auth.reset_sent_desc")}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="w-full mt-4 py-3.5 rounded-2xl bg-muted text-foreground text-sm sm:text-base font-extrabold hover:bg-muted/80 cursor-pointer transition-colors"
            >
              {t("auth.close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
