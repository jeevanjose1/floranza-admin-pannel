import { Controller, type Control, type FormState, type UseFormReturn } from 'react-hook-form';
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
            name="catogery"
            render={({ field }) => {
              return <Input type="text" placeholder="title" />;
            }}
          />
          <ErrorMessage error={""} />
        </div>
        <div className="mb-3">
          <Label>Meta description</Label>
          <Controller
            control={form?.control}
            name="catogery"
            render={({ field }) => {
              return (
                <Textarea
                  className="resize-none"
                  placeholder="Description"
                />
              );
            }}
          />
          <ErrorMessage error={""} />
        </div>

      </div>

    </div>
  </BgWrapper>
  )
}