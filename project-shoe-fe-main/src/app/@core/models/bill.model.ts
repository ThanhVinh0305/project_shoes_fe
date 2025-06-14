import { AddItem, CartItem } from "./cart-item.model";

export interface CreateBillBody {
  address?: string;
  phone_number?: string;
  product_properties_ids?: number[]
}

export interface CreateBillNowBody {
  address?: string;
  phone_number?: string;
  products?: AddItem[];
}

export interface BasePage {
  page?: number;
  size?: number;
}

export interface Bill {
  id?: number;
  created_date?: string;
  status?: number;
  address?: string;
  phone_number?: string;
  total?: number;
  products?: CartItem[];
  statusText?: string;
}
