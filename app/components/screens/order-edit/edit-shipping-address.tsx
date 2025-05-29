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
import { country, indianStates } from "~/shared/others/others";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ErrorMessage from "~/components/ui/error-message";
import { shipping_address_schema } from "~/shared/validations/order";
import { Textarea } from "~/components/ui/textarea";

type BillingAddressFormData = z.infer<typeof shipping_address_schema>;

type Props = {
  onSubmit?: (data: BillingAddressFormData) => void;
  defaultValues?: any;
};
const filterd_state = indianStates.map((item) => {
  return {
    value: item.code,
    label: item.name,
  };
});
export default function EditBillingAddress({ onSubmit, defaultValues }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BillingAddressFormData>({
    resolver: zodResolver(shipping_address_schema),
    values: {
      firstName: defaultValues?.fname || "",
      lastName: defaultValues?.lname || "",
      addressLine1: defaultValues?.address_1 || "",
      addressLine2: defaultValues?.address_ || "",
      city: defaultValues?.city || "",
      country: defaultValues?.country || "",
      companyName: "",
      phone: defaultValues?.phone || "",
      postcode: defaultValues?.postcode || "",
      state: defaultValues?.state || "",
      couier: "",
      note: "",
    },
  });

  const handleFormSubmit = (data: BillingAddressFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
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
              <Label htmlFor="firstName">First Name</Label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input id="firstName" placeholder="First name" {...field} />
                )}
              />

              <ErrorMessage error={errors?.firstName?.message} />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input id="lastName" placeholder="Last name" {...field} />
                )}
              />
              <ErrorMessage error={errors?.lastName?.message} />
            </div>
          </div>

          {/* Company Name (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name (Optional)</Label>
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => (
                <Input id="companyName" placeholder="Company name" {...field} />
              )}
            />
            <ErrorMessage error={errors?.companyName?.message} />
          </div>

          {/* Country/Region */}
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
              name="couier"
              control={control}
              render={({ field }) => (
                <Input id="couier" placeholder="Select Courier" {...field} />
              )}
            />
          </div>
          <div className="flex items-center justify-end">
            <Button
              type="submit"
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
