import { Controller, type UseFormReturn } from 'react-hook-form';
import BgWrapper from '~/components/common/bg-wrapper';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useListChartInProduct } from '~/services/queries/size-chart';

type Props = { form: UseFormReturn<any> };

export default function SelectSizeChart({ form }: Props) {
  const { data: size_chart } = useListChartInProduct()
  const size_chart_data = size_chart?.data || []


  return (
    <BgWrapper>
      <div className="p-4 w-full">
        <h1 className="text-sm font-semibold mb-2">Select Size Chart</h1>
        <div>
          <div className="w-full flex items-center gap-4 mt-3 mb-3">
            <Controller
              control={form?.control}
              name="size_chart"
              render={({ field }) => {
                return (
                  <div className="w-full">

                    <Label htmlFor="size_chart" className="text-[13px] mb-0">
                      Size Chart
                    </Label>
                    <Select value={field.value} onValueChange={(e) => field.onChange(e)}>
                      <SelectTrigger
                        size="sm"
                        className="max-w-63 w-full truncate rounded-sm py-0"
                      >
                        <SelectValue placeholder="Size chart" className=' truncate' />
                      </SelectTrigger>
                      <SelectContent className='max-w-44'>
                        <SelectGroup>
                          {
                            size_chart_data?.map((item: any) => {
                              return <SelectItem className='break-all max-w-44 ' key={item?.id} value={item.id}>{item?.name}</SelectItem>

                            })
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                );
              }}
            />
          </div>

        </div>
      </div>
    </BgWrapper>
  );
}