import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as z from "zod";

export const useAuthSchemas = () => {
  const { t, i18n } = useTranslation();

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
    [i18n.language, t]
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
    [i18n.language, t]
  );

  return { loginSchema, registerSchema, forgotPasswordSchema };
};

export type LoginFormData = z.infer<ReturnType<typeof useAuthSchemas>["loginSchema"]>;
export type RegisterFormData = z.infer<ReturnType<typeof useAuthSchemas>["registerSchema"]>;
export type ForgotPasswordFormData = z.infer<ReturnType<typeof useAuthSchemas>["forgotPasswordSchema"]>;