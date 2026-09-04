// src/components/cashier/orders/cashierOrderStatusSchema.ts
import { z } from "zod";
import type { TFunction } from "i18next";
import { OrderStatus, PaymentStatus } from "@/types/types";

const ORDER_STATUS_VALUES = [
  OrderStatus.pending,
  OrderStatus.processing,
  OrderStatus.shipped,
  OrderStatus.delivered,
  OrderStatus.cancelled,
] as const;

const PAYMENT_STATUS_VALUES = [
  PaymentStatus.pending,
  PaymentStatus.completed,
  PaymentStatus.failed,
  PaymentStatus.refunded,
] as const;

export const buildOrderStatusSchema = (t: TFunction) =>
  z.object({
    status: z.coerce
      .number()
      .refine((v): v is OrderStatus => (ORDER_STATUS_VALUES as readonly number[]).includes(v), {
        message: t("adminOrders.errors.required"),
      }),
    paymentStatus: z.coerce
      .number()
      .refine((v): v is PaymentStatus => (PAYMENT_STATUS_VALUES as readonly number[]).includes(v), {
        message: t("adminOrders.errors.required"),
      }),
  });

export type OrderStatusFormInput = z.input<ReturnType<typeof buildOrderStatusSchema>>;
export type OrderStatusFormValues = z.output<ReturnType<typeof buildOrderStatusSchema>>;