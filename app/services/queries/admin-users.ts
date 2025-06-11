import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type { COMMON_LIST_PAYLOAD, COMMON_MUTATION, COMMON_PAYLOAD } from "~/shared/types";
import { ADMIN_USERS } from "~/shared/urls";

const useListUser = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["USER_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${ADMIN_USERS.LIST}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};
const useUserDetails = (payload:  COMMON_MUTATION['id']) => {
  return useQuery({
    queryKey: ["USER_DETAILS", payload],
    queryFn: () =>
      fetcher({
        url: `${ADMIN_USERS.SHOW}${payload}`,
        type: "get",
      }),
      enabled:payload ? true :false
  });
};

const useCreateUser = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_PAYLOAD) =>
      fetcher({
        url: ADMIN_USERS.CREATE,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["USER_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useDeleteUser = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION["id"]) =>
      fetcher({
        url: `${ADMIN_USERS.DELETE}${payload}`,
        type: "delete",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["USER_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};
const useUpadteUser = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION) =>
      fetcher({
        url: `${ADMIN_USERS.UPDATE}/${payload?.id}`,
        type: "post",
        data: payload.data,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["USER_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

export {
    useListUser,
    useCreateUser,
    useDeleteUser,
    useUpadteUser,
    useUserDetails
}