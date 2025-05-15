import React from 'react'
import { Controller, type UseFormReturn } from 'react-hook-form';
import BgWrapper from '~/components/common/bg-wrapper'
import ErrorMessage from '~/components/ui/error-message';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import Inventory from './inventory';

type Props = { form: UseFormReturn<any> };

export default function Advance({ form }: Props) {
    console.log(form.watch('slug'));
    
    const slug = form.watch('title')?.toLowerCase().replace(/[\s-]+/g, '-');

  return (
    <BgWrapper defaultCollapsed={true} collapsible title='Advance options'>
        <div className="p-4 w-full">

        <div>
        <Label>Slug</Label>

          <Controller
            control={form?.control}
            name="slug"
            render={({ field }) => {
              return (
                <div className=" flex items-center border  rounded-sm text-foreground/70  text-[13px] ">
                  <div className="h-full px-3 mr-3  py-1.5 bg-muted/60">
                  <p className="  h-full">http://localhost:5173/products/</p>
                  </div>
                  <Input
                    className="ring-0 border-0 px-0 focus-visible:ring-0  md:text-[13px] underline"
                    {...field}
                    value={field.value || slug}
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
                 <Inventory control={form?.control} formState={form?.formState} />
     
      </div>
    </BgWrapper>
  )
}