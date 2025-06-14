import { Product } from "./product.model";

export interface CartItem extends Product {
  checked?: boolean;
  amount?: number;
  total?: number;
  percent_discount?: number;
  size?: number;
  product_id?: number;
  product_properties_id?: number;
  price?: number;
  product?: Product;
  promotion_price?: number;
}

export interface Cart {
  id?: number;
  products?: CartItem[];
  amount?: number;
  total_price?: number;
  user_id?: number;
}

export interface AddItem {
  product_id?: number;
  size?: number;
  amount?: number;
}

export interface BodyAddItem {
  data?: AddItem[];
}

export interface UpdateCartItem {
  product_properties_id?: number;
  amount?: number;
}
