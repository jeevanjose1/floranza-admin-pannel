import { Controller, type Control, type FormState } from "react-hook-form";
import BgWrapper from "~/components/common/bg-wrapper";

import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { input_restrictions } from "~/lib/utils";

type Props = { control: Control<any>; formState: FormState<any> };

export default function Shipping({ control, formState }: Props) {
  return (
    <BgWrapper>

   
    <div className=" w-full p-4">
    <h1 className="text-sm font-semibold mb-4">
        Shipping
      </h1>
      <div className="  mb-4">
        <div>
          <Label>Weight (Kg)</Label>
          <Controller
            control={control}
            name="weight"
            render={({ field }) => {
              return <Input {...field}
                                onChange={(e) => {
                                  input_restrictions.numbersOnly(e);
                                  field.onChange(e);
                                }} type="text" placeholder="0" />;
            }}
          />
          <ErrorMessage error={formState?.errors?.weight?.message as string}/>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <Label>Dimensions (cm)</Label>
          <Controller
            control={control}
            name="length"
            render={({ field }) => {
              return <Input {...field}
                  onChange={(e) => {
                    input_restrictions.numbersOnly(e);
                    field.onChange(e);
                  }} type="text" placeholder="Lenght" />;
            }}
          />
          <ErrorMessage error={formState?.errors?.length?.message as string} />
        </div>
        <div className="mt-auto">
          <Controller
            control={control}
            name="width"
            render={({ field }) => {
              return <Input {...field}
                  onChange={(e) => {
                    input_restrictions.numbersOnly(e);
                    field.onChange(e);
                  }} type="text" placeholder="Width" />;
            }}
          />
          <ErrorMessage error={formState?.errors?.width?.message as string} />
          </div>
        <div className="mt-auto">
          <Controller
            control={control}
            name="height"
            render={({ field }) => {
              return <Input {...field}
                  onChange={(e) => {
                    input_restrictions.numbersOnly(e);
                    field.onChange(e);
                  }} type="text" placeholder="Height" />;
            }}
          />
          <ErrorMessage error={formState?.errors?.height?.message as string} />
          </div>
      </div>
    </div>
    </BgWrapper>
  );
}
