import { useQuery } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type { COMMON_LIST_PAYLOAD } from "~/shared/types";
import { DASHBOARD } from "~/shared/urls/dashboard";

const useGetDashboard = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["DASHBOARD", payload],
    queryFn: () =>
      fetcher({
        url: `${DASHBOARD.DETAILS}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};
const useGetProductDetails = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["DASHBOARD", payload],
    queryFn: () =>
      fetcher({
        url: `${DASHBOARD.PRODUCT_DETAILS}/${payload.id}${queryFilter(payload.filter)}`,
        type: "get",
      }),
      enabled:payload.disabled
  });
};

export {
    useGetDashboard,
    useGetProductDetails
}