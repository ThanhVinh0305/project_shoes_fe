import { Component, inject, OnInit, signal } from '@angular/core';
import { ImportModule } from '../../@themes/import.theme';
import { BaseComponent } from '../../@core/base/base.component';
import { ProductService } from '../../@services/product.service';
import { BasePageResponse, ParamSearch, Product } from '../../@core/models/product.model';
import { environment } from '../../../environments/environment';
import { TablePageEvent } from 'primeng/table';
import { WareHouse } from '../../@core/models/ware-house.model';

@Component({
  selector: 'app-ware-house',
  standalone: true,
  imports: [
    ImportModule
  ],
  templateUrl: './ware-house.component.html',
  styleUrl: './ware-house.component.scss'
})
export class WareHouseComponent extends BaseComponent implements OnInit {
  private readonly productService = inject(ProductService);
  warehouse = signal<WareHouse[]>([]);
  rowsPerPageOptions = signal([10, 15 , 20, 30]);
  first = signal(0);
  rows = signal(0);
  totalRecords = signal(0);
  params: ParamSearch = {
    page: this.first() + 1,
    size: 3000000
  }

  ngOnInit(): void {
    this.initData(this.params);
  }

  initData(paramSearch: ParamSearch) {
    this.rxSubscribe(this.productService.getProducts(paramSearch), (result: BasePageResponse<Product>) => {
      result.data?.forEach((o, index) => {
        if (o.sizes?.length) {
          o.sizes.forEach(z => {
            const obj: WareHouse = {
              name: o.name,
              size: z.size,
              amount: z.amount
            };
            this.warehouse.update(arr => {
              arr.push(obj);
              return arr;
            })
          })
        }
      });
      this.rows.set(this.warehouse().length)
    })
  }

  pageChange(event: TablePageEvent) {
    this.first.set(event.first);
    this.params.page = Math.floor(this.first() / this.rows()) + 1
    this.initData(this.params);
  }
}
