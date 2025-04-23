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
      hsn: "",
      catogery: "",
      price: "",
      sale_price: "",
      quandity: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      stock_notification: false,
      notification_qty: "",
      page_title: "",
      page_description: "",
      status: '',
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

 console.log('====================================');
 console.log(form.formState.errors);
 console.log('====================================');
  const handleAdd = (values: FormValues) => {
    const form_data = new FormData();
    form_data.append("name", values.title);
    form_data.append("slug", values.slug);
    form_data.append("description", values.description);
    form_data.append("sku", values.sku);
    form_data.append("hsn", values.hsn);
    form_data.append("status", "1");
    form_data.append(`category`, JSON.stringify(values.categories));
    form_data.append("is_variation", values.is_variants ? "1" : "0");
    if(!values.is_variants){
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
    <div className="container-md">
      <form
        onSubmit={form?.handleSubmit(handleAdd)}
        action=""
        className="flex w-full gap-3 "
      >
        <div className="flex-1/2 grid gap-3">
          <BasicDetails form={form} />
          <Price form={form} />
          <Seo form={form} />
          <div className="flex justify-end">
            <Button loading={isPending} type="submit">
              Add Product
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
