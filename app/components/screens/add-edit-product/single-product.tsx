import { Controller, type Control,type UseFormReturn } from 'react-hook-form';
import ErrorMessage from '~/components/ui/error-message';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

type Props = { form :UseFormReturn<any>};

export default function SingleProduct({form}: Props) {
  return (
    <div className='w-full'>
   
      <div className="flex w-full items-center gap-3">
        <div className='w-full'>
          <Label>Regular Price	
          </Label>
          <Controller
            control={form?.control}
            name="catogery"
            render={({ field }) => {
              return <Input type="text" className='w-full' placeholder="0.0" />;
            }}
          />
          <ErrorMessage error={""} />
        </div>
        <div className='w-full'>
          <Label>Sale price</Label>
          <Controller
            control={form?.control}
            name="catogery"
            render={({ field }) => {
              return <Input type="text" className='w-full' placeholder="0.0" />;
            }}
          />
          <ErrorMessage error={""} />
        </div>
        <div className='w-full'>
          <Label>Quandity</Label>
          <Controller
            control={form?.control}
            name="catogery"
            render={({ field }) => {
              return <Input type="text" className='w-full' placeholder="0" />;
            }}
          />
          <ErrorMessage error={""} />
        </div>
      </div>
      {/* <div className="flex mt-3 mb-4 items-center gap-2">
        <Checkbox id="terms" />
        <label htmlFor="terms" className="text-[13px] ">
          Charge tax on this product
        </label>
      </div>

      <div>
        <Label>Tax class</Label>
        <Controller
          control={control}
          name="catogery"
          render={({ field }) => {
            return (
              <Select>
                <SelectTrigger size="sm" className=" w-47 rounded-sm py-0">
                  <SelectValue placeholder="Tax class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="image">Standred</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="reduze">Reduce rate</SelectItem>
                    <SelectItem value="zero">Zero rate</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
          }}
        />
        <ErrorMessage error={""} />
      </div> */}

      
    </div>
  )
}