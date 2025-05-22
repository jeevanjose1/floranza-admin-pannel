import { type ReactNode, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { X, Plus, Save } from "lucide-react";
import { cn } from "~/lib/utils";
import { formSchema } from "~/shared/validations/attribute";
import { useCreateAttribute, useUpadteAttribute } from "~/services/queries";
import type { Attribute } from "./attribute-table";

type FormValues = z.infer<typeof formSchema>;
type Props = { children: ReactNode; data?: Attribute };

export default function AddEditModal({ children, data }: Props) {
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  const [open, setOpen] = useState(false);
  const { mutateAsync: add_attribute, isPending: addPending } =
    useCreateAttribute();
  const { mutateAsync: edit_attribute, isPending: editPending } =
    useUpadteAttribute();
  const { control, handleSubmit, formState, watch, reset } =
    useForm<FormValues>({
      resolver: zodResolver(formSchema),
      values: {
        name: data?.name || "",
        status: data?.status == 1 ? "Active" : "Inactive",
        values: data?.items.length
          ? data?.items.map((item) => {
              return {
                name: item.name,
                code: item.code,
                description: item.description,
                display_order: 0,
                status: item.status == 1 ? "Active" : "Inactive",
                id: item?.id,
              } as any;
            })
          : [
              {
                name: "",
                code: "",
                description: "",
                display_order: 0,
                status: "Active",
              },
            ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "values",
  });

  const values = watch("values");

  const handleAppendField = () => {
    const lastIndex = values.length - 1;
    if (values[lastIndex].name && values[lastIndex].code) {
      append({
        code: "",
        description: "",
        display_order: lastIndex + 1,
        name: "",
        status: "Active",
      });
    }
  };

  const handleRemoveField = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmitForm = (values: FormValues) => {
    const items = values.values?.map((item) => {
      return {
        code: item?.code,
        description: item?.description,
        display_order: item?.display_order,
        name: item?.name,
        status: item?.status === "Active" ? 1 : 0,
        ...(data && { id: item?.id }),
      };
    });
    const payload = {
      name: values.name,
      status: values.status === "Active" ? 1 : 0,
      items: items,
    };
    if (data) {
      edit_attribute(
        {
          id: data?.id,
          data: payload,
        },
        {
          onSuccess: (response) => {
            setOpen(false);
            reset();
          },
          onError: (error) => {
            console.log(error);
          },
        }
      );
    } else {
      add_attribute(payload, {
        onSuccess: (response) => {
          setOpen(false);
          reset();
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add attribute</DialogTitle>
        </DialogHeader>

        <div className="w-full px-4 py-2">
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="mb-4">
              <Label htmlFor="attributeName" className="text-sm font-medium">
                Attribute Name
              </Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    id="attributeName"
                    {...field}
                    placeholder="Enter attribute name"
                    className="mt-1"
                  />
                )}
              />
              <ErrorMessage error={formState.errors.name?.message} />
            </div>
            {data && (
              <div className="w-full mb-6">
                <Label htmlFor={"status"} className="text-xs font-medium">
                  Status
                </Label>
                <Controller
                  control={control}
                  name={`status`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="py-1 rounded-sm w-full"
                        size="sm"
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold">Attribute Values</h2>
                <Button
                  type="button"
                  onClick={handleAppendField}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex items-center gap-1",
                    (!values[values.length - 1]?.name ||
                      !values[values.length - 1]?.code) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                  disabled={
                    !values[values.length - 1]?.name ||
                    !values[values.length - 1]?.code ||
                    !values[values.length - 1]?.description
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Value
                </Button>
              </div>
              <Separator className="mb-4" />

              <ScrollArea className="max-h-[400px] overflow-y-auto ">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="mb-6 bg-muted/20 p-4 rounded-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium">Value {index + 1}</h3>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveField(index)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="w-full">
                        <Label
                          htmlFor={`value-name-${index}`}
                          className="text-xs font-medium"
                        >
                          Name
                        </Label>
                        <Controller
                          control={control}
                          name={`values.${index}.name`}
                          render={({ field }) => (
                            <Input
                              id={`value-name-${index}`}
                              {...field}
                              placeholder="Name"
                              className="mt-1"
                            />
                          )}
                        />
                        <ErrorMessage
                          error={
                            formState.errors.values?.[index]?.name?.message
                          }
                        />
                      </div>

                      <div className="w-full">
                        <Label
                          htmlFor={`value-code-${index}`}
                          className="text-xs font-medium"
                        >
                          Code
                        </Label>
                        <Controller
                          control={control}
                          name={`values.${index}.code`}
                          render={({ field }) => (
                            <Input
                              id={`value-code-${index}`}
                              {...field}
                              placeholder="Code"
                              className="mt-1"
                            />
                          )}
                        />
                        <ErrorMessage
                          error={
                            formState.errors.values?.[index]?.code?.message
                          }
                        />
                      </div>

                      <div className="w-full">
                        <Label
                          htmlFor={`value-status-${index}`}
                          className="text-xs font-medium"
                        >
                          Status
                        </Label>
                        <Controller
                          control={control}
                          name={`values.${index}.status`}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                id={`value-status-${index}`}
                                className="py-1 rounded-sm w-full"
                                size="sm"
                              >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Inactive">
                                    Inactive
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <ErrorMessage
                          error={
                            formState.errors.values?.[index]?.status?.message
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor={`value-description-${index}`}
                        className="text-xs font-medium"
                      >
                        Description
                      </Label>
                      <Controller
                        control={control}
                        name={`values.${index}.description`}
                        render={({ field }) => (
                          <Textarea
                            id={`value-description-${index}`}
                            {...field}
                            className="resize-none mt-1"
                            placeholder="Enter description (optional)"
                            rows={2}
                          />
                        )}
                      />
                      <ErrorMessage
                        error={
                          formState.errors.values?.[index]?.description?.message
                        }
                      />
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <ErrorMessage error={formState.errors.values?.message} />
            </div>

            <DialogFooter
              onClick={(e) => e.stopPropagation()}
              className="border-t pt-4 mt-4"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                loading={addPending || editPending}
                type="submit"
                size="sm"
                className="gap-1"
              >
                <Save className="h-3.5 w-3.5" />
                Save Attribute
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
