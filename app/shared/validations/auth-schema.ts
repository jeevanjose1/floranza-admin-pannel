import { z } from "zod";


const login_schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export {
    login_schema
}
