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
import { Badge } from "~/components/ui/badge";
import Loader from "~/components/ui/loader";
import { PopConfirm } from "~/components/ui/pop-confirm";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { status_options } from "~/shared/others/others";
import { useDeleteOrder } from "~/services/queries/order";
import Pagination from "~/components/common/pagination";

export type Order = {
  id: string;
  order: string;
  date: string;
  status: string;
  total: string;
  pre_order: number;
  sync: string;
  consigment: string;
  track: string;
  download: string;
  track_id: string;
  name: string;
  order_no: string;
  order_via: string;
  paid_status: string;
  pre_order_date: string;
  courier: string;
  is_reserved: boolean;
  is_all: boolean;
};
type props = {
  table_data: Order[];
  loading: boolean;
  setSelected: any;
  selected: object;
  is_previous: boolean;
  is_next: boolean;
  current_page: number;
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => {
      if (table.getRowModel()?.rows[0]?.original?.is_all) return false;
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => {
      if (row.original.is_all) return false;
      return (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "order",
    header: "Order",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-3">
        <div className="flex flex-col">
          <span className="font-semibold text-[13px] text-gray-900">
            #{row.original.order_no}
          </span>
          <span className="text-xs text-gray-500 mt-0.5">
            {row.original.name}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="py-3">
        <span className=" text-[13px] text-gray-700 font-medium">
          {row.getValue("date")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const currentStatusValue = row.getValue("status");
      const currentStatus = status_options.find(
        (s) => s.status === currentStatusValue
      );
      const statusName = currentStatus?.name || "Unknown";
      const statusColor =
        currentStatus?.color || "bg-gray-50 text-gray-500 border-gray-300";

      return (
        <div className="py-3">
          <Badge
            variant="outline"
            className={`${statusColor} text-xs font-medium px-3 py-1.5 rounded-full border`}
          >
            {statusName}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: () => <div className="text-left font-medium">Total</div>,
    cell: ({ row }) => {
      const total = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumSignificantDigits: 3,
      }).format(row.getValue("total"));

      return (
        <div className="py-3">
          <span className="text-[13px] font-semibold text-gray-900">
            {total}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "pre_order_date",
    header: () => <div className="text-left font-medium">Pre Order Date</div>,
    cell: ({ row }) => (
      <div className="py-3">
        <span className=" text-[13px] text-gray-600">
          {row.getValue("pre_order_date") || "—"}
        </span>
      </div>
    ),
  },

  // {
  //   accessorKey: "download",
  //   header: () => <div className="text-left font-medium">Download Label</div>,
  //   cell: () => {
  //     return (
  //       <div className="py-3">
  //         <Badge
  //           variant="secondary"
  //           className="h-7 px-3 text-xs bg-gray-100 text-gray-600 border-gray-200 rounded-full"
  //         >
  //           Not Synced
  //         </Badge>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "track_id",
    header: () => <div className="text-left font-medium">Tracking Details</div>,
    cell: ({ row }) => (
      <div className="py-3">
        <div className="text-sm font-medium text-gray-900">
          {row.original.courier}
        </div>
        <div className="text-sm text-gray-600 font-mono">
          {row.original.track_id}
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order_id = row.original.id;
      const { mutateAsync: delete_order } = useDeleteOrder();
      const handleDelete = () => {
        toast.promise(delete_order(order_id), {
          success: "Order deleted",
          loading: "Deleting order",
          error: (error: any) => error?.data?.message
          ,
        });
      };

      if (!row.original.is_reserved) return false;
      return (
        <div className="py-3" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 shadow-lg ">
              <PopConfirm
                action={handleDelete}
                description="Are you really want to delete this order"
                title="Delete order"
              >
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600 focus:text-red-700 focus:bg-red-50"
                >
                  Delete
                </DropdownMenuItem>
              </PopConfirm>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function OrderTable({
  loading,
  table_data,
  setSelected,
  selected,
  is_next,
  is_previous,
  current_page,
}: props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const params = useParams()
  const navigate = useNavigate();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

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
    onRowSelectionChange: setSelected,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selected as any,

      pagination: {
        pageIndex: 0,
        pageSize: 1000,
      },
    },
  });

  const handleNavigate = (id: string) => {
    navigate(`/edit-order/${id}`);
  };

  if (loading)
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="w-full max-w-screen tablet-lg:max-w-[calc(100vw-266px)]">
      <div className="flex items-center justify-end   p-4 ">
        {params.order_menu !== "all" && <div className="flex-1  text-[13px] text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>}
        <Pagination
          is_next={is_next}
          is_previous={is_previous}
          current_page={current_page}
        />
      </div>
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
                  onClick={() => handleNavigate(row.original.id)}
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
        {params.order_menu !== "all" && <div className="flex-1  text-[13px] text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>}
        <Pagination
          is_next={is_next}
          is_previous={is_previous}
          current_page={current_page}
        />
      </div>
    </div>
  );
}
