import React from "react";
import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form";
import AsyncSelectCustom from "~/components/ui/async-select";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import ErrorMessage from "~/components/ui/error-message";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import ProductVariationsTable from "./product-variation-table";

type Props = { form: UseFormReturn<any> };

const options = [
  { value: "size", label: "Size" },
  { value: "color", label: "Color" },
  { value: "s", label: "Colosr" },
  { value: "coloasdsr", label: "asd" },
  { value: "das", label: "Coslor" },
  { value: "coldasor", label: "Ccasolor" },
  { value: "colzxcor", label: "Colasdor" },
];

const promiseOptions = (inputValue: string) =>
  new Promise<any>((resolve) => {
    setTimeout(() => {
      return resolve(options);
    }, 1000);
  });

function VariantsSelect({ form }: Props) {
  const {
    fields,
    append,
    remove,
    update,
  } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const appendAttribute = () => {
    append({
      name: "",
      id: "",
      is_add: false,
      value: [''],
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
  
  const removeAttribute=(index:number)=>{
    remove(index)
  }
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
          const current_item = form.getValues(`attributes.${index}`);
          
          return (
            <React.Fragment key={item.id}>
              {!current_item?.is_add ? (
                <div className="p-4 w-full">
                  <div className="mb-4 w-full">
                    <Label>Select attribute</Label>
                    <Controller
                      control={form.control}
                      name={`attributes.${index}.name`}
                      render={({ field }) => (
                        <AsyncSelectCustom
                          onChange={(event: any) => {
                            form.setValue(`attributes.${index}.name`, event?.label);
                            form.setValue(`attributes.${index}.id`, event?.value);
                          }}
                          cacheOptions
                          defaultOptions
                          loadOptions={promiseOptions}
                          value={options.find(option => option.value === current_item?.id) || null}
                        />
                      )}
                    />
                    <ErrorMessage error={""} />
                  </div>
                  <div className="w-full">
                    <Label>Select value</Label>
                    <Controller
                      control={form.control}
                      name={`attributes.${index}.value`}
                      render={({ field }) => (
                        <AsyncSelectCustom
                          isMulti
                          cacheOptions
                          defaultOptions
                          loadOptions={promiseOptions}
                          onChange={(values: any) => {
                            field.onChange(values);
                          }}
                          value={current_item?.value || []}
                        />
                      )}
                    />
                    <ErrorMessage error={""} />
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
                        const updatedItem = {...form.getValues(`attributes.${index}`),is_add:true};
                        addAttribute(index, updatedItem);
                      }}
                      variant="default"
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ) : (
                <div   onClick={() => {
                  const updatedItem = {...form.getValues(`attributes.${index}`),is_add:false};
                  addRevert(index, updatedItem);
                }} className="p-4 hover:bg-muted/50 transition-all active:bg-muted/70 cursor-pointer">
                  <p className="text-sm font-semibold">{current_item?.name}</p>
                  <div className="flex gap-1 flex-wrap mt-2">
                    {Array.isArray(current_item?.value) && current_item.value.map((val: { label: any; }, i: React.Key | null | undefined) => (
                      <Badge key={i} className="px-2 py-1 bg-muted/40 text-black rounded-sm text-xs">
                        {val.label || val}
                      </Badge>
                    ))}
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
      
      {/* Add the Product Variations Table component here */}
      <ProductVariationsTable form={form} />
    </div>
  );
}

export default VariantsSelect;