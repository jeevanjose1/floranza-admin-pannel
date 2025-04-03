import  { type ReactNode } from 'react'

type Props = {
    title:string,
    children?:ReactNode
}

export default function PageHeader({children,title}: Props) {
  return (
    <div className='flex items-center gap-4 justify-between w-full py-4'>
         <h1 className='font-semibold text-foreground'>{title}</h1>
         {children}
    </div>
  )
}