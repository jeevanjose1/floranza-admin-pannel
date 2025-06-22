export enum ORDER {
  ORDER_MENU = "order/nav_menus",
  ORDER_LIST = "orders/list",
  ORDER_VIEW = "order/view",
  ADDRESS_CHANGE = "order/updateAddress",
  INVOICE_SINGLE = "order/invoiceSingleDownload",
  INVOICE_BULK = "order/invoiceBulkDownload",
  SINGLE_STATUS_CHANGE = 'order/singleStatusUpdate',
  BULK_STATUS_CHANGE = 'order/bulkStatusUpdate',
  ADD_ORDER = 'reserved_order/create',
  PAID_STATUS = 'reserved_order/pay_status',
  DELETE_ORDER = 'reserved_order/delete',
  ORDER_NOTES_CREATE = 'order/admin_order_note/create',
  ORDER_NOTES_DELETE = 'order/admin_order_note/delete',
  ORDER_ITEM_DELETE='order/item_delete',
  ADD_ORDER_ITEMS='order/product/change'
}
