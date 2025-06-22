import { z } from "zod";

const size_chart_schema = z.object({
  name: z.string().min(1, "Name is required"),
  head: z
    .array(z.any())
    .min(1, "At least one head is required"),
  row: z
    .array(z.any())
    .min(1, "At least one row is required"),
  status: z.string().optional(),
});

export {
    size_chart_schema
}