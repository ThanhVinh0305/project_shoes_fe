import { Component } from "@angular/core";
import { ImportModule } from "../../@themes/import.theme";
import { MenuItem } from "primeng/api";

@Component({
  selector: 'app-warranty-policy',
  standalone: true,
  templateUrl: './warranty-policy.component.html',
  styleUrl: './warranty-policy.component.scss',
  imports: [
    ImportModule
  ]
})
export class WarrantyPolicyComponent {
  items: MenuItem[] = [
    { label: 'Chính sách bảo hành sản phẩm' },
  ];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };
}