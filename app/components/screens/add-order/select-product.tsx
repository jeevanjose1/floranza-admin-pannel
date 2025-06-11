import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { useSearchProduct } from "~/services/queries/product";
import { calculate_product_price } from "~/shared/others/others";

type Props = { form: UseFormReturn<any> };

type ProductCardProps = {
  data: any;
  form: UseFormReturn<any>;
};

const ProductCard = ({ data, form }: ProductCardProps) => {
  const price = calculate_product_price(data);
  const [variation, setVariation] = useState<any>(false);
  const is_variation = Boolean(data?.is_variation);
  const [qty, setQty] = useState<number>(1);

  const handleAddProduct = () => {
    const current_products = form.getValues("products") || [];

    const product_data = {
      name: data?.name,
      price: price.min,
      qty: qty,
      product_id: data?.id,
      is_variation: is_variation,
      var_value_id: variation?.prd_var_value_id,
      image: data?.images?.[0]?.mini,
    };

    const existingProductIndex = current_products.findIndex((product: any) => {
      if (is_variation) {
        return (
          product.product_id === data?.id &&
          product.var_value_id === variation?.prd_var_value_id
        );
      } else {
        return product.product_id === data?.id && !product.var_value_id;
      }
    });

    if (existingProductIndex !== -1) {
      const updatedProducts = [...current_products];
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        qty: updatedProducts[existingProductIndex].qty + qty,
      };
      form.setValue("products", updatedProducts);
    } else {
      form.setValue("products", [...current_products, product_data]);
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
            {price.max && (
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
                className={`text-xs px-2 rounded-sm cursor-pointer transition-colors ${
                  variation?.prd_var_value_id === sizeInfo.prd_var_value_id
                    ? "hover:bg-main/90 bg-primary/100 text-white"
                    : ""
                } ${
                  sizeInfo?.qty === 0 ? "opacity-50 cursor-not-allowed" : ""
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
      >
        Add
        <Plus className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default function SelectProduct({ form }: Props) {
  const { mutate: search_produst, isPending, data } = useSearchProduct();
  const [search, setSearch] = useState("");
  const handleSearch = () => {
    search_produst({ search: search });
  };
  return (
    <div className="p-4">
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
        <ScrollArea className="max-h-100 overflow-auto">
          {data?.data?.map((item: any) => {
            return <ProductCard form={form} key={item?.id} data={item} />;
          })}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <ErrorMessage
          error={form?.formState.errors.products?.message as string}
        />
      </div>
    </div>
  );
}
