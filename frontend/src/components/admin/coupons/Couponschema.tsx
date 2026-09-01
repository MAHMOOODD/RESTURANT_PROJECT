// المسار المقترح: src/components/admin/coupons/Couponschema.tsx
import { z } from "zod";
import type { GetCouponDto } from "@/types/types";

// الـ Schema ثابتة ولا تعتمد على دالة t مباشرة، نفس نمط createOrderStatusSchema.
// كل رسائل الأخطاء هنا هي "مفاتيح ترجمة" فقط، وبيتم ترجمتها فعلياً عند الرندرة
// جوه الـ Dialog (translatedErrors) مش هنا، عشان كده منعرفش نستخدم useTranslation جوه ملف الـ schema.
export const createCouponSchema = () =>
  z.object({
    code: z
      .string()
      .trim()
      .min(1, { message: "adminCoupons.form.errors.codeRequired" })
      .min(3, { message: "adminCoupons.form.errors.codeMin" })
      .max(20, { message: "adminCoupons.form.errors.codeMax" })
      .regex(/^[A-Za-z0-9]+$/, {
        message: "adminCoupons.form.errors.codePattern",
      })
      .transform((val) => val.toUpperCase()),

    discount: z
      .number({ invalid_type_error: "adminCoupons.form.errors.invalidDiscount" })
      .min(0, { message: "adminCoupons.form.errors.discountRange" })
      .max(99, { message: "adminCoupons.form.errors.discountRange" }),

    minimumAmount: z
      .number({
        invalid_type_error: "adminCoupons.form.errors.invalidMinimumAmount",
      })
      .min(1, { message: "adminCoupons.form.errors.minimumAmountRange" }),
  });

type CouponSchemaType = ReturnType<typeof createCouponSchema>;
export type CouponFormValues = z.infer<CouponSchemaType>;

// قيم افتراضية موحدة للفورم سواء في وضع الإضافة (coupon = null) أو التعديل
export const getInitialCouponValues = (
  coupon?: GetCouponDto | null,
): CouponFormValues => ({
  code: coupon?.code ?? "",
  discount: coupon?.discount ?? 0,
  minimumAmount: coupon?.minimumAmount ?? 1,
});
