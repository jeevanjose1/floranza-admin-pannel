import {
  ArrowDownUp,
  ArrowUpNarrowWide,
  ArrowUpWideNarrow,
  EllipsisVertical,
  FilterIcon,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useBulkInvoice, useBulkStatus } from "~/services/queries/order";
import { toast } from "sonner";
import { download_pdf } from "~/lib/utils";
import dayjs from "dayjs";
import { useParams } from "react-router";

type Props = { selected: string[]; setSelected: any };
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
      <div className="w-56">
        <DatePicker />
      </div>
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

export default function OrderTableHeader({ selected, setSelected }: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const params = useParams();
  const handleToggle = () => setFilterOpen((pre) => !pre);
  const { mutateAsync: change } = useBulkStatus();
  const { mutateAsync: download } = useBulkInvoice();

  const handleDownloadInvoice = useCallback(() => {
    const formData = new FormData();
    formData.append("order_ids", JSON.stringify(selected));
    toast.promise(download({ order_ids: selected }), {
      loading: "Generating Invoice",
      success: (response) => {
        setSelected({});
        download_pdf(response, dayjs().format("DD/MM/YYYY"));
        return "Invoice Generated";
      },
      error: () => "Something went wrong",
    });
  }, [selected, download]);

  const handleChangeStatus = (status: string) => {
    toast.promise(
      change({
        status: status,
        order_ids: selected,
      }),
      {
        loading: "Changing status",
        success: () => {
          setSelected({});
          return "Status changed";
        },
        error: "Something went wrong",
      }
    );
  };

  const menu_render = () => {
    switch (params?.order_menu) {
      case "all":
        return null;
      case "processing":
        return (
          <>
            <DropdownMenuLabel className="text-xs text-accent-foreground/50">
              Change Status
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={() => handleChangeStatus("2")}>
              Action Taken
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleChangeStatus("5")}>
              Hold
            </DropdownMenuItem>
          </>
        );
      case "action-taken":
        return (
          <>
            <DropdownMenuLabel className="text-xs text-accent-foreground/50">
              Bulk Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDownloadInvoice}>
              Download Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-accent-foreground/50">
              Change Status
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleChangeStatus("1")}>
              Processing
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleChangeStatus("7")}>
              Canceled
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleChangeStatus("5")}>
              Hold
            </DropdownMenuItem>
          </>
        );
      case "shipping":
        return (
          <>
            <DropdownMenuLabel className="text-xs text-accent-foreground/50">
              Bulk Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDownloadInvoice}>
              Download Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-accent-foreground/50">
              Change Status
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleChangeStatus("4")}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleChangeStatus("7")}>
              Canceled
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleChangeStatus("2")}>
              Hold
            </DropdownMenuItem>
          </>
        );
      case "completed":
        return (
          <>
            <DropdownMenuLabel className="text-xs text-accent-foreground/50">
              Bulk Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDownloadInvoice}>
              Download Invoice
            </DropdownMenuItem>
          </>
        );
      case "hold":
        return (
          <>
            <DropdownMenuLabel className="text-xs text-accent-foreground/50">
              Bulk Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDownloadInvoice}>
              Download Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-accent-foreground/50">
              Change Status
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleChangeStatus("2")}>
              Action Taken
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleChangeStatus("7")}>
              Canceled
            </DropdownMenuItem>
          </>
        );
      case "refund":
        return (
          <>
            <DropdownMenuLabel className="text-xs text-accent-foreground/50">
              Bulk Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDownloadInvoice}>
              Download Invoice
            </DropdownMenuItem>
          </>
        );
      case "canceled":
        return null;
      case "pre-order":
      case "reserved":
        return (
          <>
            <DropdownMenuLabel className="text-xs text-accent-foreground/50">
              Bulk Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDownloadInvoice}>
              Download Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-accent-foreground/50">
              Change Status
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleChangeStatus("2")}>
              Action Taken
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleChangeStatus("5")}>
              Hold
            </DropdownMenuItem>
          </>
        );
      default:
        break;
    }
  };

  return (
    <>
      <div className="w-full flex items-center gap-3 pt-4 pb-3 px-4 justify-end">
        <Input placeholder="Search brand" className="max-w-96 mr-auto" />
        <Button
          onClick={handleToggle}
          variant={"transparent"}
          size={"icon"}
          className={filterOpen ? "bg-muted" : ""}
        >
          <FilterIcon size={10} />{" "}
        </Button>
        <Sort />
        {selected?.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} title="Bulk Action" variant={"secondary"}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {menu_render()}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
