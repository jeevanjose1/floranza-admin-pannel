import { z } from "zod";


 const brand_schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z.any().optional(),

  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
  }),
});

export { 
    brand_schema
}