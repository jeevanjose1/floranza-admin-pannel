import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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

import { toast } from "sonner";
import { qty_schema } from "~/shared/validations/product";
import {  useUpdateStock } from "~/services/queries/product";
import { Textarea } from "~/components/ui/textarea";
import { Separator } from "~/components/ui/separator";
import { Label } from "~/components/ui/label";

type UserFormData = z.infer<typeof qty_schema>;

type Props = {
  data?: any;
  children: React.ReactNode;
};

export default function UpdateQty({ data, children }: Props) {

  const [open, setOpen] = useState(false);
  const { mutateAsync: update, isPending } = useUpdateStock();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UserFormData>({
    resolver: zodResolver(qty_schema),
    defaultValues: {
      qty: "",
      qty_note: '',
    },
  });

  const onSubmitForm = async (values: UserFormData) => {
    const form_data = new FormData();
    form_data.append("qty", values.qty);
    form_data.append("prd_var_value_id", data.variation_id);
    form_data.append("stock_type", 'ADD');
    form_data.append("note", values.qty_note || "");

    update({ data: form_data, product_id: data.id }, {
      onSuccess: (response) => {
        toast.success(response?.message);
        setOpen(false);
      },
      onError(error: any) {
        toast.error(error?.data?.message);
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Quantity</DialogTitle>
        </DialogHeader>

        <div className="w-full px-4 py-2">

          <div className="flex mb-4 gap-3">
            <img className="w-20 rounded-lg " src={data?.image} alt="" />
            <div>
              <p className="font-semibold mb-1">{data?.name}</p>
              <p className="text-sm font-medium">Qty: {data?.stock}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="col-span-2   ">

              <Separator className="my-3 bg-muted" />
              <div className="mb-3">

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label >
                     Enter quantity you want to add
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Controller
                      name="qty"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="0"
                          min="1"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          className="h-9 text-sm"
                        />
                      )}
                    />
                  </div>
                  {<ErrorMessage error={errors?.qty?.message} />}
                </div>
              </div>
              <div>
                <Controller
                  name="qty_note"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      className="resize-none test-sm placeholder:text-sm"
                      placeholder="Type your note here..."
                    />
                  )}
                />
                {errors.qty_note && <ErrorMessage error={errors.qty_note.message} />}
              </div>

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
                loading={isPending}
                type="submit"
                size="sm"
                className="gap-1"
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}