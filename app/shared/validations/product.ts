import { z } from "zod";

// Attribute schema for variant mode
const attribute_schema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  value: z
    .array(z.union([z.string(), z.object({}).passthrough()]))
    .min(1, "At least one value is required"),
  is_add: z.boolean().default(false),
});

const product_form_schema = z
  .object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    media: z.array(z.any()).min(1, "Media is required"),
    sku: z.string().min(1, "SKU is required"),
    supplier: z.string().min(1, "HSN / Supplier is required"),
    brand: z.string().optional(),
    catogery: z.string().optional(),
    price: z.string().optional(),
    sale_price: z.string().optional(),
    quandity: z.string().optional(),
    weight: z.string().min(1, "Weight is required"),
    length: z.string().min(1, "Length is required"),
    width: z.string().min(1, "Width is required"),
    height: z.string().min(1, "Height is required"),
    stock_notification: z.boolean().default(false),
    is_schedule: z.boolean().default(false),
    is_free_shipping: z.boolean().default(false),

    is_prebook: z.boolean().default(false),
    shedule_date: z.string().optional(),
    shedule_time: z.string().optional(),
    prebook_date: z.string().optional(),
    prebook_time: z.string().optional(),
    material: z.string().optional(),
    is_featured: z.boolean().default(false),
    page_title: z.string().optional(),
    page_description: z.string().optional(),
    status: z.string().optional(),
    categories: z.array(z.any()).min(1, "Category is required"),
    catogery_search: z.string().optional(),
    is_variants: z.boolean().default(false),
    attributes: z.any().optional(), // NOTE: no schema yet
    attribute_items: z.any().optional(),
    notification_qty: z.any().optional(),
    variations: z.array(z.any()),
    order: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data?.is_schedule) {
      if (!data.shedule_date?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Schedule date is required",
          path: ["shedule_date"],
        });
      }

      if (!data.shedule_time?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Schedule time is required",
          path: ["shedule_time"],
        });
      }
    }

    if (data?.is_prebook) {
      if (!data.prebook_date?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pre book date is required",
          path: ["prebook_date"],
        });
      }

      if (!data.prebook_time?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pre book time is required",
          path: ["prebook_time"],
        });
      }
    }
    if (!data.is_variants) {
      // Validate flat product
      if (!data.price?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Price is required",
          path: ["price"],
        });
      }
      if (!data.sale_price?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sale price is required",
          path: ["sale_price"],
        });
      }
      if (!data.quandity?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "quantity is required",
          path: ["quandity"],
        });
      }
    } else {
      // Validate variant attributes
      if (!Array.isArray(data.attributes) || data.attributes.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one attribute is required",
          path: ["attributes"],
        });
      } else {
        data.attributes.forEach((attr, index) => {
          const result = attribute_schema.safeParse(attr);
          if (!result.success) {
            result.error.issues.forEach((issue) => {
              ctx.addIssue({
                ...issue,
                path: ["attributes", index, ...issue.path],
              });
            });
          }
        });
      }
    }
  });

const qty_schema = z.object({
  qty: z.string().min(1, "Atleast one qty is required"),
});

export { product_form_schema ,qty_schema};
