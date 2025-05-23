import { useState, useEffect, useRef, type SetStateAction } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, Clock, SunIcon, MoonIcon } from "lucide-react";
import { Label } from "./label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Switch } from "./switch";
import { cn } from "~/lib/utils";
import dayjs from "dayjs";

// Helper functions to generate time options
const generate12Hours = () => {
  const hours = [];
  for (let i = 1; i <= 12; i++) {
    hours.push({ value: i.toString(), label: i.toString() });
  }
  return hours;
};

const generate24Hours = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push({
      value: i.toString().padStart(2, "0"),
      label: i.toString().padStart(2, "0"),
    });
  }
  return hours;
};

const generateMinutes = () => {
  const minutes = [];
  for (let i = 0; i < 60; i += 5) {
    // Using 5-minute increments
    minutes.push({
      value: i.toString().padStart(2, "0"),
      label: i.toString().padStart(2, "0"),
    });
  }
  return minutes;
};

const hours12 = generate12Hours();
const hours24 = generate24Hours();
const minutes = generateMinutes();

type props = {
  defaultValue?: string;
  is24Hour?: boolean;
  onChange: (e: any) => void;
  onFormatChange?: (e: any) => void;
};

export default function TimePicker({
  defaultValue = "",
  is24Hour: initialIs24Hour = false,
  onChange,
  onFormatChange,
}: props) {
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  const [is24Hour, setIs24Hour] = useState(initialIs24Hour);
  const [open, setOpen] = useState(false);
  const [openHours, setOpenHours] = useState(false);
  const [openMinutes, setOpenMinutes] = useState(false);
  
  // Flag to track if component is initialized
  const isInitialized = useRef(false);
  const isSettingDefault = useRef(false);

  // Initialize time from defaultValue
  useEffect(() => {
    if (defaultValue) {
      isSettingDefault.current = true;
      
      // Since defaultValue comes from API split, it's always 24-hour format
      // Possible formats: "04:30:00", "04:30", "4:30:00", "4:30"
      
      let timeObj;
      const patterns = [
        "HH:mm:ss", // "04:30:00"
        "HH:mm",    // "04:30"
        "H:mm:ss",  // "4:30:00"
        "H:mm"      // "4:30"
      ];

      for (const pattern of patterns) {
        timeObj = dayjs(defaultValue, pattern);
        if (timeObj.isValid()) {
          setHour(timeObj.format("HH"));
          setMinute(timeObj.format("mm"));
          setPeriod(timeObj.hour() >= 12 ? "PM" : "AM");
          // Since API data is 24-hour format, set to 24-hour mode
          setIs24Hour(true);
          break;
        }
      }

      // Fallback: if dayjs parsing fails, try manual parsing
      if (!timeObj || !timeObj.isValid()) {
        const timeParts = defaultValue.split(':');
        if (timeParts.length >= 2) {
          const hourStr = timeParts[0].padStart(2, '0');
          const minuteStr = timeParts[1].padStart(2, '0');
          
          setHour(hourStr);
          setMinute(minuteStr);
          setPeriod(parseInt(hourStr) >= 12 ? "PM" : "AM");
          setIs24Hour(true);
        }
      }
      
      // Set initialized flag after a brief delay to allow state updates
      setTimeout(() => {
        isSettingDefault.current = false;
        isInitialized.current = true;
      }, 0);
    } else {
      isInitialized.current = true;
    }
  }, [defaultValue]);

  // Notify parent when time changes (only after user interaction)
  useEffect(() => {
    if (onChange && isInitialized.current && !isSettingDefault.current) {
      const timeString = getTimeValue();
      onChange(timeString);
    }
  }, [hour, minute, period, is24Hour]);

  // Notify parent when format changes (only after user interaction)
  useEffect(() => {
    if (onFormatChange && isInitialized.current && !isSettingDefault.current) {
      onFormatChange(is24Hour);
    }
  }, [is24Hour, onFormatChange]);

  const handleSelectHour = (currentValue: SetStateAction<string>) => {
    setHour(currentValue);
    setOpenHours(false);
  };

  const handleSelectMinute = (currentValue: SetStateAction<string>) => {
    setMinute(currentValue);
    setOpenMinutes(false);
  };

  const toggleTimeFormat = () => {
    const newFormat = !is24Hour;

    // Convert the current time to the new format
    if (is24Hour) {
      // Converting from 24hr to 12hr
      const hourInt = parseInt(hour);
      if (hourInt === 0) {
        setHour("12");
        setPeriod("AM");
      } else if (hourInt < 12) {
        setHour(hourInt.toString());
        setPeriod("AM");
      } else if (hourInt === 12) {
        setHour("12");
        setPeriod("PM");
      } else {
        setHour((hourInt - 12).toString());
        setPeriod("PM");
      }
    } else {
      // Converting from 12hr to 24hr
      const hourInt = parseInt(hour);
      if (period === "AM") {
        if (hourInt === 12) {
          setHour("00");
        } else {
          setHour(hourInt.toString().padStart(2, "0"));
        }
      } else {
        if (hourInt === 12) {
          setHour("12");
        } else {
          setHour((hourInt + 12).toString().padStart(2, "0"));
        }
      }
    }

    setIs24Hour(newFormat);
  };

  // Get the time value in the current format
  const getTimeValue = () => {
    // Create a dayjs object with the current time
    const timeStr = is24Hour
      ? `2023-01-01 ${hour}:${minute}`
      : `2023-01-01 ${hour}:${minute} ${period}`;

    const format = is24Hour ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD h:mm A";
    const timeObj = dayjs(timeStr, format);

    // Return in ISO format for consistency
    return timeObj.isValid()
      ? timeObj.format("HH:mm") // Return in 24-hour format for API
      : null;
  };

  // Format displayed time based on the current format
  const formattedTime = () => {
    const timeStr = is24Hour
      ? `2023-01-01 ${hour}:${minute}`
      : `2023-01-01 ${hour}:${minute} ${period}`;

    const format = is24Hour ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD h:mm A";
    const displayFormat = is24Hour ? "HH:mm" : "h:mm A";

    const timeObj = dayjs(timeStr, format);
    return timeObj.isValid()
      ? timeObj.format(displayFormat)
      : hour + ":" + minute + (is24Hour ? "" : " " + period);
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Main Time Picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-full" asChild>
          <Button
            variant="outline"
            size={"sm"}
            className="w-full justify-start text-left font-normal"
          >
            <Clock className="mr-2 h-4 w-4" />
            {formattedTime()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-100 p-0" align="end">
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Select Time</div>
              <div className="text-2xl font-bold">{formattedTime()}</div>
            </div>

            {/* Format Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="time-format">24-Hour Format</Label>
              <Switch
                id="time-format"
                checked={is24Hour}
                onCheckedChange={toggleTimeFormat}
              />
            </div>

            <div className="flex space-x-3">
              {/* Hours */}
              <div className="flex-grow grid gap-2">
                <Label htmlFor="hours">Hour</Label>
                <Popover open={openHours} onOpenChange={setOpenHours}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      {hour}
                      <Clock className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0">
                    <Command>
                      <CommandInput placeholder="Search hour..." />
                      <CommandList>
                        <CommandEmpty>No hour found.</CommandEmpty>
                        <CommandGroup>
                          <div className="h-60 overflow-y-auto">
                            {(is24Hour ? hours24 : hours12).map(
                              (timeOption) => (
                                <CommandItem
                                  key={timeOption.value}
                                  value={timeOption.value}
                                  onSelect={handleSelectHour}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      hour === timeOption.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {timeOption.label}
                                </CommandItem>
                              )
                            )}
                          </div>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Minutes */}
              <div className="flex-grow grid gap-2">
                <Label htmlFor="minutes">Minute</Label>
                <Popover open={openMinutes} onOpenChange={setOpenMinutes}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      {minute}
                      <Clock className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0">
                    <Command>
                      <CommandInput placeholder="Search minute..." />
                      <CommandList>
                        <CommandEmpty>No minute found.</CommandEmpty>
                        <CommandGroup>
                          <div className="h-60 overflow-y-auto">
                            {minutes.map((timeOption) => (
                              <CommandItem
                                key={timeOption.value}
                                value={timeOption.value}
                                onSelect={handleSelectMinute}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    minute === timeOption.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {timeOption.label}
                              </CommandItem>
                            ))}
                          </div>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {!is24Hour && (
                <div className="flex-grow grid gap-2">
                  <Label>AM/PM</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={period === "AM" ? "default" : "outline"}
                      size="default"
                      onClick={() => setPeriod("AM")}
                      className="flex items-center justify-center"
                    >
                      <span className="mr-0.5 ">AM</span>
                      <SunIcon className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={period === "PM" ? "default" : "outline"}
                      size="default"
                      onClick={() => setPeriod("PM")}
                      className="flex items-center justify-center"
                    >
                      <span className="mr-0.5 text-sm">PM</span>
                      <MoonIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}