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
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Loader from "~/components/ui/loader";

import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import dayjs from "dayjs";
import UpdateQty from "./update-qty";
import Pagination from "~/components/common/pagination";

// Updated type definition
export type Brand = {
  id: string;
  sku: string;
  stock: string;
  attribute: string;
  preorder_at: string;
  status: string;
  name: string;
  image: string;
  variation_id: string;
};
type props = {
  table_data: Brand[];
  loading: boolean;
  is_previous: boolean;
  is_next: boolean;
  current_page: number;
};

export const columns: ColumnDef<Brand>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="font-medium text-[13px] whitespace-pre-wrap flex items-center gap-2">
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
    header: () => <div className="text-right ">Sku</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("sku")}</div>
    ),
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-right ">Stock</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("stock")}</div>
    ),
  },
  {
    accessorKey: "attribute",
    header: () => <div className="text-right ">Attribute</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("attribute")}</div>
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
        <div className="w-full flex justify-end">-</div>
      ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <UpdateQty data={row.original}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Update Quantity
              </DropdownMenuItem>
            </UpdateQty>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function StockTable({
  loading,
  table_data,
  is_next,
  is_previous,
  current_page,
}: props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: table_data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
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
      <div className="flex items-center justify-end space-x-2  p-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <Pagination
          is_next={is_next}
          is_previous={is_previous}
          current_page={current_page}
        />
      </div>
    </div>
  );
}
