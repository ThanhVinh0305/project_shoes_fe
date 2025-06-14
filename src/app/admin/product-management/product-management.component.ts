import { Component, inject, OnInit, signal } from '@angular/core';
import { TablePageEvent } from 'primeng/table';
import { environment } from '../../../environments/environment';
import { BaseComponent } from '../../@core/base/base.component';
import { ProductService } from '../../@services/product.service';
import { ImportModule } from '../../@themes/import.theme';
import { BasePageResponse, ParamSearch, Product } from './../../@core/models/product.model';

@Component({
  selector: 'app-product-management',
  standalone: true,
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss',
  imports: [
    ImportModule
  ]
})
export class ProductManagement extends BaseComponent implements OnInit {
  private readonly productService = inject(ProductService);
  products = signal<Product[]>([]);
  rowsPerPageOptions = signal([2, 15 , 20, 30]);
  first = signal(0);
  rows = signal(this.rowsPerPageOptions()[0]);
  totalRecords = signal(0);
  params: ParamSearch = {
    page: this.first() + 1,
    size: this.rows()
  }

  ngOnInit(): void {
    this.initData(this.params);
  }

  initData(paramSearch: ParamSearch) {
    this.rxSubscribe(this.productService.getProducts(paramSearch), (result: BasePageResponse<Product>) => {
      this.products.set(result.data?.map(o => {
        return {
          ...o,
          images: o.images?.map(z => {
            return {
              ...z,
              attachment: z.attachment?.replace(/minio/g, environment.baseApi)
            }
          })
        }
      }) || []);
      this.totalRecords.set(result.total ?? 0);
    })
  }

  pageChange(event: TablePageEvent) {
    this.first.set(event.first);
    this.rows.set(event.rows);
    this.params.page = Math.floor(this.first() / this.rows()) + 1;
    this.params.size = this.rows();
    this.initData(this.params);
  }

  goAddProduct() {
    this.router.navigate(['/admin/product-management/update-product']);
  }

  onEdit(id: number) {
    this.router.navigate(['/admin/product-management/update-product'], { queryParams: { id: id } })
  }

  onDelete(id: number) {
    this.rxSubscribe(this.confirmDelete.showDelete(), (confirm) => {
      if (confirm) {
        this.rxSubscribe(this.productService.deleteProduct(id), () => {
          this.messageService.showMessage({
            detail: 'Xóa sản phẩm thành công.'
          })
          this.initData(this.params);
        })
      }
    })
  }
}
