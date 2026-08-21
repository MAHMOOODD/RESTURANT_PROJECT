import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, KeyRound, CheckCircle2,  XCircleIcon } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
        >
          <XCircleIcon className="w-6 h-6" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="flex items-center mt-5 gap-3 mb-4">
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

            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  {t("auth.email_address")}
                </label>
                <div className="relative">
                  <Mail className={`w-4 h-4 absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 text-muted-foreground`} />
                  <input
                    type="email"
                    {...form.register("email")}
                    placeholder="name@example.com"
                    className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 rounded-xl bg-muted/50 border ${
                      form.formState.errors.email  ? "border-rose-500" : "border-input"
                    } text-foreground text-sm`}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {form.formState.errors.email.message}
                  </p>
                )}
                {apiError?.message && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {t("auth.forget_password_error")}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
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
              onClick={handleClose}
              className="w-full mt-2 py-2.5 rounded-xl bg-muted text-foreground text-xs font-bold hover:bg-muted/80 cursor-pointer"
            >
              {t("auth.close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};