import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Button } from "./button";
import { ImagePlus, Trash2 } from "lucide-react";
import { Card, CardContent } from "./card";

type Props = {
  onChange: (file: File | undefined) => void;
  value?: string; // Existing image URL (e.g. from DB)
};

export default function MediaUpload({ onChange, value }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  // Sync with external value if available (e.g. from form default)
  useEffect(() => {
    if (value && !preview) {
      setPreview(value);
    }
  }, [value]);

  return (
    <div className="flex flex-col items-start gap-6 w-full max-w-md">
      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Upload Button */}
      {!preview && (
        <Button
          onClick={handleClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ImagePlus className="w-4 h-4" />
          Upload Image
        </Button>
      )}

      {/* Image Preview */}
      {preview && (
        <Card className="overflow-hidden max-w-36 p-0 max-h-36 rounded-md shadow-none transition hover:shadow-sm w-full">
          <CardContent className="p-0 relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover transition duration-300"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="absolute top-3 right-3 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
