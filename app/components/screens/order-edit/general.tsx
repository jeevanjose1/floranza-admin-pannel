import { DatePicker } from "~/components/ui/date-picker";
import { Input } from "~/components/ui/input";

type Props = {};

export default function General({}: Props) {
  return (
    <div>
      <p>General</p>
      <div className="flex items-center gap-2">
        <div>
          <DatePicker className="max-w-44 min-w-36" />
        </div>
        @
        <div className="flex items-center gap-2">
          <Input className="max-w-18" type="number" />:
          <Input className="max-w-18" type="number" />
        </div>
      </div>
    </div>
  );
}
