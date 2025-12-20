import { z } from "zod";

export const coupone_schema = z
  .object({
    code: z.string().min(1, "Coupon code is required"),
    type: z.string().optional(),
    coupon_type: z.string().optional(),
    end_date: z.string().optional(),
    value: z.coerce.number({
      required_error: "Coupon value is required",
      invalid_type_error: "Coupon value must be a number",
    }).min(1, "Coupon value must be greater than 0"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "percent" && data.value >= 90) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Percentage value must be less than 90",
        path: ["value"],
      });
    }

    if (data.coupon_type === "promotion" && (!data.end_date || data.end_date.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date is required for promotion type",
        path: ["end_date"],
      });
    }
  });
