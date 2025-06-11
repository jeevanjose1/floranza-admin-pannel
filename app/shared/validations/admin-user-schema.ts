import { z } from "zod";
const admin_user_schema = z
  .object({
    user_name: z
      .string()
      .min(1, "User name is required")
      .min(2, "User name must be at least 2 characters")
      .max(50, "User name must not exceed 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z.string().optional(), // make it optional here by default
    role: z.string().min(1, "Role is required"),
    status: z.string().optional(),
    is_edit: z.boolean().optional(), // include `edit` as a flag
  })
  .superRefine((data, ctx) => {
    if (!data.is_edit && !data.password) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Password is required",
      });
    }
  });

export { admin_user_schema };
