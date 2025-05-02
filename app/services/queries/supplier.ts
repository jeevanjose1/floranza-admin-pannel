import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type {
  COMMON_LIST_PAYLOAD,
  COMMON_PAYLOAD,
  COMMON_MUTATION,
} from "~/shared/types";
import { SUPPLIER } from "~/shared/urls/supplier";

const useListSupplier = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["SUPPLIER_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${SUPPLIER.LIST}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};
const useSupplierDetails = (payload: COMMON_MUTATION["id"]) => {
  return useQuery({
    queryKey: ["SUPPLIER_DETAILS", payload],
    queryFn: () =>
      fetcher({
        url: `${SUPPLIER.SHOW}${payload}`,
        type: "get",
      }),
    enabled: payload ? true : false,
  });
};
const useCreateSupplier = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_PAYLOAD) =>
      fetcher({
        url: SUPPLIER.CREATE,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["SUPPLIER_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useDeleteSupplier = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION["id"]) =>
      fetcher({
        url: `${SUPPLIER.DELETE}${payload}`,
        type: "delete",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["SUPPLIER_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};
const useUpadteSupplier = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION) =>
      fetcher({
        url: `${SUPPLIER.UPDATE}${payload?.id}`,
        type: "post",
        data: payload.data,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["SUPPLIER_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

export {
  useListSupplier,
  useCreateSupplier,
  useDeleteSupplier,
  useUpadteSupplier,
  useSupplierDetails,
};
