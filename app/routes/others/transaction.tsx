import React from "react";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { TransactionTable } from "~/components/screens/transaction/transaction-table";
import TransactionTableHeader from "~/components/screens/transaction/transaction-table-header";
import { useTransactionList } from "~/services/queries/order";

type Props = {};

export default function Transaction({}: Props) {
  const {
    data: transaction_list,
    isFetching,
    isLoading,
  } = useTransactionList({});
  console.log(transaction_list);
  const filtred_data = transaction_list?.data?.map((item: any) => {
    return {
      id: item?.id,
      order_id: item?.order_no,
      payment_menthod: item?.pg_pay_method,
      payment: item?.pg,
      payment_id: item?.pg_paymnet_id,
      payment_fee: item?.pg_fee,
      phone: item?.phone ? item?.phone :'-',
      amount: item?.amount,
      is_refund: item?.is_refund,
      status: item?.status ===1 ? 'Available' : 'Unavailable',
      date: item?.created_at,
    };
  })||[]

  return (
    <div>
      <PageHeader title="Transaction History" />
      <BgWrapper>
        <TransactionTableHeader />
        <TransactionTable loading={isFetching || isLoading} table_data={filtred_data} />
      </BgWrapper>
    </div>
  );
}
