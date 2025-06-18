import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import AdminNotes from "~/components/screens/order-edit/admin-notes";
import GeneralDetails from "~/components/screens/order-edit/general-details";
import History from "~/components/screens/order-edit/history";
import OrderDetails from "~/components/screens/order-edit/order-details";
import { Button } from "~/components/ui/button";
import Loader from "~/components/ui/loader";
import { useOrderView } from "~/services/queries/order";

type Props = {};

export default function OrderEdit({}: Props) {
  const params = useParams();
  const navigate = useNavigate();

  const { data: order_details ,isLoading} = useOrderView(params?.order_id);
 console.log(order_details);
   
   if(isLoading){
    return <div className="w-full h-screen flex items-center justify-center">
      <Loader/>
    </div>
   }
  return (
    <>
    <Button
        onClick={() => navigate(-1)}
        variant={"ghost"}
        className="hover:bg-transparent text-lg has-[>svg]:px-0 mb-3"
      >
        <ArrowLeft />
       Order Details
      </Button>
  
    <div className="flex gap-4 ">
      <div className="flex-1 flex flex-col gap-4">
        <BgWrapper title="General Details">
          <GeneralDetails data={order_details?.data} />
        </BgWrapper>
        <BgWrapper title="Order details">
          <OrderDetails data={order_details?.data} />
        </BgWrapper>
      </div>
      <div className="flex-[0.3] flex flex-col gap-4">
        <BgWrapper title="Customer History">
          <div className="p-4">
            <div className="mb-3">
              <p className="text-[13px] font-semibold mb-1">Total Order</p>
              <p className="text-sm">2</p>
            </div>
            <div className="mb-3">
              <p className="text-[13px] font-semibold mb-1">Total Revenue</p>
              <p className="text-sm">₹2,604.00</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold mb-1">
                Average Order Value
              </p>
              <p className="text-sm">₹1,302.00</p>
            </div>
          </div>
        </BgWrapper>
        <History data={order_details?.data?.orders_logs}/>
        <AdminNotes data={order_details?.data}/>
      </div>
    </div>
      </>
  );
}
