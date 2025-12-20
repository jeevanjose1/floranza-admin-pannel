import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import BgWrapper from "~/components/common/bg-wrapper";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { useWalletPaid, useWalletRefund } from "~/services/queries/order";

type Props = {
    data: {
        chg_wallet_amount?: string;
        chg_pay_amount?: string;
        id: string
    };
};

export default function Wallet({ data }: Props) {
    const { mutateAsync: refund } = useWalletRefund()
    const { mutateAsync: paid } = useWalletPaid()

    const handleRefund = () => {
        toast.promise(refund(data?.id), {
            loading: 'Refunding',
            success: (response) => {
                return response?.message
            },
            error: (error) => {
                return error?.data?.message
            }
        })
    }

    const handlePaid = () => {
        toast.promise(paid(data?.id), {
            loading: 'Loading',
            success: (response) => {
                return response?.message
            },
            error: (error) => {
                return error?.data?.message
            }
        })
    }

    return (
        <BgWrapper title="Credit Summary">
            <div className="p-4 flex flex-col gap-3">
                <div className="bg-muted/30 rounded-md p-4 ">
                    <div className="w-full flex items-center justify-between">
                        <p className="text-sm text-muted-foreground/80">Current Credit</p>
                        {data?.chg_wallet_amount !== '0.00' && <DropdownMenu >
                            <DropdownMenuTrigger asChild><Button className="w-6 h-8 rounded-sm" variant={'ghost'} size={'icon'}><EllipsisVertical size={14} /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="text-xs text-accent-foreground/50">
                                    Options</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleRefund}>Refund</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>}
                    </div>
                    <p className="text-xl text-green-600 font-semibold  mt-1">
                        ₹
                        {data?.chg_wallet_amount ?? 0}
                    </p>
                </div>

                <div className="bg-muted/30 rounded-md p-4 ">
                    <div className="w-full flex items-center justify-between">
                        <p className="text-sm text-muted-foreground/80">Payable Amount</p>
                        {data?.chg_pay_amount !== '0.00' && <DropdownMenu >
                            <DropdownMenuTrigger asChild><Button className="w-6 h-8 rounded-sm" variant={'ghost'} size={'icon'}><EllipsisVertical size={14} /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="text-xs text-accent-foreground/50">
                                    Options</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handlePaid}>Paid</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>}
                    </div>
                    <p className="text-xl font-semibold  mt-1">
                        ₹
                        {data?.chg_pay_amount ?? 0}
                    </p>
                </div>
            </div>
        </BgWrapper>
    );
}
