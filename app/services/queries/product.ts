import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type { COMMON_LIST_PAYLOAD } from "~/shared/types";
import { PRODUCT } from "~/shared/urls";

const useListProduct = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["PRODUCT_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${PRODUCT.LIST}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};

const useSingleProduct = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["PRODUCT_DETAILS", payload],
    queryFn: () =>
      fetcher({
        url: `${PRODUCT.SINGLE_PRODUCT}${payload}`,
        type: "get",
      }),
    enabled: payload ? true : false,
  });
};

const useDeleteProduct = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${PRODUCT.DELETE}${payload}`,
        type: "delete",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["PRODUCT_LIST"] });
      query.invalidateQueries({ queryKey: ["PRODUCT_DETAILS"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useCreateProduct = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: PRODUCT.CREATE,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["PRODUCT_LIST"] });
      query.invalidateQueries({ queryKey: ["PRODUCT_DETAILS"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useUpdateProduct = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${PRODUCT.UPDATE}${payload?.id}`,
        type: "post",
        data: payload.data,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["PRODUCT_LIST"] });
      query.invalidateQueries({ queryKey: ["PRODUCT_DETAILS"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useDuplicateProduct = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${PRODUCT.DUPLICATE}${payload}`,
        type: "get",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["PRODUCT_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useSearchProduct = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${PRODUCT.SEARCH_PRODUCT}/${queryFilter(payload)}`,
        type: "get",
      }),
    onSuccess: (response) => {
      return response;
    },
    onError: (error) => error,
  });
};

export {
  useCreateProduct,
  useListProduct,
  useSingleProduct,
  useDeleteProduct,
  useUpdateProduct,
  useDuplicateProduct,
  useSearchProduct,
};
