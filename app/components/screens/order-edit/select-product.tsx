import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { useAddOrderItems } from "~/services/queries/order";
import { useSearchProduct } from "~/services/queries/product";
import { calculate_product_price } from "~/shared/others/others";

type Props = { current_item: any };

type ProductCardProps = {
  data: any;
  current_item: any;
};

const ProductCard = ({ data, current_item }: ProductCardProps) => {

  const price = calculate_product_price(data);
  const [variation, setVariation] = useState<any>(false);
  const is_variation = Boolean(data?.is_variation);
  const is_pre_order = Boolean(data?.is_pre_order);
  const { mutateAsync: add, isPending } = useAddOrderItems()
  const [qty, setQty] = useState<number>(1);
  const params = useParams()
  const handleAddProduct = () => {
    const current_products = current_item || [];
    const is_prebook_product = current_products.find(
      (item: any) => item.is_prebook
    );
     const is_same_product = ()=>{
    return current_products?.find((item:any)=>item?.product_id===data?.id)
  }
  
    if ((is_pre_order&&!is_same_product() )&& (Boolean(current_products?.length))) {
      toast.warning(
        "Select product is pre order item, remove the current selected product"
      );
    } else if (is_prebook_product&&!is_same_product()) {
      toast.warning("Pre order product in the selected items");
    } else {

      const form_data = new FormData()
      form_data.append('product_id', data?.id),
        form_data.append('prd_var_value_id', variation?.prd_var_value_id ? variation?.prd_var_value_id : null)
      form_data.append('qty', qty as any),

        add({
          data: form_data,
          id: params?.order_id
        }, {
          onSuccess: () => {
            toast.success('Item added')
          },
          onError: (error:any) => {
            toast.error(error.data?.message);
          }
        })

    }
  };

  const getAvailableStock = () => {
    if (is_variation && variation) {
      return variation.qty || "Select Size";
    }
    return data?.qty || "Select Size";
  };

  const availableStock = getAvailableStock();

  const handleVariation = (item: any) => {
    setVariation(item);
    setQty(1);
  };

  const addQty = () => {
    if (qty < availableStock) {
      setQty((prev) => prev + 1);
    }
  };

  const removeQty = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= availableStock) {
      setQty(value);
    }
  };

  const isAddDisabled = () => {
    if (is_variation && !variation) return true;
    if (availableStock === 0) return true;
    if (qty > availableStock) return true;
    return false;
  };

  return (
    <div className="flex items-center gap-3 justify-between p-3 border-b border-muted last:border-b-0 hover:bg-muted-foreground/5">
      <div className="flex-1 flex gap-3">
        <img
          src={data?.images?.[0]?.mini}
          className="w-20 object-cover rounded-md"
          alt={data?.name || "Product image"}
        />

        <div>
          <div className="font-medium max-w-100 mb-2">{data?.name}</div>
          <div className="text-sm text-muted-foreground mb-3">
            ₹{Math.round(Number(price.min)).toLocaleString("en-IN")}
            {price.max >0 && (
              <>
                {" - "}
                <span className="line-through text-muted-foreground/50">
                  ₹{Math.round(Number(price.max)).toLocaleString("en-IN")}
                </span>
              </>
            )}
            {" • "}
            {
              <span className={availableStock === 0 ? "text-red-500" : ""}>
                Stock: {availableStock}
              </span>
            }
          </div>

          {/* Variations Section */}
          <div className="flex flex-wrap gap-2">
            {data?.variations?.map((sizeInfo: any, index: number) => (
              <Badge
                key={sizeInfo.prd_var_value_id}
                onClick={() => handleVariation(sizeInfo)}
                disabled={
                  sizeInfo?.qty === 0 || !sizeInfo.attribute_option_name
                }
                className={`text-xs px-2 rounded-sm cursor-pointer transition-colors ${variation?.prd_var_value_id === sizeInfo.prd_var_value_id
                  ? "hover:bg-main/90 bg-primary/100 text-white"
                  : ""
                  } ${sizeInfo?.qty === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                variant={"outline"}
              >
                {sizeInfo.attribute_option_name}
                {sizeInfo?.qty === 0 && " (Out of Stock)"}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Quantity Section */}
      <div className="flex items-center gap-2 min-w-fit">
        <Button
          onClick={removeQty}
          variant={"outline"}
          size="sm"
          type="button"
          disabled={qty <= 1}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Input
          type="number"
          value={qty}
          onChange={handleQtyChange}
          min={1}
          max={availableStock}
          className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          disabled={availableStock === 0}
        />

        <Button
          disabled={qty >= availableStock || availableStock === 0}
          onClick={addQty}
          variant={"outline"}
          size="sm"
          type="button"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddProduct}
        size="sm"
        disabled={isAddDisabled()}
        className="min-w-fit"
        loading={isPending}

      >
        Add
        <Plus className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default function SelectProduct({ current_item }: Props) {
  const { mutate: search_produst, isPending, data } = useSearchProduct();
  const [search, setSearch] = useState("");
  const handleSearch = () => {
    search_produst({ search: search });
  };
  return (
    <div className="pb-2">
      <div className="flex items-center gap-3">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search Product"
        />
        <Button
          onClick={handleSearch}
          loading={isPending}
          disabled={search === ""}
          size={"sm"}
          type="button"
        >
          Search
        </Button>
      </div>

      <div className="mt-4">
        {data && <h1 className="text-sm font-medium mb-2">Search result</h1>}
        <ScrollArea className="max-h-100 overflow-y-auto">
          {data?.data?.map((item: any) => {
            return <ProductCard current_item={current_item} key={item?.id} data={item} />;
          })}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

      </div>
    </div>
  );
}
