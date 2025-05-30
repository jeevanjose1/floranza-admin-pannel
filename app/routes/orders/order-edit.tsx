import React from 'react'
import { useParams } from 'react-router'
import BgWrapper from '~/components/common/bg-wrapper'
import GeneralDetails from '~/components/screens/order-edit/general-details'
import OrderDetails from '~/components/screens/order-edit/order-details'
import { useOrderView } from '~/services/queries/order'

type Props = {}

export default function OrderEdit({}: Props) {
    const params = useParams()
    const {data:order_details} = useOrderView(params?.order_id)

  return (
    <div className='flex gap-4 '>
        <div className='flex-1 flex flex-col gap-4'>

       
        <BgWrapper title='General Details'>
            <GeneralDetails data={order_details?.data}/>
        </BgWrapper>
         <BgWrapper title='Order details'>
            <OrderDetails data={order_details?.data}/>
        </BgWrapper>
         </div>
             <div className='flex-[0.3]'>

       
        <BgWrapper title='Customer History'>
            <div className='p-4'>
              <div className='mb-3'>
                <p className='text-[13px] font-semibold mb-1'>Total Order</p>
                <p className='text-sm'>2</p>
              </div>
              <div className='mb-3'>
                <p className='text-[13px] font-semibold mb-1'>Total Revenue</p>
                <p className='text-sm'>₹2,604.00</p>
              </div>
                <div >
                <p className='text-[13px] font-semibold mb-1'>Average Order Value</p>
                <p className='text-sm'>₹1,302.00</p>
              </div>
            </div>
        </BgWrapper>
         </div>
         
    </div>
  )
}