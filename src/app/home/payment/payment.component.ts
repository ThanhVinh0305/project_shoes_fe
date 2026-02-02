import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { ImportModule } from "../../@themes/import.theme";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Product } from "../../@core/models/product.model";
import { CartItem } from "../../@core/models/cart-item.model";
import { BaseComponent } from "../../@core/base/base.component";
import { Bill, CreateBillBody, CreateBillNowBody } from "../../@core/models/bill.model";
import { BillService } from "../../@services/bill.service";
import { BaseInputComponent } from "../../@components/base-input/base-input.component";
import { ImageUtil } from "../../@core/utils/image.util";
import { noImage } from "../../@core/constants/constant";
import { map } from "rxjs";
import { VnpayService } from "../../@services/vnpay.service";

export type PaymentMethod = 'cod' | 'vnpay';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  imports: [
    ImportModule,
    BaseInputComponent
  ]
})
export class PaymentComponent extends BaseComponent implements OnInit {
  private readonly billService = inject(BillService);
  private readonly vnpayService = inject(VnpayService);

  form!: FormGroup<{
    email: FormControl<string | null>;
    first_name: FormControl<string | null>;
    last_name: FormControl<string | null>;
    address: FormControl<string | null>;
    phone_number: FormControl<string | null>;
  }>;
  items = signal<CartItem[]>([]);
  totalAmount = computed(() => {
    return this.items().reduce((acc, cur) => {
      if (cur.price) {
        return acc + cur.price;
      }
      return acc;
    }, 0)
  });
  isBuyNow = false;
  noImage = noImage;

  // Payment method selection
  paymentMethod = signal<PaymentMethod>('cod');
  paymentMethods = [
    { value: 'cod' as PaymentMethod, label: 'Thanh toán khi nhận hàng (COD)', icon: 'pi pi-wallet' },
    { value: 'vnpay' as PaymentMethod, label: 'Thanh toán qua VNPay', icon: 'pi pi-credit-card' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.form.patchValue(this.currentUserBase || {});
    this.initData();
  }

  initForm() {
    this.form = this.fb.group({
      email: new FormControl<string | null>(null, [Validators.required]),
      first_name: new FormControl<string | null>(null, [Validators.required]),
      last_name: new FormControl<string | null>(null, [Validators.required]),
      address: new FormControl<string | null>(null, [Validators.required]),
      phone_number: new FormControl<string | null>(null, [Validators.required])
    })
  }

  initData() {
    this.rxSubscribe(this.cartService.getSelectItemObservable(), (items: CartItem[]) => {
      console.log(items);
      this.items.set(items.map(o => {
        if (o.product) {
          o.name = o.product.name;
          if ((o.product as any).thumbnail) {
            o.product.thumbnailImg = ImageUtil.replaceUrl((o.product as any).thumbnail);
          }
          o.product.images = o.product.images?.map(z => {
            z.attachment = z.attachment ? ImageUtil.replaceUrl(z.attachment) : noImage
            return z;
          })
        }
        return o;
      }));
    });
    this.rxSubscribe(this.activatedRoute.queryParams.pipe(
      map(params => params['isBuyNow'])
    ), (data) => {
      this.isBuyNow = data;
    })
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.paymentMethod.set(method);
  }

  createBill() {
    // Validate form first
    if (this.form.invalid) {
      this.messageService.showMessage({
        detail: 'Vui lòng điền đầy đủ thông tin.',
        severity: 'warning'
      });
      return;
    }

    // If VNPay selected, process VNPay payment
    if (this.paymentMethod() === 'vnpay') {
      this.processVnpayPayment();
      return;
    }

    // COD payment - existing logic
    if (this.isBuyNow) {
      const dataBody: CreateBillNowBody = {
        phone_number: this.form.getRawValue().phone_number || undefined,
        address: this.form.getRawValue().address || undefined,
        products: this.items().map(o => {
          o.product_id = o.product?.id;
          return o;
        })
      }
      this.rxSubscribe(this.billService.buyNow(dataBody), (result: Bill) => {
        this.messageService.showMessage({
          detail: 'Đặt hàng thành công.'
        });
        this.cartService.updateSelectItem([]);
        this.router.navigate(['/order-detail'], { queryParams: { id: result.id, isPayment: true } });
      });
      return;
    }
    const data: CreateBillBody = {
      phone_number: this.form.getRawValue().phone_number || undefined,
      address: this.form.getRawValue().address || undefined,
      product_properties_ids: this.items().map(o => o.product_properties_id || 0)
    }
    this.rxSubscribe(this.billService.createBill(data), (result: Bill) => {
      this.messageService.showMessage({
        detail: 'Đặt hàng thành công.'
      });
      this.cartService.updateSelectItem([]);
      this.cartService.getCartInfo();
      this.router.navigate(['/order-detail'], { queryParams: { id: result.id, isPayment: true } });
    })
  }

  /**
   * Process VNPay payment:
   * 1. Create bill first to get order ID
   * 2. Redirect to VNPay mock gateway
   */
  private processVnpayPayment(): void {
    if (this.isBuyNow) {
      const dataBody: CreateBillNowBody = {
        phone_number: this.form.getRawValue().phone_number || undefined,
        address: this.form.getRawValue().address || undefined,
        products: this.items().map(o => {
          o.product_id = o.product?.id;
          return o;
        })
      }
      this.rxSubscribe(this.billService.buyNow(dataBody), (result: Bill) => {
        this.redirectToVnpay(result);
      });
      return;
    }

    const data: CreateBillBody = {
      phone_number: this.form.getRawValue().phone_number || undefined,
      address: this.form.getRawValue().address || undefined,
      product_properties_ids: this.items().map(o => o.product_properties_id || 0)
    }
    this.rxSubscribe(this.billService.createBill(data), (result: Bill) => {
      this.cartService.getCartInfo();
      this.redirectToVnpay(result);
    });
  }

  private redirectToVnpay(bill: Bill): void {
    const orderId = bill.id?.toString() || Date.now().toString();
    const amount = this.totalAmount();
    const orderInfo = `Thanh toan don hang ${orderId}`;

    // Clear cart selection before redirecting
    this.cartService.updateSelectItem([]);

    // Redirect to VNPay mock gateway
    this.vnpayService.redirectToVnpay(orderId, amount, orderInfo);
  }

  goCart() {
    this.router.navigate(['/shopping-cart']);
  }
}
