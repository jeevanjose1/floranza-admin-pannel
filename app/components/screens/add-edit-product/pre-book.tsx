import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { Controller, type UseFormReturn } from 'react-hook-form';
import BgWrapper from '~/components/common/bg-wrapper';
import { Checkbox } from '~/components/ui/checkbox';
import { DatePicker } from '~/components/ui/date-picker';
import ErrorMessage from '~/components/ui/error-message';
import { Label } from '~/components/ui/label';
import TimePicker from '~/components/ui/time-picker';

type Props = { form: UseFormReturn<any> };

export default function PreBook({ form }: Props) {
  
  return (
    <BgWrapper>
      <div className="p-4 w-full">
        <h1 className="text-sm font-semibold mb-2">Pre book</h1>
        <div>
          <div className="w-full flex items-center gap-4 mt-3 mb-3">
            <Controller
              control={form?.control}
              name="is_prebook"
              render={({ field }) => {
                return (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(e) => {
                        field.onChange(e);
                      }}
                      id="is_prebook"
                    />
                    <Label htmlFor="is_prebook" className="text-[13px] mb-0">
                      Prebook
                    </Label>
                  </div>
                );
              }}
            />
          </div>
          <AnimatePresence>
            {form.watch("is_prebook") && (
              <motion.div
                className="grid gap-3 w-full"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-full">
                  <Controller
                    control={form.control}
                    name="prebook_date"
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
                  <ErrorMessage
                    error={form.formState.errors?.prebook_date?.message as any}
                  />
                </div>
                <div className="w-full">
                  <Controller
                    control={form.control}
                    name="prebook_time"
                    render={({ field }) => (
                      <TimePicker
                        defaultValue={field.value}
                        onChange={(time) => field.onChange(time)}
                      />
                    )}
                  />
                  <ErrorMessage
                    error={form.formState.errors?.prebook_time?.message as any}
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