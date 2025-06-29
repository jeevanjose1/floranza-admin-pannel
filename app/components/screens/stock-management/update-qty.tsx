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
import { Label } from "~/components/ui/label";

import { toast } from "sonner";
import { qty_schema } from "~/shared/validations/product";
import { useUpdateQtyProduct } from "~/services/queries/product";

type UserFormData = z.infer<typeof qty_schema>;

type Props = {
  data?: any;
  children: React.ReactNode;
};

export default function UpdateQty({ data, children }: Props) {
  
  const [open, setOpen] = useState(false);
  const { mutateAsync: update, isPending } = useUpdateQtyProduct();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(qty_schema),
    values: {
      qty: "",
    },
  });

  const onSubmitForm = async (values: UserFormData) => {
    const form_data = new FormData();
    form_data.append("qty", values.qty);
    form_data.append("product_id", data.id);
    form_data.append("variation_id", data.variation_id);

    update(form_data, {
      onSuccess: () => {
        toast.success("Quantity updated");
        setOpen(false);
      },
      onError() {
        toast.error("Failed to update quantity");
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
            {/* User Name Field */}


            <div className="mb-4">
              <Label htmlFor="qty" className="text-sm font-medium">
                Quantity
              </Label>
              <Controller
                control={control}
                name="qty"
                render={({ field }) => (
                  <Input
                    id="qty"
                    {...field}
                    type="number"
                    placeholder="Enter quantity"
                    className="mt-1"
                  />
                )}
              />
              <ErrorMessage error={errors.qty?.message} />
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
