import { Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'

type Props = {className?:string}

export default function Loader({className}: Props) {
  return (
    <Loader2 className={cn('animate-spin',className)}/>
  )
}