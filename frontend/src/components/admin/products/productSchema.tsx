import { z } from "zod";

export const createProductSchema = () =>
  z.object({
    name: z
      .string()
      .min(1, "adminProducts.form.errors.required")
      .min(2, "adminProducts.form.errors.nameMin2")
      .regex(
        /^[a-zA-Z\u0600-\u06FF]/,
        "adminProducts.form.errors.mustStartWithLetters"
      ),

    nameAr: z
      .string()
      .min(1, "adminProducts.form.errors.required")
      .min(2, "adminProducts.form.errors.nameMin2")
      .regex(
        /^[a-zA-Z\u0600-\u06FF]/,
        "adminProducts.form.errors.mustStartWithLetters"
      ),

    description: z
      .string()
      .min(1, "adminProducts.form.errors.required")
      .min(5, "adminProducts.form.errors.descMin5")
      .regex(
        /^[a-zA-Z\u0600-\u06FF]/,
        "adminProducts.form.errors.mustStartWithLetters"
      ),

    descriptionAr: z
      .string()
      .min(1, "adminProducts.form.errors.required")
      .min(5, "adminProducts.form.errors.descMin5")
      .regex(
        /^[a-zA-Z\u0600-\u06FF]/,
        "adminProducts.form.errors.mustStartWithLetters"
      ),

    price: z
      .string()
      .min(1, "adminProducts.form.errors.required")
      .refine(
        (val) => {
          const num = Number(val);
          return !Number.isNaN(num) && num > 0;
        },
        {
          message: "adminProducts.form.errors.invalidPrice",
        }
      ),

    preparingTime: z
      .string()
      .min(1, "adminProducts.form.errors.required")
      .refine(
        (val) => {
          const num = Number(val);
          return !Number.isNaN(num) && num >= 5;
        },
        {
          message: "adminProducts.form.errors.invalidPrepTimeMin5",
        }
      ),

    categoryId: z
      .string()
      .min(1, "adminProducts.form.errors.selectCategory"),

    isAvailable: z.boolean(),

    image: z.any().optional(),
  });

type ProductSchemaType = ReturnType<typeof createProductSchema>;
export type ProductFormValues = z.infer<ProductSchemaType>;