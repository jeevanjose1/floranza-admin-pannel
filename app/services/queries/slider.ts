import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type { COMMON_LIST_PAYLOAD, COMMON_PAYLOAD,COMMON_MUTATION } from "~/shared/types";
import { BRAND, SLIDER } from "~/shared/urls";

const useListSlider = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["SLIDER_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${SLIDER.LIST}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};
const useSliderDetails = (payload:  COMMON_MUTATION['id']) => {
  return useQuery({
    queryKey: ["SLIDER_DETAILS", payload],
    queryFn: () =>
      fetcher({
        url: `${SLIDER.SHOW}${payload}`,
        type: "get",
      }),
      enabled:payload ? true :false
  });
};
const useCreateSlider = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_PAYLOAD) =>
      fetcher({
        url: SLIDER.CREATE,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["SLIDER_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useDeleteSlider = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION["id"]) =>
      fetcher({
        url: `${SLIDER.DELETE}${payload}`,
        type: "delete",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["SLIDER_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};
const useUpadteSlider = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION) =>
      fetcher({
        url: `${SLIDER.UPDATE}${payload?.id}`,
        type: "post",
        data: payload.data,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["SLIDER_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

export {
  useCreateSlider,
  useListSlider,
  useDeleteSlider,
  useUpadteSlider,
  useSliderDetails
};
