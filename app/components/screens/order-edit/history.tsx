import { HistoryIcon } from 'lucide-react'
import React from 'react'
import BgWrapper from '~/components/common/bg-wrapper'
import { ScrollArea } from '~/components/ui/scroll-area'

type Props = { data: any }
type HistoryCard = {
    data: any
}
const HistroryCard = ({ data }: HistoryCard) => {
    return <div className='w-full p-3 rounded-lg flex not-last:mb-3 gap-3  bg-muted/30'>
        <div className='max-w-7 bg-muted/60 max-h-7 p-1 rounded-full flex items-center justify-center'>
            <HistoryIcon size={16} />
        </div>
        <div>
            <p className='text-xs text-muted-foreground/70'>{data?.created_at}</p>
            <p className='text-[13px] mb-1'>{data?.activity}</p>
            <p className='text-xs text-muted-foreground/70'>{data?.admin_name}</p>

        </div>
    </div>
}
export default function History({ data }: Props) {

    return (
        <BgWrapper title="Order History">
            <ScrollArea className='max-h-100 overflow-y-auto p-4 flex flex-col gap-3'>
                {
                    data?.map((item: any) => {
                        return <HistroryCard key={item?.created_at} data={item} />
                    })
                }

            </ScrollArea>
        </BgWrapper>
    )
} 