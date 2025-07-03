import {  Search } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";
import BgWrapper from "~/components/common/bg-wrapper";
import { Checkbox } from "~/components/ui/checkbox";
import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useListCatogery } from "~/services/queries";

type Props = { form: UseFormReturn<any> };

export default function CatogerySelect({ form }: Props) {
  const { data: catogery } = useListCatogery({ page: 0 });

  const filtered_categories =
    catogery?.data?.data?.map((item: any) => ({
      value: item?.id,
      label: item?.name,
    })) || [];

  return (
    <BgWrapper>
      <div className="p-4 w-full">
        <h1 className="text-sm font-semibold mb-4">Category</h1>

        <div className="category-selector">
          <Controller
            control={form.control}
            name="catogery_search"
            render={({ field }) => (
              <div className="mb-3 relative">
                <Input
                  type="text"
                  placeholder="Search categories"
                  {...field}
                  className="pl-8"
                />
                <Search
                  size={16}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="categories"
            defaultValue={[]} // make sure form defaultValues are set too
            render={({ field }) => (
              <div className="border border-muted rounded-md p-2 max-h-60 overflow-y-auto">
                {filtered_categories.length ? (
                  filtered_categories.map((category: any) => {
                    const isChecked = field.value.includes(category.value);
                    const handleChange = (checked: boolean) => {
                      const newValue = checked
                        ? [...field.value, category.value]
                        : field.value.filter(
                            (id: string) => id !== category.value
                          );
                      field.onChange(newValue);
                    };

                    return (
                      <div
                        key={category.value}
                        className="flex items-center mb-1 gap-2 hover:bg-muted px-2 py-1 rounded-sm"
                      >
                        <Checkbox
                          id={`category-${category.value}`}
                          checked={isChecked}
                          onCheckedChange={handleChange}
                        />
                        <Label
                          htmlFor={`category-${category.value}`}
                          className="text-sm mb-0 cursor-pointer"
                        >
                          {category.label}
                        </Label>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground px-2 py-1">
                    No categories found
                  </p>
                )}
              </div>
            )}
          />
          <ErrorMessage
            error={form?.formState?.errors?.categories?.message as string}
          />
        </div>
       
      </div>
    </BgWrapper>
  );
}
