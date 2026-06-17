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
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import Loader from "~/components/ui/loader";
import { Link } from "react-router";

import Pagination from "~/components/common/pagination";
import PermissionWrapper from "~/components/common/permission-wrapper";

export type Customer = {
  id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  country: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  order_count: number;
  created_date: string;
};

type props = {
  table_data: Customer[];
  loading: boolean;
  is_previous: boolean;
  is_next: boolean;
  current_page: number;
  total_page: number
};

export const columns: ColumnDef<Customer>[] = [

  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="font-medium text-[13px] flex items-center gap-2">
        <Avatar className="rounded-md">
          <AvatarFallback className="rounded-md">
            {row.original.name?.slice(0, 2)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div>{row.getValue("name")}</div>
          <div className="text-xs text-muted-foreground">{row.original.email}</div>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-[13px]">{row.getValue("phone")}</div>
    ),
  },

  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="text-[13px] max-w-[200px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-default overflow-hidden text-left">
              <div className="truncate">{row.getValue("address")}</div>
              <div className="text-xs text-muted-foreground truncate">
                {row.original.city}, {row.original.state}, {row.original.country}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px] break-words">
            <p>
              {row.getValue("address") as string},{" "}
              {row.original.city}, {row.original.state},{" "}
              {row.original.country}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
  },
  {
    accessorKey: "order_count",
    header: () => <div className="text-right">Orders</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("order_count")}</div>
    ),
  },

  {
    accessorKey: "created_date",
    header: "Joined",
    cell: ({ row }) => (
      <div className="text-[13px]">{row.getValue("created_date")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer_id = row.original.id;
      return (
        <PermissionWrapper permission="orders:view">
          <Link to={`/customers/customer-orders/${customer_id}`}>
            <Button size={"sm"} variant={"outline"}>
              View Orders
            </Button>
          </Link>
        </PermissionWrapper>
      );
    },
  },
];

export function CustomerTable({
  loading,
  table_data,
  is_next,
  is_previous,
  current_page,
  total_page
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
      pagination: {
        pageIndex: current_page - 1, // Table uses 0-based index
        pageSize: 1000,
      },
    },
    manualPagination: true,
    pageCount: total_page,
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
