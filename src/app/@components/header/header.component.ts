import { Component, OnInit, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from "primeng/badge";
import { MenuModule } from "primeng/menu";
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { BaseComponent } from '../../@core/base/base.component';
import { User } from '../../@core/models/auth.model';
import { ImportModule } from '../../@themes/import.theme';
import { Cart } from '../../@core/models/cart-item.model';
import { CategoryService } from '../../@services/category.service';
import { Category } from '../../@core/models/product.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    BadgeModule,
    MenuModule,
    ImportModule,
    FormsModule,
    InputTextModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent extends BaseComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  currentUser = signal<User | undefined>(undefined);
  cart  = signal<Cart | undefined>(undefined);
  items: MenuItem[] = [
    { label: 'Dày da nam'},
    { label: 'Dày da nữ'},
  ]
  sidebarVisible = false;
  menus: Menu[] = [
    {
      icon: 'pi pi-user',
      label: 'Thông tin cá nhân',
      routerLink: '/profile',
      command: () => {}
    },
    {
      icon: 'pi pi-user',
      label: 'Lịch sử mua hàng',
      routerLink: '/order-history',
      command: () => {
        this.sidebarVisible = false;
      }
    },
    {
      icon: 'pi pi-user',
      label: 'Đổi mật khẩu',
      routerLink: '/change-password',
    },
    {
      icon: 'pi pi-sign-out',
      label: 'Đăng xuất',
      routerLink: '',
      command: () => {
        this.authenticationService.logout(this.router);
        this.sidebarVisible = false;
      }
    }
  ];
  categories = signal<Category[]>([]);
  searchText = '';

  ngOnInit(): void {
    this.rxSubscribe(this.authenticationService.getCurrentUserObservable(), (currentUser) => {
      this.currentUser.set(currentUser);
      if (this.currentUser()) {
        this.cartService.getCartInfo();
      }
    });
    this.rxSubscribe(this.cartService.getCartObervable(),  (cart: Cart | undefined) => {
      this.cart.set(cart);
    });
    this.rxSubscribe(this.categoryService.getAllCategory(), (categories) => {
      this.categories.set(categories);
    })
  }

  goCart() {
    if (!this.cart()) {
      this.rxSubscribe(this.confirmDialog.showDialog({
        confirmText: 'Vui lòng đăng nhập để xem thông tin giỏ hàng. Bạn có muốn đăng nhập ?'
      }), (confirm) => {
        if (confirm) {
          this.currentUrl = this.router.url;
          this.router.navigate(['login']);
        }
      })
      return;
    }
    this.router.navigate(['/shopping-cart'])
  }

  onClick(command: (() => void) | undefined) {
    if (command) {
      command();
    }
  }

  onSearch() {
    if (this.searchText.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { name: this.searchText.trim() }
      });
    }
  }
}

export interface Menu {
  icon: string;
  label: string;
  routerLink: string;
  command?: () => void
}
