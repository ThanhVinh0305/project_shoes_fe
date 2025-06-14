import { ProductReview } from "./product.model";

export interface CustomerReview extends ProductReview{
  major?: string;
  image?: string;
}
