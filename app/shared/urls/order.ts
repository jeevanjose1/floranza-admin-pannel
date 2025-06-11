export enum ORDER {
  ORDER_MENU = "order/nav_menus",
  ORDER_LIST = "orders/list",
  ORDER_VIEW = "order/view",
  ADDRESS_CHANGE = "order/updateAddress",
  INVOICE_SINGLE = "order/invoiceSingleDownload",
  INVOICE_BULK = "order/invoiceBulkDownload",
  SINGLE_STATUS_CHANGE='order/singleStatusUpdate',
  BULK_STATUS_CHANGE='order/bulkStatusUpdate',
  ADD_ORDER='reserved_order/create',
  PAID_STATUS='reserved_order/pay_status',
  DELETE_ORDER='reserved_order/delete'
}
