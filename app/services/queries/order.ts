import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type {
  COMMON_LIST_PAYLOAD,
  COMMON_MUTATION,
} from "~/shared/types";
import { COMMON } from "~/shared/urls/common";
import { ORDER } from "~/shared/urls/order";

const useOrderList = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["ORDER_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${ORDER.ORDER_LIST}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};
const useTransactionList = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["TRANSACTION_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${COMMON.TRANSACTION}`,
        type: "get",
      }),
  });
};
const useOrderView = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["ORDER_VIEW", payload],
    queryFn: () =>
      fetcher({
        url: `${ORDER.ORDER_VIEW}/${payload}`,
        type: "get",
      }),
  });
};

const useOrderMenuList = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["MENU_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${ORDER.ORDER_MENU}`,
        type: "get",
      }),
  });
};

const useChangeAddress = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION) =>
      fetcher({
        url: `${ORDER.ADDRESS_CHANGE}/${payload?.id}`,
        type: "post",
        data: payload.data,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ORDER_VIEW"] });
      return response;
    },
    onError: (error) => {
      return error;
    },
  });
};

const useSingleInvoice = () => {
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION) =>
      fetcher({
        url: `${ORDER.INVOICE_SINGLE}/${payload?.id}`,
        type: "get",
        rest: {
          responseType: "arraybuffer",
        },
      }),
    onSuccess: (response) => {
      return response;
    },
    onError: (error) => {
      return error;
    },
  });
};

const useBulkInvoice = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${ORDER.INVOICE_BULK}`,

        type: "post",
        data: payload,
        rest: {
          responseType: "arraybuffer",
        },
      }),
    onSuccess: (response) => {
      return response;
    },
    onError: (error) => {
      return error;
    },
    
  });
};

const useBulkStatus = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${ORDER.BULK_STATUS_CHANGE}`,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ORDER_VIEW"] });
      query.invalidateQueries({ queryKey: ["ORDER_LIST"] });
      return response;
    },
    onError: (error) => {
      return error;
    },
  });
};

const useSingleStatus = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: COMMON_MUTATION) =>
      fetcher({
        url: `${ORDER.SINGLE_STATUS_CHANGE}/${payload?.id}`,
        type: "post",
        data:payload?.data
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ORDER_LIST"] });
      query.invalidateQueries({ queryKey: ["ORDER_VIEW"] });
      return response;
    },
    onError: (error) => {
      return error;
    },
  });
};

const useAddOrder = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${ORDER.ADD_ORDER}`,
        type: "post",
        data:payload
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ORDER_LIST"] });
      query.invalidateQueries({ queryKey: ["ORDER_VIEW"] });
      return response;
    },
    onError: (error) => {
      return error;
    },
  });
};

const usePaymentStatus = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${ORDER.PAID_STATUS}/${payload.id}`,
        type: "post",
        data:payload.data
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ORDER_LIST"] });
      query.invalidateQueries({ queryKey: ["ORDER_VIEW"] });
      return response;
    },
    onError: (error) => {
      return error;
    },
  });
};

const useDeleteOrder = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${ORDER.DELETE_ORDER}/${payload}`,
        type: "get",
        
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ORDER_LIST"] });
      query.invalidateQueries({ queryKey: ["ORDER_VIEW"] });
      return response;
    },
    onError: (error) => {
      return error;
    },
  });
};

const useAddOrderNote = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${ORDER.ORDER_NOTES_CREATE}/${payload.id}`,
        type: "post",
        data:payload.data
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ORDER_LIST"] });
      query.invalidateQueries({ queryKey: ["ORDER_VIEW"] });
      return response;
    },
    onError: (error) => {
      return error;
    },
  });
};

const useOrderNoteDelete = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${ORDER.ORDER_NOTES_DELETE}/${payload}`,
        type: "delete",
        
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["ORDER_LIST"] });
      query.invalidateQueries({ queryKey: ["ORDER_VIEW"] });
      return response;
    },
    onError: (error) => {
      return error;
    },
  });
};
export {
  useOrderList,
  useOrderMenuList,
  useOrderView,
  useBulkInvoice,
  useChangeAddress,
  useSingleInvoice,
  useBulkStatus,
  useSingleStatus,
  useAddOrder,
  usePaymentStatus,
  useDeleteOrder,
  useTransactionList,
  useOrderNoteDelete,
  useAddOrderNote
};
