import { useMutation } from "@tanstack/react-query";
import { fetcher } from "~/lib/utils";
import type { LOGIN_PAYLOAD } from "~/shared/types";
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

export { useLogin };
