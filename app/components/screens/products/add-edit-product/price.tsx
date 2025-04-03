import { Controller, type UseFormReturn } from "react-hook-form";
import BgWrapper from "~/components/common/bg-wrapper";
import { Checkbox } from "~/components/ui/checkbox";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import SingleProduct from "./single-product";
import Inventory from "./inventory";
import Shipping from "./shipping";
import VariantsSelect from "./varient-select";

type Props = { form: UseFormReturn<any> };

export default function Price({ form }: Props) {
  return (
    <BgWrapper>
      <div className="p-4 w-full">
        <h1 className="text-sm font-semibold mb-4">Product data</h1>

        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">General</TabsTrigger>
            <TabsTrigger value="password">Inventory</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="account">
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
                          form.watch('is_variants')
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
           {form.getValues('is_variants')?<VariantsSelect  form={form}/> : <SingleProduct form={form} />}
          </TabsContent>
          <TabsContent value="password">
            <Inventory control={form?.control} formState={form?.formState} />
          </TabsContent>
          <TabsContent value="shipping">
            <Shipping control={form?.control} formState={form?.formState} />
          </TabsContent>
        </Tabs>
      </div>
    </BgWrapper>
  );
}
