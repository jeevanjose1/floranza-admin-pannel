import Loader from "~/components/ui/loader";
import ImageViewer from "./image-viewer";
import { Checkbox } from "~/components/ui/checkbox";
import { ImageOff } from "lucide-react";
import type { MediaProp } from "~/routes/inventory/media";

export type MediaItem = {
  name: string;
  url: string;
  id: string;
  size: string;
  date: string;
  type: string;
  file:string
};

type Props = {
  media_data: MediaItem[];
  loading: boolean;
  setSelect: React.Dispatch<React.SetStateAction<MediaProp[]>>;
  select: MediaProp[];
};

type CardType = {
  data: MediaItem;
  onSelect: (data: MediaProp) => void;
  select: MediaProp[];
};

const MediaCard = ({ data, onSelect, select }: CardType) => {
  const checked = () => {
    const find_data = select.find((item) => item.id === data?.id);
    return !!find_data;
  };

  return (
    <div className="p-4 hover:bg-muted/30 cursor-pointer rounded-md transition-all max-w-min flex flex-col items-center">
      <div className="bg-muted/50 w-[100px] h-24 border-4 relative border-white rounded-md ring-1 ring-muted">
        <Checkbox
          checked={checked()}
          onClick={(e) => {
            e.stopPropagation();
            onSelect({
              id: data.id,
              url: data.url,
              file:data?.file
            });
          }}
          className="absolute top-2 right-2 z-10"
        />
        <img
          src={data.url}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-xs mt-2 w-24 truncate">{data.name}</p>
      <p className="text-xs mt-1 text-muted-foreground">{data.type}</p>
    </div>
  );
};

export default function MediaList({
  loading,
  media_data,
  setSelect,
  select,
}: Props) {

  const handleSelect = (item: MediaProp) => {
    setSelect(prev => {
      const exists = prev.some(prevItem => prevItem.id === item.id);
      
      if (exists) {
        // Remove the item if it already exists
        return prev.filter(prevItem => prevItem.id !== item.id);
      } else {
        // Add the item if it doesn't exist
        return [...prev, item];
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full h-44 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!media_data?.length) {
    return (
      <div className="w-full h-44 flex items-center justify-center">
        <ImageOff size={30} />
      </div>
    );
  }
  
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-6">
      {media_data.map((item, index) => (
        <ImageViewer key={item.id} current_index={index} data={media_data}>
          <MediaCard select={select} onSelect={handleSelect} data={item} />
        </ImageViewer>
      ))}
    </div>
  );
}