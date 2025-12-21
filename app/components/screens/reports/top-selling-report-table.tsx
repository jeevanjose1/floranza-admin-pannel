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
import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
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
import { DollarSign, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useGetProductDetails } from "~/services/queries/dashboard";

export type TopSellingReportData = {
  product_id: string;
  product_name: string;
  total_qty: string;
  total_orders: number;
  total_revenue: string;
  image: string;
  is_variation: number;
  image_url: string;
  sku: string;
};

type SummaryStats = {
  total_sale?: number;
  total_orders?: number;
};

type Props = {
  table_data: TopSellingReportData[];
  loading: boolean;
  is_previous: boolean;
  is_next: boolean;
  current_page: number;
  total_page: number;
  summary?: SummaryStats;
};

export const columns: ColumnDef<TopSellingReportData>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const isVariation = row.original.is_variation === 1;

      const { data: details, isLoading } = useGetProductDetails({
        id: row.original.product_id,
        filter: {},
        disabled: open && isVariation,
      });

      const filtered = details
        ? details?.data?.slice(0, details?.data?.length - 1)
        : [];

      const ProductContent = (
        <div className="flex items-center gap-3">
          <img
            src={row.original.image_url}
            alt={row.original.product_name}
            className="w-12 h-12 rounded-lg object-cover border"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNMjQgMzJDMjguNDE4MyAzMiAzMiAyOC40MTgzIDMyIDI0QzMyIDE5LjU4MTcgMjguNDE4MyAxNiAyNCAxNkMxOS41ODE3IDE2IDE2IDE5LjU4MTcgMTYgMjRDMTYgMjguNDE4MyAxOS41ODE3IDMyIDI0IDMyWiIgZmlsbD0iI0Q1RDlERCIvPgo8L3N2Zz4K";
            }}
          />
          <div className="space-y-0.5">
            <p className="font-medium text-[13px] line-clamp-2">
              {row.original.product_name}
            </p>
            {!isVariation && (
              <p className="text-xs text-green-600 font-semibold">
                ₹{parseFloat(row.original.total_revenue).toLocaleString()}
              </p>
            )}
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                SKU: {row.original.sku}
              </p>
              {isVariation && (
                <>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-600 border-purple-200 text-[10px] px-1.5 py-0.5"
                  >
                    Has Variations
                  </Badge>
                </>
              )}
            </div>
            {isVariation && (
              <p className="text-xs mt-1 italic text-blue-600 cursor-pointer hover:underline">
                Click to view more details
              </p>
            )}
          </div>
        </div>
      );

      if (!isVariation) {
        return ProductContent;
      }

      return (
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger
            onClick={() => setOpen(true)}
            className="w-full text-start"
          >
            {ProductContent}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Variation Details</DialogTitle>
            </DialogHeader>
            {isLoading ? (
              <div className="w-full h-56 flex items-center justify-center">
                <Loader />
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filtered.map((item: any) => (
                  <li
                    key={item.variation_id}
                    className="flex justify-between border p-3 rounded-lg"
                  >
                    <div className="text-sm">
                      <p className="font-medium">
                        {item.attribute_option_name || "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty Sold: {item.total_qty_sold}
                      </p>
                    </div>
                    <div className="text-sm font-semibold">
                      ₹{Number(item.total_sales).toLocaleString()}
                    </div>
                  </li>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "total_qty",
    header: () => <div className="text-right">Quantity Sold</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <p className="font-semibold text-[13px]">{row.original.total_qty}</p>
      </div>
    ),
  },
  {
    accessorKey: "total_orders",
    header: () => <div className="text-right">Total Orders</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <p className="font-medium text-[13px]">{row.original.total_orders}</p>
      </div>
    ),
  },
  {
    accessorKey: "total_revenue",
    header: () => <div className="text-right">Revenue</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <p className="font-semibold text-[13px] text-green-600">
          ₹{parseFloat(row.original.total_revenue).toLocaleString()}
        </p>
      </div>
    ),
  },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export function TopSellingReportTable({
  loading,
  table_data,
  is_next,
  is_previous,
  current_page,
  total_page,
  summary,
}: Props) {
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
        pageSize: 1000,
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
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mx-4">
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Sales</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.total_sale || 0)}
                  </p>
                </div>
                <DollarSign className="h-10 w-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold">
                    {summary.total_orders || 0}
                  </p>
                </div>
                <ShoppingCart className="h-10 w-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
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
      <div className="flex items-center justify-end space-x-2 p-4">
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
