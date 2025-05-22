import { z } from "zod";


 const material_schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z
    .any()
    .refine((file) => !!file, { message: "Image is required" }),
  // slug: z.string().min(1, "Slug is required"),
  meta_title: z.string().min(1, "Meta title is required"),
  meta_description: z.string().min(1, "Meta description is required"),
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
  }),
});

export { 
    material_schema
}