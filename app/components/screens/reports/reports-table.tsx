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
import { Link } from "react-router";

import Pagination from "~/components/common/pagination";
import { status_options } from "~/shared/others/others";

export type Brand = {
    id: string;
    customer: string;
    order_no: string;
    sku: string;
    product_variation: number;
    qty: number;
    price: string;
    order_status: number;
    created_at: string
    is_pre_order: number
};
type props = {
    table_data: Brand[];
    loading: boolean;
    is_previous: boolean;
    is_next: boolean;
    current_page: number;
    total_page: number
};

export const columns: ColumnDef<Brand>[] = [
    {
        accessorKey: "order_detials",
        header: "Order Details",
        cell: ({ row }) => {
      const isPreorder = Boolean(row.original?.is_pre_order)

          return  <div className="space-y-1">
                <p className="font-medium">#{row.original.order_no}</p>
             {isPreorder && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-violet-600 tracking-wide uppercase">
                Pre-order
              </span>
            </div>
          )}
            </div>
        },
    },

    {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => (
            <div className="text-[13px]">{row.getValue("customer")}</div>
        ),
    },

    {
        accessorKey: "quantity",
        header: () => <div className="text-right ">Quantity</div>,
        cell: ({ row }) => (
            <div className="text-right text-[13px]">{row.original.qty}</div>
        ),
    },
    {
        accessorKey: "price",
        header: () => <div className="text-right ">Price</div>,
        cell: ({ row }) => (
            <p className="font-medium">₹{parseFloat(row.original.qty * Number(row.original.price) as any).toLocaleString()}</p>

        ),
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
             const currentStatusValue = row.original.order_status;
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
        accessorKey: "date",
        header: () => <div className="text-right ">Date</div>,
        cell: ({ row }) => (
            <div className="text-right text-[13px]">{row.original.created_at}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {

            return (

                <Link to={`/edit-order/${row?.original?.id}`}>
                    <Button size={'sm'} variant={'outline'}>Go to order details</Button>
                </Link>
            );
        },
    },
];

export function ReportTable({
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
