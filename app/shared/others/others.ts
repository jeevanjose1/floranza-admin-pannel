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
      invoice: false,
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
        { value: "4", label: "Completed" },
        { value: "7", label: "Canceled" },
        { value: "5", label: "Hold" },
      ],
      invoice: true,
    },
    "4": { updates: [], invoice: true },
    "5": {
      updates: [
        { value: "2", label: "Action Taken" },
        { value: "7", label: "Canceled" },
      ],
      invoice: true,
    },
    "6": { updates: [], invoice: true },
    "7": { updates: [], invoice: false },
    "8": { updates: [], invoice: false },
    "9": {
      updates: [
        { value: "2", label: "Action Taken" },
        { value: "5", label: "Hold" },
      ],
      invoice: true,
    },
    "10": {
      updates: [
        { value: "2", label: "Action Taken" },
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
    name: "Shipping",
    color: "bg-purple-50 text-purple-600 border-purple-300",
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


export   const courier = [
    {
      value: "DTDC",
      label: "DTDC",
    },
    {
      value: "INDIA_POST",
      label: "Indian Post",
    },
  ];

  export const calculate_product_price = (item: any,index?:number) => {
  const isVariation = item?.is_variation;
 
  if (isVariation) {
    const variation = item?.variations?.[index ? index:0];
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