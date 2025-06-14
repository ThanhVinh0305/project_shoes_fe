import { Component } from "@angular/core";
import { MenuItem } from "primeng/api";
import { ImportModule } from "../../@themes/import.theme";

@Component({
  selector: 'app-refund-policy',
  standalone: true,
  templateUrl: './refund-policy.component.html',
  styleUrl: './refund-policy.component.scss',
  imports: [
    ImportModule
  ]
})
export class RefundPolicyComponent {
  items: MenuItem[] = [
    { label: 'Chính sách đổi trả hàng' },
  ];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };
}