import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type {
  COMMON_LIST_PAYLOAD,
  COMMON_PAYLOAD,
  COMMON_MUTATION,
} from "~/shared/types";
import { ATTRIBUTE, BRAND } from "~/shared/urls";

const useListAttribute = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["ATTRIBUTE_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${ATTRIBUTE.LIST}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};
const useAttributeDetails = (payload: COMMON_MUTATION["id"]) => {
  return useQuery({
    queryKey: ["ATTRIBUTE_DETAILS", payload],
    queryFn: () =>
      fetcher({
        url: `${ATTRIBUTE.SHOW}${payload}`,
        type: "get",
      }),
    enabled: payload ? true : false,
  });
};
const useCreateAttribute = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: ATTRIBUTE.CREATE,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ATTRIBUTE_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useDeleteAttribute = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION["id"]) =>
      fetcher({
        url: `${ATTRIBUTE.DELETE}${payload}`,
        type: "delete",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ATTRIBUTE_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useDeleteAttributeItem = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: number) =>
      fetcher({
        url: `${ATTRIBUTE.DELETE_ITEM}${payload}`,
        type: "delete",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ATTRIBUTE_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useUpadteAttribute = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${ATTRIBUTE.UPDATE}${payload?.id}`,
        type: "post",
        data: payload.data,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ATTRIBUTE_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useUpadtePositionAttribute = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${ATTRIBUTE.UPDATE_POSITION_ATTRIBUTE}`,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ATTRIBUTE_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useUpadtePositionValue = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${ATTRIBUTE.UPDATE_POSITION_VALUE}`,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ATTRIBUTE_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

export {
  useCreateAttribute,
  useListAttribute,
  useDeleteAttribute,
  useUpadteAttribute,
  useAttributeDetails,
  useDeleteAttributeItem,
  useUpadtePositionAttribute,
  useUpadtePositionValue,
};
