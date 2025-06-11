import {
  ArrowDownUp,
  ArrowUpNarrowWide,
  ArrowUpWideNarrow,
  FilterIcon,
} from "lucide-react";
import{ useState } from "react";
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

type Props = {};

const Filter = () => {
  return (
    <div className="px-4 pb-4 flex items-center gap-3">
      <Select>
        <SelectTrigger size="sm" className="">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger size="sm" className="">
          <SelectValue placeholder="Catogery" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="electronic">Electronics</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="wearable">Wearables</SelectItem>
            <SelectItem value="display">Displays</SelectItem>
            <SelectItem value="peer">Peripherals</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
     <DatePicker/>
    </div>
  );
};

const Sort = () => {
  const [position, setPosition] = useState("price");
  const [ass, setAss] = useState("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"transparent"} size={"icon"}>
          <ArrowDownUp size={10} />{" "}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-[13px]">Sorted By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          
          <DropdownMenuRadioItem value="stocks">Stocks</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={ass} onValueChange={setAss}>
          <DropdownMenuRadioItem
            indicator={<ArrowUpNarrowWide className="size-4 fill-current" />}
            value="lowest"
          >
            Lowest to Highest
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            indicator={<ArrowUpWideNarrow className="size-4 fill-current" />}
            value="highest"
          >
            Highest to Lowest
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function AdminUserTableHeader({}: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const handleToggle = () => setFilterOpen((pre) => !pre);

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

  return (
    <>
      <div className="w-full flex items-center gap-3 pt-4 pb-3 px-4 justify-end">
        <Input placeholder="Search admin users" className="max-w-96 mr-auto" />
        <Button
          onClick={handleToggle}
          variant={"transparent"}
          size={"icon"}
          className={filterOpen ? "bg-muted" : ""}
        >
          <FilterIcon size={10} />{" "}
        </Button>
        <Sort />
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
              <Filter />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
