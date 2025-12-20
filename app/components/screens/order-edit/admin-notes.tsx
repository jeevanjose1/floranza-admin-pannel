import { CalendarClock, FileWarning, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import BgWrapper from '~/components/common/bg-wrapper'
import { Button } from '~/components/ui/button'
import Loader from '~/components/ui/loader'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Textarea } from '~/components/ui/textarea'
import { useAddOrderNote, useOrderNoteDelete } from '~/services/queries/order'

type Props = { data: any }
type NoteCardProp = { data: any }

const NoteCard = ({ data }: NoteCardProp) => {
    const { mutateAsync: remove, isPending: deletePending } = useOrderNoteDelete()
    const handleRemove = (id: string) => {
        remove(id, {
            onSuccess: () => {
                toast.success('Note deleted')
            }, onError: (error:any) => {
                          toast.error(error.data?.message);

            }
        })
    }
    return <div className='bg-muted/30 p-3 pt-5 relative not-last:mb-2 rounded-b-md rounded-tr-md'>
        <Button disabled={deletePending} onClick={() => handleRemove(data?.id)} size={'icon'} className='rounded-full w-4 h-4 absolute top-1 right-1' variant={'destructive'}>{deletePending ? <Loader /> : <X />}</Button>
        <div>
            <div className='flex items-center gap-2 text-xs font-semibold mb-2'>
                <CalendarClock className='size-4' />
                <p>{data?.date}</p>
            </div>
        <p className='text-[13px] whitespace-pre-wrap break-all'>{data?.note}</p>

        </div>
    </div>
}

export default function AdminNotes({ data }: Props) {
    const { mutateAsync: add, isPending: addPending } = useAddOrderNote()

    const [notes, setNotes] = useState('')
    const handleChange = (e: string) => {
        setNotes(e)
    }

    const handleAddNote = () => {
        const form_data = new FormData()
        form_data.append('note', notes)
        add({ id: data?.id, data: form_data }, {
            onSuccess: () => {
                toast.success('Note added')
                setNotes('')
            },
            onError: (error:any) => {
            toast.error(error.data?.message);
            }
        })
    }


    return (
        <BgWrapper title="Notes">
            <div className='p-3'>
                <ScrollArea className='mb-3 max-h-100 overflow-y-auto'>
                    {Boolean(data?.admin_order_note?.length) ?
                        data?.admin_order_note?.map((item: any) => {
                            return <NoteCard key={item?.id} data={item} />
                        }) : <div className='flex justify-center flex-col items-center'>
                            <FileWarning />
                            <p className='text-[13px]'>
                                Please add note

                            </p>
                        </div>
                    }
                </ScrollArea>
                <div className='flex flex-col justify-end items-end gap-3'>
                    <Textarea
                        value={notes}
                        onChange={(e) => handleChange(e.target.value)}
                        className='field-sizing-content resize-none text-[13px] placeholder:text-[13px] break-all'
                        placeholder='Type your note' />
                    <Button disabled={notes === ''} onClick={handleAddNote} loading={addPending} size={'sm'}>Add</Button>
                </div>
            </div>
        </BgWrapper>
    )
}