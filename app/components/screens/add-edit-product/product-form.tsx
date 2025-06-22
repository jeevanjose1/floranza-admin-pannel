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
import Shipping from "./shipping";
import PreBook from "./pre-book";
import { useSingleProduct, useUpdateProduct } from "~/services/queries/product";
import {, useParams } from "react-router";
import SelectSizeChart from "./select-size-chart";

type Props = {};
type FormValues = z.infer<typeof product_form_schema>;

export default function ProductForm({}: Props) {
  const params = useParams() as any;
  const { data } = useSingleProduct(params?.product_id);

  const { mutateAsync: add_product, isPending: addPending } =
    useCreateProduct();
  const { mutateAsync: edit_product, isPending: editPending } =
    useUpdateProduct();
  const product = data?.data;
  const media = product?.images?.map((item: any) => {
    return { url: item?.large, file: item?.name };
  });

  const variations = product?.variations?.map((item: any, index: number) => {
    return {
      id: index,
      attribute_id: item?.attribute_id,
      value_id: item?.attribute_option_id,
      name: `${item?.attribute_name}: ${item?.attribute_option_name}`,
      new_title: "",
      price: item?.reg_price,
      salesPrice: item?.sale_price,
      quantity: item?.qty,
      qty_infinity: item?.is_unlimited_qty,
      isEditing: false,
      tempNewTitle: item?.option_title,
      prd_var_value_id: item?.prd_var_value_id,

    };
  });
  const attribute = () => {
    const attributesMap = new Map();
    product?.variations?.forEach((item: any) => {
      const id = item.attribute_id;
      if (!attributesMap.has(id)) {
        attributesMap.set(id, {
          is_add: true,
          name: item.attribute_name,
          id: id,
          value: [],
        });
      }
      const attr = attributesMap.get(id);
      attr.value.push({
        value: item.attribute_option_id,
        label: item.attribute_option_name,
      });
    });

    // Convert the map to an array
    const attributes = Array.from(attributesMap.values());
    return attributes;
  };

  const catogeries = product?.product_categories?.map((item: any) => {
    return item?.category_id;
  });

  const form = useForm<FormValues>({
    values: {
      order: product?.display_order || "",
      title: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      size_chart:product?.size_chart_id||'',
      media: media || [],
      sku: product?.sku || "",
      supplier: product?.supplier_id || "",
      brand: product?.brand_id || "",
      catogery: "",
      price: JSON.stringify(product?.reg_price) || "",
      sale_price: JSON.stringify(product?.sale_price) || "",
      quandity: JSON.stringify(product?.qty) || "",
      is_schedule: product?.is_scheduled === 1 ? true : false || false,
      is_prebook: product?.is_pre_order === 1 ? true : false || false,
      prebook_date: product?.pre_end_at?.split(" ")?.[0] || "",
      prebook_time: product?.pre_end_at?.split(" ")?.[1] || "",
      shedule_date: product?.scheduled_at?.split(" ")?.[0] || "",
      shedule_time: product?.scheduled_at?.split(" ")?.[1] || "",
      material: product?.material_id || "",
      weight: product?.ship_weight || "",
      is_featured: product?.is_featured === 1 ? true : false || false,
      is_free_shipping: product?.free_shipping === 1 ? true : false || false,
      length: product?.ship_length || "",
      width: product?.ship_width || "",
      height: product?.ship_height || "",
      stock_notification: product?.notify_qty > 0 ? true : false || false,
      notification_qty: product?.notify_qty || "",
      page_title: product?.meta_title || "",
      page_description: product?.meta_des || "",
      status: JSON.stringify(product?.status) || "",
      categories: catogeries || [],
      catogery_search: "",
      is_variants: product?.is_variation === 1 ? true : false || false,
      attributes: attribute() || [
        {
          name: "",
          value: [""],
          is_add: false,
        },
      ],
      attribute_items: [],
      variations: variations || [],
    },
    resolver: zodResolver(product_form_schema as any),
  });
 
  const handleAdd = (values: FormValues) => {
    const schedule_date = values.shedule_date;
    const schedule_time = `${values.shedule_time}`;
    const prebook_date = values.prebook_date;
    const prebook_time = `${values.prebook_time}`;
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
    form_data.append("brand", values.brand as string);
    form_data.append("material", values.material as string);
    form_data.append("status", values.status as string);
    form_data.append(`category`, JSON.stringify(values.categories));
    form_data.append("free_shipping", values.is_free_shipping ? "1" : "0");
    form_data.append("size_chart_id", values.size_chart);

    form_data.append("is_variation", values.is_variants ? "1" : "0");

    if (values.is_schedule) {
      form_data.append("is_scheduled", values.is_schedule ? "1" : "0");
      form_data.append("scheduled_at", `${schedule_date} ${schedule_time}`);
    }
    if (params?.product_id && values.order) {
      form_data.append("display_order", values.order);
    }
    if (values.is_prebook) {
      form_data.append("is_pre_order", values.is_prebook ? "1" : "0");
      form_data.append("pre_end_at", `${prebook_date} ${prebook_time}`);
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
    form_data.append("meta_title", values.page_title as string);
    form_data.append("meta_des", values.page_description as string);

    if (values.is_variants) {
      const variation_data = values?.variations?.map((item) => {
        return {
          attribute_id: item.attribute_id?.split(","),
          attribute_option_id: item.value_id?.split(","),
          reg_price: item.price,
          sale_price: item.salesPrice,
          qty: item.quantity,
          is_unlimited_qty: item?.qty_infinity ? 1 : 0,
          option_title: item?.new_title,
          prd_var_value_id: item?.prd_var_value_id
            ? item?.prd_var_value_id
            : null,
        };
      });

      form_data.append(`variations`, JSON.stringify(variation_data));
    }

    if (params?.product_id) {
      edit_product(
        { data: form_data, id: params?.product_id },
        {
          onSuccess: () => {
            toast.success("Product updated");
          },
          onError: (error: any) => {
            toast.error(error.data?.message);
          },
        }
      );
    } else {
      add_product(form_data, {
        onSuccess: () => {
          toast.success("Product added");
        },
        onError: (error: any) => {
          toast.error(error.data?.message);
        },
      });
    }
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
          <Shipping control={form?.control} formState={form?.formState} />

          <Seo form={form} />
          <Advance form={form} />
          <div className="flex justify-end gap-3">
            <Button
              loading={addPending || editPending}
              variant={"secondary"}
              type="submit"
            >
              Save
            </Button>
          </div>
        </div>
        <div className="flex-1/12 flex flex-col gap-3 sticky top-12">
          <Status form={form} />
          <CatogerySelect form={form} />
          <SelectSizeChart form={form} />
          <PreBook form={form} />
        </div>
      </form>
    </div>
  );
}

const f = [
  {
    attribute_id: "8378c2e6-73c1-4616-8b4e-b6701fa65a3b",
    attribute_option_id: ["357b2665-cbee-4507-ba8f-dcbbf9151aff"],
    reg_price: 4,
    sale_price: 4,
    qty: 2,
    is_unlimited_qty: 0,
    option_title: "",
    prd_var_value_id: "028beb31-110d-475f-8cb6-a974746ae3b6",
  },
  {
    attribute_id: "8378c2e6-73c1-4616-8b4e-b6701fa65a3b",
    attribute_option_id: ["80745e27-22c5-4d0a-9e15-daee6af704e9"],
    reg_price: 4,
    sale_price: 4,
    qty: 0,
    is_unlimited_qty: 0,
    option_title: "",
    prd_var_value_id: "d3ef987b-fcc0-44ae-ba5c-314a0a601d9e",
  },
];
