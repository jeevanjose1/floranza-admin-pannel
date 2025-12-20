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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { PopConfirm } from "~/components/ui/pop-confirm";
import { Link } from "react-router";
import { useDeleteMaterial } from "~/services/queries";
import { toast } from "sonner";
import Pagination from "~/components/common/pagination";
import PermissionWrapper from "~/components/common/permission-wrapper";

// Updated type definition
export type Material = {
  id: string;
  name: string;
  status: string;
  description: string;
  slug: string;
  count: number;
  image: string;
};
type props = {
  table_data: Material[];
  loading: boolean;
  is_previous: boolean;
  is_next: boolean;
  current_page: number;
  total_page:number
};

export const columns: ColumnDef<Material>[] = [
 
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-[13px]">{row.getValue("description")}</div>
    ),
  },

  {
    accessorKey: "slug",
    header: () => <div className="text-right ">Slug</div>,
    cell: ({ row }) => (
      <div className="text-right text-[13px]">{row.getValue("slug")}</div>
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
      const brand_id = row.original.id;
      const { mutateAsync: delete_material } = useDeleteMaterial();
      const handleDelete = () => {
        toast.promise(delete_material(brand_id), {
          success: "Material deleted",
          loading: "Deleting material",
          error:(error:any)=>error?.data?.message,
        });
      };
      return (
        <PermissionWrapper permission="materials:action">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <PermissionWrapper permission="materials:delete">

                <PopConfirm
                  action={handleDelete}
                  description="Are you realy want to delete this material"
                  title="Delete material"
                >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Delete
                  </DropdownMenuItem>
                </PopConfirm>
              </PermissionWrapper>
              <PermissionWrapper permission="materials:edit">
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to={`/materials/edit/${brand_id}`}>Edit</Link>
                  </DropdownMenuItem>
                </>
              </PermissionWrapper>

            </DropdownMenuContent>
          </DropdownMenu>
        </PermissionWrapper>
      );
    },
  },
];

export function MaterialTable({
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
