import { CartItem } from "./cart-item.model";

export interface Order {
  id?: number;
  items?: CartItem[];
  totalAmount?: number;
  totalCount?: number;
  phone?: string;
  email?: string;
  address?: string;
  fullName?: string;
  createdDate?: Date;
  deliveryDate?: Date;
}