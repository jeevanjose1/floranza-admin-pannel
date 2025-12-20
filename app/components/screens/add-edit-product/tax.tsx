import { Controller, type UseFormReturn } from 'react-hook-form';
import BgWrapper from '~/components/common/bg-wrapper';
import ErrorMessage from '~/components/ui/error-message';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

type Props = {
  form: UseFormReturn<any>
};

export default function Tax({ form }: Props) {
  return (
    <BgWrapper>
      <div className="p-4 w-full">
        <h1 className="text-sm font-semibold mb-2">Select Tax</h1>
        {/* <div className='mb-3'>
          <Label htmlFor="tax">Tax (This field is temporary and will be removed in the future)</Label>
          
          <Controller
            control={form?.control}
            name="tax"
            render={({ field }) => {
              return (
                <Select value={field.value} onValueChange={(e) => field.onChange(e)}>
                  <SelectTrigger
                    id="tax"
                    size="sm"
                    className="w-full rounded-sm py-0"
                  >
                    <SelectValue placeholder="Select tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="28">28%</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              );
            }}
          />
          <ErrorMessage
            error={form?.formState?.errors?.tax?.message as string}
          />
        </div> */}

        <div className='mb-3'>
          <Label htmlFor="tax-below-999">Tax Rate (Amount below ₹2499)</Label>
          
          <Controller
            control={form?.control}
            name="tax_below_999"
            render={({ field }) => {
              return (
                <Select value={field.value} onValueChange={(e) => field.onChange(e)}>
                  <SelectTrigger
                    id="tax-below-999"
                    size="sm"
                    className="w-full rounded-sm py-0"
                  >
                    <SelectValue placeholder="Select tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              );
            }}
          />
          <ErrorMessage
            error={form?.formState?.errors?.tax_below_999?.message as string}
          />
        </div>

        <div>
          <Label htmlFor="tax-above-1000">Tax Rate (Amount ₹2500 and above)</Label>
          
          <Controller
            control={form?.control}
            name="tax_above_1000"
            render={({ field }) => {
              return (
                <Select value={field.value} onValueChange={(e) => field.onChange(e)}>
                  <SelectTrigger
                    id="tax-above-1000"
                    size="sm"
                    className="w-full rounded-sm py-0"
                  >
                    <SelectValue placeholder="Select tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              );
            }}
          />
          <ErrorMessage
            error={form?.formState?.errors?.tax_above_1000?.message as string}
          />
        </div>
      </div>
    </BgWrapper>
  )
}