import { Controller, type UseFormReturn } from "react-hook-form";
import BgWrapper from "~/components/common/bg-wrapper";
import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import MediaInput from "~/components/ui/media-input";
import AsyncSelectCustom from "~/components/ui/async-select";
import { fetcher, queryFilter } from "~/lib/utils";
import { BRAND, MATERIAL } from "~/shared/urls";
import { SUPPLIER } from "~/shared/urls/supplier";
import { Checkbox } from "~/components/ui/checkbox";
import { useEffect, useState } from "react";
import Editor from "~/components/ui/editor";

type Props = { form: UseFormReturn<any> };

// Define option type for clarity
type SelectOption = { value: string; label: string; is_hsn?: boolean };

const promiseOptionsBrand = async () => {
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

const promiseOptionsHsn = async () => {
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

const promiseOptionsMaterial = async () => {
  try {
    const response = await fetcher({
      url: `${MATERIAL.LIST_IN_PRODUCT}${queryFilter({ page: 1 })}`,
      type: "get",
    });

    return response?.data?.data?.map((item: any) => ({
      value: item?.id,
      label: `${item?.name}`,
    }))

  } catch (error) {
    return [];
  }
};

const BasicDetails = ({ form }: Props) => {
  // State to store the full option objects for each select
  const [brandOptions, setBrandOptions] = useState<SelectOption[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<SelectOption[]>([]);
  const [materialOptions, setMaterialOptions] = useState<SelectOption[]>([]);

  // Load options on component mount
  useEffect(() => {
    const loadInitialOptions = async () => {
      const brands = await promiseOptionsBrand();
      const suppliers = await promiseOptionsHsn();
      const materials = await promiseOptionsMaterial();

      setBrandOptions(brands);
      setSupplierOptions(suppliers);
      setMaterialOptions(materials);
    };

    loadInitialOptions();
  }, []);

  // Helper function to find the full option object by value
  const getOptionByValue = (
    options: SelectOption[],
    value: any,
  ): SelectOption | null => {
    if (!value) return null;
    return options.find((option) => option.value === value) || null;
  };

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
              <Editor
                {...field}
                value={field.value}
                onContentChange={(e) => field.onChange(e)}
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
          <Label>SKU (Stock Keeping Unit / Product Code)</Label>
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
                value={getOptionByValue(supplierOptions, field.value)}
                cacheOptions
                onChange={(selectedOption: any) =>
                  field.onChange(selectedOption?.value)
                }
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
                value={getOptionByValue(brandOptions, field.value)}
                cacheOptions
                onChange={(selectedOption: any) =>
                  field.onChange(selectedOption?.value)
                }
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
                value={getOptionByValue(materialOptions, field.value)}
                cacheOptions
                onChange={(selectedOption: any) =>
                  field.onChange(selectedOption?.value)
                }
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
                  
                  checked={field.value}
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
