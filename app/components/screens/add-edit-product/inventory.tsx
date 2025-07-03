import { Controller, type Control, type FormState } from "react-hook-form";
import { Checkbox } from "~/components/ui/checkbox";
import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { input_restrictions } from "~/lib/utils";

type Props = { control: Control<any>; formState: FormState<any> };

export default function Inventory({ control }: Props) {

  return (
    <div className=" w-full mt-3">
     
      <div>
        <div>
          <div className="flex my-4 items-center gap-2">
            <Controller
              control={control}
              name="stock_notification"
              render={({ field }) => {
                return <Checkbox defaultChecked={field.value} value={field.value}  id="terms" />;
              }}
            />
            <label htmlFor="terms" className="text-[13px] ">
              Notify when low stock quantity
            </label>
          </div>
          <div>
            <Label>Quantity</Label>
            <Controller
              control={control}
              name="notification_qty"
              render={({ field }) => {
                return (
                  <Input
                    // {...field}
                    defaultValue={field.value}
                    onChange={(e) => {
                      input_restrictions.numbersOnly(e);
                      field.onChange(e);
                    }}
                    type="text"
                    placeholder="0"
                  />
                );
              }}
            />
            <ErrorMessage error={""} />
          </div>
        </div>
      </div>
    </div>
  );
}
