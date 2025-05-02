import { useForm } from "react-hook-form";
import BasicDetails from "./basic-details";
import Price from "./price";
import Seo from "./seo";
import Status from "./status";
import CatogerySelect from "./catogery-select";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { product_form_schema } from "~/shared/validations";
import { useCreateProduct } from "~/services/queries";
import { toast } from "sonner";
import Advance from "./advance";
import dayjs from "dayjs";

type Props = {};
type FormValues = z.infer<typeof product_form_schema>;

export default function ProductForm({}: Props) {
  const { mutateAsync: add_product, isPending } = useCreateProduct();

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      media: [],
      sku: "",
      supplier: "",
      brand: "",
      catogery: "",
      price: "",
      sale_price: "",
      quandity: "",
      is_schedule: false,
      shedule_date: "",
      shedule_time: "",

      weight: "",
      is_featured: false,
      length: "",
      width: "",
      height: "",
      stock_notification: false,
      notification_qty: "",
      page_title: "",
      page_description: "",
      status: "",
      categories: [],
      catogery_search: "",
      is_variants: false,
      attributes: [
        {
          name: "",
          value: [""],
          is_add: false,
        },
      ],
      attribute_items: [],
      variations: [],
    },
    resolver: zodResolver(product_form_schema as any),
  });

  const handleAdd = (values: FormValues) => {
    console.log(values);
    const schedule_date = dayjs(values.shedule_date).format("YYYY-MM-DD");
    const schedule_time = `${values.shedule_time}:00`;

    const slug =
      values.slug !== ""
        ? values.slug?.toLowerCase().replace(/[\s-]+/g, "-")
        : values.title?.toLowerCase().replace(/[\s-]+/g, "-");

    const form_data = new FormData();
    form_data.append("name", values.title);
    form_data.append("slug", slug as string);
    form_data.append("description", values.description);
    form_data.append("sku", values.sku);
    form_data.append("supplier", values.supplier);
    form_data.append("brand", values.brand);

    form_data.append("status", "1");
    form_data.append(`category`, JSON.stringify(values.categories));
    form_data.append("is_variation", values.is_variants ? "1" : "0");

    if (values.is_schedule) {
      form_data.append("is_scheduled", values.is_schedule ? "1" : "0");
      form_data.append("scheduled_at", `${schedule_date} ${schedule_time}`);
    }

    if (!values.is_variants) {
      form_data.append("reg_price", values.price as string);
      form_data.append("sale_price", values.sale_price as string);
      form_data.append("qty", values.quandity as string);
    }
    form_data.append("is_notify_stock", values.stock_notification ? "1" : "0");
    form_data.append("notify_qty", values.notification_qty as string);
    form_data.append("ship_weight", values.weight);
    form_data.append("ship_length", values.length);
    form_data.append("ship_width", values.width);
    form_data.append("ship_height", values.height);
    form_data.append("is_featured", values.is_featured ? "1" : "0");

    const media = values.media?.map((e) => {
      return e.file;
    });
    form_data.append(`media`, JSON.stringify(media));
    form_data.append("meta_title", values.page_title);
    form_data.append("meta_des", values.page_description);

    if (values.is_variants) {
      const variation_data = values?.variations?.map((item) => {
        return {
          attribute_id: item.attribute_id?.split(","),
          attribute_option_id: item.value_id?.split(","),
          reg_price: item.price,
          sale_price: item.salesPrice,
          qty: item.quantity,
          is_unlimited_qty:item?.qty_infinity ? 1:0,
          option_title:item?.new_title
        };
      });

      form_data.append(`variations`, JSON.stringify(variation_data));
    }

    add_product(form_data, {
      onSuccess: () => {
        toast.success("Product added");
      },
      onError: (error: any) => {
        toast.error(error.data?.message);
      },
    });
  };
  return (
    <div className="">
      <form
        onSubmit={form?.handleSubmit(handleAdd)}
        action=""
        className="flex w-full gap-3 "
      >
        <div className="flex-1/2 grid gap-3">
          <BasicDetails form={form} />
          <Price form={form} />
          <Seo form={form} />
          <Advance form={form} />
          <div className="flex justify-end gap-3">
            <Button loading={isPending} variant={"secondary"} type="submit">
              Save
            </Button>
          </div>
        </div>
        <div className="flex-1/12 flex flex-col gap-3 sticky top-12">
          <Status form={form} />
          <CatogerySelect form={form} />
        </div>
      </form>
    </div>
  );
}
