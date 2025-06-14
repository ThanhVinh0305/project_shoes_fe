import { Component } from "@angular/core";
import { MenuItem } from "primeng/api";
import { ImportModule } from "../../@themes/import.theme";

@Component({
  selector: 'app-shipping-policy',
  standalone: true,
  templateUrl: './shipping-policy.component.html',
  styleUrl: './shipping-policy.component.scss',
  imports: [
    ImportModule
  ]
})
export class ShippingPolicyComponent {
  items: MenuItem[] = [
    { label: 'Chính sách vận chuyển' },
  ];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };
}