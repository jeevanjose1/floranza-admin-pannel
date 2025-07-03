import { z } from "zod";

const slider_schema = z.object({
  title: z.string().min(1, "Title is required"),
  sub_title: z.string().min(1, "Subtitle is required"),
  show_btn: z.boolean().default(false),
  btn_title: z.string().optional(),
  btn_url: z.string().optional(),
  media: z.array(z.any()).min(1, "Image is required"),
  order:z.string().optional(),
}).refine((data) => {
  if (data.show_btn) {
    return !!data.btn_title && !!data.btn_url;
  }
  return true;
}, {
  message: "Button title and URL are required when show button is enabled",
  path: ["btn_title"]
});
export {slider_schema}