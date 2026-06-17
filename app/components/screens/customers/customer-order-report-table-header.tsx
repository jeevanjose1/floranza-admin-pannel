import { FilterIcon } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import useQueryParams from "~/hooks/use-query-param";
import dayjs from "dayjs";
import _ from "lodash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type } from "~/shared/others/others";

type Props = {};

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

  const fromDate = getParam("from") ? new Date(getParam("from")!) : undefined;
  const toDate = getParam("to") ? new Date(getParam("to")!) : undefined;

  return (
    <div className="px-4 pb-4 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          From:
        </label>
        <DatePicker
          defaultDate={fromDate}
          onChange={(e: any) => {
            handleFilter("from", dayjs(e).format("YYYY-MM-DD"));
          }}
          pickerType="single"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">To:</label>
        <DatePicker
          defaultDate={toDate}
          onChange={(e: any) => {
            handleFilter("to", dayjs(e).format("YYYY-MM-DD"));
          }}
          pickerType="single"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Type
        </label>
        <Select
          value={(getParam("type") as any) || ""}
          onValueChange={(value) => handleFilter("type", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {type?.map((item: any) => {
              return (
                <SelectItem key={item.value} value={item.value}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    {item.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onClearAll} size={"sm"}>
        Clear
      </Button>
    </div>
  );
};

export default function CustomerOrderReportTableHeader({ }: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleToggle = () => setFilterOpen((pre) => !pre);
  const { replaceParams, clearParams, getParam } = useQueryParams();

  const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim();

    if (searchValue) {
      replaceParams({ search: searchValue });
    } else {
      clearParams();
    }
  }, 700);

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
        <Button
          onClick={handleToggle}
          variant={"transparent"}
          size={"icon"}
          className={filterOpen ? "bg-muted" : ""}
        >
          <FilterIcon size={10} />
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
    </>
  );
}
