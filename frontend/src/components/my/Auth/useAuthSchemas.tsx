import * as z from "zod";

export const useAuthSchemas = () => {
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, "auth.email_required")
      .email("auth.email_invalid"),
    password: z.string().min(1, "auth.password_required"),
    remember: z.boolean().optional(),
  });

  const registerSchema = z.object({
    fullName: z.string().optional(),
    address: z.string().optional(),
    userName: z.string().min(1, "auth.username_required"),
    email: z
      .string()
      .min(1, "auth.email_required")
      .email("auth.email_invalid"),
    password: z
      .string()
      .min(6, "auth.password_min")
      .regex(/[0-9]/, "auth.password_digit")
      .regex(/[a-z]/, "auth.password_lowercase")
      .regex(/[A-Z]/, "auth.password_uppercase")
      .regex(/[^a-zA-Z0-9]/, "auth.password_special"),
  });

  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, "auth.email_required")
      .email("auth.email_invalid"),
  });

  return { loginSchema, registerSchema, forgotPasswordSchema };
};

export type LoginFormData = z.infer<ReturnType<typeof useAuthSchemas>["loginSchema"]>;
export type RegisterFormData = z.infer<ReturnType<typeof useAuthSchemas>["registerSchema"]>;
export type ForgotPasswordFormData = z.infer<ReturnType<typeof useAuthSchemas>["forgotPasswordSchema"]>;