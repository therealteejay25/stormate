import { z } from "zod"

export const ProductSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Product name must be at least 2 characters." })
      .max(40, { message: "Product name must be at most 40 characters." }),
    costPrice: z.coerce.number().positive("Cost price must be greater than 0."),
    sellingPrice: z.coerce.number().positive("Selling price must be greater than 0."),
    stock: z
      .coerce
      .number()
      .int("Stock must be an integer")
      .nonnegative("Stock cannot be negative."),
  })
  .refine((data) => data.sellingPrice >= data.costPrice, {
    message: "Selling price must be greater than Cost price.",
    path: ["sellingPrice"],
  })

// 👇 Export type so your EditModal can use it
export type ProductFormValues = z.infer<typeof ProductSchema>
