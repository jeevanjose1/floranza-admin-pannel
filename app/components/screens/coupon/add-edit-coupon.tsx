import { type ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

import { Save } from "lucide-react";


import { toast } from "sonner";
import { coupone_schema } from "~/shared/validations/coupon";
import { useCreateCoupon } from "~/services/queries/coupon";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { DatePicker } from "~/components/ui/date-picker";
import dayjs from "dayjs";
import { generateCouponCode } from "~/lib/utils";

type FormValues = z.infer<typeof coupone_schema>;
type Props = { children: ReactNode; data?: any };

export default function AddEditModal({ children, data }: Props) {

  const [open, setOpen] = useState(false);
  const { mutateAsync: add_coupon, isPending: addPending } =
    useCreateCoupon();
  const { control, handleSubmit, formState, reset, watch, setValue } =
    useForm<FormValues>({
      resolver: zodResolver(coupone_schema),
      values: {
        code: data?.amount || "",
        value: 0,
        type: data?.type || "flat",
        coupon_type: 'normal',
        end_date: ''
      },
    });



  const onSubmitForm = (values: FormValues) => {
    const form_data = new FormData()
    form_data.append('value', JSON.stringify(values.value))
    form_data.append('type', values.coupon_type as string)
    form_data.append('discount_type', values.type as string)
    if (values.end_date !== '') {
      form_data.append('expiry_date', values.end_date as string)

    }
    form_data.append('code', values.code as string)



    add_coupon(form_data, {
      onSuccess: (response) => {
        toast.success(response?.message)
        handleClose()

      },
      onError: (error: any) => {
        toast.error(error?.data?.message)
      }
    })
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const generate_code = () => {
    const initial_coupon = generateCouponCode(10)
    setValue('code', initial_coupon)

  }

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
              <Label htmlFor="type" className="text-sm font-medium mb-2">
                Coupon Type
              </Label>
              <Controller
                control={control}
                name="coupon_type"
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} className="flex gap-6" orientation="horizontal" defaultValue="normal">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal" className="mb-0">Normal</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="promotion" id="promotion" />
                      <Label htmlFor="promotion" className="mb-0">Promotion</Label>
                    </div>

                  </RadioGroup>
                )}
              />

            </div>
            <div className="mb-4">
              <Label htmlFor="type" className="text-sm font-medium mb-2">
                Value Type
              </Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} className="flex items-center gap-3" defaultValue="flat">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="flat" id="flat" />
                      <Label htmlFor="flat" className="mb-0">Flat</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="percent" id="percent" />
                      <Label htmlFor="percent" className="mb-0">Percentage</Label>
                    </div>

                  </RadioGroup>
                )}
              />
            </div>

            {watch('coupon_type') === 'promotion' && <div className="mb-4">
              <Label htmlFor="value" className="text-sm font-medium">
                End date
              </Label>
              <Controller
                control={control}
                name="end_date"
                render={({ field }) => (
                  <DatePicker
                    defaultDate={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => {
                      if (date) {
                        field.onChange(dayjs(date as Date).format("YYYY-MM-DD"));
                      }
                    }}
                  />
                )}
              />
              <ErrorMessage error={formState.errors.end_date?.message} />
            </div>}

            <div className="mb-4">
              <Label htmlFor="value" className="text-sm font-medium">
                Coupon code
              </Label>
              <Controller
                control={control}
                name="code"

                render={({ field }) => (

                  <div className="flex w-full  items-center gap-2">
                    <Input id="value"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      type="text"
                      placeholder="Enter coupon code"
                    />
                    <Button onClick={generate_code} size={'sm'} className="rounded-sm" type="button" variant="secondary">
                      Generate
                    </Button>
                  </div>
                )}
              />
              <ErrorMessage error={formState.errors.code?.message} />
            </div>

            <div className="mb-4">
              <Label htmlFor="value" className="text-sm font-medium">
                Coupon value
              </Label>
              <Controller
                control={control}
                name="value"

                render={({ field }) => (
                  <Input
                    id="value"
                    {...field}

                    type="number"
                    placeholder="Enter coupon value"
                    className="mt-1"
                  />
                )}
              />
              <ErrorMessage error={formState.errors.value?.message} />
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
                loading={addPending}
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
