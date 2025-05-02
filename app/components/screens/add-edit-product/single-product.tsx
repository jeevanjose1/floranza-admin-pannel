import { Controller, type UseFormReturn } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "~/components/ui/checkbox";
import { DatePicker } from "~/components/ui/date-picker";
import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import TimePicker from "~/components/ui/time-picker";
import { input_restrictions } from "~/lib/utils";

type Props = { form: UseFormReturn<any> };

export default function SingleProduct({ form }: Props) {
  return (
    <div className="w-full">
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
          <Label>Quandity</Label>
          <Controller
            control={form?.control}
            name="quandity"
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
     
     
</div>
  
  );
}