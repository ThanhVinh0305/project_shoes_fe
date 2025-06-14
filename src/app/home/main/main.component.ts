import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CustomerReviewComponent } from '../../@components/customer-reviews/customer-review.component';
import { BaseComponent } from '../../@core/base/base.component';
import { BasePageResponse, Category, Product } from '../../@core/models/product.model';
import { ProductsOtherComponent } from '../products-other/products-other.component';
import { ImageUtil } from '../../@core/utils/image.util';
import { noImage } from '../../@core/constants/constant';
import { ProductService } from '../../@services/product.service';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../@services/category.service';

@Component({
  selector: 'app-main',
  templateUrl: "./main.component.html",
  standalone: true,
  styleUrl: './main.component.scss',
  imports: [
    NgOptimizedImage,
    ProductsOtherComponent,
    CustomerReviewComponent,
    RouterLink
  ]
})
export class MainComponent extends BaseComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  productSell = signal<Product[]>([]);
  productPromotions = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.rxSubscribe(this.categoryService.getAllCategory(), (data: Category[]) => {
      this.categories.set(data.map(o => {
        return {
          ...o,
          image: o.image ? ImageUtil.replaceUrl(o.image) : noImage
        }
      }));
    })
    this.rxSubscribe(this.productService.getProducts({ page: 1, size: 8 }), (result: BasePageResponse<Product>) => {
      this.productSell.set(result.data?.map(o => {
        return {
          ...o,
          images: o.images?.map(z => {
            return {
              ...z,
              attachment: z.attachment ? ImageUtil.replaceUrl(z.attachment) : noImage
            }
          })
        }
      }) || [])
    })
    this.rxSubscribe(this.productService.getProducts({ page: 1, size: 8, is_promoted: true }), (result: BasePageResponse<Product>) => {
      this.productPromotions.set(result.data?.map(o => {
        return {
          ...o,
          images: o.images?.map(z => {
            return {
              ...z,
              attachment: z.attachment ? ImageUtil.replaceUrl(z.attachment) : noImage
            }
          })
        }
      }) || [])
    })
  }
}
