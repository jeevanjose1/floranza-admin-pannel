import { Edit, Check, X, Infinity } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import ErrorMessage from "~/components/ui/error-message";
import { useLocation, useParams } from "react-router";
import { Textarea } from "~/components/ui/textarea";
import { Separator } from "~/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { useUpdateStock } from "~/services/queries/product";
import { toast } from "sonner";

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
  prd_var_value_id: string;
  action_type?: string;
  note?: string;
  new_quantity?: string;
};

function ProductVariationsTable({ form }: Props) {
  const [variations, setVariations] = useState<Variation[]>([]);
  const [expandedVariation, setExpandedVariation] = useState<string | null>(
    null
  );
  const location = useLocation();
  const isEdit = location.pathname?.includes('edit');
  const [initialApiDataLoaded, setInitialApiDataLoaded] = useState(false);
  const params = useParams()
  const { mutateAsync: update, isPending } = useUpdateStock()
  // Check if we have variations from the parent form (from API)
  useEffect(() => {
    const existingVariations = form.getValues("variations");

    if (
      existingVariations &&
      existingVariations.length > 0 &&
      !initialApiDataLoaded
    ) {
      setVariations(existingVariations);
      setInitialApiDataLoaded(true);

      // Auto-expand the first variation
      if (expandedVariation === null) {
        setExpandedVariation(existingVariations[0].id);
      }
    }
  }, [form, initialApiDataLoaded, expandedVariation]);

  // Update variations when attributes change
  useEffect(() => {
    const attributes = form.getValues("attributes") || [];
    const activeAttributes = attributes.filter(
      (attr: Attribute) =>
        attr.is_add && Array.isArray(attr.value) && attr.value.length > 0
    );

    // If no active attributes, clear all variations except API ones
    if (activeAttributes.length === 0) {
      // Get existing variations
      const existingVariations =
        variations.length > 0 ? variations : form.getValues("variations") || [];

      // Keep only API variations (those with prd_var_value_id)
      const apiVariations = existingVariations.filter(
        (variation: Variation) =>
          variation.prd_var_value_id && variation.prd_var_value_id !== ""
      );

      setVariations(apiVariations);
      form.setValue("variations", apiVariations);

      // Reset expanded variation if current one was removed
      if (
        expandedVariation &&
        !apiVariations.find((v: Variation) => v.id === expandedVariation)
      ) {
        setExpandedVariation(
          apiVariations.length > 0 ? apiVariations[0].id : null
        );
      }

      return;
    }

    // Get currently active attribute IDs and their values
    const activeAttributeIds = new Set(
      activeAttributes.map((attr: Attribute) => attr.id)
    );

    // Create a map of active attribute values for quick lookup
    const activeAttributeValues = new Map();
    activeAttributes.forEach((attr: Attribute) => {
      const valueSet = new Set(
        attr.value.map((val: any) => val.value || val.label || val)
      );
      activeAttributeValues.set(attr.id, valueSet);
    });

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
        prd_var_value_id: "",
        action_type: "",
        note: "",
        new_quantity: "",
      };
    });

    // Get existing variations (preserve both API and previously generated data)
    const existingVariations =
      variations.length > 0 ? variations : form.getValues("variations") || [];

    // Filter existing variations to keep only valid ones
    const validExistingVariations = existingVariations.filter(
      (variation: Variation) => {
        // If it's from API (has prd_var_value_id), check if its attributes are still active
        if (variation.prd_var_value_id && variation.prd_var_value_id !== "") {
          // Check if all attribute IDs in this variation are still active
          const variationAttributeIds = variation.attribute_id.split(",");
          const variationValueIds = variation.value_id.split(",");

          // All attribute IDs must be active
          const allAttributesActive = variationAttributeIds.every((attrId) =>
            activeAttributeIds.has(attrId)
          );

          // All values must still exist in their respective attributes
          const allValuesExist = variationAttributeIds.every((attrId, index) => {
            const valueId = variationValueIds[index];
            const activeValues = activeAttributeValues.get(attrId);
            return activeValues && activeValues.has(valueId);
          });

          return allAttributesActive && allValuesExist;
        }

        // For generated variations, check if this combination still exists in the new variations
        return newVariations.some(
          (newVar) =>
            newVar.attribute_id === variation.attribute_id &&
            newVar.value_id === variation.value_id
        );
      }
    );

    // Merge new variations with valid existing ones
    const mergedVariations = [...validExistingVariations];

    // Add new variations that don't already exist
    newVariations.forEach((newVar) => {
      const existingIndex = mergedVariations.findIndex(
        (existingVar) =>
          existingVar.attribute_id === newVar.attribute_id &&
          existingVar.value_id === newVar.value_id
      );

      if (existingIndex === -1) {
        // This is a new variation, add it
        mergedVariations.push(newVar);
      } else {
        // This variation already exists, just update the name and sku if needed
        mergedVariations[existingIndex] = {
          ...mergedVariations[existingIndex],
          name: newVar.name,
          sku: newVar.sku,
        };
      }
    });

    // Update IDs to be sequential
    const finalVariations = mergedVariations.map((variation, index) => ({
      ...variation,
      id: variation.prd_var_value_id || index.toString(),
    }));

    // Only update if there's an actual change
    const currentVariations = variations.length > 0 ? variations : form.getValues("variations") || [];
    const hasChanged =
      finalVariations.length !== currentVariations.length ||
      finalVariations.some((newVar, index) => {
        const oldVar = currentVariations[index];
        return !oldVar ||
          newVar.attribute_id !== oldVar.attribute_id ||
          newVar.value_id !== oldVar.value_id ||
          newVar.name !== oldVar.name;
      });

    if (hasChanged) {
      setVariations(finalVariations);
      form.setValue("variations", finalVariations);

      // Reset expanded variation if current one was removed
      const currentExpanded = expandedVariation;
      if (
        currentExpanded &&
        !finalVariations.find((v: Variation) => v.id === currentExpanded)
      ) {
        setExpandedVariation(
          finalVariations.length > 0 ? finalVariations[0].id : null
        );
      } else if (finalVariations.length > 0 && currentExpanded === null) {
        // Auto-expand the first variation when variations are generated for the first time
        setExpandedVariation(finalVariations[0].id);
      }
    }
  }, [form.watch("attributes"), initialApiDataLoaded]);

  // Handle input change for a field
  const handleInputChange = (
    index: number,
    field:
      | "price"
      | "salesPrice"
      | "quantity"
      | "qty_infinity"
      | "new_title"
      | "tempNewTitle"
      | "prd_var_value_id"
      | "action_type"
      | "note"
      | "new_quantity",
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

  // Handle quantity update
  const handleQuantityUpdate = (index: number) => {
    const variation = variations[index];
    const currentQty = Number(variation.quantity) || 0;
    const newQty = Number(variation.new_quantity) || 0;

    if (!variation.action_type || newQty <= 0) {
      return;
    }

    let updatedQuantity: number;
    if (variation.action_type === 'add') {
      updatedQuantity = currentQty + newQty;
    } else {
      updatedQuantity = Math.max(0, currentQty - newQty);
    }

    const form_data = new FormData()
    form_data.append('qty', String(newQty))
    form_data.append('prd_var_value_id', variation.prd_var_value_id)
    form_data.append('stock_type', variation.action_type === 'add' ? 'ADD' : 'SUBTRACT')
    form_data.append('note', String(variation.note))

    update({
      product_id: params?.product_id,
      data: form_data
    }, {
      onSuccess: (response) => {
                toast.success(response?.message)

        const newVariations = [...variations];
        newVariations[index].quantity = updatedQuantity.toString();
        newVariations[index].new_quantity = "";
        newVariations[index].action_type = "";
        newVariations[index].note = "";

        setVariations(newVariations);
        form.setValue(`variations.${index}.quantity`, updatedQuantity.toString());
        form.setValue(`variations.${index}.new_quantity`, "");
        form.setValue(`variations.${index}.action_type`, "");
        form.setValue(`variations.${index}.note`, "");

      },
      onError: (error:any) => {
        toast.error(error?.data?.message)

      }
    })



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
              className={`flex items-center justify-between px-4 py-2 cursor-pointer ${expandedVariation === variation.id ? "bg-muted/30" : ""
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
                        <span className="text-blue-600">({variation.new_title})</span>
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

                    <div className={`grid grid-cols-1 ${isEdit ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
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

                      {isEdit ? (
                        <div className="col-span-2 p-3 rounded-md bg-white">
                          <div>
                            <h2 className="text-[13px] mb-1">Current quantity</h2>
                            <p className="text-xl font-semibold">{variation.quantity || "0"}</p>
                          </div>
                          <Separator className="my-3 bg-muted" />
                          <div className="mb-3">
                            <RadioGroup
                              value={variation.action_type || ""}
                              onValueChange={(value) =>
                                handleInputChange(index, "action_type", value)
                              }
                              className="flex mb-3"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="add" id={`add-${index}`} />
                                <Label className="mb-0 text-xs font-medium text-slate-700" htmlFor={`add-${index}`}>
                                  Add Stock
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="remove" id={`remove-${index}`} />
                                <Label className="mb-0 text-xs font-medium text-slate-700" htmlFor={`remove-${index}`}>
                                  Remove Stock
                                </Label>
                              </div>
                            </RadioGroup>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-medium text-slate-700">
                                  {variation.action_type === 'add'
                                    ? 'Enter quantity you want to add'
                                    : variation.action_type === 'remove'
                                      ? 'Enter quantity you want to remove'
                                      : 'Select action type first'}
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  min="1"
                                  value={variation.new_quantity || ""}
                                  disabled={!variation.action_type}
                                  onChange={(e) => handleInputChange(index, "new_quantity", e.target.value)}
                                  className="h-9 text-sm bg-white"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <Textarea
                              value={variation.note || ""}
                              onChange={(e) => handleInputChange(index, "note", e.target.value)}
                              className="resize-none"
                              placeholder="Type your note here..."
                            />
                          </div>
                          <div className="mt-3 w-full flex justify-end">
                            <Button
                              disabled={!variation.action_type || !variation.new_quantity || Number(variation.new_quantity) <= 0}
                              type="button"
                              onClick={() => handleQuantityUpdate(index)}
                              size="sm"
                              loading={isPending}
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      ) : (
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
                          <div className="flex items-center gap-2">
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
                      )}
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