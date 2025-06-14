import { Component } from "@angular/core";
import { MenuItem } from "primeng/api";
import { ImportModule } from "../../@themes/import.theme";

@Component({
  selector: 'app-guide-shopping',
  standalone: true,
  templateUrl: './guide-shopping.component.html',
  styleUrl: './guide-shopping.component.scss',
  imports: [
    ImportModule
  ]
})
export class GuideShoppingComponent {
  items: MenuItem[] = [
    { label: 'Hướng dẫn sử dụng' },
  ];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };
}