import { ChevronDown, ChevronRight, Search } from "lucide-react";
import React, { useState } from "react";
import { Controller, type Control, type FormState, type UseFormReturn } from "react-hook-form";
import BgWrapper from "~/components/common/bg-wrapper";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type Props = { form :UseFormReturn<any>};

const sampleCategories = [
  {
    id: 1,
    name: "Clothing",
    children: [
      {
        id: 2,
        name: "Women's Clothing",
        children: [
          { id: 3, name: "Kurtis", children: [] },
          { id: 4, name: "Sarees", children: [] },
          { id: 5, name: "Dresses", children: [] },
        ],
      },
      {
        id: 6,
        name: "Men's Clothing",
        children: [
          { id: 7, name: "Shirts", children: [] },
          { id: 8, name: "Pants", children: [] },
        ],
      },
    ],
  },
  {
    id: 9,
    name: "Electronics",
    children: [
      { id: 10, name: "Phones", children: [] },
      { id: 11, name: "Laptops", children: [] },
    ],
  },
  {
    id: 12,
    name: "Home Decor",
    children: [],
  },
];

type CategoryType = {
  id: number;
  name: string;
  children: CategoryType[];
};

const CategoryItem = ({
  category,
  level = 0,
  selectedCategories,
  onSelect,
}: {
  category: CategoryType;
  level: number;
  selectedCategories: number[];
  onSelect: (id: number) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = category.children.length > 0;

  return (
    <div className="category-item">
      <div
        className="flex items-center gap-2 hover:bg-muted px-2 py-1 rounded-sm"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            className="w-4 h-4 flex items-center justify-center"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <div className="w-4"></div> // Spacer for alignment
        )}

        <Checkbox
          id={`category-${category.id}`}
          checked={selectedCategories.includes(category.id)}
          onCheckedChange={() => onSelect(category.id)}
        />

        <Label
          htmlFor={`category-${category.id}`}
          className="text-sm cursor-pointer"
        >
          {category.name}
        </Label>
      </div>

      {expanded && hasChildren && (
        <div className="category-children">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedCategories={selectedCategories}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Category Selector Component
const CategorySelector = ({ control }: { control: Control }) => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategorySelect = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  // Filter categories based on search query
  const filterCategories = (
    categories: CategoryType[],
    query: string
  ): CategoryType[] => {
    if (!query) return categories;

    return categories
      .filter((category) => {
        const matchesName = category.name
          .toLowerCase()
          .includes(query.toLowerCase());
        const childMatches =
          filterCategories(category.children, query).length > 0;

        return matchesName || childMatches;
      })
      .map((category) => ({
        ...category,
        children: filterCategories(category.children, query),
      }));
  };

  const filteredCategories = filterCategories(sampleCategories, searchQuery);

  return (
    <div className="category-selector">
      <Controller
        control={control}
        name="categories"
        render={({ field }) => (
          <div>
            <div className="mb-3 relative">
              <Input
                type="text"
                placeholder="Search categories"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Search
                size={16}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
            </div>

            <div className="border border-muted rounded-md p-2 max-h-60 overflow-y-auto ">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    level={0}
                    selectedCategories={selectedCategories}
                    onSelect={handleCategorySelect}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground px-2 py-1">
                  No categories found
                </p>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default function CatogerySelect({form}: Props) {
  return (
    <BgWrapper>
      <div className="p-4 w-full">
        <h1 className="text-sm font-semibold mb-4">Category</h1>
        <CategorySelector control={form.control} />
      </div>
    </BgWrapper>
  );
}
