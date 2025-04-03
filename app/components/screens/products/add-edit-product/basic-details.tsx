import { Controller, type UseFormReturn } from "react-hook-form";
import BgWrapper from "~/components/common/bg-wrapper";
import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import MediaInput from "~/components/ui/media-input";
import LexicalEditor from "~/components/ui/editor";

type Props = { form :UseFormReturn<any>};

const BasicDetails = ({ form}: Props) => {
  return (
    <BgWrapper>
      <div className="p-4 w-full">
        <div className="mb-1">
          <Label>Title</Label>
          <Controller
            control={form?.control}
            name="title"
            render={({ field }) => (
              <Input
                placeholder="Kurti in Soft Mul Cotton – White"
                {...field}
                type="text"
              />
            )}
          />

          <ErrorMessage error={form?.formState?.errors?.title?.message as string} />
        </div>
        <div className="mb-5">
          <Controller
            control={form?.control}
            name="catogery"
            render={({ field }) => {
              return <div className=" flex items-center text-foreground/70  text-[13px] "><p>http://localhost:5173/products/</p>
                <Input className="ring-0 border-0 px-0 focus-visible:ring-0  md:text-[13px] underline" value={'asdas'} type="text" placeholder="Url" />
                </div> 
            }}
          />
          <ErrorMessage error={""} />
        </div>
        <div className="mb-5">
          <Label>Description</Label>
          <Controller
            control={form?.control}
            name="title"
            render={({ field }) => <LexicalEditor />}
          />
          <ErrorMessage error={form?.formState?.errors?.title?.message as string} />
        </div>
        <div>
          <Label>Media</Label>
          <MediaInput />
          <ErrorMessage error={form?.formState?.errors?.title?.message as string} />
        </div>
      </div>
    </BgWrapper>
  );
};

export default BasicDetails;
