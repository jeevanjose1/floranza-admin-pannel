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

import {Save } from "lucide-react";


import { toast } from "sonner";
import  { coupone_schema } from "~/shared/validations/coupon";
import { useCreateCoupon, useUpadteCoupon } from "~/services/queries/coupon";

type FormValues = z.infer<typeof coupone_schema>;
type Props = { children: ReactNode; data?: any };

export default function AddEditModal({ children, data }: Props) {

  const [open, setOpen] = useState(false);
  const { mutateAsync: add_coupon, isPending: addPending } =
    useCreateCoupon();
  const { mutateAsync: edit_coupon, isPending: editPending } =
    useUpadteCoupon();
  const { control, handleSubmit, formState, reset } =
    useForm<FormValues>({
      resolver: zodResolver(coupone_schema),
      values: {
        amount: data?.amount || "",
       
      },
    });

  
  
  const onSubmitForm = (values: FormValues) => {
    const form_data = new FormData()
    form_data.append('amount',values.amount)
   add_coupon(form_data,{
    onSuccess:(response)=>{
      toast.success(response?.message)
      handleClose()
      
    },
    onError:(error:any)=>{
      toast.error(error?.data?.message)
    }
   })
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
          <DialogTitle>Add coupon</DialogTitle>
        </DialogHeader>

        <div className="w-full px-4 py-2">
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="mb-4">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount
              </Label>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <Input
                    id="amount"
                    {...field}
                    type="number"
                    placeholder="Enter coupon amount"
                    className="mt-1"
                  />
                )}
              />
              <ErrorMessage error={formState.errors.amount?.message} />
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
                Save Coupon
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
