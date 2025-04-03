import { Controller, type Control, type FormState } from "react-hook-form";
import BgWrapper from "~/components/common/bg-wrapper";
import { Checkbox } from "~/components/ui/checkbox";
import { Combobox } from "~/components/ui/combo-box";
import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type Props = { control: Control<any>; formState: FormState<any> };

export default function Inventory({ control, formState }: Props) {
  const data = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];
  return (
    <div className=" w-full mt-3">
      <div className="grid grid-cols-2  gap-3 mb-3">
        <div>
          <Label>SKU (Stock Keeping Unit)</Label>
          <Controller
            control={control}
            name="catogery"
            render={({ field }) => {
              return <Input className="" type="text" placeholder="SKU" />;
            }}
          />
          <ErrorMessage error={""} />
        </div>
        {/* <div>
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
        </div> */}
        <div>
          <Label>HSN Code</Label>
          <Combobox options={data} />

          <ErrorMessage error={""} />
        </div>
      </div>
      <div>
        <div>
          <div className="flex my-4 items-center gap-2">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-[13px] ">
              Track quandity
            </label>
          </div>
          <div>
            <Label>Quandity</Label>
            <Controller
              control={control}
              name="catogery"
              render={({ field }) => {
                return <Input className="" type="text" placeholder="0" />;
              }}
            />
            <ErrorMessage error={""} />
          </div>
        </div>
      </div>
    </div>
  );
}
