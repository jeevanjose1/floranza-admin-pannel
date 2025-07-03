import BgWrapper from "~/components/common/bg-wrapper";

type Props = {
    data: {
        chg_wallet_amount?: number;
        chg_pay_amount?: number;
    };
};

export default function Wallet({ data }: Props) {
    return (
        <BgWrapper title="Credit Summary">
            <div className="p-4 flex flex-col gap-3">
                <div className="bg-muted/30 rounded-md p-4 ">
                    <p className="text-sm text-muted-foreground/80">Current Credit</p>
                    <p className="text-xl text-green-600 font-semibold  mt-1">
                        ₹
                        {data?.chg_wallet_amount ?? 0}
                    </p>
                </div>

                <div className="bg-muted/30 rounded-md p-4 ">
                    <p className="text-sm text-muted-foreground/80">Payable Amount</p>
                    <p className="text-xl font-semibold  mt-1">
                        ₹
                        {data?.chg_pay_amount ?? 0}
                    </p>
                </div>
            </div>
        </BgWrapper>
    );
}
