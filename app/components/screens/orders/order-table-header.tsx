import { EllipsisVertical, FilterIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";

import { Separator } from "~/components/ui/separator";
import { useBulkInvoice, useBulkStatus } from "~/services/queries/order";
import { toast } from "sonner";
import { download_pdf } from "~/lib/utils";
import dayjs from "dayjs";
import { Link, useParams } from "react-router";
import { base_url } from "~/services/instance";
import { COMMON } from "~/shared/urls/common";
import useQueryParams from "~/hooks/use-query-param";
import _ from "lodash";
import { PopConfirm } from "~/components/ui/pop-confirm";

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
const Filter = ({ onClearAll }: { onClearAll: () => void }) => {
  const { updateUrl, getParam } = useQueryParams();
  const handleFilter = (type: string, value: string) => {
    updateUrl({
      [type]: value,
    });
  };

  const fromDateValue = getParam("from")
    ? new Date(getParam("from")!)
    : undefined;
  const toDateValue = getParam("to") ? new Date(getParam("to")!) : undefined;

  return (
    <div className="px-4 pb-4 flex items-center gap-3">
      <div>
        <DatePicker
          defaultDateRange={{
            from: fromDateValue,
            to: toDateValue,
          }}
          onChange={(e: any) => {
            if (e.from) {
              handleFilter("from", dayjs(e.from).format("YYYY-MM-DD"));
            }
            if (e.to) {
              handleFilter("to", dayjs(e.to).format("YYYY-MM-DD"));
            }
          }}
          pickerType="range"
        />
      </div>
      <Button onClick={onClearAll} size={"sm"}>
        Clear
      </Button>
    </div>
  );
};

export default function OrderTableHeader({ selected, setSelected }: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const params = useParams();
  const handleToggle = () => setFilterOpen((pre) => !pre);
  const { mutateAsync: change } = useBulkStatus();
  const { mutateAsync: download } = useBulkInvoice();
  const { replaceParams, clearParams, getParam } = useQueryParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      error: (error: any) => error?.data?.message,
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
        error: (error: any) => error.data?.message
        ,
      }
    );
  };
  const handleSelect = (e: any) => {
    e.preventDefault();
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
            <PopConfirm
              type="warning"
              description="Are you realy want to change the status"
              title="Change status"
              action={() => handleChangeStatus("2")}
            >
              <DropdownMenuItem onSelect={handleSelect}>
                Action Taken
              </DropdownMenuItem>
            </PopConfirm>
            <PopConfirm
              type="warning"
              description="Are you realy want to change the status"
              title="Change status"
              action={() => handleChangeStatus("5")}
            >
              <DropdownMenuItem onSelect={handleSelect}>Hold</DropdownMenuItem>
            </PopConfirm>
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
            <PopConfirm
              type="warning"
              description="Are you realy want to change the status"
              title="Change status"
              action={() => handleChangeStatus("1")}
            >
              <DropdownMenuItem onSelect={handleSelect}>
                Processing
              </DropdownMenuItem>
            </PopConfirm>
            <PopConfirm
              type="warning"
              description="Are you realy want to change the status"
              title="Change status"
              action={() => handleChangeStatus("7")}
            >
              <DropdownMenuItem onSelect={handleSelect}>
                Canceled
              </DropdownMenuItem>
            </PopConfirm>
            <PopConfirm
              type="warning"
              description="Are you realy want to change the status"
              title="Change status"
              action={() => handleChangeStatus("5")}
            >
              <DropdownMenuItem onSelect={handleSelect}>Hold</DropdownMenuItem>
            </PopConfirm>
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
            <PopConfirm
              type="warning"
              description="Are you realy want to change the status"
              title="Change status"
              action={() => handleChangeStatus("4")}
            >
              <DropdownMenuItem onSelect={handleSelect}>
                Completed
              </DropdownMenuItem>
            </PopConfirm>
            <PopConfirm
              type="warning"
              description="Are you realy want to change the status"
              title="Change status"
              action={() => handleChangeStatus("7")}
            >
              <DropdownMenuItem onSelect={handleSelect}>
                Canceled
              </DropdownMenuItem>
            </PopConfirm>
            <PopConfirm
              type="warning"
              description="Are you realy want to change the status"
              title="Change status"
              action={() => handleChangeStatus("2")}
            >
              <DropdownMenuItem onSelect={handleSelect}>Hold</DropdownMenuItem>
            </PopConfirm>
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
            <PopConfirm
              type="warning"
              description="Are you realy want to change the status"
              title="Change status"
              action={() => handleChangeStatus("2")}
            >
              <DropdownMenuItem onSelect={handleSelect}>
                Action Taken
              </DropdownMenuItem>
            </PopConfirm>
            <PopConfirm
              type="warning"
              description="Are you realy want to change the status"
              title="Change status"
              action={() => handleChangeStatus("7")}
            >
              <DropdownMenuItem onSelect={handleSelect}>
                Canceled
              </DropdownMenuItem>
            </PopConfirm>
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
            <PopConfirm
              type="warning"
              description="Are you realy want to change the status"
              title="Change status"
              action={() => handleChangeStatus("2")}
            >
              <DropdownMenuItem onSelect={handleSelect}>
                Action Taken
              </DropdownMenuItem>
            </PopConfirm>
            <PopConfirm
              type="warning"
              description="Are you realy want to change the status"
              title="Change status"
              action={() => handleChangeStatus("5")}
            >
              <DropdownMenuItem onSelect={handleSelect}>Hold</DropdownMenuItem>
            </PopConfirm>
          </>
        );
      default:
        break;
    }
  };

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
        {params?.order_menu === "shipping" && (
          <Link to={`${base_url}${COMMON.EXCEL_DOWNLOAD}`} download>
            <Button size={"sm"}>Excel Download</Button>
          </Link>
        )}
        <Button
          onClick={handleToggle}
          variant={"transparent"}
          size={"icon"}
          className={filterOpen ? "bg-muted" : ""}
        >
          <FilterIcon size={10} />{" "}
        </Button>
        {selected?.length > 0  && menu_render() && (
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
              <Filter onClearAll={handleClearAll} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
