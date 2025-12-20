import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { TransactionTable } from "~/components/screens/transaction/transaction-table";
import TransactionTableHeader from "~/components/screens/transaction/transaction-table-header";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useTransactionList } from "~/services/queries/order";
export const clientLoader = ()=> permission_loader('transactions:view')

export default function Transaction() {
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();
  const {
    data: transaction_list,
    isFetching,
    isLoading,
  } = useTransactionList({
    page: query_params.page,
    keyword: query_params.search,
    start_date: query_params?.from,
    end_date: query_params?.to,
  });
  const filtred_data =
    transaction_list?.data?.data?.map((item: any) => {
      return {
        id: item?.id,
        order_id: item?.order_no,
        payment_menthod: item?.pg_pay_method,
        payment: item?.pg,
        payment_id: item?.pg_paymnet_id,
        payment_fee: item?.pg_fee,
        phone: item?.phone ? item?.phone : "-",
        amount: item?.amount,
        is_refund: item?.is_refund,
        status: item?.status === 1 ? "Available" : "Unavailable",
        date: item?.created_at,
      };
    }) || [];

  return (
    <div>
      <PageHeader title="Transaction History" />
      <BgWrapper>
        <TransactionTableHeader />
        <TransactionTable
         is_next={transaction_list?.data?.next_page_url}
          current_page={transaction_list?.data?.current_page}
          is_previous={transaction_list?.data?.prev_page_url}
          loading={isFetching || isLoading}
          table_data={filtred_data}
          total_page={Math.ceil(transaction_list?.data?.total / transaction_list?.data?.per_page)}

        />
      </BgWrapper>
    </div>
  );
}
