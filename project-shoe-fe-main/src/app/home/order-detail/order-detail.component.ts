import { Component, HostListener, OnInit, computed, inject, signal } from "@angular/core";
import { ImportModule } from "../../@themes/import.theme";
import { CartItem } from "../../@core/models/cart-item.model";
import { Order } from "../../@core/models/order.model";
import { BaseComponent } from "../../@core/base/base.component";
import { map, of, switchMap } from "rxjs";
import { BillService } from "../../@services/bill.service";
import { Bill } from "../../@core/models/bill.model";
import { ImageUtil } from "../../@core/utils/image.util";
import { noImage } from "../../@core/constants/constant";

@Component({
  selector: 'app-order-detail',
  standalone: true,
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
  imports: [
    ImportModule
  ]
})
export class OrderDetailComponent extends BaseComponent implements OnInit {
  private readonly billService = inject(BillService);
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth.set(window.innerWidth);
  }
  innerWidth = signal(0);
  items = signal<CartItem[]>([]);
  totalAmount = computed(() => {
    return this.items().reduce((acc, cur) => {
      if (cur.total) {
        return acc + cur.total;
      }
      return acc;
    }, 0)
  })
  id?: number;
  isPayment = signal(false);
  bill = signal<Bill | undefined>(undefined);
  noImage = noImage;

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.rxSubscribe(this.activatedRoute.queryParams.pipe(
      map(params => {
        this.isPayment.set(params['isPayment'] ?? false);
        return params['id'];
      }),
      switchMap(id => {
        if (id) {
          this.id = id;
          return this.billService.getBillById(id);
        }
        return of();
      })
    ), (result: Bill) => {
      result.products?.forEach(o => {
        o.images = o.images?.map(z => {
          z.attachment = z.attachment ? ImageUtil.replaceUrl(z.attachment) : noImage;
          return z;
        })
      })
      this.bill.set(result);
    })
  }

  goHome() {
    this.router.navigate(['/'])
  }
}
