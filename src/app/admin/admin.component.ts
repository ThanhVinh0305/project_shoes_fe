import { Component, OnInit, ViewChild, model, signal } from "@angular/core";
import { ImportModule } from "../@themes/import.theme";
import { Sidebar } from "primeng/sidebar";
import { MenuItem } from "primeng/api";
import { BaseComponent } from "../@core/base/base.component";
import { pipe } from "rxjs";
import { NavigationEnd } from "@angular/router";
import { User } from "../@core/models/auth.model";
import { Menu } from "../@components/header/header.component";
import { MenuModule } from "primeng/menu";

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  imports: [
    ImportModule,
    MenuModule,
  ]
})
export class AdminComponent extends BaseComponent implements OnInit {
  sidebarVisible = true;
  sidebarVisibleUser = false;
  items = signal<MenuItem[]>([]);
  home: MenuItem = {
    icon: 'pi pi-home', routerLink: '/home'
  }
  currentUser = signal<User | undefined>(undefined);
  menus: Menu[] = [
    {
      icon: 'pi pi-user',
      label: 'Thông tin cá nhân',
      routerLink: '/profile',
      command: () => {}
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
      }
    }
  ];

  ngOnInit(): void {
    this.initData();
    // this.rxSubscribe(this.router.events, (e) => {
    //   if (e instanceof NavigationEnd) {
    //     this.breadcrumbService.calculateBreadCrumb(this.router.url);
    //   }
    // });
    this.rxSubscribe(this.authenticationService.getCurrentUserObservable(), (currentUser) => {
      this.currentUser.set(currentUser);
    })
  }

  initData() {
    this.rxSubscribe(this.breadcrumbService.getAsObervable(), (breadcrumbs: MenuItem[]) => {
      this.items.set(breadcrumbs);
    })
  }

  onClick(command: (() => void) | undefined) {
    if (command) {
      command();
    }
  }
}
