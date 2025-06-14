import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Button } from 'primeng/button';

import { CustomerReviewComponent } from '../@components/customer-reviews/customer-review.component';
import { FooterComponent } from '../@components/footer/footer.component';
import { HeaderComponent } from '../@components/header/header.component';
import { WarrantyComponent } from '../@components/warranty/warranty.component';
import { BaseComponent } from '../@core/base/base.component';
import { MainComponent } from './main/main.component';
import { ProductListComponent } from './product-list/product-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    Button,
    HeaderComponent,
    MainComponent,
    ProductListComponent,
    RouterModule,
    NgOptimizedImage,
    CustomerReviewComponent,
    FooterComponent,
    WarrantyComponent
  ]
})
export class HomeComponent extends BaseComponent {

}
