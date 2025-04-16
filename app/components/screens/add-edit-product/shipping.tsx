import React from 'react'
import { Controller, type Control, type FormState } from 'react-hook-form';
import BgWrapper from '~/components/common/bg-wrapper';
import { Checkbox } from '~/components/ui/checkbox';
import { Combobox } from '~/components/ui/combo-box';
import ErrorMessage from '~/components/ui/error-message';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';

type Props = {control:Control<any>,formState:FormState<any>}

export default function Shipping({control,formState}: Props) {
  return (
    <div className=" w-full mt-4">
      <div className="  mb-4">
        <div>
          <Label>Weight (Kg)</Label>
          <Controller
            control={control}
            name="catogery"
            render={({ field }) => {
              return <Input type="text" placeholder="0" />;
            }}
          />
          <ErrorMessage error={""} />
        </div>
        
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <Label>Dimensions (cm)</Label>
          <Controller
            control={control}
            name="catogery"
            render={({ field }) => {
              return <Input type="text" placeholder="0.0" />;
            }}
          />
          <ErrorMessage error={""} />
        </div>
        <div className="mt-auto">
          <Controller
            control={control}
            name="catogery"
            render={({ field }) => {
              return <Input type="text" placeholder="0" />;
            }}
          />
          <ErrorMessage error={""} />
        </div>
        <div className="mt-auto">
          <Controller
            control={control}
            name="catogery"
            render={({ field }) => {
              return <Input type="text" placeholder="0" />;
            }}
          />
          <ErrorMessage error={""} />
        </div>
      </div>
     
    </div>
  )
}