import { z } from "zod";
import { OrderStatus, PaymentStatus } from "@/types/types";
import type {
  OrderStatus as OrderStatusType,
  PaymentStatus as PaymentStatusType,
} from "@/types/types";

export const STATUS_OPTIONS: { value: OrderStatusType; labelKey: string }[] = [
  { value: OrderStatus.pending, labelKey: "adminOrders.statusTypes.pending" },
  { value: OrderStatus.processing, labelKey: "adminOrders.statusTypes.processing" },
  { value: OrderStatus.shipped, labelKey: "adminOrders.statusTypes.shipped" },
  { value: OrderStatus.delivered, labelKey: "adminOrders.statusTypes.delivered" },
  { value: OrderStatus.cancelled, labelKey: "adminOrders.statusTypes.cancelled" },
];

export const PAYMENT_OPTIONS: { value: PaymentStatusType; labelKey: string }[] = [
  { value: PaymentStatus.pending, labelKey: "adminOrders.paymentTypes.pending" },
  { value: PaymentStatus.completed, labelKey: "adminOrders.paymentTypes.completed" },
  { value: PaymentStatus.failed, labelKey: "adminOrders.paymentTypes.failed" },
  { value: PaymentStatus.refunded, labelKey: "adminOrders.paymentTypes.refunded" },
];

export const createOrderStatusSchema = () =>
  z.object({
    status: z
      .number()
      .refine((val) => STATUS_OPTIONS.some((s) => s.value === val), {
        message: "adminOrders.errors.required",
      }),
    paymentStatus: z
      .number()
      .refine((val) => PAYMENT_OPTIONS.some((p) => p.value === val), {
        message: "adminOrders.errors.required",
      }),
  });

type OrderStatusSchemaType = ReturnType<typeof createOrderStatusSchema>;
export type OrderStatusFormValues = z.infer<OrderStatusSchemaType>;