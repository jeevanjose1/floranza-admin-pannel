import { Controller, type UseFormReturn } from "react-hook-form";
import BgWrapper from "~/components/common/bg-wrapper";
import { Checkbox } from "~/components/ui/checkbox";
import { Separator } from "~/components/ui/separator";
import SingleProduct from "./single-product";

import VariantsSelect from "./varient-select";
import { Label } from "~/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import TimePicker from "~/components/ui/time-picker";
import { DatePicker } from "~/components/ui/date-picker";
import ErrorMessage from "~/components/ui/error-message";
import dayjs from "dayjs";

type Props = { form: UseFormReturn<any> };

export default function Price({ form }: Props) {
  return (
    <BgWrapper>
      <div className="p-4 w-full">
        <h1 className="text-sm font-semibold mb-4">Product data</h1>

        <div className="w-full  mt-3 ">
          <Controller
            control={form?.control}
            name="is_variants"
            render={({ field }) => {
              return (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(e) => {
                      form.watch("is_variants");
                      field.onChange(e);
                    }}
                    id="varients"
                  />
                  <label htmlFor="varients" className="text-[13px] ">
                    This product have variations
                  </label>
                </div>
              );
            }}
          />
        </div>
        <Separator className="my-6 bg-muted/70" />
        {form.getValues("is_variants") ? (
          <VariantsSelect form={form} />
        ) : (
          <SingleProduct form={form} />
        )}
        <div>
          <div className="w-full flex items-center gap-4 mt-3 mb-3 ">
            <Controller
              control={form?.control}
              name="is_schedule"
              render={({ field }) => {
                return (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(e) => {
                        field.onChange(e);
                      }}
                      id="is_schedule"
                    />
                    <Label htmlFor="is_schedule" className="text-[13px] mb-0">
                      Schedule
                    </Label>
                  </div>
                );
              }}
            />
          </div>
          <AnimatePresence>
            {form.watch("is_schedule") && (
              <motion.div
                className="grid grid-cols-2 gap-3 w-full"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-full">
                  <DatePicker
                    defaultDate={
                      form.getValues("shedule_date")
                        ? new Date(form.getValues("shedule_date"))
                        : undefined
                    }
                    onChange={(e) =>
                      form.setValue(
                        "shedule_date",
                        dayjs(e as any).format("YYYY-MM-DD")
                      )
                    }
                  />
                  <ErrorMessage
                    error={form.formState.errors?.shedule_date?.message as any}
                  />
                </div>
                <div className="w-full">
                 
                  <TimePicker
                    defaultValue={form.getValues("shedule_time") || null}
                    onChange={(e) => form.setValue("shedule_time", e)}
                  />
                  <ErrorMessage
                    error={form.formState.errors?.shedule_time?.message as any}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </BgWrapper>
  );
}
