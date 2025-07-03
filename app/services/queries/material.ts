import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type { COMMON_LIST_PAYLOAD, COMMON_PAYLOAD,COMMON_MUTATION } from "~/shared/types";
import { MATERIAL } from "~/shared/urls";

const useListMaterial = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["MATERIAL_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${MATERIAL.LIST}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};
const useMaterialDetails = (payload: COMMON_MUTATION['id']) => {
  return useQuery({
    queryKey: ["MATERIAL_DETAILS", payload],
    queryFn: () =>
      fetcher({
        url: `${MATERIAL.SHOW}${payload}`,
        type: "get",
      }),
  });
};
const useCreateMaterial = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_PAYLOAD) =>
      fetcher({
        url: MATERIAL.CREATE,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["MATERIAL_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useDeleteMaterial = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION["id"]) =>
      fetcher({
        url: `${MATERIAL.DELETE}${payload}`,
        type: "delete",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["MATERIAL_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};
const useUpadteMaterial = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION) =>
      fetcher({
        url: `${MATERIAL.UPDATE}${payload?.id}`,
        type: "post",
        data: payload.data,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["MATERIAL_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

export {
  useCreateMaterial,
  useListMaterial,
  useDeleteMaterial,
  useUpadteMaterial,
  useMaterialDetails
};
