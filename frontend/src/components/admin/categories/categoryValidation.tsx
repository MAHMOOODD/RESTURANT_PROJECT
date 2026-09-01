import { z } from "zod";

const noNumberStartRegex = /^[^0-9]/;

export const addCategorySchema = z.object({
  name: z
    .string()
    .min(1, "errors.required")
    .min(3, "errors.nameMin")
    .refine((val) => noNumberStartRegex.test(val), {
      message: "errors.noStartNumber",
    }),
  nameAr: z
    .string()
    .min(1, "errors.required")
    .min(3, "errors.nameMin")
    .refine((val) => noNumberStartRegex.test(val), {
      message: "errors.noStartNumber",
    }),
  imageUrl: z
    .custom<File>((val) => val instanceof File, "errors.imageRequired")
    .refine(
      (file) =>
        !file ||
        (file instanceof File),
      "errors.invalidImage"
    ),
});

export const editCategorySchema = z.object({
  name: z
    .string()
    .min(1, "errors.required")
    .min(3, "errors.nameMin")
    .refine((val) => noNumberStartRegex.test(val), {
      message: "errors.noStartNumber",
    }),
  nameAr: z
    .string()
    .min(1, "errors.required")
    .min(3, "errors.nameMin")
    .refine((val) => noNumberStartRegex.test(val), {
      message: "errors.noStartNumber",
    }),
  imageUrl: z
    .custom<File | null>((val) => val === null || val === undefined || val instanceof File)
    .refine(
      (file) =>
        !file ||
        (file instanceof File),
      "errors.invalidImage"
    )
    .optional(),
});

export type AddCategoryFormValues = z.infer<typeof addCategorySchema>;
export type EditCategoryFormValues = z.infer<typeof editCategorySchema>;