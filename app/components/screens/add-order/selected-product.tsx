import type { UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

type Props = { form: UseFormReturn<any> };

type ProductCardType = {
  data: any;
  form: UseFormReturn<any>;
  index: number;
};

const ProductCard = ({ data, form, index }: ProductCardType) => {
  const handleRemove = () => {
    const current_products = form.getValues("products") || [];

    const updatedProducts = current_products.filter(
      (_: any, i: number) => i !== index
    );

    form.setValue("products", updatedProducts);
  };

  return (
    <div className="flex items-center gap-3 justify-between p-3 border-b border-muted last:border-b-0 hover:bg-muted-foreground/5">
      <div className="flex-1 flex gap-3">
        <img
          src={data?.image}
          className="w-20 object-cover rounded-md"
          alt={data?.name || "Product image"}
        />

        <div>
          <div className="font-medium max-w-100 mb-2">{data?.name}</div>
          <div className="text-sm text-muted-foreground mb-3">
            ₹{Math.round(Number(data?.price)).toLocaleString("en-IN")}
            {" • "}
            {<span>Qty: {data?.qty}</span>}
            {" • "}
            {<span>Variation: {data?.variation}</span>}

          </div>
        </div>
      </div>

      <Button
        onClick={handleRemove}
        size="sm"
        className="min-w-fit"
        variant="destructive"
      >
        Remove
      </Button>
    </div>
  );
};

export default function SelectedProduct({ form }: Props) {
  const data = form.watch("products");

  return (
    <div className="p-4">
      <ScrollArea className="max-h-100 overflow-auto">
        {data?.map((item: any, index: number) => {
          return (
            <ProductCard
              form={form}
              key={`${item?.product_id}-${item?.var_value_id || "no-variation"
                }-${index}`}
              data={item}
              index={index}
            />
          );
        })}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
