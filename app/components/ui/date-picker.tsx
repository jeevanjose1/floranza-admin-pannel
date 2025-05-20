"use client";

import * as React from "react";
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";

export function DatePicker({
  pickerType = "single",
  defaultDate,
  defaultDateRange,
  onChange,
  label = "Date",
  numberOfMonths = 1,
  className,
  ...props
}: {
  pickerType?: "single" | "range";
  defaultDate?: Date;
  defaultDateRange?: DateRange;
  onChange?: (date: Date | DateRange | undefined) => void;
  label?: string;
  numberOfMonths?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  // Initialize state based on picker type
  const [date, setDate] = React.useState<Date | undefined>(
    undefined
  );

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    defaultDateRange && defaultDateRange.from ? defaultDateRange : undefined
  );

  // Update state when defaultDate or defaultDateRange changes
  React.useEffect(() => {
    if (defaultDate && isValid(defaultDate)) {
      setDate(defaultDate);
    }
  }, [defaultDate]);

  React.useEffect(() => {
    if (defaultDateRange && defaultDateRange.from) {
      setDateRange(defaultDateRange);
    }
  }, [defaultDateRange]);

  const [open, setOpen] = React.useState(false);

  // Handle date selection based on picker type
  const handleSelect = React.useCallback(
    (selectedDate: Date | DateRange | undefined) => {
      if (pickerType === "single") {
        setDate(selectedDate as Date);
        if (onChange) onChange(selectedDate as Date);
      } else {
        setDateRange(selectedDate as DateRange);
        if (onChange) onChange(selectedDate as DateRange);
      }
    },
    [pickerType, onChange]
  );

  // Format the displayed date
  const formattedDate = React.useMemo(() => {
    if (pickerType === "single") {
      return date ? format(date, "LLL dd, yyyy") : "Select a date";
    } else {
      if (!dateRange?.from) return "Select date range";
      return dateRange.to
        ? `${format(dateRange.from, "LLL dd, yyyy")} - ${format(
            dateRange.to,
            "LLL dd, yyyy"
          )}`
        : format(dateRange.from, "LLL dd, yyyy");
    }
  }, [pickerType, date, dateRange]);

  return (
    <div className={cn("flex flex-col w-full space-y-4", className)} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-full" asChild>
          <Button
            variant="outline"
            size={'sm'}
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formattedDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">
                {pickerType === "range" ? "Select Date Range" : "Select Date"}
              </div>
              <div className="text-lg font-bold">{formattedDate}</div>
            </div>
          </div>
          <Calendar
            mode={pickerType as any}
            defaultMonth={pickerType === "single" ? date : dateRange?.from}
            selected={pickerType === "single" ? date : dateRange}
            onSelect={handleSelect}
            numberOfMonths={numberOfMonths}
            className="p-3"
          />
          <div className="p-4 border-t flex justify-end">
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}