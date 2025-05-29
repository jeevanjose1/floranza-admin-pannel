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
import { ArrowUpDown, ChevronDown, Edit2, MoreHorizontal } from "lucide-react";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { Badge } from "~/components/ui/badge";
import Loader from "~/components/ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { PopConfirm } from "~/components/ui/pop-confirm";
import { Link, useLocation, useNavigate } from "react-router";
import { useDeleteBrand } from "~/services/queries";
import { toast } from "sonner";
import { useDeleteSupplier } from "~/services/queries/supplier";

// Updated sample data with product information

// Updated type definition
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
  track_number: string;
  name: string;
  order_no: string;
  order_via: string;
  paid_status: string;
  pre_order_date: string;
};
type props = {
  table_data: Order[];
  loading: boolean;
};

export const columns: ColumnDef<Order>[] = [
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
      const statusOptions = [
        { status: "", name: "All", color: "bg-gray-50 text-gray-500 border-gray-300" },
        { status: 1, name: "Processing", color: "bg-slate-50 text-slate-500 border-slate-300" },
        { status: 2, name: "Hold", color: "bg-amber-50 text-amber-600 border-amber-300" },
        { status: 3, name: "Completed", color: "bg-emerald-50 text-emerald-600 border-emerald-300" },
        { status: 4, name: "Canceled", color: "bg-rose-50 text-rose-600 border-rose-300" },
        { status: 5, name: "Refund", color: "bg-orange-50 text-orange-600 border-orange-300" },
        { status: 6, name: "Failed", color: "bg-red-50 text-red-600 border-red-300" },
        { status: 7, name: "Pre-Order", color: "bg-violet-50 text-violet-600 border-violet-300" },
        { status: 8, name: "Reserved", color: "bg-indigo-50 text-indigo-600 border-indigo-300" },
      ];

      const currentStatusValue = row.getValue("status");
      const currentStatus = statusOptions.find(
        (s) => s.status === currentStatusValue
      );
      const statusName = currentStatus?.name || "Unknown";
      const statusColor = currentStatus?.color || "bg-gray-50 text-gray-500 border-gray-300";

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
  {
    accessorKey: "sync",
    header: () => <div className="text-left font-medium">Sync Order</div>,
    cell: () => {
      return (
        <div className="py-3">
          <Button 
            variant="link" 
            size="sm"
            className="underline px-0"
          >
            Sync Order
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "consigment",
    header: () => <div className="text-left font-medium">Consignment Status</div>,
    cell: () => {
      return (
        <div className="py-3">
          <Badge
            variant="secondary"
            className="h-7 px-3 text-xs bg-gray-100 text-gray-600 border-gray-200 rounded-full"
          >
            Not Synced
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "track",
    header: () => <div className="text-left font-medium">Track Order</div>,
    cell: () => {
      return (
        <div className="py-3">
          <Badge
            variant="secondary"
            className="h-7 px-3 text-xs bg-gray-100 text-gray-600 border-gray-200 rounded-full"
          >
            Not Synced
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "download",
    header: () => <div className="text-left font-medium">Download Label</div>,
    cell: () => {
      return (
        <div className="py-3">
          <Badge
            variant="secondary"
            className="h-7 px-3 text-xs bg-gray-100 text-gray-600 border-gray-200 rounded-full"
          >
            Not Synced
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "track_number",
    header: () => <div className="text-left font-medium">Tracking Number</div>,
    cell: () => {
      return (
        <div className="py-3 flex justify-end">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 px-3 text-xs font-medium "
          >
            <Edit2 />
            
          </Button>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const supplier_id = row.original.id;
      const { mutateAsync: delete_supplier } = useDeleteSupplier();
      const handleDelete = () => {
        toast.promise(delete_supplier(supplier_id), {
          success: "Supplier deleted",
          loading: "Deleting supplier",
          error: "Failed to delete supplier",
        });
      };
      return (
        <div className="py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 shadow-lg border-gray-200">
              <PopConfirm
                action={handleDelete}
                description="Are you really want to delete this supplier"
                title="Delete supplier"
              >
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600 focus:text-red-700 focus:bg-red-50"
                >
                  Delete
                </DropdownMenuItem>
              </PopConfirm>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="focus:bg-gray-50">
                <Link to={`/supplier/edit/${supplier_id}`}>Edit</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function OrderTable({ loading, table_data }: props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const navigate = useNavigate()
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

const handleNavigate = (id:string)=>{
  navigate(`/edit-order/${id}`)
}

  if (loading)
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="w-full max-w-screen tablet-lg:max-w-[calc(100vw-266px)]">
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
                  onClick={()=>handleNavigate(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell  key={cell.id}>
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
        <div className="flex-1  text-[13px] text-muted-foreground">
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
