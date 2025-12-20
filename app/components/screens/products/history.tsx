import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import {
    History as His,
    Plus,
    Minus,
    Calendar,
    FileText,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useListHistory } from '~/services/queries/product';
import { useState } from 'react';
import { ScrollArea } from '~/components/ui/scroll-area';
import Loader from '~/components/ui/loader';

type HistoryItem = {
    type: "ADD" | "REMOVE" | "UPDATE";
    note: string;
    qty: number;
    formatted_date: string;
}

type ApiResponse = {
    success: boolean;
    message: string;
    data: {
        sellQty: number;
        count: number;
        data: HistoryItem[];
        current_page: number;
        total: number;
        // ... other pagination fields
    };
}

type Props = {
    product_id: string;
    var_id: string;
    variation?:string
}

export default function History({ product_id, var_id,variation }: Props) {
    const [open, setOpen] = useState(false)
    const [pagination, setPagination] = useState<number>(1)
    const { data: history, isLoading } = useListHistory({
        product_id: product_id,
        filter: {
            prd_var_value_id: var_id,
            page:pagination
        },
        disabled: open 
    })
  
   const handleNext = () => {
    if (history?.data?.next_page_url) {
        setPagination(prev => prev + 1)
    }
}

const handlePrev = () => {
    if (history?.data?.prev_page_url) {
        setPagination(prev => prev - 1)
    }
}
    const handleOpen = () => setOpen(true)

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'ADD':
                return <Plus className="size-4 text-green-600" />;
            case 'SUBTRACT':
                return <Minus className="size-4 text-red-600" />;
            default:
                return <FileText className="size-4 text-blue-600" />;
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'ADD':
                return 'text-green-600 bg-green-50';
            case 'SUBTRACT':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-blue-600 bg-blue-50';
        }
    }

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger onClick={handleOpen} asChild>
                <Button size={'icon'}>
                    <His size={10} className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>History {variation && `(${variation})`}</DialogTitle>

                </DialogHeader>

                {/* Sell Quantity Display */}

                <ScrollArea className='h-96  '>
                    <div className="pb-4 px-4">
                        {history?.data?.sellQty !== undefined && (
                            <div className="bg-blue-50 border border-blue-200  rounded-lg p-3 mb-3 ">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-blue-900">
                                        Total Sold Quantity
                                    </span>
                                    <span className="text-lg font-bold text-blue-900">
                                        {history?.data?.sellQty}
                                    </span>
                                </div>
                            </div>
                        )}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader />
                            </div>
                        ) : history?.data && history.data.data?.length > 0 ? (
                            <div className="space-y-3">
                                {history.data.data?.map((item: HistoryItem, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 rounded-lg border border-muted-foreground/20 bg-card/30"
                                    >
                                        <div className={`p-2 rounded-full ${getTypeColor(item.type)}`}>
                                            {getTypeIcon(item.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-sm">
                                                    {item.type}
                                                </span>
                                                <span className="text-sm font-semibold">
                                                    Qty: {item.qty}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                <Calendar className="size-3" />
                                                <span>{item.formatted_date}</span>
                                            </div>

                                            {item.note && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <FileText className="size-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.note}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                ))}
                                <div className='flex items-end gap-3 justify-end'>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!history?.data?.prev_page_url}
                                        onClick={handlePrev}
                                        className="flex items-center gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNext}
                                        disabled={!history?.data?.next_page_url}
                                        className="flex items-center gap-1"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>

                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <His className="size-12 mx-auto mb-2 opacity-50" />
                                <p>No history found</p>
                            </div>
                        )}

                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}