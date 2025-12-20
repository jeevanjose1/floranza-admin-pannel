import { useState, type ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import SelectProduct from './select-product'

type Props = {children:ReactNode,current_item:any[]}

export default function AddOrderItems({children,current_item}: Props) {
  const [open,setOpen] = useState(false)
  return (
   <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger onClick={()=>setOpen(true)} asChild>{children}</DialogTrigger>
  <DialogContent className="sm:max-w-2xl">
    <DialogHeader>
      <DialogTitle>Add Items</DialogTitle>

    </DialogHeader>
     <div className="w-full px-4 py-2">
        <SelectProduct setOpen={setOpen} current_item={current_item}/>
     </div>
  </DialogContent>
</Dialog>
  )
}