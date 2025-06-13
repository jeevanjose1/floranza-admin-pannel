import {
  ArrowDownUp,
  ArrowUpNarrowWide,
  ArrowUpWideNarrow,
  FilterIcon,
  Trash2,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { useDeleteMedia } from "~/services/queries";
import { PopConfirm } from "~/components/ui/pop-confirm";
import { toast } from "sonner";
import type { MediaProp } from "~/routes/inventory/media";
import useQueryParams from "~/hooks/use-query-param";
import dayjs from "dayjs";
import _ from "lodash";

type Props = {
  select: MediaProp[];
  setSelect: React.Dispatch<React.SetStateAction<MediaProp[]>>;
};
const containerVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
  },
  visible: {
    height: "auto",
    opacity: 1,
    overflow: "visible",
    transition: {
      height: {
        duration: 0.25,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
      opacity: {
        duration: 0.2,
        delay: 0.05,
      },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    transition: {
      height: {
        duration: 0.25,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
      opacity: {
        duration: 0.15,
      },
    },
  },
};

const Filter = ({ onClearAll }: { onClearAll: () => void }) => {
  const { updateUrl, getParam } = useQueryParams();
  const handleFilter = (type: string, value: string) => {
    updateUrl({
      [type]: value,
    });
  };

  const typeValue = getParam("type") || "";
  const dateValue = getParam("date") ? new Date(getParam("date")!) : undefined;

  return (
    <div className="px-4 pb-4 flex items-center gap-3">
      <Select value={typeValue} onValueChange={(e) => handleFilter("type", e)}>
        <SelectTrigger size="sm" className="">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div>
        <DatePicker
          defaultDate={dateValue}
          onChange={(e: any) => {
            handleFilter("date", dayjs(e).format("YYYY-MM-DD"));
          }}
          pickerType="single"
        />
      </div>
      <Button onClick={onClearAll} size={"sm"}>
        Clear
      </Button>
    </div>
  );
};

export default function MediaListHeader({ select, setSelect }: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const handleToggle = () => setFilterOpen((pre) => !pre);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: delete_medias } = useDeleteMedia();
  const { replaceParams, clearParams, getParam } = useQueryParams();

  const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim();

    if (searchValue) {
      replaceParams({ search: searchValue });
    } else {
      clearParams();
    }
  }, 700);

  const handleDelete = () => {
    const form_data = new FormData();
    select.forEach((item, index) => {
      form_data.append(`ids[${index}]`, item.id);
    });
    toast.promise(delete_medias(form_data), {
      loading: "Removing items",
      success: () => {
        setSelect([]);
        return "Items removed";
      },
      error: "Faild to remove items",
    });
  };

  const handleClearAll = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    clearParams();
  };

  const searchValue = getParam("search") || "";

  return (
    <>
      <div className="w-full flex items-center gap-3 pt-4 pb-3 px-4 justify-end">
        <Input
          ref={searchInputRef}
          defaultValue={searchValue}
          onChange={handleSearch}
          placeholder="Search here..."
          className="max-w-96 mr-auto"
        />
        <PopConfirm
          title="Remove medias"
          description="Are you realy want to delete this items"
          action={handleDelete}
        >
          <Button
            variant={"secondary"}
            hidden={!select?.length}
            size={"sm"}
            className={filterOpen ? "bg-muted" : ""}
          >
            <Trash2 />
            Delete
          </Button>
        </PopConfirm>
        <Button
          onClick={handleToggle}
          variant={"transparent"}
          size={"icon"}
          className={filterOpen ? "bg-muted" : ""}
        >
          <FilterIcon size={10} />{" "}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {filterOpen && (
          <motion.div
            key="filter-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            <div className="overflow-hidden">
              <Separator className="mb-3 bg-muted" />
              <Filter onClearAll={handleClearAll} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Separator className=" bg-muted" />
    </>
  );
}
