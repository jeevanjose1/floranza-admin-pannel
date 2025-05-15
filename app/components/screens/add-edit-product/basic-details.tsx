import { Controller, type UseFormReturn } from "react-hook-form";
import BgWrapper from "~/components/common/bg-wrapper";
import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import MediaInput from "~/components/ui/media-input";
import LexicalEditor from "~/components/ui/editor";
import AsyncSelectCustom from "~/components/ui/async-select";
import { fetcher, queryFilter } from "~/lib/utils";
import { BRAND, MATERIAL } from "~/shared/urls";
import { Textarea } from "~/components/ui/textarea";
import { SUPPLIER } from "~/shared/urls/supplier";
import { Checkbox } from "~/components/ui/checkbox";

type Props = { form: UseFormReturn<any> };

const promiseOptionsBrand = async (inputValue: string) => {
  try {
    const response = await fetcher({
      url: `${BRAND.LIST}${queryFilter({ page: 1 })}`,
      type: "get",
    });

    return response?.data?.data?.map((item: any) => ({
      value: item?.id,
      label: `${item?.name}`,
    }));
  } catch (error) {
    return [];
  }
};

const promiseOptionsHsn = async (inputValue: string) => {
  try {
    const response = await fetcher({
      url: `${SUPPLIER.LIST}${queryFilter({ page: 1 })}`,
      type: "get",
    });

    return response?.data?.data?.map((item: any) => ({
      value: item?.id,
      label: `${item?.name} - ${item?.hsn_code}`,
    }));
  } catch (error) {
    return [];
  }
};
const promiseOptionsMaterial = async (inputValue: string) => {
  try {
    const response = await fetcher({
      url: `${MATERIAL.LIST}${queryFilter({ page: 1 })}`,
      type: "get",
    });

    return response?.data?.data?.map((item: any) => ({
      value: item?.id,
      label: `${item?.name}`,
    }));
  } catch (error) {
    return [];
  }
};
const BasicDetails = ({ form }: Props) => {

  return (
    <BgWrapper>
      <div className="p-4 w-full">
        <div className="mb-5">
          <Label>Title</Label>
          <Controller
            control={form?.control}
            name="title"
            render={({ field }) => (
              <Input
                placeholder="Kurti in Soft Mul Cotton – White"
                {...field}
                type="text"
              />
            )}
          />

          <ErrorMessage
            error={form?.formState?.errors?.title?.message as string}
          />
        </div>

        <div className="mb-5">
          <Label>Description</Label>
          <Controller
            control={form?.control}
            name="description"
            render={({ field }) => (
              <Textarea
                className="h-44"
                placeholder="Type here..."
                onChange={(e) => field.onChange(e)}
              />
            )}
          />
          <ErrorMessage
            error={form?.formState?.errors?.description?.message as string}
          />
        </div>
        <div className="mb-5">
          <Label>Media</Label>
          <MediaInput form={form} />
          <ErrorMessage
            error={form?.formState?.errors?.media?.message as string}
          />
        </div>
        <div className="mb-5">
          <Label>SKU (Stock Keeping Unit)</Label>
          <Controller
            control={form.control}
            name="sku"
            render={({ field }) => {
              return (
                <Input {...field} className="" type="text" placeholder="SKU" />
              );
            }}
          />
          <ErrorMessage
            error={form?.formState?.errors?.sku?.message as string}
          />
        </div>
        <div className="mb-5">
          <Label>HSN / Supplier</Label>
          <Controller
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <AsyncSelectCustom
                cacheOptions
                onChange={(e: any) => field.onChange(e.value)}
                defaultOptions
                loadOptions={promiseOptionsHsn}
              />
            )}
          />

          <ErrorMessage
            error={form?.formState?.errors?.hsn?.message as string}
          />
        </div>
        <div className="mb-3">
          <Label>Brand</Label>
          <Controller
            control={form.control}
            name="brand"
            render={({ field }) => (
              <AsyncSelectCustom
                cacheOptions
                onChange={(e: any) => field.onChange(e.value)}
                defaultOptions
                loadOptions={promiseOptionsBrand}
              />
            )}
          />

          <ErrorMessage
            error={form?.formState?.errors?.brand?.message as string}
          />
        </div>
           <div className="mb-3">
          <Label>Material</Label>
          <Controller
            control={form.control}
            name="material"
            render={({ field }) => (
              <AsyncSelectCustom
                cacheOptions
                onChange={(e: any) => field.onChange(e.value)}
                defaultOptions
                loadOptions={promiseOptionsMaterial}
              />
            )}
          />

          
        </div>
        <div>
          <Controller
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <div className="flex items-center gap-2 rounded-sm">
                <Checkbox
                  id={`is_featured`}
                  {...field}
                  onCheckedChange={(e) => field.onChange(e)}
                />
                <Label
                  htmlFor={`is_featured`}
                  className="text-sm mb-0 cursor-pointer"
                >
                  Featured
                </Label>
              </div>
            )}
          />
        </div>
      </div>
    </BgWrapper>
  );
};

export default BasicDetails;
