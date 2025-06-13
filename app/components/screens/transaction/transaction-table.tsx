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
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import Loader from "~/components/ui/loader";
import Pagination from "~/components/common/pagination";


export type Transaction = {
  id: string;
  order_id: string;
  payment_menthod: string;
  payment:string
  payment_id: string;
  payment_fee: string;
  phone: number;
  amount: string;
  is_refund: string;
  status:number;
  date:string
};

type props = {
  table_data: Transaction[];
  loading: boolean;
      is_previous: boolean;
  is_next: boolean;
  current_page: number;
};

export const columns: ColumnDef<Transaction>[] = [
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
    accessorKey: "order_id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="text-[13px]">{row.getValue("order_id")}</div>
    ),
  },

  {
    accessorKey: "payment_menthod",
    header: "Payment Method",
    cell: ({ row }) => (
      <div className="text-[13px]"> {row.original.payment} - {row.getValue("payment_menthod")} </div>
    ),
  },

  {
    accessorKey: "payment_id",
    header: () => <div className="text-right ">Payment ID</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("payment_id")}</div>
    ),
  },
  {
    accessorKey: "payment_fee",
    header: () => <div className="text-right ">Payment Fee</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("payment_fee")}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: () => <div className="text-right ">Phone</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("phone")}</div>
    ),
  },
   {
    accessorKey: "amount",
    header: () => <div className="text-right ">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("amount")}</div>
    ),
  },
   {
    accessorKey: "is_refund",
    header: () => <div className="text-right ">Refund</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("is_refund") === 1 ? 'Yes' : 'No'}</div>
    ),
  },
  {
    accessorKey: "date",
    header: () => <div className="text-right ">Date</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("date")}</div>
    ),
  },
    {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      // Apply different styling based on status
      const statusStyles: Record<string, string> = {
        Available: "bg-green-200 border border-green-300 text-green-500",
        Unavailable: "bg-red-200 border border-red-300 text-red-500",
      };

      const style = statusStyles[status] || "";

      return (
        <Badge variant={"default"} className={`${style} text-[13px]`}>
          {status}
        </Badge>
      );
    },
  },
  
];

export function TransactionTable({ loading, table_data,is_next,
  is_previous,
  current_page, }: props) {
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
