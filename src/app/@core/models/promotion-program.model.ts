import { Product } from "./product.model";

export interface PromotionProgram {
  id?: number;
  promotion_name?: string;
  start_date?: string;
  end_date?: string;
  product_ids?: number[];
  percent_discount?: number;
  products?: Product[];
}

export interface PromotionParamSearch {
  keyword?: string;
  page?: number;
  size?: number;
}

