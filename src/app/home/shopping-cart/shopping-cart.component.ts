import { Component, OnInit, computed, model, signal } from "@angular/core";
import { Cart, CartItem } from "../../@core/models/cart-item.model";
import { InputNumberModule } from "primeng/inputnumber";
import { FormsModule } from "@angular/forms";
import { ImportModule } from "../../@themes/import.theme";
import { BaseComponent } from "../../@core/base/base.component";
import { Product } from "../../@core/models/product.model";
import { Subscription } from "rxjs";
import { MenuItem } from "primeng/api";
import { ImageUtil } from "../../@core/utils/image.util";
import { noImage } from "../../@core/constants/constant";

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
  imports: [
    InputNumberModule,
    FormsModule,
    ImportModule
  ]
})
export class ShoppingCartComponent extends BaseComponent implements OnInit {
  cart = signal<Cart>({});
  totalQuantity = signal(0);
  totalAmount = signal(0);
  private subscription!: Subscription;
  items = signal<MenuItem[]>([]);
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };
  selectItems: CartItem[] = [];
  noImage = noImage;

  ngOnInit(): void {
    this.rxSubscribe(this.breadcrumbService.getAsObervable(), (value: MenuItem[]) => {
      this.items.set(value);
    });
    this.subscription = this.rxSubscribe(this.cartService.getCartObervable(), (cart: Cart | undefined) => {
      if (cart) {
        cart.products = cart.products?.map(o => {
          if (o.product) {
            o.product.images = o.product?.images?.map(z => {
              z.attachment = z.attachment ? ImageUtil.replaceUrl(z.attachment) : noImage;
              return z;
            })
          }
          return o;
        })
        this.cart.set(cart);
      }
    });
    this.cartService.getCartInfo();
  }

  changeSelectItem() {
    this.selectItems = this.cart().products?.filter(o => o.checked) || [];
    this.totalQuantity.set(this.selectItems?.length || 0);
    this.totalAmount.set(this.selectItems?.reduce((acc, cur) => {
      if (cur.price) {
        return acc + cur.price;
      }
      return acc;
    }, 0) || 0);
  }

  onChangeQuantity(item: CartItem) {
    this.cartService.updateItem({
      product_properties_id: item.product_properties_id,
      amount: item.amount
    });
  }

  deleteItem(id: number | undefined) {
    this.rxSubscribe(this.confirmDelete.showDelete(), (confirm) => {
      if (confirm) {
        if (id) {
          this.cartService.deleteItem(id);
        }
      }
    })
  }

  onGoPayment() {
    this.cartService.updateSelectItem(this.selectItems);
    this.router.navigate(['/payment'])
  }

  override ngOnDestroy(): void {
    this.rxUnSubscribe(this.subscription)
  }
}
