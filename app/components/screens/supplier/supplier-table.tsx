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
  DropdownMenuSeparator,
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
import { Link } from "react-router";
import { toast } from "sonner";
import { useDeleteSupplier } from "~/services/queries/supplier";
import Pagination from "~/components/common/pagination";

export type Supplier = {
  id: string;
  name: string;
  status: string;
  description: string;
  slug: string;
  count: number;
  hsn: string;
  image: string;
};
type props = {
  table_data: Supplier[];
  loading: boolean;
  is_previous: boolean;
  is_next: boolean;
  current_page: number;
};

export const columns: ColumnDef<Supplier>[] = [

  {
    accessorKey: "name",
    header: "Supplier",
    cell: ({ row }) => (
      <div className="font-medium text-[13px] flex items-center gap-2">
        {row.getValue("name")}
      </div>
    ),
  },

  {
    accessorKey: "count",
    header: () => <div className="text-right ">Products</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("count")}</div>
    ),
  },
  {
    accessorKey: "hsn",
    header: () => <div className="text-right ">HSN code</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("hsn")}</div>
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
      const supplier_id = row.original.id;
      const { mutateAsync: delete_supplier } = useDeleteSupplier();
      const handleDelete = () => {
        toast.promise(delete_supplier(supplier_id), {
          success: "Supplier deleted",
          loading: "Deleting supplier",
          error: "Faild to delete supplier",
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
              description="Are you realy want to delete this supplier"
              title="Delete supplier"
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Delete
              </DropdownMenuItem>
            </PopConfirm>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/supplier/edit/${supplier_id}`}>Edit</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function SupplierTable({
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
       
        <Pagination
          is_next={is_next}
          is_previous={is_previous}
          current_page={current_page}
        />
      </div>
    </div>
  );
}
