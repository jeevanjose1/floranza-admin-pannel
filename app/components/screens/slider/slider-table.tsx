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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
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
import { Link } from "react-router";
import { useDeleteBrand } from "~/services/queries";
import { toast } from "sonner";
import { useDeleteSlider } from "~/services/queries/slider";
import AddEditSliderModal from "./add-edit-slider";

// Updated sample data with product information

// Updated type definition
export type Slider = {
	id: string;
	title: string;
	sub_title: string;
	is_btn:boolean
	btn_title:string
  btn_url:string;
	image: any;
};
type props = {
	table_data: Slider[];
	loading: boolean;
};

export const columns: ColumnDef<Slider>[] = [
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
		accessorKey: "title",
		header: "Title",
		cell: ({ row }) => (
			<div className="font-medium text-[13px] flex items-center gap-2">
				<Avatar className="rounded-md">
					<AvatarImage src={row.original.image.mini} />
					<AvatarFallback className="rounded-md">CS</AvatarFallback>
				</Avatar>
				{row.getValue("title")}
			</div>
		),
	},

	{
		accessorKey: "sub_title",
			header: "Sub title",

		cell: ({ row }) => (
			<div className="text-[13px]">{row.getValue("sub_title")}</div>
		),
	},
	{
		accessorKey: "is_btn",
			header: "Show button",

		cell: ({ row }) => (
			<div className="text-[13px]">{row.getValue("is_btn")}</div>
		),
		},
			{
				accessorKey: "btn_title",
					header: "Button title",

				cell: ({ row }) => (
					<div className="text-[13px]">{row.getValue("btn_title")}</div>
				),
		},

		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const slider_id = row.original.id;
				const { mutateAsync: delete_slider} = useDeleteSlider();
				const handleDelete = () => {
					toast.promise(delete_slider(slider_id), {
						success: "Slider deleted",
						loading: "Deleting slider",
						error: "Faild to delete slider",
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
								description="Are you realy want to delete this slider"
								title="Delete slider"
							>
								<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
									Delete
								</DropdownMenuItem>
							</PopConfirm>

							<DropdownMenuSeparator />
								<AddEditSliderModal data={row.original}>
								<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
								Edit
							</DropdownMenuItem>
								</AddEditSliderModal>


						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
];

export function SliderTable({ loading, table_data }: props) {
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
				<div className="flex-1 text-sm text-muted-foreground">
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
