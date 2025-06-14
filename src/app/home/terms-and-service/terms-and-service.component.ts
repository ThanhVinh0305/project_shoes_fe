import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImportModule } from '../../@themes/import.theme';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-terms-and-service',
  standalone: true,
  imports: [
    ImportModule
  ],
  templateUrl: './terms-and-service.component.html',
  styleUrl: './terms-and-service.component.scss',
})
export class TermsAndServiceComponent {
  items: MenuItem[] = [
    { label: 'Điều khoản và dịch vụ' },
  ];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };
}
