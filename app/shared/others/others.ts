export const indianStates = [
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CT", name: "Chhattisgarh" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JK", name: "Jammu and Kashmir" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "LA", name: "Ladakh" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OD", name: "Odisha" },
  { code: "PB", name: "Punjab" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TS", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UK", name: "Uttarakhand" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "WB", name: "West Bengal" },
  { code: "AN", name: "Andaman and Nicobar Islands" },
  { code: "CH", name: "Chandigarh" },
  { code: "DN", name: "Dadra and Nagar Haveli" },
  { code: "DD", name: "Daman and Diu" },
  { code: "DL", name: "Delhi" },
  { code: "LD", name: "Lakshadeep" },
  { code: "PY", name: "Pondicherry (Puducherry)" },
];

export const country = [
  {
    value: "IN",
    label: "INDIA",
  },
];

export const status = [
  { value: "1", label: "Processing" },
  { value: "2", label: "Action Taken" },
  { value: "3", label: "Shipping" },
  { value: "5", label: "Hold" },
  { value: "4", label: "Completed" },
  { value: "7", label: "Canceled" },
  { value: "6", label: "Refund" },
  { value: "8", label: "Failed" },
  { value: "9", label: "Pre-Order" },
  { value: "10", label: "Reserved" },
];

type StatusKey = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
type StatusRule = {
  updates: { value: string; label: string }[];
  invoice: boolean;
};

export const status_filter = (current_status: string) => {
  const rules: Record<StatusKey, StatusRule> = {
    "1": {
      updates: [
        { value: "2", label: "Action Taken" },
        { value: "5", label: "Hold" },
      ],
      invoice: true,
    },
    "2": {
      updates: [
        { value: "1", label: "Processing" },
        { value: "7", label: "Canceled" },
        { value: "5", label: "Hold" },
      ],
      invoice: true,
    },
    "3": {
      updates: [
        // { value: "4", label: "Completed" },
        { value: "7", label: "Canceled" },
        { value: "5", label: "Hold" },
      ],
      invoice: true,
    },

    "4": {
      updates: [{ value: "7", label: "Cancel" },
      ], invoice: true
    },
    "5": {
      updates: [
        { value: "2", label: "Action Taken" },
        { value: "7", label: "Canceled" },
      ],
      invoice: true,
    },
    "6": { updates: [], invoice: true },
    "7": {
      updates: [{ value: "6", label: "Refund" },
      ], invoice: false
    },
    "8": { updates: [], invoice: false },
    "9": {
      updates: [
        { value: "2", label: "Action Taken" },
        { value: "5", label: "Hold" },
        { value: "3", label: "Packing" },

      ],
      invoice: true,
    },
    "10": {
      updates: [
        // { value: "1", label: "Processing" },
        { value: "5", label: "Hold" },
      ],
      invoice: true,
    },
  };

  if (current_status in rules) {
    return rules[current_status as StatusKey];
  }
  return { updates: [], invoice: false };
};

export const status_options = [
  {
    status: "",
    name: "All",
    color: "bg-gray-50 text-gray-500 border-gray-300",
  },
  {
    status: 1,
    name: "Processing",
    color: "bg-blue-50 text-blue-600 border-blue-300",
  },
  {
    status: 2,
    name: "Action Taken",
    color: "bg-cyan-50 text-cyan-600 border-cyan-300",
  },
  {
    status: 3,
    name: "Packing Completed",
    color: "bg-green-50 text-green-600 border-green-300",
  },
  {
    status: 33,
    name: "Shipping",
    color: "bg-purple-50 text-purple-600 border-purple-300",
  },
  {
    status: 4,
    name: "Completed",
    color: "bg-teal-50 text-teal-600 border-teal-300",
  },
  {
    status: 5,
    name: "Hold",
    color: "bg-yellow-50 text-yellow-600 border-yellow-300",
  },
  {
    status: 7,
    name: "Canceled",
    color: "bg-pink-50 text-pink-600 border-pink-300",
  },
  {
    status: 6,
    name: "Refund",
    color: "bg-lime-50 text-lime-600 border-lime-300",
  },
  {
    status: 8,
    name: "Failed",
    color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-300",
  },
  {
    status: 9,
    name: "Pre-Order",
    color: "bg-emerald-50 text-emerald-600 border-emerald-300",
  },
  {
    status: 10,
    name: "Reserved",
    color: "bg-sky-50 text-sky-600 border-sky-300",
  },
];


export const courier = [
  {
    value: "DTDC",
    label: "DTDC",
  },
  {
    value: "INDIA_POST",
    label: "Indian Post",
  },
];

export const calculate_product_price = (item: any, index?: number) => {
  const isVariation = item?.is_variation;

  if (isVariation) {
    const variation = item?.variations?.[index ? index : 0];
    const salePrice = Number(variation?.sale_price) || 0;
    const regPrice = Number(variation?.reg_price) || 0;

    if (regPrice == 0) {
      return {
        min: salePrice,
        max: 0,
      };
    }

    if (regPrice <= salePrice) {
      return {
        min: salePrice,
        max: 0,
      };
    }

    return {
      min: salePrice,
      max: regPrice,
    };

  } else {
    const salePrice = Number(item?.sale_price) || 0;
    const regPrice = Number(item?.reg_price) || 0;

    if (regPrice == 0) {
      return {
        min: salePrice,
        max: 0,
      };
    }
    if (salePrice >= regPrice) {
      return {
        min: salePrice,
        max: 0,
      };
    }
    return {
      min: salePrice,
      max: regPrice,
    };
  }
};

export const PERMISSIONS = {

  HOME_VIEW: 'home:view',
  INVENTORY_VIEW: 'inventory:view',
  PRODUCTS_VIEW: 'products:view',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_EDIT: 'products:edit',
  PRODUCTS_DELETE: 'products:delete',
  PRODUCTS_DUPLICATE: 'products:duplicate',
  PRODUCTS_ACTION: 'products:action',

  CATEGORIES_VIEW: 'categories:view',
  CATEGORIES_CREATE: 'categories:create',
  CATEGORIES_EDIT: 'categories:edit',
  CATEGORIES_DELETE: 'categories:delete',
  CATEGORIES_ACTION: 'categories:action',

  BRANDS_VIEW: 'brands:view',
  BRANDS_CREATE: 'brands:create',
  BRANDS_EDIT: 'brands:edit',
  BRANDS_DELETE: 'brands:delete',
  BRAND_ACTION: 'brand:action',

  SUPPLIERS_VIEW: 'suppliers:view',
  SUPPLIERS_CREATE: 'suppliers:create',
  SUPPLIERS_EDIT: 'suppliers:edit',
  SUPPLIERS_DELETE: 'suppliers:delete',
  SUPPLIERS_ACTION: 'suppliers:action',

  MATERIALS_VIEW: 'materials:view',
  MATERIALS_CREATE: 'materials:create',
  MATERIALS_EDIT: 'materials:edit',
  MATERIALS_DELETE: 'materials:delete',
  MATERIALS_ACTION: 'materials:action',

  SIZE_CHARTS_VIEW: 'size_charts:view',
  SIZE_CHARTS_CREATE: 'size_charts:create',
  SIZE_CHARTS_CLONE: 'size_charts:clone',

  SIZE_CHARTS_EDIT: 'size_charts:edit',
  SIZE_CHARTS_DELETE: 'size_charts:delete',
  SIZE_CHARTS_ACTION: 'size_charts:action',

  MEDIA_VIEW: 'media:view',
  MEDIA_CREATE: 'media:create',
  MEDIA_DELETE: 'media:delete',
  MEDIA_ACTION: 'media:action',

  ATTRIBUTES_ACTION: 'attributes:action',
  ATTRIBUTES_VIEW: 'attributes:view',
  ATTRIBUTES_CREATE: 'attributes:create',
  ATTRIBUTES_EDIT: 'attributes:edit',
  ATTRIBUTES_DELETE: 'attributes:delete',
  ATTRIBUTES_ITEM_DELETE: 'attributes_item:delete',
  ATTRIBUTES_ITEM_ACTION: 'attributes_item:action',

  COUPONS_VIEW: 'coupons:view',
  COUPONS_CREATE: 'coupons:create',
  COUPONS_DELETE: 'coupons:delete',
  COUPONS_ACTION: 'coupons:action',

  ORDER_MENU: 'orders:menu',
  ORDERS_VIEW: 'orders:view',
  ORDERS_CREATE: 'orders:create',
  ORDERS_EDIT: 'orders:edit',
  ORDERS_CHANGE_STATUS: 'orders:change-status',
  ORDERS_DOWNLOAD_INVOICE: 'orders:download-invoice',
  ORDERS_ADD_ITEM: 'orders:add-item',
  ORDERS_MARK_AS_PAID: 'orders:mark-as-paid',
  ORDERS_ADD_NOTE: 'orders:add-note',
  ORDERS_CHANGE_ADDRESS: 'orders:change-address',
  ORDERS_ACTION: 'orders:action',

  STOCK_VIEW: 'stock:view',
  STOCK_UPDATE: 'stock:update',
  STOCK_ACTION: 'stock:action',

  ADMIN_USERS_VIEW: 'admin_users:view',
  ADMIN_USERS_CREATE: 'admin_users:create',

  ADMIN_USERS_EDIT: 'admin_users:edit',
  ADMIN_USERS_ACTION: 'admin_users:action',

  SLIDER_CREATE: 'slider:create',
  SLIDER_VIEW: 'slider:view',
  SLIDER_DELETE: 'slider:delete',
  SLIDER_ACTION: 'slider:action',
  SLIDER_EDIT: 'slider:edit',

  TRANSACTIONS_VIEW: 'transactions:view',

  REPORT_VIEW: 'report:view',
  REPORT_ACTION: 'report:action',

  ANALATICS_VIEW: 'analatics:view',
  CUSTOMER_VIEW: 'customer:view'
} as const;
