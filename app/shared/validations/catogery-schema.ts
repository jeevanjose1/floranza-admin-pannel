import { z } from "zod";

const category_schema = z.object({
  description: z.string().min(1, "Description is required"),
  image: z
  .any()
  .refine((file) => !!file, { message: "Image is required" }),
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  status: z.enum(["active", "inactive"]),
  meta_title: z.string().min(1, "Meta title is required"),
  meta_description: z.string().min(1, "Meta description is required"),
});

export { category_schema };
