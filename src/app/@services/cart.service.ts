import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { AddItem, Cart, CartItem, UpdateCartItem } from '../@core/models/cart-item.model';
import { HttpService } from './http.service';
import { MessagesService } from './message.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly httpService = inject(HttpService);
  private readonly messageService = inject(MessagesService);
  private readonly urlBase = '/api/v1/cart';
  private readonly cart$ = new BehaviorSubject<Cart | undefined>(undefined);
  private readonly selectItem$ = new BehaviorSubject<CartItem[]>([]);

  getCartObervable() {
    return this.cart$.asObservable();
  }

  getSelectItemObservable() {
    return this.selectItem$.asObservable();
  }

  updateSelectItem(data: CartItem[]) {
    this.selectItem$.next(data);
  }

  getCartInfo() {
    this.httpService.get(this.urlBase).pipe(
      map(res => res.data)
    ).subscribe(cart => {
      this.cart$.next(cart);
    });
  }

  addItem(data: AddItem, router: Router) {
    const url = this.urlBase + '/add';
    this.httpService.post(url, { data: data }).subscribe(() => {
      this.messageService.showMessage({
        detail: 'Thêm sản phẩm vào giỏ hàng thành công.'
      });
      this.getCartInfo();
      router.navigate(['/products']);
    })
  }

  updateItem(data: UpdateCartItem) {
    const url = this.urlBase + '/update';
    this.httpService.put(url, { data: data }).subscribe(() => {
      this.messageService.showMessage({
        detail: 'Thay đổi số lượng sản phẩm thành công.'
      });
      this.getCartInfo();
    })
  }

  deleteItem(id: number) {
    const url = this.urlBase + `/delete/${id}`;
    this.httpService.delete(url).subscribe(() => {
      this.messageService.showMessage({
        detail: 'Xóa sản phẩm thành công.'
      });
      this.getCartInfo();
    })
  }
}
