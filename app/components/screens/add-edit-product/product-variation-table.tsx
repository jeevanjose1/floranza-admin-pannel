import { Edit, Check, X, Infinity } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import ErrorMessage from "~/components/ui/error-message";

type Props = { form: UseFormReturn<any> };
type Attribute = {
  id: string;
  name: string;
  is_add: boolean;
  value: Array<{ label?: string; value?: string }>;
};

type Variation = {
  id: string;
  attribute_id: string;
  value_id: string;
  name: string;
  new_title?: string;
  sku: string;
  price: string;
  salesPrice: string;
  quantity: string;
  qty_infinity: boolean;
  isEditing?: boolean;
  tempNewTitle?: string;
};

function ProductVariationsTable({ form }: Props) {
  const [variations, setVariations] = useState<Variation[]>([]);
  const [expandedVariation, setExpandedVariation] = useState<string | null>(null);

  // Update variations when attributes change
  useEffect(() => {
    // Get only the active attributes (ones that are added and have values)
    const attributes = form.getValues("attributes") || [];
    const activeAttributes = attributes.filter(
      (attr: Attribute) =>
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
        valueId: val.value || val,
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
      const name = combo
        .map((item: { name: any; value: any }) => `${item.name}: ${item.value}`)
        .join(", ");
      const sku = combo.map((item: { valueId: any }) => item.valueId).join("-");

      // Extract attribute IDs and value IDs
      const attribute_ids = combo.map((item: { id: any }) => item.id);
      const value_ids = combo.map((item: { valueId: any }) => item.valueId);

      return {
        id: index.toString(),
        attribute_id: attribute_ids.join(","),
        value_id: value_ids.join(","),
        name,
        new_title: "",
        sku,
        price: "",
        salesPrice: "",
        quantity: "",
        qty_infinity: false,
        isEditing: false,
        tempNewTitle: "",
      };
    });

    // Preserve existing values
    const existingVariations = form.getValues("variations") || [];

    const finalVariations = newVariations.map((newVar) => {
      const existingVar = existingVariations.find(
        (v: { sku: any }) => v.sku === newVar.sku
      );
      if (existingVar) {
        return {
          ...newVar,
          new_title: existingVar.new_title || "",
          price: existingVar.price || "",
          salesPrice: existingVar.salesPrice || "",
          quantity: existingVar.quantity || "",
          qty_infinity:
            existingVar.qty_infinity !== undefined
              ? existingVar.qty_infinity
              : true,
          isEditing: false,
          tempNewTitle: existingVar.new_title || "",
        };
      }
      return newVar;
    });

    setVariations(finalVariations);
    form.setValue("variations", finalVariations);
    
    // Auto-expand the first variation when variations are generated for the first time
    if (finalVariations.length > 0 && expandedVariation === null) {
      setExpandedVariation(finalVariations[0].id);
    }
  }, [form.watch("attributes")]);

  // Handle input change for a field
  const handleInputChange = (
    index: number,
    field:
      | "price"
      | "salesPrice"
      | "quantity"
      | "qty_infinity"
      | "new_title"
      | "tempNewTitle",
    value: any
  ) => {
    const newVariations = [...variations];
    if (field === "qty_infinity") {
      newVariations[index][field] = value;
      if (value === true) {
        newVariations[index].quantity = "";
      }
    } else {
      newVariations[index][field] = value;
    }
    setVariations(newVariations);

    if (field !== "tempNewTitle") {
      form.setValue(
        `variations.${index}.${field}`,
        newVariations[index][field]
      );
    }
  };

  const toggleEditMode = (index: number) => {
    const newVariations = [...variations];
    newVariations[index].isEditing = !newVariations[index].isEditing;
    newVariations[index].tempNewTitle = newVariations[index].new_title || "";
    setVariations(newVariations);
  };

  // Save edited variation name
  const saveVariationName = (index: number) => {
    const newVariations = [...variations];
    newVariations[index].new_title = newVariations[index].tempNewTitle || "";
    newVariations[index].isEditing = false;
    setVariations(newVariations);
    form.setValue(
      `variations.${index}.new_title`,
      newVariations[index].new_title
    );
  };

  // Cancel editing variation name
  const cancelEditName = (index: number) => {
    const newVariations = [...variations];
    newVariations[index].isEditing = false;
    newVariations[index].tempNewTitle = newVariations[index].new_title || "";
    setVariations(newVariations);
  };

  // Toggle expanded state for a variation
  const toggleExpandVariation = (id: string) => {
    setExpandedVariation(expandedVariation === id ? null : id);
  };

  // If no variations, show message
  if (variations.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-sm font-medium mb-2">Product Variations</h2>
        <div className="rounded-lg bg-muted/20 p-6 text-center">
          <p className="text-sm text-accent-foreground">
            Add at least one attribute with values to generate product
            variations.
          </p>
        </div>
        <ErrorMessage
          error={form?.formState?.errors?.attributes?.root?.message as string}
        />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium">
          Product Variations ({variations.length})
        </h2>
      </div>

      <div className="space-y-3">
        {variations.map((variation, index) => (
          <motion.div
            key={variation.id}
            className="border border-muted rounded-md overflow-hidden bg-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            <div
              className={`flex items-center justify-between px-4 py-2 cursor-pointer ${
                expandedVariation === variation.id ? "bg-muted/30" : ""
              }`}
              onClick={() => toggleExpandVariation(variation.id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {variation.isEditing ? (
                  <div className="flex items-center gap-1 w-full">
                    <div className="font-medium text-xs text-muted-foreground/60 truncate ">
                      {variation.name}
                    </div>
                    <Input
                      type="text"
                      placeholder="Add custom title"
                      value={variation.tempNewTitle}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleInputChange(index, "tempNewTitle", e.target.value)
                      }
                      className="h-8 text-sm max-w-44"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        saveVariationName(index);
                      }}
                      className="h-8 w-8 shrink-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEditName(index);
                      }}
                      className="h-8 w-8 shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="font-medium text-[13px] flex gap-1 text-slate-800 truncate ">
                      <span>{variation.name}</span>

                      {variation?.new_title && (
                        <span>({variation?.new_title})</span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEditMode(index);
                      }}
                      className="h-8 w-8 shrink-0 text-slate-500 hover:text-slate-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <div className="text-sm font-medium">
                    {variation.price ? `₹${variation.price}` : ""}
                  </div>
                  {variation.salesPrice && (
                    <div className="text-xs text-green-600">
                      Sale: ₹ {variation.salesPrice}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 min-w-16 justify-end">
                  {variation.qty_infinity ? (
                    <span className="text-slate-600 flex items-center gap-1">
                      <Infinity className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="text-sm font-medium">
                      {variation.quantity || "0"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded content with AnimatePresence for animation */}
            <AnimatePresence>
              {expandedVariation === variation.id && (
                <motion.div
                  className="border-t border-slate-200 bg-muted/20"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.3, ease: "easeInOut" },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <motion.div
                    className="p-4"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="text-xs text-slate-500 mb-4">
                      Original: {variation.name}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Price
                        </label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={variation.price}
                          onChange={(e) =>
                            handleInputChange(index, "price", e.target.value)
                          }
                          className="h-9 text-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Sale Price
                        </label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={variation.salesPrice}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "salesPrice",
                              e.target.value
                            )
                          }
                          className="h-9 text-sm bg-white"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-slate-700">
                            Quantity
                          </label>
                          <div className="flex items-center gap-1">
                            <Checkbox
                              id={`qty-infinity-${index}`}
                              checked={variation.qty_infinity}
                              onCheckedChange={(checked) =>
                                handleInputChange(
                                  index,
                                  "qty_infinity",
                                  checked
                                )
                              }
                              className="bg-white"
                            />
                            <label
                              htmlFor={`qty-infinity-${index}`}
                              className="text-xs text-slate-600 flex items-center gap-1 cursor-pointer"
                            >
                              Unlimited <Infinity className="h-3 w-3" />
                            </label>
                          </div>
                        </div>
                        <Input
                          type="number"
                          placeholder="0"
                          value={variation.quantity}
                          disabled={variation.qty_infinity}
                          onChange={(e) =>
                            handleInputChange(index, "quantity", e.target.value)
                          }
                          className="h-9 text-sm bg-white"
                        />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ProductVariationsTable;