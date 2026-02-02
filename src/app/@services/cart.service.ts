import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { AddItem, Cart, CartItem, UpdateCartItem } from '../@core/models/cart-item.model';
import { HttpService } from './http.service';
import { MessagesService } from './message.service';
import { Router } from '@angular/router';

const SELECTED_ITEMS_KEY = 'vnpay_selected_items';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly httpService = inject(HttpService);
  private readonly messageService = inject(MessagesService);
  private readonly urlBase = '/api/v1/cart';
  private readonly cart$ = new BehaviorSubject<Cart | undefined>(undefined);
  private readonly selectItem$ = new BehaviorSubject<CartItem[]>(this.loadSelectedItemsFromStorage());

  private loadSelectedItemsFromStorage(): CartItem[] {
    try {
      const stored = sessionStorage.getItem(SELECTED_ITEMS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load selected items from storage', e);
    }
    return [];
  }

  private saveSelectedItemsToStorage(items: CartItem[]): void {
    try {
      if (items.length > 0) {
        sessionStorage.setItem(SELECTED_ITEMS_KEY, JSON.stringify(items));
      } else {
        sessionStorage.removeItem(SELECTED_ITEMS_KEY);
      }
    } catch (e) {
      console.error('Failed to save selected items to storage', e);
    }
  }

  getCartObervable() {
    return this.cart$.asObservable();
  }

  getSelectItemObservable() {
    return this.selectItem$.asObservable();
  }

  updateSelectItem(data: CartItem[]) {
    this.saveSelectedItemsToStorage(data);
    this.selectItem$.next(data);
  }

  clearSelectedItems() {
    sessionStorage.removeItem(SELECTED_ITEMS_KEY);
    this.selectItem$.next([]);
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
