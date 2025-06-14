import { Supplier } from "./supplier.model";

export interface Product {
  id?: number;
  name?: string;
  description?: string;
  rate?: number;
  price?: number;
  images?: Image[];
  brand?: Supplier;
  categories?: Category[];
  reviews?: ProductReview[];
  sizes?: Size[];
  thumbnailImg?: string;
  brand_id?: number;
  promotion_price?: number;
  percent_discount?: number;
  is_promotion?: boolean;
  product_properties_id?: number;
}

export interface Image {
  id?: number;
  product_id?: number;
  attachment?: string;
}

export interface Size {
  id?: number,
  size?: number,
  amount?: number;
}

export interface Brand {
  id?: string;
  name?: string;
  description?: string;
}

export interface Category {
  id?: number;
  name?: string;
  router_link?: string;
  image?: string;
}

export interface ProductReview {
  id?: number;
  name?: string;
  comment?: string;
  createdDate?: Date;
  rate?: number;
}

export interface ParamSearch {
  name?: string;
  code?: string;
  brands?: number[];
  categories?: number[];
  min_cost?: number;
  max_cost?: number;
  page?: number;
  size?: number;
  is_promoted?: boolean;
}

export interface BasePageResponse<T> {
  total?: number;
  data?: T[];
}

export interface Size {
  id?: number;
  size?: number;
  amount?: number;
}
