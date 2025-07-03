import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type { COMMON_PAYLOAD, MEDIA_PAYLOAD } from "~/shared/types";
import { MEDIA } from "~/shared/urls";

const useListMedia = (payload: MEDIA_PAYLOAD) => {
  return useQuery({
    queryKey: ["MEDIA_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${MEDIA.LIST}${queryFilter(payload)}`,
        type: "get",
      }),
      refetchOnWindowFocus:false
  });
};

const useUploadMedia = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload:COMMON_PAYLOAD) =>
      fetcher({
        url: MEDIA.UPLOAD,
        type: "post",
        data:payload
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["MEDIA_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};

const useDeleteMedia = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload:COMMON_PAYLOAD) =>
      fetcher({
        url: `${MEDIA.DELETE}`,
        type: "post",
        data:payload
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["MEDIA_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};


export {
    useListMedia,
    useDeleteMedia,
    useUploadMedia
}