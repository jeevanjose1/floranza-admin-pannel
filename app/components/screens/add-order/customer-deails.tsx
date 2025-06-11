import { Controller, type UseFormReturn } from 'react-hook-form';
import SelectCustom from '~/components/ui/custom-select';
import ErrorMessage from '~/components/ui/error-message';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { country, courier, indianStates } from '~/shared/others/others';

type Props = {form: UseFormReturn<any> }

export default function CustomerDetails({form}: Props) {
    const filterd_state = indianStates.map((item) => {
      return {
        value: item.code,
        label: item.name,
      };
    });
  return (
   <div className="p-4">
      <div
          className="space-y-4 "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">Full Name</Label>
              <Controller
                name="fullName"
                control={form?.control}
                render={({ field }) => (
                  <Input id="firstName" placeholder="Full name" {...field} />
                )}
              />

              <ErrorMessage error={form?.formState?.errors?.fullName?.message as any} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">Email</Label>
              <Controller
                name="email"
                control={form?.control}
                render={({ field }) => (
                  <Input id="email" placeholder="Email" {...field} />
                )}
              />

              <ErrorMessage error={form?.formState?.errors?.email?.message as any} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country/Region</Label>
            <Controller
              name="country"
              control={form?.control}
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
            <ErrorMessage error={form?.formState?.errors?.country?.message as any} />
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Street Address Line 1</Label>
            <Controller
              name="addressLine1"
              control={form?.control}
              render={({ field }) => (
                <Input
                  id="addressLine1"
                  placeholder="House number and street name"
                  {...field}
                />
              )}
            />
            <ErrorMessage error={form?.formState?.errors?.addressLine1?.message as any} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">
              Street Address Line 2 (Optional)
            </Label>
            <Controller
              name="addressLine2"
              control={form?.control}
              render={({ field }) => (
                <Input
                  id="addressLine2"
                  placeholder="Apartment, suite, unit, etc."
                  {...field}
                />
              )}
            />
            <ErrorMessage error={form?.formState?.errors?.addressLine2?.message as any} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Town/City */}
            <div className="space-y-2">
              <Label htmlFor="city">Town/City</Label>
              <Controller
                name="city"
                control={form?.control}
                render={({ field }) => (
                  <Input id="city" placeholder="Town/City" {...field} />
                )}
              />
              <ErrorMessage error={form?.formState?.errors?.city?.message as any} />
            </div>

            {/* State/County */}
            <div className="space-y-2">
              <Label htmlFor="state">State/County</Label>
              <Controller
                name="state"
                control={form?.control}
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
              <ErrorMessage error={form?.formState?.errors?.state?.message as any} />
            </div>
          </div>

          {/* Postcode/ZIP */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode/ZIP</Label>
              <Controller
                name="postcode"
                control={form?.control}
                render={({ field }) => (
                  <Input id="postcode" placeholder="Postcode/ZIP" {...field} />
                )}
              />
              <ErrorMessage error={form?.formState?.errors?.postcode?.message as any} />
            </div>
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Controller
                name="phone"
                control={form?.control}
                render={({ field }) => (
                  <Input id="phone" placeholder="Phone" type="tel" {...field} />
                )}
              />
              <ErrorMessage error={form?.formState?.errors?.phone?.message as any} />
            </div>

            {/* Email */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="postcode">Customer provided note:</Label>
            <Controller
              name="note"
              control={form?.control}
              render={({ field }) => (
                <Textarea placeholder="Type your note..." />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transaction_id">Select Courier</Label>
            <Controller
              name="courier"
              control={form?.control}
              render={({ field }) => (
                <Controller
                  name="courier"
                  control={form?.control}
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
         
        </div>
    </div>
  )
}