import React from "react";
import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form";
import AsyncSelectCustom from "~/components/ui/async-select";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import ErrorMessage from "~/components/ui/error-message";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import ProductVariationsTable from "./product-variation-table";
import { ATTRIBUTE } from "~/shared/urls";
import { fetcher, queryFilter } from "~/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import SelectCustom from "~/components/ui/custom-select";

type Props = { form: UseFormReturn<any> };

const attribute_options = async (inputValue: string) => {
  try {
    const response = await fetcher({
      url: `${ATTRIBUTE.LIST}${queryFilter({ page: 1, search: inputValue })}`,
      type: "get",
    });
    return response?.data?.map((item: any) => ({
      value: item?.id,
      label: item?.name,
      items: item?.attribute_options,
    }));
  } catch (error) {
    return [];
  }
};

function VariantsSelect({ form }: Props) {
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const item_options = (attribute: any) => {
    if (!attribute) return [];

    return (
      form.watch("attribute_items")?.map((item: any) => ({
        value: item?.id,
        label: item?.name,
      })) || []
    );
  };

  const appendAttribute = () => {
    append({
      name: "",
      id: "",
      is_add: false,
      value: [],
    });
  };

  const addAttribute = (index: number, rest: any) => {
    update(index, {
      is_add: true,
      ...rest,
    });
  };

  const addRevert = (index: number, rest: any) => {
    update(index, {
      is_add: false,
      ...rest,
    });
  };

  const removeAttribute = (index: number) => {
    remove(index);
  };

  return (
    <div className="w-full">
      <div className="flex w-full justify-between mb-4 items-center">
        <h1 className="text-sm font-semibold">Attributes</h1>
        <Button onClick={appendAttribute} size="sm" variant="secondary">
          Add attribute
        </Button>
      </div>
      <div className="border border-muted-foreground/20 rounded-md">
        {fields?.map((item, index) => {
          const current_item = form.watch("attributes")[index];
          return (
            <React.Fragment key={item.id}>
              {!current_item?.is_add ? (
                <div className="p-4 w-full">
                  <div className="mb-4 w-full">
                    <Label>Select attribute</Label>
                    <Controller
                      control={form.control}
                      name={`attributes.${index}`}
                      render={({ field }) => (
                        <AsyncSelectCustom
                          onChange={(selected: any) => {
                        ;

                            if (selected) {
                              form.setValue(`attributes.${index}`, {
                                ...current_item,
                                name: selected.label,
                                id: selected.value,
                                value: [], // Reset value when attribute changes
                              });
                              form.setValue("attribute_items", selected.items);
                            }
                          }}
                          cacheOptions
                          defaultOptions
                          loadOptions={attribute_options}
                          value={
                            current_item?.id
                              ? {
                                  value: current_item.id,
                                  label: current_item.name,
                                }
                              : null
                          }
                        />
                      )}
                    />
                    <ErrorMessage
                      error={
                        form?.formState?.errors?.attributes?.[index]?.name
                          ?.message || ""
                      }
                    />
                  </div>
                  <div className="w-full">
                    <Label>Select value</Label>
                    <Controller
                      control={form.control}
                      name={`attributes.${index}.value`}
                      render={({ field }) => (
                        <SelectCustom
                          isMulti
                          options={item_options(current_item?.id)}
                          onChange={(selected: any) => {
                            field.onChange(selected);
                          }}
                          value={field.value || []}
                          isDisabled={!current_item?.id}
                        />
                      )}
                    />
                    <ErrorMessage
                      error={
                        form.formState.errors?.attributes?.[index]?.value
                          ?.message || ""
                      }
                    />
                  </div>
                  <div className="flex gap-2 w-full justify-end mt-4">
                    <Button
                      onClick={() => removeAttribute(index)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                    <Button
                      onClick={() => {
                        const updatedItem = {
                          ...form.getValues(`attributes.${index}`),
                          is_add: true,
                        };
                        addAttribute(index, updatedItem);
                      }}
                      variant="default"
                      size="sm"
                      disabled={
                        !current_item?.id || !current_item?.value?.length
                      }
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    const updatedItem = {
                      ...form.getValues(`attributes.${index}`),
                      is_add: false,
                    };
                    addRevert(index, updatedItem);
                  }}
                  className="p-4 hover:bg-muted/50 transition-all active:bg-muted/70 cursor-pointer"
                >
                  <p className="text-sm font-semibold">{current_item?.name}</p>
                  <div className="flex gap-1 flex-wrap mt-2">
                    {Array.isArray(current_item?.value) &&
                      current_item.value.map(
                        (
                          val: { label: string; value: string } | string,
                          i: number
                        ) => (
                          <Badge
                            key={i}
                            className="px-2 py-1 bg-muted/40 text-black rounded-sm text-xs"
                          >
                            {typeof val === "object" ? val.label : val}
                          </Badge>
                        )
                      )}
                  </div>
                </div>
              )}
              {fields.length - 1 !== index && (
                <Separator className="bg-muted-foreground/20" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Product Variations Table */}
      <ProductVariationsTable form={form} />
    </div>
  );
}

export default VariantsSelect;
