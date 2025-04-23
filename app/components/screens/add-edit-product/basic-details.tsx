import { Controller, type UseFormReturn } from "react-hook-form";
import BgWrapper from "~/components/common/bg-wrapper";
import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import MediaInput from "~/components/ui/media-input";
import LexicalEditor from "~/components/ui/editor";
import AsyncSelectCustom from "~/components/ui/async-select";
import { fetcher, queryFilter } from "~/lib/utils";
import { BRAND } from "~/shared/urls";

type Props = { form: UseFormReturn<any> };

const promiseOptions = async (inputValue: string) => {
  try {
    const response = await fetcher({
      url: `${BRAND.LIST}${queryFilter({ page: 1 })}`,
      type: "get",
    });

    return response?.data?.data?.map((item: any) => ({
      value: item?.id,
      label: `${item?.name} - ${item?.hsn_code}`,
    }));
  } catch (error) {
    return [];
  }
};
const BasicDetails = ({ form }: Props) => {
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

          <ErrorMessage
            error={form?.formState?.errors?.title?.message as string}
          />
        </div>
        <div className="mb-5">
          <Controller
            control={form?.control}
            name="slug"
            render={({ field }) => {
              return (
                <div className=" flex items-center text-foreground/70  text-[13px] ">
                  <p>http://localhost:5173/products/</p>
                  <Input
                    className="ring-0 border-0 px-0 focus-visible:ring-0  md:text-[13px] underline"
                    {...field}
                    type="text"
                    placeholder="Url"
                  />
                </div>
              );
            }}
          />
          <ErrorMessage
            error={form?.formState?.errors?.slug?.message as string}
          />
        </div>
        <div className="mb-5">
          <Label>Description</Label>
          <Controller
            control={form?.control}
            name="description"
            render={({ field }) => (
              <LexicalEditor onContentChange={(e) => field.onChange(e)} />
            )}
          />
          <ErrorMessage
            error={form?.formState?.errors?.description?.message as string}
          />
        </div>
        <div className="mb-5">
          <Label>Media</Label>
          <MediaInput form={form} />
          <ErrorMessage
            error={form?.formState?.errors?.media?.message as string}
          />
        </div>
        <div className="mb-5">
          <Label>SKU (Stock Keeping Unit)</Label>
          <Controller
            control={form.control}
            name="sku"
            render={({ field }) => {
              return (
                <Input {...field} className="" type="text" placeholder="SKU" />
              );
            }}
          />
          <ErrorMessage
            error={form?.formState?.errors?.sku?.message as string}
          />
        </div>
        <div>
          <Label>HSN</Label>
          <Controller
            control={form.control}
            name="hsn"
            render={({ field }) => (
              <AsyncSelectCustom
                cacheOptions
                onChange={(e: any) => field.onChange(e.value)}
                defaultOptions
                loadOptions={promiseOptions}
              />
            )}
          />

          <ErrorMessage
            error={form?.formState?.errors?.hsn?.message as string}
          />
        </div>
      </div>
    </BgWrapper>
  );
};

export default BasicDetails;
