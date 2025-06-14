import { Product } from "./product.model";
import { Supplier } from "./supplier.model";

export interface ImportCoupon {
  id?: number;
  description?: string;
  brand_id?: number;
  product_amounts?: ProductAmounts[];
  brand?: Supplier;
  status?: number;
  username?: string;
  import_user_id?: number;
  imported_time?: Date;
  is_confirm?: boolean;
  products?: ProductAmounts[];
  created_by?: string;
  confirm_by?: string;
}

export interface ProductAmounts {
  product_id?: number;
  product?: Product;
  amount?: number;
  size?: number;
  import_cost?: number;
  product_properties_id?: number;
}

export interface ParamsPage {
  page?: number;
  size?: number;
}
