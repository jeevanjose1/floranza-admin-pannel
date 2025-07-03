"use client";

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
import { Eye, MoreHorizontal, GripVertical } from "lucide-react";
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
import Loader from "~/components/ui/loader";
import { PopConfirm } from "~/components/ui/pop-confirm";
import {
  useDeleteAttribute,
  useUpadtePositionAttribute,
} from "~/services/queries";
import { toast } from "sonner";
import AddEditModal from "./add-edit-modal";
import ItemModal from "./item-modal";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Badge } from "~/components/ui/badge";
import Pagination from "~/components/common/pagination";
import PermissionWrapper from "~/components/common/permission-wrapper";

const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: rowId,
  });

  return (
    <Button
      ref={setNodeRef}
      variant="ghost"
      size="icon"
      className="cursor-grab active:cursor-grabbing hover:bg-gray-100"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4" />
    </Button>
  );
};

const DraggableRow = ({ row }: { row: any }) => {
  // Ensure ID is a string for consistent comparison
  const rowId = row.original.id.toString();

  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: rowId,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
    backgroundColor: isDragging ? "rgba(0, 0, 0, 0.05)" : undefined, // Visual feedback
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
    >
      {row.getVisibleCells().map((cell: any) => (
        <TableCell
          key={cell.id}
          style={{
            width:
              cell.column.getSize() !== 150
                ? `${cell.column.getSize()}px`
                : undefined,
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};

export type ItemType = {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
};

export type Attribute = {
  id: string;
  name: string;
  values_count: number;
  date: string;
  slug: string;
  items: ItemType[];
  status: number;
};

type props = {
  table_data: Attribute[];
  loading: boolean;
  is_previous: boolean;
  is_next: boolean;
  current_page: number;
};

export function AttributeTable({
  loading,
  table_data,
  is_next,
  is_previous,
  current_page,
}: props) {
  const [data, setData] = useState<Attribute[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { mutateAsync: update_attribute } = useUpadtePositionAttribute();
  // Ensure IDs are strings for consistent comparison
  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data.map(({ id }) => id.toString()),
    [data]
  );

  useEffect(() => {
    if (table_data?.length) {
      setData(table_data);
    }
  }, [table_data]);

  const columns: ColumnDef<Attribute>[] = [
    {
      id: "drag-handle",
      header: "Move",
      cell: ({ row }) => (
        <RowDragHandleCell rowId={row.original.id.toString()} />
      ),
      size: 60,
    },
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   size: 40, // Set fixed width for checkbox column
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "name",
      header: "Attribute",
      size: 280, // Primary column - give it more space
      cell: ({ row }) => (
        <div className="font-medium text-[13px] flex items-center gap-2">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "item_count",
      header: "Item count",
      size: 120, // Set appropriate width for count column
      cell: ({ row }) => (
        <div className="font-medium text-[13px] flex items-center gap-2">
          {row.original.values_count}
        </div>
      ),
    },

    {
      accessorKey: "items",
      header: "Items",
      size: 160,
      cell: ({ row }) => {
        const filtred_item = row.original.items.map((item) => {
          return {
            id: item?.id,
            name: item?.name,
            code: item?.code,
            description: item?.description,
            status: item?.status === 1 ? "Active" : "Inactive",
          };
        });
        return (
          <div className="font-medium text-[13px] flex items-center gap-2">
            <ItemModal table_data={filtred_item as any}>
              <Button size={"icon"} variant={"secondary"}>
                <Eye />
              </Button>
            </ItemModal>
          </div>
        );
      },
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
      size: 80, // Fixed width for actions column
      cell: ({ row }) => {
        const attribute_id = row.original.id;
        const { mutateAsync: delete_attribute } = useDeleteAttribute();
        const handleDelete = () => {
          toast.promise(delete_attribute(attribute_id), {
            success: "Attribute deleted",
            loading: "Deleting attribute",
            error: (error) => error.data.message,
          });
        };
        return (
          <PermissionWrapper permission="attributes:action">

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <PermissionWrapper permission="attributes:delete">

                  <PopConfirm
                    action={handleDelete}
                    description="Are you really want to delete this attribute"
                    title="Delete attribute"
                  >
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Delete
                    </DropdownMenuItem>
                  </PopConfirm>
                </PermissionWrapper>
                <PermissionWrapper permission="attributes:edit">
                  <>
                    <DropdownMenuSeparator />
                    <AddEditModal data={row.original}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Edit
                      </DropdownMenuItem>

                    </AddEditModal>
                  </>
                </PermissionWrapper>
              </DropdownMenuContent>
            </DropdownMenu>
          </PermissionWrapper>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const activeId = active.id.toString();
      const overId = over.id.toString();
      const oldIndex = data.findIndex(
        (item) => item.id.toString() === activeId
      );
      const newIndex = data.findIndex((item) => item.id.toString() === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(data, oldIndex, newIndex);
        setData(reordered);
        const value_data = reordered?.map((item, index) => {
          return {
            id: item?.id,
            display_order: index,
          };
        });
        update_attribute(value_data, {
          onSuccess: () => toast.success("Attribute order updated"),
        });
      }
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {})
  );

  if (loading)
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="w-full">
      <div className="">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width:
                            header.getSize() !== 150
                              ? `${header.getSize()}px`
                              : undefined,
                        }}
                      >
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
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows?.length ? (
                  table
                    .getRowModel()
                    .rows.map((row) => <DraggableRow key={row.id} row={row} />)
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
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>
      <div className="flex items-center justify-end space-x-2 p-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <Pagination
          is_next={is_next}
          is_previous={is_previous}
          current_page={current_page}
        />
      </div>
    </div>
  );
}
