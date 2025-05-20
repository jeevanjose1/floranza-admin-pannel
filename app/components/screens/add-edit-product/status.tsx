import { Controller, type Control, type FormState, type UseFormReturn } from 'react-hook-form';
import BgWrapper from '~/components/common/bg-wrapper';
import ErrorMessage from '~/components/ui/error-message';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

type Props = { form :UseFormReturn<any>};

export default function Status({ form }: Props) {
  return (
    <BgWrapper>
            <div className="p-4 w-full">
              <h1 className="text-sm font-semibold mb-2">Status</h1>
              <div>
                <Controller
                  control={form?.control}
                  name="status"
                  render={({ field }) => {
                    return (
                      <Select value={field.value} onValueChange={(e)=>field.onChange(e)}>
                        <SelectTrigger
                          size="sm"
                          className="w-full rounded-sm py-0"
                        >
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="1">Published</SelectItem>
                            <SelectItem value="0">Unpublished</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                <ErrorMessage error={""} />
              </div>
            </div>
          </BgWrapper>
  )
}