import { Controller,type UseFormReturn } from 'react-hook-form';
import BgWrapper from '~/components/common/bg-wrapper';
import ErrorMessage from '~/components/ui/error-message';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';

type Props = { form :UseFormReturn<any>};

export default function Seo({ form }: Props) {
  return (
    <BgWrapper>
    <div className="p-4 w-full">
      <h1 className="text-sm font-semibold mb-4">
        Search engine listing
      </h1>
      <div>
        <div className="mb-3">
          <Label>Page title</Label>
          <Controller
            control={form?.control}
            name="page_title"
            render={({ field }) => {
              return <Input {...field} type="text" placeholder="title" />;
            }}
          />
          <ErrorMessage error={form?.formState?.errors?.page_title?.message as string} />
        </div>
        <div className="mb-3">
          <Label>Meta description</Label>
          <Controller
            control={form?.control}
            name="page_description"
            render={({ field }) => {
              return (
                <Textarea
                {...field}
                  className="resize-none"
                  placeholder="Description"
                />
              );
            }}
          />
          <ErrorMessage error={form?.formState?.errors?.page_description?.message as string} />
          </div>

      </div>

    </div>
  </BgWrapper>
  )
}