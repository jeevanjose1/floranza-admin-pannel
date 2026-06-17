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
import { Link } from "react-router";
import { DollarSign, ShoppingCart, Package, Mail, Phone, MapPin } from "lucide-react";
import Pagination from "~/components/common/pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { status_options } from "~/shared/others/others";
import { images } from "~/shared/images/image";

export type OrderReportData = {
  id: string;
  order_no: string;
  fname: string;
  phone: string;
  paid_status: number;
  price: number;
  order_status: number;
  is_pre_order: number;
  pre_order_date: string | null;
  date: string;
  date_normal_format: string;
  order_via: string;
  payment_gateway: string;
  courier: string;
  track_id: string | null;
  reserved_order: number;
};

type CustomerInfo = {
  user_id: string;
  name: string;
  phone: string;
  username: string;
  email: string;
  state: string;
  city: string;
  country: string;
  postcode: string;
};

type SummaryStats = {
  total_sales?: number;
  order_count?: number;
  pre_order_count?: number;
};

type Props = {
  table_data: OrderReportData[];
  loading: boolean;
  is_previous: boolean;
  is_next: boolean;
  current_page: number;
  total_page: number;
  summary?: SummaryStats;
  customer?: CustomerInfo;
};

export const columns: ColumnDef<OrderReportData>[] = [
  {
    accessorKey: "order_details",
    header: "Order Details",
    cell: ({ row }) => {
      const isPreOrder = Boolean(row.original?.is_pre_order);
      const orderVia = row.original.order_via;
      const isReserved = Boolean(row.original.reserved_order);

      return (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1">
            {isReserved && (
              <img src={images.whatsapp} className="w-5 h-5" alt="whatsapp" />
            )}
            <p className="font-medium text-[13px]">#{row.original.order_no}</p>
          </div>
          <div className="flex items-center gap-2">
            {isPreOrder && (
              <Badge
                variant="outline"
                className="bg-violet-50 text-violet-600 border-violet-200 text-[11px] px-2 py-0.5"
              >
                Pre-order
              </Badge>
            )}
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-600 border-blue-200 text-[11px] px-2 py-0.5"
            >
              {orderVia}
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <p className="font-medium text-[13px]">{row.original.fname}</p>
        <p className="text-xs text-muted-foreground">{row.original.phone}</p>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <p className="font-medium text-[13px]">
          ₹{row.original.price?.toLocaleString()}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "paid_status",
    header: "Payment",
    cell: ({ row }) => {
      const isPaid = row.original.paid_status === 1;
      return (
        <div className="space-y-0.5">
          <Badge
            variant="outline"
            className={`${isPaid
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
              } text-[11px] px-2 py-1`}
          >
            {isPaid ? "Paid" : "Unpaid"}
          </Badge>
          <p className="text-xs text-muted-foreground">
            {row.original.payment_gateway}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "order_status",
    header: "Order Status",
    cell: ({ row }) => {
      const currentStatusValue = row.original.order_status;
      const currentStatus = status_options.find(
        (s) => s.status === currentStatusValue
      );
      const statusName = currentStatus?.name || "Unknown";
      const statusColor =
        currentStatus?.color || "bg-gray-50 text-gray-500 border-gray-300";

      return (
        <Badge
          variant="outline"
          className={`${statusColor} text-xs font-medium px-3 py-1.5 rounded-full border`}
        >
          {statusName}
        </Badge>
      );
    },
  },
  {
    accessorKey: "courier",
    header: "Courier",
    cell: ({ row }) => (
      <div className="text-[13px]">{row.original.courier || "-"}</div>
    ),
  },
  {
    accessorKey: "date",
    header: () => <div className="text-right">Date</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <p className="text-[13px]">{row.original.date}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.date_normal_format}
        </p>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Link to={`/edit-order/${row?.original?.id}`}>
          <Button size={"sm"} variant={"outline"}>
            View Order
          </Button>
        </Link>
      );
    },
  },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export function CustomerOrderReportTable({
  loading,
  table_data,
  is_next,
  is_previous,
  current_page,
  total_page,
  summary,
  customer,
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
      {customer && (
        <div className="mx-4 mb-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between bg-white border rounded-lg p-3 px-4">
            <div className="flex items-center gap-2 mb-2 xl:mb-0">
              <span className="font-semibold text-[15px]">{customer.name}</span>
              <span className="text-muted-foreground text-[13px]">@{customer.username}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {customer.email}
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {customer.phone}
              </div>
              <div className="flex items-center gap-1.5 max-w-[200px] sm:max-w-[250px] md:max-w-[350px]">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="truncate cursor-default">
                      {customer.city}, {customer.state}, {customer.country} - {customer.postcode}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] break-words">
                    <p>{customer.city}, {customer.state}, {customer.country} - {customer.postcode}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      )}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mx-4">
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Sales</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.total_sales || 0)}
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
                    {summary.order_count || 0}
                  </p>
                </div>
                <ShoppingCart className="h-10 w-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Pre-Orders</p>
                  <p className="text-2xl font-bold">
                    {summary.pre_order_count || 0}
                  </p>
                </div>
                <Package className="h-10 w-10 opacity-80" />
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
