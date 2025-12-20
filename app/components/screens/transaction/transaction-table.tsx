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
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";


export type Transaction = {
  id: string;
  order_id: string;
  payment_menthod: string;
  payment: string
  payment_id: string;
  payment_fee: string;
  phone: number;
  amount: string;
  is_refund: string;
  status: number;
  date: string
};

type props = {
  table_data: Transaction[];
  loading: boolean;
  is_previous: boolean;
  is_next: boolean;
  current_page: number;
  total_page: number
};

export const columns: ColumnDef<Transaction>[] = [

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
    header: () => <div className="text-right ">Identifier</div>,
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

export function TransactionTable({ loading, table_data, is_next, total_page,
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

      pagination: {
        pageIndex: 0,
        pageSize: 50,

      },
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
      <div className="w-full">
        <ScrollArea className="max-w-screen tablet-lg:max-w-[calc(100vw-266px)] overflow-x-auto">

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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

      </div>
      <div className="flex items-center justify-end space-x-2  p-4">

        <Pagination
          is_next={is_next}
          is_previous={is_previous}
          current_page={current_page}
          total_pages={total_page}
        />
      </div>
    </div>
  );
}
