import { Controller, type UseFormReturn } from "react-hook-form";
import { useLocation, useParams } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";

import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { input_restrictions } from "~/lib/utils";
import { useUpdateStock } from "~/services/queries/product";

type Props = {
  form: UseFormReturn<any>;

};

export default function SingleProduct({ form }: Props) {
  const location = useLocation();
  const isEdit = location.pathname?.includes('edit');
  const params = useParams()
  const { mutateAsync: update, isPending } = useUpdateStock()


  const handleQuantityUpdate = () => {
    const currentQty = Number(form.getValues('quandity')) || 0;
    const newQty = Number(form.getValues('new_quantity')) || 0;

    if (!form.getValues('action_type') || newQty <= 0) {
      return;
    }

    let updatedQuantity: number;
    if (form.getValues('action_type') === 'add') {
      updatedQuantity = currentQty + newQty;
    } else {
      updatedQuantity = Math.max(0, currentQty - newQty);
    }


    const form_data = new FormData()
    form_data.append('qty', String(newQty))
    // form_data.append('prd_var_value_id', form.getValues().prd_var_value_id)
    form_data.append('stock_type', form.getValues('action_type') === 'add' ? 'ADD' : 'SUBTRACT')
    form_data.append('note', String(form.getValues('qty_note')))

    update({
      product_id: params?.product_id,
      data: form_data
    }, {
      onSuccess: (response) => {
        toast.success(response?.message)
        form.setValue(`quandity`, updatedQuantity.toString());
        form.setValue(`qty_note`, '');

      },
      onError: (error: any) => {
        toast.error(error?.data?.message)

      }
    })




  };

  return (
    <div className="w-full">
      {isEdit ? (
        <div className="space-y-4">
          {/* Regular price, sale price, and quantity form fields */}
          <div className="flex w-full items-center gap-3 mb-4">
            <div className="w-full">
              <Label>Regular Price</Label>
              <Controller
                control={form?.control}
                name="price"
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      onChange={(e) => {
                        input_restrictions.numbersOnly(e);
                        field.onChange(e);
                      }}
                      type="text"
                      className="w-full"
                      placeholder="0.0"
                    />
                  );
                }}
              />
              <ErrorMessage
                error={form?.formState?.errors?.price?.message as string}
              />
            </div>
            <div className="w-full">
              <Label>Sale price</Label>
              <Controller
                control={form?.control}
                name="sale_price"
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      onChange={(e) => {
                        input_restrictions.numbersOnly(e);
                        field.onChange(e);
                      }}
                      type="text"
                      className="w-fresh"
                      placeholder="0.0"
                    />
                  );
                }}
              />
              <ErrorMessage
                error={form?.formState?.errors?.sale_price?.message as string}
              />
            </div>

          </div>

          {/* Quantity Update Section */}
          <div className="col-span-2 p-3 rounded-md bg-white border">
            <div>
              <h2 className="text-[13px] mb-1">Current quantity</h2>
              <p className="text-xl font-semibold">{form.watch('quandity') || "0"}</p>
            </div>
            <Separator className="my-3 bg-muted" />
            <div className="mb-3">
              <RadioGroup
                value={form.watch('action_type') || ""}
                onValueChange={(value) =>
                  form.setValue("action_type", value)
                }
                className="flex mb-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="add" id="add" />
                  <Label className="mb-0 text-xs font-medium text-slate-700" htmlFor="add">
                    Add Stock
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="remove" id="remove" />
                  <Label className="mb-0 text-xs font-medium text-slate-700" htmlFor="remove">
                    Remove Stock
                  </Label>
                </div>
              </RadioGroup>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">
                    {form.watch('action_type') === 'add'
                      ? 'Enter quantity you want to add'
                      : form.watch('action_type') === 'remove'
                        ? 'Enter quantity you want to remove'
                        : 'Select action type first'}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    value={form.getValues('new_quantity') || ""}
                    disabled={!form.watch('action_type')}
                    onChange={(e) => form.setValue("new_quantity", e.target.value)}
                    className="h-9 text-sm bg-white"
                  />
                </div>
              </div>
            </div>
            <div>
              <Textarea
                defaultValue={form.getValues('qty_note') || ""}
                onChange={(e) => form.setValue("qty_note", e.target.value)}
                className="resize-none"
                placeholder="Type your note here..."
              />
            </div>
            <div className="mt-3 w-full flex justify-end">
              <Button
                disabled={!form.watch('action_type') || !form.watch('new_quantity') || Number(form.watch('new_quantity')) <= 0}
                type="button"
                onClick={handleQuantityUpdate}
                size="sm"
                loading={isPending}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center gap-3 mb-4">
          <div className="w-full">
            <Label>Regular Price</Label>
            <Controller
              control={form?.control}
              name="price"
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    onChange={(e) => {
                      input_restrictions.numbersOnly(e);
                      field.onChange(e);
                    }}
                    type="text"
                    className="w-full"
                    placeholder="0.0"
                  />
                );
              }}
            />
            <ErrorMessage
              error={form?.formState?.errors?.price?.message as string}
            />
          </div>
          <div className="w-full">
            <Label>Sale price</Label>
            <Controller
              control={form?.control}
              name="sale_price"
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    onChange={(e) => {
                      input_restrictions.numbersOnly(e);
                      field.onChange(e);
                    }}
                    type="text"
                    className="w-full"
                    placeholder="0.0"
                  />
                );
              }}
            />
            <ErrorMessage
              error={form?.formState?.errors?.sale_price?.message as string}
            />
          </div>
          <div className="w-full">
            <Label>Quantity</Label>
            <Controller
              control={form?.control}
              name="quandity"
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    className="w-full"
                    placeholder="0"
                  />
                );
              }}
            />
            <ErrorMessage
              error={form?.formState?.errors?.quandity?.message as string}
            />
          </div>
        </div>
      )}
    </div>
  );
}