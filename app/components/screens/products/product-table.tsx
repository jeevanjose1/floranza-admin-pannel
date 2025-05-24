"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ExpandedState,
  getExpandedRowModel,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import Loader from "~/components/ui/loader";
import { Link, useNavigate } from "react-router";
import { PopConfirm } from "~/components/ui/pop-confirm";
import {
  useDeleteProduct,
  useDuplicateProduct,
} from "~/services/queries/product";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import dayjs from "dayjs";

type props = {
  table_data: Product[];
  loading: boolean;
};

// Updated type definition
export type Product = {
  id: string;
  name: string;
  sku: string;
  catogery: any[];
  brand: string;
  price: number;
  status: string;
  category: string;
  date: string;
  stock: number;
  image: string;
  scheduled: boolean;
  prebook: boolean;
  sheduled_at: string;
  preorder_at: string;
  variations: {
    attribute_id: string;
    attribute_name: string;
    attribute_option_id: string;
    attribute_option_name: string;
    reg_price: number;
    sale_price: number;
    qty: number;
  }[];
};

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "expander",
    header: "",
    cell: ({ row }) => {
      const hasVariations =
        row.original.variations && row.original.variations.length > 0;

      if (!hasVariations) {
        return <div className="w-6" />; // Empty space for alignment
      }

      return (
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-6 w-6"
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="font-medium text-[13px] flex items-center gap-2">
        <Avatar className="rounded-md">
          <AvatarImage src={row.original.image} />
          <AvatarFallback className="rounded-md">CS</AvatarFallback>
        </Avatar>
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "sku",
    header: "Sku",
    cell: ({ row }) => <div className="text-[13px]">{row.getValue("sku")}</div>,
  },

  {
    accessorKey: "catogery",
    header: "Category",
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger className="w-full" asChild>
          <Eye size={20} />
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-2">
            {row.original.catogery?.map((item: any, index: number) => {
              return (
                <p key={index} className="text-sm">
                  {item?.name}
                </p>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(price);

      return row.original.variations.length > 0 ? (
        <div className="text-right font-medium text-[13px]">Valiration</div>
      ) : (
        <div className="text-right font-medium text-[13px]">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-right ">Stocks</div>,
    cell: ({ row }) =>
      row.original.variations.length > 0 ? (
        <div className="text-right font-medium text-[13px]">Valiration</div>
      ) : (
        <div className="text-right text-[13px]">{row.getValue("stock")}</div>
      ),
  },

{
  accessorKey: "scheduled",
  header: () => <div className="text-right">Scheduled</div>,
  cell: ({ row }) =>
    row.getValue("scheduled") === 1 ? (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full flex justify-end">
              <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
                Scheduled
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            
            {row.original?.sheduled_at
              ? dayjs(row.original.sheduled_at).format("MMM D, YYYY h:mm A")
              : "N/A"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      <div className="w-full flex justify-end">
        -
      </div>
    ),
},

  {
    accessorKey: "prebook",
    header: () => <div className="text-right">Pre Order</div>,
    cell: ({ row }) =>
      row.getValue("prebook") === 1 ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full flex justify-end">
                <Badge className="bg-green-100 text-green-800 border border-green-300">
                  Pre-order Available
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
               {row.original?.preorder_at
              ? dayjs(row.original.preorder_at).format("MMM D, YYYY h:mm A")
              : "N/A"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="w-full flex justify-end">
          -
        </div>
      ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      // Apply different styling based on status
      const statusStyles: Record<string, string> = {
        Active: "bg-green-200 border border-green-300 text-green-500",
        Inactive: "bg-red-200 border border-red-300 text-red-500",
      };

      const style = statusStyles[status] || "";

      return (
        <Badge variant={"default"} className={`${style} text-[13px]`}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product_id = row.original.id;
      const { mutateAsync: delete_product } = useDeleteProduct();
      const { mutateAsync: duplicate_product } = useDuplicateProduct();

      const handleDelete = () => {
        toast.promise(delete_product(product_id), {
          success: "product deleted",
          loading: "Deleting product",
          error: "Faild to delete product",
        });
      };

      const handleDuplicate = () => {
        toast.promise(duplicate_product(product_id), {
          success: "product duplicated",
          loading: "Duplicating product",
          error: "Faild to duplicate product",
        });
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <PopConfirm
              action={handleDelete}
              description="Are you realy want to delete this product"
              title="Delete product"
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Delete
              </DropdownMenuItem>
            </PopConfirm>
            <DropdownMenuSeparator />

            <PopConfirm
              action={handleDuplicate}
              description="Are you realy want to duplicate this product"
              title="Duplicate product"
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Duplicate
              </DropdownMenuItem>
            </PopConfirm>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                to={`/products/edit/${product_id}`}
                className="w-full h-full"
              >
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Variation row component
const VariationRow = ({
  variation,
  columnCount,
}: {
  variation: Product["variations"][0];
  columnCount: number;
}) => {
  const formatted_reg_price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(variation.reg_price);

  const formatted_sale_price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(variation.sale_price);

  return (
    <TableRow className="bg-gray-50/50">
      <TableCell></TableCell> {/* Select column */}
      <TableCell></TableCell> {/* Expander column */}
      <TableCell colSpan={columnCount - 2}>
        <div className="pl-6 py-2">
          <div className="grid grid-cols-5 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Attribute:</span>
              <p className="text-[13px]">{variation.attribute_name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Option:</span>
              <p className="text-[13px]">{variation.attribute_option_name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Regular Price:</span>
              <p className="text-[13px] font-medium">{formatted_reg_price}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Sale Price:</span>
              <p className="text-[13px] font-medium">{formatted_sale_price}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Quantity:</span>
              <p className="text-[13px]">{variation.qty}</p>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export function ProductTable({ loading, table_data }: props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data: table_data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
    },
  });

  if (loading)
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="w-full">
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() &&
                    row.original.variations &&
                    row.original.variations.length > 0 && (
                      <>
                        {row.original.variations.map((variation, index) => (
                          <VariationRow
                            key={`${row.id}-variation-${index}`}
                            variation={variation}
                            columnCount={columns.length}
                          />
                        ))}
                      </>
                    )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
