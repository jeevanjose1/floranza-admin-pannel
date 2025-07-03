import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type {
  COMMON_LIST_PAYLOAD,
  COMMON_PAYLOAD,
  COMMON_MUTATION,
} from "~/shared/types";
import { COUPON } from "~/shared/urls";

const useListCoupon = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["COUPON_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${COUPON.LIST}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};
const useCouponDetails = (payload: COMMON_MUTATION["id"]) => {
  return useQuery({
    queryKey: ["COUPON_DETAILS", payload],
    queryFn: () =>
      fetcher({
        url: `${COUPON.SHOW}${payload}`,
        type: "get",
      }),
    enabled: payload ? true : false,
  });
};
const useCreateCoupon = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_PAYLOAD) =>
      fetcher({
        url: COUPON.CREATE,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["COUPON_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useDeleteCoupon = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION["id"]) =>
      fetcher({
        url: `${COUPON.DELETE}${payload}`,
        type: "delete",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["COUPON_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};
const useUpadteCoupon = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION) =>
      fetcher({
        url: `${COUPON.UPDATE}${payload?.id}`,
        type: "post",
        data: payload.data,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["COUPON_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

export {
 useListCoupon,
 useCouponDetails,
 useCreateCoupon,
 useDeleteCoupon,
 useUpadteCoupon
};
