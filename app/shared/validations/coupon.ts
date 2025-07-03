import { z } from "zod";

export const coupone_schema = z.object({
  amount: z.string().min(1, "amount is required"),
 
});