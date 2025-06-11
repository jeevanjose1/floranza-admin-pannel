import { Edit } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import SelectCustom from "~/components/ui/custom-select";
import { country, courier, indianStates } from "~/shared/others/others";

import ErrorMessage from "~/components/ui/error-message";
import { shipping_address_schema } from "~/shared/validations/order";
import { Textarea } from "~/components/ui/textarea";
import { useChangeAddress } from "~/services/queries/order";
import { toast } from "sonner";

type BillingAddressFormData = z.infer<typeof shipping_address_schema>;

type Props = {
  defaultValues?: any;
};
const filterd_state = indianStates.map((item) => {
  return {
    value: item.code,
    label: item.name,
  };
});
export default function EditBillingAddress({ defaultValues }: Props) {


  const { mutateAsync: update, isPending } = useChangeAddress();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BillingAddressFormData>({
    resolver: zodResolver(shipping_address_schema),
    values: {
      fullName: defaultValues?.address?.fname || "",
      addressLine1: defaultValues?.address?.address_1 || "",
      addressLine2: defaultValues?.address?.address_ || "",
      city: defaultValues?.address?.city || "",
      country: defaultValues?.address?.country || "",
      phone: defaultValues?.address?.phone || "",
      postcode: defaultValues?.address?.postcode || "",
      state: defaultValues?.address?.state || "",
      courier: defaultValues?.courier || "",
      note: "",
      email:  defaultValues?.address?.email|| "",
    },
  });

  const handleFormSubmit = (data: BillingAddressFormData) => {
    const form_data = new FormData();
    form_data.append("fname", data.fullName);
    form_data.append("country", data.country);
    form_data.append("state", data.state);
    form_data.append("address_1", data.addressLine1);
    form_data.append("address_2", data.addressLine2 as string);
    form_data.append("city", data.city);
    form_data.append("postcode", data.postcode);
    form_data.append("phone", data.phone);
    form_data.append("email", data.email as string);
    form_data.append("courier", data.courier);

    update(
      { id: defaultValues?.id, data: form_data },
      {
        onSuccess: () => {
          toast.success("Address updaed");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="transparent" size="icon" className="h-4.5 w-4.5 p-0">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="  sm:max-w-170 gap-0 max-h-[76vh] bg-white w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-semibold">
            Edit Billing Address
          </DialogTitle>
          <DialogDescription>
            Update billing address information below.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">Full Name</Label>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input id="firstName" placeholder="Full name" {...field} />
                )}
              />

              <ErrorMessage error={errors?.fullName?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input id="email" placeholder="Email" {...field} />
                )}
              />

              <ErrorMessage error={errors?.email?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country/Region</Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <SelectCustom
                  value={country.filter((item) => item.value === field.value)}
                  onChange={(e: any) => {
                    field.onChange(e.value);
                  }}
                  options={country}
                />
              )}
            />
            <ErrorMessage error={errors?.country?.message} />
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Street Address Line 1</Label>
            <Controller
              name="addressLine1"
              control={control}
              render={({ field }) => (
                <Input
                  id="addressLine1"
                  placeholder="House number and street name"
                  {...field}
                />
              )}
            />
            <ErrorMessage error={errors?.addressLine1?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">
              Street Address Line 2 (Optional)
            </Label>
            <Controller
              name="addressLine2"
              control={control}
              render={({ field }) => (
                <Input
                  id="addressLine2"
                  placeholder="Apartment, suite, unit, etc."
                  {...field}
                />
              )}
            />
            <ErrorMessage error={errors?.addressLine2?.message} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Town/City */}
            <div className="space-y-2">
              <Label htmlFor="city">Town/City</Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input id="city" placeholder="Town/City" {...field} />
                )}
              />
              <ErrorMessage error={errors?.city?.message} />
            </div>

            {/* State/County */}
            <div className="space-y-2">
              <Label htmlFor="state">State/County</Label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <SelectCustom
                    value={filterd_state.filter(
                      (item) => item.value === field.value
                    )}
                    onChange={(e: any) => {
                      field.onChange(e.value);
                    }}
                    isSearchable
                    options={filterd_state}
                  />
                )}
              />
              <ErrorMessage error={errors?.state?.message} />
            </div>
          </div>

          {/* Postcode/ZIP */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode/ZIP</Label>
              <Controller
                name="postcode"
                control={control}
                render={({ field }) => (
                  <Input id="postcode" placeholder="Postcode/ZIP" {...field} />
                )}
              />
              <ErrorMessage error={errors?.postcode?.message} />
            </div>
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input id="phone" placeholder="Phone" type="tel" {...field} />
                )}
              />
              <ErrorMessage error={errors?.phone?.message} />
            </div>

            {/* Email */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="postcode">Customer provided note:</Label>
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <Textarea placeholder="Type your note..." />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transaction_id">Select Courier</Label>
            <Controller
              name="courier"
              control={control}
              render={({ field }) => (
                <Controller
                  name="courier"
                  control={control}
                  render={({ field }) => (
                    <SelectCustom
                      value={courier.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(e: any) => {
                        field.onChange(e.value);
                      }}
                      options={courier}
                    />
                  )}
                />
              )}
            />
          </div>
          <div className="flex items-center justify-end">
            <Button
              type="submit"
              loading={isPending}
              size={"sm"}
              variant="secondary"
              className="w-36"
            >
              {"Save Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
