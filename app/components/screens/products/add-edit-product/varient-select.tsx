import { useState } from 'react';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { PlusCircle, X, Settings, ChevronDown, ChevronUp } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "~/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "~/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import type { UseFormReturn } from 'react-hook-form';

// Types
type OptionValue = { id: string; value: string };
type OptionType = { id: string; name: string; values: OptionValue[] };
type VariantType = {
  id: string;
  title: string;
  price: string;
  compareAtPrice: string;
  sku: string;
  quantity: string;
  optionValues: Record<string, string>;
  isAvailable: boolean;
};

// Constants
const DEFAULT_OPTION_NAMES = ["Size", "Color", "Material", "Style"];
const MAX_OPTIONS = 3;
const VARIANTS_PER_PAGE = 5;

type Props = { form: UseFormReturn<any> };

export default function VariantsSelect({ form }: Props) {
  // State
  const [options, setOptions] = useState<OptionType[]>([
    { id: "option1", name: "Size", values: [] }
  ]);
  const [variants, setVariants] = useState<VariantType[]>([]);
  const [showAllVariants, setShowAllVariants] = useState(false);
  const [optionValues, setOptionValues] = useState<Record<string, string>>({});
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkEditFields, setBulkEditFields] = useState({
    price: "", compareAtPrice: "", sku: "", quantity: ""
  });

  // Option functions
  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    
    const nextOptionIndex = options.length + 1;
    const newOptions = [...options, { 
      id: `option${nextOptionIndex}`, 
      name: DEFAULT_OPTION_NAMES[options.length], 
      values: [] 
    }];
    
    setOptions(newOptions);
  };
  
  const removeOption = (optionId: string) => {
    const updatedOptions = options.filter(option => option.id !== optionId);
    setOptions(updatedOptions);
    regenerateVariants(updatedOptions);
  };
  
  const updateOptionName = (optionId: string, newName: string) => {
    setOptions(options.map(option => 
      option.id === optionId ? { ...option, name: newName } : option
    ));
  };

  // Option value functions
  const addOptionValue = (optionId: string) => {
    const value = optionValues[optionId]?.trim();
    if (!value) return;
    
    const updatedOptions = options.map(option => {
      if (option.id === optionId) {
        if (option.values.some(v => v.value.toLowerCase() === value.toLowerCase())) {
          return option;
        }
        
        return {
          ...option,
          values: [...option.values, { id: `${optionId}-${Date.now()}`, value }]
        };
      }
      return option;
    });
    
    setOptions(updatedOptions);
    setOptionValues({ ...optionValues, [optionId]: "" });
    regenerateVariants(updatedOptions);
  };
  
  const removeOptionValue = (optionId: string, valueId: string) => {
    const updatedOptions = options.map(option => {
      if (option.id === optionId) {
        return {
          ...option,
          values: option.values.filter(v => v.id !== valueId)
        };
      }
      return option;
    });
    
    setOptions(updatedOptions);
    regenerateVariants(updatedOptions);
  };

  // Generate variant combinations from options
  const regenerateVariants = (currentOptions = options) => {
    const validOptions = currentOptions.filter(option => option.values.length > 0);
    
    if (validOptions.length === 0) {
      setVariants([]);
      return;
    }
    
    // Generate combinations recursively
    const generateCombinations = (options: OptionType[], current: Record<string, string> = {}, index = 0): Record<string, string>[] => {
      if (index === options.length) {
        return [current];
      }
      
      const currentOption = options[index];
      const combinations: Record<string, string>[] = [];
      
      for (const valueObj of currentOption.values) {
        const newCombination = { ...current, [currentOption.id]: valueObj.value };
        combinations.push(...generateCombinations(options, newCombination, index + 1));
      }
      
      return combinations;
    };
    
    // Create variants, preserving existing data where possible
    const combinations = generateCombinations(validOptions);
    const newVariants = combinations.map(combo => {
      const variantKey = Object.entries(combo)
        .map(([key, value]) => `${key}:${value}`)
        .sort()
        .join('-');
      
      // Find existing variant with same options
      const existingVariant = variants.find(v => {
        return Object.entries(combo).every(
          ([optId, optValue]) => v.optionValues[optId] === optValue
        );
      });
      
      if (existingVariant) {
        return {
          ...existingVariant,
          optionValues: combo,
          title: generateVariantTitle(combo, validOptions)
        };
      }
      
      // Create new variant
      return {
        id: `variant-${variantKey}`,
        title: generateVariantTitle(combo, validOptions),
        price: "",
        compareAtPrice: "",
        sku: "",
        quantity: "0",
        optionValues: combo,
        isAvailable: true
      };
    });
    
    setVariants(newVariants);
  };
  
  const generateVariantTitle = (optionValues: Record<string, string>, currentOptions = options) => {
    return Object.entries(optionValues)
      .map(([_, value]) => value)
      .join(' / ');
  };

  // Update variant field value
  const updateVariant = (variantId: string, field: string, value: string | boolean) => {
    setVariants(variants.map(variant => 
      variant.id === variantId ? { ...variant, [field]: value } : variant
    ));
  };
  
  // Apply bulk edit to all variants
  const applyBulkEdit = () => {
    setVariants(variants.map(variant => {
      const updates: any = {};
      
      if (bulkEditFields.price) updates.price = bulkEditFields.price;
      if (bulkEditFields.compareAtPrice) updates.compareAtPrice = bulkEditFields.compareAtPrice;
      if (bulkEditFields.sku) updates.sku = bulkEditFields.sku;
      if (bulkEditFields.quantity) updates.quantity = bulkEditFields.quantity;
      
      return { ...variant, ...updates };
    }));
    
    setBulkEditOpen(false);
    setBulkEditFields({ price: "", compareAtPrice: "", sku: "", quantity: "" });
  };

  // Set all variant prices to match the first variant
  const normalizePrices = () => {
    if (variants.length > 0) {
      const firstPrice = variants[0].price;
      setVariants(variants.map(v => ({...v, price: firstPrice})));
    }
  };

  return (
    <div className="w-full">
      {/* Options Section */}
      <div>
        {options.map((option, index) => (
          <div key={option.id} className="mb-4 border rounded-md p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">Option name</Label>
                <Input 
                  placeholder="Option name" 
                  value={option.name}
                  onChange={(e) => updateOptionName(option.id, e.target.value)}
                  className="h-8"
                />
              </div>
              {options.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeOption(option.id)}
                  className="ml-2 text-destructive"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            
            {/* Option Values Input */}
            <div className="mb-3">
              <Label className="text-xs text-muted-foreground mb-1 block">Option values</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder={`Add ${option.name.toLowerCase()} value`}
                  value={optionValues[option.id] || ""}
                  onChange={(e) => setOptionValues({
                    ...optionValues,
                    [option.id]: e.target.value
                  })}
                  className="h-8"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addOptionValue(option.id);
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addOptionValue(option.id)}
                >
                  <PlusCircle size={16} className="mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            {/* Option Value Chips */}
            {option.values.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {option.values.map(value => (
                  <div key={value.id} className="bg-muted rounded-md px-2 py-1 flex items-center text-sm">
                    {value.value}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeOptionValue(option.id, value.id)}
                      className="ml-1 h-4 w-4 p-0"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {options.length < MAX_OPTIONS && (
          <Button
            variant="outline"
            size="sm"
            onClick={addOption}
            className="w-full"
          >
            <PlusCircle size={16} className="mr-2" />
            Add another option
          </Button>
        )}
      </div>

      {/* Variants Section */}
      {options.length > 0 && variants.length > 0 && (
        <div>
          <h1 className="text-sm font-semibold py-2">
            Variants ({variants.length})
          </h1>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm">
                {showAllVariants 
                  ? `Showing all ${variants.length} variants` 
                  : `Showing ${Math.min(VARIANTS_PER_PAGE, variants.length)} of ${variants.length} variants`}
              </div>
              
              <div className="flex gap-2">
                {/* Bulk Edit Dialog */}
                <Dialog open={bulkEditOpen} onOpenChange={setBulkEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings size={14} className="mr-1" />
                      Bulk edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bulk Edit Variants</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid gap-4 p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Price</Label>
                          <Input 
                            placeholder="Price" 
                            value={bulkEditFields.price}
                            onChange={(e) => setBulkEditFields({
                              ...bulkEditFields,
                              price: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <Label>Compare at price</Label>
                          <Input 
                            placeholder="Compare at price" 
                            value={bulkEditFields.compareAtPrice}
                            onChange={(e) => setBulkEditFields({
                              ...bulkEditFields,
                              compareAtPrice: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>SKU</Label>
                          <Input 
                            placeholder="SKU" 
                            value={bulkEditFields.sku}
                            onChange={(e) => setBulkEditFields({
                              ...bulkEditFields,
                              sku: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <Label>Quantity</Label>
                          <Input 
                            placeholder="Quantity" 
                            value={bulkEditFields.quantity}
                            onChange={(e) => setBulkEditFields({
                              ...bulkEditFields,
                              quantity: e.target.value
                            })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setBulkEditOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={applyBulkEdit}>Apply to all variants</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                      <ChevronDown size={14} className="ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => regenerateVariants()}>
                      Regenerate variants
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={normalizePrices}>
                      Normalize prices
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Variants Table */}
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variant</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Compare at</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="w-16">Available</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants
                    .slice(0, showAllVariants ? variants.length : VARIANTS_PER_PAGE)
                    .map(variant => (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <div className="font-medium">{variant.title}</div>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="text" 
                          placeholder="0.00" 
                          value={variant.price}
                          onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                          className="h-8 w-20 border-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="text" 
                          placeholder="0.00" 
                          value={variant.compareAtPrice}
                          onChange={(e) => updateVariant(variant.id, 'compareAtPrice', e.target.value)}
                          className="h-8 w-20 border-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="text" 
                          placeholder="SKU" 
                          value={variant.sku}
                          disabled
                          onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                          className="h-8 w-20 border-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="text" 
                          placeholder="0" 
                          value={variant.quantity}
                          onChange={(e) => updateVariant(variant.id, 'quantity', e.target.value)}
                          className="h-8 w-20 border-0"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch 
                            checked={variant.isAvailable}
                            onCheckedChange={(checked) => updateVariant(variant.id, 'isAvailable', checked)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Show More/Less Variants Button */}
            {variants.length > VARIANTS_PER_PAGE && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllVariants(!showAllVariants)}
                className="mt-2 w-full text-xs"
              >
                {showAllVariants ? (
                  <>
                    <ChevronUp size={14} className="mr-1" />
                    Show fewer variants
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} className="mr-1" />
                    Show all {variants.length} variants
                  </>
                )}
              </Button>
            )}
            
            {/* Advanced Options Button */}
            <div className="mt-4">
              <Button variant="ghost" size="sm" className="text-xs">
                <Settings size={14} className="mr-1" />
                Edit variant images and advanced options
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}