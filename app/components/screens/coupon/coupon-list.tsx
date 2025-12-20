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
import { Megaphone, MoreHorizontal } from "lucide-react";
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
import { toast } from "sonner";
import Pagination from "~/components/common/pagination";
import { useDeleteCoupon } from "~/services/queries/coupon";
import PermissionWrapper from "~/components/common/permission-wrapper";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

export type Supplier = {
  id: string;
  code: string;
  status: string;
  date: string;
  amount: string;
  type: string
  value:string
  coupon_type:string
};
type props = {
  table_data: Supplier[];
  loading: boolean;
  is_previous: boolean;
  is_next: boolean;
  current_page: number;
  total_page: number
};

export const columns: ColumnDef<Supplier>[] = [

  {
    accessorKey: "code",
    header: "Coupon Code",
    cell: ({ row }) => (
      <div className="font-medium text-[13px] flex items-center gap-2">
        {row.getValue("code")}
        {row.original.coupon_type ==='promotion'&& <Tooltip>
      <TooltipTrigger asChild>
        <Megaphone size={20} color="orange" />
      </TooltipTrigger>
      <TooltipContent>
        <p>Promotion</p>
      </TooltipContent>
    </Tooltip>}
      </div>
    ),
  },

  {
    accessorKey: "value",
    header: () => <div className="text-right ">Value</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("value")}{row.original.type == 'percent' ? '%' : ' ₹'}</div>
    ),
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-right ">Balance</div>,
    cell: ({ row }) => (row.original?.coupon_type !=='promotion' && row.original?.type !=='percent') ? 
      <div className="text-right text-[13px]"> ₹ {row.getValue("balance")}</div> : <div className="text-right text-[13px]"> - </div>
    
  },
   {
    accessorKey: "used_count",
    header: () => <div className="text-right ">Used Count</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("used_count")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: () => <div className="text-right ">Expire Date</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("date")}</div>
    ),
  },
  {
    accessorKey: "is_used",
    header: () => <div className="text-right ">Used</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("is_used") === 1 ? 'Yes' : 'No'}</div>
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
      const coupon_id = row.original.id;
      const { mutateAsync: delete_coupon } = useDeleteCoupon();
      const handleDelete = () => {
        toast.promise(delete_coupon(coupon_id), {
          success: "Coupon deleted",
          loading: "Deleting coupon",
          error: (error: any) => error.data?.message
          ,
        });
      };
      return (
        <PermissionWrapper permission="coupons:action">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <PermissionWrapper permission="coupons:delete">
                <PopConfirm
                  action={handleDelete}
                  description="Are you realy want to delete this coupon"
                  title="Delete coupon"
                >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Delete
                  </DropdownMenuItem>
                </PopConfirm>
              </PermissionWrapper>
            </DropdownMenuContent>
          </DropdownMenu>
        </PermissionWrapper>

      );
    },
  },
];

export function CouponList({
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
