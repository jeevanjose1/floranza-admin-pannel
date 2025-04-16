import Loader from "~/components/ui/loader";
import ImageViewer from "./image-viewer";
import { Checkbox } from "~/components/ui/checkbox";
import { ImageOff } from "lucide-react";

export type MediaItem = {
  name: string;
  url: string;
  id: string;
  size: string;
  date: string;
  type: string;
};

type Props = {
  media_data: MediaItem[];
  loading: boolean;
  setSelect: React.Dispatch<React.SetStateAction<string[]>>;
  select: string[];
};

type CardType = {
  data: MediaItem;
  onSelect: (id: string) => void;
  select: string[];
};

const MediaCard = ({ data, onSelect, select }: CardType) => {
  return (
    <div className="p-4 hover:bg-muted/30 cursor-pointer rounded-md transition-all max-w-min flex flex-col items-center">
      <div className="bg-muted/50 w-[100px] h-[100px] border-4 relative border-white rounded-md ring-[1px] ring-muted">
        <Checkbox
          checked={select.includes(data.id)}
          onClick={(e) => {
            e.stopPropagation();

            onSelect(data.id);
          }}
          className="absolute top-2 right-2 z-10"
        />
        <img
          src={data.url}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-xs mt-2 max-w-30 truncate">{data.name}</p>
      <p className="text-[13px] mt-1 text-accent">{data.type}</p>
    </div>
  );
};

export default function MediaList({
  loading,
  media_data,
  setSelect,
  select,
}: Props) {
  const handleSelect = (id: string) => {
    setSelect((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  


  if (loading) {
    return (
      <div className="w-full h-44 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if(!media_data?.length){
    return  <div className="w-full h-44 flex items-center justify-center">
    <ImageOff size={30} />
  </div>
  }

  return (
    <div className="w-full grid grid-cols-8 gap-4 p-6">
      {media_data.map((item, index) => (
        <ImageViewer key={item.id} current_index={index} data={media_data}>
          <MediaCard select={select} onSelect={handleSelect} data={item} />
        </ImageViewer>
      ))}
    </div>
  );
}
