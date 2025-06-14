import { noImage } from './../../@core/constants/constant';
import { BillService } from './../../@services/bill.service';
import { Component, inject, OnInit, signal } from "@angular/core";
import { Order } from "../../@core/models/order.model";
import { ImportModule } from "../../@themes/import.theme";
import { BaseComponent } from "../../@core/base/base.component";
import { BasePage, Bill } from '../../@core/models/bill.model';
import { BasePageResponse } from '../../@core/models/product.model';
import { rowsPerPageOptions } from '../../@core/constants/constant';
import { CartItem } from '../../@core/models/cart-item.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss',
  imports: [
    ImportModule
  ]
})
export class OrderHistoryComponent extends BaseComponent implements OnInit {
  private readonly billService = inject(BillService);
  orders = signal<Bill[]>([]);
  first = signal(0);
  rows = signal(10);
  rowsPerPageOptions = rowsPerPageOptions;
  params: BasePage = {
    page: this.first() + 1,
    size: this.rows()
  }
  totalRecords = signal(0);
  noImage = noImage;

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.rxSubscribe(this.billService.getBills(this.params), (result: BasePageResponse<Bill>) => {
      this.orders.set(result.data || []);
      this.totalRecords.set(result.total || 0);
    })
  }

  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  goPayment(item: CartItem) {
    const cartItem: CartItem = {
      product: item.product,
      amount: item.amount,
      size: item.size,
      name: item.product?.name,
      promotion_price: item.promotion_price,
      price: item.product?.promotion_price || item.product?.price
    }
    this.cartService.updateSelectItem([cartItem]);
    this.router.navigate(['/payment'], { queryParams: { isBuyNow: true}});
  }

  onRepurchase(item: Bill) {
    this.cartService.updateSelectItem(item.products?.map(item => {
      return {
        product: item.product,
        amount: item.amount,
        size: item.size,
        name: item.product?.name,
        promotion_price: item.promotion_price,
        price: item.price
      }
    }) || []);
    this.router.navigate(['/payment'], { queryParams: { isBuyNow: true}});
  }

  onGoDetail(id: number | undefined) {
    if (id) {
      this.router.navigate(['/order-detail'], { queryParams: { id } });
    }
  }
}
