import { Info } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { MediaItem } from "./media-list";

type Props = { children: ReactNode; data: MediaItem[]; current_index: number };

export default function ImageViewer({ children, data, current_index }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (api) {
      api.scrollTo(current);
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    }
  }, [api, current_index]);

  return (
    <Dialog
      onOpenChange={() => {
        setCurrent(current_index);
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-300">
        <DialogHeader>
          <DialogTitle>Media</DialogTitle>
        </DialogHeader>
        <div className="w-full flex gap-4 px-4">
          <Carousel setApi={setApi} className="flex-1">
            <CarouselContent>
              {data?.map((item) => (
                <CarouselItem key={item?.id}>
                  <img
                    src={item?.url}
                    className="w-full max-h-150 object-contain overflow-hidden rounded-md"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-4 flex-[.4]">
            <div className="flex items-center mb-4 text-sm gap-1">
              <Info size={18} />
              <p>Information</p>
            </div>
            <div>
              <div className="mb-2">
                <Label>Name</Label>
                <Input value={data[current]?.name} placeholder="Enter name" />
              </div>
              <div className="mb-4">
                <Label>Alt</Label>
                <Input value={data[current]?.name} placeholder="Enter alt" />
              </div>
              <div className="mb-2">
                <Label className="font-medium">Details</Label>
                <p className="text-[13px]">
                  {" "}
                  {data[current]?.type} - {data[current]?.size}
                </p>
                <p className="text-[13px]">Added on - {data[current]?.date}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="border-muted border-t">
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
}
