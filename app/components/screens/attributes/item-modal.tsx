import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { ItemType } from "./attribute-table";
import { Checkbox } from "~/components/ui/checkbox";
import { GripVertical, Trash2 } from "lucide-react";
import { PopConfirm } from "~/components/ui/pop-confirm";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useDeleteAttributeItem,
  useUpadtePositionValue,
} from "~/services/queries";

const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners, setNodeRef } = useSortable({
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

type Props = { children: ReactNode; table_data: ItemType[] };

function ItemModal({ children, table_data }: Props) {
  const [data, setData] = useState<ItemType[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { mutateAsync: update_position } = useUpadtePositionValue();
  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data.map(({ id }) => id.toString()),
    [data]
  );

  useEffect(() => {
    if (table_data?.length) {
      setData(table_data);
    }
  }, [table_data]);

  const columns: ColumnDef<ItemType>[] = [
    {
      id: "drag-handle",
      header: "Move",
      cell: ({ row }) => (
        <RowDragHandleCell rowId={row.original.id.toString()} />
      ),
      size: 60,
    },
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
      size: 40, // Set fixed width for checkbox column
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
      accessorKey: "name",
      header: "Value",
      size: 280, // Primary column - give it more space
      cell: ({ row }) => (
        <div className="font-medium text-[13px] flex items-center gap-2">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      size: 120, // Set appropriate width for count column
      cell: ({ row }) => (
        <div className="font-medium text-[13px] flex items-center gap-2">
          {row.original.code}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 160, // Set appropriate width for date column
      cell: ({ row }) => (
        <div className="font-medium text-[13px] flex items-center gap-2">
          {row.original.description}
        </div>
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
      size: 80, // Fixed width for actions column
      cell: ({ row }) => {
        const attribute_id = row.original.id;
        const { mutateAsync: delete_item } = useDeleteAttributeItem();
        const handleDelete = () => {
          toast.promise(delete_item(attribute_id), {
            success: "Item deleted",
            loading: "Deleting item",
            error: (error) => error.data.message,
          });
        };
        return (
          <PopConfirm
            action={handleDelete}
            description="Are you really want to delete this item"
            title="Delete item"
          >
            <Button size={"icon"} variant={"ghost"}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </PopConfirm>
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
        update_position(value_data, {
          onSuccess: () => toast.success('Order updated'),
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

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-150 gap-0">
        <DialogHeader className="">
          <DialogTitle>Items</DialogTitle>
        </DialogHeader>
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
                        .rows.map((row) => (
                          <DraggableRow key={row.id} row={row} />
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
                  </SortableContext>
                </TableBody>
              </Table>
            </DndContext>
          </div>
          <div className="flex items-center justify-end space-x-2 p-4">
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
      </DialogContent>
    </Dialog>
  );
}

export default ItemModal;
