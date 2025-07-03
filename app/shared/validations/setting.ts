import { z } from "zod";

const profile_schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
 password: z
    .string()
    .refine((val) => val === "" || val.length >= 8, {
      message: "Password must be at least 8 characters"
    })
    .refine((val) => val === "" || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val), {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    })
});


export  {profile_schema}