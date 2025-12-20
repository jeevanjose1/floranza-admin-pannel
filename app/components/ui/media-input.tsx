import React, { useEffect, useState, type ReactNode } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { ScrollArea } from "./scroll-area";
import { ArrowDownUp, Plus, X } from "lucide-react";
import MediaList from "../screens/media/media-list";
import { useListMedia, useUploadMedia } from "~/services/queries";
import { toast } from "sonner";
import type { UseFormReturn } from "react-hook-form";
import type { MediaProp } from "~/routes/inventory/media";

type FormProps = { 
  form: UseFormReturn<any> 

};

type PickerProps = {
  form: UseFormReturn<any> 

  selectedMedia:MediaProp[]
  setSelectedMedia:any
}

type MediaItem = {
  id: string;
  name: string;
  url: string;
  size: number;
  date: string;
  type: string;
  file:string
};

// File uploader component
const MediaUploader = () => {
  const { mutateAsync: upload } = useUploadMedia();
  
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("file", file);
    });

    toast.promise(upload(formData), {
      loading: "Uploading...",
      success: "Upload successful!",
      error: (error:any)=>error?.data?.message,
    });
  };
  
  return (
    <label className="cursor-pointer" htmlFor="picker">
      <Input multiple onChange={handleUpload} type="file" id="picker" hidden />
      <Button
        className="pointer-events-none h-7"
        variant="transparent"
        size="sm"
      >
        Add media
      </Button>
    </label>
  );
};

// Media browsing component
const MediaBrowser = ({ form,selectedMedia,setSelectedMedia }: PickerProps) => {
  const { data: mediaData, isFetching, isLoading } = useListMedia({ page: 1 });

  // Initialize selected media from form data
  useEffect(() => {
    const currentMedia = form.getValues("media") || [];
    if (currentMedia.length > 0) {
      setSelectedMedia(currentMedia);
    }
  }, [form]);

 
  // Format media data
  const formattedMedia = mediaData?.data?.data?.map((item: any): MediaItem => {
    const fileParts = item?.file?.split(".") || [];
    return {
      id: item?.id,
      name: item?.file_name,
      url: item?.url,
      size: item?.size,
      date: item?.created_at,
      type: fileParts[fileParts.length - 1] || "",
      file:item?.file
    };
  });

  return (
    <ScrollArea className="max-h-72 w-full overflow-auto">
      <MediaList
        setSelect={setSelectedMedia}
        select={selectedMedia}
        media_data={formattedMedia}
        loading={isFetching || isLoading}
      />
    </ScrollArea>
  );
};

// Media selection modal
const MediaPickerModal = ({ children, form }: FormProps & { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [fileType, setFileType] = useState<string | undefined>(undefined);
  const [selectedMedia, setSelectedMedia] = useState<MediaProp[]>([]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-300">
        <DialogHeader>
          <DialogTitle>Select file</DialogTitle>
        </DialogHeader>
        
        <div className="w-full px-4">
          {/* Search and sort controls */}
          <div className="w-full mb-6">
            <div className="flex items-center mb-2 gap-4 justify-between w-full">
              <Input 
                className="max-w-96" 
                placeholder="Search files" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="transparent" size="icon">
                    <ArrowDownUp size={10} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-[13px]">
                    Sorted By
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                    <DropdownMenuRadioItem value="newest">
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
            
            {/* File type filter */}
            <div>
              <Select value={fileType} onValueChange={setFileType}>
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
            </div>
          </div>

          {/* Upload section */}
          <div className="w-full min-h-30 mb-6 border border-muted rounded-md">
            <div className="w-full h-30 flex flex-col justify-center items-center">
              <MediaUploader />
              <p className="text-[13px] mt-2 text-accent">
                Accepts images and videos
              </p>
            </div>
          </div>

          {/* Media browser */}
          <MediaBrowser selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia} form={form} />
        </div>
        
        <DialogFooter className="border-muted border-t">
          <DialogClose onClick={()=>    form.setValue('media',selectedMedia)
}>
            <Button type="button" size="sm">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main media input component
export default function MediaInput({ form }: FormProps) {
  const mediaItems = form.watch("media") || [];

  // Remove a media item
  const removeMediaItem = (itemToRemove: MediaItem) => {
    const updatedMedia = mediaItems.filter(
      (item: MediaItem) => item.id !== itemToRemove.id
    );
    const mediaFromApi =  mediaItems.filter(
      (item: MediaItem) => item.file !== itemToRemove.file
    );
    
    form.setValue("media", updatedMedia?.length === 0 ?mediaFromApi : updatedMedia);
  };

  // Render thumbnail for each media item
  const renderMediaThumbnail = (item: MediaItem, index: number) => (
    <div
      key={item.id || index}
      className="p-2 hover:bg-muted/30 cursor-pointer rounded-md transition-all flex flex-col items-center"
    >
      <div className="bg-muted/50 w-[100px] h-24 border-4 relative border-white rounded-md ring-1 ring-muted">
        <img
          src={item.url}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <Button
          onClick={() => removeMediaItem(item)}
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
        >
          <X size={12} />
        </Button>
      </div>
      <p className="text-xs mt-2 w-24 truncate">{item.name}</p>
    </div>
  );

  // If there are media items, show thumbnails with an "add more" button
  // Otherwise, show the upload/select UI
  return (
    <div className="w-full p-4 min-h-30 border border-muted rounded-md">
      {mediaItems.length > 0 ? (
        <div className="flex items-center flex-wrap gap-2">
          <div className="">
            <MediaPickerModal form={form}>
              <Button variant="outline" size="sm" className="h-24 p-2 w-24">
                <Plus size={24} />
              </Button>
            </MediaPickerModal>
          </div>
          {mediaItems.map(renderMediaThumbnail)}
        </div>
      ) : (
        <div className="w-full h-30 flex flex-col justify-center items-center">
          <MediaPickerModal form={form}>
            <Button className="h-7" variant="transparent" size="sm">
              Add media
            </Button>
          </MediaPickerModal>
          <p className="text-[13px] mt-2 text-accent">
            Accepts images and videos
          </p>
        </div>
      )}
    </div>
  );
}