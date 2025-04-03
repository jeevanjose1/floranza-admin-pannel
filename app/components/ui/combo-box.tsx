
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"
import { cn } from "~/lib/utils"




type props = {
    options:Record<string,any>
}

export function Combobox({options}:props) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size={'sm'}
          aria-expanded={open}
          className=" w-full justify-between"
        >
          {value
            ? options.find((data:any) => data.value === value)?.label
            : "Select..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No  found.</CommandEmpty>
            <CommandGroup>
              {options.map((data:any) => (
                <CommandItem
                  key={data.value}
                  value={data.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {data.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === data.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
