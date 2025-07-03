import { z } from "zod";

const billing_address_schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  companyName: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  addressLine1: z.string().min(1, "Street address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postcode is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  payment_methode: z.string().optional(),
  transaction_id: z.string().optional(),
});

const shipping_address_schema = z.object({
  fullName: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  email: z.string().email("Please enter a valid email address").optional(),
  addressLine1: z.string().min(1, "Street address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postcode is required"),
  phone: z.string().min(1, "Phone number is required"),
  note: z.string().optional(),
  courier: z.string().min(1, "Courier is required")
});
const new_order_schema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  
  addressLine1: z
    .string()
    .min(1, "Address line 1 is required")
    .max(200, "Address line 1 must be less than 200 characters"),
  
  addressLine2: z
    .string()
    .max(200, "Address line 2 must be less than 200 characters")
    .optional()
    .or(z.literal("")), // Allow empty string
  
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters"),
  
  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country must be less than 100 characters"),
  
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .max(20, "Postcode must be less than 20 characters"),
  
  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State must be less than 100 characters"),
  
  courier: z
    .string()
    .min(1, "Courier selection is required"),
  
  note: z
    .string()
    .max(500, "Note must be less than 500 characters")
    .optional()
    .or(z.literal("")), 
  
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  
  products: z
    .array(z.any())
    .min(1, "At least one product is required")
});

export {billing_address_schema ,shipping_address_schema,new_order_schema}