import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "~/components/ui/input";

type Props = { form: UseFormReturn<any> };
type Attribute = {
  id: string;
  name: string;
  is_add: boolean;
  value: Array<{label?: string; value?: string}>;
};

type Variation = {
  id: string;
  name: string;
  sku: string;
  price: string;
  salesPrice: string;
  quantity: string;
};

function ProductVariationsTable({ form }:Props) {
  const [variations, setVariations] = useState<Variation[]>([]);

  // Update variations when attributes change
  useEffect(() => {
    // Get only the active attributes (ones that are added and have values)
    const attributes = form.getValues("attributes") || [];
    const activeAttributes = attributes.filter((attr: Attribute) => 
      attr.is_add && Array.isArray(attr.value) && attr.value.length > 0
    );

    // If no active attributes, return empty array
    if (activeAttributes.length === 0) {
      setVariations([]);
      form.setValue("variations", []);
      return;
    }

    // Create an array of attribute values
    const attrValues = activeAttributes.map((attr: Attribute) => 
      attr.value.map((val: any) => ({
        name: attr.name,
        id: attr.id,
        value: val.label || val,
        valueId: val.value || val
      }))
    );

    // Generate all combinations
    let result: any[] = [[]];
    for (const values of attrValues) {
      const temp: any[] = [];
      for (const item of result) {
        for (const value of values) {
          temp.push([...item, value]);
        }
      }
      result = temp;
    }

    // Convert combinations to variation objects
    const newVariations = result.map((combo, index) => {
      const name = combo.map((item: { name: any; value: any; }) => `${item.name}: ${item.value}`).join(", ");
      const sku = combo.map((item: { valueId: any; }) => item.valueId).join("-");
      
      return {
        id: index.toString(),
        name,
        sku,
        price: "",
        salesPrice: "",
        quantity: ""
      };
    });

    // Preserve existing values
    const existingVariations = form.getValues("variations") || [];
    
    const finalVariations = newVariations.map(newVar => {
      const existingVar = existingVariations.find((v: { sku: any; }) => v.sku === newVar.sku);
      if (existingVar) {
        return {
          ...newVar,
          price: existingVar.price || "",
          salesPrice: existingVar.salesPrice || "",
          quantity: existingVar.quantity || ""
        };
      }
      return newVar;
    });
    
    setVariations(finalVariations);
    form.setValue("variations", finalVariations);
  }, [form.watch("attributes")]);
  
  // If no variations, show message
  if (variations.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-sm font-semibold mb-2">Product Variations</h2>
        <p className="text-sm text-muted-foreground">
          Add at least one attribute with values to generate product variations.
        </p>
      </div>
    );
  }
  
  // Handle input change for a field
  const handleInputChange = (index: number, field: 'price' | 'salesPrice' | 'quantity', value: string) => {
    const newVariations = [...variations];
    newVariations[index][field] = value;
    setVariations(newVariations);
    form.setValue(`variations.${index}.${field}`, value);
  };
  
  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold mb-2">Product Variations ({variations.length})</h2>
      <div className="border border-muted-foreground/20 rounded-md">
        {/* Header row */}
        <div className="grid grid-cols-4 gap-2 p-3 bg-muted/30 font-medium text-sm">
          <div>Variation</div>
          <div>Price</div>
          <div>Sales Price</div>
          <div>Quantity</div>
        </div>
        
        {/* Variation rows */}
        {variations.map((variation, index) => (
          <div key={variation.id} className="grid grid-cols-4 gap-2 p-3 border-t border-gray-100">
            <div>
              <div className="text-sm font-medium">{variation.name}</div>
              <div className="text-xs text-gray-500">SKU: {variation.sku}</div>
            </div>
            
            <div>
              <Input
                type="number"
                placeholder="0.00"
                value={variation.price}
                onChange={(e) => handleInputChange(index, 'price', e.target.value)}
              />
            </div>
            
            <div>
              <Input
                type="number"
                placeholder="0.00"
                value={variation.salesPrice}
                onChange={(e) => handleInputChange(index, 'salesPrice', e.target.value)}
              />
            </div>
            
            <div>
              <Input
                type="number" 
                placeholder="0"
                value={variation.quantity}
                onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductVariationsTable;