// src/schemas/cashierOrderSchema.ts
import { z } from "zod";
import type { TFunction } from "i18next";

export const buildCashierOrderSchema = (t: TFunction, total: number) =>
  z
    .object({
      customerMode: z.enum(["guest", "registered"]),
      guestName: z.string().optional(),
      guestPhone: z.string().optional(),
      customerId: z.string().optional(),
      couponCode: z.string().optional(),
      amountPaid: z.coerce
        .number({ invalid_type_error: t("cashierPos.cart.errors.amountRequired") })
        .nonnegative({ message: t("cashierPos.cart.errors.amountRequired") }),
    })
    .superRefine((data, ctx) => {
      if (data.customerMode === "guest") {
        if (!data.guestName || data.guestName.trim().length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["guestName"],
            message: t("cashierPos.cart.errors.guestNameRequired"),
          });
        }
        if (data.guestPhone?.trim() && !/^01[0125][0-9]{8}$/.test(data.guestPhone.trim())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["guestPhone"],
            message: t("cashierPos.cart.errors.phonePattern"),
          });
        }
      } else if (!data.customerId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["customerId"],
          message: t("cashierPos.cart.errors.customerRequired"),
        });
      }

      if (data.amountPaid < total) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["amountPaid"],
          message: t("cashierPos.cart.errors.amountTooLow"),
        });
      }
    });

export type CashierOrderFormValues = z.infer<ReturnType<typeof buildCashierOrderSchema>>;