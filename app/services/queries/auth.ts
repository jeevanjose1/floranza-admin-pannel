import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "~/lib/utils";
import type { COMMON_LIST_PAYLOAD, LOGIN_PAYLOAD } from "~/shared/types";
import { AUTH } from "~/shared/urls";

const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LOGIN_PAYLOAD) =>
      fetcher({
        url: AUTH.LOGIN,
        type: "post",
        data: payload,
        authenticated: false,
      }),
  });
};
const useLogout = () => {
  return useMutation({
    mutationFn: () =>
      fetcher({
        url: `${AUTH.LOGOUT}`,
        type: "post",
      }),
    onSuccess: (data) => data,
    onError: (error) => error,
  });
};

const useGetProfile = () => {
  return useQuery({
    queryKey: ["PROFILE"],
    queryFn: () =>
      fetcher({
        url: `${AUTH.PROFILE}`,
        type: "get",
      }),
      refetchOnMount:false,
      refetchOnWindowFocus:false
  });
};
const useUpdateProfile = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${AUTH.UPDATE_USER}`,
        type: "post",
        data: payload,
      }),
    onSuccess: (data) => {
      query.invalidateQueries({ queryKey: ["PROFILE"] });

      return data;
    },
    onError: (error) => error,
  });
};
export { useLogin, useLogout, useUpdateProfile, useGetProfile };
