import { Controller, type Control, type FormState } from "react-hook-form";
import BgWrapper from "~/components/common/bg-wrapper";
import { Checkbox } from "~/components/ui/checkbox";
import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { input_restrictions } from "~/lib/utils";

type Props = { control: Control<any>; formState: FormState<any> };

export default function Inventory({ control, formState }: Props) {

  return (
    <div className=" w-full mt-3">
      {/* <div className="grid grid-cols-2  gap-3 mb-3">
     
        <div>
          <Label>Barcode (ISBN, UPC, GTIN, etc.) </Label>
          <Controller
            control={control}
            name="catogery"
            render={({ field }) => {
              return (
                <Input className="" type="text" placeholder="SKU" />
              );
            }}
          />
          <ErrorMessage error={""} />
        </div>
        <div>
          <Label>HSN Code</Label>
          <Combobox options={data} />

          <ErrorMessage error={""} />
        </div>
      </div> */}
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
              Notify when low stock quandity
            </label>
          </div>
          <div>
            <Label>Quandity</Label>
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
