import { useQuery, } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type { COMMON_LIST_PAYLOAD } from "~/shared/types";
import { CUSTOMER } from "~/shared/urls";

const useListCustomer = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["CUSTOMER_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${CUSTOMER.LIST}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};
const useCustomerOrderList = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["CUSTOMER_ORDER_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${CUSTOMER.ORDER_LIST}/${payload?.id}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};

const useCustomerExportAll = () => {
  return (payload: any) => {
    const baseUrl = import.meta.env.VITE_BASE_URL || "";
    const url = `${baseUrl}${CUSTOMER.EXPORT_ALL}${queryFilter(payload)}`;
    window.open(url, "_blank");
  };
};

const useCustomerExportGuest = () => {
  return (payload: any) => {
    const baseUrl = import.meta.env.VITE_BASE_URL || "";
    const url = `${baseUrl}${CUSTOMER.EXPORT_GUEST}${queryFilter(payload)}`;
    window.open(url, "_blank");
  };
};

export {
  useListCustomer,
  useCustomerOrderList,
  useCustomerExportAll,
  useCustomerExportGuest
};