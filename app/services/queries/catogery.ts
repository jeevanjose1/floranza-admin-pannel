import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type { COMMON_LIST_PAYLOAD, COMMON_PAYLOAD,COMMON_MUTATION } from "~/shared/types";
import { CATOGERY } from "~/shared/urls";

const useListCatogery = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["CATOGERY_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${CATOGERY.LIST}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};
const useListCatogeryProduct = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["CATOGERY_LIST_PRODUCT", payload],
    queryFn: () =>
      fetcher({
        url: `${CATOGERY.LIST_IN_PRODUCT}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};
const useCatogeryDetails = (payload: COMMON_MUTATION['id']) => {
  return useQuery({
    queryKey: ["CATOGERY_DETAILS", payload],
    queryFn: () =>
      fetcher({
        url: `${CATOGERY.SHOW}${payload}`,
        type: "get",
      }),
      enabled:payload?true:false
  });
};
const useCreateCatogery = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_PAYLOAD) =>
      fetcher({
        url: CATOGERY.CREATE,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["CATOGERY_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useDeleteCatogery = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION["id"]) =>
      fetcher({
        url: `${CATOGERY.DELETE}${payload}`,
        type: "delete",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["CATOGERY_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};
const useUpadteCatogery = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION) =>
      fetcher({
        url: `${CATOGERY.UPDATE}${payload?.id}`,
        type: "post",
        data: payload.data,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["CATOGERY_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

export {
  useCreateCatogery,
  useListCatogery,
  useDeleteCatogery,
  useUpadteCatogery,
  useCatogeryDetails,
  useListCatogeryProduct
};
