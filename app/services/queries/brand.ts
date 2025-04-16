import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type { COMMON_LIST_PAYLOAD, COMMON_PAYLOAD,COMMON_MUTATION } from "~/shared/types";
import { BRAND } from "~/shared/urls";

const useListBrand = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["BRAND_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${BRAND.LIST}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};
const useBrandDetails = (payload:  COMMON_MUTATION['id']) => {
  return useQuery({
    queryKey: ["BRAND_DETAILS", payload],
    queryFn: () =>
      fetcher({
        url: `${BRAND.SHOW}${payload}`,
        type: "get",
      }),
      enabled:payload ? true :false
  });
};
const useCreateBrand = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_PAYLOAD) =>
      fetcher({
        url: BRAND.CREATE,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["BRAND_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useDeleteBrand = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION["id"]) =>
      fetcher({
        url: `${BRAND.DELETE}${payload}`,
        type: "delete",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["BRAND_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};
const useUpadteBrand = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION) =>
      fetcher({
        url: `${BRAND.UPDATE}${payload?.id}`,
        type: "post",
        data: payload.data,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["BRAND_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

export {
  useCreateBrand,
  useListBrand,
  useDeleteBrand,
  useUpadteBrand,
  useBrandDetails
};
