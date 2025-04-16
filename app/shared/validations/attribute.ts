import { z } from "zod";

export const attributeValueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().min(1, "Description is required"),
  display_order: z.number(),
  status: z.enum(['Active', 'Inactive']),
});

export const formSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  status: z.string().optional(),
  values: z
    .array(attributeValueSchema)
    .min(1, "At least one attribute value is required"),
});
