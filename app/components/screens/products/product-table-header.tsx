import { FilterIcon } from "lucide-react";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";

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
import useQueryParams from "~/hooks/use-query-param";
import _ from "lodash";
import { useListCatogery } from "~/services/queries";
import dayjs from "dayjs";
import { useListCatogeryProduct } from "~/services/queries/catogery";
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
type Props = {};

const Filter = ({ onClearAll }: { onClearAll: () => void }) => {
  const { updateUrl, getAllParams } = useQueryParams();
 const { data: catogeres } = useListCatogeryProduct({ page: 0 });

  const filterd_catogery =
    catogeres?.data?.data?.map((item: any) => ({
      value: item?.id,
      label: item?.name,
    })) || [];  const { status, catogery, date } = getAllParams();
 
  const statusValue = status || "";
  const dateValue = date ? new Date(date!) : undefined;
  const catogeryValue = catogery || "";
  const handleFilter = (type: string, value: string) => {
    updateUrl({
      [type]: value,
    });
  };

  return (
    <div className="px-4 pb-4 flex items-center gap-3">
      <Select
        value={statusValue}
        onValueChange={(e) => handleFilter("status", e)}
      >
        <SelectTrigger size="sm" className="">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="1">Active</SelectItem>
            <SelectItem value="0">Inactive</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={catogeryValue}
        onValueChange={(e) => handleFilter("catogery", e)}
      >
        <SelectTrigger size="sm" className="">
          <SelectValue placeholder="Catogery" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filterd_catogery?.map((item: any) => {
              return <SelectItem value={item?.value}>{item?.label}</SelectItem>;
            })}
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

export default function ProductTableHeader({}: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const handleToggle = () => setFilterOpen((pre) => !pre);
  const { replaceParams, getParam, clearParams } = useQueryParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

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
          onChange={handleSearch}
          placeholder="Search products"
          className="max-w-96 mr-auto"
          defaultValue={searchValue}
        />
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
    </>
  );
}
