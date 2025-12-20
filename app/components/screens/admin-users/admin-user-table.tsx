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
import AddEditUser from "./add-edit-user";
import Pagination from "~/components/common/pagination";
import PermissionWrapper from "~/components/common/permission-wrapper";
import { images } from "~/shared/images/image";

export type Brand = {
  id: string;
  name: string;
  email: string;
  date: string;
  role: string;
  status: number;
};
type props = {
  table_data: Brand[];
  loading: boolean;
  is_previous: boolean;
  is_next: boolean;
  current_page: number;
  total_page:number
};

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const icons = () => {
        switch (row.getValue("role")) {
          case 2:
            return images.packing
          case 3:
            return images.shipping
          case 4:
            return images.whatsapp
            case 5:
            return images.varify
             case 6:
            return images.sub_admin

         

          default:
            return images.avatar
        }
      }
      return (
        <div className="text-[13px] flex gap-2 items-center">
          <img  className="w-6 h-6" src={icons()} alt="icons" />
          {row.getValue("name")}</div>
      )
    },
  },
  {
    accessorKey: "email",
    header: () => <div className="text-left ">Email</div>,
    cell: ({ row }) => (
      <div className="text-left text-[13px]">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const staff_name = () => {
        switch (row.getValue("role")) {
          case 2:
            return "Packing Staff"
          case 3:
            return "Shipping Staff"
          case 4:
            return "Whatsapp Order Staff"
             case 6:
            return "Whatsapp Order Payment Verification"

          case 7:
            return "Sub Admin"

          default:
            break;
        }
      }
      return (
        <div className="text-[13px]">
          {staff_name()}
        </div>
      )
    },
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
      const status = row.getValue("status");

      // Apply different styling based on status
      const statusStyles: Record<string, string> = {
        Active: "bg-green-200 border border-green-300 text-green-500",
        Inactive: "bg-red-200 border border-red-300 text-red-500",
      };

      const style = statusStyles[status === 1 ? "Active" : "Inactive"] || "";

      return (
        <Badge variant={"default"} className={`${style} text-[13px]`}>
          {status === 1 ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <PermissionWrapper permission="admin_users:action" >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <PermissionWrapper permission="admin_users:edit" >
                <AddEditUser data={row.original}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Edit
                  </DropdownMenuItem>
                </AddEditUser>
              </PermissionWrapper>
            </DropdownMenuContent>
          </DropdownMenu>
        </PermissionWrapper>
      );
    },
  },
];

export function AdminUsersTable({
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
