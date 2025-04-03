import React, { type ReactNode } from "react";
import { Input } from "./input";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Label } from "./label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ArrowDownUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { ScrollArea } from "./scroll-area";

type Props = {};

type MediaPickerModalProp = {
  children: ReactNode;
};

const MediaPicker = ({ name }) => {
  return (
    <label className="cursor-pointer" htmlFor="picker">
      <Input type="file" id="picker" hidden name={name} />
      <Button
        className="pointer-events-none h-7"
        variant={"transparent"}
        size={"sm"}
      >
        Add media
      </Button>
    </label>
  );
};

const MediaViewer = () => {
  return (
    <ScrollArea className="max-h-72 w-full overflow-auto ">
        <div className=" grid grid-cols-5 gap-3 w-full">

     
      <div className="p-4 hover:bg-muted/30 cursor-pointer  rounded-md transition-all max-w-min flex flex-col items-center">
        <div className="bg-muted/50 w-[100px] h-[100px] border-4 border-white rounded-md ring-[1px] ring-muted"></div>
        <p className="text-xs mt-2 max-w-30 truncate">
          kanfkjndkfnksasdanfknasd
        </p>
        <p className="text-[13px] mt-1 text-accent">PNG</p>
      </div>
  
      </div>
    </ScrollArea>
  );
};

const MediaPickerModal = ({ children }: MediaPickerModalProp) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-200">
        <DialogHeader className="">
          <DialogTitle>Select file</DialogTitle>
        </DialogHeader>
        <div className="w-full px-4">
          <div className="w-full mb-6">
            <div className="flex items-center mb-2 gap-4 justify-between w-full">
              <Input className="max-w-96" placeholder="Search files" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"transparent"} size={"icon"}>
                    <ArrowDownUp size={10} />{" "}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-[13px]">
                    Sorted By
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup>
                    <DropdownMenuRadioItem value="newst">
                      Date added (newest)
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">
                      Date added (Oldest)
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="atoz">
                      File name (A-Z)
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ztoa">
                      File name (Z-A)
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <Select>
                <SelectTrigger
                  size="sm"
                  className="data-[size=sm]:h-7 rounded-sm py-0"
                >
                  <SelectValue placeholder="File type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* <Select>
                <SelectTrigger size="sm" className="">
                  <SelectValue placeholder="File type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select> */}
            </div>
          </div>

          <div className="w-full min-h-30 mb-6  border border-muted rounded-md">
            <div className="w-full h-30 flex flex-col justify-center items-center">
              <MediaPicker />

              <p className="text-[13px] mt-2 text-accent">
                Accepts images and videos
              </p>
            </div>
          </div>

          <MediaViewer />
        </div>
        <DialogFooter className=" border-muted border-t">
          <DialogClose>
            <Button size={"sm"} variant={"secondary"}>
              Close
            </Button>
          </DialogClose>
          <Button size={"sm"}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function MediaInput({}: Props) {
  return (
    <div className="w-full p-4 min-h-30  border border-muted rounded-md">
      <div className="w-full h-30 flex flex-col justify-center items-center">
        <MediaPickerModal>
          <Button className=" h-7" variant={"transparent"} size={"sm"}>
            Add media
          </Button>
        </MediaPickerModal>

        <p className="text-[13px] mt-2 text-accent">
          Accepts images and videos
        </p>
      </div>
    </div>
  );
}
